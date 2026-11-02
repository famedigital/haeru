# Haeru — Interactive Character & Native Audio Engine Specification
**Document:** `docs/brand/HAERU_INTERACTIVE_SOUND_SPEC.md`  
**Target:** Cursor AI Composer  
**Location in Codebase:**
- Audio Engine: `src/lib/audio/haeruSounds.ts`
- Interactive Character: `src/components/haeru/HaeruInteractive.tsx`
- Animation & Physics: `src/components/haeru/haeru.css`
**Purpose:** Transform Haeru from a static floating SVG into a living, responsive, irresistibly cute companion with cursor eye-tracking, squishy jelly physics, petting reactions, floating emotion particles, and a zero-dependency Web Audio API sound synthesizer.

---

## 1. Real-World Web Inspiration & Industry Precedents

Interactive web characters are among the most memorable digital touchpoints on the modern web:
- **Duolingo's Duo**: Eyes track the student's cursor across the screen; body squishes on click; celebrates with bright chimes on completed questions.
- **Stripe & Github Monalisa**: Interactive micro-reactions on hover with spring-damping physics.
- **Tamagotchi & Animal Crossing**: Warm, gentle audio chirps synthesized in real-time, giving a digital companion genuine personality without annoying loud loops.

Haeru adopts these exact principles, tuned specifically to the **gentle, peaceful Himalayan ethos** of Bhutanese ECCD: warm, soft, calming, and toddler-safe.

---

## 2. Interactive Features Overview

```
                      ╭──────────────────────╮
                      │   💖  ✦   ✦          │  ← Floating heart & sparkle particles
                      │                      │    burst out on click / pet
        Eyes track ──→│      ( ◕   ◕ )       │  ← Pupils smoothly follow visitor cursor
        cursor        │       ·     ·        │  ← Cheeks blush deeper amber on hover
                      │        ╰───╯         │  ← Happy mouth / smile
                      ╰──────────────────────╯
                       ╱╲                  ╱╲   ← Petal wings flutter when petted
                      ╭──────────────────────╮
                      │  [ Squish Physics ]  │  ← Jelly bounce on click: scale(1.15, 0.85)
                      ╰──────────────────────╯
                                ♫
                     [ Web Audio Synthesizer ]  ← Himalayan singing bowl chime,
                       Zero MP3 dependencies      gentle pop, cute two-tone chirp
```

### Feature 1: Cursor Eye Tracking (Look-At Mouse)
- Haeru's pupils subtly follow the visitor's cursor across the screen!
- Mathematical bounding: Pupils are clamped to an oval radius of `±4px` horizontally and `±3.5px` vertically so the eyes never look unnatural or distorted.
- When the mouse leaves the browser window or remains motionless for 3 seconds, pupils smoothly glide back to the center with a natural blink.

### Feature 2: Squishy Jelly Physics (Tactile Feedback)
- **On Hover (`hover`)**:
  - Haeru perks up `translateY(-4px)` with soft elevation.
  - Petal wings lift slightly (`rotate(-8deg)` left, `rotate(8deg)` right).
  - Cheek blush opacity deepens from `0.45` to `0.80`.
  - A gentle, soothing high-frequency crystal chime plays (`playChirp`).
- **On Click / Tap (`active`)**:
  - Squish down: `transform: scale(1.14, 0.86)` (like pressing a soft mochi/jelly cushion).
  - On mouse release: Springs up with an elastic overshoot: `scale(0.94, 1.08)` → settles back to `scale(1, 1)` using `cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - A soft bubble pop sound plays (`playPop`).

### Feature 3: Petting & Multi-Click Delights (Streak Reactions)
Clicking or petting Haeru repeatedly triggers escalating delightful animations:
- **Click 1**: Soft bubble pop + cheek blush pulse + 1 floating heart particle (`💖`).
- **Click 2**: Cheerful two-tone chirp + wings flutter + 3 sparkle stars (`✦ ✦ ✦`).
- **Click 3 (Happy Pet Mode)**: Eyes turn into adorable **happy crescent curves** (`^ ^`), Haeru wiggles side to side with joy, and plays a warm Himalayan singing bowl chime (`playPurr`).

### Feature 4: Idle Sleepy Mode (12-Second Inactivity)
- If the visitor leaves their mouse still for > 12 seconds:
  - Haeru's eyes droop into peaceful resting crescents.
  - Breathing slows down to a gentle 6-second wave.
  - Three tiny floating `z z z` bubbles float upward from Haeru's head.
  - As soon as the mouse moves: Haeru wakes up with a cheerful perk and opens his big kind eyes!

---

## 3. Zero-Dependency Native Audio Engine (`src/lib/audio/haeruSounds.ts`)

Instead of downloading large, brittle MP3 files that fail to load or get blocked by ad-blockers, Haeru features a **built-in sound synthesizer** using the standard browser `window.AudioContext`.

### Why Native Web Audio API?
1. **Zero External Files**: 100% generated in real-time in pure JavaScript. Zero bandwidth, zero CDN latency.
2. **Toddler & Classroom Safe**: Every sound is tuned with a lowpass filter so it is warm, round, and gentle — never sharp, piercing, or loud.
3. **Instant Responsive**: 0ms latency on hover and click.
4. **Mute Control**: Clean global toggle state stored in `localStorage` with a discreet speaker icon button.

### Sound Library Specifications:

| Sound Name | Method | Acoustic Formula | Emotion / Usage |
|---|---|---|---|
| **Bubble Pop** | `playPop()` | Sine oscillator dropping rapidly from `420Hz → 160Hz` over 70ms with gentle gain envelope. | On click, button press, squish. |
| **Himalayan Chirp** | `playChirp()` | Two-tone rising harmonic (F#5 `740Hz` → A#5 `932Hz`) with soft crystal decay over 180ms. | On hover, chapter transition, greeting. |
| **Singing Bowl Hum** | `playPurr()` | Dual-frequency warm resonance (`432Hz` fundamental + `864Hz` overtone) with slow 600ms exponential decay. | When petted (3rd click), peaceful rest chapter. |
| **Celebration Sparkle**| `playJoy()` | 3-note ascending pentatonic arpeggio (C5 `523Hz` → E5 `659Hz` → G5 `784Hz`) with shimmer. | On moment delivery, Easter egg trigger. |

```typescript
// Complete implementation template for src/lib/audio/haeruSounds.ts
class HaeruSoundEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('haeru_sound_enabled')
      this.enabled = saved !== 'false'
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public isMuted(): boolean {
    return !this.enabled
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('haeru_sound_enabled', String(this.enabled))
    }
    if (this.enabled) this.playPop()
    return this.enabled
  }

  // 1. Soft bubble pop
  public playPop() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    osc.type = 'sine'
    osc.frequency.setValueAtTime(420, now)
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.07)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.08)
  }

  // 2. Himalayan gentle chirp
  public playChirp() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [740, 932]

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.06

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.18, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.18)
    })
  }

  // 3. Singing bowl harmonic purr
  public playPurr() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const freqs = [432, 864]

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      const vol = idx === 0 ? 0.22 : 0.08
      gain.gain.setValueAtTime(vol, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.6)
    })
  }

  // 4. Joy arpeggio
  public playJoy() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const arpeggio = [523.25, 659.25, 783.99] // C5, E5, G5

    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.08

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.2, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.25)
    })
  }
}

export const haeruSounds = new HaeruSoundEngine()
```

---

## 4. Interactive Eye-Tracking Mathematics

In `HaeruInteractive.tsx`, calculate the mouse vector relative to the center of Haeru's SVG:

```typescript
// Mouse movement listener
const handleMouseMove = (e: MouseEvent) => {
  if (!characterRef.current) return
  const rect = characterRef.current.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const deltaX = e.clientX - centerX
  const deltaY = e.clientY - centerY
  const distance = Math.hypot(deltaX, deltaY)

  // Clamp pupil displacement: max 4.5px horizontally, 3.5px vertically
  const maxDistance = 4.5
  const angle = Math.atan2(deltaY, deltaX)
  const clampedDistance = Math.min(distance / 45, maxDistance)

  const pupilX = Math.cos(angle) * clampedDistance
  const pupilY = Math.sin(angle) * (clampedDistance * 0.8)

  setEyeOffset({ x: pupilX, y: pupilY })
  setIsIdle(false)
}
```

The `eyeOffset` values are passed directly into the SVG pupil elements:
```tsx
<g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`, transition: 'transform 0.06s ease-out' }}>
  <circle cx="80" cy="100" r="4.2" fill="#1a4a35" />
  <circle cx="83" cy="96" r="2.2" fill="#ffffff" />
</g>
```

---

## 5. CSS Physics & Spring Keyframes (`haeru.css`)

Add these tactile physics classes to `src/components/haeru/haeru.css`:

```css
/* Tactile Squish on Click / Active */
.haeru-squish {
  animation: haeru-jelly-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes haeru-jelly-pop {
  0%   { transform: scale(1, 1); }
  25%  { transform: scale(1.15, 0.85); }
  50%  { transform: scale(0.92, 1.10); }
  75%  { transform: scale(1.05, 0.96); }
  100% { transform: scale(1, 1); }
}

/* Happy Wiggle Dance (Petting Mode) */
.haeru-wiggle {
  animation: haeru-wiggle-dance 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes haeru-wiggle-dance {
  0%, 100% { transform: rotate(0deg) scale(1); }
  20%      { transform: rotate(-8deg) scale(1.05); }
  40%      { transform: rotate(8deg) scale(1.05); }
  60%      { transform: rotate(-5deg) scale(1.02); }
  80%      { transform: rotate(5deg) scale(1.02); }
}

/* Floating Hearts / Stars Emitter */
@keyframes haeru-float-particle {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(0.6);
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx, 20px), -60px) scale(1.2);
  }
}

.haeru-particle {
  animation: haeru-float-particle 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* Sleepy 'zzz' Bubbles */
@keyframes haeru-zzz {
  0%   { opacity: 0; transform: translate(0, 0) scale(0.5); }
  40%  { opacity: 0.9; }
  100% { opacity: 0; transform: translate(16px, -45px) scale(1.1); }
}

.haeru-zzz-1 { animation: haeru-zzz 2.5s ease-out infinite; animation-delay: 0s; }
.haeru-zzz-2 { animation: haeru-zzz 2.5s ease-out infinite; animation-delay: 0.8s; }
.haeru-zzz-3 { animation: haeru-zzz 2.5s ease-out infinite; animation-delay: 1.6s; }
```

---

## 6. Integration Architecture

- **`HaeruInteractive.tsx`**: Wraps the SVG character with mouse tracking, squish state, sound hooks, and particle bursts.
- **Embedded in Hero Story (`HaeruStoryHero.tsx`)**: Replace the static character with `<HaeruInteractive size={220} expression={currentChapter.expression} />`.
- **Sound Toggle Button**: A subtle pill button in the hero section:
  ```tsx
  <button
    onClick={() => setSoundMuted(haeruSounds.toggleSound())}
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors shadow-sm"
  >
    {soundMuted ? '🔇 Sound Off' : '🔊 Sound On'}
  </button>
  ```

---

## 7. Cursor Composer Prompt

Copy-paste this prompt into Cursor Composer (`Ctrl + I`, Agent mode):

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
