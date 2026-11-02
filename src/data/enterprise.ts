import type {
  CentreRecord,
  ChildRecord,
  EldsReviewRow,
  InvoiceRow,
  LeaveRequestRow,
  MomentPost,
  PaymentReportRow,
  PlatformAuditRow,
  Role,
  RoleConfig,
  RoomInfo,
  SaasInvoiceRow,
} from '../types/enterprise'

export const CENTRE_NAME = "Wangchuk's School of Heroes"
export const CENTRE_PLACE = 'Rigpai Ling, Babesa, Thimphu'

export const ROOMS: Record<string, RoomInfo> = {
  toddlers: {
    id: 'toddlers',
    name: 'Toddlers',
    band: '2–3 yrs',
    bg: '#f6d7ce',
    cap: 14,
    enrolled: 0,
    here: 0,
  },
  nursery: {
    id: 'nursery',
    name: 'Nursery',
    band: '3–4 yrs',
    bg: '#fbe7bd',
    cap: 18,
    enrolled: 0,
    here: 0,
  },
  kg: {
    id: 'kg',
    name: 'Kindergarten',
    band: '4–5 yrs',
    bg: '#cfe6df',
    cap: 20,
    enrolled: 0,
    here: 0,
  },
}

/** @deprecated Live children come from /api/children — kept empty so UI never falls back to demos. */
export const CHILDREN: ChildRecord[] = []

/** @deprecated Use session childIds from auth — never hardcode a demo id. */
export const PARENT_CHILD_ID = ''

export const CENTRES: CentreRecord[] = [
  {
    id: 'ctr-wsh',
    slug: 'wsh',
    name: "Wangchuk's School of Heroes",
    dzongkhag: 'Thimphu',
    gewog: 'Babesa',
    moesdCode: 'ECCD-THI-2024-009',
    status: 'active',
    tier: 'standard',
    maxChildren: 50,
    maxStaff: 12,
    enrolledCount: 45,
    directorName: 'Karma Dechen',
    directorPhone: '+975-17123456',
    directorEmail: 'owner@wsh.bt',
    saasFeeNu: 4500,
    renewalDate: '2026-11-09',
  },
  {
    id: 'ctr-dlg',
    slug: 'druk-gems',
    name: 'Druk Little Gems ECCD',
    dzongkhag: 'Paro',
    gewog: 'Bondey',
    moesdCode: 'ECCD-PAR-2023-014',
    status: 'active',
    tier: 'standard',
    maxChildren: 40,
    maxStaff: 10,
    enrolledCount: 32,
    directorName: 'Pema Choden',
    directorPhone: '+975-17654321',
    directorEmail: 'director@drukgems.bt',
    saasFeeNu: 4500,
    renewalDate: '2026-11-09',
  },
  {
    id: 'ctr-pcc',
    slug: 'plling-care',
    name: 'Phuentsholing Child Care',
    dzongkhag: 'Chhukha',
    gewog: 'Phuentsholing',
    moesdCode: 'ECCD-CHU-2025-002',
    status: 'active',
    tier: 'enterprise',
    maxChildren: 100,
    maxStaff: 24,
    enrolledCount: 78,
    directorName: 'Kinley Dorji',
    directorPhone: '+975-77112233',
    directorEmail: 'admin@pllingcare.bt',
    saasFeeNu: 8500,
    renewalDate: '2027-02-01',
  },
  {
    id: 'ctr-pvl',
    slug: 'punakha-valley',
    name: 'Punakha Valley Learners',
    dzongkhag: 'Punakha',
    gewog: 'Khuruthang',
    moesdCode: 'ECCD-PUN-2024-031',
    status: 'provisioning',
    tier: 'community',
    maxChildren: 25,
    maxStaff: 4,
    enrolledCount: 0,
    directorName: 'Sonam Lhamo',
    directorPhone: '+975-17998877',
    directorEmail: 'setup@punakhavalley.bt',
    saasFeeNu: 0,
    renewalDate: '2027-01-15',
  },
]

export const SAAS_INVOICES: SaasInvoiceRow[] = []

export const PLATFORM_AUDIT: PlatformAuditRow[] = []

export const DZONGKHAGS = [
  'Thimphu',
  'Paro',
  'Chhukha',
  'Haa',
  'Punakha',
  'Wangdue',
  'Bumthang',
  'Trongsa',
  'Gasa',
  'Dagana',
  'Tsirang',
  'Sarpang',
  'Samtse',
  'Samdrup Jongkhar',
  'Pemagatshel',
  'Trashigang',
  'Mongar',
  'Lhuentse',
  'Trashiyangtse',
  'Zhemgang',
] as const

export const ROLE_CONFIGS: Record<Exclude<Role, 'signin' | 'landing'>, RoleConfig> = {
  owner: {
    label: 'Owner / Director',
    userName: 'Karma Dechen',
    userTitle: 'Owner',
    home: 'centres',
    nav: [
      { label: '', items: [{ id: 'centres', label: 'Centres', icon: 'home' }] },
      {
        label: 'Operations',
        items: [
          { id: 'today', label: 'Today', icon: 'home' },
          { id: 'settings', label: 'Bank & QR', icon: 'wallet' },
        ],
      },
      {
        label: 'Children',
        items: [
          { id: 'children', label: 'Children', icon: 'smile' },
          { id: 'applications', label: 'Applications', icon: 'file' },
        ],
      },
      {
        label: 'People',
        items: [{ id: 'people', label: 'Staff & leave', icon: 'briefcase' }],
      },
      {
        label: 'Finance',
        items: [
          { id: 'finance', label: 'Invoices & payments', icon: 'receipt' },
          { id: 'autoinv', label: 'Automatic invoicing', icon: 'repeat' },
        ],
      },
      {
        label: 'Learning',
        items: [
          { id: 'confirm', label: 'Progress review', icon: 'sparkle' },
          { id: 'feed', label: 'Center feed', icon: 'image' },
        ],
      },
    ],
  },
  facilitator: {
    label: 'Facilitator',
    userName: 'Kuenzang Tshomo',
    userTitle: 'Kindergarten facilitator',
    home: 'ftoday',
    nav: [
      { label: '', items: [{ id: 'ftoday', label: 'Today', icon: 'home' }] },
      {
        label: 'My room',
        items: [
          { id: 'children', label: 'My children', icon: 'smile' },
          { id: 'post', label: 'Telegram photos', icon: 'camera' },
          { id: 'feed', label: 'Classroom feed', icon: 'image' },
          { id: 'record', label: 'Record progress', icon: 'sparkle' },
          { id: 'voice-hub', label: 'Telegram audio AI', icon: 'mic' },
        ],
      },
    ],
  },
  parent: {
    label: 'Parent',
    userName: 'Deki Choden',
    userTitle: 'Parent',
    home: 'phome',
    nav: [
      { label: '', items: [{ id: 'phome', label: 'Home', icon: 'home' }] },
      {
        label: 'My child',
        items: [
          { id: 'child', label: 'Child profile', icon: 'smile' },
          { id: 'feed', label: 'Photos & updates', icon: 'image' },
          { id: 'pprogress', label: 'Progress', icon: 'sparkle' },
          { id: 'payments', label: 'Payments', icon: 'wallet' },
        ],
      },
    ],
  },
  caregiver: {
    label: 'Caregiver',
    userName: 'Dawa Zam',
    userTitle: 'Caregiver · Grandmother',
    home: 'chome',
    nav: [
      { label: '', items: [{ id: 'chome', label: 'Home', icon: 'home' }] },
      {
        label: 'My child',
        items: [
          { id: 'child', label: 'Child profile', icon: 'smile' },
          { id: 'feed', label: 'Photos & updates', icon: 'image' },
          { id: 'pprogress', label: 'Progress', icon: 'sparkle' },
        ],
      },
    ],
  },
  superadmin: {
    label: 'Superadmin',
    userName: 'Platform Ops',
    userTitle: 'Haeru · Master Operator',
    home: 'super_overview',
    nav: [
      {
        label: 'Platform',
        items: [{ id: 'super_overview', label: 'Global Pulse', icon: 'activity' }],
      },
      {
        label: 'Centres',
        items: [
          { id: 'super_centres', label: 'ECCD Directory', icon: 'building' },
          { id: 'super_provision', label: 'Provision New', icon: 'plus' },
        ],
      },
      {
        label: 'SaaS & Billing',
        items: [{ id: 'super_subscriptions', label: 'Plans & Invoicing', icon: 'credit-card' }],
      },
      {
        label: 'MoESD & Learning',
        items: [{ id: 'super_elds', label: 'Curriculum Standards', icon: 'sparkle' }],
      },
      {
        label: 'Operations',
        items: [
          { id: 'super_telemetry', label: 'Hermes AI & Pipelines', icon: 'server' },
          { id: 'super_audit', label: 'Global Audit Log', icon: 'shield-alert' },
        ],
      },
    ],
  },
}

export const MOMENTS: MomentPost[] = []

export const LEAVE_REQUESTS: LeaveRequestRow[] = []

export const PAYMENT_REPORTS: PaymentReportRow[] = []

export const INVOICES: InvoiceRow[] = []

export const ELDS_REVIEW: EldsReviewRow[] = []

export const ADMISSION_STEPS = [
  'Child',
  'Mother',
  'Father',
  'Guardian',
  'Care & routine',
  'Medical',
  'Pickup people',
  'Transfer',
  'Documents',
] as const

export function formatNu(v: number): string {
  return (
    'Nu. ' +
    v.toLocaleString('en-IN', {
      minimumFractionDigits: v % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    })
  )
}

export function childFirstName(name: string): string {
  return name.split(' ')[0] ?? name
}

/** Anonymize other children in tags for a specific viewer child */
export function parentSafeTags(tags: string, viewerChildFirst: string): string {
  if (tags.toLowerCase().includes(viewerChildFirst.toLowerCase())) {
    return viewerChildFirst
  }
  return 'a classmate'
}
