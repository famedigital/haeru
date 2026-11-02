# Haeru Pilot — Live Voice AI (Hermes) Gemini Planning Brief

**Document:** `docs/HAERU_PILOT_LIVE_HERMES_GEMINI_BRIEF.md`  
**Audience:** Gemini (planning) → Cursor Composer (implementation)  
**Product:** **Haeru** (software / brand)  
**Demo client:** Wangchuk’s School of Heroes (WSH), Babesa, Thimphu — *not* the brand  
**Date context:** 2026-11-02  

---

## 0. Why this brief exists

Read this **in full**, then produce a **Cursor-ready implementation plan** (phased tasks, file map, acceptance tests, deploy checklist). Do **not** invent a second product. Do **not** treat the marketing simulator as “done.”

**North-star truth (operator):**  
If Haeru Voice AI on Telegram does not work end-to-end in a real pilot, this project is a waste. ECCD centres will not adopt another portal. Apps like **eccd.bt** shipped and flopped because they did not kill teacher paperwork. **Haeru’s only non-negotiable highlight is: speak on Telegram → structured ELDS + care → Director gate → child-scoped parent delivery.**

Internal codename for the pipeline: **Hermes**.  
Customer-facing name: **Haeru Voice AI** / **Haeru on Telegram** / bot **`@HaeruEccdBot`** (or a pilot bot handle).  
**Never** brand “Hermes” to parents, schools, or landing copy.

---

## 1. Decisions already made (lock these)

| Decision | Choice |
|---|---|
| Pilot vs production | **Pilot test only** — prove one room at WSH, not multi-tenant SaaS finish |
| Domain purchase | **None for now** — use free HTTPS hostname |
| Host | **DigitalOcean droplet `famedigital`** (`165.22.211.20`, blr1) **alongside** production Innora |
| Orchestration | Existing **Coolify 4.5.3 + Traefik** on that droplet |
| Isolation | New Coolify **application** + own hostname + own DB volume/env — **do not** touch Innora compose, Supabase, or `innorahotel.com` |
| Free PaaS sleep hosts for the bot | Rejected as primary bot host (Render-style sleep breaks Telegram) |
| Separate new VM | Deferred — allowed later if Whisper/CPU stresses Innora |
| SQLite forever | Pilot may start SQLite **on a persistent volume**, but plan Postgres (Neon or container) if Coolify multi-instance or durability needs it |
| Live Telegram | **Required for pilot success** — simulator alone is insufficient |
| CCTV / MoESD SSO / BotFather “Phase C” extras | Out of pilot scope unless needed for webhook |

### Free hostname (no domain)

Prefer Coolify / sslip patterns already used on this host, e.g.:

- `haeru.165-22-211-20.sslip.io`  
- or Coolify-generated SSL host  

Telegram webhook must be:

`https://<that-host>/api/telegram/webhook` (exact path TBD by plan — keep stable)

Railway `*.up.railway.app` is an **alternative** if DO coexistence is blocked; default plan assumes **Coolify on famedigital**.

---

## 2. Droplet inventory (do not break)

| Item | Notes |
|---|---|
| Droplet | famedigital · ID 600273456 · Ubuntu 24.04 · 4 vCPU · ~8 GiB RAM · Docker 29.x |
| Production app | **innora** (`innora:local`) · Traefik ← `innorahotel.com` |
| Also running | Coolify stack, self-hosted Supabase (ports 8001, 5432/6543, etc.) |
| Public | 80/443 Traefik, 8000 Coolify UI, 22 SSH |
| Repo on server (Innora) | `/opt/pelbu-hotel` — **unrelated** to Haeru |

**Resource rule:** Cap Haeru container CPU/RAM in Coolify. Prefer **cloud STT API** (Whisper-compatible) over local large Whisper models on this box so Innora stays stable.

**Supabase on this droplet:** Leave it for Innora/other apps. Haeru pilot should **not** depend on that Supabase unless the plan explicitly migrates auth (not required).

---

## 3. Product definition of “Hermes works” (pilot DoD)

A facilitator at WSH Kindergarten must be able to:

1. Open Telegram → send a **real voice note** to the pilot Haeru bot.  
2. Within seconds, audio is transcribed (EN + light Dzongkha colloquial OK).  
3. System extracts: child identity, care signals (meal/nap/mood), MoESD ELDS domain(s) + rating `ap` \| `bl` \| `nya`.  
4. Observation appears in **Director review queue** (not delivered yet).  
5. Director **1-tap confirms**.  
6. Parent of that child only sees a **child-scoped** reflection (peer names scrubbed).  

**Fail conditions (treat as P0 bugs):**

- Voice note accepted but nothing in Director queue  
- Parent sees another child’s name  
- Observation reaches parent **before** Director confirm  
- Bot dead after Coolify redeploy / webhook lost  
- Secrets leaked into frontend or git  

Marketing `HaeruVoiceDemo` stays as sales UI; it is **not** a substitute for the live path.

---

## 4. Canonical repo references (read before planning)

| Doc / artifact | Why |
|---|---|
| `AGENTS.md` / `.cursor/rules/*` | Enterprise score gate, dual-theme, no bare `text-white` on frost, no `rotateX/Y`, caregiver no fees |
| `docs/hermes-observation-schema.json` | Ingest contract — Zod at API boundary |
| `docs/hermes/README.md` | Existing Pulse routes + status machine |
| `docs/hermes-hosting-checklist.md` | VPS/BotFather checklist (adapt to Coolify) |
| `docs/hermes-skill-prompt.md` | Agent skill instructions |
| `docs/brand/TELEGRAM_HERMES_HAERU_SPEC.md` | Pain → solution narrative + feature catalog |
| `docs/architecture.md` / `docs/CURSOR_BUILD_PLAN.md` | System shape |
| `vite.config.ts` | Current `/api/*` Vite middleware (dev) |
| `src/components/facilitator/VoiceHub.tsx` | Staff UI stub |
| `src/components/marketing/HaeruVoiceDemo.tsx` | Simulator only |
| `backend/prisma/schema.prisma` | Today: SQLite |

### Existing API surface to extend (do not fork blindly)

- `POST /api/observations/from-hermes`  
- `POST /api/media/photo-from-hermes`  
- `POST /api/moments/:id/confirm`  
- `GET /api/moments/pending-director`  
- `GET /api/parents/child/:childId/moments` (delivered only)  

Status machine: `pending_facilitator` → `pending_director` → `delivered`.

---

## 5. Target architecture for pilot (propose refinements, don’t ignore)

```
Telegram (facilitator)
    → HTTPS webhook (Coolify Traefik → Haeru service)
        → Bot worker (validate secret, download voice file)
            → STT (cloud Whisper API)
            → Extractor (LLM or rules → hermes-observation-schema.json)
                → POST Pulse /api/observations/from-hermes
                    → Director queue in Haeru UI
                        → Confirm → parent child-scoped feed
```

**Packaging preference for Coolify:**

- One deployable unit initially: **Node server that serves Vite `dist/` + Pulse API + Telegram webhook** (simplest ops).  
- Optional later split: `web` + `worker` if STT jobs block HTTP.

**Must plan:**

- Dockerfile (repo currently has none)  
- Coolify env vars (no secrets in image)  
- Persistent volume for SQLite **or** Postgres service  
- Healthcheck + webhook re-register on boot  
- Allowlist of facilitator Telegram user IDs  

---

## 6. Brand & UX constraints (non-negotiable)

- Product name: **Haeru**; WSH is the **client**.  
- Customer copy: **Haeru Voice AI** / **@HaeruEccdBot** — never “Hermes” in UI strings.  
- Dual theme: `text-slate-900 dark:text-white` (and muted variants) — zero bare `text-white` on frosted glass.  
- Currency Nu.; ELDS ratings only `ap` \| `bl` \| `nya`.  
- Caregiver must never see fees.  
- Prismatic rainbow UI tokens already in `src/index.css` — preserve, don’t revert to mono-green.

---

## 7. Explicitly out of pilot scope

- Live CCTV / face recognition  
- MoESD SSO  
- Multi-centre SaaS billing polish  
- Replacing Innora or sharing Innora Supabase  
- Buying a custom domain  
- Perfect Dzongkha ASR  
- Local GPU Whisper on famedigital  

---

## 8. What Gemini must output

Produce a single planning document for Cursor, saved conceptually as:

`docs/superpowers/plans/YYYY-MM-DD-haeru-pilot-live-voice-ai.md`

### Required plan sections

1. **Executive summary** — 5 bullets max; Hermes-first pilot on Coolify/sslip.  
2. **Success metrics** — teacher time, Director confirm latency, zero peer leaks in test script.  
3. **Architecture diagram** — mermaid OK.  
4. **Phased build** (each phase shippable):  
   - Phase P0: Production container (Dockerfile, serve SPA+API, Coolify, sslip HTTPS, health)  
   - Phase P1: Telegram webhook + allowlist + voice download + STT stub/real  
   - Phase P2: Schema-valid extract → Director queue → confirm → parent feed  
   - Phase P3: Facilitator/Director UX polish + smoke tests + rollback notes  
5. **File-level task list** — create/modify paths under `src/`, `backend/`, `docs/hermes/`, root Docker/Coolify.  
6. **Env var table** — `TELEGRAM_BOT_TOKEN`, webhook secret, `PULSE_API_KEY`, `DATABASE_URL`, STT keys, etc. Host-only.  
7. **Safety vs Innora** — resource limits, port rules, what never to change on droplet.  
8. **Test plan** — curl smoke + real Telegram voice note script for WSH Kindergarten (Tashi / Tr. Sonam / Director Choki personas already in product).  
9. **Cursor prompt block** — paste-ready prompt that references this brief + the plan + schema.  
10. **Risks** — webhook drops, STT cost, SQLite on restart, Traefik cert for sslip, rate limits.

### Quality bar for the plan

- Prefer extending existing Pulse routes over new parallel APIs.  
- Zod-validate at boundary.  
- Director gate before `delivered`.  
- `npm run build` green after each phase.  
- Enterprise scorecard mindset from `AGENTS.md`.

---

## 9. Operator intent (tone for the plan)

Be blunt: the landing page and rainbow mascot are **distribution**. The **product** is the 15-second Telegram voice path. Plan the smallest path that makes a Bhutanese ECCD facilitator trust Haeru on a Monday morning — not the largest enterprise roadmap.

---

## 10. Handoff checklist for Gemini

Before finishing the plan, confirm you accounted for:

- [ ] Live Telegram (not only `HaeruVoiceDemo`)  
- [ ] No paid domain (sslip / Coolify HTTPS)  
- [ ] famedigital Coolify coexistence with Innora  
- [ ] Customer brand = Haeru Voice AI; Hermes = internal  
- [ ] Director confirm before parent delivery  
- [ ] Child-atomic privacy  
- [ ] Dockerfile + env secrets pattern  
- [ ] Explicit non-goals  

**End of brief.** Gemini: write the Cursor build plan next.
