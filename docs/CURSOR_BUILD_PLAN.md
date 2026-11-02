# CURSOR EXECUTION PLAN: BHUTAN ECCD ENTERPRISE PLATFORM
### Design Paradigm: Soft 3D Glassmorphism (Light & Dark Theme)
**Reference Documents**: 
- Specification: `docs/ENTERPRISE_FULLSTACK_SPEC.md`
- Interactive Mockup: `docs/wsh-website-mockup.html`
- AI Observation Schema: `docs/hermes-observation-schema.json`
- Architecture: `docs/architecture.md`

---

## 1. Core Architectural Directives for Cursor

### A. Strict Prohibition: No 3D Rotation Tilt Animations
- **Zero Card/Table Skewing**: Under no circumstance should cards, tables, or modals use `rotateX`, `rotateY`, or mouse-tracking perspective rotation. Tables must remain completely flat, stable, and rock-solid to read and interact with.
- **Soft Tactile Glass Elevation**: Instead of tilting, interactive elements use gentle, silky-smooth vertical elevation:
  * Rest state: `translate-y-0`
  * Hover state: `hover:-translate-y-0.5` with a subtle diffuse ambient glow (teal/amber aura) and specular highlight expansion.
  * Active/Click state: Soft physical depression `active:scale-[0.985] active:translate-y-0`.

### B. Dual Theme Architecture: Light & Dark Mode
The entire system must support seamless toggling between two distinct, beautiful visual themes:
1. **Dark Theme ("Midnight Himalayan Glass")**:
   - Deep obsidian/slate canvas (`#090d16` to `#0f172a`) with subtle ambient radial glow spheres.
   - Translucent smoky glass panels (`rgba(255, 255, 255, 0.05)` with `backdrop-blur-2xl`).
   - Glowing hairline borders (`border-white/12` with top specular highlight `border-t-white/28`).
   - Glowing neon status badges (Himalayan Teal, Saffron Gold, Coral Rose).
2. **Light Theme ("Sunrise Himalayan Frosted Pearl")**:
   - Warm creamy frosted canvas (`#fbf8f3` to `#f4eee3`).
   - Frosted milk-glass panels (`rgba(255, 255, 255, 0.75)` with `backdrop-blur-2xl`).
   - Soft pearlescent drop shadows (`box-shadow: 0 10px 30px -10px rgba(51, 65, 92, 0.08)`).
   - High-contrast slate typography (`text-slate-900` headers, `text-slate-700` body).
3. **Theme Switcher**:
   - Controlled via `theme` state in `appStore` (`'dark' | 'light'`) with a Sun / Moon toggle button in the header top bar.
   - Synced with `localStorage` and `data-theme` on `<html>`.

### C. CRITICAL DEFECT: Light Theme Contrast & Invisible Text Fix
- **Root Cause**: The current UI has hardcoded `text-white`, `text-slate-100`, and SVG `fill="#cbd5e1"` / `stroke="rgba(226,232,240,0.2)"` classes across components (e.g. `ChildProfile360.tsx`, `RadarChart3D.tsx`, `TodayDashboard.tsx`). On Light Theme, glass cards are white/cream, causing text, labels, and chart axes to be rendered white-on-white or pale gray on white, making them completely unreadable.

#### Specific Problem Areas:
1. **ELDS Radar Chart (`RadarChart3D.tsx`)**:
   - **Axis Labels ("Physical", "Social", "Language", "Approaches", "Cognition", "Spiritual")**: Currently hardcoded with `fill="#cbd5e1"`, which is washed out and completely invisible against the light card background.
     * **Fix**: Use `className="fill-slate-700 dark:fill-slate-300 font-bold text-xs"`.
   - **Grid Polygon Rings & Radial Lines**: Currently `stroke="rgba(226,232,240,0.2)"`, which is too faint to see.
     * **Fix**: Use `className="stroke-slate-300 dark:stroke-white/15 stroke-[1.5]"`.
   - **Data Point Vertex Dots**: Currently `fill="#0f172a"` (dark dot).
     * **Fix**: Use `fill="#ffffff"` with the window's stroke color (`stroke={s.color} strokeWidth={2}`) for a crisp, clean jewel dot in both themes.
   - **Chart Platter Container**:
     * **Fix**: Use `className="relative rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-4 shadow-sm"`.

2. **Child Profile & Cards (`ChildProfile360.tsx`, `TodayDashboard.tsx`, etc.)**:
   - **Headers & Prominent Titles**: Replace bare `text-white` with `text-slate-900 dark:text-white` (e.g. "Kinley Wangchuk", "Care & medical", "Pickup log", "Media consent").
   - **Primary Field Values**: Replace with `text-slate-800 dark:text-slate-100` (e.g. allergies, doctor, medication).
   - **Secondary / Subtitles**: Replace with `text-slate-600 dark:text-slate-300` (e.g. age, room band, caregiver notes).
   - **Muted Field Labels**: Replace with `text-slate-500 dark:text-slate-400` (e.g. "Allergies", "Doctor", "Nap").
   - **Pill Badges & Tags**: Ensure borders and text are crisp in light mode: `bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200`.
   - **Navigation & Tab Links**: Inactive tabs must be `text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white`.

- **Strict Universal Rule**: NEVER use bare `text-white` or light gray SVG fills (`#cbd5e1`) on card surfaces. Always pair them with theme-adaptive classes.

### D. CRITICAL DEFECT: KPI Card Typography Collision (TodayDashboard.tsx)
- **Root Cause**: In the KPI stat cards, the label (`text-[11px] uppercase`), value (`font-display text-2xl`), and sub-description (`text-xs`) are rendered as **inline `<span>` siblings** inside a flat `<div>` with no flex/block layout. This causes all three text nodes to run together on the same line, resulting in:
  - **"HERE TODAY40 / 45"** — label and number merge
  - **"absent · 2 notified"** — sub-text appended with no line break
  - **"OVERDUE INVOICESNu."** — label and currency prefix collide
  - **"LEAVE REQUESTS2Awaiting approval"** — same collision

#### Fix Required in `TodayDashboard.tsx` KPI Cards:
Replace the flat wrapper with a `flex flex-col` stack:
```tsx
<div className="flex flex-col gap-1 mt-2">
  <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
    {label}
  </span>
  <span className="block font-display text-3xl font-bold leading-none text-slate-900 dark:text-white">
    {value}
  </span>
  <span className="block text-xs text-slate-500 dark:text-slate-400">
    {sub}
  </span>
</div>
```
- **Label**: `block text-[10px] font-bold uppercase tracking-widest` — sits ABOVE the number
- **Value**: `block text-3xl font-bold leading-none` — large, prominent, own line
- **Sub**: `block text-xs` — below the number, soft muted text
- All three must use the **dual-theme text classes** above (no bare `text-white`)

#### Also Fix Icon Chips in KPI Cards:
The icon badge chips (smiley face, document icon, etc.) must use:
```tsx
className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-teal-600 dark:text-teal-400"
```

---

## 2. Phased Implementation Roadmap for Cursor

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CURSOR BUILD ROADMAP                            │
├─────────┬──────────────────────────────────────────────────────────────┤
│ PHASE 1 │ Soft 3D Glass UI System & Light Theme Contrast Fix           │
│         │ - Fix invisible white-on-white text across all components    │
│         │ - Remove rotation tilts from GlassCard and tables            │
│         │ - Implement theme toggle (Sun/Moon) & light mode CSS tokens  │
│         │ - Soft tactile click states (active:scale-[0.985])           │
├─────────┼──────────────────────────────────────────────────────────────┤
│ PHASE 2 │ Production Database & Backend API Layer                      │
│         │ - PostgreSQL schema via Prisma (WSH entities + Pulse AI)     │
│         │ - REST API endpoints with Zod request/response validation    │
├─────────┼──────────────────────────────────────────────────────────────┤
│ PHASE 3 │ Owner / Director ERP Modules                                 │
│         │ - 9-Step Admissions Wizard                                   │
│         │ - Automated Invoicing engine with time-travel mock clock     │
│         │ - Staff qualifications, casual leave & payroll               │
│         │ - MoESD ELDS progress review gate                            │
├─────────┼──────────────────────────────────────────────────────────────┤
│ PHASE 4 │ Facilitator Hub & Hermes Voice AI Pipeline                   │
│         │ - Fast daily care logger (Meals, Nap, Mood, Toilet)          │
│         │ - Photo staging with EXIF strip & privacy split warnings     │
│         │ - ELDS 2019 6-domain checklist scoring                       │
│         │ - Telegram audio note simulation & Whisper AI extraction     │
├─────────┼──────────────────────────────────────────────────────────────┤
│ PHASE 5 │ Child-Scoped Parent & Caregiver Portals                      │
│         │ - Strict child-level privacy (zero peer name exposure)       │
│         │ - 6-domain MoESD developmental radar chart (4 windows)       │
│         │ - Invoices, receipts, and mBoB / BNB mPay payment submission │
│         │ - Caregiver delegation (fees strictly hidden)                │
├─────────┼──────────────────────────────────────────────────────────────┤
│ PHASE 6 │ Security & Quick Unlock                                      │
│         │ - 6-digit tactile PIN keypad with masked dots                │
│         │ - WebAuthn / Touch ID passkey authentication                 │
│         │ - 15-minute idle auto-lock for sensitive financial views     │
├─────────┼──────────────────────────────────────────────────────────────┤
│ PHASE 7 │ Superadmin & Multi-Tenancy Platform Operations               │
│         │ - Multi-tenant ECCD centre directory (20 Dzongkhags)         │
│         │ - 4-step New ECCD Provisioning wizard                        │
│         │ - SaaS Subscription engine, quotas & B2B invoicing           │
│         │ - Secure Centre Impersonation with persistent audit banner   │
│         │ - National MoESD ELDS curriculum standards & analytics       │
│         │ - Hermes AI pipeline telemetry & global audit log            │
└─────────┴──────────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Prompts for Cursor Composer

You can run each prompt in Cursor Composer (`Ctrl + I` or `Cmd + I` in Agent mode):

### Cursor Prompt 1: Phase 1 — All Critical UI Bugs + Light Theme + Theme Toggle
```text
@docs/CURSOR_BUILD_PLAN.md @.cursorrules @src/components/ui/RadarChart3D.tsx @src/components/shared/ChildProfile360.tsx @src/components/owner/TodayDashboard.tsx @src/components/shared/HeaderTopBar.tsx @src/lib/store/appStore.tsx @src/index.css

Read Sections 1.A, 1.B, 1.C, and 1.D of docs/CURSOR_BUILD_PLAN.md in full before writing any code.
Fix ALL FOUR of the following confirmed visual bugs in one pass:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG 1 — KPI CARDS TEXT COLLISION (TodayDashboard.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Label, value, and sub-text are inline siblings — no block or flex layout.
This causes "HERE TODAY40 / 45absent · 2 notified", "OVERDUE INVOICESNu.25,400", etc.

Fix: Wrap each KPI card body in a flex-col stack:
  <div className="flex flex-col gap-1 mt-2">
    <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
    <span className="block font-display text-3xl font-bold leading-none text-slate-900 dark:text-white">{value}</span>
    <span className="block text-xs text-slate-500 dark:text-slate-400">{sub}</span>
  </div>
Icon chip: className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-teal-600 dark:text-teal-400"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG 2 — RADAR CHART INVISIBLE IN LIGHT THEME (RadarChart3D.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Domain labels have fill="#cbd5e1" — white-on-white in light mode.
Grid rings use stroke="rgba(226,232,240,0.2)" — nearly invisible.

Fix:
  - Axis <text> labels: className="fill-slate-700 dark:fill-slate-300 font-bold text-[11px]"
  - Grid polygon rings + radial lines: className="stroke-slate-300 dark:stroke-white/15 stroke-[1.5]"
  - Data vertex dots: fill="#ffffff" stroke={s.color} strokeWidth={2}
  - Chart container: className="relative rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-4 shadow-sm"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG 3 — INVISIBLE TEXT IN LIGHT THEME (all components)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Bare `text-white` on white/cream frosted glass cards = invisible text.
Affects: ChildProfile360.tsx, TodayDashboard.tsx, QuickUnlock.tsx, CaregiverHome.tsx,
         DailyCareLogger.tsx, PhotoStaging.tsx, RecordProgressELDS.tsx, VoiceHub.tsx,
         AdmissionsWizard.tsx (and any other file with bare text-white)

Fix ALL occurrences across src/components/:
  - Headers / Titles:     text-slate-900 dark:text-white
  - Primary values:       text-slate-800 dark:text-slate-100
  - Secondary subtitles:  text-slate-600 dark:text-slate-300
  - Muted field labels:   text-slate-500 dark:text-slate-400
  - Pill badges & tags:   bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200
  - Inactive tabs:        text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white
  - Active tab:           text-teal-700 dark:text-teal-300 border-b-2 border-teal-600 dark:border-teal-400

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG 4 — MISSING THEME TOGGLE BUTTON (HeaderTopBar.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: appStore.tsx has toggleTheme() + localStorage sync + data-theme on <html>,
but HeaderTopBar.tsx has no Sun/Moon button wired to it.

Fix: Add a Sun/Moon icon button to HeaderTopBar.tsx:
  - Import: import { Sun, Moon } from 'lucide-react'
  - Import: import { useAppStore } from '@/lib/store/appStore'
  - Use: const { theme, toggleTheme } = useAppStore()
  - Render before the notification bell:
    <button onClick={toggleTheme} className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
    </button>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HARD RULES (from .cursorrules):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- ZERO rotateX/rotateY tilt on any card, table, or modal — EVER.
- ZERO bare `text-white` without dark: prefix on glass surfaces.
- Build must pass: run `npm run build` at the end. Fix all TypeScript errors before finishing.
```

### Cursor Prompt 2: Backend Database & REST API
```text
@docs/CURSOR_BUILD_PLAN.md @docs/ENTERPRISE_FULLSTACK_SPEC.md

Build the production database and backend API layer:
1. Generate the Prisma schema in `backend/prisma/schema.prisma` using the schema defined in Section 4 of `docs/ENTERPRISE_FULLSTACK_SPEC.md`:
   - Users, Roles (owner, facilitator, parent, caregiver)
   - Children, Rooms, ChildGuardian relationships (with financial visibility flags)
   - DailyCareLogs, EldsObservations (with 3-level ratings: ap, bl, nya)
   - ChildFeePlans, Invoices, InvoiceItems, PaymentReports (mBoB/mPay)
2. Create REST API routes with Zod validation:
   - `/api/observations/from-hermes` (Hermes AI extraction ingest)
   - `/api/moments/:id/confirm` (1-tap facilitator approval)
   - `/api/invoices/auto-run` (14-day lead time automatic generation)
   - `/api/payments/report` (parent mBoB payment submission)
```

### Cursor Prompt 3: Owner / Director Modules
```text
@docs/CURSOR_BUILD_PLAN.md @docs/wsh-website-mockup.html @src/components/owner/

Complete the Owner/Director ERP modules based on `wsh-website-mockup.html`:
1. `TodayDashboard.tsx`: KPI cards (attendance 40/45, overdue Nu. 25,400, leave), room occupancy bars, Needs Attention feed, Upcoming calendar.
2. `AdmissionsWizard.tsx`: 9-step admissions wizard (Child, Mother, Father, Guardian, Care, Medical, Pickup, Transfer, Documents).
3. `StaffLeave.tsx`: Staff directory, casual leave balances (14 of 20), leave request approvals, Owner-only salary table.
4. `BillingHub.tsx`: Automatic invoicing engine with mock time-travel clock (13 Oct, 1 Nov, 12 Nov, 15 Nov, 22 Nov), fee structure matrix, and mid-year catch-up proration formula.
5. `EldsReviewGate.tsx`: Review table for Director to confirm facilitator ratings before parents see them.
```

### Cursor Prompt 4: Facilitator Hub & Hermes Voice AI
```text
@docs/CURSOR_BUILD_PLAN.md @docs/hermes-observation-schema.json @src/components/facilitator/

Build the Facilitator Hub with Hermes AI integration:
1. `DailyCareLogger.tsx`: Fast room-wide logging of 🍚 Meals, 😴 Nap, 😊 Mood, and 🚽 Toilet.
2. `PhotoStaging.tsx`: Image upload with EXIF metadata stripping and privacy split warnings if a child lacks feed consent.
3. `RecordProgressELDS.tsx`: 6-domain MoESD ELDS checklist with 3-level rating buttons (`ap`, `bl`, `nya`) and remarks.
4. `VoiceHub.tsx`: Telegram voice note simulation and Hermes AI extraction preview matching `hermes-observation-schema.json`.
```

### Cursor Prompt 5: Parent & Caregiver Portals
```text
@docs/CURSOR_BUILD_PLAN.md @docs/wsh-website-mockup.html @src/components/parent/ @src/components/caregiver/

Build the Parent and Caregiver portals with strict child-level privacy:
1. `DailyReflection.tsx`: Child's daily reflection card, meals/nap/mood indicators, teacher quote, fee alert banner.
2. `ChildMomentsFeed.tsx`: Child-scoped photo feed (zero other children's names exposed).
3. `ELDSRadarView.tsx`: 6-domain MoESD radar chart comparing observation windows (Feb-Mar, May-Jun, Aug-Sep, Oct-Nov) with celebration callouts and home guidance tips.
4. `PaymentReporter.tsx`: Invoices list, Bank of Bhutan QR code, and mBoB / BNB mPay journal reporting form.
5. `CaregiverHome.tsx`: Restricted caregiver view with pickup authorization and daily care summary, with all fees and invoices strictly hidden.
```

### Cursor Prompt 6: Quick Unlock & Security
```text
@docs/CURSOR_BUILD_PLAN.md @src/components/auth/QuickUnlock.tsx

Complete the authentication and security layer:
1. 6-digit tactile PIN keypad with masked dots.
2. WebAuthn / Touch ID passkey unlock button.
3. 15-minute idle lock timer for sensitive Director/financial views.
```

### Cursor Prompt 7: Superadmin & Multi-Tenancy Platform Operations
```text
@docs/SUPERADMIN_SPEC.md @docs/CURSOR_BUILD_PLAN.md @.cursorrules @src/types/enterprise.ts @src/data/enterprise.ts @src/lib/store/appStore.tsx @src/app/AppShell.tsx @src/components/shared/NavigationSidebar.tsx @src/components/shared/PersonaSwitcher.tsx

Read docs/SUPERADMIN_SPEC.md completely before writing any code.
Implement the Superadmin persona and Multi-Tenant School Management operations:

1. TYPES & DATA MODEL (src/types/enterprise.ts & src/data/enterprise.ts):
   - Add 'superadmin' to Role type.
   - Define CentreRecord: id, slug, name, dzongkhag, gewog, moesdCode, status ('active' | 'provisioning' | 'grace_period' | 'suspended'), tier ('community' | 'standard' | 'enterprise'), maxChildren, maxStaff, enrolledCount, directorName, directorPhone, directorEmail, saasFeeNu, renewalDate.
   - Add mock CENTRES array containing 4 Bhutanese ECCDs across Dzongkhags:
     * Wangchuk's School of Heroes (Babesa, Thimphu · ECCD-THI-2024-009 · Active · Standard)
     * Druk Little Gems ECCD (Bondey, Paro · ECCD-PAR-2023-014 · Active · Standard)
     * Phuentsholing Child Care (Phuentsholing, Chhukha · ECCD-CHU-2025-002 · Active · Enterprise)
     * Punakha Valley Learners (Khuruthang, Punakha · ECCD-PUN-2024-031 · Provisioning · Community)
   - Add ROLE_CONFIGS.superadmin with nav groups:
     * Platform: super_overview (Global Pulse)
     * Centres: super_centres (ECCD Directory), super_provision (Provision New)
     * SaaS & Billing: super_subscriptions (Plans & Invoicing)
     * MoESD & Learning: super_elds (Curriculum Standards)
     * Operations: super_telemetry (Hermes AI & Pipelines), super_audit (Global Audit Log)

2. SUPERADMIN COMPONENTS (src/components/superadmin/):
   - SuperOverview.tsx: 4 KPI stats (Active Centres, Total Children, SaaS MRR Nu., Hermes AI Minutes), Dzongkhag distribution map/list, platform alerts feed.
   - CentreDirectory.tsx: Multi-tenant table with search (Name/Code), Dzongkhag filter, Status filter, Plan badges, and actions: "View 360", "Impersonate Support Mode", "Edit Quotas".
   - ProvisionCentreModal.tsx: 4-step wizard:
     * Step 1: Centre Identity (Name, MoESD Registration Code, Subdomain, Dzongkhag dropdown, Gewog, Phone)
     * Step 2: Director Credentials (Name, Email, Mobile number)
     * Step 3: Plan Tier & Quotas (Community/Standard/Enterprise, Max Children, Max Staff, Voice Mins)
     * Step 4: Default Rooms setup & confirmation.
   - SubscriptionManager.tsx: 3-tier SaaS pricing matrix + B2B monthly platform invoicing table with BoB wire journal status.
   - MoesdEldsMaster.tsx: Locked 6-domain curriculum indicator view + aggregate anonymized national developmental readiness chart.
   - TelemetryOps.tsx: Hermes Voice AI queue latency, Telegram webhook status, storage utilization, and System Broadcast Banner composer.
   - ImpersonationBanner.tsx: Persistent glowing amber header bar displayed when superadmin impersonates a centre, with "Exit Support Session" button.
   - GlobalAuditLog.tsx: Filterable log of sensitive operations (Impersonation, Provisioning, Plan upgrades).

3. STORE & ROUTING INTEGRATION (appStore.tsx, AppShell.tsx, NavigationSidebar.tsx):
   - Wire all 'super_*' screens in AppShell.tsx ScreenRouter.
   - Add impersonation state in appStore: currentCentreId, isImpersonating, impersonationReason, startImpersonation(centreId, reason), exitImpersonation().
   - When isImpersonating === true, render <ImpersonationBanner /> fixed at the very top.
   - Add 'superadmin' to PersonaSwitcher dropdown with golden crown badge.

HARD RULES:
- Dual-theme compliance: text-slate-900 dark:text-white across all superadmin tables and modals.
- ZERO tilt or rotation on any card or table. Soft translate-y-0.5 elevation only.
- Strict child privacy: zero child photos or individual names on Superadmin aggregate screens.
- Build must compile cleanly: run npm run build and resolve all TypeScript warnings.
```

### Cursor Prompt 8: Enterprise Marketing & Product Landing Page with Living Story Hero
```text
@docs/HAERU_ENTERPRISE_LANDING_PAGE_SPEC.md @docs/brand/HAERU_HERO_STORY_SPEC.md @docs/brand/HAERU_CHARACTER_BRIEF.md @src/components/marketing/LandingPage.tsx @src/components/haeru/HaeruCharacter.tsx @src/components/haeru/HaeruLogo.tsx @src/components/ui/ @src/index.css @.cursorrules

Read HAERU_ENTERPRISE_LANDING_PAGE_SPEC.md and HAERU_HERO_STORY_SPEC.md in full before writing any code.

Build the comprehensive enterprise marketing page and the interactive "A Day with Haeru" Story Hero:

1. INTERACTIVE STORY HERO (src/components/marketing/HaeruStoryHero.tsx):
   - Rather than staring blankly, Haeru narrates a 4-chapter story of a child's day (Tashi at WSH Thimphu):
     * Chapter 0 (8:30 AM · Arrival): "Kuzu Zangpo La! Tashi arrived at 8:32 AM..." (Expression: 'happy')
     * Chapter 1 (11:00 AM · Wonder): "Look what Tashi built! A 6-block bridge..." (Expression: 'bringing')
     * Chapter 2 (1:15 PM · Rest): "Shhh… cozy 45m nap after lunch..." (Expression: 'calm')
     * Chapter 3 (3:30 PM · Delivery): "Director confirmed. Delivering private reflection to Mummy Deki..." (Expression: 'bringing')
   - Auto-advance every 5s with visual progress timer + Play/Pause toggle.
   - Interactive 4-step scrubber bar (click to jump).
   - Dynamic speech bubble + Live Moment Card that shifts with each chapter.
   - Clickable Haeru easter egg: triggers playful bounce and random teacher note.

2. HERO SECTION IN LandingPage.tsx:
   - Floating glass navigation bar with HaeruLogo, navigation anchor links, Sun/Moon theme toggle, and Sign In / Demo CTAs.
   - MoESD ELDS 2019 pill badge with Bhutan flag emoji.
   - Bold display typography with emerald/amber gradient accents.
   - Mount <HaeruStoryHero /> as the interactive centerpiece.
   - Trust metrics ribbon (100% Child-Scoped, 6 ELDS Domains, mBoB Native, Director Review Gate).

3. "WHAT IS HAERU" SECTION:
   - Explanation of brand philosophy (inspired by Buddhist virtue of Hārītī / guardian of children, reimagined as an original digital companion).
   - 3 feature glass cards: Gently Intelligent (Voice AI), Observed Never Tested (ELDS 2019), Culturally Rooted in Bhutan.

4. "WHO CAN USE HAERU" INTERACTIVE PERSONA TABS:
   - Interactive tab switcher between 4 personas: Director, Facilitator, Parent, Caregiver.
   - Each tab reveals detailed capabilities, pain points solved, and preview metrics.

5. "HOW IT WORKS" 3-STEP PIPELINE:
   - Step 1: Capture in Seconds (Voice & photo)
   - Step 2: Privacy Split & Director Review Gate
   - Step 3: Private Child-Scoped Delivery

6. BHUTAN MoESD ELDS (2019) 6-DOMAIN SHOWCASE:
   - Grid cards for all 6 domains (Physical, Social, Language, Approaches, Cognition, Spiritual/Cultural).
   - Explanation of ap / bl / nya ratings ("Observed, never tested; children are never ranked").

7. SECURITY, PRIVACY & DATA SOVEREIGNTY:
   - Child-atomic database scoping, camera EXIF location stripping, Biometric Quick Unlock, AES-256 encryption.

8. PRICING & SAAS TIERS:
   - Community / NGO (Nu. 0), Standard Private (Nu. 4,500/mo), Enterprise Network (Nu. 8,500/mo).

9. ACCORDION FAQ & ENTERPRISE FOOTER:
   - 5 comprehensive questions addressing privacy, grandparents, mBoB payments, and teacher workload.
   - Complete Bhutanese enterprise footer.

HARD RULES:
- Dual-theme compliance: text-slate-900 dark:text-white across all sections. Zero bare text-white on light cards.
- Zero 3D tilt/rotation on any card. Soft translate-y-0.5 elevation only.
- Buttons wired to appStore: "Explore Demo" sets role to open portal, "Sign in" sets role to 'signin'.
- Build must pass cleanly: run npm run build and fix all TypeScript errors.
```

### Cursor Prompt 9: Interactive Cute Character & Web Audio Sound Engine
```text
@docs/brand/HAERU_INTERACTIVE_SOUND_SPEC.md @src/components/haeru/HaeruCharacter.tsx @src/components/haeru/haeru.css @src/components/marketing/HaeruStoryHero.tsx @.cursorrules

Read HAERU_INTERACTIVE_SOUND_SPEC.md in full before writing any code.

Make Haeru irresistibly cute and deeply interactive with real-time eye tracking, squishy jelly physics, petting reactions, and a zero-dependency Web Audio API sound synthesizer:

1. CREATE src/lib/audio/haeruSounds.ts:
   - Implement native browser Web Audio API sound engine (zero external MP3 files).
   - Methods: playPop() (bubble pop on squish/click), playChirp() (crystal two-tone chime on hover), playPurr() (Himalayan singing bowl resonance on pet), playJoy() (celebration arpeggio), and toggleSound().
   - Store mute preference in localStorage ('haeru_sound_enabled').

2. UPDATE src/components/haeru/haeru.css:
   - Add haeru-jelly-pop (squish on click), haeru-wiggle-dance (petting wiggle), haeru-float-particle (bursting hearts/stars), and haeru-zzz (sleepy idle bubbles).

3. CREATE src/components/haeru/HaeruInteractive.tsx:
   - Wrap the character with mouse movement tracking:
     * Calculate angle/distance from Haeru center to window cursor.
     * Smoothly clamp pupil offset to max ±4.5px X and ±3.5px Y so Haeru's eyes follow the mouse!
   - Hover reaction: lifts wings, brightens cheek blush, plays playChirp().
   - Click/Squish reaction: triggers jelly squish animation, plays playPop(), and spawns a floating particle (💖 or ✦).
   - Petting streak (3 quick clicks): switches eyes to happy crescents (^ ^), plays playPurr(), and triggers happy wiggle dance.
   - Idle reaction (> 12s mouse inactivity): Haeru yawns softly and shows floating sleepy zzz bubbles; wakes up when mouse moves.
   - Sound toggle button included so users can mute/unmute audio anytime.

4. EMBED IN src/components/marketing/HaeruStoryHero.tsx:
   - Replace static character with <HaeruInteractive />.
   - Wire chapter expressions ('happy', 'calm', 'bringing') cleanly with the interactive states.

HARD RULES:
- ZERO external audio files — use pure browser window.AudioContext synthesis.
- ALL text dual-themed: text-slate-900 dark:text-white. Zero bare text-white.
- Respect prefers-reduced-motion: disable auto-squish and particle bursts when active.
- npm run build must compile with zero errors.
```

### Cursor Prompt 10: Sign-in Screen Right-Side Enterprise Showcase
```text
@docs/brand/SIGNIN_RIGHT_SHOWCASE_SPEC.md @src/components/auth/RoleLogin.tsx @src/components/haeru/HaeruInteractive.tsx @src/components/haeru/haeru.css @.cursorrules

Read SIGNIN_RIGHT_SHOWCASE_SPEC.md in full before writing any code.

Refactor the right side (<aside>) of src/components/auth/RoleLogin.tsx to eliminate the blank, empty space and create an enterprise-grade live product showcase:

1. TOP LIVE STATUS PILL:
   - Floating badge at the top: "🟢 Live School Day · 40 / 45 Here · Wangchuk's School of Heroes".

2. MULTI-LAYER FLOATING GLASS STAGE:
   - Centerpiece: <HaeruInteractive size={180} expression="happy" /> with soft ambient glowing emerald aura.
   - Top-right floating glass chip: "Director Review Gate · 12 ELDS milestones verified".
   - Bottom-left floating glass chip: "Tashi's Daily Care · 🍚 Porridge · 😴 45m Nap · 🔒 Private".
   - Bottom-right floating glass chip: "mBoB Payment Reconciled · Journal #BoB-9842 · Nu. 6,000".
   - Staggered CSS floating animations (haeru-float-chip-1/2/3) for smooth hovering.

3. ROTATING ENTERPRISE MICRO-CAROUSEL:
   - A 3-slide glass card at the bottom auto-advancing every 5.5 seconds:
     * Slide 1 (The Guardian Principle): "One staff action becomes a child-scoped family reflection. Zero public class dumps."
     * Slide 2 (MoESD ELDS 2019): "Observed, never tested. Facilitators capture milestones via Telegram in seconds."
     * Slide 3 (Native Bhutanese Banking): "Automated 4-tier tuition billing with Bank of Bhutan QR."
   - Clickable dot indicators [ ● ○ ○ ] with smooth pill animation.

4. FOOTER TRUST NOTE:
   - "🇧🇹 Aligned with MoESD ELDS 2019 · Wangchuk's School of Heroes, Babesa, Thimphu".

HARD RULES:
- Dual-theme compliance: text-slate-900 dark:text-white across all text elements. Zero bare text-white on light cards.
- Zero 3D tilt/rotation.
- Must compile cleanly with npm run build.
```

### Cursor Prompt 11: Prismatic Himalayan Rainbow Palette & Iridescent Shimmer
```text
@docs/brand/HAERU_RAINBOW_PALETTE_SPEC.md @src/components/haeru/HaeruCharacter.tsx @src/components/haeru/HaeruInteractive.tsx @src/components/haeru/haeru.css @.cursorrules

Read HAERU_RAINBOW_PALETTE_SPEC.md in full before writing any code.

Upgrade Haeru from a monochromatic green mascot into a magical, luminous Prismatic Himalayan Rainbow Cloud:

1. UPDATE SVG GRADIENTS IN src/components/haeru/HaeruCharacter.tsx:
   - Body Gradient: Replace the 3-stop green gradient with the 5-stop multi-color linear/radial rainbow gradient (Lavender #e9d5ff -> Peach #fbcfe8 -> Saffron #fef08a -> Mint #a7f3d0 -> Sky Azure #bae6fd).
   - Glow Halo: Replace green circle with chromatic rainbow halo (Saffron #fef08a -> Coral #f472b6 -> Mint #6ee7b7 -> Indigo/Violet #818cf8).
   - Asymmetric Rainbow Wings:
     * Left Wings: Warm dawn peach (#fed7aa) and coral rose (#fbcfe8).
     * Right Wings: Sky cyan (#a5f3fc) and lotus lavender (#ddd6fe).
   - Cheeks: Upgrade to warm glowing rose-peach radial gradient (#fb7185).
   - Sparkle dots: Color the 3-4 floating sparkle dots with rainbow colors (Pink #f472b6, Gold #fbbf24, Cyan #38bdf8, Violet #a855f7).

2. UPDATE src/components/haeru/haeru.css:
   - Add haeru-rainbow-shift animation (gentle 12s slow hue-rotate shimmer).
   - Add rainbow sparkle colored classes (haeru-sparkle-pink/gold/azure/violet).

3. PRESERVE ALL CUTENESS & INTERACTION:
   - Keep eye-tracking, blink, squish physics, petting reactions, and sound effects completely intact.
   - Ensure the rainbow looks soft, pearlescent, and toddler-friendly (not harsh neon).
   - Verify readability in both Light and Dark themes.

HARD RULES:
- Zero bare text-white on light cards.
- Must compile cleanly with npm run build.
```

### Cursor Prompt 12: Haeru Voice AI on Telegram — Sales Section & Interactive Simulator
```text
@docs/brand/TELEGRAM_HERMES_HAERU_SPEC.md @docs/HAERU_ENTERPRISE_LANDING_PAGE_SPEC.md @docs/hermes-observation-schema.json @src/components/marketing/LandingPage.tsx @src/components/facilitator/VoiceHub.tsx @src/components/ui/ @src/index.css @.cursorrules

Read TELEGRAM_HERMES_HAERU_SPEC.md in full before writing any code.

Emphasize Haeru Voice AI on Telegram as Haeru's #1 selling point. Build the interactive Telegram simulator and dedicated pain-to-solution sales section:

1. BRAND INTEGRITY:
   - Customer-facing brand is strictly "Haeru Voice AI" or "Haeru on Telegram" (Bot handle: @HaeruEccdBot).
   - "Hermes" is kept strictly as internal engineering architecture codename. Never sell or brand "Hermes" to parents or schools.

2. CREATE src/components/marketing/HaeruVoiceDemo.tsx:
   - Interactive dual-panel widget:
     * Left Panel (Smartphone Telegram Chat Mockup):
       - Header: "@HaeruEccdBot · Haeru Assistant"
       - Facilitator voice note message with playable audio waveform button: "🎙️ 0:12 · Voice Note from Tr. Sonam".
       - Staged photo with "EXIF Location Scrubbed ✓" badge.
     * Right Panel (Haeru Voice AI Real-Time Extraction):
       - Child identified: "Tashi Wangchuk · Kindergarten".
       - Care extracted: "🍚 Meals: Full portion · 😊 Mood: Radiant".
       - MoESD ELDS 2019 badges: "Domain: Cognition (Counting blocks) · Rating: Achieved (ap)".
       - Parent view preview: "Delivered to Mummy Deki with 100% child-scoped privacy".
       - Director status badge: "Confirmed by Director Choki in 1 tap".
   - 3 interactive scenario tabs:
     * 1. Building & Sharing (Cognition + Social)
     * 2. Circle Time Dzongkha Bridge (Language)
     * 3. Lunch & Cozy Nap (Routine Care)
   - Clicking a scenario dynamically updates both the Telegram chat and the AI extraction breakdown!

3. INTEGRATE INTO src/components/marketing/LandingPage.tsx:
   - Place a dedicated high-impact section immediately below the Hero:
     "THE DEATH OF PAPERWORK: Speak to Haeru on Telegram. Haeru Does the Rest."
   - Include the 3 Unbearable Pains vs. The 15-Second Solution comparison grid.
   - Mount <HaeruVoiceDemo /> as the interactive centerpiece.
   - Include trust highlights: "Zero New Apps for Teachers to Learn", "Colloquial Dzongkha + English", "1-Tap Director Confirmation".

HARD RULES:
- Dual-theme compliance: text-slate-900 dark:text-white across all cards. Zero bare text-white on light cards.
- Zero 3D tilt/rotation.
- Interactive scenario buttons must seamlessly update state without page reload.
- npm run build must compile with zero errors.
```

---

## Phase 8: Prismatic Himalayan Rainbow — Full-App Color Upgrade

**Spec**: `docs/brand/HAERU_PREMIUM_RAINBOW_UI_SPEC.md`  
**Problem**: Entire app feels monochromatic green. Cheap, not premium.  
**Goal**: Soft, pearlescent, crystal-prism rainbow across all surfaces.

### Prompt 13 — Full-App Premium Rainbow Color System

```
@docs/brand/HAERU_PREMIUM_RAINBOW_UI_SPEC.md @src/index.css @src/components/shared/NavigationSidebar.tsx @src/components/ui/ @src/components/marketing/LandingPage.tsx @src/components/auth/RoleLogin.tsx @.cursorrules

Read HAERU_PREMIUM_RAINBOW_UI_SPEC.md in full before touching any file.

Task: Upgrade the ENTIRE Haeru software color palette from monochromatic green to the Prismatic Himalayan Rainbow design system described in the spec.

Step 1 — src/index.css:
- Replace :root {} with Section 3A (6 prism colors, 6 canvas glows, glass-border-rainbow, split-color hover shadow, azure focus ring/border, nav tokens, cta gradient tokens, domain tokens)
- Replace html.light {} with Section 3B
- Replace .wsh-canvas background with 6-sphere version (Section 3C)
- Add .glass-panel-rainbow class after .glass-panel-3d (Section 3D)
- Fix .glass-input:focus to use --input-focus-border and --input-focus-ring (Section 3E)
- Add .haeru-voice-wave:nth-child rainbow bar colors (Section 3F)
- Add all new badge classes from Section 8 (.badge-present, .badge-absent, .badge-late, .badge-pending, .badge-paid, .badge-overdue) with html.dark overrides
- REMOVE .glass-badge-ap, .glass-badge-bl, .glass-badge-nya (replaced)
- Add keyframe animations from Section 9 (prism-shimmer, prism-pulse, haeru-float, .gradient-shimmer, .haeru-float, reduced motion media queries)

Step 2 — NavigationSidebar.tsx:
- Add SECTION_COLORS map (Section 4)
- Apply per-section active color classes to active nav items
- Add sidebar gradient logo text (bg-clip-text text-transparent gradient)
- Add rainbow divider line between major nav sections

Step 3 — GlassButton.tsx (or wherever primary buttons are defined):
- Implement 4 variants: primary (teal-azure-violet gradient + shimmer overlay), secondary (rainbow border glow), destructive (rose-pink gradient), success (teal-emerald gradient)

Step 4 — KPI/Dashboard cards:
- Add border-l-2 left accent in the correct color per card type (attendance=teal, finance=amber, absence=rose, alerts=violet)
- Apply DOMAIN_STYLES map to ELDS domain progress cards

Step 5 — LandingPage.tsx:
- Add 4 animated prismatic orb divs (rose, amber, violet, teal) as absolute positioned background layer behind hero content

Step 6 — RoleLogin.tsx:
- Apply prismatic gradient background, rainbow right-edge divider line, and ambient orbs to left brand panel

After all edits: run npm run build and fix any TypeScript errors before finishing.
Report final build status and a scorecard across all 10 enterprise dimensions.
```
