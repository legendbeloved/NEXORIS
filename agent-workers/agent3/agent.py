import logging
from typing import Optional

from database import Database
from models import Agent3Config, ConversationMessage, NegotiationResult, Prospect
from services.booking import BookingService
from services.delivery import DeliveryService
from services.negotiator import Negotiator
from services.payment import PaymentService
from services.reply_classifier import ReplyClassifier
from services.responder import Responder


class Agent3:
    """
    Agent 3 — Negotiation & Delivery Engine.

    This worker responds to client messages, negotiates price within guardrails,
    books meetings via Cal.com, and generates payment links via Stripe.
    """

    def __init__(self) -> None:
        self.db = Database()
        self.classifier = ReplyClassifier()
        self.negotiator = Negotiator()
        self.booking = BookingService()
        self.payment = PaymentService()
        self.delivery = DeliveryService()
        self.responder = Responder(self.db)
        self.logger = logging.getLogger("agent3")

    async def process_reply(
        self,
        prospect_id: int,
        owner_id: Optional[str] = None,
        message: Optional[str] = None,
        channel: str = "email",
    ) -> None:
        """
        Process the latest client reply for a prospect.

        - If `message` is provided, we store it as the latest client message first.
        - Then we load history, classify intent, and respond accordingly.
        """
        prospect = await self.db.get_prospect(prospect_id)
        if not prospect:
            return

        cfg = await self.db.get_agent_config(owner_id)

        await self.db.insert_agent_log(owner_id, "REPLY_RECEIVED", "RUNNING", prospect_id, {"channel": channel})

        # If the API caller supplied a message directly, persist it first.
        if message:
            await self.db.insert_conversation_message(
                ConversationMessage(
                    prospect_id=prospect_id,
                    sender="CLIENT",
                    channel=channel.upper(),
                    message=message,
                )
            )

        history = await self.db.get_conversation_history(prospect_id)
        latest = self._latest_client_message(history)
        if not latest:
            await self.db.insert_agent_log(owner_id, "NO_CLIENT_MESSAGE", "SKIPPED", prospect_id)
            return

        intent = await self.classifier.classify(latest.message, history)
        await self.db.insert_agent_log(owner_id, "INTENT_CLASSIFIED", "SUCCESS", prospect_id, {"intent": intent})

        # Route by intent
        if intent == "NOT_INTERESTED":
            await self.db.update_prospect_status(prospect_id, "DECLINED")
            await self.db.insert_agent_log(owner_id, "REPLY_DECLINED", "SUCCESS", prospect_id)
            await self.db.insert_notification(
                owner_id,
                notif_type="DEAL_DECLINED",
                title=f"{prospect.business_name} declined",
                message="Prospect is not interested.",
                prospect_id=prospect_id,
                priority="LOW",
                requires_action=False,
            )
            return

        if intent == "MEETING_REQUEST":
            await self._handle_meeting_request(owner_id, prospect, cfg)
            return

        # For INTERESTED / PRICE_OBJECTION / QUESTION / ALREADY_HAS_SERVICE, negotiate and reply
        result = await self.negotiator.respond(prospect, history, cfg, intent=intent)
        await self.db.insert_agent_log(owner_id, "NEGOTIATION_RESPONSE", "SUCCESS", prospect_id, {"action": result.action})

        await self.responder.send(result.response, prospect)

        if result.action.lower() == "book_meeting":
            await self._handle_meeting_request(owner_id, prospect, cfg)
            return

        if result.action.lower() == "declined":
            await self.db.update_prospect_status(prospect_id, "DECLINED")
            await self.db.insert_notification(
                owner_id,
                notif_type="DEAL_DECLINED",
                title=f"{prospect.business_name} declined",
                message="Agent 3 marked this prospect as declined based on reply.",
                prospect_id=prospect_id,
                priority="LOW",
                requires_action=False,
            )
            return

        if result.action.lower() == "escalate":
            await self.db.insert_notification(
                owner_id,
                notif_type="AGENT_NEEDS_APPROVAL",
                title=f"Agent 3 needs approval: {prospect.business_name}",
                message=result.escalation_reason or "Escalation required.",
                prospect_id=prospect_id,
                priority="HIGH",
                requires_action=True,
            )
            return

        if result.action.lower() == "agreed":
            await self._handle_agreement(owner_id, prospect, cfg, result)
            return

    async def _handle_meeting_request(self, owner_id: Optional[str], prospect: Prospect, cfg: Agent3Config) -> None:
        """
        Book a meeting via Cal.com and notify owner.
        """
        booking = await self.booking.book(prospect, cfg)

        if booking.status == "success":
            await self.db.insert_notification(
                owner_id,
                notif_type="MEETING_BOOKED",
                title=f"Meeting booked with {prospect.business_name}",
                message="Cal.com booking created successfully.",
                prospect_id=prospect.id,
                priority="MEDIUM",
                requires_action=False,
            )
            await self.responder.send(
                "Perfect — I’ve queued up a quick strategy call. If you don’t see a confirmation yet, reply here and I’ll resend the booking details.",
                prospect,
            )
        else:
            await self.db.insert_notification(
                owner_id,
                notif_type="MEETING_BOOKING_FAILED",
                title=f"Booking failed: {prospect.business_name}",
                message=str(booking.details),
                prospect_id=prospect.id,
                priority="HIGH",
                requires_action=True,
            )

        await self.db.insert_agent_log(owner_id, "BOOK_MEETING", booking.status.upper(), prospect.id, booking.details)

    async def _handle_agreement(self, owner_id: Optional[str], prospect: Prospect, cfg: Agent3Config, result: NegotiationResult) -> None:
        """
        Create a project + Stripe payment link, send to client, and notify owner.
        """
        amount = int(result.agreed_price or cfg.min_price)
        service_name = result.service_name or prospect.recommended_service or cfg.default_service

        project_id = await self.db.create_project(
            prospect_id=prospect.id,
            service_type=service_name,
            title=f"{service_name.title()} for {prospect.business_name}",
        )
        if not project_id:
            await self.db.insert_agent_log(owner_id, "CREATE_PROJECT", "ERROR", prospect.id)
            await self.db.insert_notification(
                owner_id,
                notif_type="PROJECT_CREATE_FAILED",
                title=f"Project creation failed: {prospect.business_name}",
                message="Could not create a project record in Supabase.",
                prospect_id=prospect.id,
                priority="HIGH",
                requires_action=True,
            )
            return

        link = await self.payment.create_link(prospect, project_id, amount, service_name=service_name)
        if not link:
            await self.db.insert_agent_log(owner_id, "CREATE_PAYMENT_LINK", "ERROR", prospect.id)
            await self.db.insert_notification(
                owner_id,
                notif_type="PAYMENT_LINK_FAILED",
                title=f"Stripe link failed: {prospect.business_name}",
                message="Could not create Stripe checkout session.",
                prospect_id=prospect.id,
                priority="HIGH",
                requires_action=True,
            )
            return

        await self.db.create_payment(prospect.id, project_id, link.id, link.url, amount)
        await self.db.update_prospect_status(prospect.id, "AGREED")

        await self.responder.send(
            f"Great — we’re aligned. Here’s the secure payment link to kick off:\n{link.url}\n\nOnce payment is completed, we’ll start immediately.",
            prospect,
            subject=f"Payment link — {service_name.title()}",
        )

        await self.db.insert_notification(
            owner_id,
            notif_type="DEAL_AGREED",
            title=f"Deal agreed with {prospect.business_name} for ${amount}",
            message="Payment link sent to client.",
            prospect_id=prospect.id,
            priority="HIGH",
            requires_action=False,
        )

        await self.db.insert_agent_log(owner_id, "HANDLE_AGREEMENT", "SUCCESS", prospect.id, {"project_id": project_id, "stripe_session_id": link.id})

    def _latest_client_message(self, history: list[ConversationMessage]) -> Optional[ConversationMessage]:
        """
        Find the newest client message in a conversation.
        """
        for msg in reversed(history):
            if (msg.sender or "").upper() in {"CLIENT", "USER"}:
                return msg
        return None

