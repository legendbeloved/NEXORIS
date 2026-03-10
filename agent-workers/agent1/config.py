import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Supabase Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    # Google API Configuration
    GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
    GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")

    # API Configuration
    NEXORIS_API_URL = os.getenv("NEXORIS_API_URL", "http://localhost:3000")
    NEXORIS_API_SECRET = os.getenv("NEXORIS_API_SECRET", "dev-secret")

    # Agent Settings
    AGENT_NUMBER = 1
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    @classmethod
    def validate(cls):
        """Ensure all critical environment variables are set."""
        required = [
            "SUPABASE_URL",
            "SUPABASE_SERVICE_ROLE_KEY",
            "GOOGLE_PLACES_API_KEY",
            "GOOGLE_AI_API_KEY"
        ]
        missing = [key for key in required if not getattr(cls, key)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

# Validate on import to fail fast
try:
    Config.validate()
except ValueError as e:
    print(f"Configuration Error: {e}")
