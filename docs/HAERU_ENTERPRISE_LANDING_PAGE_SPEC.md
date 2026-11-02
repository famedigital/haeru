# Haeru — Enterprise Public Landing Page Specification
**Document:** `docs/HAERU_ENTERPRISE_LANDING_PAGE_SPEC.md`  
**Target:** Cursor AI Composer  
**Product:** Haeru (Intelligent Operating System for Bhutanese ECCDs)  
**Location in Codebase:** `src/components/marketing/EnterpriseLandingPage.tsx`  
**Purpose:** Comprehensive design-in-words specification for Cursor to build an enterprise-level public marketing and product landing page that clearly explains what Haeru is, who can use it, how it works, why it is built specifically for Bhutan, and provides immediate paths to sign in or explore interactive demo portals.

---

## 1. Page Objectives & Design Philosophy

### The Goal of the Page
To provide a world-class, enterprise-grade digital front door for Haeru that balances:
1. **Executive Authority**: Instilling confidence in Centre Directors, School Owners, and Ministry of Education & Skills Development (MoESD) officials.
2. **Warmth & Safety**: Welcoming parents, teachers, and caregivers with the gentle, protective companion energy of Haeru.
3. **Clarity of Purpose**: In under 10 seconds, visitors must understand:
   - **What is Haeru?** The intelligent operating system and child guardian platform for early childhood care in Bhutan.
   - **Who is it for?** Directors, Facilitators, Parents, and Caregivers.
   - **How does it work?** 1-tap capture → AI & privacy split → Director confirmation → child-scoped family delivery.
   - **Why Bhutan?** Aligned with MoESD ELDS 2019, native Ngultrum (Nu.), and Bank of Bhutan (mBoB) / BNB (mPay) integration.

### Visual Aesthetic: "Modern Himalayan Glass"
- **Dual-Theme First**: 100% compliant with both "Sunrise Himalayan Frosted Pearl" (light) and "Midnight Himalayan Glass" (dark).
- **Soft 3D Glassmorphism**: Translucent frosted panels (`backdrop-blur-2xl`), delicate hairline borders, ambient glow auras, and gentle elevation (`hover:-translate-y-1 active:scale-[0.985]`).
- **NO Rotation Tilt**: Absolutely zero mouse-tracking rotation or skewing.
- **Animated Haeru Presence**: The character greets visitors in the hero section, floats gently, blinks, and radiates warmth.

---

## 2. Page Navigation & Header (Persistent Floating Glass Bar)

### Layout:
- Fixed or sticky top bar with `backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-white/10 px-6 md:px-12 py-3.5 z-40 transition-all`.
- Container width: `max-w-7xl mx-auto flex items-center justify-between`.

### Elements (Left to Right):
1. **Brand Lockup**:
   - `<HaeruLogo showTagline={false} />` (Avatar + lowercase "haeru" in `font-display font-bold text-xl text-teal-700 dark:text-teal-300`).
   - Subtle vertical divider + muted text: `"Wangchuk's School of Heroes"` (or current partner centre).
2. **Desktop Navigation Links** (hidden on mobile, hamburger menu for mobile):
   - `What is Haeru` → `#about`
   - `Who Can Use` → `#personas`
   - `How It Works` → `#how-it-works`
   - `ELDS 2019` → `#curriculum`
   - `Security & Privacy` → `#privacy`
   - `Centres & Pricing` → `#pricing`
3. **Right Controls**:
   - **Sun/Moon Theme Toggle**: Icon button calling `useAppStore().toggleTheme()`.
   - **"Launch Portals" / "Sign In" Button**: Glass button with gradient border (`bg-teal-600 text-white hover:bg-teal-500 shadow-sm`) that opens the role login/quick unlock modal or routes to portal selector.

---

## 3. Section-by-Section Wireframe & Copy Specification

### Section 1: Hero Section (Above the Fold)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│   [✦ Soft ambient emerald / amber blurred radial glows in background ✦]         │
│                                                                                 │
│         [ Pill Badge: 🇧🇹 Built for Bhutan Early Childhood Education ]           │
│                                                                                 │
│             The Intelligent Operating System for                                │
│               Bhutanese Early Childhood Care                                    │
│                                                                                 │
│   Haeru watches over every child's school day — bridging Centre Directors,      │
│   Facilitators, and Families with strict child-scoped privacy and MoESD ELDS.   │
│                                                                                 │
│          [  Explore Demo Portals  ]      [  How Haeru Works ↓  ]                │
│                                                                                 │
│                       ╭───────────────────────╮                                 │
│                       │   🌿 HAERU ANIMATED   │                                 │
│                       │   Character (220px)   │                                 │
│                       │   Float · Blink · Aura│                                 │
│                       ╰───────────────────────╯                                 │
│                                                                                 │
│   [ Trust Bar: MoESD ELDS 2019 Compliant · Bank of Bhutan mBoB · Zero Peer Leaks]│
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Elements:
- **Pill Badge**:
  - `bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4`.
  - Icon: Bhutan national flag emoji 🇧🇹 or small golden dorji icon.
  - Text: `"National ECCD Standard · Aligned to MoESD 2019 Curriculum"`.
- **Hero Title**:
  - `font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] max-w-4xl mx-auto`.
  - Gradient accent text on `"Bhutanese Early Childhood Care"`: `bg-gradient-to-r from-teal-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent`.
- **Subtitle**:
  - `text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed`.
  - Copy: *"Haeru watches over every child’s school day — bringing together Centre Directors, Teachers, and Families through private daily reflections, audio voice-logging, and developmental milestone tracking."*
- **Action CTAs**:
  - Primary: `[Explore Live Portals →]` — opens persona picker (Owner / Facilitator / Parent).
  - Secondary: `[Watch 2-Min Tour]` or `[Book Centre Onboarding]`.
- **Hero Interactive Centerpiece — "A Day in the Life with Haeru" (`<HaeruStoryHero />`)**:
  - *Full specification in `docs/brand/HAERU_HERO_STORY_SPEC.md`.*
  - Instead of a static mascot staring at visitors, Haeru actively narrates a 4-chapter story of a child's day (Tashi in Kindergarten at WSH Thimphu):
    1. **8:30 AM · Arrival**: Haeru speaks: *"Kuzu Zangpo La! Tashi arrived at 8:32 AM. Shoes in cubby, warm suja & porridge eaten."* (Expression: `happy`)
    2. **11:00 AM · Wonder**: Haeru speaks: *"Look what Tashi built! A 6-block bridge. Tr. Sonam recorded a voice note — Hermes mapped it to ELDS Milestone 4.2!"* (Expression: `bringing`)
    3. **1:15 PM · Rest**: Haeru speaks: *"Shhh… 45-minute cozy nap after lunch. All calm in the room."* (Expression: `calm`)
    4. **3:30 PM · Safe Delivery**: Haeru speaks: *"Director Choki confirmed notes. Delivering private reflection to Mummy Deki. Zero peer names exposed."* (Expression: `bringing`)
  - Features an interactive auto-advancing scrubber timeline (5s interval, play/pause toggle, clickable chapter tabs), live moment preview cards, and clickable easter-egg teacher notes.
- **Trust Metrics Ribbon**:
  - 4 key metrics in horizontal frosted pill bar:
    1. **100% Child-Scoped**: Zero public social dumps.
    2. **6 ELDS Domains**: Observed, never tested.
    3. **mBoB & mPay Native**: Nu. fees with automated receipts.
    4. **Director Review Gate**: Zero unverified posts reach parents.

---

### Section 2: "What is Haeru?" — The Philosophy & Brand Identity

#### The Core Problem Haeru Solves:
- Most preschool software is either an administrative spreadsheet or an insecure social media feed that exposes other children's faces and names to the whole class.
- Teachers spend hours writing repetitive paper reports instead of being present with children.
- Parents are left in the dark about actual developmental progress.

#### What Haeru Does Differently:
- **Named for Protection**: Inspired by the ancient Buddhist virtue of *Hārītī* (guardian and protector of children), reimagined as an original, friendly, cloud-soft digital companion.
- **Child as the Atomic Unit of Privacy**: Every moment, photo, and observation belongs strictly to one child and their registered guardians.
- **One Teacher Action → Many Tailored Family Outcomes**: A facilitator records one quick audio note or photo; the platform strips metadata, tags the child, drafts the MoESD ELDS indicator, and routes it to the Director's confirmation queue.

#### 3 Visual Feature Cards:
1. **Gently Intelligent**: Hermes Voice AI transcribes classroom updates from Telegram voice notes so teachers never have to type on small keyboards during class.
2. **Observed, Never Tested**: Developmental progress follows the MoESD 2019 framework — children are celebrated for their natural exploration, never ranked or compared against peers.
3. **Culturally Rooted in Bhutan**: Designed specifically for Bhutanese centres with Dzongkha greetings, Driglam Namzha cultural values, and local Bank of Bhutan QR payment reconciliation.

---

### Section 3: "Who Can Use Haeru?" — The 4 Core Personas

An interactive persona switcher tab bar that allows visitors to click through the 4 distinct views with real screen mockups and bulleted feature lists:

```
[  👑 For Centre Directors  ]  [  🎨 For Facilitators  ]  [  👨‍👩‍👧 For Parents  ]  [  🤝 For Caregivers  ]
```

#### Tab 1: Centre Directors & School Owners (`owner`)
- **Headline**: *"Complete Early Childhood Centre Administration & Governance"*
- **Features**:
  - **9-Step Paperless Admissions Wizard**: Collect child health, guardian details, emergency contacts, and transfer documents without lost physical folders.
  - **Automated 4-Tier Tuition Invoicing**: 1-installment (15% off), 2-term (10% off), 3-term (3% off), and monthly billing with calendar catch-up proration for mid-year joiners.
  - **Director Confirmation Gate**: Hold all facilitator developmental ratings and photo moments in review before parents see them.
  - **Staff Directory & Casual Leave**: Track 20-day annual casual leave balances and qualifications.
  - **Bank of Bhutan Account Reconciliation**: Reconcile mBoB / BNB mPay journal numbers in one tap.

#### Tab 2: Facilitators & Educators (`facilitator`)
- **Headline**: *"Spend Time with Children, Not with Paperwork"*
- **Features**:
  - **60-Second Daily Care Logger**: Log room-wide 🍚 Meals, 😴 Nap, 😊 Mood, and 🚽 Toilet with rapid multi-select chips.
  - **Hermes Voice AI via Telegram**: Speak a 15-second audio note ("Tashi built a 6-block tower today and counted each block"); AI maps it to ELDS Cognition Domain indicator 5.1.
  - **Privacy Split-Post Warnings**: Automatic camera EXIF location stripping; if a photo contains a child without social consent, the system automatically alerts the teacher to split the post into a private family note.

#### Tab 3: Parents & Primary Guardians (`parent`)
- **Headline**: *"A Window into Your Child's Day — Completely Private"*
- **Features**:
  - **Daily Reflection Card**: Wake up to arrival time, meals eaten, nap duration, mood smiley, and the teacher's personal reflection quote.
  - **Private Moments Feed**: Photos and milestones showing strictly your child (never other children's names).
  - **6-Domain MoESD Radar Chart**: Track developmental growth across 4 yearly observation windows (Feb–Mar, May–Jun, Aug–Sep, Oct–Nov) with *"Something to Celebrate"* and *"Working on Together at Home"*.
  - **1-Tap Fee Payments**: Download invoices, scan Bank of Bhutan QR, submit mBoB journal number, and receive instant digital receipt.

#### Tab 4: Delegated Caregivers (Grandparents, Nannies) (`caregiver`)
- **Headline**: *"Daily Care Information with Strict Financial Boundaries"*
- **Features**:
  - **Authorized Pickup Verification**: Clear photo badges and pickup clearance for daily school hand-off.
  - **Daily Care Highlights**: Know if the toddler had lunch, took their afternoon nap, or needs medicine.
  - **Strict Fee Cloaking**: Financial invoices, tuition fee plans, and payment forms are completely invisible to delegated caregivers.

---

### Section 4: "How It Works" — The 3-Step Journey

Visual horizontal roadmap with numbered glass step cards:

1. **Step 01: Capture in Seconds**
   - Facilitator snaps a classroom moment or sends a voice note via the classroom Telegram bot.
   - Zero tedious typing; takes under 15 seconds between activities.
2. **Step 02: Intelligent Privacy & AI Verification**
   - Location EXIF data is stripped immediately.
   - Hermes AI extracts developmental indicators against the 6 MoESD domains.
   - Centre Director reviews and confirms the observation in the Review Gate.
3. **Step 03: Private Child-Scoped Delivery**
   - Parents receive a gentle notification from Haeru.
   - Only their own child's progress is visible.
   - Families enjoy actionable tips for home learning.

---

### Section 5: The Bhutan MoESD ELDS (2019) Standard Deep-Dive

An educational, authority-building section that proves Haeru's deep regulatory alignment with the Ministry of Education & Skills Development.

#### The 6 Official Developmental Domains (Grid of 6 interactive cards):
1. **🏃 Physical Development & Motor Skills**:
   - Gross motor coordination, fine motor pencil grasp, sensory balance, hygiene.
2. **🤝 Social & Emotional Development**:
   - Sharing with classmates, self-regulation, empathy, group play dynamics.
3. **🗣️ Language, Communication & Early Literacy**:
   - Receptive listening, expressive storytelling, Dzongkha vocabulary, pre-reading curiosity.
4. **🔍 Approaches to Learning**:
   - Exploration, persistence with puzzles, creative imagination, curiosity.
5. **🧩 Cognition & General Knowledge**:
   - Spatial relationships, counting, sorting patterns, natural world awareness.
6. **🌸 Spiritual, Moral & Cultural Values**:
   - Respect for elders and teachers, Bhutanese traditions, Driglam Namzha etiquette.

#### The Assessment Philosophy:
- **"Observed, Never Tested."**
- **3-Level Scoring**:
  - `ap`: *Achieved & Progressing* (Himalayan Teal)
  - `bl`: *Beginning to Learn* (Saffron Gold)
  - `nya`: *Not Yet* (Coral Rose)
- Children are **never ranked, compared, or given numerical grades**.

---

### Section 6: Security, Child Privacy & Data Sovereignty

4 High-Security Pillars with Shield & Lock icons:
1. **Child-Atomic Privacy**: Individual child database scoping. Zero peer data leaks.
2. **Camera EXIF Stripping**: All GPS coordinates, device identifiers, and timestamp metadata are scrubbed from uploaded media before storage.
3. **Biometric Quick Unlock & PIN**: 6-digit tactile keypad and Touch ID / WebAuthn passkey access with 15-minute idle lock for sensitive financial views.
4. **Bhutanese Data Sovereignty**: Compliant with national data protection guidelines; servers hosted with enterprise encryption at rest (AES-256) and in transit (TLS 1.3).

---

### Section 7: Centre Onboarding & SaaS Tiers (Pricing)

Transparent, straightforward pricing for Bhutanese ECCD centres:

| Tier | Community / Rural | Standard Private | Enterprise Network |
|---|---|---|---|
| **Monthly Price** | **Nu. 0** (Free) | **Nu. 4,500** / month | **Nu. 8,500** / month |
| **Ideal For** | NGO & Village ECCDs | Standalone private centres | Multi-branch ECCD groups |
| **Children Cap** | Up to 25 children | Up to 60 children | Unlimited children |
| **Staff Accounts** | Up to 4 facilitators | Up to 12 facilitators | Unlimited staff |
| **Voice AI (Hermes)**| 60 mins / month | 300 mins / month | Unlimited voice minutes |
| **Admissions & Invoicing**| Basic manual | Full 9-step wizard + auto-invoicing | Multi-branch consolidated |
| **Bank of Bhutan mBoB**| Manual upload | Dynamic QR + 1-tap reconcile | Multi-account support |
| **Support** | Community docs | Dedicated WhatsApp / Phone | 24/7 Priority Ops |

*Custom onboarding assistance available in Thimphu, Paro, and Phuentsholing.*

---

### Section 8: Frequently Asked Questions (Accordion)

1. **What makes Haeru different from sending photos over WhatsApp or WeChat?**
   - WhatsApp groups broadcast every child's photo and conversation to all parents, violating child privacy and creating endless notification noise. Haeru ensures parents only see their own child, keeps records organized under the official MoESD ELDS framework, and handles tuition invoices securely.
2. **Can grandparents or nannies use the app?**
   - Yes! Haeru has a dedicated Caregiver role. Grandparents or helpers can check daily meal/nap summaries and authorized pickup codes, but all tuition fees and financial records are strictly hidden from them.
3. **How does payment with Bank of Bhutan (mBoB) work?**
   - When an invoice is due, parents see a direct BoB dynamic QR code with the exact Nu. amount. After transferring, they simply paste or upload their mBoB Journal Number. The Centre Director verifies it with one tap.
4. **Does Haeru replace our teachers' observations?**
   - No, Haeru empowers teachers. Instead of sitting down after hours to fill out paper binders, teachers take 15 seconds to dictate an observation. Hermes AI maps it to the curriculum, but the facilitator and director retain 100% final editorial control.
5. **How can our ECCD centre join Haeru?**
   - Click "Book Centre Onboarding" to speak with our Thimphu team, or launch our interactive demo to test the Director and Facilitator portals today.

---

### Section 9: Call-to-Action & Launchpad Banner

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│          🌿 Give Your ECCD Centre the Guardian It Deserves                      │
│                                                                                 │
│   Join Wangchuk's School of Heroes and forward-thinking Bhutanese ECCDs.        │
│   Experience paperless admissions, calm teachers, and delighted families.       │
│                                                                                 │
│      [  Launch Interactive Demo  ]      [  Contact Onboarding Team  ]           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Section 10: Enterprise Footer

- **Col 1 (Brand)**: `<HaeruLogo />` + "Watches over every day at school." + "Bhutan's premier early childhood operating system."
- **Col 2 (Portals)**: Director ERP, Facilitator Hub, Family Portal, Caregiver View, Superadmin Console.
- **Col 3 (Regulatory & Curriculum)**: Bhutan MoESD ELDS (2019), Dzongkhag Coverage, Child Privacy Charter.
- **Col 4 (Legal & Contact)**: Privacy Policy, Terms of Service, Support in Thimphu (+975-17... / contact@haeru.bt).
- **Bottom Bar**: `© 2026 Haeru Platform. Built with care for the children of the Kingdom of Bhutan.`

---

## 4. Technical Implementation Directives for Cursor

### File Location:
Create or replace: `src/components/marketing/LandingPage.tsx` (and supporting subcomponents if modular).

### Key React Components to Reuse:
- `src/components/haeru/HaeruCharacter.tsx` (for the animated hero companion)
- `src/components/haeru/HaeruLogo.tsx` (for the navbar and footer brand lockup)
- `src/components/ui/GlassCard.tsx` (for all frosted glass cards)
- `src/components/ui/GlassButton.tsx` (for interactive action buttons)
- `src/components/ui/RadarChart3D.tsx` (for the embedded ELDS 6-domain preview)
- `src/lib/store/appStore.tsx` (`useAppStore` for theme toggling and setting role to `owner`, `facilitator`, or `parent`)

### Interaction Wiring:
- Clicking any **"Launch Portals"** or **"Try Demo"** button should call `setRole('landing')` or `setRole('owner')` to seamlessly transition into the interactive application.
- Clicking **"Sign In"** should call `setRole('signin')`.

---

## 5. Cursor Composer Prompt

```text
@docs/HAERU_ENTERPRISE_LANDING_PAGE_SPEC.md @docs/brand/HAERU_CHARACTER_BRIEF.md @src/components/marketing/LandingPage.tsx @src/components/haeru/HaeruCharacter.tsx @src/components/haeru/HaeruLogo.tsx @src/components/ui/ @src/index.css @.cursorrules

Read HAERU_ENTERPRISE_LANDING_PAGE_SPEC.md in full before writing any code.

Build the enterprise-level public marketing and product landing page in src/components/marketing/LandingPage.tsx:

1. HERO SECTION:
   - Floating glass navigation bar with HaeruLogo, navigation anchor links, Sun/Moon theme toggle, and Sign In / Demo CTAs.
   - Aligned to MoESD ELDS 2019 pill badge with Bhutan flag emoji.
   - Large display typography with emerald/amber gradient accents.
   - Embedded <HaeruCharacter size={220} expression="happy" animate={true} /> with soft glowing halo and floating sparkle dots.
   - Trust metrics ribbon (100% Child-Scoped, 6 ELDS Domains, mBoB Native, Director Review Gate).

2. "WHAT IS HAERU" SECTION:
   - Explanation of the brand philosophy (inspired by Buddhist virtue of Hārītī / guardian of children, reimagined as an original digital companion).
   - 3 feature glass cards: Gently Intelligent (Voice AI), Observed Never Tested (ELDS 2019), Culturally Rooted in Bhutan.

3. "WHO CAN USE HAERU" INTERACTIVE PERSONA TABS:
   - Interactive tab switcher between 4 personas: Director, Facilitator, Parent, Caregiver.
   - Each tab reveals detailed capabilities, pain points solved, and preview metrics.

4. "HOW IT WORKS" 3-STEP PIPELINE:
   - Step 1: Capture in Seconds (Voice & photo)
   - Step 2: Privacy Split & Director Review Gate
   - Step 3: Private Child-Scoped Delivery

5. BHUTAN MoESD ELDS (2019) 6-DOMAIN SHOWCASE:
   - Grid cards for all 6 domains (Physical, Social, Language, Approaches, Cognition, Spiritual/Cultural).
   - Explanation of ap / bl / nya ratings ("Observed, never tested; children are never ranked").

6. SECURITY, PRIVACY & DATA SOVEREIGNTY:
   - Child-atomic database scoping, camera EXIF location stripping, Biometric Quick Unlock, AES-256 encryption.

7. PRICING & SAAS TIERS:
   - Community / NGO (Nu. 0), Standard Private (Nu. 4,500/mo), Enterprise Network (Nu. 8,500/mo).

8. ACCORDION FAQ & ENTERPRISE FOOTER:
   - 5 comprehensive questions addressing privacy, grandparents, mBoB payments, and teacher workload.
   - Complete Bhutanese enterprise footer.

HARD RULES:
- Dual-theme compliance: text-slate-900 dark:text-white across all sections. Zero bare text-white on light cards.
- Zero 3D tilt/rotation on any card. Soft translate-y-0.5 elevation only.
- Buttons wired to appStore: "Explore Demo" sets role to open portal, "Sign in" sets role to 'signin'.
- Build must pass cleanly: run npm run build and fix all TypeScript errors.
```
