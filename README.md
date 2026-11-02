# Bhutan ECCD Enterprise Platform

**Wangchuk's School of Heroes (WSH)** + **Kidu Care Pulse AI** — Modern Himalayan Glass UI.

## Quick start

```bash
npm install
npm run dev
```

Use the bottom **Role** switcher: Owner · Facilitator · Parent · Caregiver · Sign-in.

## Enterprise build status (`docs/CURSOR_BUILD_PLAN.md`)

- **Phase 1** Soft glass UI · light/dark theme (Sun/Moon in header) · no card/table tilt
- **Phase 2** Prisma schema (`backend/prisma/schema.prisma`) · Zod Pulse APIs (`src/lib/api/`)
- **Phases 3–5** Owner / facilitator / parent / caregiver modules + Child 360 Progress
- **Phase 6** Quick Unlock PIN · 15-min idle lock on owner finance screens

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local demo |
| `npm run build` | Typecheck + production build |
| `npm run prisma:generate` | Generate Prisma client (needs `DATABASE_URL`) |
