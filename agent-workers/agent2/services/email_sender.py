from datetime import datetime
import resend
import logging
from config import Config
from models import Prospect, Agent2Config, EmailContent, SendResult

class EmailSender:
    """Send emails via Resend."""

    def __init__(self):
        resend.api_key = Config.RESEND_API_KEY
        self.logger = logging.getLogger("agent2.sender")

    async def send(self, email: EmailContent, prospect: Prospect, config: Agent2Config, email_id: str) -> SendResult:
        """Send email via Resend API."""
        try:
            params = {
                "from": f"{config.sender_name} <{config.sender_email}>",
                "to": [prospect.email],
                "subject": email.subject,
                "html": email.body_html,
                "text": email.body_text,
                "reply_to": config.reply_to,
                "headers": {
                    "X-NEXORIS-EMAIL-ID": email_id,
                    "X-NEXORIS-PROSPECT-ID": str(prospect.id)
                }
            }

            # Inject tracking pixel if needed (Resend handles open/click tracking automatically if enabled)
            # But we can add custom metadata or tracking logic here

            response = resend.Emails.send(params)
            
            return SendResult(
                resend_id=response["id"],
                status="SENT",
                sent_at=datetime.now()
            )
            
        except Exception as e:
            self.logger.error(f"Resend API Error: {e}")
            raise

    async def send_with_mockup(self, email: EmailContent, prospect: Prospect, config: Agent2Config, email_id: str, mockup_url: str) -> SendResult:
        """Send email with a mockup preview link/image embedded."""
        if mockup_url:
            email.body_html += (
                f'<div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.10);">'
                f'<div style="font-size:12px;color:#9ca3af;margin-bottom:8px;">Preview prepared for you:</div>'
                f'<a href="{mockup_url}" style="color:#00D4FF;font-weight:700;text-decoration:none;">Open mockup preview</a>'
                f'</div>'
            )
        return await self.send(email, prospect, config, email_id)
