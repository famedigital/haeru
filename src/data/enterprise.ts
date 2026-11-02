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
    enrolled: 12,
    here: 11,
  },
  nursery: {
    id: 'nursery',
    name: 'Nursery',
    band: '3–4 yrs',
    bg: '#fbe7bd',
    cap: 18,
    enrolled: 17,
    here: 15,
  },
  kg: {
    id: 'kg',
    name: 'Kindergarten',
    band: '4–5 yrs',
    bg: '#cfe6df',
    cap: 20,
    enrolled: 16,
    here: 14,
  },
}

export const CHILDREN: ChildRecord[] = [
  {
    id: 'c1',
    code: 'WSH-24-018',
    name: 'Kinley Wangchuk',
    room: 'kg',
    age: '4y 7m',
    guardian: 'Deki Choden',
    seed: 1,
    feeStatus: 'paid',
    feedConsent: true,
    socialConsent: true,
  },
  {
    id: 'c2',
    code: 'WSH-24-019',
    name: 'Tashi Wangchuk',
    room: 'toddlers',
    age: '2y 8m',
    guardian: 'Deki Choden',
    seed: 2,
    feeStatus: 'due',
    feedConsent: true,
    socialConsent: true,
  },
  {
    id: 'c3',
    code: 'WSH-24-020',
    name: 'Pema Dorji',
    room: 'nursery',
    age: '3y 9m',
    guardian: 'Tshering Pelden',
    seed: 3,
    feeStatus: 'paid',
    feedConsent: true,
    socialConsent: true,
  },
  {
    id: 'c4',
    code: 'WSH-24-021',
    name: 'Yeshi Lhamo',
    room: 'nursery',
    age: '3y 6m',
    guardian: 'Yangchen Lhamo',
    seed: 4,
    feeStatus: 'overdue',
    feedConsent: false,
    socialConsent: false,
  },
  {
    id: 'c5',
    code: 'WSH-24-022',
    name: 'Jigme Namgyel',
    room: 'nursery',
    age: '3y 11m',
    guardian: 'Pem Choki',
    seed: 5,
    feeStatus: 'paid',
    feedConsent: true,
    socialConsent: true,
  },
  {
    id: 'c6',
    code: 'WSH-24-023',
    name: 'Rinzin Dorji',
    room: 'kg',
    age: '5y 1m',
    guardian: 'Tshering Pelden',
    seed: 6,
    feeStatus: 'partial',
    feedConsent: true,
    socialConsent: true,
  },
  {
    id: 'c7',
    code: 'WSH-24-024',
    name: 'Sonam Choden',
    room: 'nursery',
    age: '3y 4m',
    guardian: 'Sangay Dema',
    seed: 7,
    feeStatus: 'paid',
    feedConsent: true,
    socialConsent: true,
  },
  {
    id: 'c8',
    code: 'WSH-24-025',
    name: 'Chimi Dema',
    room: 'toddlers',
    age: '2y 11m',
    guardian: 'Kezang Wangmo',
    seed: 8,
    feeStatus: 'due',
    feedConsent: true,
    socialConsent: true,
  },
]

export const PARENT_CHILD_ID = 'c1'

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

export const SAAS_INVOICES: SaasInvoiceRow[] = [
  {
    id: 'SAAS-2026-10-001',
    centreName: "Wangchuk's School of Heroes",
    billingMonth: 'Oct 2026',
    amountNu: 4500,
    method: 'BoB Corporate Wire',
    status: 'paid',
    journal: 'JRN-884201',
  },
  {
    id: 'SAAS-2026-10-002',
    centreName: 'Druk Little Gems ECCD',
    billingMonth: 'Oct 2026',
    amountNu: 4500,
    method: 'BoB Corporate Wire',
    status: 'due',
  },
  {
    id: 'SAAS-2026-10-003',
    centreName: 'Phuentsholing Child Care',
    billingMonth: 'Oct 2026',
    amountNu: 8500,
    method: 'RMA Gateway',
    status: 'paid',
    journal: 'RMA-12094',
  },
  {
    id: 'SAAS-2026-09-002',
    centreName: 'Druk Little Gems ECCD',
    billingMonth: 'Sep 2026',
    amountNu: 4500,
    method: 'Cheque',
    status: 'overdue',
  },
]

export const PLATFORM_AUDIT: PlatformAuditRow[] = [
  {
    id: 'aud-1',
    timestamp: '2026-11-02T08:14:00.000Z',
    actorEmail: 'ops@haeru.bt',
    action: 'IMPERSONATION_STARTED',
    target: 'ctr-wsh',
    ipAddress: '103.7.2.11',
    reasonNotes: 'Assisting Director with invoice proration',
  },
  {
    id: 'aud-2',
    timestamp: '2026-11-01T11:02:00.000Z',
    actorEmail: 'ops@haeru.bt',
    action: 'CENTRE_PROVISIONED',
    target: 'ctr-pvl',
    ipAddress: '103.7.2.11',
    reasonNotes: 'New MoESD community centre onboarding',
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-28T04:40:00.000Z',
    actorEmail: 'ops@haeru.bt',
    action: 'PLAN_UPGRADED',
    target: 'ctr-pcc',
    ipAddress: '103.7.2.11',
    reasonNotes: 'Enterprise multi-branch upgrade',
  },
]

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
          { id: 'child', label: 'Child profile', icon: 'smile' },
          { id: 'applications', label: 'Applications', icon: 'file', badge: 3 },
        ],
      },
      {
        label: 'People',
        items: [
          { id: 'people', label: 'Staff & leave', icon: 'briefcase', badge: 2 },
        ],
      },
      {
        label: 'Finance',
        items: [
          { id: 'finance', label: 'Invoices & payments', icon: 'receipt', badge: 4 },
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
    userTitle: 'Nursery facilitator',
    home: 'ftoday',
    nav: [
      { label: '', items: [{ id: 'ftoday', label: 'Today', icon: 'home' }] },
      {
        label: 'My room',
        items: [
          { id: 'children', label: 'My children', icon: 'smile' },
          { id: 'child', label: 'Child profile', icon: 'smile' },
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
        label: 'Kinley',
        items: [
          { id: 'child', label: 'Child profile', icon: 'smile' },
          { id: 'feed', label: 'Photos & updates', icon: 'image' },
          { id: 'pprogress', label: 'Progress', icon: 'sparkle' },
          { id: 'payments', label: 'Payments', icon: 'wallet', badge: 1 },
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
        label: 'Kinley',
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
        items: [{ id: 'super_overview', label: 'Global Pulse', icon: 'activity', badge: 'p' }],
      },
      {
        label: 'Centres',
        items: [
          { id: 'super_centres', label: 'ECCD Directory', icon: 'building', badge: 4 },
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

export const MOMENTS: MomentPost[] = [
  {
    id: 'm1',
    scene: 'garden',
    author: 'Kuenga Rinzin',
    room: 'Kindergarten',
    time: 'Yesterday',
    caption:
      'Our chilli seedlings finally sprouted. Everyone took a turn with the watering can 🌱',
    likes: 22,
    photoCount: 3,
    tags: 'Kinley',
  },
  {
    id: 'm2',
    scene: 'art',
    author: 'Sonam Yangden',
    room: 'Nursery',
    time: '2 hours ago',
    caption:
      'Rainbow hands today! We mixed primary colours and talked about which ones make green. 🎨',
    likes: 14,
    photoCount: 4,
    tags: 'a classmate + friends',
  },
]

export const LEAVE_REQUESTS: LeaveRequestRow[] = [
  {
    staff: 'Kuenga Rinzin',
    type: 'Casual',
    dates: '16–17 Oct · 2 days',
    reason: 'Family puja in Punakha',
    status: 'pending',
  },
  {
    staff: 'Dechen Pelmo',
    type: 'Sick',
    dates: '13 Oct · 1 day',
    reason: "Fever, doctor's note attached",
    status: 'pending',
  },
]

export const PAYMENT_REPORTS: PaymentReportRow[] = [
  {
    parent: 'Deki Choden',
    detail: 'Kinley · October fees',
    amount: 1000,
    method: 'mBoB',
    journal: 'JRN 482913',
  },
  {
    parent: 'Pem Choki',
    detail: 'Jigme · October fees',
    amount: 7000,
    method: 'BNB mPay',
    journal: 'JRN 117204',
  },
]

export const INVOICES: InvoiceRow[] = [
  {
    no: 'WSH-2026-000147',
    childName: 'Kinley Wangchuk',
    items: 'October fees · Extended time',
    amount: 1000,
    due: '15 Oct',
    status: 'due',
  },
  {
    no: 'WSH-2026-000131',
    childName: 'Dechen Yangzom',
    items: 'September fees · Monthly tuition',
    amount: 6000,
    due: '15 Sep',
    status: 'overdue',
  },
]

export const ELDS_REVIEW: EldsReviewRow[] = [
  {
    childId: 'c3',
    childName: 'Pema Dorji',
    indicator: 'Follows two-step instructions',
    rating: 'ap',
    remark: 'Did this during tidy-up without reminders',
    by: 'Sonam Y.',
  },
  {
    childId: 'c4',
    childName: 'Yeshi Lhamo',
    indicator: 'Takes turns with help',
    rating: 'bl',
    remark: 'Getting there with the slide',
    by: 'Sonam Y.',
  },
  {
    childId: 'c5',
    childName: 'Jigme Namgyel',
    indicator: 'Sorts objects by colour',
    rating: 'ap',
    remark: '',
    by: 'Sonam Y.',
  },
  {
    childId: 'c7',
    childName: 'Sonam Choden',
    indicator: 'Joins in familiar rhymes',
    rating: 'nya',
    remark: 'Watches closely; not joining yet',
    by: 'Sonam Y.',
  },
]

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
