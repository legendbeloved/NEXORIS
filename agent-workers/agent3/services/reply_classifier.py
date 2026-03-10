import logging
from typing import List

import google.generativeai as genai

from config import Config
from models import ConversationMessage


class ReplyClassifier:
    """
    Intent classification for client replies.

    Returns one of:
    INTERESTED / NOT_INTERESTED / PRICE_OBJECTION / MEETING_REQUEST / QUESTION / ALREADY_HAS_SERVICE
    """

    ALLOWED = {
        "INTERESTED",
        "NOT_INTERESTED",
        "PRICE_OBJECTION",
        "MEETING_REQUEST",
        "QUESTION",
        "ALREADY_HAS_SERVICE",
    }

    def __init__(self) -> None:
        genai.configure(api_key=Config.GOOGLE_AI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.logger = logging.getLogger("agent3.classifier")

    async def classify(self, message: str, history: List[ConversationMessage]) -> str:
        """
        Classify intent. If anything fails, default to INTERESTED.
        """
        history_text = "\n".join([f"{m.sender}: {m.message}" for m in history[-10:]])

        prompt = f"""
Classify this message intent. Return ONE word only:
INTERESTED / NOT_INTERESTED / PRICE_OBJECTION / MEETING_REQUEST / QUESTION / ALREADY_HAS_SERVICE

Conversation (most recent last):
{history_text}

Latest message:
{message}
""".strip()

        try:
            resp = self.model.generate_content(
                prompt,
                generation_config={"temperature": 0.2, "max_output_tokens": 20},
            )
            intent = (resp.text or "").strip().split()[0].upper()
            if intent in self.ALLOWED:
                return intent
        except Exception as e:
            self.logger.error(f"Intent classification failed: {e}")
        return "INTERESTED"

