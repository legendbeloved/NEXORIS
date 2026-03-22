#!/usr/bin/env bash
set -euo pipefail

echo "Running MVP smoke tests (phase 2)"

BASE_URL=${BASE_URL:-http://localhost:3000}
export MVP_ENABLED=true

echo "- Testing login (POST /api/mvp/auth/login)"
curl -s -X POST -H "Content-Type: application/json" -d '{"username":"tester","password":"secret"}' "$BASE_URL/api/mvp/auth/login" | python -m json.tool || true

echo "- Testing login status (GET /api/mvp/auth/status with token)"
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"tester","password":"secret"}' "$BASE_URL/api/mvp/auth/login" | grep -o '"token":"[^"}]*' | cut -d '"' -f4 || echo "")
if [ -n "$TOKEN" ]; then
  curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/mvp/auth/status" | python -m json.tool
else
  echo "- No token received; skipping status check"
fi

echo "- Testing admin users (GET /api/mvp/admin/users)"
curl -s "$BASE_URL/api/mvp/admin/users" | python -m json.tool || true

echo "- Testing prospects import/export (POST /api/mvp/prospects/import, GET /api/mvp/prospects/export)"
curl -s -X POST -H "Content-Type: application/json" -d '{"prospects":[{"name":"TestCo","website":"https://example.test","category":"Testing"}]}' "$BASE_URL/api/mvp/prospects/import" | python -m json.tool || true
curl -s "$BASE_URL/api/mvp/prospects/export" | python -m json.tool || true

echo "Done"
