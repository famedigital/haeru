# Hermes skill package (ECCD Pulse)

Artifacts for wiring Hermes Agent + Telegram to this repo’s Pulse API.

## Contents
| File | Purpose |
|---|---|
| [../hermes-skill-prompt.md](../hermes-skill-prompt.md) | System / skill instruction |
| [../hermes-observation-schema.json](../hermes-observation-schema.json) | Ingest JSON Schema |
| [../hermes-hosting-checklist.md](../hermes-hosting-checklist.md) | VPS + BotFather ops |
| [.env.example](./.env.example) | Host-only secrets template |
| [smoke-curl.mjs](./smoke-curl.mjs) | Local API smoke tests (Node) |
| [smoke-curl.sh](./smoke-curl.sh) | Same tests via curl |

## Local Pulse (Vite middleware)

```bash
npm run dev
# API key default: dev-pulse-key
node docs/hermes/smoke-curl.mjs
```

Routes:
- `POST /api/observations/from-hermes`
- `POST /api/media/photo-from-hermes` — Cloudinary URL(s) + caption `@tags` → one moment per child
- `POST /api/moments/:id/confirm` body `{ "role": "facilitator" | "owner" }`
- `GET /api/moments/pending-director`
- `GET /api/parents/child/:childId/moments` (delivered only)
- `GET /api/feeds/classroom/:room/moments` — delivered classroom feed
- `GET /api/feeds/center/moments` — delivered center-wide feed

## Photo path (Phase B)
Telegram photo/video → Cloudinary upload → caption `@ChildName` fan-out → Director confirm → child-scoped feed.
No face recognition. Empty feed when no delivered posts.

## Status machine
`pending_facilitator` → `pending_director` → `delivered` (+ `telegramSimulated`)
