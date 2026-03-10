from fastapi import FastAPI, BackgroundTasks
import asyncio
from agent import Agent1
from models import AgentStatus
from datetime import datetime

app = FastAPI()
agent = Agent1()
stop_flag = asyncio.Event()
is_running = False
start_time = None

@app.post("/start")
async def start_agent(background_tasks: BackgroundTasks):
    global is_running, start_time
    if is_running:
        return {"status": "already_running"}
        
    stop_flag.clear()
    is_running = True
    start_time = datetime.now()
    
    background_tasks.add_task(run_agent_task)
    return {"status": "started", "agent": 1}

@app.post("/stop")
async def stop_agent():
    stop_flag.set()
    return {"status": "stopping", "agent": 1}

@app.get("/status")
async def get_status():
    elapsed = (datetime.now() - start_time).total_seconds() if is_running else 0
    return AgentStatus(
        is_running=is_running,
        started_at=start_time,
        elapsed_seconds=elapsed
    )

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

async def run_agent_task():
    global is_running
    await agent.run(stop_flag)
    is_running = False
