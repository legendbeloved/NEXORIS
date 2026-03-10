from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field


class ServiceItem(BaseModel):
    """A service the owner offers, including negotiation guardrails."""

    name: str
    min_price: int
    max_price: int
    max_discount_pct: int = 0


class Agent3Config(BaseModel):
    """
    Configuration for Agent 3 negotiation and delivery.

    This is loaded from Supabase `agent_configs` for agent_number=3.
    """

    services: List[ServiceItem] = Field(default_factory=list)
    default_service: str = "website"
    min_price: int = 500
    max_discount_pct: int = 10
    negotiation_style: str = "Firm"
    max_rounds: int = 5
    auto_book_meetings: bool = True
    auto_send_payment_links: bool = True
    require_approval_above: Optional[int] = None

    cal_event_type_id: Optional[str] = None


class Prospect(BaseModel):
    """Prospect/business record used by the negotiation worker."""

    id: int
    business_name: str
    email: EmailStr
    city: Optional[str] = None
    category: Optional[str] = None
    token: Optional[str] = None
    status: Optional[str] = None
    recommended_service: Optional[str] = None


class ConversationMessage(BaseModel):
    """Conversation message between client and agent."""

    id: Optional[int] = None
    prospect_id: int
    sender: str  # "CLIENT" or "AGENT"
    channel: str = "EMAIL"
    message: str
    created_at: Optional[datetime] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class NegotiationResult(BaseModel):
    """Structured response produced by the negotiator model."""

    response: str
    action: str = "reply"  # reply | agreed | book_meeting | escalate | declined
    agreed_price: Optional[int] = None
    service_name: Optional[str] = None
    escalation_reason: Optional[str] = None


class StripeLink(BaseModel):
    id: str
    url: str
    expires_at: Optional[int] = None


class CalBookingResult(BaseModel):
    booking_id: Optional[str] = None
    status: str
    details: Dict[str, Any] = Field(default_factory=dict)

