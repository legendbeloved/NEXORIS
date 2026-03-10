import google.generativeai as genai
import json
import logging
from pathlib import Path
from typing import Any, Dict

from config import Config
from models import Prospect, Agent2Config, EmailContent

class EmailGenerator:
    """Generate personalized emails using Gemini."""

    def __init__(self):
        genai.configure(api_key=Config.GOOGLE_AI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.logger = logging.getLogger("agent2.generator")

    async def generate(self, prospect: Prospect, config: Agent2Config, variation: str) -> EmailContent:
        """Generate email content for a specific variation."""
        
        system_prompt = f"""
        You are an expert sales copywriter for NEXORIS, an AI automation agency.
        Your goal is to write a high-converting cold email to a local business owner.
        
        Tone: {"Friendly and helpful" if variation == "A" else "Professional and direct"}
        Goal: Get them to book a free consultation or reply.
        Sender: {config.sender_name}
        
        Constraints:
        - Keep it under 150 words.
        - Focus on their specific pain points.
        - No fluff, no jargon.
        - Output MUST be valid JSON with keys: "subject", "body_text", "body_html".
        """
        
        user_prompt = f"""
        Prospect: {prospect.business_name} ({prospect.category}) in {prospect.city}
        Pain Points: {', '.join(prospect.pain_points)}
        Recommended Service: {prospect.recommended_service}
        Website: {prospect.website or 'None'}
        
        Write an email pitching our {prospect.recommended_service} solution.
        Mention 1 specific pain point.
        """
        
        if config.custom_instructions:
            user_prompt += f"\nAdditional Instructions: {config.custom_instructions}"

        try:
            response = self.model.generate_content(
                contents=[{"role": "user", "parts": [system_prompt, user_prompt]}],
                generation_config={"response_mime_type": "application/json"}
            )
            
            data = json.loads(response.text)
            subject = data.get("subject", f"Question about {prospect.business_name}")
            body_text = data.get("body_text", "") or ""
            body_html = data.get("body_html", "") or ""

            if not body_html and body_text:
                body_html = f"<p>{body_text.replace(chr(10), '<br>')}</p>"

            body_html = self._wrap_with_base_template(
                subject=subject,
                body_html=body_html,
                city=prospect.city,
                tracking_pixel="{{tracking_pixel}}",
            )

            return EmailContent(
                subject=subject,
                body_text=body_text,
                body_html=body_html,
                variation=variation
            )
            
        except Exception as e:
            self.logger.error(f"Email generation failed: {e}")
            return self._fallback_template(prospect, variation)

    def _fallback_template(self, prospect: Prospect, variation: str) -> EmailContent:
        """Safe fallback if AI fails."""
        subject = f"Quick question for {prospect.business_name}"
        body = f"Hi,\n\nI noticed some issues with your online presence that might be costing you customers. We help businesses in {prospect.city} fix this.\n\nAre you open to a quick chat?\n\nBest,\nNEXORIS Team"
        body_html = f"<p>{body.replace(chr(10), '<br>')}</p>"
        body_html = self._wrap_with_base_template(
            subject=subject,
            body_html=body_html,
            city=prospect.city,
            tracking_pixel="{{tracking_pixel}}",
        )

        return EmailContent(
            subject=subject,
            body_text=body,
            body_html=body_html,
            variation=variation
        )

    def _wrap_with_base_template(self, subject: str, body_html: str, city: str, tracking_pixel: str) -> str:
        """
        Wrap the email body in our shared HTML shell.

        We intentionally use very simple string replacement so new developers
        can understand it without learning a templating library.
        """
        try:
            template_path = Path(__file__).resolve().parents[1] / "templates" / "email_base.html"
            template = template_path.read_text(encoding="utf-8")
        except Exception:
            template = "{{body_html}}{{tracking_pixel}}"

        return (
            template
            .replace("{{subject}}", subject)
            .replace("{{body_html}}", body_html)
            .replace("{{city}}", city)
            .replace("{{tracking_pixel}}", tracking_pixel)
        )
