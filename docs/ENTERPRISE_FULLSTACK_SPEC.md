# Bhutan ECCD Enterprise Platform — Master Full-Stack Specification
### System: Wangchuk's School of Heroes (WSH) & Kidu Care Pulse AI Gateway
**File Location**: `docs/ENTERPRISE_FULLSTACK_SPEC.md`  
**Reference Mockups & Schemas**: `docs/wsh-website-mockup.html`, `docs/hermes-observation-schema.json`, `docs/architecture.md`

---

## 1. Executive Summary & Core Mission

The **Bhutan ECCD Enterprise Platform** is a full-stack Early Childhood Care and Development operating system designed for Bhutanese childcare centres. It merges:
1. **WSH ERP Operating System**: End-to-end administration, 9-step admissions wizard, 4-tier tuition billing engine with automated invoicing, staff & casual leave management, delegated caregiver access, and Bhutan MoESD ELDS (2019) 6-domain developmental tracking.
2. **Kidu Care Pulse Gateway**: Staff-light capture via Telegram audio notes & phone media parsed by Hermes AI into structured ELDS milestones, confirmed with one tap by facilitators, and pushed directly to child-scoped parent feeds.

### The Immutable Hard Rules
1. **Child is the Atomic Unit of Privacy**: Parents and caregivers never see a classroom-wide public feed. Every moment, photo, and update is scoped strictly to `guardian.childIds`. Other children in group moments are automatically anonymized to "a friend" or "a classmate".
2. **MoESD ELDS 2019 Assessment Standards**: "Observed, never tested. Children are never ranked." Facilitators record ratings across 6 domains (`ap`: Achieved & progressing, `bl`: Beginning to learn, `nya`: Not yet). Every rating is held in a review gate until confirmed by the Centre Director/Owner before parents can view it.
3. **Media Policy & Privacy Split-Post**: Photos have location/EXIF metadata stripped upon upload. If a child lacks in-app feed consent, the system alerts the teacher and splits the submission into a public post (with the child cropped out) and a private direct note to that child's family.
4. **Billing Integrity (Nu.)**: Tuition discounts (15% annual, 10% 2-term, 3% 3-term) apply **strictly to tuition**, never touching ancillary fees (Uniform, Admission, Stationery, Extended time, Potty training, Excursions). Late joiners use the exact calendar days catch-up proration formula. Parents report payments using Bank of Bhutan (mBoB) or BNB (mPay) journal numbers.

---

## 2. 3D Glassmorphism Design System ("Modern Himalayan Glass")

The visual style blends **colorful, vibrant early-childhood warmth** with **executive enterprise clarity**.

### A. Color Palette Tokens
| Token Name | Hex / RGBA | Semantic Usage |
|---|---|---|
| `--canvas-dark` | `#090D16` / `#0F172A` | Background base with dynamic radial blurred chromatic gradient spheres |
| `--himalayan-teal` | `#10B981` / `#3D7D71` | *Achieved & Progressing* (`ap`), verified moments, primary CTAs, active tabs |
| `--saffron-gold` | `#F59E0B` / `#F4C87A` | *Beginning to Learn* (`bl`), pending fee alerts, mastered milestones |
| `--coral-rose` | `#F43F5E` / `#F6D7CE` | *Not Yet* (`nya`), allergies, sensory trigger alerts |
| `--lotus-violet` | `#8B5CF6` / `#A84A38` | Caregiver tags, celebrations, Hermes AI assistant dialogs |
| `--warm-cream-glass` | `rgba(255, 249, 242, 0.08)` | Translucent frosted glass card backgrounds (`backdrop-blur-2xl`) |

### B. 3D Glass CSS Classes (Tailwind v4 Compatible)
```css
/* Glass Surface with Multi-Layer Specular Rim */
.glass-panel-3d {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-top: 1px solid rgba(255, 255, 255, 0.32);
  border-left: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.25),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease;
}

.glass-panel-3d:hover {
  transform: translateY(-4px) rotateX(1.5deg) rotateY(-1.5deg) scale(1.008);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.55),
    0 0 25px rgba(6, 182, 212, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
}

/* Glowing Neon Badges for ELDS Ratings */
.glass-badge-ap {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34D399;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
}

.glass-badge-bl {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #FBBF24;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
}

.glass-badge-nya {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.4);
  color: #FB7185;
  box-shadow: 0 0 15px rgba(244, 63, 94, 0.2);
}
```

---

## 3. Personas & Screen Specifications (from `wsh-website-mockup.html`)

### Persona 1: `owner` (Owner / Centre Director)
1. **`today` (Executive Dashboard)**:
   - Hero greeting with date and status ("40 of 45 children are here today. Oct–Nov observation window is open").
   - 4 KPI cards: Attendance (`40/45`), Applications to review (`3`), Overdue invoices (`Nu. 25,400`), Leave requests (`2`).
   - Rooms occupancy progress bars (Toddlers, Nursery, Kindergarten).
   - "Needs your attention" list (Parent payments to confirm, ELDS ratings to confirm, posts awaiting approval).
   - Upcoming calendar events.
2. **`children` (Master Directory)**:
   - Search by name/code, room filter chips (`All rooms`, `Toddlers`, `Nursery`, `Kindergarten`), media consent pill, and fee status.
3. **`child` (Child 360 Profile)**:
   - Header with avatar, age, code (e.g. `WSH-24-018`), check-in time (`In 8:05 am`).
   - 5 Sub-Tabs:
     * `Overview`: Care & medical notes (allergies, medication, nap, toilet, mother tongue), pickup log (last 5 pickups), room assignment.
     * `Progress`: 6-domain radar chart across observation windows, domain checklist, celebrations & home activities.
     * `Family`: Primary parents and authorized caregivers with contact info and permissions.
     * `Fees`: 2026 fee plan table, locked status, balance due, download invoice/receipt.
     * `Photos`: Gallery of child-tagged moments.
4. **`applications` (Admissions Pipeline & 9-Step Wizard)**:
   - Kanban columns: *Submitted*, *Under review*, *Approved*, *Not this time*.
   - 9-Step Wizard: `1. Child`, `2. Mother`, `3. Father`, `4. Guardian`, `5. Care & routine`, `6. Medical`, `7. Pickup people`, `8. Transfer`, `9. Documents`.
5. **`people` (Staff & Payroll)**:
   - Staff directory with qualifications (B.Ed ECCD, Diploma) and casual leave balances (`14 of 20`).
   - Leave requests approval table (Casual, Sick, doctor's note).
   - Owner-only September payroll table (Basic, Allowances, PF & Tax, Net Pay).
6. **`families` (Guardians & Caregivers)**:
   - Approvals for caregiver requests (e.g. Grandma authorized for pickup/medical, fees hidden).
7. **`finance` (Invoicing & Bank Reconciliation)**:
   - KPI metrics: Collected this term, Due 15 Oct, Overdue, Payments to confirm.
   - Parent reported payments matching queue (mBoB / BNB mPay journal number verification).
   - Invoice master list with filter chips (`All`, `Draft`, `Issued`, `Partially paid`, `Overdue`, `Paid`).
8. **`newinvoice` (One-Off Charge Builder)**:
   - Child selector, issue & due date, line items with live preview, price list chips (Uniforms Nu. 1,500, Excursions, Stationery, etc.).
9. **`autoinv` (Automatic Invoicing Engine & Time-Travel Clock)**:
   - 4-step automated pipeline (Plan finalised -> Invoice created 14 days prior -> Parents notified -> Paid/reminded).
   - Mock time-travel clock (`13 Oct`, `1 Nov`, `12 Nov`, `15 Nov`, `22 Nov`) demonstrating automated generation, potty fee auto-skipping, and reminder dispatch.
10. **`feestructure` (Annual Price Matrix)**:
    - 4 Tuition plans: 1 installment (15% off), 2 installments (10% off), 3 installments (3% off), Monthly (Nu. 6,000/mo).
    - Ancillary price list (Admission Nu. 1,000, Stationery Nu. 3,000 / 1,500, Uniforms Nu. 1,500, Extended time Nu. 1,000/mo, Potty Nu. 1,000/mo).
11. **`feesetup` (Child Fee Plan Builder)**:
    - Enrollment date selector (Start of year vs Mid-year late joiner).
    - Catch-up proration formula calculator (`catchUp(start, cp)`).
    - Uniform selector chips and extra tuition discount selector (Sibling, Staff child, Hardship).
12. **`reports` (Financial Views)**:
    - Term/Year toggle, Income vs Expense bar charts, breakdown by fee head.
13. **`confirm` (Progress Review Gate)**:
    - Oct–Nov window review table. One-tap "Confirm All" or individual "Query" / "Confirm" of facilitator ELDS observations.
14. **`feed` (Media Approval Queue)**:
    - Review facilitator photo submissions, storage quota gauge (`312 MB of 1 GB`).
15. **`settings`**:
    - Centre profile, academic dates, photo visibility policy, Bank of Bhutan account details.
16. **`security`**:
    - Quick Unlock PIN setup, Touch ID / WebAuthn passkey toggle, 15-minute idle auto-lock.

---

### Persona 2: `facilitator` (Teacher / Educator)
1. **`ftoday` (Daily Room Hub)**:
   - Room check-in summary, daily updates logger for 🍚 Meals, 😴 Nap, 😊 Mood, 🚽 Toilet.
2. **`post` (Photo Capture & Privacy Split)**:
   - Photo staging library with EXIF/location metadata removal.
   - Tagging children with **Privacy Split Warning**: if a child lacks feed consent, prompts to split the post into a public post (without that child) and a private note.
3. **`record` (ELDS 2019 Progress Checklist)**:
   - 6-domain checklist (Gross Motor, Language, Social, etc.) with 3 ratings: *Achieved* (`ap`), *Beginning* (`bl`), *Not yet* (`nya`) + remarks. Submitted to Director for confirmation.
4. **`voice-hub` (Pulse Extension)**:
   - Telegram voice recording simulation and Hermes AI ELDS extraction review.
5. **`messages`**: Direct messaging with parents.
6. **`leave`**: Casual and sick leave tracker.
7. **`security`**: Quick Unlock PIN & Biometrics.

---

### Persona 3: `parent` (Mother / Father)
1. **`phome` (Daily Reflection)**:
   - Today at school summary (Arrival time, Meals, Nap, Mood, Toilet, Teacher reflection quote).
   - Fee alert card with direct "Pay now" action.
2. **`feed` (Child-Scoped Moments)**:
   - Photo/video moments strictly showing only their child's name in tags.
3. **`pprogress` (Developmental Progress)**:
   - 6-domain MoESD radar chart comparing observation windows (Feb-Mar, May-Jun, Aug-Sep, Oct-Nov).
   - Celebration callout ("🎉 Something to celebrate") & Home activity ("🌱 Working on together").
4. **`payments` (Invoices & mBoB Reporting)**:
   - Amount due, invoice table, receipts download, Bank of Bhutan QR code, and "I've paid" reporting form (mBoB/mPay journal number + screenshot).
5. **`messages`**: Direct messaging with facilitator.
6. **`account`**: In-app feed and social media consent toggles, authorized caregiver delegation.
7. **`security`**: PIN & Touch ID.

---

### Persona 4: `caregiver` (Grandparent, Guardian, Nanny)
1. **`chome` (Restricted Care View)**:
   - Child's daily care summary (meals, nap, mood, pickup authorization, medical alerts).
2. **Strict Privacy Boundary**:
   - Invoices, fee plans, payments, and financial data are **strictly hidden**.

---

### Persona 5: `auth` (Sign-in & Quick Unlock)
1. **`unlock`**: 6-digit tactile PIN keypad with masked dots + Touch ID / WebAuthn passkey button.
2. **`login`**: Standard email/phone and password sign-in.

---

### Persona 6: `superadmin` (Master Platform Operator / Central SaaS Ops)
*Full specification in `docs/SUPERADMIN_SPEC.md`.*
1. **`super_overview` (Global Pulse Dashboard)**:
   - Nationwide metrics across Bhutan: Total Active Centres, Total Enrolled Children, Monthly Recurring SaaS Revenue (Nu.), Hermes AI voice processing volume.
   - Dzongkhag breakdown (Thimphu, Paro, Chhukha, Punakha, etc.).
2. **`super_centres` (Multi-Tenant School Directory)**:
   - Master list of all registered ECCD centres with MoESD registration code, Dzongkhag, Director contact, child quotas, and subscription tier.
   - 1-click **Impersonate Support Mode** (with audit logging & persistent amber warning banner).
3. **`super_provision` (New ECCD Provisioning Wizard)**:
   - 4-step wizard: School Identity & MoESD code -> Director credentials -> Plan tier & limits -> Default room configuration.
4. **`super_subscriptions` (SaaS Licensing Engine)**:
   - 3-tier management: Community / NGO (free), Standard Private (Nu. 4,500/mo), Enterprise Network (Nu. 8,500/mo).
   - Automated monthly B2B billing to ECCD owners.
5. **`super_elds` (MoESD 2019 Curriculum Standards & National Analytics)**:
   - Central lock on the 6 official developmental domains.
   - Aggregate, fully anonymized national readiness indices for MoESD annual reporting.
6. **`super_telemetry` & `super_audit` (Platform Operations & Security)**:
   - Real-time monitoring of Hermes Voice AI queue latency, Telegram bot webhooks, and storage quotas.
   - System-wide broadcast announcement composer.
   - Immutable security audit log.

---

## 4. Prisma Database Schema (`backend/prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  superadmin   // Master SaaS platform operator
  owner        // Centre Director / ECCD Owner
  facilitator  // Teacher / Educator
  parent       // Mother / Father / Primary Guardian
  caregiver    // Secondary Guardian / Nanny (fees strictly hidden)
}

enum SubscriptionTier {
  community    // Free / MoESD subsidized
  standard     // Standard private ECCD
  enterprise   // Multi-branch network
}

enum CentreStatus {
  provisioning
  active
  grace_period
  suspended
  archived
}

enum RoomType {
  toddlers
  nursery
  kg
}

enum RatingLevel {
  ap   // Achieved & progressing
  bl   // Beginning to learn
  nya  // Not yet
}

enum InvoiceStatus {
  draft
  issued
  partial
  paid
  overdue
}

enum PaymentMethod {
  mBoB
  mPay
  bank_transfer
  cash
}

model User {
  id              String           @id @default(uuid())
  name            String
  role            Role
  email           String?          @unique
  phone           String           @unique
  pinHash         String?
  passkeyId       String?
  createdAt       DateTime         @default(now())
  guardianLinks   ChildGuardian[]
  facilitatorLogs DailyCareLog[]   @relation("TeacherCareLogs")
  observations    EldsObservation[] @relation("TeacherObservations")
  confirmedObs    EldsObservation[] @relation("OwnerConfirmations")
  leaveRequests   LeaveRequest[]
  paymentReports  PaymentReport[]
}

model Child {
  id                  String           @id @default(uuid())
  code                String           @unique // e.g. WSH-24-018
  name                String
  room                RoomType
  dob                 DateTime
  gender              String
  photoConsentFeed    Boolean          @default(true)
  photoConsentSocial  Boolean          @default(true)
  allergies           String?
  medication          String?
  napRoutine          String?
  toiletStatus        String?
  motherTongue        String?
  doctorInfo          String?
  guardians           ChildGuardian[]
  careLogs            DailyCareLog[]
  observations        EldsObservation[]
  feePlans            ChildFeePlan[]
  invoices            Invoice[]
  moments             Moment[]
  pickupLogs          PickupLog[]
}

model ChildGuardian {
  id              String   @id @default(uuid())
  childId         String
  userId          String
  relation        String   // Mother, Father, Grandmother, Caregiver
  isPrimary       Boolean  @default(false)
  canViewFinance  Boolean  @default(true)
  canPickup       Boolean  @default(true)
  child           Child    @relation(fields: [childId], references: [id])
  user            User     @relation(fields: [userId], references: [id])
}

model DailyCareLog {
  id            String   @id @default(uuid())
  childId       String
  date          DateTime @default(now())
  meals         String   // e.g. "Ate all lunch"
  napMins       Int      @default(0)
  mood          String   // Cheerful, Energetic, Gentle
  toilet        String   // Independent, Needs Help
  teacherQuote  String?
  facilitatorId String
  child         Child    @relation(fields: [childId], references: [id])
  facilitator   User     @relation("TeacherCareLogs", fields: [facilitatorId], references: [id])
}

model EldsObservation {
  id             String      @id @default(uuid())
  childId        String
  window         String      // Feb-Mar, May-Jun, Aug-Sep, Oct-Nov
  domain         String      // Physical & motor, Social & emotional, etc.
  indicator      String
  rating         RatingLevel
  remark         String?
  source         String      @default("manual") // manual, voice, photo, cctv
  rawRef         String?
  facilitatorId  String
  confirmedById  String?
  isConfirmed    Boolean     @default(false)
  createdAt      DateTime    @default(now())
  confirmedAt    DateTime?
  child          Child       @relation(fields: [childId], references: [id])
  facilitator    User        @relation("TeacherObservations", fields: [facilitatorId], references: [id])
  confirmedBy    User?       @relation("OwnerConfirmations", fields: [confirmedById], references: [id])
}

model ChildFeePlan {
  id               String   @id @default(uuid())
  childId          String
  academicYear     Int      @default(2026)
  planType         String   // 1 (Annual), 2 (Termly), 3 (3-term), m (Monthly)
  isMidYear        Boolean  @default(false)
  catchUpAmt       Float?
  extraDiscountPct Float    @default(0)
  extraReason      String?
  hasExtendedTime  Boolean  @default(false)
  hasPottyTraining Boolean  @default(false)
  uniformItems     String[]
  isFinalised      Boolean  @default(false)
  child            Child    @relation(fields: [childId], references: [id])
}

model Invoice {
  id              String         @id @default(uuid())
  invoiceNo       String         @unique
  childId         String
  dueDate         DateTime
  status          InvoiceStatus  @default(issued)
  totalAmt        Float
  isAutoGenerated Boolean        @default(false)
  note            String?
  createdAt       DateTime       @default(now())
  child           Child          @relation(fields: [childId], references: [id])
  items           InvoiceItem[]
  payments        PaymentReport[]
}

model InvoiceItem {
  id          String   @id @default(uuid())
  invoiceId   String
  feeHead     String   // Tuition, Uniform, Stationery, Extended time, Potty, Misc
  description String
  amount      Float
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
}

model PaymentReport {
  id          String        @id @default(uuid())
  invoiceId   String
  parentId    String
  amount      Float
  method      PaymentMethod
  journalNo   String
  screenshot  String?
  isConfirmed Boolean       @default(false)
  createdAt   DateTime      @default(now())
  invoice     Invoice       @relation(fields: [invoiceId], references: [id])
  parent      User          @relation(fields: [parentId], references: [id])
}

model PickupLog {
  id          String   @id @default(uuid())
  childId     String
  pickupTime  DateTime @default(now())
  personName  String
  relation    String
  child       Child    @relation(fields: [childId], references: [id])
}

model LeaveRequest {
  id        String   @id @default(uuid())
  userId    String
  type      String   // Casual, Sick
  startDate DateTime
  endDate   DateTime
  reason    String
  status    String   @default("pending") // pending, approved, declined
  user      User     @relation(fields: [userId], references: [id])
}

model Moment {
  id          String   @id @default(uuid())
  childId     String
  caption     String
  mediaUrls   String[]
  likesCount  Int      @default(0)
  createdAt   DateTime @default(now())
  child       Child    @relation(fields: [childId], references: [id])
}
```

---

## 5. Master Cursor Implementation Guide

To construct the enterprise platform, reference this specification in Cursor Composer (`Ctrl + I` or `Cmd + I`).
