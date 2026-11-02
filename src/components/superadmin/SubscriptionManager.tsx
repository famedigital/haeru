import { SAAS_INVOICES, formatNu } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

const PLANS = [
  {
    name: 'Community / NGO',
    price: 'Free',
    children: 'Up to 25',
    staff: 'Up to 4',
    voice: '60 mins/mo',
    invoicing: 'Basic',
    support: 'Standard',
  },
  {
    name: 'Standard Private',
    price: 'Nu. 4,500 / mo',
    children: 'Up to 60',
    staff: 'Up to 12',
    voice: '300 mins/mo',
    invoicing: 'Full + mBoB',
    support: 'Priority',
  },
  {
    name: 'Enterprise Network',
    price: 'Nu. 8,500 / mo',
    children: 'Unlimited',
    staff: 'Unlimited',
    voice: 'Unlimited',
    invoicing: 'Multi-branch',
    support: '24/7 Dedicated',
  },
]

export default function SubscriptionManager() {
  const { showToast } = useAppStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans & Licensing"
        subtitle="B2B SaaS tiers · Ngultrum platform invoicing"
        actions={
          <>
            <GlassButton onClick={() => showToast('Monthly SaaS invoices generated (mock)')}>
              Generate Monthly SaaS Invoices
            </GlassButton>
            <GlassButton variant="soft" onClick={() => showToast('Payment marked verified')}>
              Mark Payment Verified
            </GlassButton>
          </>
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <GlassCard
            key={p.name}
            padding="lg"
            className="space-y-3 hover:-translate-y-0.5 transition-transform"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h2>
            <p className="display text-2xl text-emerald-700 dark:text-emerald-300">{p.price}</p>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
              <li>Children: {p.children}</li>
              <li>Facilitators: {p.staff}</li>
              <li>Hermes Voice: {p.voice}</li>
              <li>Auto-invoicing: {p.invoicing}</li>
              <li>Support: {p.support}</li>
            </ul>
          </GlassCard>
        ))}
      </div>

      <GlassCard padding="none" className="overflow-x-auto">
        <div className="p-5 border-b border-slate-200/60 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Platform SaaS invoices
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
              <th className="px-5 py-3">Invoice</th>
              <th className="px-5 py-3">Centre</th>
              <th className="px-5 py-3">Month</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3">Method</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {SAAS_INVOICES.map((inv) => (
              <tr key={inv.id} className="border-t border-slate-200/60 dark:border-white/5">
                <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">{inv.id}</td>
                <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{inv.centreName}</td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{inv.billingMonth}</td>
                <td className="px-5 py-3 text-right text-slate-900 dark:text-white">
                  {formatNu(inv.amountNu)}
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                  {inv.method}
                  {inv.journal ? (
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                      {inv.journal}
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-3">
                  <GlassBadge
                    tone={inv.status === 'paid' ? 'ap' : inv.status === 'due' ? 'bl' : 'nya'}
                  >
                    {inv.status}
                  </GlassBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
