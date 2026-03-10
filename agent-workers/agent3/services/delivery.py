import logging
from typing import Optional

import resend

from config import Config
from models import Prospect


class DeliveryService:
    """
    Project delivery notifications.

    In the MVP, the owner marks a project as delivered in the admin UI,
    and this service notifies the client.
    """

    def __init__(self) -> None:
        resend.api_key = Config.RESEND_API_KEY
        self.logger = logging.getLogger("agent3.delivery")

    async def notify_delivery_ready(self, project_id: int, prospect: Prospect) -> None:
        """
        Notify client that project delivery is ready in the portal.
        """
        token = prospect.token or "unknown"
        portal_url = f"{Config.NEXORIS_API_URL.rstrip('/')}/client/{token}"

        subject = "Your project is ready!"
        text = (
            f"Hi {prospect.business_name},\n\n"
            f"Your project is ready. You can access the delivery in your portal:\n"
            f"{portal_url}\n\n"
            f"Thanks,\nNEXORIS"
        )

        try:
            resend.Emails.send(
                {
                    "from": "NEXORIS <hello@nexoris.ai>",
                    "to": [prospect.email],
                    "subject": subject,
                    "text": text,
                    "html": f"<p>{text.replace(chr(10), '<br>')}</p>",
                }
            )
        except Exception as e:
            self.logger.error(f"Delivery email failed: {e}")

