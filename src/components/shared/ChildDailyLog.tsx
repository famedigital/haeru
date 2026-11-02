import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api/httpClient'
import { GlassBadge, GlassCard } from '../ui'

export type LiveHermesMoment = {
  id: string
  childName: string
  domain: string
  transcription: string | null
  rawHermesJson?: string
  confirmedAt?: string | null
  createdAt: string
  source?: string
  status: string
}

type Safe = { parentSafeTitle?: string; parentSafeDesc?: string }

function parseSafe(m: LiveHermesMoment): Safe {
  try {
    return m.rawHermesJson ? (JSON.parse(m.rawHermesJson) as Safe) : {}
  } catch {
    return {}
  }
}

export function useChildLiveMoments(childId: string) {
  const [moments, setMoments] = useState<LiveHermesMoment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childId) {
      setMoments([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    void apiFetch<{ live?: LiveHermesMoment[] }>(
      `/parents/child/${encodeURIComponent(childId)}/moments`,
    ).then((r) => {
      if (cancelled) return
      setMoments(r.ok && r.data?.live ? r.data.live : [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [childId])

  return { moments, loading }
}

export function ChildDailyLog({
  childId,
  firstName,
}: {
  childId: string
  firstName: string
}) {
  const { moments, loading } = useChildLiveMoments(childId)

  return (
    <GlassCard padding="lg" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg text-slate-900 dark:text-white">Daily log · teacher updates</h2>
        <GlassBadge tone="violet">Haeru Voice AI</GlassBadge>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Confirmed notes from staff about {firstName}. Each update maps to a MoESD ELDS domain after
        Director review.
      </p>

      {loading ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">Loading {firstName}&apos;s log…</p>
      ) : moments.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No confirmed teacher updates yet. When a facilitator sends a Telegram voice note and the
          Director confirms it, it appears here on {firstName}&apos;s profile.
        </p>
      ) : (
        <ul className="space-y-3">
          {moments.map((m) => {
            const s = parseSafe(m)
            const when = new Date(m.confirmedAt || m.createdAt)
            return (
              <li
                key={m.id}
                className="obsidian-pill rounded-xl p-3 space-y-2 border border-teal-400/20"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <GlassBadge tone="ap">{m.domain}</GlassBadge>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {when.toLocaleString()}
                  </span>
                  {m.source ? (
                    <GlassBadge tone="neutral">{m.source === 'voice' ? 'Voice note' : m.source}</GlassBadge>
                  ) : null}
                </div>
                <b className="block text-sm text-slate-900 dark:text-white">
                  {s.parentSafeTitle || `${firstName} · classroom moment`}
                </b>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {s.parentSafeDesc || m.transcription}
                </p>
                {m.transcription ? (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Teacher said: “{m.transcription}”
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </GlassCard>
  )
}
