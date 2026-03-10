import google.generativeai as genai
import json
from models import AIAnalysisResult
from config import Config

class AIAnalyzer:
    """Analyze businesses using Google Gemini."""

    def __init__(self):
        genai.configure(api_key=Config.GOOGLE_AI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    async def analyze(self, business: Dict, presence: Dict) -> AIAnalysisResult:
        """Generate analysis report using Gemini."""
        
        system_prompt = """
        You are an expert digital marketing consultant analyzing a local business.
        Identify critical gaps in their online presence that impact revenue.
        Be specific, actionable, and data-driven.
        Output MUST be valid JSON with keys: "score", "pain_points", "analysis", "recommended_service".
        """
        
        user_prompt = f"""
        Business: {business.get('name')}
        Category: {business.get('types', [])}
        Website: {business.get('website', 'None')}
        Google Rating: {business.get('rating')} ({business.get('user_ratings_total')} reviews)
        
        Digital Presence Audit:
        - Website Exists: {presence.website_exists}
        - Load Time: {presence.load_time_ms}ms
        - SSL Secure: {presence.has_ssl}
        - Social Media: {json.dumps(presence.social_media)}
        - GMB Completeness: {presence.google_completeness}/100
        
        Analyze this business for outreach worthiness.
        """
        
        try:
            response = self.model.generate_content(
                contents=[{"role": "user", "parts": [system_prompt, user_prompt]}],
                generation_config={"response_mime_type": "application/json"}
            )
            
            result = json.loads(response.text)
            return AIAnalysisResult(
                score=result.get("score", 0),
                pain_points=result.get("pain_points", []),
                analysis=result.get("analysis", ""),
                recommended_service=result.get("recommended_service", "website")
            )
            
        except Exception as e:
            print(f"AI Analysis Error: {e}")
            return AIAnalysisResult(
                score=0,
                pain_points=["Analysis Failed"],
                analysis=f"Error analyzing business: {str(e)}",
                recommended_service="consultation"
            )
