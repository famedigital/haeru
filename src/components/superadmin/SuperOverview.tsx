import { CENTRES, formatNu } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

const DZONG_DIST = [
  { name: 'Thimphu', centres: 14, children: 680 },
  { name: 'Paro', centres: 4, children: 210 },
  { name: 'Chhukha', centres: 3, children: 180 },
  { name: 'Punakha', centres: 2, children: 120 },
  { name: 'Bumthang', centres: 1, children: 90 },
]

const ALERTS = [
  {
    centre: "Wangchuk's School of Heroes",
    text: 'Approaching child quota (45 / 50 enrolled).',
    tone: 'bl' as const,
  },
  {
    centre: 'Druk Little Gems ECCD',
    text: 'Annual SaaS license renewal due in 7 days.',
    tone: 'nya' as const,
  },
  {
    centre: 'Hermes AI Gateway',
    text: '0 audio processing failures in the last 24h.',
    tone: 'ap' as const,
  },
]

export default function SuperOverview() {
  const { setScreen } = useAppStore()
  const active = CENTRES.filter((c) => c.status === 'active').length
  const children = CENTRES.reduce((n, c) => n + c.enrolledCount, 0)
  const mrr = CENTRES.reduce((n, c) => n + c.saasFeeNu, 0)

  const kpis = [
    { label: 'Active Centres', value: String(active), sub: `of ${CENTRES.length} on platform` },
    { label: 'Total Children', value: children.toLocaleString('en-IN'), sub: 'Network enrolled' },
    { label: 'SaaS MRR', value: formatNu(mrr), sub: 'Private centre licenses' },
    { label: 'Hermes AI Minutes', value: '4,892', sub: 'Parsed this month' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Pulse"
        subtitle="Haeru multi-tenant network · Bhutan ECCD"
        actions={
          <>
            <GlassButton onClick={() => setScreen('super_provision')}>+ Provision New ECCD</GlassButton>
            <GlassButton variant="soft" onClick={() => setScreen('super_telemetry')}>
              Broadcast Announcement
            </GlassButton>
            <GlassButton variant="ghost" onClick={() => setScreen('super_elds')}>
              Export MoESD Report
            </GlassButton>
          </>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <GlassCard key={k.label} className="hover:-translate-y-0.5 transition-transform">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {k.label}
              </span>
              <span className="display text-3xl font-bold text-slate-900 dark:text-white leading-none">
                {k.value}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{k.sub}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard padding="lg" className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dzongkhag distribution</h2>
          <ul className="space-y-3">
            {DZONG_DIST.map((d) => (
              <li key={d.name} className="flex items-center gap-3">
                <span className="w-24 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {d.name}
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500/80"
                    style={{ width: `${(d.centres / 14) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {d.centres} · {d.children} children
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Aggregate counts only — no child names or photos on this surface.
          </p>
        </GlassCard>

        <GlassCard padding="lg" className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Platform alerts</h2>
          <ul className="space-y-3">
            {ALERTS.map((a) => (
              <li
                key={a.centre}
                className="rounded-xl border border-slate-200/70 dark:border-white/10 p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <b className="text-sm text-slate-900 dark:text-white">{a.centre}</b>
                  <GlassBadge tone={a.tone}>Alert</GlassBadge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{a.text}</p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  )
}
