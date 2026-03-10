from __future__ import annotations

import random
from dataclasses import dataclass
from datetime import datetime, timedelta, time
from typing import Dict, Optional

try:
    from zoneinfo import ZoneInfo
except Exception:  # pragma: no cover
    ZoneInfo = None


@dataclass
class SchedulerConfig:
    hour_start: int
    hour_end: int
    respect_timezone: bool = True


class Scheduler:
    """
    Send-time optimizer.

    This is intentionally simple and beginner-friendly:
    - Uses a small city->timezone map
    - Avoids weekends
    - Picks the next valid hour window
    """

    CITY_TIMEZONES: Dict[str, str] = {
        "san francisco": "America/Los_Angeles",
        "los angeles": "America/Los_Angeles",
        "new york": "America/New_York",
        "austin": "America/Chicago",
        "chicago": "America/Chicago",
        "london": "Europe/London",
        "lagos": "Africa/Lagos",
    }

    def select_variation(self, ab_ratio: float) -> str:
        """
        Choose A/B variation based on ab_ratio.
        1.0 = all A, 0.0 = all B.
        """
        return "A" if random.random() < max(0.0, min(1.0, ab_ratio)) else "B"

    def calculate_send_time(self, city: str, cfg: SchedulerConfig) -> datetime:
        """
        Calculate the next send time in UTC.
        """
        now_utc = datetime.utcnow()

        local_tz = self._get_city_timezone(city) if cfg.respect_timezone else None
        now_local = now_utc if local_tz is None else now_utc.replace(tzinfo=ZoneInfo("UTC")).astimezone(local_tz)

        target_local = self._next_in_window(now_local, cfg.hour_start, cfg.hour_end)

        # Convert to UTC
        if local_tz is None:
            return target_local.replace(tzinfo=None)
        return target_local.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)

    def _get_city_timezone(self, city: str) -> Optional["ZoneInfo"]:
        if ZoneInfo is None:
            return None
        key = (city or "").strip().lower()
        tz_name = self.CITY_TIMEZONES.get(key)
        if not tz_name:
            return ZoneInfo("UTC")
        return ZoneInfo(tz_name)

    def _next_in_window(self, now_local: datetime, hour_start: int, hour_end: int) -> datetime:
        """
        Find the next datetime within the [hour_start, hour_end] window.
        Avoid Saturday/Sunday.
        """
        hour_start = max(0, min(23, int(hour_start)))
        hour_end = max(0, min(23, int(hour_end)))
        if hour_end <= hour_start:
            hour_end = min(23, hour_start + 1)

        candidate_date = now_local.date()
        candidate = datetime.combine(candidate_date, time(hour=now_local.hour, minute=now_local.minute), tzinfo=now_local.tzinfo)

        # If already past window end, go to next day at start hour
        if candidate.hour >= hour_end:
            candidate = datetime.combine(candidate_date + timedelta(days=1), time(hour=hour_start, minute=0), tzinfo=now_local.tzinfo)
        elif candidate.hour < hour_start:
            candidate = datetime.combine(candidate_date, time(hour=hour_start, minute=0), tzinfo=now_local.tzinfo)

        # Skip weekends
        while candidate.weekday() in (5, 6):
            candidate = datetime.combine(candidate.date() + timedelta(days=1), time(hour=hour_start, minute=0), tzinfo=now_local.tzinfo)

        return candidate

