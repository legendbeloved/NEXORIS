# Agent 2 — Outreach Intelligence Worker

Agent 2 generates and sends personalized outreach emails to prospects discovered by Agent 1.

## What this service does

- Reads prospects from Supabase (status: `DISCOVERED`)
- Generates A/B email variations with Gemini 1.5 Flash
- Optionally builds a lightweight mockup preview (HTML) and uploads to Supabase Storage
- Sends email via Resend
- Logs all actions to `agent_logs` and writes sent emails to `outreach_emails`

## Local setup

1. Copy the env template:

   - Copy `.env.example` to `.env`

2. Fill in required values:

   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_AI_API_KEY`
   - `RESEND_API_KEY`

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the API:

   ```bash
   uvicorn main:app --reload --port 8002
   ```

## API endpoints

- `POST /start` — process queued prospects sequentially
- `POST /stop` — stop gracefully
- `GET /status` — runtime status
- `GET /health` — health check for deployment
- `POST /process-prospect` — process one prospect (used by Agent 1 triggers)
- `POST /process-reply` — forwards client reply to Agent 3 (negotiation)

## Notes

- This worker is designed to keep running even if one prospect fails.
- All secrets must be provided via environment variables. Never hardcode keys.

