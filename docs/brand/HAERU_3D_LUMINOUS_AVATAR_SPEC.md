# Haeru — 3D Luminous Chromatic Avatar Specification
### Ultra-Cute, Surreal, Iridescent Guardian Companion
**Reference**: GitHub Copilot / Octocat 3D Iridescent Mascot  
**File Target**: `src/components/haeru/HaeruCharacter.tsx` & `src/components/haeru/haeru.css`  
**Status**: Master Design Document

---

## 1. Why the Old Avatar Looked "Weird" vs. Why This Reference Looks "So Cute & Surreal"

| Element | Old Haeru (What felt weird) | Reference (GitHub Mascot Cute Standard) |
|---|---|---|
| **Shape** | Flat egg/cloud pear shape with disconnected wing blobs | **Chubby hooded kitten silhouette** with soft rounded ears and pinchable baby proportions |
| **Color** | Static horizontal rainbow stripe stops (looked like flat 90s clip art) | **Volumetric Chromatic Bioluminescence**: smooth, radiant silk gradient flowing through the face from sunset coral to bubblegum pink |
| **Eyes** | Small flat teal circles on white ovals | **Deep liquid cosmic eyes**: huge rounded midnight-violet pupils with double jewel-shine specular highlights |
| **Expression** | Wide flat wire stroke mouth | **Tiny button truffle nose** + sweet micro-smile (`ω` kitten curve) |
| **Lighting** | Flat 2D vector fill | **3D frosted squishy vinyl / subsurface scattering effect** — looks touchable, edible, luminous |
| **Rainbow Motion** | Simple `hue-rotate` on the whole SVG | **Continuous chromatic wave traveling diagonally through the face/body** like flowing aurora borealis |

---

## 2. Detailed Anatomical Breakdown of Every Part

### A. The Outer Hood & Ears (The Obsidian Silhouette)
- **Shape**: A smooth, soft-cornered squircle head with two rounded kitten/bear ears pointing upright at 10 o'clock and 2 o'clock.
- **Color & Texture**: Deep velvety midnight obsidian-plum (`#161324` blending to `#201a35`).
- **Inner Ear Recesses**: Soft dark indentations (`#100d1c`) with a gentle warm ambient glow caught from the glowing face inside.
- **Outer Rim Highlight**: A delicate 1px specular top rim (`rgba(255, 255, 255, 0.15)`) giving it a premium 3D vinyl toy finish.
- **Proportions**: Head is wide and chubby (1:0.88 aspect ratio), evoking baby animal schema (Kindchenschema) that instantly triggers cuteness.

### B. The Luminous Chromatic Face Platter (The Rainbow Engine)
- **Shape**: A heart-shaped / peach-shaped chubby face cutout nestled inside the hood, featuring ultra-fat, pinchable baby cheeks.
- **Lighting Model**: Subsurface scattering (bioluminescence). It looks like a soft, warm light bulb inside frosted peach mochi.
- **The Flowing Rainbow Wave**:
  - The colors are **not static**. A continuous chromatic wave travels smoothly through the face:
    - *Zone 1 (Forehead & Brow)*: Soft luminous marshmallow pink (`#ffb3d1`) shifting into lavender quartz (`#d8b4fe`).
    - *Zone 2 (Mid-Face & Nose Bridge)*: Radiant peach nectar (`#fecdd3`) blending into warm apricot (`#fed7aa`).
    - *Zone 3 (Chubby Lower Cheeks)*: Intense sunset tangerine coral (`#ff7051` to `#ff5341`) providing rich, warm internal glow.
  - The gradient moves continuously via animated SVG stop coordinates and shifting color matrices, creating a living, breathing aurora effect.

### C. The Liquid Cosmic Eyes
- **Size**: Extra large, occupying nearly 35% of the vertical face height.
- **Shape**: Smooth vertical oval capsules tilted inward by 2 degrees (kawaii gaze).
- **Iris / Pupil**:
  - Gradient from deep cosmic royal violet (`#1e1445` at the top) down to soft luminous grape amethyst (`#432882` at the bottom).
  - Subtle inner iris rim glow catching the face's warm peach light.
- **Specular Highlights (The Life of the Eyes)**:
  - *Primary Highlight*: Crisp, pure white tilted oval in the top-right corner of each pupil (`#ffffff`, opacity 0.95).
  - *Secondary Highlight*: Delicate micro-crescent or jewel dot in the bottom-left corner (`#ffffff`, opacity 0.70).
  - *Glaze Sheen*: Extremely subtle soft reflection across the top of the eye.
- **Gaze Tracking**: Pupils smoothly shift by `eyeOffset.x` and `eyeOffset.y` when following the cursor, making Haeru feel truly alive.

### D. The Button Nose & Sweet Kitten Smile
- **Truffle Nose**:
  - Placed low on the face, exactly level with the lower third of the eyes.
  - Tiny rounded dark espresso bean (`#1f1638`), softly blurred at edges (not a harsh sticker).
  - Has a microscopic highlight dot on top for 3D dimensionality.
- **Mouth**:
  - Nestled directly 4px below the nose.
  - Subtle, adorable kitten smile (`M 94 134 Q 100 138 106 134`).
  - Warm espresso line with rounded caps (`stroke="#261b42" strokeWidth="2.5"`).

### E. Chubby Radiant Cheeks (Blush Bloom)
- **Placement**: Directly under the outer bottom rim of each eye.
- **Lighting**: Radial bloom with deep blur (`feGaussianBlur stdDeviation="6"`).
- **Color**: Vibrant glowing coral-rose (`#ff4d6d`), pulsing gently with Haeru's heartbeat breathing cycle.

### F. The Peeking Paws (Resting on the Bar)
- Two cute, chubby marshmallow paws peeking over the horizontal edge.
- Shaped like little rounded buns with tiny finger crease shadows.
- Soft obsidian color matching the hood, with glowing peach rim light catching the bottom edge.

---

## 3. Dynamic Rainbow Wave Mechanics (How the color moves)

Instead of a flat `hue-rotate` (which makes colors look dull or murky), Haeru uses an **animated multi-stop gradient with moving control coordinates**:

```css
@keyframes haeru-chromatic-drift {
  0% {
    --stop-1: #ffb0cb; /* soft rose */
    --stop-2: #fed7aa; /* warm peach */
    --stop-3: #ff6e52; /* glowing coral */
    --stop-4: #c084fc; /* soft violet */
  }
  25% {
    --stop-1: #fed7aa; /* warm peach */
    --stop-2: #fef08a; /* soft gold */
    --stop-3: #ff8566; /* tangerine */
    --stop-4: #f472b6; /* rose quartz */
  }
  50% {
    --stop-1: #fef08a; /* morning sun */
    --stop-2: #86efac; /* jade mint */
    --stop-3: #38bdf8; /* sky azure */
    --stop-4: #c084fc; /* lotus violet */
  }
  75% {
    --stop-1: #a5f3fc; /* glacier cyan */
    --stop-2: #c084fc; /* lotus purple */
    --stop-3: #f472b6; /* electric rose */
    --stop-4: #fed7aa; /* peach nectar */
  }
  100% {
    --stop-1: #ffb0cb;
    --stop-2: #fed7aa;
    --stop-3: #ff6e52;
    --stop-4: #c084fc;
  }
}
```

In SVG, this is implemented cleanly through:
1. An animated `<linearGradient>` with moving vector angle (`x1, y1` to `x2, y2`) moving diagonally.
2. A secondary radial glow platter providing the intense warm coral flush at the cheeks.

---

## 4. The Master SVG Code Structure (Drop-In Replacement for `HaeruCharacter.tsx`)

Here is the exact geometric coordinate map for `viewBox="0 0 200 200"`:

```tsx
<svg viewBox="0 0 200 200" width={size} height={size} className={className}>
  <defs>
    {/* Dynamic 3-Stop Chromatic Flow Gradient */}
    <linearGradient id="haeru-face-chroma" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ffb3d1" className="haeru-stop-1" />
      <stop offset="45%" stopColor="#fed7aa" className="haeru-stop-2" />
      <stop offset="100%" stopColor="#ff6548" className="haeru-stop-3" />
    </linearGradient>

    {/* Ambient Subsurface Glow */}
    <radialGradient id="haeru-cheek-bloom" cx="50%" cy="80%" r="60%">
      <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.8" />
      <stop offset="60%" stopColor="#ff7a59" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#ff9980" stopOpacity="0" />
    </radialGradient>

    {/* Deep Cosmic Eye Gradient */}
    <linearGradient id="haeru-eye-depth" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#191038" />
      <stop offset="60%" stopColor="#2e1b5c" />
      <stop offset="100%" stopColor="#4a2e85" />
    </linearGradient>

    {/* Soft 3D Hood Shadow */}
    <filter id="haeru-hood-depth" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#090514" floodOpacity="0.5" />
    </filter>
  </defs>

  {/* ── 1. OUTER HOOD & EARS (Velvet Obsidian) ── */}
  <path
    d="M 46 75
       C 40 45, 48 30, 62 34
       C 75 38, 86 52, 100 52
       C 114 52, 125 38, 138 34
       C 152 30, 160 45, 154 75
       C 166 100, 164 140, 150 168
       C 138 185, 118 190, 100 190
       C 82 190, 62 185, 50 168
       C 36 140, 34 100, 46 75 Z"
    fill="#181326"
    filter="url(#haeru-hood-depth)"
  />

  {/* Ear inner recesses with ambient warm bounce light */}
  <path d="M 54 44 C 50 38, 56 36, 62 42 C 66 46, 68 55, 66 60 Z" fill="#241a38" />
  <path d="M 146 44 C 150 38, 144 36, 138 42 C 134 46, 132 55, 134 60 Z" fill="#241a38" />

  {/* ── 2. LUMINOUS CHROMATIC FACE PLATTER ── */}
  {/* The chubby heart-shaped luminous face */}
  <path
    d="M 64 88
       C 64 68, 80 58, 100 58
       C 120 58, 136 68, 136 88
       C 136 102, 146 114, 144 135
       C 142 155, 124 168, 100 168
       C 76 168, 58 155, 56 135
       C 54 114, 64 102, 64 88 Z"
    fill="url(#haeru-face-chroma)"
    className="haeru-chroma-face"
  />

  {/* Subsurface Cheek & Chin Warm Glow */}
  <path
    d="M 56 135 C 58 155, 76 168, 100 168 C 124 168, 142 155, 144 135 C 136 130, 64 130, 56 135 Z"
    fill="url(#haeru-cheek-bloom)"
    className="haeru-cheek-glow"
  />

  {/* ── 3. LIQUID COSMIC EYES ── */}
  {/* Left Eye */}
  <g className="haeru-eye-left">
    <ellipse cx="80" cy="115" rx="13" ry="18" fill="url(#haeru-eye-depth)" />
    {/* Primary Specular Jewel Shine (Top-Right) */}
    <ellipse cx="84" cy="108" rx="4.5" ry="6.5" fill="#ffffff" opacity="0.95" />
    {/* Secondary Catchlight (Bottom-Left) */}
    <circle cx="75" cy="122" r="2.2" fill="#ffffff" opacity="0.65" />
  </g>

  {/* Right Eye */}
  <g className="haeru-eye-right">
    <ellipse cx="120" cy="115" rx="13" ry="18" fill="url(#haeru-eye-depth)" />
    {/* Primary Specular Jewel Shine (Top-Right) */}
    <ellipse cx="124" cy="108" rx="4.5" ry="6.5" fill="#ffffff" opacity="0.95" />
    {/* Secondary Catchlight (Bottom-Left) */}
    <circle cx="115" cy="122" r="2.2" fill="#ffffff" opacity="0.65" />
  </g>

  {/* ── 4. TRUFFLE NOSE & KITTEN MOUTH ── */}
  {/* Tiny Espresso Bean Nose */}
  <ellipse cx="100" cy="128" rx="3.2" ry="2.4" fill="#201535" />
  <circle cx="100.8" cy="127.3" r="0.8" fill="#ffffff" opacity="0.5" />

  {/* Sweet Kitten Micro-Smile */}
  <path
    d="M 94 135 Q 97 138 100 136 Q 103 138 106 135"
    fill="none"
    stroke="#221738"
    strokeWidth="2.2"
    strokeLinecap="round"
  />

  {/* ── 5. CUTE PEEKING PAWS (Optional Ledge Mode) ── */}
  <g className="haeru-paws">
    <ellipse cx="68" cy="180" rx="10" ry="7" fill="#181326" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    <ellipse cx="132" cy="180" rx="10" ry="7" fill="#181326" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
  </g>
</svg>
```

---

## 5. CSS Animations for Dynamic Fluid Rainbow Wave

Add to `src/components/haeru/haeru.css`:

```css
/* Dynamic chromatic flow through Haeru's luminous face */
@keyframes haeru-chroma-wave {
  0% {
    filter: hue-rotate(0deg) saturate(1.1);
    transform: scale(1);
  }
  25% {
    filter: hue-rotate(30deg) saturate(1.2);
    transform: scale(1.015);
  }
  50% {
    filter: hue-rotate(60deg) saturate(1.05);
    transform: scale(1);
  }
  75% {
    filter: hue-rotate(30deg) saturate(1.2);
    transform: scale(1.015);
  }
  100% {
    filter: hue-rotate(0deg) saturate(1.1);
    transform: scale(1);
  }
}

.haeru-chroma-face {
  animation: haeru-chroma-wave 8s ease-in-out infinite;
  transform-origin: 100px 115px;
}

/* Heartbeat breathing pulse for cheeks */
@keyframes haeru-cheek-pulse {
  0%, 100% {
    opacity: 0.75;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.04);
  }
}

.haeru-cheek-glow {
  animation: haeru-cheek-pulse 3.5s ease-in-out infinite;
  transform-origin: 100px 145px;
}

/* Subtle, expressive blinking */
@keyframes haeru-kawaii-blink {
  0%, 92%, 100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.08);
  }
}

.haeru-eye-left,
.haeru-eye-right {
  animation: haeru-kawaii-blink 5.5s ease-in-out infinite;
  transform-origin: 100px 115px;
}

.haeru-eye-right {
  animation-delay: 0.08s;
}

/* Soft floating idle motion */
@keyframes haeru-hover-float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(1deg);
  }
}

.haeru-luminous-root {
  animation: haeru-hover-float 4s ease-in-out infinite;
}
```

---

## 6. Cursor Implementation Prompt

Copy and paste this into Cursor Composer:

```text
@docs/brand/HAERU_3D_LUMINOUS_AVATAR_SPEC.md
@src/components/haeru/HaeruCharacter.tsx
@src/components/haeru/haeru.css
@src/components/haeru/HaeruInteractive.tsx
@.cursorrules

Read HAERU_3D_LUMINOUS_AVATAR_SPEC.md in full before editing.

Task: Replace the old flat/weird Haeru avatar with the ultra-cute, 3D luminous chromatic avatar inspired by GitHub's Octocat mascot (as detailed in the specification).

Key Design Requirements:
1. Outer Hood & Silhouette:
   - Soft rounded squircle with chubby kitten ears in deep midnight obsidian-plum (#181326).
   - Inner ear recesses with soft bounce light.

2. Luminous Chromatic Face:
   - Chubby peach-shaped face with dynamic multi-stop gradient flowing from marshmallow rose (#ffb3d1) down to sunset coral/apricot (#ff6548).
   - Subsurface cheek glow layer (#ff4d4d) with feGaussianBlur.
   - Animated via `haeru-chroma-wave` in CSS so the rainbow smoothly travels and pulses through the face continuously.

3. Liquid Cosmic Eyes:
   - Extra large, rounded vertical capsule eyes with deep royal violet/indigo gradient (#191038 to #4a2e85).
   - Crisp white primary specular pill highlight (top-right) + secondary catchlight dot (bottom-left).
   - Preserve interactive eye tracking via `eyeOffset.x` and `eyeOffset.y`.
   - Expressive kawaii blinking animation.

4. Cute Features:
   - Tiny espresso truffle nose (#201535) with micro-highlight dot.
   - Sweet kitten micro-smile (`M 94 135 Q 97 138 100 136 Q 103 138 106 135`).
   - Cute peeking paws at the bottom edge.

5. Preserve interactive capabilities:
   - Expressions ('happy', 'calm', 'bringing')
   - Crescent eyes (^ ^) mode for sleepy / happy state
   - Squish physics on click
   - Zero 3D tilt skewing; clean SVG geometry.

Run `npm run build` after editing to ensure 0 TypeScript errors.
```
