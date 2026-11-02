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

const INVOICES = [
  ['WSH-2026-000147', 'October fees · Extended time', 1000, 'due'],
  ['WSH-2026-000121', 'September fees · Extended time', 1000, 'paid'],
  ['WSH-2026-000101', 'Tuition · installment 3 of 3', 19400, 'paid'],
]

type Centre = {
  name: string
  bank: string
  accountNo: string
  payeeName: string
  emvStatic: string
}

export function PaymentReporter() {
  const { showToast } = useAppStore()
  const [journal, setJournal] = useState('')
  const [method, setMethod] = useState<'mBoB' | 'mPay'>('mBoB')
  const [centre, setCentre] = useState<Centre | null>(null)
  const amount = 1000
  const invoiceNo = 'WSH-2026-000147'

  useEffect(() => {
    void apiFetch<Centre>('/centre', { auth: false }).then((r) => {
      if (r.ok && r.data) setCentre(r.data)
    })
  }, [])

  const bank = (centre?.bank as CentreBank) || 'bob'
  const payload = useMemo(() => {
    if (!centre?.emvStatic) return ''
    return buildDynamicEmv(centre.emvStatic, amount, invoiceNo.slice(0, 25))
  }, [centre?.emvStatic, amount, invoiceNo])

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle="Kinley · Academic year 2026" />

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="space-y-5">
          <GlassCard padding="lg" className="!border-amber-400/30 space-y-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Amount due</span>
            <div className="display text-3xl text-slate-900 dark:text-white">{formatNu(amount)}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              October fees · Extended time · due 15 Oct 2026 · {invoiceNo}
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
                if (!journal.trim()) {
                  showToast('Please enter your journal number')
                  return
                }
                const res = postPaymentReport({
                  invoiceId: invoiceNo,
                  parentId: 'parent-deki',
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

          <GlassCard padding="none">
            <div className="p-5 border-b border-white/10">
              <h2 className="text-lg text-slate-900 dark:text-white">Invoices & receipts</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map(([no, items, amt, st]) => (
                  <tr key={String(no)} className="border-t border-white/5">
                    <td className="px-5 py-3 text-slate-900 dark:text-white font-bold">{no}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{items}</td>
                    <td className="px-5 py-3 text-right">{formatNu(Number(amt))}</td>
                    <td className="px-5 py-3">
                      <GlassBadge tone={st === 'due' ? 'bl' : 'ap'}>{st}</GlassBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 text-center p-4">
              Director has not uploaded a centre bank QR yet
            </div>
          )}
          <p className="text-xs text-slate-600 dark:text-slate-300">
            <b className="text-slate-900 dark:text-white">
              {centre?.payeeName || "Wangchuk's School of Heroes"}
            </b>
            <br />
            {CENTRE_BANK_META[bank].name}
            <br />
            A/c {centre?.accountNo || '—'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dynamic QR embeds {formatNu(amount)} + invoice {invoiceNo}. Put Kinley&apos;s name in
            remarks if your bank app asks.
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
