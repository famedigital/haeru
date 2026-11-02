import { z } from 'zod'

export const RatingLevelSchema = z.enum(['ap', 'bl', 'nya'])
export const PaymentMethodSchema = z.enum(['mBoB', 'mPay', 'bank_transfer', 'cash'])
export const MomentStatusSchema = z.enum([
  'pending_facilitator',
  'pending_director',
  'delivered',
])

/**
 * POST /api/observations/from-hermes
 * Field-aligned with docs/hermes-observation-schema.json
 */
export const HermesObservationIngestSchema = z
  .object({
    childId: z.string().min(1).optional(),
    childName: z.string().min(1),
    domain: z.string().min(1),
    trigger: z.string().min(1),
    strategy: z.string().min(1),
    milestone: z.string().min(1),
    confidence: z.string().min(1),
    source: z.enum(['voice', 'photo', 'cctv']),
    transcription: z.string().optional(),
    parentSafeTitle: z.string().optional(),
    parentSafeDesc: z.string().optional(),
    rawRef: z.string().optional(),
    mediaUrls: z.array(z.string().url()).optional(),
  })
  .strict()

/** POST /api/moments/:id/confirm */
export const ConfirmMomentSchema = z.object({
  confirmedById: z.string().min(1).optional(),
  /** facilitator = send to Director gate; owner = deliver to parent */
  role: z.enum(['facilitator', 'owner']).default('owner'),
})

/**
 * POST /api/media/photo-from-hermes
 * Telegram photo/video after Cloudinary upload (or with telegramFileUrl to upload).
 * Caption @tags fan out to one pending moment per child (same mediaUrls).
 */
export const HermesPhotoBatchSchema = z
  .object({
    caption: z.string().min(1),
    /** Explicit child ids when Hermes already resolved tags */
    childIds: z.array(z.string().min(1)).optional(),
    mediaUrls: z.array(z.string().url()).optional(),
    telegramFileUrl: z.string().url().optional(),
    rawRef: z.string().optional(),
    resourceType: z.enum(['image', 'video', 'auto']).optional(),
    domain: z.string().min(1).default('Approaches to Learning'),
    trigger: z.string().min(1).default('Photo / video classroom moment'),
    strategy: z.string().min(1).default('Documented via Telegram + caption tags'),
    milestone: z.string().min(1).optional(),
    confidence: z.string().min(1).default('Caption-tagged photo · awaiting Director confirm'),
    parentSafeTitle: z.string().optional(),
    parentSafeDesc: z.string().optional(),
    /** When true, auto facilitator-confirm → pending_director */
    queueForDirector: z.boolean().default(true),
  })
  .strict()
  .refine((v) => (v.mediaUrls && v.mediaUrls.length > 0) || Boolean(v.telegramFileUrl), {
    message: 'mediaUrls or telegramFileUrl required',
  })

/** POST /api/invoices/auto-run */
export const AutoInvoiceRunSchema = z.object({
  asOf: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  dryRun: z.boolean().default(false),
  leadDays: z.number().int().min(1).max(30).default(14),
})

/** POST /api/payments/report */
export const PaymentReportSchema = z.object({
  invoiceId: z.string().min(1),
  parentId: z.string().min(1),
  amount: z.number().positive(),
  method: PaymentMethodSchema,
  journalNo: z.string().min(3),
  screenshot: z.string().url().optional(),
})

export type HermesObservationIngest = z.infer<typeof HermesObservationIngestSchema>
export type MomentStatus = z.infer<typeof MomentStatusSchema>
export type AutoInvoiceRun = z.infer<typeof AutoInvoiceRunSchema>
export type PaymentReportInput = z.infer<typeof PaymentReportSchema>
export type ConfirmMomentInput = z.infer<typeof ConfirmMomentSchema>
export type HermesPhotoBatchInput = z.infer<typeof HermesPhotoBatchSchema>

export const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

export const CentrePatchSchema = z.object({
  name: z.string().min(1).optional(),
  place: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  bank: z.enum(['bob', 'bnb']).optional(),
  accountNo: z.string().optional(),
  payeeName: z.string().optional(),
  emvStatic: z.string().optional(),
})

export const CentreBankQrSchema = z.object({
  bank: z.enum(['bob', 'bnb']).default('bob'),
  accountNo: z.string().default(''),
  payeeName: z.string().min(1),
  emvStatic: z.string().optional(),
  /** Raw EMV from poster decode (client) */
  rawEmv: z.string().optional(),
})

export const StaffCreateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  role: z.enum(['facilitator', 'owner']).default('facilitator'),
  room: z.enum(['toddlers', 'nursery', 'kg']).optional(),
  password: z.string().min(4).default('staff123'),
})

export const AdmissionCompleteSchema = z.object({
  childName: z.string().min(1),
  childCode: z.string().min(3).optional(),
  room: z.enum(['toddlers', 'nursery', 'kg']),
  dob: z.string().min(4),
  gender: z.string().min(1).default('U'),
  photoConsentFeed: z.boolean().default(true),
  guardianName: z.string().min(1),
  guardianPhone: z.string().min(6),
  guardianEmail: z.string().email().optional(),
  relation: z.string().default('Parent'),
  parentPassword: z.string().min(4).default('parent123'),
})

export const EldsObservationCreateSchema = z.object({
  childId: z.string().min(1),
  window: z.string().default('Oct–Nov 2026'),
  domain: z.string().min(1),
  indicator: z.string().min(1),
  rating: RatingLevelSchema,
  remark: z.string().optional(),
  facilitatorId: z.string().optional(),
})

export type AuthLoginInput = z.infer<typeof AuthLoginSchema>
export type CentrePatchInput = z.infer<typeof CentrePatchSchema>
export type StaffCreateInput = z.infer<typeof StaffCreateSchema>
export type AdmissionCompleteInput = z.infer<typeof AdmissionCompleteSchema>
