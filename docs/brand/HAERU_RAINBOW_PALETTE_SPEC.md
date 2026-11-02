# Haeru — Prismatic Himalayan Rainbow Palette & Iridescent Shimmer Specification
**Document:** `docs/brand/HAERU_RAINBOW_PALETTE_SPEC.md`  
**Target:** Cursor AI Composer  
**Location in Codebase:**
- SVG Definitions & Character: `src/components/haeru/HaeruCharacter.tsx`
- Shimmer Physics & Keyframes: `src/components/haeru/haeru.css`
- Interactive Character: `src/components/haeru/HaeruInteractive.tsx`
**Purpose:** Evolve Haeru from a single-tone green mascot into a magical, luminous, multi-colored **Prismatic Himalayan Rainbow Cloud** inspired by the 5 sacred Bhutanese colors (Lungta) and the 6 vibrant MoESD ELDS developmental domains.

---

## 1. Why a Rainbow Palette for Haeru?

1. **Early Childhood (ECCD) Joy**: Children ages 2–5 naturally gravitate toward bright, harmonious rainbow hues. A purely green mascot felt clinical or monochromatic; a soft pastel rainbow feels joyful, inviting, and magical.
2. **The 6 MoESD ELDS (2019) Developmental Domains**: In Bhutan's national early childhood framework, each developmental domain is coded with a vibrant color:
   - *Physical Development*: Coral Rose 🔴
   - *Social & Emotional*: Saffron Gold 🟡
   - *Language & Communication*: Himalayan Teal 🟢
   - *Approaches to Learning*: Lotus Violet 🟣
   - *Cognition & Knowledge*: Sky Azure 🔵
   - *Spiritual & Cultural*: Radiant Dawn Peach 🟠
3. **The 5 Sacred Bhutanese Colors (Lungta / Prayer Flags)**: Blue (Sky), White (Cloud), Red (Fire/Warmth), Green (Water/Life), Yellow (Earth).
4. **Soft Himalayan Prism Aesthetic**: Not harsh 90s neon or muddy primary blocks — but a **luminous, pearlescent, iridescent opal cloud** (like a dewy rainbow over the Thimphu mountains or a sunlit soap bubble).

---

## 2. The Multi-Color Prismatic Palette (Hex-Locked)

| Color Region | Token Name | Hex Code | Semantic Role |
|---|---|---|---|
| **Crown / Forehead** | `--haeru-rainbow-violet` | `#ddd6fe` → `#c4b5fd` | Soft lotus lavender crown |
| **Upper Face** | `--haeru-rainbow-rose` | `#fbcfe8` → `#fda4af` | Gentle dawn coral blush |
| **Heart / Mid-Body** | `--haeru-rainbow-gold` | `#fde68a` → `#fef08a` | Warm saffron golden center |
| **Belly / Core** | `--haeru-rainbow-teal` | `#a7f3d0` → `#6ee7b7` | Himalayan teal & mint life |
| **Base / Lower** | `--haeru-rainbow-azure` | `#bae6fd` → `#93c5fd` | Mountain sky azure base |
| **Underbelly Stripe**| `--haeru-rainbow-cream` | `#fffbeb` | Soft pearlescent milk highlight |
| **Left Wings** | `--haeru-wing-dawn` | `#fed7aa` & `#f472b6` | Warm dawn peach & coral petals |
| **Right Wings** | `--haeru-wing-sky` | `#a5f3fc` & `#c084fc` | Cyan azure & lotus violet petals |
| **Cheek Blush** | `--haeru-blush-rose` | `#fb7185` | Warm glowing rose-peach blush |
| **Irises** | `--haeru-iris-teal` | `#0d9488` | Deep vibrant Himalayan emerald teal |
| **Catchlight Dot** | `--haeru-eye-sparkle` | `#ffffff` | Pure white jewel sparkle |
| **Glow Aura** | `--haeru-rainbow-aura` | Multi-stop conic/radial | Iridescent prismatic rainbow halo |

---

## 3. SVG Gradients Specification (`HaeruCharacter.tsx`)

Replace the flat green SVG `<defs>` with these rich, multi-stop iridescent rainbow gradients:

### 1. The Pearlescent Body Gradient:
A multi-stop vertical/radial blend that washes through the rainbow spectrum:
```xml
<!-- Multi-Color Rainbow Body Gradient -->
<linearGradient id="haeru-body-rainbow" x1="20%" y1="0%" x2="80%" y2="100%">
  <!-- Crown: soft lavender -->
  <stop offset="0%" stop-color="#e9d5ff" />
  <!-- Upper: warm dawn peach -->
  <stop offset="25%" stop-color="#fbcfe8" />
  <!-- Center: sunny saffron glow -->
  <stop offset="50%" stop-color="#fef08a" />
  <!-- Mid-lower: Himalayan mint/teal -->
  <stop offset="75%" stop-color="#a7f3d0" />
  <!-- Base: mountain sky blue -->
  <stop offset="100%" stop-color="#bae6fd" />
</linearGradient>
```

### 2. Chromatic Rainbow Ambient Glow Halo:
Instead of a single-color green circle, the halo breathes in soft rainbow pastel stops:
```xml
<!-- Chromatic Rainbow Ambient Halo -->
<radialGradient id="haeru-glow-rainbow" cx="50%" cy="50%" r="50%">
  <stop offset="0%" stop-color="#fef08a" stop-opacity="0.5" />
  <stop offset="35%" stop-color="#f472b6" stop-opacity="0.35" />
  <stop offset="70%" stop-color="#6ee7b7" stop-opacity="0.3" />
  <stop offset="100%" stop-color="#818cf8" stop-opacity="0" />
</radialGradient>
```

### 3. Asymmetrical Rainbow Petal Wings:
Each side of Haeru features distinct harmonious rainbow colors:
- **Left Wing Pair (Dawn & Sun)**:
  - Top petal: `#fed7aa` (warm peach) with `#f97316` subtle stroke.
  - Bottom petal: `#fbcfe8` (soft coral rose) with `#ec4899` stroke.
- **Right Wing Pair (Sky & Spirit)**:
  - Top petal: `#a5f3fc` (cyan breeze) with `#06b6d4` stroke.
  - Bottom petal: `#ddd6fe` (lotus violet) with `#8b5cf6` stroke.

### 4. Cheeks: Rosy Sunset Glow:
Cheek blush upgraded from pale yellow-orange to a luminous coral-pink gradient:
```xml
<radialGradient id="haeru-blush-glow" cx="50%" cy="50%" r="50%">
  <stop offset="0%" stop-color="#fb7185" stop-opacity="0.65" />
  <stop offset="100%" stop-color="#f43f5e" stop-opacity="0" />
</radialGradient>
```

---

## 4. Iridescent Shimmer Animation (`haeru.css`)

To make the rainbow feel alive and magical without being garish, add an **iridescent slow-shimmer** animation:

```css
/* Iridescent Rainbow Shimmer Animation */
@keyframes haeru-rainbow-shift {
  0% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(25deg);
  }
  100% {
    filter: hue-rotate(0deg);
  }
}

.haeru-rainbow-body {
  animation: haeru-rainbow-shift 12s ease-in-out infinite;
}

/* Floating Rainbow Sparkle Dots (Staggered Rainbow Colors) */
.haeru-sparkle-pink   { fill: #f472b6; animation: haeru-sparkle 2.2s ease-out infinite; }
.haeru-sparkle-gold   { fill: #fbbf24; animation: haeru-sparkle 2.5s ease-out infinite; animation-delay: 0.7s; }
.haeru-sparkle-azure  { fill: #38bdf8; animation: haeru-sparkle 2.8s ease-out infinite; animation-delay: 1.4s; }
.haeru-sparkle-violet { fill: #a855f7; animation: haeru-sparkle 2.4s ease-out infinite; animation-delay: 1.9s; }
```

---

## 5. Dual-Theme Adaptations

### Light Mode ("Sunrise Himalayan Frosted Pearl"):
- The rainbow body glows with creamy, dewy, iridescent pastel luminescence.
- Pearlescent specular rim: subtle `stroke="rgba(255, 255, 255, 0.7)" stroke-width="1.5"`.
- The rainbow halo adds warmth against the frosted milk glass.

### Dark Mode ("Midnight Himalayan Glass"):
- Against the deep obsidian canvas (`#090d16`), the rainbow colors become **luminous jewel-tones** (gently glowing opal).
- Increase halo opacity from `0.4` → `0.65` so the rainbow aura radiates beautifully in the dark.
- Eyes remain deep emerald teal (`#0d9488`) with pure white catchlight dots for maximum contrast and cuteness.

---

## 6. Where the Rainbow Shimmers Across the App

1. **Landing Page Hero (`HaeruStoryHero.tsx`)**:
   - Haeru is a magnificent iridescent rainbow cloud greeting families.
   - Orbiting sparkle dots are colored pink, gold, cyan, and violet.
2. **Interactive Squish & Petting (`HaeruInteractive.tsx`)**:
   - When petted, Haeru bursts into a mini rainbow celebration (`💖 ✦ 🌸 ✦ 🌈`).
3. **Sign-In Stage (`RoleLogin.tsx`)**:
   - Haeru's multi-colored presence brings warmth and joy to the split login screen.
4. **Child Moments Feed (`ChildMomentsFeed.tsx`)**:
   - Small rainbow avatar badges indicating MoESD 6-domain progress.

---

## 7. Cursor Composer Prompt

Copy-paste this prompt into Cursor Composer (`Ctrl + I`, Agent mode):

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
