# Landing → Sign in → App (enterprise)

**Date:** 2026-11-02  
**Status:** Approved in chat (approach 1; flow + visuals)  
**Product:** Wangchuk's School of Heroes · Kidu Care Pulse

## Goal

Standard public entry: **Landing → Sign in → authenticated app**. Both Landing and Sign in must read as enterprise-grade (not UAT-demo chrome). Sign-in layout comes from a **21st.dev** login boilerplate, restyled to WSH tokens.

## Locked decisions

| Decision | Choice |
|---|---|
| Audience | Public school site (parents + staff) |
| Brand | WSH as hero name; Kidu Care Pulse as product line |
| Below hero | One “How Pulse helps” strip (3 beats) — not a full brochure |
| Sign-in source | 21st.dev enterprise login boilerplate |
| UAT personas | DEV-only compact strip (not primary 2×2 grid) |
| Design system | Existing emerald/amber/slate glass; Fredoka + Quicksand; no purple cliché; no `rotateX`/`rotateY`; no bare `text-white` on frost |

## Flow

```text
[Landing] --Sign in--> [Sign in] --credentials OK--> [Role home]
                ^                         |
                |                         |
                +-- Back to school site --+
                |
         idle lock / Persona "Sign-in"
         (lands on Sign in, not Landing)
```

| Screen | Who | Entry |
|---|---|---|
| Landing | Unauthenticated | App default |
| Sign in | Unauthenticated | Landing CTA; idle lock; Persona Sign-in |
| App | Authenticated | Existing Prisma `/api/auth/login` → role homes |

## State model

- Extend `Role` with `'landing'` (keep `'signin'` for the auth screen).
- Initial store: `role: 'landing'`.
- Landing CTA → `setRole('signin')`.
- Successful login → existing role homes (`centres` / `ftoday` / `phome` / `chome`).
- Idle lock / Persona Sign-in → `signin` (not `landing`).
- Sign-in “Back to school site” → `landing`.
- `AppShell`: render Landing or Sign-in full-bleed (no sidebar) when `role` is `landing` or `signin`.

## Landing — visual & content

### First viewport (hero only)

- Full-bleed atmospheric background (Centres-gallery language: emerald / amber / soft sky radial washes).
- Hero brand: **Wangchuk's School of Heroes** (display / Fredoka).
- One supporting sentence: Bhutan ECCD care + **Kidu Care Pulse** for families and staff.
- CTA group: primary **Sign in**; secondary quiet line (“For families & staff”).
- No cards, no stats strip, no persona grid in the hero.
- Motion: subtle opacity / translate-y on brand + CTA (respect `prefers-reduced-motion`).

### Below fold

One section — **How Pulse helps** — three beats:

1. Care updates (child-scoped feed after Director confirm)  
2. ELDS progress (MoESD ELDS 2019 · observed, never tested)  
3. Secure pay (mBoB / mPAY dynamic QR)

Footer: light place line (Thimphu · Bhutan) + product name. No admissions CRM, rooms brochure, or contact form in this slice.

## Sign in — visual & behavior

- Pull a 21st.dev enterprise login / split-panel (or equivalent polished auth) template via CLI (`21st login` / token required on the machine).
- Restyle to WSH: glass inputs, emerald primary button, slate text, same fonts.
- Header: small WSH mark + **Kidu Care Pulse**; link **Back to school site** → Landing.
- Form: email + password → `POST /api/auth/login` (existing `RoleLogin` logic).
- Remove UAT badge copy (“WSH · UAT login”, “Seeded Prisma users…”) from primary chrome.
- DEV-only: compact persona shortcuts under the form **or** rely on existing `PersonaSwitcher` — not the large 2×2 card grid as the main UI.
- Light + dark readable; GlassButton / tokens preferred over one-off styles.

## Out of scope

- Multi-school marketing CMS, admissions public forms, MoESD SSO, live Hermes deploy, CCTV.
- Replacing Prisma demo auth with production IdP.

## Acceptance

1. Cold load shows Landing, not Sign in.  
2. Sign in CTA → enterprise Sign in; Back → Landing.  
3. Seeded credentials still log in to correct role homes.  
4. Caregiver still cannot reach fees.  
5. Idle lock returns to Sign in.  
6. `npm run build` green; Theme/A11y readable on glass in light + dark.

## Implementation notes (for plan)

- New: `src/components/marketing/LandingPage.tsx` (or `auth/LandingPage.tsx`).  
- Refactor: `RoleLogin.tsx` → 21st-based layout + keep login API wiring.  
- Update: `AppShell.tsx`, `appStore.tsx`, `types/enterprise.ts`, `PersonaSwitcher` labels if needed.  
- Prerequisite: authenticate 21st CLI before `21st search` / `21st get` for the login template.
