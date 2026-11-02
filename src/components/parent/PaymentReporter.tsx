import { useEffect, useMemo, useState } from 'react'
import { formatNu } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import { postPaymentReport } from '../../lib/api/pulseApiServer'
import { buildDynamicEmv } from '../../lib/payments/emv'
import { CENTRE_BANK_META, type CentreBank } from '../../lib/payments/centreBank'
import { useAppStore } from '../../lib/store/appStore'
import { EmvQr } from '../pay/EmvQr'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

type Centre = {
  name: string
  bank: string
  accountNo: string
  payeeName: string
  emvStatic: string
}

export function PaymentReporter() {
  const { showToast, selectedChildId } = useAppStore()
  const [journal, setJournal] = useState('')
  const [method, setMethod] = useState<'mBoB' | 'mPay'>('mBoB')
  const [centre, setCentre] = useState<Centre | null>(null)
  const [childName, setChildName] = useState('Child')
  const amount = 0

  useEffect(() => {
    void apiFetch<Centre>('/centre', { auth: false }).then((r) => {
      if (r.ok && r.data) setCentre(r.data)
    })
  }, [])

  useEffect(() => {
    if (!selectedChildId) return
    void apiFetch<{ name?: string }>(`/children/${encodeURIComponent(selectedChildId)}`).then(
      (r) => {
        if (r.ok && r.data?.name) setChildName(r.data.name)
      },
    )
  }, [selectedChildId])

  const bank = (centre?.bank as CentreBank) || 'bob'
  const payload = useMemo(() => {
    if (!centre?.emvStatic || amount <= 0) return ''
    return buildDynamicEmv(centre.emvStatic, amount, `haeru-${selectedChildId.slice(0, 8)}`)
  }, [centre?.emvStatic, amount, selectedChildId])

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle={`${childName} · live fee ledger`} />

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="space-y-5">
          <GlassCard padding="lg" className="!border-amber-400/30 space-y-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Amount due</span>
            <div className="display text-3xl text-slate-900 dark:text-white">{formatNu(amount)}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No open invoices for this child yet. When the centre issues fees, the amount and QR
              appear here.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <label className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 flex flex-col">
                Method
                <select
                  className="glass-input"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as 'mBoB' | 'mPay')}
                >
                  <option value="mBoB">Bank of Bhutan · mBoB</option>
                  <option value="mPay">BNB · mPay</option>
                </select>
              </label>
              <label className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 flex flex-col">
                Journal / reference no.
                <input
                  className="glass-input"
                  placeholder="e.g. JRN 482913"
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                />
              </label>
            </div>
            <GlassButton
              onClick={() => {
                if (amount <= 0) {
                  showToast('No invoice due right now')
                  return
                }
                if (!journal.trim()) {
                  showToast('Please enter your journal number')
                  return
                }
                const res = postPaymentReport({
                  invoiceId: `pending-${selectedChildId}`,
                  parentId: 'parent',
                  amount,
                  method,
                  journalNo: journal.trim(),
                })
                showToast(
                  res.ok
                    ? `Payment reported via ${method} · awaiting Director confirm`
                    : 'Payment report failed validation',
                )
              }}
            >
              I&apos;ve paid — report payment
            </GlassButton>
          </GlassCard>

          <GlassCard padding="lg">
            <h2 className="text-lg text-slate-900 dark:text-white">Invoices & receipts</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              No invoices yet for {childName}. Dummy fee rows have been removed.
            </p>
          </GlassCard>
        </div>

        <GlassCard padding="lg" className="space-y-3 h-fit">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg text-slate-900 dark:text-white">Scan to pay</h2>
            <GlassBadge tone="ap">{CENTRE_BANK_META[bank].label}</GlassBadge>
          </div>
          {payload ? (
            <EmvQr payload={payload} size="lg" />
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              QR appears when there is an amount due and the centre bank EMV is configured.
            </p>
          )}
          {centre ? (
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div>{centre.payeeName || centre.name}</div>
              <div>
                {CENTRE_BANK_META[bank].label} · {centre.accountNo || 'Account pending'}
              </div>
            </div>
          ) : null}
        </GlassCard>
      </div>
    </div>
  )
}
