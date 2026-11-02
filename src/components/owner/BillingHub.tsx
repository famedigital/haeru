import { formatNu } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

export function BillingHub() {
  const { showToast, setScreen } = useAppStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices & payments"
        subtitle="Live tuition ledger · demo invoice rows removed"
        actions={
          <>
            <GlassButton variant="ghost" onClick={() => setScreen('autoinv')}>
              Automatic invoicing
            </GlassButton>
            <GlassButton onClick={() => showToast('Invoice builder wires to DB next')}>
              New invoice
            </GlassButton>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Collected this term', formatNu(0), 'No live payments yet', 'ap'],
          ['Due', formatNu(0), 'No issued invoices', 'bl'],
          ['Overdue', formatNu(0), 'None', 'nya'],
          ['Payments to confirm', '0', 'Parent reports empty', 'violet'],
        ].map(([l, v, s, tone]) => (
          <GlassCard key={String(l)} className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">{l}</span>
            <div className="display text-2xl text-slate-900 dark:text-white">{v}</div>
            <GlassBadge tone={tone as 'ap' | 'bl' | 'nya' | 'violet'}>{s}</GlassBadge>
          </GlassCard>
        ))}
      </div>

      <GlassCard padding="lg" className="space-y-3">
        <h2 className="text-lg text-slate-900 dark:text-white">Payments reported by parents</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No parent payment reports yet. When a family reports an mBoB / mPay journal number, it will
          appear here for Director confirm.
        </p>
      </GlassCard>

      <GlassCard padding="lg" className="space-y-3">
        <h2 className="text-lg text-slate-900 dark:text-white">Invoices</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No invoices in the live database. Use Automatic invoicing once fee structures are configured
          for this centre.
        </p>
      </GlassCard>
    </div>
  )
}
