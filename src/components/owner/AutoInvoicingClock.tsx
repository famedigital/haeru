import { useState } from 'react'
import { postAutoInvoiceRun } from '../../lib/api/pulseApiServer'
import { formatNu } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

const CLOCK = [
  { label: '13 Oct', asOf: '2026-10-13', hint: 'Today' },
  { label: '1 Nov', asOf: '2026-11-01', hint: 'Invoices go out' },
  { label: '12 Nov', asOf: '2026-11-12', hint: 'Reminder' },
  { label: '15 Nov', asOf: '2026-11-15', hint: 'Due date' },
  { label: '22 Nov', asOf: '2026-11-22', hint: 'Overdue' },
]

export function AutoInvoicingClock() {
  const { showToast, setScreen } = useAppStore()
  const [clock, setClock] = useState(0)
  const [lastRun, setLastRun] = useState<ReturnType<typeof postAutoInvoiceRun> | null>(null)

  const run = (dryRun: boolean) => {
    const result = postAutoInvoiceRun({
      asOf: CLOCK[clock]!.asOf,
      dryRun,
      leadDays: 14,
    })
    setLastRun(result)
    if (result.ok) {
      showToast(
        dryRun
          ? `Dry run · ${result.data.created} invoices previewed`
          : `${result.data.created} invoices issued · parents notified`,
      )
    } else {
      showToast('Auto-invoice validation failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automatic invoicing"
        subtitle="Fee plans become invoices 14 days before due — tuition discounts never touch ancillary fees"
        actions={
          <GlassButton variant="ghost" onClick={() => setScreen('finance')}>
            ← Invoices
          </GlassButton>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['1', 'Fee plan finalised', 'Charges & due dates for the year'],
          ['2', 'Invoice created', '14 days before due (15th)'],
          ['3', 'Parents notified', 'Email + in-app'],
          ['4', 'Paid or reminded', 'Receipt · then overdue flag'],
        ].map(([n, t, s]) => (
          <GlassCard key={n} className="space-y-2" interactive>
            <span className="display text-2xl text-emerald-600 dark:text-emerald-300">{n}</span>
            <b className="text-[color:var(--text-main)] block text-sm">{t}</b>
            <span className="text-xs text-[color:var(--text-muted)]">{s}</span>
          </GlassCard>
        ))}
      </div>

      <GlassCard padding="lg" className="!bg-slate-900 !text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <b className="text-white">Mock clock</b>
            <p className="text-xs text-slate-400">Step through November invoicing</p>
          </div>
          <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-white/10">
            {CLOCK.map((c, i) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setClock(i)}
                className={`px-3 py-2 rounded-xl text-left active:scale-[0.985] transition ${
                  clock === i ? 'bg-white text-slate-900' : 'text-slate-200'
                }`}
              >
                <b className="text-xs block">{c.label}</b>
                <span className="text-[10px] opacity-70">{c.hint}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <GlassButton variant="ghost" onClick={() => run(true)}>
            Dry run
          </GlassButton>
          <GlassButton onClick={() => run(false)}>Create & send invoices</GlassButton>
        </div>
      </GlassCard>

      {lastRun?.ok && (
        <GlassCard padding="none">
          <div className="p-5 border-b border-[color:var(--table-border)] flex justify-between items-center">
            <h2 className="text-lg text-[color:var(--text-main)]">November batch</h2>
            <GlassBadge tone="ap">{lastRun.data.created} invoices</GlassBadge>
          </div>
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Child</th>
                <th>Due</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lastRun.data.invoices.map((inv) => (
                <tr key={inv.invoiceNo}>
                  <td className="font-bold">{inv.invoiceNo}</td>
                  <td>{inv.childId}</td>
                  <td>{inv.dueDate}</td>
                  <td className="text-right">{formatNu(inv.totalAmt)}</td>
                  <td>
                    <GlassBadge tone={inv.status === 'issued' ? 'ap' : 'bl'}>{inv.status}</GlassBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="p-4 text-xs text-[color:var(--text-muted)]">{lastRun.data.note}</p>
        </GlassCard>
      )}
    </div>
  )
}
