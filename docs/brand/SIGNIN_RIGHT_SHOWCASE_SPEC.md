# Haeru — Sign-in Screen Right-Side Enterprise Showcase Specification
**Document:** `docs/brand/SIGNIN_RIGHT_SHOWCASE_SPEC.md`  
**Target:** Cursor AI Composer  
**Location in Codebase:** `src/components/auth/RoleLogin.tsx` (right `<aside>` element)  
**Purpose:** Transform the right side of the split Sign-In screen from a blank, empty box into an active, multi-layered, enterprise-grade product showcase demonstrating live care reflections, floating Bhutanese ECCD notifications, and an auto-cycling micro-feature carousel.

---

## 1. Problem & Design Solution

### The Problem:
Currently, the right side of `RoleLogin.tsx` (`<aside>`) has an isolated static character inside a box with large expanses of empty gradient space and static text at the bottom. Visitors perceive it as unfinished or blank.

### The Enterprise Solution:
In world-class SaaS platforms (Stripe, Linear, Supabase, Duolingo), the right panel immerses the user in the **living product experience**. 

For Haeru, the right panel becomes the **"Haeru Live Centre Stage"**:
1. **Live Centre Status Banner**: Displays real-time mock pulse (`● Live School Day · 40 / 45 Children Present · WSH Thimphu`).
2. **Multi-Layered Floating Glass Stage**:
   - Center: `<HaeruInteractive size={150} expression="happy" />` with glowing emerald aura and floating sparkles.
   - Top-Right Floating Chip: **Director Confirmation Gate** (`"Director Choki confirmed 12 ELDS milestones"`).
   - Bottom-Left Floating Chip: **Child-Scoped Care Moment** (`"👶 Tashi's Day: 🍚 Porridge · 😴 45m Nap · 🔒 Private"`).
   - Bottom-Right Floating Chip: **Bank of Bhutan Payment** (`"🏦 mBoB Journal #9842 verified · Nu. 6,000"`).
3. **Rotating Enterprise Micro-Carousel**:
   - A 3-slide glass card with smooth fade transitions and clickable indicator dots (`[ ● ○ ○ ]`):
     - **Slide 1**: *The Guardian Principle* — "One staff action becomes a child-scoped family reflection. No public class dumps, zero peer data leaks."
     - **Slide 2**: *MoESD ELDS 2019 Curriculum* — "Observed, never tested. Facilitators speak voice notes in Telegram; Hermes AI maps milestones in seconds."
     - **Slide 3**: *Native Bhutanese Banking* — "Automated 4-tier tuition invoicing and Bank of Bhutan (mBoB) / BNB (mPay) QR reconciliation."
4. **Bottom Trust Badge**:
   - *"Aligned with MoESD Early Childhood Standards · Kingdom of Bhutan 🇧🇹"*

---

## 2. Visual Wireframe of the Right Side (`<aside>`)

```
┌────────────────────────────────────────────────────────────────────────┐
│  [aside container: rounded-[2.5rem] frosted glass panel, ambient glow] │
│                                                                        │
│   [ Pill: 🟢 Live School Day · 40 / 45 Here · WSH Thimphu ]            │
│                                                                        │
│              ╭──────────────────────────────────────────────╮          │
│              │ 🔔 Director Review Gate                      │          │
│              │ "12 ELDS milestones confirmed by Director"   │          │
│              ╰──────────────────────────────────────────────╯          │
│                                                                        │
│                         ╭───────────────────╮                          │
│                         │   🌿 HAERU        │                          │
│                         │   INTERACTIVE     │                          │
│                         │   (eyes follow,   │                          │
│                         │    squish/sound)  │                          │
│                         ╰───────────────────╯                          │
│                                                                        │
│    ╭──────────────────────────────╮   ╭────────────────────────────╮   │
│    │ 👶 Tashi's Day · Private     │   │ 🏦 Bank of Bhutan (mBoB)   │   │
│    │ 🍚 Porridge · 😴 45m Nap     │   │ Journal #9842 verified     │   │
│    │ "Mummy Deki notified"        │   │ Nu. 6,000 Tuition receipt  │   │
│    ╰──────────────────────────────╯   ╰────────────────────────────╯   │
│                                                                        │
│   ╭────────────────────────────────────────────────────────────────╮   │
│   │  ✦ THE GUARDIAN PRINCIPLE                                      │   │
│   │  "One staff action becomes a child-scoped family reflection.   │   │
│   │   Zero classroom dumps, zero peer data leaks."                 │   │
│   │                                                                │   │
│   │  [ ● Active Slide ]   [ ○ Slide 2 ]   [ ○ Slide 3 ]            │   │
│   ╰────────────────────────────────────────────────────────────────╯   │
│                                                                        │
│   🇧🇹 Aligned with MoESD ELDS 2019 · Wangchuk's School of Heroes       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Code Specifications

### A. Floating Glass Chips (Micro-Animation Specs):
Floating chips use soft CSS floating keyframes with staggered animation delays so they float like gentle clouds in a mountain breeze:

```css
@keyframes float-gentle-1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-6px) rotate(0.5deg); }
}

@keyframes float-gentle-2 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-8px) rotate(-0.5deg); }
}

.haeru-float-chip-1 { animation: float-gentle-1 4.5s ease-in-out infinite; }
.haeru-float-chip-2 { animation: float-gentle-2 5.2s ease-in-out infinite; animation-delay: 1s; }
.haeru-float-chip-3 { animation: float-gentle-1 4.8s ease-in-out infinite; animation-delay: 2s; }
```

### B. The 3 Floating Chips Layout:

#### Chip 1: Top Notification Chip (Director Confirmation)
```tsx
<div className="absolute top-16 right-8 haeru-float-chip-1 z-20 hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-teal-500/20 dark:border-teal-400/20 shadow-lg max-w-xs">
  <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 text-sm">
    ✓
  </div>
  <div className="text-left text-xs">
    <p className="font-bold text-slate-900 dark:text-white">Director Review Gate</p>
    <p className="text-slate-500 dark:text-slate-400">12 ELDS milestones verified</p>
  </div>
</div>
```

#### Chip 2: Bottom-Left Chip (Child-Scoped Care Moment)
```tsx
<div className="absolute bottom-40 left-6 haeru-float-chip-2 z-20 hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 dark:border-amber-400/20 shadow-lg max-w-xs">
  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 text-sm">
    👶
  </div>
  <div className="text-left text-xs">
    <p className="font-bold text-slate-900 dark:text-white">Tashi's Daily Care</p>
    <p className="text-slate-500 dark:text-slate-400">🍚 Porridge · 😴 45m Nap · 🔒 Private</p>
  </div>
</div>
```

#### Chip 3: Bottom-Right Chip (Bank of Bhutan Reconciliation)
```tsx
<div className="absolute bottom-44 right-8 haeru-float-chip-3 z-20 hidden 2xl:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-400/20 shadow-lg max-w-xs">
  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm">
    🏦
  </div>
  <div className="text-left text-xs">
    <p className="font-bold text-slate-900 dark:text-white">mBoB Payment Reconciled</p>
    <p className="text-slate-500 dark:text-slate-400">Journal #BoB-9842 · Nu. 6,000</p>
  </div>
</div>
```

---

### C. The Rotating Micro-Carousel Component

A self-contained stateful slide card inside the right panel:

```tsx
const CAROUSEL_SLIDES = [
  {
    tag: "THE GUARDIAN PRINCIPLE",
    headline: "One staff action becomes a child-scoped family reflection.",
    description: "Parents only see their own child's moments. Zero public classroom dumps, zero peer data leaks.",
    highlight: "100% Child-Atomic Privacy",
  },
  {
    tag: "BHUTAN MoESD ELDS 2019",
    headline: "Observed, never tested. Facilitators capture milestones in seconds.",
    description: "Speak voice notes into Telegram; Hermes AI extracts 6-domain indicators, held for Director review.",
    highlight: "6 Official Domains",
  },
  {
    tag: "NATIVE BHUTANESE BANKING",
    headline: "Automated 4-tier tuition billing with Bank of Bhutan QR.",
    description: "Instant dynamic mBoB and mPay payment reconciliation with catch-up proration for late joiners.",
    highlight: "Bank of Bhutan & BNB Native",
  },
]
```

- Advances smoothly every 5.5 seconds.
- Clickable dot indicators `[ ● ○ ○ ]` at the bottom of the card with active pill styling (`w-6 bg-teal-500 rounded-full transition-all`).
- Smooth fade/slide transition between cards.

---

### D. Center Character Stage

Replace the plain character card with:
```tsx
<div className="relative flex flex-col items-center justify-center py-6">
  {/* Ambient glowing radial aura */}
  <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 blur-3xl -z-10 pointer-events-none" />
  
  {/* The Interactive Character */}
  <div className="relative z-10 transition-transform duration-300 hover:scale-105">
    <HaeruInteractive
      size={180}
      expression="happy"
      label="Haeru, your school companion"
      showSoundToggle={false}
    />
  </div>
</div>
```

---

## 4. Hard Quality & Theme Directives for Cursor

1. **Dual Theme Compliance**:
   - In Light Mode: The right panel background is a warm, rich frosted milk-glass canvas with soft emerald tints (`bg-emerald-950/5 border-emerald-500/20 text-slate-900`).
   - In Dark Mode: Deep obsidian with glowing emerald rim (`dark:bg-slate-900/60 dark:border-white/10 text-white`).
   - ALL text must use `text-slate-900 dark:text-white` or `text-slate-600 dark:text-slate-300`. Zero bare `text-white`.
2. **Zero 3D Rotation Tilt**: Floating chips move on `translateY` and subtle `rotate(0.5deg)` only — no mouse perspective skewing.
3. **Responsive Grace**: On screens `< 1024px` (`hidden lg:flex`), the right side collapses gracefully, and mobile users see the clean left sign-in form with Haeru on top.
4. **Build Clean**: Must pass `npm run build` with zero TypeScript errors.

---

## 5. Cursor Composer Prompt

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
