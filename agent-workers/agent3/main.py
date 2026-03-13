from datetime import datetime
import asyncio

from fastapi import BackgroundTasks, FastAPI, Header, HTTPException, Depends
from pydantic import BaseModel

from agent import Agent3
from config import Config

app = FastAPI()
agent = Agent3()
stop_flag = asyncio.Event()
is_running = False
started_at: datetime | None = None

def verify_secret(x_agent_secret: str = Header(None)):
    if not Config.NEXORIS_API_SECRET:
        return
    if x_agent_secret != Config.NEXORIS_API_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid agent secret")

class ProcessReplyRequest(BaseModel):
    prospect_id: str
    owner_id: str | None = None
    conversation_id: str | None = None
    message: str | None = None
    channel: str = "email"


@app.post("/process-reply")
async def process_reply(req: ProcessReplyRequest, background_tasks: BackgroundTasks, _ = Depends(verify_secret)):
    """
    Process a client reply for a prospect.
    """
    background_tasks.add_task(
        agent.process_reply,
        int(req.prospect_id),
        req.owner_id,
        req.message,
        req.channel,
    )
    return {"status": "processing"}


@app.post("/start")
async def start(background_tasks: BackgroundTasks, _ = Depends(verify_secret)):
    """
    Start the worker in scheduled mode.

    In production you can extend this to poll for new replies in Supabase.
    """
    global is_running, started_at
    if is_running:
        return {"status": "already_running"}

    stop_flag.clear()
    is_running = True
    started_at = datetime.utcnow()
    background_tasks.add_task(_idle_loop)
    return {"status": "started", "agent": 3}


@app.post("/stop")
async def stop(_ = Depends(verify_secret)):
    stop_flag.set()
    return {"status": "stopping", "agent": 3}


@app.get("/status")
async def status():
    elapsed = (datetime.utcnow() - started_at).total_seconds() if (is_running and started_at) else 0
    return {
        "is_running": is_running,
        "started_at": started_at,
        "elapsed_seconds": elapsed,
    }


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


async def _idle_loop():
    """
    Minimal long-running loop so the worker stays alive in scheduled mode.
    """
    global is_running
    while not stop_flag.is_set():
        await asyncio.sleep(2)
    is_running = False

