import json
import logging
from typing import List

import google.generativeai as genai

from config import Config
from models import Agent3Config, ConversationMessage, NegotiationResult, Prospect


class Negotiator:
    """
    Negotiation brain for Agent 3.

    Produces a structured JSON output so downstream actions are deterministic.
    """

    def __init__(self) -> None:
        genai.configure(api_key=Config.GOOGLE_AI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.logger = logging.getLogger("agent3.negotiator")

    async def respond(self, prospect: Prospect, history: List[ConversationMessage], cfg: Agent3Config, intent: str) -> NegotiationResult:
        """
        Generate a negotiation response within guardrails.
        """
        services_json = json.dumps([s.model_dump() for s in cfg.services])
        history_text = "\n".join([f"{m.sender}: {m.message}" for m in history[-20:]])

        system_prompt = f"""
You are Agent 3 for NEXORIS. You negotiate professionally and stay within guardrails.

Guardrails:
- Minimum price: {cfg.min_price}
- Max discount %: {cfg.max_discount_pct}
- Max rounds: {cfg.max_rounds}
- Services: {services_json}

Return ONLY valid JSON with keys:
response (string),
action (one of: reply, agreed, book_meeting, escalate, declined),
agreed_price (number or null),
service_name (string or null),
escalation_reason (string or null)
""".strip()

        user_prompt = f"""
Prospect: {prospect.business_name} ({prospect.category or "General"}) in {prospect.city or "Unknown"}
Current status: {prospect.status or "UNKNOWN"}
Recommended service: {prospect.recommended_service or cfg.default_service}
Detected intent: {intent}

Conversation:
{history_text}

Write the next message. If they ask for a call, set action=book_meeting.
If they agree to proceed and a price is clear, set action=agreed and include agreed_price.
If they demand a price below minimum, set action=escalate and explain why.
If they are not interested, set action=declined.
""".strip()

        try:
            resp = self.model.generate_content(
                contents=[{"role": "user", "parts": [system_prompt, user_prompt]}],
                generation_config={"response_mime_type": "application/json", "temperature": 0.4, "max_output_tokens": 500},
            )
            data = json.loads(resp.text or "{}")
            result = NegotiationResult(
                response=str(data.get("response") or "").strip(),
                action=str(data.get("action") or "reply").strip(),
                agreed_price=data.get("agreed_price"),
                service_name=data.get("service_name"),
                escalation_reason=data.get("escalation_reason"),
            )
            return self._validate(result, cfg)
        except Exception as e:
            self.logger.error(f"Negotiation generation failed: {e}")
            return NegotiationResult(
                response="Thanks for your message — I’m looping in the account owner to make sure we handle this correctly.",
                action="escalate",
                escalation_reason="AI response parse failed",
            )

    def _validate(self, result: NegotiationResult, cfg: Agent3Config) -> NegotiationResult:
        """
        Ensure price guardrails are respected.
        """
        action = result.action.lower().strip()
        if action not in {"reply", "agreed", "book_meeting", "escalate", "declined"}:
            result.action = "reply"

        if result.agreed_price is not None:
            try:
                price = int(result.agreed_price)
            except Exception:
                price = None
            if price is None:
                result.agreed_price = None
            else:
                if price < cfg.min_price:
                    result.action = "escalate"
                    result.escalation_reason = f"Requested price {price} below minimum {cfg.min_price}"
                    result.agreed_price = cfg.min_price
                else:
                    result.agreed_price = price

        if not result.response:
            result.response = "Thanks for the reply — would you like to book a quick call, or should I send the payment link to get started?"

        return result

