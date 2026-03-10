# Agent 1 — Business Discovery Worker

Agent 1 searches for businesses, analyzes their digital presence, and creates qualified prospects in Supabase.

## What this service does

- Queries Google Places API for businesses by city + category
- Checks website + basic social presence (if website exists)
- Uses Gemini 1.5 Flash to generate a score + pain points
- Saves qualified prospects to Supabase and logs actions to `agent_logs`

## Local setup

1. Copy `.env.example` → `.env`
2. Fill required variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_PLACES_API_KEY`
   - `GOOGLE_AI_API_KEY`
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run:

   ```bash
   uvicorn main:app --reload --port 8001
   ```

## API endpoints

- `POST /start` — start scanning using the active config
- `POST /stop` — stop gracefully
- `GET /status` — runtime status
- `GET /health` — health check for Railway

## Notes

- The agent continues even if one business fails analysis.
- Keys should be provided via environment variables only.

