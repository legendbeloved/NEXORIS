import asyncio
import logging
from typing import Dict
from config import Config
from database import Database
from services.places import PlacesClient
from services.analyzer import AnalyzerService
from services.ai_analyzer import AIAnalyzer
from services.contact import ContactService
from models import AgentConfig

class Agent1:
    """Agent 1: Business Discovery Engine."""

    def __init__(self):
        self.db = Database()
        self.places = PlacesClient()
        self.analyzer = AnalyzerService()
        self.ai = AIAnalyzer()
        self.contact = ContactService()
        self.logger = logging.getLogger("agent1")

    async def run(self, stop_flag: asyncio.Event):
        """Main execution loop."""
        
        await self.db.log_action("AGENT_STARTED", "RUNNING")
        await self.db.update_status(True)
        
        try:
            # 1. Fetch Configuration
            config = await self.db.get_config()
            if not config:
                self.logger.warning("No active configuration found.")
                return

            # 2. Iterate Targets
            for city in config.target_cities:
                for category in config.categories:
                    if stop_flag.is_set():
                        break
                    
                    self.logger.info(f"Scanning {city} for {category}...")
                    results = await self.places.search_businesses(city, category, config.radius_km)
                    
                    for business in results:
                        if stop_flag.is_set():
                            break
                            
                        # 3. Process Business
                        try:
                            # Details & Presence
                            details = await self.places.get_business_details(business["place_id"])
                            if not details: continue
                            
                            presence = await self.analyzer.check_presence(details.dict())
                            
                            # AI Analysis
                            ai_result = await self.ai.analyze(details.dict(), presence.dict())
                            if ai_result.score < config.min_score:
                                await self.db.log_action("SKIPPED_LOW_SCORE", "INFO", f"{details.name}: {ai_result.score}")
                                continue
                                
                            # Contact Extraction
                            contact = await self.contact.extract(details.dict())
                            if config.require_email and not contact.email:
                                continue
                                
                            # Save Prospect
                            prospect = {
                                "name": details.name,
                                "google_place_id": details.place_id,
                                "website": details.website,
                                "email": contact.email,
                                "phone": contact.phone,
                                "city": city,
                                "category": category,
                                "ai_score": ai_result.score,
                                "pain_points": ai_result.pain_points,
                                "analysis": ai_result.analysis,
                                "status": "DISCOVERED"
                            }
                            
                            await self.db.save_prospect(prospect)
                            await asyncio.sleep(1)  # Rate limiting
                            
                        except Exception as e:
                            self.logger.error(f"Error processing {business.get('name')}: {e}")
                            continue

        except Exception as e:
            self.logger.critical(f"Agent crashed: {e}")
            await self.db.log_action("AGENT_CRASHED", "ERROR", str(e))
            
        finally:
            await self.db.log_action("AGENT_STOPPED", "SUCCESS")
            await self.db.update_status(False)
