import os
import requests
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
import email_builder

app = FastAPI(title="NEXORIS Agent 2: Outreach Intelligence Engine")

SECRET = os.getenv("AGENT_WORKER_SECRET", "generate_a_long_random_secret")
NEXTJS_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")

class StartRequest(BaseModel):
    owner_id: str

@app.post("/api/agents/2/start")
def start_agent(request: StartRequest, x_agent_secret: str = Header(None)):
    if x_agent_secret != SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    notify_backend({
        "owner_id": request.owner_id,
        "action": "SEND_EMAIL",
        "agent_number": 2,
        "status": "RUNNING",
        "details": {"message": "Agent 2 outreach loop started"}
    })
    
    return {"status": "started"}

@app.post("/api/agents/2/stop")
def stop_agent(request: StartRequest, x_agent_secret: str = Header(None)):
    if x_agent_secret != SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"status": "stopped"}

@app.get("/api/agents/2/status")
def get_status():
    return {"is_active": True, "agent": 2}

def notify_backend(payload: dict):
    try:
        requests.post(
            f"{NEXTJS_URL}/api/internal/agent/notify",
            json=payload,
            headers={"x-agent-secret": SECRET}
        )
    except Exception as e:
        print(f"Failed to notify backend: {e}")
