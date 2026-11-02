# Bhutan ECCD Enterprise Platform (WSH & Kidu Care Pulse)
## Master Enterprise Full-Stack Blueprint & Cursor AI Suite

This document unites the **WSH Enterprise Operating System** (`docs/wsh-website-mockup.html` — *Wangchuk's School of Heroes*) with the **Kidu Care Pulse AI Gateway** (`docs/architecture.md` — *Telegram & Hermes Voice AI*) into a comprehensive full-stack architecture with a **colorful, professional 3D Glassmorphism** design system.

---

## 1. Product Synthesis: The Unified ECCD Operating System

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BHUTAN ECCD ENTERPRISE PLATFORM (WSH)                           │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ OPERATIONAL CORE (WSH Mockup) │ - Owner / Director ERP (Admissions, Billing, Staff)    │
│                               │ - Facilitator Hub (Daily Care: Meals, Nap, Mood, Potty) │
│                               │ - Bhutan MoESD ELDS (2019) 6-Domain Assessment Engine   │
│                               │ - Automated Invoicing & mBoB / BNB mPay Reconciliation │
│                               │ - Caregiver Delegation (Granular Permission Scoping)   │
│                               │ - Privacy-First Media Staging & Split-Post Policy      │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ AGENTIC AI (Pulse Gateway)    │ - Telegram Staff Audio Bot (Voice Note Ingest)         │
│                               │ - Hermes AI Gateway (Speech-to-Text via Whisper)       │
│                               │ - Structured ELDS Classifier & Observation Extractor   │
│                               │ - Facilitator 1-Tap Confirmation to Child Profile      │
│                               │ - Parent-Safe Language Transformation (Zero Gossip)    │
│                               │ - Conversational Hermes Assistant for Teachers/Parents │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Personas & Screen Inventory (From `wsh-website-mockup.html`)

### 1. `owner` (Owner / Centre Director)
1. **`today`**: Executive command center (Attendance `40/45`, Overdue invoices `Nu. 25,400`, Leave requests, Admissions queue, Room occupancy bars, Needs Attention feed, Upcoming calendar).
2. **`children`**: Master directory (filter by room: Toddlers, Nursery, Kindergarten; search; media consent badge; fee status).
3. **`child`**: Child 360 profile with 5 sub-tabs (`Overview`, `Progress`, `Family`, `Fees`, `Photos`). Contains pickup logs, medical/allergy records, room assignment, and historical invoices.
4. **`applications`**: Admissions pipeline with a **9-Step Wizard** (`Child`, `Mother`, `Father`, `Guardian`, `Care & routine`, `Medical`, `Pickup people`, `Transfer`, `Documents`).
5. **`people`**: Staff management (B.Ed/Diploma qualifications, casual leave balances `14/20`, leave approval/rejection, owner-only salary table with Net Pay and PF/tax deductions).
6. **`families`**: Guardian and caregiver directory (Approving delegated caregivers like grandmothers with restricted view).
7. **`finance`**: Invoicing hub (Issued, overdue, automatic invoices, and parent mBoB/mPay payment confirmations with journal matching).
8. **`newinvoice`**: One-off invoice creator with live preview and searchable price list (Uniforms, Stationery, Excursions, Admissions, etc.).
9. **`autoinv`**: Automated invoicing engine driven by child fee plans with a **mock time-travel clock** (13 Oct, 1 Nov, 12 Nov, 15 Nov, 22 Nov) demonstrating auto-generation 14 days before due date, skipping potty training for trained kids, and automated receipt dispatch.
10. **`feestructure`**: Centre-wide annual tuition price matrix (1, 2, 3 installments with 15%, 10%, 3% discounts, and monthly Nu. 6,000/mo), ancillary price list, and lock rules.
11. **`feesetup`**: Child fee plan builder with exact calendar days catch-up proration formula for mid-year joiners, uniform item selector, and sibling/scholarship discount reasons.
12. **`reports`**: Financial charts (Income vs Expense bar charts in Nu., breakdown by fee head).
13. **`confirm`**: MoESD ELDS 2019 progress review gate (Director confirms facilitator ratings before parents can view them).
14. **`feed`**: Photo & media approval queue with storage quota meter (312 MB of 1 GB).
15. **`notifications`**: Real-time event notifications.
16. **`settings`**: Centre profile, academic calendar, photo visibility policies, and Bank of Bhutan payment instructions.
17. **`security`**: 6-digit PIN, Touch ID / WebAuthn passkey management, signed-in devices list, 15-minute idle lock.

### 2. `facilitator` (Teacher / Educator)
1. **`ftoday`**: Room dashboard with quick daily care logging (🍚 Meals, 😴 Nap, 😊 Mood, 🚽 Toilet) and observation window ring.
2. **`children` & `child`**: Room-scoped child profiles.
3. **`post`**: Staging photo library with EXIF removal, auto-tagging, and **Privacy Split Warning** (splits post if a child lacks feed consent).
4. **`record`**: ELDS 2019 progress checklist across the 6 domains (Gross Motor, Social, Language, etc.) with 3 ratings: *Achieved* (`ap`), *Beginning* (`bl`), *Not yet* (`nya`) + remarks.
5. **`voice-hub` (Pulse Extension)**: Telegram voice recording simulation and Hermes AI ELDS auto-mapping review.
6. **`messages`**: Direct real-time chat with parents.
7. **`leave`**: Casual and sick leave application tracker.
8. **`security`**: Quick Unlock PIN & Biometrics.

### 3. `parent` (Mother / Father)
1. **`phome`**: Child's daily reflection (Checked in time, meals, nap duration, mood, teacher quote), upcoming centre events, and fee alert banner.
2. **`feed`**: Child-scoped photo moments (other children are never named; only tagged child's name shown).
3. **`pprogress`**: 6-domain MoESD radar chart comparing observation windows (Feb-Mar, May-Jun, Aug-Sep, Oct-Nov), domain checklist progress, and bilingual home guidance ("Something to celebrate" & "Working on together").
4. **`payments`**: Amount due, invoice table, receipts download, Bank of Bhutan QR code, and "I've paid" reporting form (mBoB/mPay journal number + screenshot).
5. **`messages`**: Direct messaging with facilitator.
6. **`account`**: In-app feed and social media consent toggles, authorized caregiver delegation (adding grandmother).
7. **`security`**: PIN & Touch ID.

### 4. `caregiver` (Grandparent, Guardian, Nanny)
1. **`chome`**: Restricted daily care view (pickup authorization, medical allergy notes, daily meals/nap log).
2. **Strict Privacy Boundary**: Invoices, fee plans, payments, and financial data are **strictly hidden**.

---

## 3. 3D Glassmorphism Design System ("Modern Himalayan Glass")

### Palette Tokens
* **Canvas Dark**: `#090D16` / `#0F172A` with ambient animated chromatic spheres.
* **Himalayan Teal / Emerald** (`#10B981` / `#06B6D4` / `#3D7D71`): Growth, positive ratings (`ap`), confirmation actions, active tabs.
* **Bhutanese Saffron / Mustard** (`#F59E0B` / `#F4C87A`): Milestones, beginning ratings (`bl`), financial balances.
* **Lotus Violet / Magenta** (`#8B5CF6` / `#A84A38`): Caregiver badges, celebrations, Hermes AI assistant.
* **Coral Rose** (`#F43F5E` / `#F6D7CE`): 'Not yet' ratings (`nya`), sensory triggers, alerts.
* **Warm Cream Glass** (`rgba(255, 249, 242, 0.08)`): Soft paper-like translucency with high-contrast text.

### CSS Formula
```css
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
}
```

---

## 4. Cursor Composer Roadmap (Ready to Run in Cursor)

Run these sequential prompts in **Cursor Composer** (`Ctrl + I` or `Cmd + I` in Agent Mode):

### Prompt 1: 3D Glass Component Library & Foundation
```text
You are building the Enterprise version of Bhutan ECCD (Wangchuk's School of Heroes & Kidu Care Pulse).
Create the 3D Glass UI component library in `src/components/ui/` adhering to the "Modern Himalayan Glass" design system in .cursorrules:

1. `GlassCard.tsx`: 3D interactive mouse perspective tilt, specular top/left rim highlights, backdrop blur (24px), dark obsidian backing pills for high contrast.
2. `GlassButton.tsx`: Tactile, neon-accented, supporting variants (primary, soft, ghost, sm) with loading states.
3. `GlassBadge.tsx`: Glowing pills for ELDS ratings:
   - Achieved & progressing (`ap` - Teal)
   - Beginning to learn (`bl` - Saffron)
   - Not yet (`nya` - Coral Rose)
4. `GlassTabs.tsx` & `GlassChips.tsx`: Floating pill selectors for rooms, personas, and observation windows.
5. `RadarChart3D.tsx`: SVG 6-domain MoESD ELDS radar chart rendered on a floating translucent glass platter with multi-window comparison (Feb-Mar, May-Jun, Aug-Sep, Oct-Nov).
6. Verify WCAG AA compliance and zero TypeScript errors.
```

### Prompt 2: Database Schema & API Layer
```text
Implement the production database schema and API layer for Bhutan ECCD in `backend/`:

1. Create Prisma schema matching docs/wsh-website-mockup.html and docs/hermes-observation-schema.json:
   - User (id, name, role: owner | facilitator | parent | caregiver, phone, email, pinHash, passkeyId)
   - Child (id, code, name, room: toddlers | nursery | kg, dob, gender, photoConsentFeed, photoConsentSocial, allergyNotes, napNotes, toiletNotes)
   - GuardianRelationship (childId, guardianId, relationshipType: primary_parent | parent | authorized_caregiver, canViewFinance: boolean, canPickup: boolean)
   - DailyCareLog (childId, date, meals, napMins, mood, toiletStatus, teacherNote)
   - EldsObservation (childId, domain, indicator, ratingLevel: ap | bl | nya, remark, facilitatorId, confirmedByOwnerId, status: pending | confirmed)
   - FeePlan (childId, academicYear, planType: annual | two_term | three_term | monthly, extraDiscountPct, discountReason, isFinalised)
   - Invoice (id, invoiceNo, childId, billedToGuardianId, dueYearMonth, dueDate, status: draft | issued | partial | paid | overdue, totalAmt, isAutoGenerated)
   - InvoiceItem (invoiceId, feeHead, description, amount)
   - PaymentReport (invoiceId, parentId, method: mBoB | mPay | cash, journalNo, amount, screenshotUrl, status: pending | approved | rejected)
   - LeaveRequest (staffId, leaveType: casual | sick, startDate, endDate, reason, status: pending | approved | declined)
2. Build Zod validation schemas and core REST endpoints.
```

### Prompt 3: Owner / Director ERP Modules
```text
Implement the Owner/Director ERP screens from docs/wsh-website-mockup.html in `src/components/owner/`:

1. `TodayDashboard.tsx`: KPI cards (attendance 40/45, applications, overdue Nu. 25,400, leave), room occupancy bars, Needs Attention feed, Upcoming calendar.
2. `AdmissionsWizard.tsx`: Complete 9-step wizard (Child, Mother, Father, Guardian, Care & routine, Medical, Pickup people, Transfer, Documents).
3. `StaffAndPayroll.tsx`: Staff qualifications, casual leave balances (14/20), leave approval actions, and Owner-only salary table.
4. `AutomaticInvoicingEngine.tsx`: Time-travel mock clock (13 Oct, 1 Nov, 12 Nov, 15 Nov, 22 Nov), auto-generation 14 days prior to due date, skipping potty training fees for trained children, and batch approval.
5. `ChildFeePlanBuilder.tsx`: Exact calendar days catch-up proration formula for late joiners, uniform item toggles, sibling discount selector, and annual summary preview.
6. `ProgressReviewGate.tsx`: Review and 1-tap confirmation of facilitator ELDS ratings before parents can see them.
```

### Prompt 4: Facilitator Hub (Daily Care, Photos & Hermes Voice AI)
```text
Implement the Facilitator Hub under `src/components/facilitator/`:

1. `DailyCareLogger.tsx`: Fast room-wide logging of Meals (🍚), Nap (😴), Mood (😊), and Toilet (🚽).
2. `PhotoStagingLibrary.tsx`: Image upload with automatic EXIF/location data stripping, tagging, and Split-Post warning when a child lacks feed consent.
3. `RecordProgressELDS.tsx`: 6-domain ELDS checklist with 3-level rating buttons (`ap`, `bl`, `nya`), remarks input, and submission to the Director's review gate.
4. `VoiceTelemetryHub.tsx`: Telegram voice note simulation and Hermes AI extraction preview matching docs/hermes-observation-schema.json.
5. `FacilitatorMessages.tsx`: Real-time chat with parents.
```

### Prompt 5: Parent Portal & Caregiver Delegation
```text
Implement the Parent and Caregiver Portals under `src/components/parent/` and `src/components/caregiver/`:

1. `ParentHome.tsx`: Daily reflection card, meal/nap/mood indicators, teacher quote, and fee status banner.
2. `ChildMomentsFeed.tsx`: Child-scoped photo feed (strictly hiding other children's names).
3. `ChildProgressView.tsx`: Multi-window ELDS radar chart, domain progress bars, and bilingual celebration & home advice tips.
4. `PaymentsAndMBoB.tsx`: Invoices list, receipts download, Bank of Bhutan QR code, and "I've paid" reporting form (mBoB/mPay journal number).
5. `CaregiverDelegation.tsx`: Add authorized caregivers (grandmothers) with toggleable permissions.
6. `CaregiverHome.tsx`: Restricted view for caregivers with daily care and pickup details, strictly omitting fee and financial data.
7. `ParentHermesAssistant.tsx`: Conversational Q&A chatbot grounded in the child's daily profile.
```

### Prompt 6: Quick Unlock & Biometrics
```text
Implement Quick Unlock in `src/components/auth/`:

1. `QuickUnlockKeypad.tsx`: 6-digit tactile PIN keypad with masked dots.
2. `WebAuthnPasskey.tsx`: Biometric Touch ID / Face ID passkey unlock button.
3. `IdleLockTimer.tsx`: 15-minute idle timeout for Owner/Director security.
```
