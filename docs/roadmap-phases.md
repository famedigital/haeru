# Roadmap — Phase B (media) & Phase C (CCTV)

These phases are **documented hooks only** in the thin slice. Do not implement hardware or storage yet; keep contracts ready.

## Phase B — Photos & short videos

### Goal

Facilitator captures a photo or short clip of **one child’s moment**, Hermes captions/tags, staff confirms, parent receives that media — not a classroom dump.

### Hooks (future)

| Piece | Contract |
|---|---|
| Capture | Telegram photo/video to staff bot, optional `@ChildName` caption |
| Enrich | Hermes fills observation schema with `source: "photo"` |
| Store | Object storage key in `rawRef` / `mediaUrls[]` |
| Approve | Same `POST /moments/:id/confirm` |
| Deliver | Parent Telegram native media + child-scoped web Moment |

### Privacy

- Explicit media consent flag on Child / Guardian
- Blur or exclude other faces before delivery when possible
- Retention policy (e.g. auto-expire media after N days unless pinned)

### Demo stub today

`Moment.mediaUrls?: string[]` exists on the type; unused until B.

---

## Phase C — CCTV (privacy-first)

### What this is **not**

- Not a live CCTV wall for all parents
- Not continuous streaming of classrooms to phones
- Not automated face recognition shipped without MoESD/legal review

### What this is

Center cameras keep **short buffered clips**. Staff (or Hermes with staff oversight) select a **moment clip** already linked to a child/activity. Parents get that clip **only after consent + approval**. Live view stays **staff/director-only** with audit logs.

### Hooks (future)

| Piece | Contract |
|---|---|
| Ingest adapter | NVR/edge agent uploads clip metadata → Pulse `rawRef` |
| Observation | `source: "cctv"` via Hermes or staff UI |
| Approval | Confirm Moment + guardian consent check |
| Audit | Who viewed live feed; who released which clip |
| Parent UX | Same child-scoped Moment timeline (clip attachment) |

### Legal / ops checklist before build

- [ ] Center consent forms for recording & parent delivery
- [ ] MoESD guidance on camera use in ECCD
- [ ] Network isolation of camera VLAN
- [ ] Access control + audit for live view
- [ ] No public URLs without auth tokens

### Demo stub today

Schema allows `"source": "cctv"` and `rawRef`; UI/API do not ingest cameras.

---

## Later (D / E / F)

- **D:** Live Hermes webhook/skill → Pulse API; per-center facilitator allowlists  
- **E:** MoESD analytics on **anonymized aggregates** only (Director view already mocks this)
- **F (future — DigitalOcean):** Production Pulse + Prisma on DO; live Telegram Hermes; optional **Colibri** local LLM; role-scoped **in-app assistant**. Full checklist: [`docs/superpowers/plans/2026-11-02-production-ready-hermes-feed.md`](./superpowers/plans/2026-11-02-production-ready-hermes-feed.md). Do not implement until explicitly requested.
