#!/usr/bin/env bash
set -euo pipefail

# Root of repo
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)

load_env() {
  local agent_dir="$ROOT_DIR/agent-workers/$1"
  local env_file="$agent_dir/.env"
  if [[ -f "$env_file" ]]; then
    set -a
    while IFS='=' read -r key value; do
      # skip comments and empty lines
      if [[ -z "$key" ]] || [[ "$key" == \"#"* ]]; then continue; fi
      key=$(echo "$key" | xargs)
      value=$(echo "$value" | sed 's/^[ \t]*//; s/[ \t]*$//')
      if [[ -n "$key" ]]; then
        export "$key"="$value"
      fi
    done < "$env_file"
    set +a
  fi
}

start_agent() {
  local name="$1" port="$2"
  load_env "$name"
  local dir="$ROOT_DIR/agent-workers/$name"
  if [[ -d "$dir" ]]; then
    echo "Starting $name on port $port with env from $dir/.env"
    (cd "$dir" && python -m uvicorn main:app --reload --port "$port" --host 0.0.0.0) &
  else
    echo "Agent directory not found: $dir" >&2
  fi
}

start_agent "agent1" 8001
start_agent "agent2" 8002
start_agent "agent3" 8003

echo "All agents started."
