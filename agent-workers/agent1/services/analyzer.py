import httpx
import re
from typing import Dict, Any, Optional
from models import DigitalPresence

class AnalyzerService:
    """Analyze digital presence of businesses."""

    def __init__(self):
        self.headers = {
            "User-Agent": "NEXORIS/1.0 (Business Analyzer; +https://nexoris.ai)"
        }

    async def check_presence(self, business_details: Dict) -> DigitalPresence:
        """Check all aspects of a business's digital presence."""
        
        presence = DigitalPresence()
        
        # 1. Check website health
        if business_details.get("website"):
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(business_details["website"], headers=self.headers, timeout=5)
                    presence.website_exists = response.status_code == 200
                    presence.load_time_ms = int(response.elapsed.total_seconds() * 1000)
                    presence.has_ssl = business_details["website"].startswith("https")
                    
                    # Check social media links in HTML
                    if response.status_code == 200:
                        html = response.text
                        presence.social_media = self._extract_socials(html)
                        
            except httpx.RequestError:
                presence.website_exists = False
        
        # 2. Check Google Business Profile completeness
        presence.google_completeness = self._calculate_gmb_score(business_details)
        
        return presence

    def _extract_socials(self, html: str) -> Dict[str, bool]:
        """Find social media links in website HTML."""
        return {
            "facebook": "facebook.com" in html,
            "instagram": "instagram.com" in html,
            "twitter": "twitter.com" in html,
            "tiktok": "tiktok.com" in html,
            "linkedin": "linkedin.com" in html
        }

    def _calculate_gmb_score(self, details: Dict) -> float:
        """Calculate score based on Google Business Profile fields."""
        score = 0
        if details.get("formatted_address"): score += 20
        if details.get("formatted_phone_number"): score += 20
        if details.get("website"): score += 20
        if details.get("rating", 0) > 0: score += 10
        if details.get("user_ratings_total", 0) > 5: score += 10
        if details.get("photos"): score += 20
        return min(score, 100)
