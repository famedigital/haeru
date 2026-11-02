import { INVOICES, PAYMENT_REPORTS, formatNu } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard, GlassChips } from '../ui'
import { PageHeader } from '../shared/PageHeader'
import { useState } from 'react'

export function BillingHub() {
  const { showToast, setScreen } = useAppStore()
  const [chip, setChip] = useState(0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices & payments"
        subtitle="Academic year 2026 · discounts apply to tuition only"
        actions={
          <>
            <GlassButton variant="ghost" onClick={() => setScreen('autoinv')}>
              Automatic invoicing
            </GlassButton>
            <GlassButton onClick={() => showToast('One-off invoice builder')}>New invoice</GlassButton>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Collected this term', formatNu(184500), '82% of billed', 'ap'],
          ['Due 15 Oct', formatNu(64000), '14 invoices', 'bl'],
          ['Overdue', formatNu(25400), '2 families', 'nya'],
          ['Payments to confirm', '3', 'Reported by parents', 'violet'],
        ].map(([l, v, s, tone]) => (
          <GlassCard key={String(l)} className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">{l}</span>
            <div className="display text-2xl text-slate-900 dark:text-white">{v}</div>
            <GlassBadge tone={tone as 'ap' | 'bl' | 'nya' | 'violet'}>{s}</GlassBadge>
          </GlassCard>
        ))}
      </div>

      <GlassCard padding="lg" className="space-y-4">
        <div>
          <h2 className="text-lg text-slate-900 dark:text-white">Payments reported by parents</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Match mBoB / BNB mPay journal numbers, then confirm</p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {PAYMENT_REPORTS.map((p) => (
            <GlassCard key={p.journal} padding="sm" className="space-y-3">
              <div>
                <b className="text-slate-900 dark:text-white text-lg">{formatNu(p.amount)}</b>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {p.parent} · {p.detail}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {p.method} · {p.journal}
                </div>
              </div>
              <div className="flex gap-2">
                <GlassButton
                  variant="ghost"
                  className="!text-xs !py-1.5"
                  onClick={() => showToast('Parent notified with your reason')}
                >
                  Reject
                </GlassButton>
                <GlassButton
                  variant="sm"
                  onClick={() => showToast('Payment confirmed · receipt emailed')}
                >
                  Confirm
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      <GlassCard padding="none">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg text-slate-900 dark:text-white">Invoices</h2>
          <GlassChips
            items={['All', 'Draft', 'Issued', 'Partially paid', 'Overdue', 'Paid']}
            value={chip}
            onChange={setChip}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Child</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.no} className="border-t border-white/5">
                  <td className="px-5 py-3 text-slate-900 dark:text-white font-bold">{inv.no}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{inv.childName}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{inv.items}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{inv.due}</td>
                  <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">{formatNu(inv.amount)}</td>
                  <td className="px-5 py-3">
                    <GlassBadge
                      tone={
                        inv.status === 'overdue'
                          ? 'nya'
                          : inv.status === 'due'
                            ? 'bl'
                            : 'ap'
                      }
                    >
                      {inv.status}
                    </GlassBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
