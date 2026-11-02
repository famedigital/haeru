# Landing → Sign in Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cold load shows an enterprise public Landing for Wangchuk's School of Heroes; Sign in uses a 21st.dev–based auth layout wired to Prisma login; authenticated users reach existing role homes.

**Architecture:** Extend `Role` with `landing`. `AppShell` renders full-bleed Landing or Sign in (no sidebar) for unauthenticated roles. Landing CTA → `signin`. Refactor `RoleLogin` into an enterprise form (21st boilerplate adapted to WSH glass tokens) with optional DEV persona strip. Keep `/api/auth/login` and role homes unchanged.

**Tech Stack:** Vite React SPA, existing `GlassButton` / `GlassCard` / `wsh-canvas`, Prisma auth via `apiFetch`, 21st.dev CLI for login boilerplate.

**Spec:** `docs/superpowers/specs/2026-11-02-landing-signin-design.md`

## Global Constraints

- WSH hero brand; Kidu Care Pulse as product line under it
- Emerald / amber / slate glass — no purple-default cliché
- No bare `text-white` on frost; no `rotateX` / `rotateY`
- Caregiver never sees fees (existing `CAREGIVER_BLOCKED` stays)
- Do not expand into Phase B media, CCTV, MoESD SSO, or live Hermes
- Do not `git commit` unless the user explicitly asks
- `npm run build` must stay green before claiming done

## File map

| File | Responsibility |
|---|---|
| `src/types/enterprise.ts` | Add `'landing'` to `Role` |
| `src/lib/store/appStore.tsx` | Default `landing`; `setRole` for landing/signin |
| `src/data/enterprise.ts` | `ROLE_CONFIGS` stays `Exclude<Role, 'signin' \| 'landing'>` |
| `src/app/AppShell.tsx` | Route Landing vs Sign in vs app shell |
| `src/components/marketing/LandingPage.tsx` | Public hero + How Pulse helps |
| `src/components/auth/RoleLogin.tsx` | Enterprise sign-in (21st-adapted) |
| `src/components/shared/PersonaSwitcher.tsx` | Optional Landing chip; Sign-in → `signin` |
| `src/components/shared/NavigationSidebar.tsx` | Treat `landing` like unauthenticated |
| `src/components/shared/HeaderTopBar.tsx` | Same |

---

### Task 1: Role + store — default Landing

**Files:**
- Modify: `src/types/enterprise.ts`
- Modify: `src/lib/store/appStore.tsx`
- Modify: `src/data/enterprise.ts` (type only if needed)
- Modify: `src/components/shared/NavigationSidebar.tsx`
- Modify: `src/components/shared/HeaderTopBar.tsx`
- Modify: `src/components/shared/PersonaSwitcher.tsx`

**Interfaces:**
- Produces: `Role` includes `'landing'`; initial `role === 'landing'`; `setRole('signin')` sets screen `'unlock'`; `setRole('landing')` allowed without looking up `ROLE_CONFIGS`

- [ ] **Step 1: Extend Role**

In `src/types/enterprise.ts` change to:

```ts
export type Role = 'owner' | 'facilitator' | 'parent' | 'caregiver' | 'signin' | 'landing'
```

- [ ] **Step 2: Update ROLE_CONFIGS exclude type**

In `src/data/enterprise.ts`:

```ts
export const ROLE_CONFIGS: Record<Exclude<Role, 'signin' | 'landing'>, RoleConfig> = {
```

- [ ] **Step 3: Default store to landing**

In `appStore.tsx`:

```ts
const [role, setRoleState] = useState<Role>('landing')
```

Update `setRole`:

```ts
const setRole = useCallback((next: Role) => {
  setRoleState(next)
  if (next === 'signin' || next === 'landing') {
    setScreenState(next === 'landing' ? 'landing' : 'unlock')
    return
  }
  if (next === 'parent' || next === 'caregiver') {
    setSelectedChildId(PARENT_CHILD_ID)
  }
  setScreenState(ROLE_CONFIGS[next].home)
}, [])
```

- [ ] **Step 4: Guard nav/header for landing**

In `NavigationSidebar.tsx` and `HeaderTopBar.tsx`:

```ts
if (role === 'signin' || role === 'landing') return null
```

Cast configs as `Exclude<Role, 'signin' | 'landing'>`.

- [ ] **Step 5: PersonaSwitcher**

Add `{ id: 'landing', label: 'Landing' }` (optional) and keep `{ id: 'signin', label: 'Sign-in' }`. Ensure clicking Sign-in sets `signin` (not landing).

- [ ] **Step 6: Verify TypeScript**

Run: `npx tsc -b --pretty false`
Expected: errors only where `AppShell` still assumes sole `signin` unauth — fix those in Task 3 if they appear; otherwise zero errors related to `ROLE_CONFIGS[next]` when next is landing.

---

### Task 2: Landing page UI

**Files:**
- Create: `src/components/marketing/LandingPage.tsx`

**Interfaces:**
- Consumes: `useAppStore().setRole`
- Produces: `<LandingPage />` full-viewport public marketing screen

- [ ] **Step 1: Create LandingPage**

Create `src/components/marketing/LandingPage.tsx`:

```tsx
import { ArrowRight } from 'lucide-react'
import { useAppStore } from '../../lib/store/appStore'
import { GlassButton } from '../ui'

export function LandingPage() {
  const { setRole } = useAppStore()

  return (
    <div className="min-h-screen wsh-canvas relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(16,185,129,0.35), transparent 55%), radial-gradient(ellipse 70% 45% at 90% 10%, rgba(245,158,11,0.28), transparent 50%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(14,165,233,0.2), transparent 55%)',
        }}
      />

      <header className="flex items-center justify-between px-6 md:px-10 py-5">
        <span className="display text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-wide">
          WSH
        </span>
        <GlassButton variant="soft" onClick={() => setRole('signin')}>
          Sign in
        </GlassButton>
      </header>

      <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center px-6 md:px-10 pb-16 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-800 dark:text-emerald-200/90 font-bold mb-4 animate-[fadeUp_0.7s_ease-out]">
          Thimphu · Bhutan
        </p>
        <h1 className="display text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] animate-[fadeUp_0.8s_ease-out]">
          Wangchuk&apos;s School of Heroes
        </h1>
        <p className="mt-5 text-lg text-slate-700 dark:text-slate-200 max-w-xl animate-[fadeUp_0.9s_ease-out]">
          Early childhood care rooted in MoESD ELDS 2019 — powered by Kidu Care Pulse for
          families and staff.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 animate-[fadeUp_1s_ease-out]">
          <GlassButton onClick={() => setRole('signin')}>
            Sign in <ArrowRight className="w-4 h-4" />
          </GlassButton>
          <span className="text-sm text-slate-600 dark:text-slate-300">For families &amp; staff</span>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">How Pulse helps</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['Care updates', 'Child-scoped moments after Director confirm — never a classroom dump.'],
            ['ELDS progress', 'Observed, never tested. Families see ratings only when confirmed.'],
            ['Secure pay', 'mBoB / mPAY dynamic QR with amount and invoice remarks.'],
          ].map(([title, body]) => (
            <div key={title} className="space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-slate-500 dark:text-slate-400">
          Thimphu · Bhutan · Kidu Care Pulse
        </p>
      </section>
    </div>
  )
}
```

If `@keyframes fadeUp` is missing, add to `src/index.css`:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .animate-\[fadeUp_0\.7s_ease-out\],
  .animate-\[fadeUp_0\.8s_ease-out\],
  .animate-\[fadeUp_0\.9s_ease-out\],
  .animate-\[fadeUp_1s_ease-out\] {
    animation: none !important;
  }
}
```

(Or use Tailwind `motion-safe:animate-*` if already configured — prefer existing motion utilities.)

- [ ] **Step 2: Visual check rules**

Confirm: no cards in hero; brand is hero-level; no purple-only gradient; no `rotateX`/`rotateY`.

---

### Task 3: Wire AppShell — Landing vs Sign in

**Files:**
- Modify: `src/app/AppShell.tsx`

**Interfaces:**
- Consumes: `LandingPage`, `RoleLogin`, `role === 'landing' | 'signin'`

- [ ] **Step 1: Import LandingPage**

```ts
import { LandingPage } from '../components/marketing/LandingPage'
```

- [ ] **Step 2: ScreenRouter unauth**

```ts
if (role === 'landing') return <LandingPage />
if (role === 'signin') return <RoleLogin />
```

(Or remove unauth from ScreenRouter if ShellInner handles it exclusively.)

- [ ] **Step 3: ShellInner full-bleed**

```tsx
if (role === 'landing' || role === 'signin') {
  return (
    <>
      {role === 'landing' ? <LandingPage /> : <RoleLogin />}
      <PersonaSwitcher />
      <ToastContainer />
    </>
  )
}
```

Keep idle lock: `setRole('signin')` (not landing).

- [ ] **Step 4: Smoke in browser**

Run: `npm run dev`  
Open `http://localhost:5173` (or active port)  
Expected: Landing first; header/CTA Sign in → RoleLogin; Persona Landing returns to Landing.

---

### Task 4: Enterprise Sign in (21st + WSH)

**Files:**
- Modify: `src/components/auth/RoleLogin.tsx`
- Possibly create: `src/components/auth/SignInPanel.tsx` if splitting layout from form logic

**Interfaces:**
- Consumes: `apiFetch('/auth/login')`, `setRole`, `setScreen`, `openChild`, `showToast`, `setRole('landing')` for back link
- Produces: Enterprise sign-in UI; same login success behavior as today

- [ ] **Step 1: Authenticate 21st CLI**

Run: `npx @21st-dev/cli whoami`  
If not signed in: ask user to run `npx @21st-dev/cli login` or set `TWENTYFIRST_TOKEN`, then continue.

- [ ] **Step 2: Search login boilerplate**

Run: `npx @21st-dev/cli search "login sign in" --limit 8`  
Pick a split-panel or centered enterprise auth result (not playful/cartoon).

- [ ] **Step 3: Pull code**

Run: `npx @21st-dev/cli get <id>`  
Adapt structure into `RoleLogin` (or `SignInPanel`) using project `GlassButton`, `glass-input`, WSH colors — do not paste raw shadcn that fights tokens.

**Fallback if 21st unavailable:** implement split layout without 21st:

- Left (md+): atmospheric panel with WSH name + short Pulse line  
- Right: glass form card  
Still enterprise density and typography.

- [ ] **Step 4: Rewrite RoleLogin chrome**

Required behaviors:

```tsx
// Back link
<button type="button" onClick={() => setRole('landing')} className="...">
  ← Back to school site
</button>

// Header
// small WSH mark + "Kidu Care Pulse"
// h1: "Sign in"
// Remove "WSH · UAT login" badge and "Seeded Prisma users…" as primary copy

// Form: email + password → existing login()
// Do NOT optimistic-setRole before API success for main form submit

// DEV strip (compact): map PRESETS to text buttons that call login(email, password)
// without the large 2×2 GlassCard grid as the hero of the page
```

Keep `login()` function body (API + `localStorage` + home screen mapping). Fix return type:

```ts
role: Exclude<Role, 'signin' | 'landing'>
```

- [ ] **Step 5: Verify login**

Browser: Sign in with `owner@wsh.bt` / `owner123` → Centres.  
Facilitator / Parent / Caregiver seeded users still work.  
Caregiver nav has no Payments.

---

### Task 5: Build + UAT acceptance

**Files:** none new (verification only)

- [ ] **Step 1: Production build**

Run: `npm run build`  
Expected: exit 0

- [ ] **Step 2: Acceptance checklist (browser)**

1. Cold load → Landing (not Sign in)  
2. Sign in CTA → enterprise Sign in; Back → Landing  
3. Seeded credentials → correct role homes  
4. Caregiver blocked from fees  
5. Idle lock (owner sensitive screen) → Sign in  
6. Light + dark: Landing + Sign in titles readable on glass  

- [ ] **Step 3: Paste Enterprise Scorecard** in completion summary (avg ≥ 9.0; Theme/A11y, Privacy/ELDS, Frontend, Backend/Hermes ≥ 9)

- [ ] **Step 4: Commit only if user asks**

Do not commit unless explicitly requested.

---

## Spec coverage (self-review)

| Spec requirement | Task |
|---|---|
| Landing default | 1, 3 |
| WSH hero + Pulse line + Sign in CTA | 2 |
| How Pulse helps (3 beats) | 2 |
| 21st enterprise sign-in | 4 |
| Back to school site | 4 |
| DEV personas not primary chrome | 4 |
| Idle lock → signin | 3 |
| Caregiver no fees | unchanged + 5 |
| Build green | 5 |

## Placeholder scan

None intentional. 21st ID filled at Task 4 runtime from search results.
