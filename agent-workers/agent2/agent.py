from datetime import datetime
import asyncio
import logging
from typing import Dict
from config import Config
from database import Database
from services.email_generator import EmailGenerator
from services.email_sender import EmailSender
from services.mockup_builder import MockupBuilder
from services.scheduler import Scheduler, SchedulerConfig
from services.email_tracker import EmailTracker
from models import Prospect, Agent2Config

class Agent2:
    """Agent 2: Outreach Intelligence Engine."""

    def __init__(self):
        self.db = Database()
        self.generator = EmailGenerator()
        self.sender = EmailSender()
        self.scheduler = Scheduler()
        self.mockup_builder = MockupBuilder(self.db.client)
        self.tracker = EmailTracker(self.db.client)
        self.logger = logging.getLogger("agent2")

    async def run(self, stop_flag: asyncio.Event):
        """Main loop processing queued prospects."""
        
        await self.db.log_action("AGENT_STARTED", "RUNNING")
        
        try:
            # 1. Fetch Configuration
            config = await self.db.get_config()
            if not config:
                self.logger.warning("No active configuration found.")
                return

            # 2. Iterate Prospects
            prospects = await self.db.get_queued_prospects()
            
            for prospect in prospects:
                if stop_flag.is_set():
                    break
                    
                await self.process_prospect(prospect, config)
                await asyncio.sleep(2) # Throttle sends

        except Exception as e:
            self.logger.critical(f"Agent crashed: {e}")
            await self.db.log_action("AGENT_CRASHED", "ERROR", str(e))
            
        finally:
            await self.db.log_action("AGENT_STOPPED", "SUCCESS")

    async def process_prospect_id(self, prospect_id: int, stop_flag: asyncio.Event = None) -> None:
        """
        Process a single prospect by ID.

        This is used by the /process-prospect endpoint.
        """
        if stop_flag is not None and stop_flag.is_set():
            return

        config = await self.db.get_config()
        if not config:
            self.logger.warning("No active configuration found.")
            return

        prospect = await self.db.get_prospect_by_id(prospect_id)
        if not prospect:
            await self.db.log_action("PROSPECT_NOT_FOUND", "ERROR", f"Prospect {prospect_id}")
            return

        await self.process_prospect(prospect, config)

    async def process_prospect(self, prospect: Prospect, config: Agent2Config):
        """Generate and send email for a single prospect."""
        try:
            # 1. Select Variation (A/B Test)
            variation = self.scheduler.select_variation(config.ab_ratio)
            
            # 2. Generate Content
            email_content = await self.generator.generate(prospect, config, variation)
            
            # 3. Build tracking + CTA links
            email_id = f"email_{prospect.id}_{int(datetime.utcnow().timestamp())}"

            portal_url = (
                f"{Config.NEXORIS_API_URL.rstrip('/')}/client/{prospect.token}"
                if prospect.token
                else Config.NEXORIS_API_URL.rstrip("/")
            )

            cta_html = (
                f'<div style="margin-top:18px;">'
                f'<a href="{portal_url}" style="display:inline-block;background:#5B4CF5;color:white;text-decoration:none;'
                f'padding:12px 14px;border-radius:12px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;font-size:12px;">'
                f'Open Your Proposal</a></div>'
            )

            tracking_pixel_url = (
                f"{Config.NEXORIS_API_URL.rstrip('/')}/api/outreach/track/open"
                f"?emailId={email_id}&prospectId={prospect.id}"
            )
            tracking_pixel = f'<img src="{tracking_pixel_url}" width="1" height="1" alt="" style="display:none;" />'

            email_content.body_html = email_content.body_html.replace("{{tracking_pixel}}", tracking_pixel) + cta_html

            # 4. Optional: Build mockup preview and embed link
            mockup_url = None
            if config.include_mockup and prospect.recommended_service == "website":
                mockup_url = await self.mockup_builder.build_and_upload(prospect)
            
            # 5. Schedule send time
            send_at = self.scheduler.calculate_send_time(
                prospect.city,
                SchedulerConfig(
                    hour_start=config.send_hour_start,
                    hour_end=config.send_hour_end,
                    respect_timezone=config.respect_timezone,
                ),
            )

            # For local/dev: sleep a short time if we're sending in the future
            delay_seconds = max(0, (send_at - datetime.utcnow()).total_seconds())
            if delay_seconds > 0:
                await asyncio.sleep(min(delay_seconds, 30))

            # 6. Send Email
            if mockup_url:
                result = await self.sender.send_with_mockup(email_content, prospect, config, email_id, mockup_url)
            else:
                result = await self.sender.send(email_content, prospect, config, email_id)
            
            # 7. Log & Update
            await self.db.log_outreach(prospect.id, email_content.dict(), result.resend_id)
            await self.db.update_prospect_status(prospect.id, "CONTACTED")
            
            await self.db.log_action("EMAIL_SENT", "SUCCESS", f"Sent to {prospect.email} (Var {variation})")

            # 8. Start engagement polling in background (non-blocking)
            asyncio.create_task(self.tracker.poll_delivery_status(result.resend_id))
            
        except Exception as e:
            self.logger.error(f"Failed to process prospect {prospect.id}: {e}")
            await self.db.log_action("EMAIL_FAILED", "ERROR", f"Prospect {prospect.id}: {e}")
