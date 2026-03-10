import pytest
from agent-workers.agent2.services.scheduler import Scheduler, SchedulerConfig
from datetime import datetime


def test_select_variation_extremes():
    s = Scheduler()
    assert all(s.select_variation(1.0) == "A" for _ in range(5))
    assert all(s.select_variation(0.0) == "B" for _ in range(5))


def test_calculate_send_time_window():
    s = Scheduler()
    cfg = SchedulerConfig(hour_start=9, hour_end=17, respect_timezone=False)
    t = s.calculate_send_time("lagos", cfg)
    assert 9 <= t.hour <= 17
