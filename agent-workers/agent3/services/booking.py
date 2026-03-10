import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

import httpx

from config import Config
from models import Agent3Config, CalBookingResult, Prospect


class BookingService:
    """
    Cal.com booking integration.

    Cal.com API details can vary by plan/version. This implementation follows
    the AGENTS.md intent: create a booking request and store IDs when possible.
    """

    def __init__(self) -> None:
        self.logger = logging.getLogger("agent3.booking")

    async def book(self, prospect: Prospect, cfg: Agent3Config) -> CalBookingResult:
        """
        Attempt to book a meeting via Cal.com API.
        """
        event_type_id = cfg.cal_event_type_id or Config.CAL_COM_EVENT_TYPE_ID
        if not event_type_id:
            return CalBookingResult(status="error", details={"error": "Missing CAL_COM_EVENT_TYPE_ID"})

        payload: Dict[str, Any] = {
            "eventTypeId": event_type_id,
            "title": f"Consultation with {prospect.business_name}",
            "attendee": {
                "name": prospect.business_name,
                "email": prospect.email,
                "timeZone": "UTC",
            },
            # We set a suggested start time; Cal.com should resolve availability server-side.
            "start": (datetime.utcnow() + timedelta(days=2)).isoformat() + "Z",
        }

        headers = {"Authorization": f"Bearer {Config.CAL_COM_API_KEY}"}

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post("https://api.cal.com/v1/bookings", json=payload, headers=headers)
                data = resp.json() if resp.content else {}
                if resp.status_code >= 400:
                    return CalBookingResult(status="error", details={"status_code": resp.status_code, "data": data})
                booking_id = data.get("id") or data.get("bookingId")
                return CalBookingResult(status="success", booking_id=str(booking_id) if booking_id else None, details=data)
        except Exception as e:
            self.logger.error(f"Cal.com booking failed: {e}")
            return CalBookingResult(status="error", details={"error": str(e)})

