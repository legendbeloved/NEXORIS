from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional

import supabase

from config import Config
from models import Agent3Config, ConversationMessage, Prospect, ServiceItem


class Database:
    """
    Supabase wrapper for Agent 3.

    - Uses SERVICE_ROLE_KEY so the agent can bypass RLS
    - Wraps writes with a simple retry policy
    """

    def __init__(self) -> None:
        self.client = supabase.create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_ROLE_KEY)
        self.logger = logging.getLogger("agent3.db")

    async def get_agent_config(self, owner_id: Optional[str] = None) -> Agent3Config:
        """
        Load Agent 3 config from `agent_configs`.
        """
        try:
            q = self.client.table("agent_configs").select("*").eq("agent_number", 3)
            if owner_id:
                q = q.eq("owner_id", owner_id)
            row = q.single().execute().data
        except Exception as e:
            self.logger.error(f"Failed to fetch agent config: {e}")
            return Agent3Config()

        services_raw = row.get("services") or []
        services = self._parse_services(services_raw)

        return Agent3Config(
            services=services,
            default_service=row.get("default_service", "website"),
            min_price=int(row.get("min_price") or 500),
            max_discount_pct=int(row.get("max_discount_pct") or 10),
            negotiation_style=row.get("negotiation_style", "Firm"),
            max_rounds=int(row.get("max_rounds") or 5),
            auto_book_meetings=bool(row.get("auto_book_meetings", True)),
            auto_send_payment_links=bool(row.get("auto_send_payment_links", True)),
            require_approval_above=row.get("require_approval_above"),
            cal_event_type_id=row.get("cal_event_type_id") or Config.CAL_COM_EVENT_TYPE_ID,
        )

    async def get_prospect(self, prospect_id: int) -> Optional[Prospect]:
        """
        Fetch a prospect/business record from Supabase.
        """
        try:
            row = self.client.table("prospects").select("*").eq("id", prospect_id).single().execute().data
            return Prospect(
                id=row["id"],
                business_name=row.get("business_name") or row.get("name") or "Unknown Business",
                email=row["email"],
                city=row.get("city"),
                category=row.get("category"),
                token=row.get("token"),
                status=row.get("status"),
                recommended_service=row.get("recommended_service"),
            )
        except Exception as e:
            self.logger.error(f"Failed to fetch prospect {prospect_id}: {e}")
            return None

    async def get_conversation_history(self, prospect_id: int, limit: int = 50) -> List[ConversationMessage]:
        """
        Load conversation history for a prospect.

        We look in `conversations` first (per AGENTS.md), and fall back to
        `messages` if needed for local schemas.
        """
        for table in ["conversations", "messages"]:
            try:
                rows = (
                    self.client.table(table)
                    .select("*")
                    .eq("prospect_id", prospect_id)
                    .order("created_at", desc=False)
                    .limit(limit)
                    .execute()
                    .data
                )
                return [
                    ConversationMessage(
                        id=r.get("id"),
                        prospect_id=r.get("prospect_id", prospect_id),
                        sender=r.get("sender") or r.get("role") or "CLIENT",
                        channel=r.get("channel") or "EMAIL",
                        message=r.get("message") or r.get("content") or "",
                        created_at=r.get("created_at"),
                        metadata=r.get("metadata") or {},
                    )
                    for r in rows
                ]
            except Exception:
                continue
        return []

    async def insert_conversation_message(self, msg: ConversationMessage) -> None:
        """
        Insert a new conversation message.
        """
        await self._retry_write(
            lambda: self.client.table("conversations").insert(
                {
                    "prospect_id": msg.prospect_id,
                    "sender": msg.sender,
                    "channel": msg.channel,
                    "message": msg.message,
                    "metadata": msg.metadata,
                }
            ).execute()
        )

    async def insert_agent_log(self, owner_id: Optional[str], action: str, status: str, prospect_id: Optional[int] = None, details: Optional[Dict[str, Any]] = None) -> None:
        """
        Insert an agent log entry.
        """
        payload: Dict[str, Any] = {
            "agent_number": 3,
            "action": action,
            "status": status,
            "prospect_id": prospect_id,
            "details": json.dumps(details) if isinstance(details, dict) else details,
        }
        if owner_id:
            payload["owner_id"] = owner_id

        await self._retry_write(lambda: self.client.table("agent_logs").insert(payload).execute())

    async def insert_notification(
        self,
        owner_id: Optional[str],
        notif_type: str,
        title: str,
        message: str,
        prospect_id: Optional[int] = None,
        priority: str = "LOW",
        requires_action: bool = False,
    ) -> None:
        """
        Insert a notification for the owner.
        """
        payload: Dict[str, Any] = {
            "type": notif_type,
            "title": title,
            "message": message,
            "prospect_id": prospect_id,
            "priority": priority,
            "requires_action": requires_action,
        }
        if owner_id:
            payload["owner_id"] = owner_id

        await self._retry_write(lambda: self.client.table("notifications").insert(payload).execute())

    async def update_prospect_status(self, prospect_id: int, status: str) -> None:
        """
        Update prospect status.
        """
        await self._retry_write(
            lambda: self.client.table("prospects")
            .update({"status": status, "updated_at": "now()"})
            .eq("id", prospect_id)
            .execute()
        )

    async def create_project(self, prospect_id: int, service_type: str, title: str) -> Optional[int]:
        """
        Create a project record and return its ID.
        """
        try:
            res = self.client.table("projects").insert(
                {
                    "prospect_id": prospect_id,
                    "service_type": service_type,
                    "title": title,
                    "status": "NOT_STARTED",
                }
            ).execute()
            if res.data and isinstance(res.data, list):
                return res.data[0].get("id")
            if isinstance(res.data, dict):
                return res.data.get("id")
        except Exception as e:
            self.logger.error(f"Failed to create project: {e}")
        return None

    async def create_payment(self, prospect_id: int, project_id: int, stripe_session_id: str, payment_link: str, amount: int) -> None:
        """
        Store a payment record.
        """
        await self._retry_write(
            lambda: self.client.table("payments").insert(
                {
                    "prospect_id": prospect_id,
                    "project_id": project_id,
                    "stripe_session_id": stripe_session_id,
                    "payment_link": payment_link,
                    "amount": amount,
                    "status": "LINK_SENT",
                    "link_sent_at": "now()",
                }
            ).execute()
        )

    async def _retry_write(self, fn, retries: int = 3, delay_seconds: float = 2.0) -> None:
        """
        Retry wrapper for Supabase writes.
        """
        last_err: Optional[Exception] = None
        for attempt in range(retries):
            try:
                fn()
                return
            except Exception as e:
                last_err = e
                await asyncio.sleep(delay_seconds)
        if last_err:
            raise last_err

    def _parse_services(self, raw: Any) -> List[ServiceItem]:
        """
        Parse services config from JSON/dict/list into typed models.
        """
        if raw is None:
            return []
        if isinstance(raw, str):
            try:
                raw = json.loads(raw)
            except Exception:
                return []
        if not isinstance(raw, list):
            return []
        services: List[ServiceItem] = []
        for s in raw:
            if isinstance(s, dict) and s.get("name"):
                services.append(
                    ServiceItem(
                        name=str(s.get("name")),
                        min_price=int(s.get("min_price") or 0),
                        max_price=int(s.get("max_price") or 0),
                        max_discount_pct=int(s.get("max_discount_pct") or 0),
                    )
                )
        return services

