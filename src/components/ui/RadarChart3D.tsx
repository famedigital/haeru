import { useMemo, useState } from 'react'
import { ELDS_DOMAINS, OBSERVATION_WINDOWS } from '../../lib/elds/domains'
import type { RadarSeries } from '../../types/enterprise'
import { GlassCard } from './GlassCard'
import { GlassChips } from './GlassChips'
import { cn } from '../../lib/utils/cn'

interface RadarChart3DProps {
  series: RadarSeries[]
  size?: number
  title?: string
  showWindowFilter?: boolean
  className?: string
}

function point(i: number, v: number, c: number, R: number): [number, number] {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6
  return [c + Math.cos(a) * R * v, c + Math.sin(a) * R * v]
}

function poly(values: number[], c: number, R: number): string {
  return values.map((v, i) => point(i, v, c, R).join(',')).join(' ')
}

export function RadarChart3D({
  series,
  size = 300,
  title = 'Across all six domains',
  showWindowFilter = true,
  className,
}: RadarChart3DProps) {
  const [win, setWin] = useState(2)
  const c = size / 2
  const R = size * 0.34

  const visible = useMemo(() => {
    if (!showWindowFilter) return series
    // Show cumulative windows up to selected (Feb–Mar … selected)
    return series.filter((_, i) => i <= Math.min(win, series.length - 1))
  }, [series, win, showWindowFilter])

  return (
    <GlassCard className={cn('space-y-4', className)} padding="lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg text-slate-900 dark:text-white">{title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            MoESD ELDS 2019 · Observed, never tested
          </p>
        </div>
        {showWindowFilter && (
          <GlassChips
            items={[...OBSERVATION_WINDOWS]}
            value={win}
            onChange={setWin}
          />
        )}
      </div>

      <div className="relative rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-4 shadow-sm">
        <svg
          viewBox={`-70 -6 ${size + 140} ${size + 12}`}
          className="w-full max-w-[420px] mx-auto block"
          role="img"
          aria-label="Development across six MoESD ELDS domains"
        >
          {[1 / 3, 2 / 3, 1].map((r) => (
            <polygon
              key={r}
              points={poly(Array(6).fill(r) as number[], c, R)}
              fill={r === 1 ? 'rgba(255,250,243,0.04)' : 'none'}
              className="stroke-slate-300 dark:stroke-white/15 stroke-[1.5]"
            />
          ))}
          {ELDS_DOMAINS.map((d, i) => {
            const [x, y] = point(i, 1, c, R)
            const [lx, ly] = point(i, 1.22, c, R)
            const anc =
              Math.abs(lx - c) < 8 ? 'middle' : lx > c ? 'start' : 'end'
            return (
              <g key={d}>
                <line
                  x1={c}
                  y1={c}
                  x2={x}
                  y2={y}
                  className="stroke-slate-300 dark:stroke-white/15 stroke-[1.5]"
                />
                <text
                  x={lx}
                  y={ly + 4}
                  textAnchor={anc}
                  className="fill-slate-700 dark:fill-slate-300 font-bold text-[11px]"
                >
                  {d.split(/[ ,&]/)[0]}
                </text>
              </g>
            )
          })}
          {visible.map((s) => (
            <g key={s.window}>
              <polygon
                points={poly(s.values, c, R)}
                fill={s.fill ?? 'none'}
                stroke={s.color}
                strokeWidth={2.2}
                strokeDasharray={s.dash ? '4 4' : undefined}
                strokeLinejoin="round"
              />
              {s.dots &&
                s.values.map((v, i) => {
                  const [cx, cy] = point(i, v, c, R)
                  return (
                    <circle
                      key={`${s.window}-${i}`}
                      cx={cx}
                      cy={cy}
                      r={3.5}
                      fill="#ffffff"
                      stroke={s.color}
                      strokeWidth={2}
                    />
                  )
                })}
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap gap-4 justify-center text-xs text-slate-600 dark:text-slate-300">
        {visible.map((s) => (
          <span key={s.window} className="inline-flex items-center gap-2">
            <i
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: s.color }}
            />
            {s.window}
          </span>
        ))}
      </div>
    </GlassCard>
  )
}
