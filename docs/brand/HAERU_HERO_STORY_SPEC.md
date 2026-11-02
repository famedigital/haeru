# Haeru — Hero Storytelling Specification ("A Day with Haeru")
**Document:** `docs/brand/HAERU_HERO_STORY_SPEC.md`  
**Target:** Cursor AI Composer  
**Component Location:** `src/components/marketing/HaeruStoryHero.tsx`  
**Purpose:** Replace a static, staring mascot in the Landing Page Hero with an interactive, living story where Haeru narrates a real child's day at school through an automated, interactive 4-chapter timeline.

---

## 1. Narrative Concept: "A Day in the Life with Haeru"

Instead of staring blankly at visitors, Haeru is an active, talking guardian companion. Visitors watch Haeru follow **Tashi** (a 4-year-old in Kindergarten at Wangchuk's School of Heroes in Babesa, Thimphu) through four chronological moments of a school day in Bhutan.

Visitors instantly understand **why Haeru exists**:
1. It logs daily care without stress (Arrival & Meals).
2. It captures genuine learning milestones via Voice AI (The Moment of Wonder).
3. It respects peace and rest (Nap & Wellbeing).
4. It delivers private memories to parents with zero peer data leaks (Safe Delivery).

---

## 2. The 4 Story Chapters

| Chapter | Time & Name | Haeru Expression | Speech Bubble Quote | Floating Live Moment Card |
|---|---|---|---|---|
| **1** | **8:30 AM**<br>Arrival & Care | `happy`<br>(Warm wide smile) | *"Kuzu Zangpo La! Tashi arrived at 8:32 AM. Shoes in cubby, warm suja & porridge eaten. Ready for a bright day!"* | **Card 1: Morning Check-in**<br>• Arrival: 8:32 AM<br>• Breakfast: Porridge 🥣<br>• Mood: Radiant 😊 |
| **2** | **11:00 AM**<br>Moment of Wonder | `bringing`<br>(Excited "oooh!" mouth, glowing wings) | *"Look what Tashi built! A 6-block wooden bridge. Tr. Sonam recorded a 10s voice note — Hermes mapped it to ELDS Milestone 4.2!"* | **Card 2: ELDS Observation**<br>• Domain: Approaches to Learning<br>• Rating: Achieved (`ap`) 🌿<br>• Voice note parsed by Hermes AI |
| **3** | **1:15 PM**<br>Peaceful Rest | `calm`<br>(Gently squinted eyes, slow breathing) | *"Shhh… quiet time in the Kindergarten room. 45-minute cozy nap after lunch. Recharging little heroes."* | **Card 3: Rest & Wellbeing**<br>• Lunch: Rice & Ema Datshi 🍚<br>• Nap: 45 min restful 😴<br>• Toileting: Independent 🚽 |
| **4** | **3:30 PM**<br>Safe Family Delivery | `bringing`<br>(Radiant glow, sealed envelope icon) | *"Director Choki verified today's notes! Delivering Tashi's private reflection directly to Mummy Deki. Zero other eyes see this."* | **Card 4: Private Delivery**<br>• Delivered to: Deki Choden 📱<br>• Privacy: Child-Scoped 🔒<br>• Status: Confirmed by Director ✅ |

---

## 3. Interactive UI Architecture (`HaeruStoryHero.tsx`)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                    ╭────────────────────────────────────────╮                   │
│                    │ 💬 "Look what Tashi built! A 6-block   │                   │
│                    │    bridge. Tr. Sonam recorded a voice  │                   │
│                    │    note — Hermes mapped it to ELDS!"   │                   │
│                    ╰───────────────────╮  ──────────────────╯                   │
│                                        │                                        │
│          ╭───────────────────╮        ▼                                         │
│          │   🌿 HAERU        │    ╭─────────────────────────────────────╮       │
│          │   ANIMATED        │    │ ✦ LIVE MOMENT CARD                  │       │
│          │   (changes face   │    │ Approaches to Learning · 11:00 AM   │       │
│          │    per chapter)   │    │ Rating: Achieved & Progressing (ap) │       │
│          ╰───────────────────╯    │ "Built 6-block bridge with friends" │       │
│                                   ╰─────────────────────────────────────╯       │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  [ 8:30 AM · Arrival ]  [ 11:00 AM · Wonder ]  [ 1:15 PM · Rest ] ...  │   │
│   │  ━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│         [ ⏸ Pause Story ]    [ Tap Haeru to interact ✦ ]                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Component State:
- `currentChapter`: index `0 | 1 | 2 | 3` (default `0`)
- `isPlaying`: boolean (default `true`)
- `progress`: 0% to 100% animated progress bar for the current chapter (duration: 5,000ms per chapter)
- `interactiveQuote`: string | null (when visitor clicks Haeru directly)

### Chapter Auto-Advance:
- When `isPlaying` is true, an interval runs advancing to the next chapter every 5 seconds: `(prev + 1) % 4`.
- A smooth hairline progress bar fills under the active step button.
- If the user clicks any timeline button, it jumps immediately to that chapter and resets the progress bar.
- If the user clicks the `[⏸ Pause / ▶ Play]` button, it freezes the auto-advance so they can read at their own pace.

---

## 4. Visual Styling & Micro-Interactions

### A. The Speech Bubble:
- Styled as a soft 3D frosted glass balloon:
  ```tsx
  className="relative rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-teal-500/20 dark:border-teal-400/20 p-4 shadow-xl text-slate-800 dark:text-slate-100 max-w-md text-sm md:text-base leading-relaxed"
  ```
- Speech pointer: small CSS triangle or SVG beak pointing down toward Haeru's head.
- Text animation: subtle fade-in and slide-up whenever `currentChapter` changes.

### B. The Live Moment Card:
- A preview of what a teacher/director actually creates or what a parent actually sees:
  ```tsx
  <GlassCard padding="md" className="space-y-2 border border-slate-200/80 dark:border-white/10 shadow-lg">
    <div className="flex items-center justify-between text-xs">
      <span className="font-bold text-teal-700 dark:text-teal-300">{chapter.badge}</span>
      <span className="text-slate-500 dark:text-slate-400">{chapter.time}</span>
    </div>
    <p className="text-sm font-semibold text-slate-900 dark:text-white">{chapter.cardTitle}</p>
    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
      {chapter.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5">{t}</span>)}
    </div>
  </GlassCard>
  ```

### C. The Interactive Timeline Scrubber:
- 4 horizontal glass pill buttons:
  1. `🌅 8:30 AM · Arrival`
  2. `🧩 11:00 AM · Wonder`
  3. `😴 1:15 PM · Rest`
  4. `🔒 3:30 PM · Delivery`
- Active button has a teal glowing halo: `bg-teal-500/10 border-teal-500/30 text-teal-800 dark:text-teal-300 font-bold`.
- Inactive buttons are subtle and clickable: `text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white`.

### D. Direct Tap on Haeru (Easter Egg):
- If visitor clicks directly on the `<HaeruCharacter />`:
  - Trigger temporary `haeru-bringing` excited bounce class.
  - Temporarily show a surprise thought bubble:
    - *"Tashi says: 'Haeru, look at my drawing!' 🎨"*
    - *"Tr. Sonam confirmed today's reflection in 1 tap!"*
    - *"100% child-scoped. No other parent sees Tashi's day."*
  - Reverts back to current chapter story after 3.5 seconds.

---

## 5. Technical Implementation Details for Cursor

### File to Create:
`src/components/marketing/HaeruStoryHero.tsx`

### Import into `LandingPage.tsx`:
Replace the static `<HaeruCharacter size={220} ... />` block in `LandingPage.tsx` with `<HaeruStoryHero />`.

### Accessibility & Reduced Motion:
- Include `aria-live="polite"` on the speech bubble so screen readers announce story transitions.
- If `prefers-reduced-motion` is active:
  - Default `isPlaying` to `false` (do not auto-advance).
  - Let visitors advance manually using the timeline buttons.

---

## 6. Cursor Composer Prompt

```text
@docs/brand/HAERU_HERO_STORY_SPEC.md @src/components/marketing/LandingPage.tsx @src/components/haeru/HaeruCharacter.tsx @src/components/ui/ @src/index.css @.cursorrules

Read HAERU_HERO_STORY_SPEC.md in full before writing any code.

Replace the static staring Haeru mascot in the hero section with the interactive "A Day with Haeru" storytelling component:

1. CREATE src/components/marketing/HaeruStoryHero.tsx:
   - Implement the 4-chapter narrative of Tashi's school day in Thimphu:
     * Chapter 0 (8:30 AM): Arrival & Suja/Porridge (expression: 'happy')
     * Chapter 1 (11:00 AM): Moment of Wonder & 6-block bridge (expression: 'bringing')
     * Chapter 2 (1:15 PM): Cozy 45m nap & wellbeing (expression: 'calm')
     * Chapter 3 (3:30 PM): Child-scoped delivery to Mummy Deki (expression: 'bringing')
   - Auto-advance every 5 seconds with a smooth CSS/timer progress bar.
   - Interactive timeline scrubber with 4 clickable glass pill buttons and Play/Pause toggle.
   - Floating speech bubble above Haeru that dynamically speaks the chapter quote.
   - Floating live moment card next to Haeru showing the real ERP/ELDS data snapshot.
   - Clickable Haeru easter egg: clicking Haeru triggers an excited bounce and a cheerful Bhutanese teacher note.

2. EMBED IN src/components/marketing/LandingPage.tsx:
   - Replace the static Haeru character platter with <HaeruStoryHero /> in the Hero section.
   - Ensure the layout is fully responsive: stacked on mobile (character -> bubble -> timeline) and beautifully aligned on desktop.

HARD RULES:
- Dual-theme compliance: text-slate-900 dark:text-white everywhere. No bare text-white on light cards.
- Zero 3D tilt/rotation.
- Must honor prefers-reduced-motion (pause auto-advance).
- npm run build must compile with zero errors.
```
