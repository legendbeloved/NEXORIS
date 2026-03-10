# Agent 3 — Negotiation & Delivery Worker

Agent 3 handles client replies, negotiates within owner guardrails, books meetings, and generates Stripe payment links.

## What this service does

- Loads prospect + conversation history from Supabase
- Uses Gemini to classify reply intent and produce structured negotiation outputs
- Books meetings via Cal.com when requested
- Creates Stripe Checkout payment links when a deal is agreed
- Writes logs to `agent_logs` and owner alerts to `notifications`

## Local setup

1. Copy `.env.example` → `.env`
2. Fill these required variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_AI_API_KEY`
   - `RESEND_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `CAL_COM_API_KEY`
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run:

   ```bash
   uvicorn main:app --reload --port 8003
   ```

## API endpoints

- `POST /process-reply` — process a prospect reply (primary entrypoint)
- `POST /start` — optional scheduled mode (keeps worker alive)
- `POST /stop` — graceful stop signal
- `GET /status` — runtime status
- `GET /health` — health check for Railway

## Notes

- All actions are guarded by try/except so one bad message never halts the worker.
- Stripe/Cal.com calls are wrapped in error handling and owner escalation paths.

