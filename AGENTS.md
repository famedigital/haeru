# Bhutan ECCD — Agent entrypoint

## Canonical sources
- `.cursor/rules/*.mdc` (strict enterprise rules)
- `docs/CURSOR_BUILD_PLAN.md`, `docs/ENTERPRISE_FULLSTACK_SPEC.md`, `docs/architecture.md`
- `docs/hermes-observation-schema.json`, `docs/hermes/`

## Enterprise Score gate (hard)
Nothing is **done** unless:

| Rule | Threshold |
|---|---|
| Average of 10 dimensions | **≥ 9.0 / 10** |
| Any dimension | **≥ 8.0 / 10** |
| Critical: Theme/A11y, Privacy/ELDS, Frontend TS, Backend/Hermes | **≥ 9.0 / 10** |

Dimensions: Theme/A11y · UI/Components · Dashboards · Frontend · API · Middleware · Backend/Hermes · Database · Privacy/ELDS · Tech/Ops

Paste a scorecard in the completion summary. **FAIL → keep fixing.**

## Definition of done
1. `npm run build` green
2. Light + dark titles readable on glass (no bare `text-white` on frost)
3. Parent feeds child-scoped; caregiver sees **no** fees
4. Hermes moments: Director confirm before parent `delivered`
5. Zod validates Pulse/Hermes bodies at the boundary

## Finish scope
Hermes Phase A vertical slice + rules. Do **not** build live Telegram/VPS, CCTV, or MoESD SSO unless explicitly asked.
