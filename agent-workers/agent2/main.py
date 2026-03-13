from fastapi import FastAPI, BackgroundTasks, Header, HTTPException, Depends
import asyncio
from pydantic import BaseModel
import httpx

from agent import Agent2
from datetime import datetime
from config import Config

app = FastAPI()
agent = Agent2()
stop_flag = asyncio.Event()
is_running = False
start_time = None

def verify_secret(x_agent_secret: str = Header(None)):
    if not Config.NEXORIS_API_SECRET:
        return
    if x_agent_secret != Config.NEXORIS_API_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid agent secret")

class ProcessProspectRequest(BaseModel):
    prospect_id: int
    owner_id: str | None = None

class ProcessReplyRequest(BaseModel):
    prospect_id: int
    message: str
    channel: str = "email"
    owner_id: str | None = None

@app.post("/start")
async def start_agent(background_tasks: BackgroundTasks, _ = Depends(verify_secret)):
    global is_running, start_time
    if is_running:
        return {"status": "already_running"}
        
    stop_flag.clear()
    is_running = True
    start_time = datetime.now()
    
    background_tasks.add_task(run_agent_task)
    return {"status": "started", "agent": 2}

@app.post("/process-prospect")
async def process_prospect(req: ProcessProspectRequest, background_tasks: BackgroundTasks, _ = Depends(verify_secret)):
    """
    Process a single prospect by ID.
    This endpoint is used when Agent 1 triggers Agent 2.
    """
    background_tasks.add_task(agent.process_prospect_id, req.prospect_id, stop_flag)
    return {"status": "processing", "prospect_id": req.prospect_id}

@app.post("/process-reply")
async def process_reply(req: ProcessReplyRequest, _ = Depends(verify_secret)):
    """
    Forward a client reply to Agent 3 for negotiation handling.
    """
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(
                f"{Config.AGENT3_API_URL.rstrip('/')}/process-reply",
                json={
                    "prospect_id": str(req.prospect_id),
                    "owner_id": req.owner_id,
                    "message": req.message,
                    "channel": req.channel,
                },
                headers={"x-agent-secret": Config.NEXORIS_API_SECRET},
            )
            return {"status": "forwarded", "agent3_status": r.status_code}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/stop")
async def stop_agent(_ = Depends(verify_secret)):
    stop_flag.set()
    return {"status": "stopping", "agent": 2}

@app.get("/status")
async def get_status():
    elapsed = (datetime.now() - start_time).total_seconds() if is_running else 0
    return {
        "is_running": is_running,
        "elapsed_seconds": elapsed
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

async def run_agent_task():
    global is_running
    await agent.run(stop_flag)
    is_running = False
