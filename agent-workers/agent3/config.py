import os
from dotenv import load_dotenv


# Load environment variables from .env file (local dev)
load_dotenv()


class Config:
    """
    Central config for Agent 3.

    We validate required env vars on startup. In deployment (Railway),
    these are provided as environment variables.
    """

    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    # Gemini
    GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")

    # Resend (sending negotiation replies + payment links)
    RESEND_API_KEY = os.getenv("RESEND_API_KEY")

    # Stripe
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")

    # Cal.com
    CAL_COM_API_KEY = os.getenv("CAL_COM_API_KEY")
    CAL_COM_EVENT_TYPE_ID = os.getenv("CAL_COM_EVENT_TYPE_ID")

    # App routing and shared auth
    NEXORIS_API_URL = os.getenv("NEXORIS_API_URL", "http://localhost:3000")
    NEXORIS_API_SECRET = os.getenv("NEXORIS_API_SECRET", "dev-secret")

    AGENT_NUMBER = 3
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    @classmethod
    def validate(cls) -> None:
        required = [
            "SUPABASE_URL",
            "SUPABASE_SERVICE_ROLE_KEY",
            "GOOGLE_AI_API_KEY",
            "RESEND_API_KEY",
            "STRIPE_SECRET_KEY",
            "CAL_COM_API_KEY",
        ]
        missing = [k for k in required if not getattr(cls, k)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")


try:
    Config.validate()
except ValueError as e:
    print(f"Configuration Error: {e}")

