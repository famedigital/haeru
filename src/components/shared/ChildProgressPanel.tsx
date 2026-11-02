import { useState } from 'react'
import {
  ELDS_DOMAINS,
  ELDS_MOTTO,
  KINLEY_RADAR_SERIES,
  OBSERVATION_WINDOWS,
} from '../../lib/elds/domains'
import { GlassCard, GlassChips, RadarChart3D } from '../ui'

const DOMAIN_COUNTS = [
  { ap: 12, bl: 4, nya: 1 },
  { ap: 10, bl: 5, nya: 2 },
  { ap: 11, bl: 5, nya: 2 },
  { ap: 7, bl: 3, nya: 1 },
  { ap: 13, bl: 4, nya: 1 },
  { ap: 9, bl: 3, nya: 0 },
]

interface ChildProgressPanelProps {
  childFirstName: string
  staff?: boolean
}

export function ChildProgressPanel({
  childFirstName,
  staff = false,
}: ChildProgressPanelProps) {
  const [win, setWin] = useState(2)

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5">
      <div className="space-y-4">
        <RadarChart3D series={KINLEY_RADAR_SERIES} title="Across all six domains" />
        <div className="obsidian-pill rounded-xl px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
          {ELDS_MOTTO} Observations are confirmed by the Centre Director before families see them.
        </div>
      </div>

      <GlassCard padding="lg" className="space-y-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg text-slate-900 dark:text-white">By domain · 4-year checklist</h2>
          <GlassChips items={[...OBSERVATION_WINDOWS]} value={win} onChange={setWin} />
        </div>

        <div className="space-y-3">
          {ELDS_DOMAINS.map((d, i) => {
            const { ap, bl, nya } = DOMAIN_COUNTS[i]!
            const t = ap + bl + nya
            return (
              <div key={d} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <b className="text-slate-700 dark:text-slate-200 min-w-[140px]">{d}</b>
                  <span className="text-slate-500 dark:text-slate-400">
                    {ap} of {t} achieved
                  </span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden gap-0.5 bg-slate-200/90 dark:bg-slate-900/50">
                  <i className="bg-emerald-500" style={{ width: `${(ap / t) * 100}%` }} />
                  <i className="bg-amber-400" style={{ width: `${(bl / t) * 100}%` }} />
                  <i className="bg-rose-400" style={{ width: `${(nya / t) * 100}%` }} />
                </div>
              </div>
            )
          })}
        </div>

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
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/30 p-3">
              <b className="text-emerald-700 dark:text-emerald-300 text-sm">Something to celebrate</b>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {childFirstName} can now retell a familiar story in the right order, and helps
                younger friends tidy up.
              </p>
            </div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-400/30 p-3">
              <b className="text-amber-700 dark:text-amber-200 text-sm">Working on together</b>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Hopping on one foot. Try a hopscotch game at home, just for fun!
              </p>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Viewing window: <b className="text-slate-600 dark:text-slate-300">{OBSERVATION_WINDOWS[win]}</b>
        </p>
      </GlassCard>
    </div>
  )
}
