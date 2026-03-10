import re
import dns.resolver
from typing import Optional, List, Dict
from models import ContactInfo

class ContactService:
    """Extract and validate business contact information."""

    def __init__(self):
        self.email_regex = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        self.phone_regex = r"\+?[1-9]\d{1,14}"

    async def extract(self, business: Dict, html: str = None) -> ContactInfo:
        """Find best contact details from various sources."""
        
        email = self._extract_email(html) if html else None
        if not email:
            email = self._extract_email_from_details(business)
            
        phone = self._extract_phone(business)
        
        email_valid = self._validate_email(email) if email else False
        
        return ContactInfo(
            email=email,
            phone=phone,
            email_valid=email_valid,
            source="website" if html else "google"
        )

    def _extract_email(self, text: str) -> Optional[str]:
        """Find email address in raw text/HTML."""
        if not text:
            return None
        
        matches = re.findall(self.email_regex, text)
        for email in matches:
            if not self._is_generic(email):
                return email
        return matches[0] if matches else None

    def _extract_email_from_details(self, business: Dict) -> Optional[str]:
        """Check Google Places details for email (rare)."""
        # Google Places rarely provides email directly
        return None

    def _extract_phone(self, business: Dict) -> Optional[str]:
        """Get formatted phone number."""
        phone = business.get("formatted_phone_number")
        if phone:
            return re.sub(r"[^0-9+]", "", phone)
        return None

    def _validate_email(self, email: str) -> bool:
        """Check email format and MX records."""
        if not re.match(self.email_regex, email):
            return False
            
        domain = email.split("@")[1]
        try:
            records = dns.resolver.resolve(domain, "MX")
            return bool(records)
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
            return False
            
    def _is_generic(self, email: str) -> bool:
        """Filter out generic inboxes."""
        generic_prefixes = ["info", "contact", "support", "hello", "sales", "admin"]
        prefix = email.split("@")[0].lower()
        return prefix in generic_prefixes
