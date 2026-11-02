# FUTURE PLAN — Production Hermes, DigitalOcean, Colibri & in-app assistant

> **Status: FUTURE — do not implement unless the user explicitly asks to start this plan.**  
> Demo / Phase A vertical slice in-repo stays as-is until then.

**Goal (later):** Production-ready path on **DigitalOcean**: Telegram → Hermes → (optional Colibri) → Cloudinary → Pulse → role feeds; then auth, Prisma, tests, UAT; then an in-app role-scoped assistant.

**Not now:** Live BotFather, Colibri install, DO deploy, in-app “help with anything” bot, full auth/Prisma cutover.

---

## Already done (current repo — not this future plan)

- Caption `@ChildName` fan-out contract + `POST /api/media/photo-from-hermes`
- Cloudinary helper (server) + env template
- Director gate + role feeds + empty states
- Telegram photo **simulation** in UI
- Snapshot cache fix for Progress review / Center feed

Brand/character name: still TBD by product owner.

---

## Future hosting (locked when we execute)

```text
DigitalOcean (always-on)
  ├── Pulse API + Postgres (Prisma)
  ├── Hermes Telegram gateway
  ├── Colibri (optional local LLM) ← Hermes / in-app bot point here
  └── Cloudinary (SaaS)

Optional: Vercel or DO App Platform → React SPA only
```

- Hermes **does not** run on Vercel.
- Colibri = inference engine only ([JustVugg/colibri](https://github.com/JustVugg/colibri)); not a Telegram replacement.

---

## Future Phase A — DO: Pulse API + Prisma

- Deployable Node API (not Vite-dev-only middleware)
- Postgres + Prisma for observations/moments/`mediaUrls`
- Real `PULSE_API_KEY`, CORS locked to app origin
- Smoke against DO URL

## Future Phase B — Auth & privacy

- Real sessions; hide PersonaSwitcher in prod
- Guardian ↔ child binding (drop `PARENT_CHILD_ID` hardcode)
- Facilitator room from assignment (not hardcoded nursery)
- Enforce `photoConsentFeed` server-side

## Future Phase C — Live Hermes + Cloudinary on DO

- BotFather staff bot; allowlist facilitators
- Photo/video → Cloudinary (EXIF strip) → caption fan-out → Director confirm
- Parent delivery (clear `telegramSimulated` when live)

## Future Phase D — Colibri on DO (optional)

- Install Colibri on droplet; `coli serve`
- Point Hermes OpenAI-compatible base URL at Colibri
- Fallback: OpenRouter/Nous if Colibri down
- No shell/file tools against school data by default

## Future Phase E — In-app digital assistant

- Chat panel in WSH UI (“help with school tasks”)
- Same model backend (Colibri or cloud)
- **Role-scoped tools only** (child privacy, Director gate, no caregiver fees)
- Not an unrestricted “do anything” agent

## Future Phase F — Tests + UAT

- Vitest (caption, status machine, consent) + Playwright e2e
- CI on PRs
- UAT scripts for Director / Facilitator / Parent / Caregiver
- Enterprise Score gate ≥ 9.0 before calling production done

---

## Explicit non-goals (still)

- Face recognition  
- Phase C CCTV  
- MoESD SSO  
- Hermes on Vercel  

---

## When to start

Only after an explicit user ask, e.g. “start Future Phase A on DigitalOcean” or “execute the production plan.” Until then, agents must **not** expand into live Telegram, Colibri, or DO deploy.
