#!/usr/bin/env bash
set -euo pipefail

echo "Running MVP smoke tests (phase 2)"

BASE_URL=${BASE_URL:-http://localhost:3000}
export MVP_ENABLED=true

echo "- Testing login (POST /api/mvp/auth/login)"
curl -s -X POST -H "Content-Type: application/json" -d '{"username":"tester","password":"secret"}' "$BASE_URL/api/mvp/auth/login"

echo "- Testing login status (GET /api/mvp/auth/status with token)"
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"tester","password":"secret"}' "$BASE_URL/api/mvp/auth/login" | grep -o '"token":"[^"}]*' | cut -d '"' -f4 || echo "")
if [ -n "$TOKEN" ]; then
  curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/mvp/auth/status"
else
  echo "- No token received; skipping status check"
fi

echo "- Testing admin users (GET /api/mvp/admin/users)"
curl -s "$BASE_URL/api/mvp/admin/users"

echo "- Testing prospects import/export (POST /api/mvp/prospects/import, GET /api/mvp/prospects/export)"
curl -s -X POST -H "Content-Type: application/json" -d '{"prospects":[{"name":"TestCo","website":"https://example.test","category":"Testing"}]}' "$BASE_URL/api/mvp/prospects/import"
curl -s "$BASE_URL/api/mvp/prospects/export"

echo "Done"
