# Haeru — Animated Character Build Spec for Cursor
**Version:** 1.0 · 2026-11-02  
**Product:** Haeru (ECCD app for Wangchuk's School of Heroes, Thimphu, Bhutan)  
**Role of this doc:** Complete design-in-words spec for Cursor to build the Haeru character in React + SVG + CSS animations. Read `docs/brand/HAERU_CHARACTER_BRIEF.md` first for brand context.

> IMPORTANT: Haeru is an ORIGINAL fictional guardian companion — NOT a depiction of any Buddhist deity, classical Hārītī painting, national Druk emblem, or existing cartoon IP. The build must reflect this originality in every shape, name, and comment.

---

## 1. Character Design System

### 1.1 Concept: "Soft Round Guardian-Friend" (Direction A — PRIMARY)

Haeru's body reads as a gently glowing, cloud-soft orb-being — like a small, friendly cumulus cloud that learned to watch over children. Not an animal, not a human, not a deity. An original *presence*.

#### Anatomy (all shapes soft-rounded, NO sharp corners ever)

```
        ╭──────────╮          ← Head/Body: one unified teardrop-pear form
       ╱  👁    👁  ╲         ← Eyes: large, warm, offset slightly downward
      │   ·      ·   │        ← Cheek blush: soft amber warm circles
      │     ╰──╯     │        ← Mouth: tiny curved smile (3 states)
       ╲   ~~~~~~~~  ╱        ← Underbelly: softer, lighter cream-mint band
        ╰──────────╯
       ╱╲          ╱╲         ← "Wings": soft rounded PETAL FINS (NOT angel wings)
      ╱  ╲        ╱  ╲           — 2 petals per side, like rounded leaf-petal pairs
            ╲  ╱                  — subtle, small — not dominant
             ╲╱
         two tiny nub feet        ← Two small rounded ellipse nubs at the bottom
```

**Key shape rules:**
- **Head/body** = single blob path — pear-shaped, wider at top, narrows at bottom
- **Eyes** = large ellipse whites + smaller circle irises (teal-emerald) + tiny white catchlight dot
- **Blush** = 2 ellipses at cheek position, amber/peach, `opacity: 0.45`, blurred with SVG feGaussianBlur
- **Wings** = 2 pairs of rounded petal-paths on each side, layered BEHIND the body
- **Feet/base** = 2 small ellipse nubs at the very bottom
- **Glow halo** = radial gradient circle behind the whole character, soft, `opacity: 0.3`

---

### 1.2 Colour Palette (hex-locked)

| Token | Hex | Usage |
|---|---|---|
| `--haeru-body-light` | `#d8f5ec` | Body fill top — pale mint |
| `--haeru-body-mid` | `#a8e6cf` | Body fill mid — soft emerald |
| `--haeru-body-shadow` | `#7ec8a4` | Body fill bottom shadow |
| `--haeru-belly` | `#f0fbf6` | Underbelly lighter stripe |
| `--haeru-eye-white` | `#ffffff` | Eye sclera |
| `--haeru-iris` | `#2d9e78` | Iris — Himalayan teal |
| `--haeru-pupil` | `#1a4a35` | Pupil dark centre |
| `--haeru-highlight` | `#ffffff` | Catchlight dot in eye |
| `--haeru-blush` | `#f4b976` | Cheek blush — warm amber |
| `--haeru-mouth` | `#2d9e78` | Smile arc |
| `--haeru-wing` | `#b8ead6` | Wing petal fill |
| `--haeru-wing-stroke` | `#7ec8a4` | Wing petal border |
| `--haeru-glow` | `#6ee7b7` | Radial ambient glow (light theme) |
| `--haeru-glow-dark` | `#34d399` | Glow in dark theme |
| `--haeru-outline` | `#3d7a60` | Optional thin body stroke |

**Dark theme adjustments** (apply when `data-theme="dark"` on `<html>`):
- Body gradient: desaturate 15%, lighten 10%
- Glow: increase `opacity` from `0.3` → `0.55`
- Eyes: iris stays `#2d9e78`, pupil shifts to `#0f2920`

---

### 1.3 Expression States (3 required)

| State | Name | Mouth path shape | Eyes | Wings | Body scale |
|---|---|---|---|---|---|
| 1 | `happy` | Wide open arc smile | Normal round | Slightly raised | `1.0` |
| 2 | `calm` | Tiny gentle curve | Slightly squinted (lower eyelid up 15%) | Resting, slightly lowered | `0.97` |
| 3 | `bringing` | Open O shape ("oooh!") | Wide open, enlarged 10% | Spread wide, elevated | `1.03` + pulse |

---

## 2. React Component Architecture

### 2.1 File Structure to Create

```
src/components/haeru/
├── HaeruCharacter.tsx      ← Main animated SVG character (all expressions)
├── HaeruAvatar.tsx         ← Circular cropped avatar (24px–96px sizes)
├── HaeruLogo.tsx           ← Haeru wordmark + small character (header logo)
├── HaeruPortalBadge.tsx    ← Per-persona portal badge variant
├── HaeruLanding.tsx        ← Full hero section for landing/login page
├── haeru.css               ← All Haeru-specific keyframe animations
└── index.ts                ← Barrel export
```

---

### 2.2 HaeruCharacter.tsx — Core Animated SVG

Build as a React component containing ONLY inline SVG (no <img> tag, no external file).

**Props:**
```tsx
interface HaeruCharacterProps {
  expression?: 'happy' | 'calm' | 'bringing'  // default: 'happy'
  size?: number                                 // SVG width/height in px, default: 200
  animate?: boolean                             // default: true
  className?: string
  label?: string                                // aria-label override
}
```

**SVG viewBox:** `"0 0 200 220"`

**Layer order inside SVG (bottom to top):**
1. `<defs>` block — all gradients and filters
2. Ambient glow circle (radial gradient, behind body)
3. Wing petals LEFT (2 petals, layered, behind body)
4. Wing petals RIGHT (2 petals, mirrored)
5. Body blob (gradient fill, soft drop shadow filter)
6. Belly lighter stripe (inner ellipse, radial gradient)
7. Left cheek blush (blurred amber ellipse)
8. Right cheek blush (blurred amber ellipse)
9. Left eye group (white ellipse + iris circle + pupil circle + catchlight dot)
10. Right eye group (same)
11. Mouth path (arc — changes shape per expression prop)
12. Left foot nub (small ellipse)
13. Right foot nub (small ellipse)
14. Sparkle dots — 3 tiny `<circle r="2.5">` floating upward at staggered positions

**`<defs>` must include:**

```xml
<!-- Body gradient: top mint → bottom shadow -->
<radialGradient id="haeru-body-grad" cx="50%" cy="35%" r="65%">
  <stop offset="0%" stopColor="#d8f5ec" />
  <stop offset="60%" stopColor="#a8e6cf" />
  <stop offset="100%" stopColor="#7ec8a4" />
</radialGradient>

<!-- Glow halo behind body -->
<radialGradient id="haeru-glow-grad" cx="50%" cy="50%" r="50%">
  <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.4" />
  <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0" />
</radialGradient>

<!-- Belly stripe gradient -->
<radialGradient id="haeru-belly-grad" cx="50%" cy="50%" r="50%">
  <stop offset="0%" stopColor="#f0fbf6" stopOpacity="0.9" />
  <stop offset="100%" stopColor="#f0fbf6" stopOpacity="0" />
</radialGradient>

<!-- Blush blur filter -->
<filter id="haeru-blush-blur">
  <feGaussianBlur stdDeviation="4" />
</filter>

<!-- Soft drop shadow on body -->
<filter id="haeru-body-shadow" x="-20%" y="-20%" width="140%" height="140%">
  <feDropShadow dx="0" dy="8" stdDeviation="12"
    floodColor="#3d7a60" floodOpacity="0.18" />
</filter>

<!-- Glow filter for 'bringing' state -->
<filter id="haeru-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
  <feGaussianBlur stdDeviation="6" result="blur" />
  <feMerge>
    <feMergeNode in="blur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
```

**Animation classes applied:**
- Body group: `haeru-float` + `haeru-breathe`
- Iris/pupil group in each eye: `haeru-blink`
- Wings left group: `haeru-wing-left`
- Wings right group: `haeru-wing-right`
- Glow circle: `haeru-glow`
- Sparkle dot 1: `haeru-sparkle-1`
- Sparkle dot 2: `haeru-sparkle-2`
- Sparkle dot 3: `haeru-sparkle-3`
- When `expression === 'bringing'`: add `haeru-bringing` to root `<g>` group

**Accessibility:** `role="img"`, `aria-label` from prop (default: `"Haeru, your school companion"`)

When `animate === false`: do NOT apply any animation class.

---

### 2.3 Animation Keyframes — haeru.css

All animations: smooth, gentle, child-friendly. No jarring speed or sharp snaps. Import this file in `HaeruCharacter.tsx` as `import './haeru.css'`.

```css
/* 1. Body idle float — slow bob up and down */
@keyframes haeru-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}

/* 2. Gentle breathing — body scale breathes */
@keyframes haeru-breathe {
  0%, 100% { transform: scaleY(1) scaleX(1); }
  50%       { transform: scaleY(1.025) scaleX(0.985); }
}

/* 3. Wing flutter — petals gently pulse up */
@keyframes haeru-wing-flutter {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  30%       { transform: rotate(-6deg) translateY(-4px); }
  70%       { transform: rotate(4deg) translateY(-2px); }
}

/* 4. Eye blink — close and reopen */
@keyframes haeru-blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95%            { transform: scaleY(0.08); }
}

/* 5. Ambient glow pulse — halo breathes */
@keyframes haeru-glow-pulse {
  0%, 100% { opacity: 0.28; transform: scale(1); }
  50%       { opacity: 0.42; transform: scale(1.08); }
}

/* 6. Sparkle twinkle — tiny dots float upward */
@keyframes haeru-sparkle {
  0%   { opacity: 0; transform: translateY(0px) scale(0.5); }
  30%  { opacity: 1; transform: translateY(-12px) scale(1); }
  100% { opacity: 0; transform: translateY(-28px) scale(0.3); }
}

/* 7. 'Bringing' entrance — excited soft bounce */
@keyframes haeru-bringing-bounce {
  0%   { transform: translateY(0px) scale(1); }
  25%  { transform: translateY(-14px) scale(1.05); }
  50%  { transform: translateY(0px) scale(0.97); }
  75%  { transform: translateY(-6px) scale(1.02); }
  100% { transform: translateY(0px) scale(1); }
}

/* 8. Landing page entrance */
@keyframes haeru-entrance {
  0%   { opacity: 0; transform: translateY(24px) scale(0.88); }
  60%  { opacity: 1; transform: translateY(-4px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0px) scale(1); }
}

/* 9. Avatar pulse ring for notifications */
@keyframes haeru-pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(110, 231, 183, 0.55); }
  70%  { box-shadow: 0 0 0 8px rgba(110, 231, 183, 0); }
  100% { box-shadow: 0 0 0 0 rgba(110, 231, 183, 0); }
}

/* Applied utility classes */
.haeru-float     { animation: haeru-float 4s ease-in-out infinite; }
.haeru-breathe   { animation: haeru-breathe 3.5s ease-in-out infinite; }
.haeru-blink     { animation: haeru-blink 5s ease-in-out infinite; }
.haeru-glow      { animation: haeru-glow-pulse 3s ease-in-out infinite; }
.haeru-entrance  { animation: haeru-entrance 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.haeru-bringing  { animation: haeru-bringing-bounce 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.haeru-pulse     { animation: haeru-pulse-ring 1.8s ease-out infinite; }

.haeru-wing-left  { animation: haeru-wing-flutter 3s ease-in-out infinite; transform-origin: center right; }
.haeru-wing-right { animation: haeru-wing-flutter 3s ease-in-out infinite reverse; transform-origin: center left; }

.haeru-sparkle-1 { animation: haeru-sparkle 2.4s ease-out infinite; animation-delay: 0s; }
.haeru-sparkle-2 { animation: haeru-sparkle 2.4s ease-out infinite; animation-delay: 0.8s; }
.haeru-sparkle-3 { animation: haeru-sparkle 2.4s ease-out infinite; animation-delay: 1.6s; }

/* Accessibility — disable all motion */
@media (prefers-reduced-motion: reduce) {
  .haeru-float, .haeru-breathe, .haeru-blink, .haeru-glow,
  .haeru-wing-left, .haeru-wing-right,
  .haeru-sparkle-1, .haeru-sparkle-2, .haeru-sparkle-3,
  .haeru-bringing, .haeru-pulse {
    animation: none;
  }
  .haeru-entrance {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

---

### 2.4 HaeruAvatar.tsx — Circular Avatar

Circular clip wrapper around `<HaeruCharacter>`.

```
Sizes: xs=24px | sm=32px | md=48px | lg=64px | xl=96px
Shape: rounded-full, overflow-hidden, transparent background
```

**Props:**
```tsx
interface HaeruAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  expression?: 'happy' | 'calm' | 'bringing'
  pulse?: boolean   // shows soft teal ring pulse — for new moment notifications
  className?: string
}
```

When `pulse={true}`: add `haeru-pulse` class to the outer wrapper div.

---

### 2.5 HaeruLogo.tsx — App Wordmark Lockup

Horizontal row: `[HaeruAvatar sm] [wordmark "haeru"] [optional tagline]`

- Avatar: `<HaeruAvatar size="sm" expression="happy" />`
- Wordmark: the text **"haeru"** in lowercase
  - Font: `font-display` (same display font used in app)
  - Weight: `font-bold`
  - Colour: `text-teal-700 dark:text-teal-300`
  - Letter spacing: `tracking-tight`
- Tagline (optional prop `showTagline`): `"watches over every day"` — `text-xs text-slate-500 dark:text-slate-400`

> DO NOT rename the school. Below the logo in the NavigationSidebar, keep the school name line as:
> `"Wangchuk's School of Heroes"` + `"Babesa, Thimphu"` in smaller muted text — exactly as before.

---

### 2.6 HaeruPortalBadge.tsx — Persona Badge Variants

Small `<HaeruCharacter size={64} />` with a CSS `filter` tint per persona.
**One SVG only — four filter variants, not four separate SVG files.**

| Persona | CSS Filter | Effect |
|---|---|---|
| `owner` | `hue-rotate(200deg) saturate(0.7)` | Slate-navy authority tone |
| `facilitator` | `none` | Default Himalayan teal (no change) |
| `parent` | `hue-rotate(20deg) saturate(0.85)` | Warm cream-amber family tone |
| `caregiver` | `hue-rotate(240deg) saturate(0.6)` | Soft lavender-slate tone |

**Props:** `persona: 'owner' | 'facilitator' | 'parent' | 'caregiver'`

---

### 2.7 HaeruLanding.tsx — Login / Landing Page Hero

Full-screen centred layout. This is the most prominent placement of Haeru.

```
┌─────────────────────────────────────────────────────────────────┐
│              [full-screen soft gradient background]             │
│                                                                 │
│           ✦        ✦        ✦   ← orbiting sparkle dots        │
│         ╭────────────────────╮                                  │
│         │     HAERU SVG      │  ← size={260}, haeru-entrance   │
│         │   float + breathe  │    then haeru-float loop        │
│         ╰────────────────────╯                                  │
│                                                                 │
│               haeru                                             │
│     Watches over every day at school.                           │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐                  │
│  │ Director │  │  Facilitator │  │  Family  │  ← persona tiles │
│  │  Portal  │  │     Hub      │  │  Portal  │                  │
│  └──────────┘  └──────────────┘  └──────────┘                  │
│                                                                 │
│      Wangchuk's School of Heroes · Babesa, Thimphu · Bhutan    │
└─────────────────────────────────────────────────────────────────┘
```

**Background gradient:**
- Light theme: `from-emerald-50 via-teal-50 to-amber-50`
- Dark theme: `from-slate-950 via-slate-900 to-teal-950`

**Character:** `<HaeruCharacter size={260} expression="happy" animate={true} />`
- On mount: play `haeru-entrance` once, then switch to `haeru-float` loop

**Orbiting sparkle dots:** 3 tiny `✦` SVG circles at different radii around the character, each with a different `animation-delay` so they feel natural and staggered. Use simple CSS `transform: rotate()` + `translateX()` for orbit.

**Wordmark:** `"haeru"` in large `font-display font-bold` below character — `text-slate-900 dark:text-white`

**Tagline:** `"Watches over every day at school."` — `text-lg text-slate-600 dark:text-slate-300`

**Persona selector tiles (3 glass cards side-by-side):**
- `<HaeruPortalBadge persona="owner" />` + label `"Director Portal"` + sub `"Owner · Director"`
- `<HaeruPortalBadge persona="facilitator" />` + label `"Facilitator Hub"` + sub `"Teachers & Carers"`
- `<HaeruPortalBadge persona="parent" />` + label `"Family Portal"` + sub `"Parents & Guardians"`
- Each tile: glass card with `hover:-translate-y-1 active:scale-[0.98]` — clicking sets persona in `appStore`

**Footer:** `"Wangchuk's School of Heroes · Babesa, Thimphu · Bhutan"` — `text-xs text-slate-400 dark:text-slate-500`

---

## 3. Placement Map — Where Haeru Appears

| Location | Component | Size | Expression | Animation |
|---|---|---|---|---|
| Landing / Login hero | `HaeruLanding.tsx` | 260px | `happy` | Entrance → Float loop |
| Navigation sidebar top logo | `HaeruLogo.tsx` | `sm` 32px | `happy` | Gentle bob |
| Quick Unlock PIN screen | `HaeruCharacter` | 120px | `calm` | Breathe only |
| Empty state — no moments | `HaeruCharacter` | 80px | `calm` | Float |
| New moment notification | `HaeruAvatar` + `pulse` | `md` 48px | `bringing` | Bounce + pulse ring |
| Parent daily reflection header | `HaeruAvatar` | `lg` 64px | `happy` | Float |
| Facilitator photo upload success | `HaeruCharacter` | 100px | `bringing` | Bringing bounce |
| Parent ELDS radar page | `HaeruAvatar` | `md` 48px | `calm` | Breathe |
| Error / not-found screen | `HaeruCharacter` | 120px | `calm` | Float only |
| Loading spinner overlay | `HaeruAvatar` | `sm` 32px | `happy` | Glow pulse |

---

## 4. Accessibility Rules

- Every `<HaeruCharacter>` and `<HaeruAvatar>` must have `role="img"` and `aria-label`
- Default: `aria-label="Haeru, your school companion"`
- In `bringing` context: `aria-label="Haeru bringing a new moment from school"`
- In loading context: `aria-label="Haeru loading…"`
- ALL animations must be disabled under `prefers-reduced-motion: reduce` (see haeru.css above)

---

## 5. Wire-Up Instructions (existing files to modify)

### 5a. NavigationSidebar.tsx
- Replace the "WSH · Kidu Care / Babesa, Thimphu" logo area at the top with `<HaeruLogo />`
- Keep school name directly below: `"Wangchuk's School of Heroes"` + `"Babesa, Thimphu"` in muted small text
- Remove ALL references to "Kidu Care" or "Kidu Care Pulse"

### 5b. QuickUnlock.tsx
- Add `<HaeruCharacter size={120} expression="calm" animate={true} />` centred above the PIN keypad
- It should breathe gently while the user types — calming presence

### 5c. AppShell.tsx (or App.tsx)
- If no persona is selected (fresh open / logged-out state): show `<HaeruLanding />` fullscreen
- Once persona is chosen from the landing tile: set persona in `appStore` and show the normal shell

### 5d. Global string cleanup
Run: `grep -r "Kidu" src/` and replace all occurrences of "Kidu Care" / "Kidu Care Pulse" → "Haeru" in UI-visible strings.

---

## 6. index.ts Barrel Export

```ts
export { default as HaeruCharacter } from './HaeruCharacter'
export { default as HaeruAvatar }    from './HaeruAvatar'
export { default as HaeruLogo }      from './HaeruLogo'
export { default as HaeruLanding }   from './HaeruLanding'
export { default as HaeruPortalBadge } from './HaeruPortalBadge'
```

---

## 7. Open Decisions

- [ ] Confirm Direction A (soft round guardian-friend) as final — or build Direction B (winged seed light-being) as alternate `HaeruWingedSeed.tsx`
- [ ] Whether Hariti virtue lore appears in an "About Haeru" screen (optional, NEVER in kid-facing UI)
- [ ] Confirm persona tiles: show Caregiver as a 4th tile on landing, or keep it hidden (accessed only via parent delegation)?

---

## Changelog
- 2026-11-02 — Initial build spec from HAERU_CHARACTER_BRIEF.md
