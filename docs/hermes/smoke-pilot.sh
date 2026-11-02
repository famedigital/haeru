#!/usr/bin/env bash
# Haeru Voice AI pilot smoke — API health + Director queue + webhook status
set -euo pipefail
BASE="${PULSE_API_URL:-http://127.0.0.1:3000}"
KEY="${PULSE_API_KEY:-dev-pulse-key}"
CENTRE="${DEFAULT_CENTRE_ID:-WSH}"

echo "== health =="
curl -fsS "$BASE/health" | tee /tmp/haeru-health.json
echo

echo "== webhook status =="
curl -fsS -H "X-Pulse-Key: $KEY" "$BASE/api/telegram/webhook-status" | tee /tmp/haeru-webhook.json
echo

echo "== pending director ($CENTRE) =="
curl -fsS -H "X-Pulse-Key: $KEY" -H "X-Centre-Code: $CENTRE" \
  "$BASE/api/moments/pending-director" | tee /tmp/haeru-pending.json
echo

echo "OK · pilot smoke finished"
