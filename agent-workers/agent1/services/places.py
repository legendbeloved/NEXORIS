import httpx
import asyncio
from typing import List, Dict, Optional
from models import BusinessDetails
from config import Config

class PlacesClient:
    """Client for interacting with Google Places API."""

    BASE_URL = "https://maps.googleapis.com/maps/api/place"
    
    def __init__(self):
        self.api_key = Config.GOOGLE_PLACES_API_KEY
        self.cache: Dict[str, Any] = {}

    async def search_businesses(self, city: str, category: str, radius_km: int) -> List[Dict]:
        """Search for businesses using textsearch endpoint."""
        query = f"{category} in {city}"
        cache_key = f"{city}_{category}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]

        results = []
        next_page_token = None
        
        async with httpx.AsyncClient() as client:
            for _ in range(3):  # Max 3 pages (60 results)
                params = {
                    "query": query,
                    "key": self.api_key,
                    "radius": radius_km * 1000
                }
                if next_page_token:
                    params["pagetoken"] = next_page_token
                    await asyncio.sleep(2)  # Wait for token to activate

                try:
                    response = await client.get(f"{self.BASE_URL}/textsearch/json", params=params)
                    response.raise_for_status()
                    data = response.json()
                    
                    if data.get("status") != "OK":
                        break
                        
                    results.extend(data.get("results", []))
                    next_page_token = data.get("next_page_token")
                    
                    if not next_page_token:
                        break
                        
                except Exception as e:
                    print(f"Places API Error: {e}")
                    break

        self.cache[cache_key] = results
        return results

    async def get_business_details(self, place_id: str) -> Optional[BusinessDetails]:
        """Fetch full details for a specific place ID."""
        if place_id in self.cache:
            return self.cache[place_id]

        fields = "place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,geometry"
        
        async with httpx.AsyncClient() as client:
            try:
                params = {
                    "place_id": place_id,
                    "fields": fields,
                    "key": self.api_key
                }
                response = await client.get(f"{self.BASE_URL}/details/json", params=params)
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") != "OK":
                    return None
                    
                result = data.get("result", {})
                details = BusinessDetails(
                    place_id=result.get("place_id"),
                    name=result.get("name"),
                    address=result.get("formatted_address"),
                    phone=result.get("formatted_phone_number"),
                    website=result.get("website"),
                    rating=result.get("rating", 0.0),
                    review_count=result.get("user_ratings_total", 0),
                    types=result.get("types", []),
                    location=result.get("geometry", {}).get("location", {})
                )
                
                self.cache[place_id] = details
                return details
                
            except Exception as e:
                print(f"Details API Error: {e}")
                return None
