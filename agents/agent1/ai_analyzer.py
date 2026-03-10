import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_AI_API_KEY"))

SYSTEM_PROMPT = """You are a digital marketing analyst specializing in identifying growth
opportunities for small local businesses. You evaluate businesses objectively
based on their current digital presence and recommend relevant solutions.
Always respond in valid JSON format only. No explanations."""

def analyze_business(business_data: dict) -> dict:
    prompt = f"""Analyze this local business and identify their digital weaknesses.
Score their outreach worthiness from 0-100.
 
Business data:
Name: {business_data.get('business_name')}
Category: {business_data.get('category')}
City: {business_data.get('city')}
Has website: {business_data.get('has_website')}
Website load time: {business_data.get('load_time_ms')}ms
Google rating: {business_data.get('google_rating')} ({business_data.get('review_count')} reviews)
Has Facebook: {business_data.get('has_facebook')}
Has Instagram: {business_data.get('has_instagram')}
Has Google Business Profile: {business_data.get('has_gbp')}
Phone available: {business_data.get('has_phone')}
Email available: {business_data.get('has_email')}
 
Respond ONLY in this exact JSON format:
{{
  "pain_points": ["no_website", "no_social", "low_engagement", "no_automation", "poor_seo", "no_reviews"],
  "score": 85,
  "analysis": "Two sentences max. Specific to this business.",
  "recommended_service": "website",
  "reasoning": "One sentence on why this score."
}}"""

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPT,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.2, 
            "max_output_tokens": 800
        }
    )
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        if "analysis" in result and len(result["analysis"]) > 500:
            result["analysis"] = result["analysis"][:497] + "..."
        return result
    except Exception as e:
        print(f"AI Analysis failed: {e}")
        return {
            "pain_points": [],
            "score": 0,
            "analysis": "Analysis failed",
            "recommended_service": "website",
            "reasoning": str(e)
        }
