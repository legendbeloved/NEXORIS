import logging
from typing import Optional

import stripe

from config import Config
from models import Prospect, StripeLink


class PaymentService:
    """
    Stripe Checkout session creation.
    """

    def __init__(self) -> None:
        stripe.api_key = Config.STRIPE_SECRET_KEY
        self.logger = logging.getLogger("agent3.payment")

    async def create_link(self, prospect: Prospect, project_id: int, amount: int, service_name: str) -> Optional[StripeLink]:
        """
        Create a Stripe Checkout Session and return its URL.
        """
        token = prospect.token or "unknown"
        success_url = f"{Config.NEXORIS_API_URL.rstrip('/')}/client/{token}?payment=success"
        cancel_url = f"{Config.NEXORIS_API_URL.rstrip('/')}/client/{token}/pay?cancelled=true"

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="payment",
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {"name": service_name},
                            "unit_amount": int(amount) * 100,
                        },
                        "quantity": 1,
                    }
                ],
                metadata={
                    "prospect_id": str(prospect.id),
                    "project_id": str(project_id),
                },
                success_url=success_url,
                cancel_url=cancel_url,
            )

            return StripeLink(id=session["id"], url=session["url"], expires_at=session.get("expires_at"))
        except Exception as e:
            self.logger.error(f"Stripe session creation failed: {e}")
            return None

