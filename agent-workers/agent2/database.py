import json
import logging
from typing import Any, Dict, List, Optional

import supabase

from config import Config
from models import Agent2Config, Prospect

class Database:
    """Supabase client for Agent 2 (Outreach)."""

    def __init__(self):
        self.client = supabase.create_client(
            Config.SUPABASE_URL,
            Config.SUPABASE_SERVICE_ROLE_KEY
        )
        self.logger = logging.getLogger("agent2")

    async def get_config(self) -> Agent2Config:
        """Fetch Agent 2 configuration."""
        try:
            response = self.client.table("agent_configs") \
                .select("*") \
                .eq("agent_number", 2) \
                .eq("is_active", True) \
                .single() \
                .execute()
            
            data = response.data
            return Agent2Config(
                sender_name=data.get("sender_name", "NEXORIS Agent"),
                sender_email=data.get("sender_email", "hello@nexoris.ai"),
                reply_to=data.get("reply_to"),
                ab_ratio=data.get("ab_ratio", 0.5),
                send_hour_start=data.get("send_hour_start", 9),
                send_hour_end=data.get("send_hour_end", 17),
                respect_timezone=data.get("respect_timezone", True),
                include_mockup=data.get("include_mockup", False),
                custom_instructions=data.get("custom_instructions")
            )
        except Exception as e:
            self.logger.error(f"Failed to fetch config: {e}")
            return None

    async def get_queued_prospects(self, limit: int = 10) -> List[Prospect]:
        """Fetch prospects ready for outreach."""
        try:
            response = self.client.table("prospects") \
                .select("*") \
                .eq("status", "DISCOVERED") \
                .limit(limit) \
                .execute()
            
            prospects: List[Prospect] = []
            for p in response.data:
                pain_points = self._normalize_pain_points(p.get("pain_points"))
                recommended_service = (
                    p.get("recommended_service")
                    or self._try_get_recommended_service_from_analysis(p.get("analysis"))
                    or "website"
                )

                prospects.append(
                    Prospect(
                        id=p["id"],
                        name=p.get("contact_name") or p["name"],
                        business_name=p["name"],
                        email=p["email"],
                        city=p.get("city") or "Unknown",
                        category=p.get("category") or "General",
                        pain_points=pain_points,
                        recommended_service=recommended_service,
                        website=p.get("website"),
                        token=p.get("token"),
                    )
                )

            return prospects
        except Exception as e:
            self.logger.error(f"Failed to fetch prospects: {e}")
            return []

    async def get_prospect_by_id(self, prospect_id: int) -> Optional[Prospect]:
        """Fetch a single prospect by ID."""
        try:
            response = self.client.table("prospects").select("*").eq("id", prospect_id).single().execute()
            p = response.data

            pain_points = self._normalize_pain_points(p.get("pain_points"))
            recommended_service = (
                p.get("recommended_service")
                or self._try_get_recommended_service_from_analysis(p.get("analysis"))
                or "website"
            )

            return Prospect(
                id=p["id"],
                name=p.get("contact_name") or p["name"],
                business_name=p["name"],
                email=p["email"],
                city=p.get("city") or "Unknown",
                category=p.get("category") or "General",
                pain_points=pain_points,
                recommended_service=recommended_service,
                website=p.get("website"),
                token=p.get("token"),
            )
        except Exception as e:
            self.logger.error(f"Failed to fetch prospect {prospect_id}: {e}")
            return None

    async def log_outreach(self, prospect_id: int, email_data: Dict, resend_id: str):
        """Record sent email in outreach_emails table."""
        try:
            self.client.table("outreach_emails").insert({
                "prospect_id": prospect_id,
                "variant": email_data["variation"],
                "subject": email_data["subject"],
                "body_text": email_data["body_text"],
                "body_html": email_data["body_html"],
                "sent_at": "now()",
                "status": "SENT",
                "resend_id": resend_id
            }).execute()
        except Exception as e:
            self.logger.error(f"Failed to log outreach: {e}")

    async def update_prospect_status(self, prospect_id: int, status: str):
        """Update prospect lifecycle status."""
        try:
            self.client.table("prospects") \
                .update({"status": status, "updated_at": "now()"}) \
                .eq("id", prospect_id) \
                .execute()
        except Exception as e:
            self.logger.error(f"Failed to update prospect: {e}")

    async def log_action(self, action: str, status: str, details: str = None):
        """Insert entry into agent_logs."""
        try:
            self.client.table("agent_logs").insert({
                "agent_number": 2,
                "action": action,
                "status": status,
                "details": details
            }).execute()
        except Exception as e:
            self.logger.error(f"Logging failed: {e}")

    def _normalize_pain_points(self, value: Any) -> List[str]:
        """
        Convert pain points from DB into a list of strings.

        Supabase may store these as a JSON string, a list, or NULL depending on schema.
        """
        if value is None:
            return []
        if isinstance(value, list):
            return [str(v) for v in value if str(v).strip()]
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [str(v) for v in parsed if str(v).strip()]
            except Exception:
                pass
            return [v.strip() for v in value.split(",") if v.strip()]
        return []

    def _try_get_recommended_service_from_analysis(self, value: Any) -> Optional[str]:
        """
        Attempt to extract recommended_service from an analysis field.

        The analysis column may be stored as JSON string or dict.
        """
        if value is None:
            return None
        if isinstance(value, dict):
            svc = value.get("recommended_service")
            return str(svc).strip() if svc else None
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, dict):
                    svc = parsed.get("recommended_service")
                    return str(svc).strip() if svc else None
            except Exception:
                return None
        return None
