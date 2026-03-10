from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class AgentConfig(BaseModel):
    target_cities: List[str] = Field(default_factory=list)
    categories: List[str] = Field(default_factory=list)
    radius_km: int = 20
    min_score: int = 50
    require_email: bool = True
    max_prospects: int = 50

class BusinessDetails(BaseModel):
    place_id: str
    name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    types: List[str] = []
    location: Dict[str, float] = {}  # lat, lng

class DigitalPresence(BaseModel):
    website_exists: bool = False
    load_time_ms: int = 0
    has_ssl: bool = False
    social_media: Dict[str, bool] = {
        "facebook": False,
        "instagram": False,
        "twitter": False,
        "tiktok": False,
        "linkedin": False
    }
    google_completeness: float = 0.0

class AIAnalysisResult(BaseModel):
    score: int = 0
    pain_points: List[str] = []
    analysis: str = ""
    recommended_service: str = "website"

class ContactInfo(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    email_valid: bool = False
    source: str = "google"

class AgentStatus(BaseModel):
    is_running: bool
    current_city: Optional[str] = None
    current_category: Optional[str] = None
    prospects_found_this_run: int = 0
    started_at: Optional[datetime] = None
    elapsed_seconds: float = 0.0
