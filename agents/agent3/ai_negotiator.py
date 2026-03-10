import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_AI_API_KEY"))

SYSTEM_PROMPT = """You are a professional sales consultant for {owner_company}.
You have authority to negotiate pricing within these hard limits:
 
HARD RULES — NEVER BREAK:
- Never quote below the minimum price: ${min_price}
- Never offer more than {max_discount_pct}% discount
- Never promise a deadline shorter than {min_days} days
- Stay polite and professional at all times
- If asked something outside your authority, say:
  'Let me check with my team and get back to you.'
- When price is agreed, say exactly:
  'Great! I will send you the payment link now.'
 
Services available: {services_json}
Keep responses under 150 words. Sound human, not robotic."""

def negotiate_response(client_message: str, history: list, context: dict) -> dict:
    sys_prompt = SYSTEM_PROMPT.format(
        owner_company=context.get("name", "our agency"),
        min_price=context.get("min_price", 500),
        max_discount_pct=context.get("max_discount_pct", 20),
        min_days=context.get("min_days", 7),
        services_json=json.dumps(context.get("services", []))
    )

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=sys_prompt,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.4, 
            "max_output_tokens": 400
        }
    )

    prompt = f"""Conversation history: {json.dumps(history)}
 
Client's latest message: {client_message}
 
Business: {context.get('business_name')}, {context.get('category')} in {context.get('city')}
Pain points: {', '.join(context.get('pain_points', []))}
 
Respond to their latest message naturally.
 
Return JSON:
{{
  "response": "Your reply here",
  "action": "continue"|"agreed"|"book_meeting"|"send_payment"|"escalate"|"declined",
  "agreed_price": null,
  "escalation_reason": null
}}"""

    try:
        res = model.generate_content(prompt)
        return json.loads(res.text)
    except Exception as e:
        print(f"Negotiation failed: {e}")
        return {
            "response": "Let me check with my team and get back to you.",
            "action": "escalate",
            "agreed_price": None,
            "escalation_reason": str(e)
        }
