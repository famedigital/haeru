# HAERU — Prismatic Himalayan Rainbow Design System
### Full-App Premium Color Upgrade Specification
**Version**: 1.0 | **Status**: Ready for Cursor Implementation  
**Replaces**: `HAERU_RAINBOW_PALETTE_SPEC.md` (avatar-only, now deprecated)

---

## 0. The Problem Statement

The current UI uses a **single dominant emerald-green** (`#10b981`) for nearly every accent:
- Canvas glow-1 → green
- Glass hover shadow → green glow
- Input focus ring → green
- Badges → mostly green
- Button CTAs → teal/green

Result: feels **monochromatic, cheap, and flat**. The entire app looks like one shade of green with a dark canvas.

---

## 1. Design Philosophy: Prismatic Himalayan Rainbow

### Inspiration
- **Bhutan Lungta (Prayer Flag) Colors**: Blue (sky), White (cloud/snow), Red (fire/passion), Green (nature), Yellow (earth/sun)
- **Himalayan Dawn**: A sky that shifts from deep violet → rose → amber → teal as the sun rises over the mountains
- **Crystal Prism**: Pure white light split into its full spectral components — rich, clean, layered
- **NOT**: Neon rainbow vomit, harsh 90s multicolor, garish saturation

### Aesthetic Target
- **Soft, pearlescent, iridescent** — like light catching a crystal or dewdrop
- **Premium, layered** — each surface has a subtle hue identity, not flat gray
- **Child-friendly warmth** — warm rose and gold tones mixed with cool azure and teal
- **Enterprise-legible** — contrast ratios WCAG AA compliant in both themes

### Reference Products
- Arc Browser (iridescent tab bar, soft gradient sidebar)
- Linear (subtle per-section color accents)
- Stripe Dashboard (clean gradient hero with prismatic depth)
- Notion (neutral + colorful accent system)

---

## 2. The Six Prismatic Accent Colors

These six colors map directly to the **ELDS 6 Domains** and anchor the entire rainbow system:

| Token Name | Color Name | Hex | RGB | Domain |
|---|---|---|---|---|
| `--prism-rose` | Himalayan Rose | `#fb7185` | 251, 113, 133 | Physical Dev |
| `--prism-amber` | Saffron Gold | `#fbbf24` | 251, 191, 36 | Social-Emotional |
| `--prism-lime` | Himalayan Jade | `#86efac` | 134, 239, 172 | Language & Literacy |
| `--prism-teal` | Turquoise Lake | `#2dd4bf` | 45, 212, 191 | Approaches to Learning |
| `--prism-azure` | Clear Sky | `#60a5fa` | 96, 165, 250 | Cognitive Development |
| `--prism-violet` | Lotus Purple | `#c084fc` | 192, 132, 252 | Spiritual & Cultural |

---

## 3. CSS Token Overhaul — `src/index.css`

### 3A. Dark Theme `:root` Tokens

Replace the existing `:root { }` block entirely with:

```css
:root {
  /* ── Prismatic Six ─────────────────────────────────────────── */
  --prism-rose:   rgba(251, 113, 133, 1);
  --prism-amber:  rgba(251, 191,  36, 1);
  --prism-lime:   rgba(134, 239, 172, 1);
  --prism-teal:   rgba( 45, 212, 191, 1);
  --prism-azure:  rgba( 96, 165, 250, 1);
  --prism-violet: rgba(192, 132, 252, 1);

  /* ── Canvas (Dark: Midnight Himalayan Crystal) ─────────────── */
  --canvas-bg: linear-gradient(165deg, #090d16 0%, #0f172a 55%, #111827 100%);

  /* Six ambient spheres — one per prism color, arranged around screen */
  --canvas-glow-1: rgba(251, 113, 133, 0.13);  /* rose   — top-left */
  --canvas-glow-2: rgba(251, 191,  36, 0.10);  /* amber  — top-right */
  --canvas-glow-3: rgba( 96, 165, 250, 0.10);  /* azure  — center-right */
  --canvas-glow-4: rgba(192, 132, 252, 0.09);  /* violet — bottom-right */
  --canvas-glow-5: rgba( 45, 212, 191, 0.11);  /* teal   — bottom-left */
  --canvas-glow-6: rgba(134, 239, 172, 0.08);  /* lime   — center */

  /* ── Glass Panels ──────────────────────────────────────────── */
  --glass-bg:              rgba(255, 255, 255, 0.05);
  --glass-bg-hover:        rgba(255, 255, 255, 0.08);
  --glass-border:          rgba(255, 255, 255, 0.10);
  --glass-border-specular: rgba(255, 255, 255, 0.25);
  --glass-border-left:     rgba(255, 255, 255, 0.16);

  /* Rainbow rim: top edge catches a prismatic shimmer */
  --glass-border-rainbow:  linear-gradient(90deg,
    rgba(251,113,133,0.5) 0%,
    rgba(251,191, 36,0.5) 20%,
    rgba(134,239,172,0.5) 40%,
    rgba( 45,212,191,0.5) 60%,
    rgba( 96,165,250,0.5) 80%,
    rgba(192,132,252,0.5) 100%
  );

  /* Split-color hover glow (rose + azure ambient aura) */
  --glass-shadow:       0 16px 40px rgba(0,0,0,0.4),
                        inset 0 1px 1px rgba(255,255,255,0.18),
                        inset 0 -1px 2px rgba(0,0,0,0.3);
  --glass-hover-shadow: 0 24px 50px rgba(0,0,0,0.5),
                        0 0 20px rgba(251,113,133,0.14),
                        0 0 40px rgba( 96,165,250,0.10),
                        inset 0 1px 2px rgba(255,255,255,0.28);

  /* ── Inputs & Pills ────────────────────────────────────────── */
  --pill-bg:      rgba(15, 23, 42, 0.65);
  --pill-border:  rgba(255, 255, 255, 0.12);
  --input-bg:     rgba(15, 23, 42, 0.60);
  --input-border: rgba(255, 255, 255, 0.14);
  --input-focus-ring:   rgba(96, 165, 250, 0.30);   /* azure focus, not green */
  --input-focus-border: rgba(96, 165, 250, 0.70);

  /* ── Typography ────────────────────────────────────────────── */
  --text-main:  #f8fafc;
  --text-muted: #94a3b8;
  --text-faint: #64748b;

  /* ── Tables ────────────────────────────────────────────────── */
  --table-border:     rgba(255, 255, 255, 0.08);
  --table-row-hover:  rgba(255, 255, 255, 0.04);

  /* ── Sidebar Section Colors (nav accent per section) ───────── */
  --nav-children:   rgba(251, 113, 133, 1);   /* rose   — children section */
  --nav-finance:    rgba(251, 191,  36, 1);   /* amber  — finance section */
  --nav-learning:   rgba(192, 132, 252, 1);   /* violet — ELDS/learning */
  --nav-people:     rgba( 96, 165, 250, 1);   /* azure  — staff/people */
  --nav-operations: rgba( 45, 212, 191, 1);   /* teal   — operations */
  --nav-superadmin: rgba(251, 191,  36, 1);   /* gold   — superadmin */

  /* ── CTA Gradient ──────────────────────────────────────────── */
  --gradient-cta-primary:   linear-gradient(135deg, #2dd4bf 0%, #60a5fa 50%, #c084fc 100%);
  --gradient-cta-secondary: linear-gradient(135deg, #fb7185 0%, #fbbf24 100%);
  --gradient-hero-title:    linear-gradient(135deg, #60a5fa 0%, #c084fc 40%, #fb7185 80%, #fbbf24 100%);

  /* ── Domain-specific KPI card tint ────────────────────────── */
  --domain-physical:   rgba(251, 113, 133, 0.12);
  --domain-social:     rgba(251, 191,  36, 0.12);
  --domain-language:   rgba(134, 239, 172, 0.12);
  --domain-approaches: rgba( 45, 212, 191, 0.12);
  --domain-cognitive:  rgba( 96, 165, 250, 0.12);
  --domain-spiritual:  rgba(192, 132, 252, 0.12);
}
```

### 3B. Light Theme Tokens

Replace the existing `:root[data-theme='light'], html.light { }` block with:

```css
:root[data-theme='light'],
html.light {
  /* ── Canvas (Sunrise Himalayan Frosted Prism) ──────────────── */
  --canvas-bg: linear-gradient(165deg, #fbf8f3 0%, #f4eee3 55%, #eae1d2 100%);

  --canvas-glow-1: rgba(251, 113, 133, 0.10);
  --canvas-glow-2: rgba(251, 191,  36, 0.12);
  --canvas-glow-3: rgba( 96, 165, 250, 0.09);
  --canvas-glow-4: rgba(192, 132, 252, 0.07);
  --canvas-glow-5: rgba( 45, 212, 191, 0.09);
  --canvas-glow-6: rgba(134, 239, 172, 0.06);

  /* ── Glass Panels ──────────────────────────────────────────── */
  --glass-bg:              rgba(255, 255, 255, 0.72);
  --glass-bg-hover:        rgba(255, 255, 255, 0.88);
  --glass-border:          rgba(226, 214, 198, 0.80);
  --glass-border-specular: rgba(255, 255, 255, 0.95);
  --glass-border-left:     rgba(255, 255, 255, 0.85);

  --glass-shadow:       0 10px 30px -10px rgba(51,65,92,0.08),
                        0 1px 3px rgba(51,65,92,0.05),
                        inset 0 1px 1px rgba(255,255,255,0.90);
  --glass-hover-shadow: 0 20px 40px -12px rgba(51,65,92,0.14),
                        0 0 20px rgba(251,113,133,0.10),
                        0 0 40px rgba( 96,165,250,0.08),
                        inset 0 1px 2px rgba(255,255,255,1);

  /* ── Inputs & Pills ────────────────────────────────────────── */
  --pill-bg:      rgba(255, 255, 255, 0.85);
  --pill-border:  rgba(226, 214, 198, 0.80);
  --input-bg:     rgba(255, 255, 255, 0.90);
  --input-border: rgba(226, 214, 198, 0.90);
  --input-focus-ring:   rgba(96, 165, 250, 0.20);
  --input-focus-border: rgba(96, 165, 250, 0.55);

  /* ── Typography ────────────────────────────────────────────── */
  --text-main:  #1e293b;
  --text-muted: #475569;
  --text-faint: #94a3b8;

  /* ── Tables ────────────────────────────────────────────────── */
  --table-border:    rgba(226, 214, 198, 0.70);
  --table-row-hover: rgba(248, 240, 229, 0.65);
}
```

### 3C. Canvas — Expand to 6 Spheres

Replace `.wsh-canvas` background with 6-stop version:

```css
.wsh-canvas {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 70% 50% at  8% 15%, var(--canvas-glow-1), transparent 55%),
    radial-gradient(ellipse 55% 40% at 92%  8%, var(--canvas-glow-2), transparent 50%),
    radial-gradient(ellipse 45% 35% at 88% 55%, var(--canvas-glow-3), transparent 50%),
    radial-gradient(ellipse 50% 45% at 72% 95%, var(--canvas-glow-4), transparent 55%),
    radial-gradient(ellipse 60% 40% at 12% 88%, var(--canvas-glow-5), transparent 55%),
    radial-gradient(ellipse 40% 30% at 50% 50%, var(--canvas-glow-6), transparent 60%),
    var(--canvas-bg);
  transition: background 0.3s ease;
}
```

### 3D. Glass Panel Rainbow Rim Class

Add AFTER `.glass-panel-3d`:

```css
/* Rainbow Rim Glass — use on hero cards, KPI cards, landing sections */
.glass-panel-rainbow {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  transition:
    transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.25s ease;
}

.glass-panel-rainbow::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--glass-border-rainbow);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.glass-panel-rainbow:hover {
  box-shadow: var(--glass-hover-shadow);
  transform: translateY(-2px);
}
```

### 3E. Input Focus — Azure Ring

```css
.glass-input:focus {
  outline: none;
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px var(--input-focus-ring);
}
```

### 3F. Voice Wave — Rainbow Bars

```css
.haeru-voice-wave:nth-child(1) { background: var(--prism-rose); }
.haeru-voice-wave:nth-child(2) { background: var(--prism-amber); }
.haeru-voice-wave:nth-child(3) { background: var(--prism-teal); }
.haeru-voice-wave:nth-child(4) { background: var(--prism-azure); }
.haeru-voice-wave:nth-child(5) { background: var(--prism-violet); }
```

---

## 4. Navigation Sidebar — Per-Section Color Accents

File: `src/components/shared/NavigationSidebar.tsx`

### Section Color Map

```tsx
const SECTION_COLORS = {
  children:   { active: 'bg-rose-500/15   text-rose-400   dark:text-rose-300',   dot: 'bg-rose-400' },
  finance:    { active: 'bg-amber-500/15  text-amber-500  dark:text-amber-300',  dot: 'bg-amber-400' },
  learning:   { active: 'bg-violet-500/15 text-violet-400 dark:text-violet-300', dot: 'bg-violet-400' },
  people:     { active: 'bg-blue-400/15   text-blue-400   dark:text-blue-300',   dot: 'bg-blue-400' },
  operations: { active: 'bg-teal-400/15   text-teal-400   dark:text-teal-300',   dot: 'bg-teal-400' },
  superadmin: { active: 'bg-amber-400/15  text-amber-400  dark:text-amber-200',  dot: 'bg-amber-300' },
};
```

### Active Item Pattern

```tsx
// Active nav item:
<div className={`flex items-center gap-2 px-3 py-2 rounded-xl
  ${SECTION_COLORS[section].active}
  ring-1 ring-inset ring-current/20 font-semibold`}>
  <Icon className="w-4 h-4" />
  <span>{label}</span>
</div>

// Inactive item:
<div className="flex items-center gap-2 px-3 py-2 rounded-xl
  text-slate-500 dark:text-slate-400
  hover:text-slate-800 dark:hover:text-slate-200
  hover:bg-white/30 dark:hover:bg-white/5
  transition-all duration-150">
  <Icon className="w-4 h-4" />
  <span>{label}</span>
</div>

// Section divider between major groups:
<div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-slate-200/50 dark:via-white/8 to-transparent" />

// Sidebar logo text:
<span className="font-display text-lg font-bold
  bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400
  bg-clip-text text-transparent">
  Haeru
</span>
```

---

## 5. Button System — Premium Gradient CTAs

### Primary (teal-azure-violet shimmer)

```tsx
<button className="
  relative overflow-hidden px-6 py-2.5 rounded-xl
  font-semibold text-white text-sm
  bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400
  hover:from-teal-300 hover:via-blue-300 hover:to-violet-300
  shadow-lg shadow-blue-400/20 hover:shadow-xl hover:shadow-blue-400/30
  active:scale-[0.97] transition-all duration-200">
  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
    translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
  {children}
</button>
```

### Secondary (rainbow border glow)

```tsx
<button className="
  px-6 py-2.5 rounded-xl font-semibold text-sm
  text-slate-700 dark:text-slate-200
  border border-slate-200 dark:border-white/15
  hover:border-blue-400/50 hover:shadow-md hover:shadow-blue-400/10
  bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/8
  active:scale-[0.97] transition-all duration-200">
  {children}
</button>
```

### Destructive (coral-rose gradient)

```tsx
<button className="
  px-6 py-2.5 rounded-xl font-semibold text-white text-sm
  bg-gradient-to-r from-rose-500 to-pink-500
  hover:from-rose-400 hover:to-pink-400
  shadow-md shadow-rose-500/20 active:scale-[0.97] transition-all duration-200">
  {children}
</button>
```

### Success / Confirm (teal gradient)

```tsx
<button className="
  px-6 py-2.5 rounded-xl font-semibold text-white text-sm
  bg-gradient-to-r from-teal-500 to-emerald-400
  hover:from-teal-400 hover:to-emerald-300
  shadow-md shadow-teal-500/20 active:scale-[0.97] transition-all duration-200">
  {children}
</button>
```

---

## 6. KPI & Domain Cards — Contextual Color Tints

### KPI Card Type → Color

```tsx
// Attendance → teal left border
<div className="glass-panel-3d rounded-2xl p-4 border-l-2 border-teal-400/60 bg-teal-400/5 dark:bg-teal-400/4">

// Finance/Fee → amber left border
<div className="glass-panel-3d rounded-2xl p-4 border-l-2 border-amber-400/60 bg-amber-400/5 dark:bg-amber-400/4">

// Leave/Absence → rose left border
<div className="glass-panel-3d rounded-2xl p-4 border-l-2 border-rose-400/60 bg-rose-400/5 dark:bg-rose-400/4">

// Alert/Notification → violet left border
<div className="glass-panel-3d rounded-2xl p-4 border-l-2 border-violet-400/60 bg-violet-400/5 dark:bg-violet-400/4">
```

### ELDS Domain Style Map

```tsx
const DOMAIN_STYLES = {
  physical:   { bg: 'bg-rose-400/10',   border: 'border-rose-400/40',   text: 'text-rose-500 dark:text-rose-300',    badge: 'bg-rose-400/15' },
  social:     { bg: 'bg-amber-400/10',  border: 'border-amber-400/40',  text: 'text-amber-600 dark:text-amber-300',  badge: 'bg-amber-400/15' },
  language:   { bg: 'bg-lime-400/10',   border: 'border-lime-400/40',   text: 'text-lime-600  dark:text-lime-300',   badge: 'bg-lime-400/15' },
  approaches: { bg: 'bg-teal-400/10',   border: 'border-teal-400/40',   text: 'text-teal-600  dark:text-teal-300',   badge: 'bg-teal-400/15' },
  cognitive:  { bg: 'bg-blue-400/10',   border: 'border-blue-400/40',   text: 'text-blue-600  dark:text-blue-300',   badge: 'bg-blue-400/15' },
  spiritual:  { bg: 'bg-violet-400/10', border: 'border-violet-400/40', text: 'text-violet-600 dark:text-violet-300', badge: 'bg-violet-400/15' },
};
```

---

## 7. Page Header Gradient Titles

```tsx
// Dashboard / App page titles (H1)
<h1 className="font-display text-3xl font-bold
  bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800
  dark:from-white dark:via-slate-100 dark:to-slate-300
  bg-clip-text text-transparent">
  Today's Dashboard
</h1>

// Landing / Marketing hero title — full rainbow
<h1 className="font-display text-5xl font-bold
  bg-gradient-to-r from-teal-400 via-blue-400 to-violet-500
  dark:from-teal-300 dark:via-blue-300 dark:to-violet-400
  bg-clip-text text-transparent">
  Haeru
</h1>
```

---

## 8. Status Badge CSS (replace old glass-badge-* system)

Add to `src/index.css`, remove old `.glass-badge-ap`, `.glass-badge-bl`, `.glass-badge-nya`:

```css
.badge-present  { background: rgba(134,239,172,0.15); border: 1px solid rgba(134,239,172,0.45); color: #16a34a; box-shadow: 0 0 10px rgba(134,239,172,0.15); }
.badge-absent   { background: rgba(251,113,133,0.15); border: 1px solid rgba(251,113,133,0.45); color: #be123c; }
.badge-late     { background: rgba(251,191, 36,0.15); border: 1px solid rgba(251,191, 36,0.45); color: #b45309; }
.badge-pending  { background: rgba( 96,165,250,0.15); border: 1px solid rgba( 96,165,250,0.45); color: #1d4ed8; }
.badge-paid     { background: rgba( 45,212,191,0.15); border: 1px solid rgba( 45,212,191,0.45); color: #0d9488; }
.badge-overdue  { background: rgba(192,132,252,0.15); border: 1px solid rgba(192,132,252,0.45); color: #7c3aed; }

html.dark .badge-present { color: #86efac; }
html.dark .badge-absent  { color: #fb7185; }
html.dark .badge-late    { color: #fbbf24; }
html.dark .badge-pending { color: #60a5fa; }
html.dark .badge-paid    { color: #2dd4bf; }
html.dark .badge-overdue { color: #c084fc; }
```

---

## 9. New Keyframe Animations

Add to `src/index.css`:

```css
@keyframes prism-shimmer {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-shimmer {
  background-size: 200% 200%;
  animation: prism-shimmer 4s ease infinite;
}

@keyframes prism-pulse {
  0%, 100% { opacity: 0.8; filter: blur(32px); }
  50%       { opacity: 1.0; filter: blur(24px); }
}

@keyframes haeru-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}

.haeru-float {
  animation: haeru-float 3.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .haeru-float,
  .gradient-shimmer { animation: none !important; }
}
```

---

## 10. Landing Page — Prismatic Hero Orbs

```tsx
// Animated background orb layer (add BEFORE hero content in LandingPage.tsx)
<div className="absolute inset-0 pointer-events-none overflow-hidden">
  <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full blur-3xl
    bg-gradient-radial from-rose-400/20 to-transparent
    animate-[prism-pulse_4s_ease_infinite]" />
  <div className="absolute top-[10%] right-[-5%] w-80 h-80 rounded-full blur-3xl
    bg-gradient-radial from-amber-400/18 to-transparent
    animate-[prism-pulse_5s_ease_1s_infinite]" />
  <div className="absolute bottom-[5%] left-[20%] w-72 h-72 rounded-full blur-3xl
    bg-gradient-radial from-violet-400/16 to-transparent
    animate-[prism-pulse_4.5s_ease_0.5s_infinite]" />
  <div className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full blur-3xl
    bg-gradient-radial from-teal-400/14 to-transparent
    animate-[prism-pulse_3.5s_ease_1.5s_infinite]" />
</div>
```

---

## 11. Sign-In Left Panel — Prismatic Brand Side

```tsx
// Left panel of RoleLogin.tsx sign-in split screen
<div className="relative flex flex-col items-center justify-center overflow-hidden
  bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

  {/* Prismatic edge divider (right border) */}
  <div className="absolute right-0 top-0 bottom-0 w-px
    bg-gradient-to-b from-transparent via-teal-400/40 to-transparent" />

  {/* Ambient orbs */}
  <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl bg-violet-500/12" />
  <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl bg-teal-500/10" />
  <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-2xl bg-rose-500/08" />
</div>
```

---

## 12. File Change Map for Cursor

| File | Change | Section Ref |
|---|---|---|
| `src/index.css` | Replace `:root` tokens (6 prism colors, 6 glows, rainbow border, split shadow, azure focus, nav/cta/domain tokens) | 3A |
| `src/index.css` | Replace `html.light` tokens | 3B |
| `src/index.css` | Replace `.wsh-canvas` background (6 spheres) | 3C |
| `src/index.css` | Add `.glass-panel-rainbow` class | 3D |
| `src/index.css` | Fix `.glass-input:focus` to azure | 3E |
| `src/index.css` | Add `.haeru-voice-wave:nth-child` colors | 3F |
| `src/index.css` | Add new badge classes, remove old glass-badge-* | 8 |
| `src/index.css` | Add keyframe animations | 9 |
| `src/components/shared/NavigationSidebar.tsx` | Add SECTION_COLORS map + per-section active styles | 4 |
| `src/components/ui/GlassButton.tsx` | Implement 4 gradient button variants | 5 |
| `src/components/dashboard/TodayDashboard.tsx` | KPI card border-l-2 tints | 6 |
| ELDS domain card components | Apply DOMAIN_STYLES map | 6 |
| `src/components/marketing/LandingPage.tsx` | Add prismatic orb background layer | 10 |
| `src/components/auth/RoleLogin.tsx` | Add prismatic left panel orbs + divider | 11 |

---

## 13. Strict Rules — Do NOT Violate

| Rule |
|---|
| NEVER `text-white` bare on glass surfaces — always `text-slate-900 dark:text-white` |
| NEVER `rotateX / rotateY` card animations |
| Canvas glow opacities ≤ 0.13 dark, ≤ 0.12 light |
| All text must pass WCAG AA contrast |
| `--prism-*` tokens MUST be in `:root` (not in dark/light overrides) |
| NO neon/fluorescent — keep all colors soft, pearlescent |
| After ALL changes: `npm run build` must be green (0 TypeScript errors) |

---

## 14. Cursor Prompt 13

Paste this EXACTLY into Cursor chat:

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
