from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class Agent2Config(BaseModel):
    sender_name: str
    sender_email: EmailStr
    reply_to: Optional[EmailStr] = None
    ab_ratio: float = 0.5  # 0.0 = all B, 1.0 = all A
    send_hour_start: int = 9
    send_hour_end: int = 17
    respect_timezone: bool = True
    include_mockup: bool = False
    custom_instructions: Optional[str] = None

class Prospect(BaseModel):
    id: int
    name: str
    business_name: Optional[str] = None
    email: EmailStr
    city: str
    category: str
    pain_points: List[str] = []
    recommended_service: str = "website"
    website: Optional[str] = None
    token: Optional[str] = None

class EmailContent(BaseModel):
    subject: str
    body_text: str
    body_html: str
    variation: str  # "A" or "B"

class SendResult(BaseModel):
    resend_id: str
    status: str
    sent_at: datetime
