import logging
from datetime import datetime
from typing import Optional

from config import Config
from models import Prospect


class MockupBuilder:
    """
    Builds a lightweight HTML mockup preview and uploads it to Supabase Storage.

    AGENTS.md describes a screenshot workflow. To keep this agent easy to run
    locally (free-tier friendly), we generate a simple HTML preview and upload it
    as a .html asset. You can later swap this for a PNG screenshot pipeline.
    """

    def __init__(self, supabase_client):
        self.client = supabase_client
        self.logger = logging.getLogger("agent2.mockup")

    async def build_and_upload(self, prospect: Prospect) -> Optional[str]:
        """
        Create a simple mockup HTML and upload it. Returns a public URL or None.
        """
        html = self._build_html(prospect)
        path = f"mockups/{prospect.id}_{int(datetime.utcnow().timestamp())}.html"

        try:
            bucket = self.client.storage.from_("mockups")
            bucket.upload(
                path=path,
                file=html.encode("utf-8"),
                file_options={"content-type": "text/html; charset=utf-8", "upsert": True},
            )
            public = bucket.get_public_url(path)
            return public
        except Exception as e:
            self.logger.error(f"Mockup upload failed: {e}")
            return None

    def _build_html(self, prospect: Prospect) -> str:
        title = f"{prospect.business_name} — {prospect.recommended_service.title()} Concept"
        accent = "#5B4CF5" if prospect.recommended_service == "website" else "#00D4FF"
        pain = prospect.pain_points[0] if prospect.pain_points else "More leads, better conversions"

        return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <style>
      body {{ margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; background:#08091A; color:#e5e7eb; }}
      .wrap {{ max-width: 980px; margin: 0 auto; padding: 48px 18px; }}
      .card {{ background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); border-radius: 18px; padding: 24px; }}
      .badge {{ display:inline-block; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: {accent}; background: rgba(91,76,245,0.12); padding: 8px 10px; border-radius: 999px; border: 1px solid rgba(91,76,245,0.22); }}
      .title {{ font-size: 34px; font-weight: 800; margin: 14px 0 10px 0; line-height: 1.1; }}
      .muted {{ color: #9ca3af; }}
      .grid {{ display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 14px; margin-top: 18px; }}
      .panel {{ background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px; }}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <span class="badge">NEXORIS PREVIEW</span>
        <div class="title">{prospect.business_name}</div>
        <div class="muted">Prepared concept for {prospect.city} · {prospect.category}</div>
        <div class="grid">
          <div class="panel">
            <div style="font-weight:700;margin-bottom:6px;">What we’d fix first</div>
            <div class="muted">{pain}</div>
            <div style="height:12px;"></div>
            <div style="font-weight:700;margin-bottom:6px;">Proposed solution</div>
            <div class="muted">{prospect.recommended_service.title()} upgrade — mobile-first, performance optimized, conversion focused.</div>
          </div>
          <div class="panel">
            <div style="font-weight:700;margin-bottom:10px;">Mission-ready checklist</div>
            <ul class="muted" style="margin:0;padding-left:18px;line-height:1.7;">
              <li>Clear offer + CTA</li>
              <li>Fast load time</li>
              <li>Trust elements</li>
              <li>Lead capture</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>"""

