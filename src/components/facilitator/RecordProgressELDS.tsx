import { useEffect, useState } from 'react'
import { ELDS_DOMAINS, ELDS_MOTTO } from '../../lib/elds/domains'
import type { RatingLevel } from '../../types/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
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

type LiveChild = {
  id: string
  name: string
  code: string
  room: string
  age?: string
}

export function RecordProgressELDS() {
  const { showToast, currentUser, openChild } = useAppStore()
  const room = currentUser?.room || 'kg'
  const [children, setChildren] = useState<LiveChild[]>([])
  const [childId, setChildId] = useState<string | undefined>()
  const [domain, setDomain] = useState(0)
  const [ratings, setRatings] = useState<Record<number, RatingLevel | ''>>({
    0: 'ap',
    1: 'ap',
    2: 'bl',
    4: 'bl',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void apiFetch<LiveChild[]>(`/children?room=${encodeURIComponent(room)}`).then((r) => {
      if (cancelled) return
      const rows = r.ok && r.data ? r.data : []
      setChildren(rows)
      setChildId((prev) => prev || rows[0]?.id)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [room])

  const child = children.find((c) => c.id === childId) ?? children[0]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Record progress"
        subtitle={`${room} · MoESD ELDS checklist · Oct–Nov window`}
        actions={<GlassBadge rating="ap">Live roster</GlassBadge>}
      />

      <div className="grid lg:grid-cols-[240px_1fr] gap-5">
        <GlassCard padding="sm" className="space-y-1 h-fit">
          {loading ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 px-2 py-3">Loading children…</p>
          ) : children.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 px-2 py-3">
              No children in room {room}. Complete an admission first.
            </p>
          ) : (
            children.map((c) => (
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
                  {c.name.split(' ')[0]?.[0]}
                </span>
                <div>
                  <b className="text-slate-900 dark:text-white text-xs block">{c.name.split(' ')[0]}</b>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{c.code}</span>
                </div>
              </button>
            ))
          )}
        </GlassCard>

        <GlassCard padding="lg" className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-xl text-slate-900 dark:text-white">{child?.name || 'Select a child'}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {child?.age || child?.code || ''} · {ELDS_MOTTO}
              </p>
            </div>
            {child ? (
              <GlassButton variant="ghost" onClick={() => openChild(child.id)}>
                Open profile →
              </GlassButton>
            ) : null}
          </div>
          <GlassChips items={[...ELDS_DOMAINS]} value={domain} onChange={setDomain} />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rate each indicator. Rows save to the database and await Director confirmation before
            parents see them.
          </p>
          <div className="space-y-3">
            {INDICATORS.map((ind, i) => (
              <div
                key={ind}
                className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3"
              >
                <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{ind}</span>
                <div className="inline-flex rounded-xl bg-slate-200/80 dark:bg-slate-900/60 p-1 gap-1">
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
            disabled={!child || saving}
            onClick={() => {
              if (!child) return
              void (async () => {
                setSaving(true)
                let ok = 0
                for (const [i, ind] of INDICATORS.entries()) {
                  const rating = ratings[i]
                  if (!rating) continue
                  const r = await apiFetch('/elds/observations', {
                    method: 'POST',
                    body: JSON.stringify({
                      childId: child.id,
                      domain: ELDS_DOMAINS[domain],
                      indicator: ind,
                      rating,
                      remark: 'Facilitator classroom observation',
                      window: 'oct-nov',
                      facilitatorId: currentUser?.id,
                    }),
                  })
                  if (r.ok) ok += 1
                }
                setSaving(false)
                showToast(
                  ok > 0
                    ? `Saved ${ok} indicators for ${child.name}`
                    : 'Could not save observations',
                )
                if (ok > 0) {
                  // Refresh progress cache path by opening profile progress later
                }
              })()
            }}
          >
            {saving ? 'Saving…' : 'Submit for review'}
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  )
}
