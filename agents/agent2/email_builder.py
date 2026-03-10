import os
import json
import random
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_AI_API_KEY"))

SYSTEM_PROMPT = """You are an expert outreach copywriter for {owner_company}.
You write personalized, empathetic cold emails to local business owners.
Your emails feel human, specific, and valuable — never generic or salesy.
You always identify a real problem and offer a concrete solution.
 
Rules:
- Never use: 'I hope this email finds you well'
- Never make up statistics
- Keep emails under 250 words
- Always end with one clear call to action
- Never include markdown wrappers around JSON response."""

def generate_emails(prospect_data: dict, company_context: dict) -> dict:
    sys_prompt = SYSTEM_PROMPT.format(owner_company=company_context.get("name", "our agency"))

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=sys_prompt,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.7, 
            "max_output_tokens": 800
        }
    )

    prompt_a = f"""Write a cold outreach email to {prospect_data.get('business_name')}, a {prospect_data.get('category')} in {prospect_data.get('city')}.
 
Their problems: {', '.join(prospect_data.get('pain_points', []))}
Our solution: {prospect_data.get('recommended_service_description', 'digital growth')}
Owner name: {prospect_data.get('owner_name', 'there')}
Portal link: {prospect_data.get('portal_url')}
 
The email must:
1. Open with one specific observation about their business
2. Explain what this problem is costing them
3. Offer our specific solution
4. End with one CTA linking to their proposal
 
Return JSON: {{ "subject": "...", "body": "..." }}"""

    prompt_b = f"""Same business and context. Write a warmer, curiosity-driven version:
1. Opens with a genuine question about their business goal
2. Connects their problem to that goal
3. Positions our solution as the bridge
4. CTA is softer: 'Would it be okay if I showed you...'
 
Return JSON: {{ "subject": "...", "body": "..." }}"""

    try:
        res_a = model.generate_content(prompt_a)
        res_b = model.generate_content(prompt_b)
        
        email_a = json.loads(res_a.text)
        email_b = json.loads(res_b.text)
        
        return {
            "success": True,
            "variation_a": email_a,
            "variation_b": email_b,
            "prompt_a": prompt_a,
            "prompt_b": prompt_b
        }
        
    except Exception as e:
        print(f"Email generation failed: {e}")
        return {
            "success": False,
            "error": str(e)
        }
