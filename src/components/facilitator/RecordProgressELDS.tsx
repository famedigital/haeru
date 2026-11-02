import { useState } from 'react'
import { CHILDREN } from '../../data/enterprise'
import { ELDS_DOMAINS, ELDS_MOTTO } from '../../lib/elds/domains'
import type { RatingLevel } from '../../types/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard, GlassChips } from '../ui'
import { PageHeader } from '../shared/PageHeader'
import { cn } from '../../lib/utils/cn'

const INDICATORS = [
  'Walk along irregular lines',
  'Jump forward with both feet together',
  'Climb stairs with alternating feet',
  'Throw a ball overhand',
  'Hold a crayon with fingers, not a fist',
  'Wash hands with little help',
]

export function RecordProgressELDS() {
  const { showToast } = useAppStore()
  const nursery = CHILDREN.filter((c) => c.room === 'nursery')
  const [childId, setChildId] = useState(nursery[0]?.id)
  const [domain, setDomain] = useState(0)
  const [ratings, setRatings] = useState<Record<number, RatingLevel | ''>>({
    0: 'ap',
    1: 'ap',
    2: 'bl',
    4: 'bl',
  })
  const child = nursery.find((c) => c.id === childId) ?? nursery[0]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Record progress"
        subtitle="Nursery · 3-year checklist · Oct–Nov window"
        actions={<GlassBadge rating="ap">Saved just now</GlassBadge>}
      />

      <div className="grid lg:grid-cols-[240px_1fr] gap-5">
        <GlassCard padding="sm" className="space-y-1 h-fit">
          {nursery.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChildId(c.id)}
              className={cn(
                'w-full flex items-center gap-2 rounded-xl px-2 py-2 text-left',
                childId === c.id ? 'bg-emerald-500/15' : 'hover:bg-white/5',
              )}
            >
              <span className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-800 dark:text-teal-200 text-[10px] font-bold flex items-center justify-center">
                {c.name.split(' ')[0][0]}
              </span>
              <div>
                <b className="text-slate-900 dark:text-white text-xs block">{c.name.split(' ')[0]}</b>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">of 31 rated</span>
              </div>
            </button>
          ))}
        </GlassCard>

        <GlassCard padding="lg" className="space-y-4">
          <div>
            <h2 className="text-xl text-slate-900 dark:text-white">{child?.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{child?.age} · {ELDS_MOTTO}</p>
          </div>
          <GlassChips
            items={[...ELDS_DOMAINS]}
            value={domain}
            onChange={setDomain}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gross Motor · Standard 1.1: Children are able to demonstrate coordination of large
            muscles
          </p>
          <div className="space-y-3">
            {INDICATORS.map((ind, i) => (
              <div
                key={ind}
                className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-white/5 pb-3"
              >
                <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{ind}</span>
                <div className="inline-flex rounded-xl bg-slate-900/60 p-1 gap-1">
                  {(
                    [
                      ['nya', 'Not yet'],
                      ['bl', 'Beginning'],
                      ['ap', 'Achieved'],
                    ] as const
                  ).map(([r, label]) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRatings((prev) => ({ ...prev, [i]: r }))}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-[11px] font-bold',
                        ratings[i] === r
                          ? r === 'ap'
                            ? 'bg-emerald-500 text-slate-950'
                            : r === 'bl'
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-rose-400 text-slate-950'
                          : 'text-slate-500 dark:text-slate-400',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="obsidian-pill rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300">
            Ratings go to the Centre Director to confirm. Families see them only after that.
          </div>
          <GlassButton
            onClick={() => {
              void (async () => {
                const { apiFetch } = await import('../../lib/api/httpClient')
                const kids = await apiFetch<Array<{ id: string; name: string }>>('/children', {
                  auth: false,
                })
                const match =
                  kids.data?.find((c) =>
                    c.name.toLowerCase().includes((child?.name.split(' ')[0] ?? '').toLowerCase()),
                  ) ?? kids.data?.[0]
                if (!match) {
                  showToast('No Prisma children yet · complete an admission first')
                  return
                }
                let ok = 0
                for (const [i, ind] of INDICATORS.entries()) {
                  const rating = ratings[i]
                  if (!rating) continue
                  const r = await apiFetch('/elds/observations', {
                    method: 'POST',
                    body: JSON.stringify({
                      childId: match.id,
                      domain: ELDS_DOMAINS[domain],
                      indicator: ind,
                      rating,
                      remark: 'Facilitator classroom observation',
                    }),
                  })
                  if (r.ok) ok += 1
                }
                showToast(
                  ok > 0
                    ? `${ok} ELDS rows saved for ${match.name} · Director can confirm`
                    : 'Could not save observations',
                )
              })()
            }}
          >
            Submit for review
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  )
}
