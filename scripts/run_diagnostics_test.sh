#!/usr/bin/env bash
set -euo pipefail

PORT=${NEXORIS_API_PORT:-3000}
URL="http://localhost:$PORT/api/diagnostics"

echo "Running diagnostics against $URL"
RESP=$(curl -sS "$URL")
echo "Response:"
if command -v jq >/dev/null 2>&1; then
  echo "$RESP" | jq
else
  echo "$RESP"
fi

echo
echo "How to interpret:\n- ok: true means required env vars exist.\n- connectivity.ok: true means a basic Supabase ping succeeded.\n- serviceReady: ok && connectivity.ok."
