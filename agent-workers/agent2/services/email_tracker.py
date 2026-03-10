import asyncio
import logging
from typing import Optional, Dict, Any

import httpx

from config import Config


class EmailTracker:
    """
    Poll Resend for delivery updates.

    This is a minimal implementation that can be expanded later:
    - If you store resend_id in DB, you can call Resend REST to fetch status.
    - On status change, update outreach_emails rows.
    """

    RESEND_API_URL = "https://api.resend.com"

    def __init__(self, supabase_client):
        self.client = supabase_client
        self.logger = logging.getLogger("agent2.tracker")

    async def poll_delivery_status(self, resend_id: str, outreach_email_id: Optional[int] = None) -> None:
        """
        Poll Resend email status for up to 7 days (every 30 minutes).

        For local testing, you can stop this early.
        """
        for _ in range(7 * 24 * 2):  # 7 days * 24 hours * 2 polls/hour
            try:
                status = await self._fetch_status(resend_id)
                if status:
                    await self._update_outreach_status(outreach_email_id, resend_id, status)
            except Exception as e:
                self.logger.error(f"Tracking poll failed: {e}")
            await asyncio.sleep(30 * 60)

    async def _fetch_status(self, resend_id: str) -> Optional[str]:
        headers = {"Authorization": f"Bearer {Config.RESEND_API_KEY}"}
        async with httpx.AsyncClient(timeout=10) as http:
            r = await http.get(f"{self.RESEND_API_URL}/emails/{resend_id}", headers=headers)
            if r.status_code >= 400:
                return None
            data: Dict[str, Any] = r.json()
            return data.get("status")

    async def _update_outreach_status(self, outreach_email_id: Optional[int], resend_id: str, status: str) -> None:
        try:
            q = self.client.table("outreach_emails").update({"delivery_status": status})
            if outreach_email_id is not None:
                q = q.eq("id", outreach_email_id)
            else:
                q = q.eq("resend_id", resend_id)
            q.execute()
        except Exception as e:
            self.logger.error(f"Failed to update outreach status: {e}")

