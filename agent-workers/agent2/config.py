import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    # AI & Services
    GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")
    RESEND_API_KEY = os.getenv("RESEND_API_KEY")

    # NEXORIS API
    NEXORIS_API_URL = os.getenv("NEXORIS_API_URL", "http://localhost:3000")
    NEXORIS_API_SECRET = os.getenv("NEXORIS_API_SECRET", "dev-secret")
    AGENT3_API_URL = os.getenv("AGENT3_API_URL", "http://localhost:8003")

    # Agent Settings
    AGENT_NUMBER = 2
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    @classmethod
    def validate(cls):
        required = [
            "SUPABASE_URL",
            "SUPABASE_SERVICE_ROLE_KEY",
            "GOOGLE_AI_API_KEY",
            "RESEND_API_KEY"
        ]
        missing = [key for key in required if not getattr(cls, key)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

try:
    Config.validate()
except ValueError as e:
    print(f"Configuration Error: {e}")
