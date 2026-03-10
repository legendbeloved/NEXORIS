import supabase
import logging
from config import Config
from models import AgentStatus, AgentConfig

class Database:
    """Supabase client for Agent 1."""

    def __init__(self):
        self.client = supabase.create_client(
            Config.SUPABASE_URL,
            Config.SUPABASE_SERVICE_ROLE_KEY
        )
        self.logger = logging.getLogger("agent1")

    async def get_config(self) -> AgentConfig:
        """Fetch active agent configuration."""
        try:
            response = self.client.table("agent_configs") \
                .select("*") \
                .eq("agent_number", 1) \
                .eq("is_active", True) \
                .single() \
                .execute()
            
            data = response.data
            return AgentConfig(**data)
        except Exception as e:
            self.logger.error(f"Failed to fetch config: {e}")
            return None

    async def log_action(self, action: str, status: str, details: str = None):
        """Insert entry into agent_logs."""
        try:
            self.client.table("agent_logs").insert({
                "agent_number": 1,
                "action": action,
                "status": status,
                "details": details
            }).execute()
        except Exception as e:
            self.logger.error(f"Logging failed: {e}")

    async def save_prospect(self, prospect: Dict):
        """Save new prospect to database."""
        try:
            # Check for duplicates by google_place_id or email
            existing = self.client.table("prospects") \
                .select("id") \
                .or_(f"google_place_id.eq.{prospect['google_place_id']},email.eq.{prospect['email']}") \
                .execute()
            
            if existing.data:
                self.logger.info(f"Skipping duplicate: {prospect['name']}")
                return

            self.client.table("prospects").insert(prospect).execute()
            self.log_action("PROSPECT_SAVED", "SUCCESS", f"Saved {prospect['name']}")
            
        except Exception as e:
            self.logger.error(f"Failed to save prospect: {e}")

    async def update_status(self, is_active: bool):
        """Update agent run status."""
        try:
            self.client.table("agent_configs") \
                .update({"is_active": is_active, "last_run_at": "now()"}) \
                .eq("agent_number", 1) \
                .execute()
        except Exception as e:
            self.logger.error(f"Status update failed: {e}")
