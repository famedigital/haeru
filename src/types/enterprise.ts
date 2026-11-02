export type Role =
  | 'superadmin'
  | 'owner'
  | 'facilitator'
  | 'parent'
  | 'caregiver'
  | 'signin'
  | 'landing'

export type CentreStatus = 'active' | 'provisioning' | 'grace_period' | 'suspended'

export type SubscriptionTier = 'community' | 'standard' | 'enterprise'

export interface CentreRecord {
  id: string
  slug: string
  name: string
  dzongkhag: string
  gewog: string
  moesdCode: string
  status: CentreStatus
  tier: SubscriptionTier
  maxChildren: number
  maxStaff: number
  enrolledCount: number
  directorName: string
  directorPhone: string
  directorEmail: string
  saasFeeNu: number
  renewalDate: string
}

export interface SaasInvoiceRow {
  id: string
  centreName: string
  billingMonth: string
  amountNu: number
  method: 'BoB Corporate Wire' | 'RMA Gateway' | 'Cheque'
  status: 'paid' | 'due' | 'overdue'
  journal?: string
}

export interface PlatformAuditRow {
  id: string
  timestamp: string
  actorEmail: string
  action: string
  target: string
  ipAddress: string
  reasonNotes: string
}

export type RoomId = 'toddlers' | 'nursery' | 'kg'

export type RatingLevel = 'ap' | 'bl' | 'nya'

export type FeeStatus = 'paid' | 'due' | 'overdue' | 'partial' | 'draft' | 'sched'

export type ObservationWindow = 'Feb–Mar' | 'May–Jun' | 'Aug–Sep' | 'Oct–Nov'

export interface RoomInfo {
  id: RoomId
  name: string
  band: string
  bg: string
  cap: number
  enrolled: number
  here: number
}

export interface ChildRecord {
  id: string
  code: string
  name: string
  room: RoomId
  age: string
  guardian: string
  seed: number
  feeStatus: FeeStatus
  feedConsent: boolean
  socialConsent: boolean
}

export interface NavItem {
  id: string
  label: string
  icon: string
  badge?: number | 'p'
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export interface RoleConfig {
  label: string
  userName: string
  userTitle: string
  home: string
  nav: NavGroup[]
}

export interface EldsDomainScore {
  domain: string
  value: number
}

export interface RadarSeries {
  window: ObservationWindow
  color: string
  fill?: string
  dash?: boolean
  dots?: boolean
  values: number[]
}

export interface CareLogSummary {
  meals: string
  nap: string
  mood: string
  toilet: string
  quote?: string
  teacher?: string
}

export interface MomentPost {
  id: string
  scene: string
  author: string
  room: string
  time: string
  caption: string
  likes: number
  photoCount: number
  /** Parent-facing tags — never name other children to this viewer */
  tags: string
  pending?: boolean
}

export interface LeaveRequestRow {
  staff: string
  type: 'Casual' | 'Sick'
  dates: string
  reason: string
  status: 'pending' | 'approved' | 'declined'
}

export interface InvoiceRow {
  no: string
  childName: string
  items: string
  amount: number
  due: string
  status: FeeStatus
}

export interface PaymentReportRow {
  parent: string
  detail: string
  amount: number
  method: 'mBoB' | 'BNB mPay' | 'Bank transfer'
  journal: string
}

export interface EldsReviewRow {
  childName: string
  childId: string
  indicator: string
  rating: RatingLevel
  remark: string
  by: string
}

export interface AdmissionStep {
  id: number
  label: string
}

export interface DailyCareChild {
  childId: string
  name: string
  arrival: string
  logged: boolean
}
