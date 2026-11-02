import { GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

const DOMAINS = [
  {
    name: 'Physical Development & Health',
    items: 'Gross motor, fine motor, self-care',
    rate: 78,
  },
  {
    name: 'Social & Emotional Development',
    items: 'Peers, feelings, empathy',
    rate: 74,
  },
  {
    name: 'Language, Communication & Early Literacy',
    items: 'Listening, speaking, Dzongkha vocabulary',
    rate: 71,
  },
  {
    name: 'Approaches to Learning',
    items: 'Curiosity, persistence, imagination',
    rate: 80,
  },
  {
    name: 'Cognition & General Knowledge',
    items: 'Math concepts, problem solving, world awareness',
    rate: 69,
  },
  {
    name: 'Spiritual, Moral & Cultural Values',
    items: 'Respect, Bhutanese traditions, Driglam Namzha basics',
    rate: 82,
  },
]

const WINDOWS = [
  { w: 'Feb–Mar', v: 62 },
  { w: 'May–Jun', v: 68 },
  { w: 'Aug–Sep', v: 73 },
  { w: 'Oct–Nov', v: 76 },
]

export default function MoesdEldsMaster() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ELDS Standards & Analytics"
        subtitle="MoESD ELDS 2019 · locked national curriculum · anonymized aggregates only"
      />

      <GlassCard padding="lg" className="space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Master checklist (locked)
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            Centres cannot edit domains
          </span>
        </div>
        <ul className="space-y-3">
          {DOMAINS.map((d, i) => (
            <li
              key={d.name}
              className="rounded-xl border border-slate-200/70 dark:border-white/10 p-3 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <b className="block text-sm text-slate-900 dark:text-white">{d.name}</b>
                <span className="text-xs text-slate-500 dark:text-slate-400">{d.items}</span>
              </div>
              <div className="sm:w-40">
                <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400">
                  National readiness
                </span>
                <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-teal-500/80 rounded-full"
                    style={{ width: `${d.rate}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{d.rate}%</span>
              </div>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard padding="lg" className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Observation windows (aggregate)
        </h2>
        <div className="grid sm:grid-cols-4 gap-3">
          {WINDOWS.map((w) => (
            <div
              key={w.w}
              className="rounded-xl border border-slate-200/70 dark:border-white/10 p-4 text-center"
            >
              <div className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {w.w}
              </div>
              <div className="display text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {w.v}%
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Zero child names or photos — demographic and progress counts only for MoESD reporting.
        </p>
      </GlassCard>
    </div>
  )
}
