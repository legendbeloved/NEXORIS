import os
import requests
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
import ai_negotiator

app = FastAPI(title="NEXORIS Agent 3: Negotiation Engine")

SECRET = os.getenv("AGENT_WORKER_SECRET", "generate_a_long_random_secret")
NEXTJS_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")

class StartRequest(BaseModel):
    owner_id: str

@app.post("/api/agents/3/start")
def start_agent(request: StartRequest, x_agent_secret: str = Header(None)):
    if x_agent_secret != SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    notify_backend({
        "owner_id": request.owner_id,
        "action": "NEGOTIATE",
        "agent_number": 3,
        "status": "RUNNING",
        "details": {"message": "Agent 3 negotiation loop started"}
    })
    
    return {"status": "started"}

@app.post("/api/agents/3/stop")
def stop_agent(request: StartRequest, x_agent_secret: str = Header(None)):
    if x_agent_secret != SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"status": "stopped"}

@app.get("/api/agents/3/status")
def get_status():
    return {"is_active": True, "agent": 3}

class NotifyRequest(BaseModel):
    action: str
    prospect_id: str
    conversation_id: str = None

@app.post("/api/internal/agent/notify")
def handle_internal_notification(request: NotifyRequest, x_agent_secret: str = Header(None)):
    if x_agent_secret != SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if request.action in ["NEW_REPLY", "NEW_PORTAL_MESSAGE"]:
        print(f"Triggered Agent 3 for prospect {request.prospect_id}")
        
    return {"status": "received"}

def notify_backend(payload: dict):
    try:
        requests.post(
            f"{NEXTJS_URL}/api/internal/agent/notify",
            json=payload,
            headers={"x-agent-secret": SECRET}
        )
    except Exception as e:
        print(f"Failed to notify backend: {e}")
