import logging
from datetime import datetime
from typing import Optional

import resend

from config import Config
from models import ConversationMessage, Prospect


class Responder:
    """
    Sends Agent 3 replies to the client and stores the response in Supabase.
    """

    def __init__(self, db) -> None:
        resend.api_key = Config.RESEND_API_KEY
        self.db = db
        self.logger = logging.getLogger("agent3.responder")

        # Basic sender identity (can be aligned with Agent 2 config later)
        self.sender_name = "NEXORIS"
        self.sender_email = "hello@nexoris.ai"

    async def send(self, response_text: str, prospect: Prospect, subject: Optional[str] = None) -> None:
        """
        Send an email reply and persist it to conversations.
        """
        subj = subject or f"Re: {prospect.business_name}"

        try:
            resend.Emails.send(
                {
                    "from": f"{self.sender_name} <{self.sender_email}>",
                    "to": [prospect.email],
                    "subject": subj,
                    "text": response_text,
                    "html": f"<p>{response_text.replace(chr(10), '<br>')}</p>",
                    "headers": {"X-NEXORIS-AGENT": "3"},
                }
            )
        except Exception as e:
            self.logger.error(f"Failed sending response email: {e}")

        try:
            await self.db.insert_conversation_message(
                ConversationMessage(
                    prospect_id=prospect.id,
                    sender="AGENT",
                    channel="EMAIL",
                    message=response_text,
                    created_at=datetime.utcnow(),
                )
            )
        except Exception as e:
            self.logger.error(f"Failed storing conversation message: {e}")

