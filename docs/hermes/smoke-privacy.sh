#!/usr/bin/env bash
# Privacy assertions for Haeru Voice AI parent delivery payloads
set -euo pipefail
BASE="${PULSE_API_URL:-http://127.0.0.1:3000}"
KEY="${PULSE_API_KEY:-dev-pulse-key}"
CHILD_ID="${CHILD_ID:-}"

if [[ -z "$CHILD_ID" ]]; then
  echo "Set CHILD_ID to a delivered child's id to inspect parent moments"
  exit 1
fi

echo "== parent moments for $CHILD_ID =="
BODY=$(curl -fsS -H "X-Pulse-Key: $KEY" "$BASE/api/parents/child/$CHILD_ID/moments")
echo "$BODY" | tee /tmp/haeru-parent-moments.json

# Fail if payload appears to dump multi-child classroom names (heuristic)
if echo "$BODY" | grep -Eiq 'classmate [A-Z][a-z]+ [A-Z]|and [A-Z][a-z]+ [A-Z][a-z]+'; then
  echo "FAIL · possible peer name leak in parent payload"
  exit 2
fi

echo "OK · no obvious peer-name leak heuristics triggered"
