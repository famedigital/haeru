# Bhutan ECCD Enterprise Platform — Superadmin Specification
**System:** Haeru Multi-Tenant SaaS Platform  
**Target:** Master Platform Operator, MoESD Technology Partner, Central SaaS Ops  
**Document Purpose:** Complete design-in-words specification for Cursor to implement the Superadmin persona, multi-tenant school provisioning, subscription engine, system telemetry, and governance.

---

## 1. Executive Overview & Persona Definition

### What is a Superadmin?
In Haeru, regular roles (`owner`, `facilitator`, `parent`, `caregiver`) are scoped strictly to a single ECCD centre (e.g. *Wangchuk's School of Heroes* in Babesa, Thimphu).

The **Superadmin** is the master platform operator and central governing authority. They manage:
1. **Multi-Tenancy**: Provisioning and managing every ECCD centre across Bhutan's 20 Dzongkhags.
2. **SaaS Licensing & Quotas**: Community (free/subsidized), Standard Private, and Enterprise Network tiers with child and staff caps.
3. **Owner Provisioning & Secure Impersonation**: Provisioning Centre Director credentials and safe read/troubleshoot impersonation with audit trails.
4. **National MoESD ELDS Curriculum Governance**: Managing standard developmental domains and generating aggregate, anonymized national readiness metrics for the Ministry of Education & Skills Development.
5. **AI Telemetry & Platform Health**: Monitoring the Hermes Voice AI pipeline, Telegram bot webhooks, EXIF scrub operations, and platform audit logs.

### The Immutable Boundary Rules
1. **Tenant Isolation**: Superadmin can view and configure all centres, but tenant data remains strictly partitioned in the database via `centreId` foreign keys.
2. **Child Privacy Integrity**: Even at the Superadmin level, individual child photos and parent reflection messages are never displayed on global aggregate dashboards. National analytics are 100% anonymized and aggregated.
3. **Audit-Logged Impersonation**: If a Superadmin "impersonates" an ECCD centre for support, a persistent glowing amber warning banner is fixed to the top of the screen: `"SUPPORT SESSION: Viewing as [Centre Name] — Reason logged. All write actions are recorded."`

---

## 2. Superadmin Navigation & Screen Architecture

The Superadmin uses a high-density, authoritative visual language ("Obsidian Command Glass") with Himalayan Gold and Teal accents.

### Navigation Hierarchy (`src/data/enterprise.ts` → `ROLE_CONFIGS.superadmin`)

| Group | Nav Item ID | Label | Icon | Badge / Status |
|---|---|---|---|---|
| **Platform** | `super_overview` | Global Pulse | `activity` | Live |
| **Centres** | `super_centres` | ECCD Directory | `building-2` | Total count |
| | `super_provision` | Provision New ECCD | `plus-circle` | Action |
| **SaaS & Billing**| `super_subscriptions`| Plans & Licensing | `credit-card` | Nu. MRR |
| **MoESD & Learning**| `super_elds` | ELDS Standards & Analytics | `sparkles` | 2019 MoESD |
| **Operations** | `super_telemetry` | Hermes AI & Pipelines | `server` | 99.9% health |
| | `super_audit` | Global Audit Log | `shield-alert` | Security |

---

## 3. Detailed Screen Specifications

### Screen 1: `super_overview` (Global Pulse Dashboard)
The master pulse of the entire ECCD network across Bhutan.

#### KPI Stat Grid (4-up layout):
1. **Total Active Centres**: e.g. `24` ECCD Centres across `6` Dzongkhags (Thimphu, Paro, Chhukha, Punakha, Bumthang, Wangdue).
2. **Total Children Enrolled**: e.g. `1,280` children active on Haeru.
3. **Platform Monthly SaaS Revenue**: e.g. `Nu. 142,000` MRR (SaaS license fees from private centres).
4. **Hermes AI Voice Notes Processed**: e.g. `4,892` voice minutes parsed into ELDS observations this month.

#### Visual Widgets:
- **Dzongkhag Distribution Map / Bar List**: Breakdown of centres by Dzongkhags:
  - Thimphu: 14 centres (680 children)
  - Paro: 4 centres (210 children)
  - Chhukha (Phuentsholing): 3 centres (180 children)
  - Punakha: 2 centres (120 children)
  - Bumthang: 1 centre (90 children)
- **Recent Platform Alerts**:
  - *Wangchuk's School of Heroes*: Approaching child quota (45 / 50 enrolled).
  - *Druk Little Gems*: Annual SaaS license renewal due in 7 days.
  - *Hermes AI Gateway*: 0 audio processing failures in the last 24h.
- **Quick Action Bar**:
  - `[+ Provision New ECCD]`
  - `[Broadcast Announcement to Centres]`
  - `[Export MoESD National Report]`

---

### Screen 2: `super_centres` (ECCD Multi-Tenant Directory)
The master list of all childcare centres registered on the platform.

#### Filter & Search Bar:
- Search by Centre Name, MoESD Registration Code, or Director Name.
- Filter by Dzongkhag (All 20 Dzongkhags: Thimphu, Paro, Chhukha, Haa, Punakha, etc.).
- Filter by Status: `Active`, `Provisioning`, `Suspended`, `Grace Period`.
- Filter by Plan Tier: `Community (Free)`, `Standard Private`, `Enterprise Network`.

#### Centre Table Columns:
1. **Centre Info**: Logo / Avatar, Centre Name (e.g. "Wangchuk's School of Heroes"), Subdomain (`wsh.haeru.bt`), MoESD Code (e.g. `ECCD-THI-2024-009`).
2. **Location**: Dzongkhag & Gewog (e.g. `Babesa, Thimphu`).
3. **Director / Owner**: Name, Phone, Email (e.g. `Choki Wangmo · +975-17123456`).
4. **Children / Capacity**: e.g. `45 / 50` with progress bar (amber if > 85%, red if at limit).
5. **Subscription Tier**: Badge with plan name and renewal date.
6. **Platform Status**: Badge (`Active` emerald, `Provisioning` amber, `Suspended` rose).
7. **Actions Menu**:
   - `[View Centre 360°]`
   - `[Impersonate Support Mode]`
   - `[Edit Quotas & Plan]`
   - `[Suspend / Re-activate]`

---

### Screen 3: `super_provision` (New ECCD Provisioning Wizard)
A streamlined 4-step modal or dedicated view to onboard a new ECCD centre:

- **Step 1: Centre Identity & Regulatory Details**:
  - Official Centre Name (English & optional Dzongkha).
  - MoESD ECCD Registration License Number (e.g. `MoESD/DSE/ECCD-2026/044`).
  - Subdomain slug (e.g. `kuengphen` → `kuengphen.haeru.bt`).
  - Dzongkhag (select from 20 Dzongkhags) & Gewog / Town.
  - Physical address and contact phone.
- **Step 2: Director / Admin Credentials**:
  - Director Full Name (e.g. "Karma Tshering").
  - Director Email & Bhutan Mobile Number (`+975-17...` / `+975-77...`).
  - Initial temporary password or "Send Magic Setup Link via SMS/Email" toggle.
- **Step 3: Subscription & Quota Limits**:
  - Plan Tier: Community (Nu. 0 / Free), Standard (Nu. 4,500/mo), Enterprise (Nu. 8,500/mo).
  - Max Enrolled Children Cap (e.g. 30, 50, 100, Unlimited).
  - Max Facilitator Accounts (e.g. 5, 10, 20).
  - Hermes Voice AI Minutes Quota (e.g. 300 mins/mo).
- **Step 4: Default Centre Setup**:
  - Pre-populate default MoESD standard rooms:
    - *Toddlers* (2–3 yrs, Cap: 14)
    - *Nursery* (3–4 yrs, Cap: 18)
    - *Kindergarten* (4–5 yrs, Cap: 20)
  - Pre-configure Bank of Bhutan (mBoB) / BNB (mPay) payment account fields.
  - `[Confirm & Provision Centre]` CTA button.

---

### Screen 4: `super_subscriptions` (Licensing & SaaS Billing Engine)
Manages the B2B SaaS revenue of the Haeru platform.

#### Plan Tier Matrix:
| Feature | Community / NGO | Standard Private | Enterprise Network |
|---|---|---|---|
| **Price** | Free (MoESD subsidized) | Nu. 4,500 / month | Nu. 8,500 / month |
| **Max Children** | Up to 25 | Up to 60 | Unlimited |
| **Facilitators** | Up to 4 | Up to 12 | Unlimited |
| **Hermes Voice AI** | 60 mins/month | 300 mins/month | Unlimited |
| **Auto-Invoicing** | Basic | Full (4-tier tuition + mBoB) | Multi-branch consolidated |
| **Support** | Standard | Priority WhatsApp/Email | 24/7 Dedicated Ops |

#### SaaS Invoicing Table:
- Lists monthly B2B platform invoices issued to ECCD owners.
- Columns: Invoice ID, Centre Name, Billing Month, Amount (Nu.), Payment Method (BoB Corporate Wire, RMA Gateway, Cheque), Status (`Paid`, `Due`, `Overdue`).
- Action: `[Generate Monthly SaaS Invoices]`, `[Mark Payment Verified]`.

---

### Screen 5: `super_elds` (MoESD Standards & National Analytics)

#### 1. MoESD ELDS 2019 Master Checklist:
- The 6 official domains are locked centrally so no centre can accidentally alter national curriculum standards:
  1. *Physical Development & Health* (Gross motor, fine motor, self-care).
  2. *Social & Emotional Development* (Interaction with peers, expressing feelings, empathy).
  3. *Language, Communication & Early Literacy* (Listening, speaking, pre-reading, Dzongkha vocabulary).
  4. *Approaches to Learning* (Curiosity, persistence, imagination).
  5. *Cognition & General Knowledge* (Math concepts, problem solving, world awareness).
  6. *Spiritual, Moral & Cultural Values* (Respect for elders, Bhutanese cultural traditions, Driglam Namzha basics).

#### 2. Anonymized National Readiness Analytics:
- Aggregate stats for Ministry reporting:
  - Overall Bhutan ECCD milestone achievement rate by domain.
  - Comparison of 4 observation windows (Feb–Mar, May–Jun, Aug–Sep, Oct–Nov).
  - Zero exposure of child names or personal photos — strictly demographic and educational progress counts.

---

### Screen 6: `super_telemetry` (Hermes AI Pipeline & System Health)

1. **Hermes Voice AI Pipeline Telemetry**:
   - Audio notes received from Telegram bot.
   - Whisper transcription queue latency (avg 2.8s).
   - Hermes JSON schema extraction success rate (e.g. 99.4%).
   - Audio storage quota utilization (R2 / S3 storage).
2. **Telegram Bot Gateways**:
   - Webhook status for active bots (Status: `Healthy`, Ping: `42ms`).
3. **Platform Broadcast Banner Engine**:
   - Superadmin can broadcast a system-wide banner to all logged-in Owners, Facilitators, and Parents.
   - Example: *"Scheduled server maintenance on Sunday from 2:00 AM to 4:00 AM BST. The app will be in read-only mode during this window."*
   - Type: `Info` (blue), `Warning` (amber), `Critical` (rose).

---

### Screen 7: `super_audit` (Global Audit & Security)

Tracks all sensitive platform activities:
- `timestamp`: UTC ISO timestamp.
- `actorEmail`: Superadmin or Director user email.
- `action`: e.g. `CENTRE_PROVISIONED`, `IMPERSONATION_STARTED`, `PLAN_UPGRADED`, `ACCOUNT_SUSPENDED`.
- `target`: Centre or User ID.
- `ipAddress` & `userAgent`.
- `reasonNotes`: Mandatory justification note entered by Superadmin.

---

## 4. Impersonation (Support Mode) Flow

When a Superadmin needs to troubleshoot a centre's issue:
1. Superadmin clicks `[Impersonate Support Mode]` on any centre in `super_centres`.
2. A prompt modal requires a **Mandatory Reason** (e.g. *"Assisting Director Choki with invoice proration discrepancy"*).
3. System logs the audit record: `IMPERSONATION_STARTED`.
4. App switches tenant context to that centre and sets role to `owner`.
5. A **persistent glowing amber bar** appears at the top of the viewport across all screens:
   ```tsx
   <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/95 text-slate-950 font-bold px-4 py-2 flex items-center justify-between shadow-lg text-xs tracking-wide">
     <div className="flex items-center gap-2">
       <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
       <span>SUPPORT SESSION: Viewing as <strong>Wangchuk's School of Heroes</strong> (Reason: {reason})</span>
     </div>
     <button onClick={exitSupportSession} className="px-3 py-1 bg-slate-950 text-white rounded-lg hover:bg-slate-800 text-xs font-semibold">
       Exit Support Session
     </button>
   </div>
   ```
6. Clicking `[Exit Support Session]` reverts role immediately back to `superadmin` and returns to `super_centres`.

---

## 5. Prisma Schema Extension (`backend/prisma/schema.prisma`)

```prisma
enum Role {
  superadmin    // Master platform operator
  owner         // Centre Director / ECCD Owner
  facilitator   // Teacher / Educator
  parent        // Mother / Father / Primary Guardian
  caregiver     // Secondary Guardian / Nanny (restricted fees)
}

enum SubscriptionTier {
  community     // Free / MoESD subsidized
  standard      // Standard private centre
  enterprise    // Multi-branch network
}

enum CentreStatus {
  provisioning
  active
  grace_period
  suspended
  archived
}

model Centre {
  id              String           @id @default(cuid())
  slug            String           @unique // e.g. "wsh", "kuengphen"
  name            String           // e.g. "Wangchuk's School of Heroes"
  dzongkhag       String           // e.g. "Thimphu"
  gewog           String           // e.g. "Babesa"
  moesdCode       String           @unique // e.g. "ECCD-THI-2024-009"
  status          CentreStatus     @default(active)
  tier            SubscriptionTier @default(standard)
  maxChildren     Int              @default(50)
  maxStaff        Int              @default(10)
  hermesVoiceMins Int              @default(300)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  users           User[]
  rooms           Room[]
  children        Child[]
  saasInvoices    SaasInvoice[]
}

model SaasInvoice {
  id          String   @id @default(cuid())
  centreId    String
  centre      Centre   @relation(fields: [centreId], references: [id])
  billingDate DateTime
  amountNu    Int      // Amount in Ngultrum
  status      String   // "paid", "due", "overdue"
  paidAt      DateTime?
  reference   String?  // Bank of Bhutan wire journal #
}

model PlatformAuditLog {
  id         String   @id @default(cuid())
  actorEmail String
  action     String   // e.g. "IMPERSONATION_STARTED", "CENTRE_PROVISIONED"
  targetId   String?
  reason     String?
  ipAddress  String?
  createdAt  DateTime @default(now())
}
```

---

## 6. Frontend File Architecture to Build

```
src/
├── components/
│   ├── superadmin/
│   │   ├── SuperadminDashboard.tsx    ← Main router for superadmin screens
│   │   ├── SuperOverview.tsx          ← Global Pulse & Dzongkhag map breakdown
│   │   ├── CentreDirectory.tsx        ← Multi-tenant school table & status filter
│   │   ├── ProvisionCentreModal.tsx   ← 4-step wizard to create new ECCD
│   │   ├── SubscriptionManager.tsx    ← SaaS tier matrix & B2B invoicing table
│   │   ├── MoesdEldsMaster.tsx        ← 2019 curriculum locks & national stats
│   │   ├── TelemetryOps.tsx           ← Hermes AI queue, webhook status, storage
│   │   ├── ImpersonationBanner.tsx    ← Persistent amber banner during support mode
│   │   └── GlobalAuditLog.tsx         ← Security trail & reason log
```

---

## 7. Quality Gates & Acceptance Criteria for Cursor

1. **Zero Bare `text-white`**: All superadmin views must respect dual-theme tokens (`text-slate-900 dark:text-white`).
2. **Zero 3D Rotation Tilt**: Tables and cards use soft elevation only (`hover:-translate-y-0.5`).
3. **No Mixed State**: Switching from `superadmin` into a centre via Impersonation must store the previous session in memory and restore cleanly upon exit.
4. **Data Isolation**: Each centre in mock state has its own independent `ChildRecord[]`, `InvoiceRow[]`, and `RoomInfo[]`.
5. **Build Clean**: `npm run build` must compile with zero errors and zero unused variable warnings.
