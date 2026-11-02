import { useState } from 'react'
import { ELDS_DOMAINS, ELDS_MOTTO, OBSERVATION_WINDOWS } from '../../lib/elds/domains'
import type { RadarSeries } from '../../types/enterprise'
import { GlassBadge, GlassCard, GlassChips, RadarChart3D } from '../ui'

export type DomainStat = {
  domain: string
  ap: number
  bl: number
  nya: number
  total: number
  score: number
  lastObserved?: string | null
  voiceAiCount?: number
}

export type ProgressMilestone = {
  id: string
  date: string
  domain: string
  indicator: string
  rating: string
  source: string
  facilitatorName: string
  isConfirmed: boolean
}

interface ChildProgressPanelProps {
  childFirstName: string
  staff?: boolean
  domainStats?: DomainStat[]
  radarSeries?: RadarSeries[]
  recentMilestones?: ProgressMilestone[]
  loading?: boolean
}

const EMPTY_STATS: DomainStat[] = ELDS_DOMAINS.map((domain) => ({
  domain,
  ap: 0,
  bl: 0,
  nya: 0,
  total: 0,
  score: 0,
}))

const EMPTY_RADAR: RadarSeries[] = [
  {
    window: 'Oct–Nov',
    color: '#2dd4bf',
    fill: 'rgba(45, 212, 191, 0.18)',
    dots: true,
    values: [0.35, 0.35, 0.35, 0.35, 0.35, 0.35],
  },
]

export function ChildProgressPanel({
  childFirstName,
  staff = false,
  domainStats,
  radarSeries,
  recentMilestones = [],
  loading = false,
}: ChildProgressPanelProps) {
  const [win, setWin] = useState(2)
  const stats = domainStats?.length ? domainStats : EMPTY_STATS
  const series = radarSeries?.length ? radarSeries : EMPTY_RADAR

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5">
      <div className="space-y-4">
        <RadarChart3D series={series} title="Across all six domains" />
        <div className="obsidian-pill rounded-xl px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
          {ELDS_MOTTO} Observations are confirmed by the Centre Director before families see them.
        </div>
        {recentMilestones.length > 0 ? (
          <GlassCard padding="md" className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent milestones</h3>
            <ul className="space-y-2 max-h-56 overflow-y-auto">
              {recentMilestones.slice(0, 8).map((m) => (
                <li key={m.id} className="text-xs text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-white/5 pb-2">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    <GlassBadge tone={m.rating === 'ap' ? 'ap' : m.rating === 'bl' ? 'bl' : 'nya'}>
                      {m.rating}
                    </GlassBadge>
                    <GlassBadge tone="violet">{m.domain}</GlassBadge>
                    <span className="text-slate-500 dark:text-slate-400">
                      {new Date(m.date).toLocaleDateString()}
                    </span>
                  </div>
                  <b className="text-slate-800 dark:text-slate-100 block">{m.indicator}</b>
                  <span className="text-slate-500 dark:text-slate-400">
                    {m.facilitatorName} · {m.source}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        ) : null}
      </div>

      <GlassCard padding="lg" className="space-y-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg text-slate-900 dark:text-white">By domain · MoESD ELDS</h2>
          <GlassChips items={[...OBSERVATION_WINDOWS]} value={win} onChange={setWin} />
        </div>

        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading live progress…</p>
        ) : (
          <div className="space-y-3">
            {stats.map((d) => {
              const t = Math.max(1, d.total)
              return (
                <div key={d.domain} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <b className="text-slate-700 dark:text-slate-200 min-w-[140px] flex items-center gap-2">
                      {d.domain}
                      {(d.voiceAiCount ?? 0) > 0 ? (
                        <GlassBadge tone="ap">+{d.voiceAiCount} Voice AI</GlassBadge>
                      ) : null}
                    </b>
                    <span className="text-slate-500 dark:text-slate-400">
                      {d.ap} of {d.total} achieved · {d.score}%
                    </span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5 bg-slate-200/90 dark:bg-slate-900/50">
                    <i className="bg-emerald-500" style={{ width: `${(d.ap / t) * 100}%` }} />
                    <i className="bg-amber-400" style={{ width: `${(d.bl / t) * 100}%` }} />
                    <i className="bg-rose-400" style={{ width: `${(d.nya / t) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Achieved & progressing
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Beginning to learn
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-sm bg-rose-400" /> Not yet
          </span>
        </div>

        {!staff && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/30 p-3">
            <b className="text-emerald-700 dark:text-emerald-300 text-sm">Live from school</b>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {childFirstName}&apos;s domain bars update when facilitators record checklists or Haeru
              Voice AI moments are Director-confirmed.
            </p>
          </div>
        )}

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Viewing window: <b className="text-slate-600 dark:text-slate-300">{OBSERVATION_WINDOWS[win]}</b>
        </p>
      </GlassCard>
    </div>
  )
}
