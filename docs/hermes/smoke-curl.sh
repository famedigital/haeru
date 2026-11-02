#!/usr/bin/env bash
# Smoke test Pulse HTTP binder (npm run dev must be running)
set -euo pipefail
BASE="${PULSE_API_URL:-http://127.0.0.1:5173/api}"
KEY="${PULSE_API_KEY:-dev-pulse-key}"
HDR=(-H "Content-Type: application/json" -H "X-Pulse-Key: ${KEY}")

echo "== ingest =="
INGEST=$(curl -sS "${HDR[@]}" -d '{
  "childId": "c1",
  "childName": "Kinley Wangchuk",
  "domain": "Social & emotional",
  "trigger": "Resource sharing boundary",
  "strategy": "Calm Dzongkha prompt",
  "milestone": "Shares play materials after soft prompt",
  "confidence": "96% · MoESD ELDS 3.2",
  "source": "voice",
  "transcription": "Kinley shared blocks with a classmate.",
  "parentSafeTitle": "Kinley sharing moment",
  "parentSafeDesc": "Kinley offered blocks to a classmate after a calm prompt."
}' "${BASE}/observations/from-hermes")
echo "$INGEST"
MOM=$(echo "$INGEST" | sed -n 's/.*"id":"\(mom_[^"]*\)".*/\1/p' | head -1)
if [[ -z "${MOM}" ]]; then
  MOM=$(node -e "const j=JSON.parse(process.argv[1]); if(!j.ok) process.exit(1); console.log(j.data.moment.id)" "$INGEST")
fi

echo "== facilitator confirm → director =="
curl -sS "${HDR[@]}" -d '{"role":"facilitator"}' "${BASE}/moments/${MOM}/confirm"
echo

echo "== owner confirm → delivered =="
curl -sS "${HDR[@]}" -d '{"role":"owner"}' "${BASE}/moments/${MOM}/confirm"
echo

echo "== parent moments c1 =="
curl -sS -H "X-Pulse-Key: ${KEY}" "${BASE}/parents/child/c1/moments"
echo
