import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api/httpClient'
import { buildDynamicEmv } from '../../lib/payments/emv'
import { CENTRE_BANK_META, type CentreBank } from '../../lib/payments/centreBank'
import { readBankQrFile } from '../../lib/payments/readBankQr'
import { useAppStore } from '../../lib/store/appStore'
import { EmvQr } from '../pay/EmvQr'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

type Centre = {
  id: string
  name: string
  place: string
  bank: string
  accountNo: string
  payeeName: string
  emvStatic: string
  city: string
}

export function CentreBankSettings() {
  const { showToast, setScreen } = useAppStore()
  const [centre, setCentre] = useState<Centre | null>(null)
  const [bank, setBank] = useState<CentreBank>('bob')
  const [accountNo, setAccountNo] = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [emvStatic, setEmvStatic] = useState('')
  const [rawEmv, setRawEmv] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)
  const [sampleAmt, setSampleAmt] = useState(1000)

  useEffect(() => {
    void apiFetch<Centre>('/centre', { auth: false }).then((r) => {
      if (r.ok && r.data) {
        setCentre(r.data)
        setBank((r.data.bank as CentreBank) || 'bob')
        setAccountNo(r.data.accountNo || '')
        setPayeeName(r.data.payeeName || r.data.name)
        setEmvStatic(r.data.emvStatic || '')
      }
    })
  }, [])

  const dynamic = emvStatic
    ? buildDynamicEmv(emvStatic, sampleAmt, 'WSH-UAT-INV')
    : ''

  const onFile = async (file: File | null) => {
    if (!file) return
    const result = await readBankQrFile(file)
    if ('error' in result) {
      showToast(result.error ?? 'Could not read QR')
      return
    }
    setEmvStatic(result.emvStatic)
    setRawEmv(result.emvStatic)
    if (result.accountNo) setAccountNo(result.accountNo)
    if (result.payeeName) setPayeeName(result.payeeName)
    showToast('Bank QR adopted · amount stripped for static storage')
  }

  const save = async () => {
    setBusy(true)
    const r = await apiFetch<Centre>('/centre/bank-qr', {
      method: 'POST',
      body: JSON.stringify({
        bank,
        accountNo,
        payeeName,
        emvStatic,
        rawEmv,
      }),
    })
    setBusy(false)
    if (!r.ok || !r.data) {
      showToast(typeof r.error === 'string' ? r.error : 'Save failed')
      return
    }
    setCentre(r.data)
    setEmvStatic(r.data.emvStatic)
    setRawEmv(undefined)
    showToast('Centre bank & QR saved · persists in SQLite')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Bank & payment QR"
        subtitle={`${centre?.name ?? 'WSH'} · store static EMV, stamp Nu. at pay time`}
        actions={
          <GlassButton variant="ghost" onClick={() => setScreen('centres')}>
            ← Centres
          </GlassButton>
        }
      />

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard padding="lg" className="space-y-4">
          <h2 className="text-lg text-slate-900 dark:text-white">Centre receive account</h2>
          <label className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            Bank
            <select
              className="glass-input"
              value={bank}
              onChange={(e) => setBank(e.target.value as CentreBank)}
            >
              {Object.values(CENTRE_BANK_META).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.label})
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            Payee name
            <input
              className="glass-input"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            Account number
            <input
              className="glass-input"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            Upload SCAN &amp; PAY poster
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <GlassButton disabled={busy || !payeeName} onClick={() => void save()}>
            {busy ? 'Saving…' : 'Save bank & QR'}
          </GlassButton>
        </GlassCard>

        <GlassCard padding="lg" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg text-slate-900 dark:text-white">Preview</h2>
            <GlassBadge tone="ap">{CENTRE_BANK_META[bank].label}</GlassBadge>
          </div>
          <label className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            Sample amount (Nu.)
            <input
              type="number"
              className="glass-input"
              value={sampleAmt}
              onChange={(e) => setSampleAmt(Number(e.target.value) || 0)}
            />
          </label>
          <EmvQr payload={dynamic || emvStatic} size="lg" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {emvStatic
              ? 'Dynamic QR includes amount + invoice remark for parent scan.'
              : 'Upload a poster or enter account to generate a centre QR.'}
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
