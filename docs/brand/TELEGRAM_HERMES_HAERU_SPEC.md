# Haeru Voice AI on Telegram — Master Product, Pain-to-Solution & Feature Specification
**Document:** `docs/brand/TELEGRAM_HERMES_HAERU_SPEC.md`  
**Target:** Cursor AI Composer  
**Customer-Facing Brand Name:** **Haeru Voice AI** (Bot: `@HaeruEccdBot`)  
*(Internal engineering pipeline code: Hermes AI Engine)*  
**Location in Codebase:**
- Marketing Feature Showcase & Simulator: `src/components/marketing/HaeruVoiceDemo.tsx`
- Integration in Landing Page: `src/components/marketing/LandingPage.tsx`
- Facilitator Voice Hub: `src/components/facilitator/VoiceHub.tsx`
- Schema Reference: `docs/hermes-observation-schema.json`
**Purpose:** Provide the definitive value proposition, pain-to-solution sales narrative, and interactive simulation component for Haeru's #1 selling point: **Haeru Voice AI on Telegram that eliminates all typing and paperwork for ECCD teachers.**

> **CRITICAL BRAND RULE**: To customers, teachers, directors, and parents, this feature is strictly named **Haeru Voice AI** or **Haeru on Telegram**. Do NOT use "Hermes" in public-facing marketing, button labels, or customer copy. "Hermes" is an internal backend architectural codename only.

---

## 1. The Core Market Pain: Why ECCDs & Parents are Suffering

### The Brutal Reality of Early Childhood Centres (ECCD):
In every ECCD across Bhutan, a single facilitator cares for **15 to 20 toddlers (ages 2–5)** simultaneously.
- Toddlers need feeding, comforting, diaper changes, conflict mediation, and constant active supervision.
- **There is literally NO ONE to sit at a desk, open a laptop, or type on a keyboard during class.**
- When a teacher tries to type on a phone during class, their attention is diverted, creating safety hazards and emotional disconnection.

### The 3 Unbearable Pains:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       THE 3 UNBEARABLE ECCD PAINS                               │
├─────────────────────┬───────────────────────────────────────────────────────────┤
│ 1. Teacher Burnout  │ Teachers spend 1.5–2 hours of unpaid overtime every night │
│    & Paperwork Trap │ manually filling out paper binders for the MoESD ELDS     │
│                     │ curriculum. Exhausted educators quit or cut corners.      │
├─────────────────────┼───────────────────────────────────────────────────────────┤
│ 2. Parent Anxiety   │ Parents leave their precious child for 8 hours and worry: │
│    & Blindness      │ "Did he eat? Did he nap? What did he learn?"              │
├─────────────────────┼───────────────────────────────────────────────────────────┤
│ 3. The WhatsApp     │ Centres resort to chaotic WhatsApp groups where photos of │
│    Privacy Crisis   │ the whole room are dumped publicly. Other parents gaze    │
│                     │ at and gossip about your child. Severe privacy violation. │
└─────────────────────┴───────────────────────────────────────────────────────────┘
```

---

## 2. The Hero Solution: Haeru Voice AI on Telegram

### The "One Voice Note" Breakthrough
Facilitators already have **Telegram** on their personal smartphones. They do not need to install a new heavy ERP app, learn complex software, or carry a tablet.

#### The 15-Second Teacher Flow:
1. Teacher holds the Telegram microphone button for **12 seconds** while walking around:
   > *"Kuzu Zangpo! During morning block play, Tashi Wangchuk built a high arch bridge and counted five blocks out loud. When Pema asked to play, he hesitated but shared his blue block. Also, Tashi ate all his pumpkin soup and red rice at lunch."*
2. Hits **Send** to `@HaeruEccdBot`.
3. **Teacher's job is 100% complete. Total time spent: 12 seconds.**

---

## 3. What Haeru Voice AI Does Automatically (Powered by Backend Hermes Engine)

When the audio note hits the Telegram bot (`@HaeruEccdBot`), the AI pipeline executes 6 automated steps in under 3 seconds:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   HAERU VOICE PIPELINE IN 3 SECONDS                     │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Whisper Transcription (Handles English + Dzongkha colloquial terms)  │
│ 2. Entity Disambiguation (Identifies 'Tashi Wangchuk' & 'Pema Dorji')   │
│ 3. Automated Care Extraction:                                           │
│    • 🍚 Meals: Finished full portion (Red rice & Pumpkin soup)          │
│    • 😊 Mood: Cooperative, focused, cheerful                            │
│ 4. MoESD ELDS (2019) Dual Milestone Mapping:                            │
│    • Milestone A (Cognition): Counts objects up to 5 -> Rating: 'ap'    │
│    • Milestone B (Social): Shares materials after pause -> Rating: 'ap' │
│ 5. Strict Child-Atomic Privacy Splitting:                               │
│    • Tashi's family sees: "Tashi counted 5 blocks and shared with a     │
│      classmate" (Pema's identity is completely anonymized)              │
│    • Pema's family sees: "Pema engaged in cooperative play"             │
│ 6. Queue to Director Review Gate -> Confirmed with 1 tap                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Before vs. After: The Irresistible Sales Comparison

| Dimension | The Old Painful Way (Without Haeru) | The Telegram Hermes Way (With Haeru) |
|---|---|---|
| **Time Spent by Teacher** | **90–120 minutes/day** of manual paper logging after hours | **15 seconds** per spoken voice note during regular play |
| **Tool Required** | Heavy paper binders, clipboards, or cumbersome laptops | The phone already in their pocket with **Telegram** |
| **Learning Curve** | High; teachers resist complex software | **Zero learning curve**; everyone knows how to send a voice note |
| **Child Safety** | Eyes on screen instead of on toddlers | Eyes stay 100% on the children; natural spoken interaction |
| **MoESD ELDS Compliance** | Rushed, faked, or incomplete checklists at end of term | **100% continuous, real-time curriculum alignment** |
| **Parent Updates** | Chaotic WhatsApp broadcast with zero individual detail | **Private, child-scoped daily reflection** sent to family |
| **Child Privacy** | Photos broadcast to all 30 parents in group chat | **Strict zero-peer-leak privacy**; camera EXIF GPS scrubbed |
| **Director Governance** | Director has zero oversight until term-end | **1-Tap Review Gate** verifies observations before delivery |

---

## 5. Complete Feature Catalog of Telegram Hermes Haeru Bot

### Feature 1: Multi-Lingual Natural Speech Transcription
- Powered by fine-tuned Whisper AI.
- Understands mixed Bhutanese colloquial phrasing (English laced with Dzongkha: *Kuzu Zangpo La*, *Ema Datshi*, *Zhugzhuk*, *Loso*, *Chhey*).
- Filters background toddler noise, playground echoes, and singing.

### Feature 2: Multi-Child Mention Splitting
- If a facilitator mentions multiple children in one voice note:
  > *"Sangay, Tashi, and Dawa planted mustard seeds in the garden together."*
- Hermes AI automatically creates **three distinct, isolated observation records**.
- Each parent receives an update tailored strictly to their child, with other children's names replaced with *"classmates"* or *"friends"*.

### Feature 3: Automatic Daily Care Extractor (4 Vital Signs)
Hermes parses spoken voice notes for routine care data:
- 🍚 **Meals**: Identifies food items and portions eaten (*"finished all"*, *"half portion"*, *"refused vegetables"*).
- 😴 **Nap**: Time asleep, duration, and waking mood (*"slept 45 minutes peacefully"*).
- 😊 **Mood**: Emotional state (*"radiant"*, *"hesitant at arrival"*, *"energetic outdoor play"*).
- 🚽 **Toileting**: Independent vs. prompted potty trips.

### Feature 4: MoESD ELDS (2019) 6-Domain Matcher
- Matches spoken narratives directly against the Ministry of Education & Skills Development curriculum standards:
  1. *Physical Development & Health* (Gross/fine motor)
  2. *Social & Emotional Development* (Sharing, empathy, self-regulation)
  3. *Language, Communication & Literacy* (Receptive, expressive, Dzongkha)
  4. *Approaches to Learning* (Curiosity, problem-solving, persistence)
  5. *Cognition & General Knowledge* (Counting, sorting, natural concepts)
  6. *Spiritual, Moral & Cultural Values* (Driglam Namzha, elders, culture)
- Assigns tentative developmental rating:
  - `ap`: Achieved & progressing
  - `bl`: Beginning to learn
  - `nya`: Not yet

### Feature 5: Camera EXIF Stripping & Privacy Split-Post
- When photos are sent to the Telegram bot, Hermes automatically scrubs all camera metadata:
  - GPS coordinates and school physical location tags removed.
  - Camera device ID and timestamp metadata stripped.
- If a tagged child's profile has `socialConsent: false`, Hermes issues an immediate **Privacy Split Warning**:
  - *"⚠️ Kinley does not have social feed consent. Hermes will crop Kinley for the room feed and send the uncropped original only to Kinley's mother Deki."*

### Feature 6: 1-Tap Director Confirmation Queue
- No observation reaches a parent unverified.
- Drafts appear in Centre Director Choki's review dashboard with a 1-tap `[ ✅ Confirm All ]` or `[ ✏️ Edit ]` button.

### Feature 7: Quick Telegram Bot Commands for Facilitators
- `/today` — Room attendance summary (e.g. 14 / 16 present in Kindergarten).
- `/nap` — 1-tap bulk nap logger for the entire room.
- `/meal` — 1-tap lunch consumption check.
- `/review` — View pending observations awaiting Director confirmation.

---

## 6. Marketing & Landing Page Component: `<HaeruVoiceDemo />`

To sell this effectively, visitors to the landing page must **experience the magic themselves**.

### Visual Structure of `src/components/marketing/HaeruVoiceDemo.tsx`:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│              THE DEATH OF PAPERWORK IN BHUTANESE ECCDS                          │
│        "There is no one to sit and type. Speak to Haeru. Haeru does it all."    │
│                                                                                 │
│   ┌───────────────────────────────┐     ┌───────────────────────────────────┐   │
│   │ 📱 TELEGRAM BOT: @HaeruEccdBot │     │ ⚡ HAERU VOICE AI REAL-TIME DEMO  │   │
│   │                               │     │                                   │   │
│   │ [ Tr. Sonam @ Kindergarten ]  │ ──→ │ • Child: Tashi Wangchuk (Age 4)   │   │
│   │                               │     │ • Care: 🍚 Lunch eaten (Full)     │   │
│   │ [ 🎙️ ▶ 0:12 Voice Note ]     │     │ • ELDS: Cognition (Counting) 'ap' │   │
│   │ "Kuzu Zangpo! Tashi built     │     │ • ELDS: Social (Sharing) 'ap'     │   │
│   │  an arch bridge and counted   │     │                                   │   │
│   │  5 blocks out loud..."        │     │ 🔒 PRIVACY-FILTERED PARENT VIEW:  │   │
│   │                               │     │ "Tashi counted 5 blocks and       │   │
│   │ [ 📷 Staged Moment Photo ]    │     │  shared with a classmate today."  │   │
│   │                               │     │                                   │   │
│   │                               │     │ [ ✅ Confirmed by Director Choki ] │   │
│   └───────────────────────────────┘     └───────────────────────────────────┘   │
│                                                                                 │
│   [ 3 Sample Scenarios: 1. Building Bridge · 2. Circle Time · 3. Lunch & Nap ]  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Interactive Features of the Simulator:
1. **Interactive Scenario Switcher**:
   - Scenario A: *Block Play & Sharing* (Cognition + Social & Emotional)
   - Scenario B: *Circle Time Dzongkha Bridge* (Language & Communication)
   - Scenario C: *Lunchtime & Cozy Nap* (Daily Care & Wellbeing)
2. **Playable Audio Simulation**:
   - Visitors click `[ ▶ Play Audio Note ]`.
   - Simulated voice waveform animates with sound synthesis (`playPop` / `playChirp`).
3. **Live AI Extraction Unfolding**:
   - Watch the raw speech note get colorfully tagged into MoESD domains and care metrics in real-time with smooth CSS fade-ins.
4. **Parent View Comparison**:
   - Shows the side-by-side: what teacher spoke vs. what parent safely sees.

---

## 7. Cursor Composer Prompt

Copy-paste this prompt into Cursor Composer (`Ctrl + I`, Agent mode):

```text
@docs/brand/TELEGRAM_HERMES_HAERU_SPEC.md @docs/HAERU_ENTERPRISE_LANDING_PAGE_SPEC.md @docs/hermes-observation-schema.json @src/components/marketing/LandingPage.tsx @src/components/facilitator/VoiceHub.tsx @src/components/ui/ @src/index.css @.cursorrules

Read TELEGRAM_HERMES_HAERU_SPEC.md in full before writing any code.

Emphasize Haeru Voice AI on Telegram as Haeru's #1 selling point. Build the interactive Telegram simulator and dedicated pain-to-solution sales section:

1. BRAND INTEGRITY:
   - Customer-facing name is strictly "Haeru Voice AI" or "Haeru on Telegram" (Bot handle: @HaeruEccdBot).
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
     * 1. Building & Sharing (Cognition + Social)
     * 2. Circle Time Dzongkha Bridge (Language)
     * 3. Lunch & Cozy Nap (Routine Care)
   - Clicking a scenario dynamically updates both the Telegram chat and the Hermes AI extraction breakdown!

2. INTEGRATE INTO src/components/marketing/LandingPage.tsx:
   - Place a dedicated high-impact section immediately below the Hero:
     "THE DEATH OF PAPERWORK: Why Bhutanese ECCDs are Moving to Telegram Hermes"
   - Include the 3 Unbearable Pains vs. The 15-Second Solution comparison grid.
   - Mount <TelegramHermesDemo /> as the interactive centerpiece.
   - Include trust highlights: "Zero New Apps for Teachers to Learn", "Colloquial Dzongkha + English", "1-Tap Director Confirmation".

HARD RULES:
- Dual-theme compliance: text-slate-900 dark:text-white across all cards. Zero bare text-white on light cards.
- Zero 3D tilt/rotation.
- Interactive scenario buttons must seamlessly update state without page reload.
- npm run build must compile with zero errors.
```
