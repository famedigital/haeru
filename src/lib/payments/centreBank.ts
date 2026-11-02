import {
  buildStaticEmv,
  emvAccount,
  emvPayee,
  stampEmvPayee,
  toStaticEmv,
} from './emv'

export const CENTRE_BANKS = ['bob', 'bnb'] as const
export type CentreBank = (typeof CENTRE_BANKS)[number]

export const CENTRE_BANK_META: Record<
  CentreBank,
  { id: CentreBank; name: string; label: string }
> = {
  bob: { id: 'bob', name: 'Bank of Bhutan', label: 'mBoB' },
  bnb: { id: 'bnb', name: 'Bhutan National Bank', label: 'mPAY' },
}

const PRODUCT_PREFIX = /^(SB|CD|CR|CA|SA|OD|TD|CC)(\d{6,18})$/i

export function receiveAccountNo(raw: string): string {
  const t = raw.trim().replace(/[\s-]/g, '')
  const m = t.match(PRODUCT_PREFIX)
  return m ? m[2]! : t
}

export function parseCentreBank(raw: string | null | undefined): CentreBank {
  return raw === 'bnb' ? 'bnb' : 'bob'
}

export function buildCentreEmv(input: {
  accountNo: string
  name: string
  city?: string
}): string {
  const account = receiveAccountNo(input.accountNo)
  if (!account) return ''
  return buildStaticEmv({
    merchant: account.slice(0, 32),
    name: input.name.slice(0, 25) || 'Centre',
    city: (input.city || 'Thimphu').slice(0, 15),
  })
}

function lookLikeAccount(raw: string): boolean {
  const digits = receiveAccountNo(raw)
  return /^\d{6,12}$/.test(digits) || /^SB[0-9A-Z]{6,}$/i.test(raw)
}

export function adoptBankQr(raw: string): {
  emvStatic: string
  accountNo: string
  payeeName: string
} | null {
  const emvStatic = toStaticEmv(raw)
  if (!emvStatic) return null
  const merchant = emvAccount(emvStatic)
  const accountNo = lookLikeAccount(merchant) ? receiveAccountNo(merchant) : ''
  return {
    emvStatic,
    accountNo,
    payeeName: emvPayee(emvStatic),
  }
}

export function centreReceiveEmv(input: {
  emvStatic?: string
  accountNo: string
  payeeName: string
  centreName?: string
  city?: string
}): string {
  const payee = input.payeeName.trim() || input.centreName || 'Centre'
  const stored = toStaticEmv(input.emvStatic || '')
  if (stored) return stampEmvPayee(stored, input.payeeName.trim())
  return buildCentreEmv({
    accountNo: input.accountNo,
    name: payee,
    city: input.city,
  })
}
