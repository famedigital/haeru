# Hermes + Telegram hosting checklist (your VPS)

Use this when wiring the real Hermes Agent to Bhutan ECCD Pulse. Thin-slice demo stubs the same JSON; production posts to Pulse API.

**Skill package:** see [`docs/hermes/README.md`](./hermes/README.md) for env template + `smoke-curl.sh`. Local Vite serves the same `/api/*` routes Hermes will call.

## 1. VPS prerequisites

- [ ] Always-on Linux VPS (2+ GB RAM recommended)
- [ ] Outbound HTTPS to Telegram + your LLM provider
- [ ] Optional: reverse proxy (Caddy/Nginx) with TLS if using **webhook** mode
- [ ] Firewall: allow SSH; open 443 only if webhook

Long-polling is fine on an always-on VPS. Prefer webhook if you later move to sleep-friendly PaaS.

## 2. Install Hermes Agent

Follow current Hermes docs for your host, then:

```bash
hermes gateway setup
```

- Select **Telegram**
- Paste BotFather token
- Add facilitator Telegram user IDs to allowlist (`TELEGRAM_ALLOWED_USERS`)

Start / install as a service:

```bash
hermes gateway
# or
hermes gateway install
hermes gateway start
hermes gateway status
```

## 3. Secrets (host only — never in the frontend)

Store in `~/.hermes/.env` or your process manager env:

| Variable | Purpose |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Staff capture bot (and/or parent delivery bot) |
| `TELEGRAM_ALLOWED_USERS` | Comma-separated staff Telegram user IDs |
| LLM / Nous / OpenRouter keys | Model access |
| `PULSE_API_URL` | e.g. `https://pulse.example.bt/api` |
| `PULSE_API_KEY` | Shared secret for Hermes → Pulse |

## 4. Telegram topology (recommended)

| Bot / channel | Who | Purpose |
|---|---|---|
| Staff bot | Facilitators only | Voice notes, photos, confirm prompts |
| Parent bot or DMs | Guardians allowlisted per child | Child-scoped Moments only |

Never broadcast a center-wide media dump to all parents.

## 5. Hermes → Pulse contract

After voice transcription + extraction, Hermes POSTs JSON matching [`hermes-observation-schema.json`](./hermes-observation-schema.json) to:

`POST {PULSE_API_URL}/observations/from-hermes`

Pulse creates a **pending** Moment. Facilitator confirms in app or via Telegram callback:

`POST {PULSE_API_URL}/moments/{id}/confirm`

Then Pulse pushes a parent-safe message to linked guardians.

## 6. Skill / prompt

Load [`hermes-skill-prompt.md`](./hermes-skill-prompt.md) as a Hermes skill or system instruction for ECCD observation extraction.

## 7. Smoke test

1. Facilitator sends a 20-second English or Dzongkha voice note naming one enrolled child
2. Hermes returns structured JSON with `childName`, `domain`, `milestone`, `parentSafeTitle/Desc`
3. Pulse stores Observation + pending Moment
4. Confirm → guardian for that child receives Telegram message; other parents do not

## 8. Ops

- [ ] Log rotation for gateway
- [ ] Disk quota for media (Phase B+)
- [ ] Backup Postgres
- [ ] Rotate bot token if leaked (`/revoke` in BotFather)
