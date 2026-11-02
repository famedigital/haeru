import { useEffect, useState } from 'react'
import { formatNu, childFirstName } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'

type LiveMoment = {
  id: string
  childName: string
  domain: string
  transcription: string | null
  rawHermesJson?: string
  confirmedAt?: string | null
  createdAt: string
  status: string
}

type ParentSafe = {
  parentSafeTitle?: string
  parentSafeDesc?: string
}

function parseSafe(m: LiveMoment): ParentSafe {
  try {
    return m.rawHermesJson ? (JSON.parse(m.rawHermesJson) as ParentSafe) : {}
  } catch {
    return {}
  }
}

/** Prefer Director-approved parent copy; never fall back to raw STT garbage. */
function parentFacingCopy(m: LiveMoment, first: string): { title: string; desc: string } {
  const s = parseSafe(m)
  const title = s.parentSafeTitle || `${first} had a learning moment today`
  const desc =
    s.parentSafeDesc ||
    `${first} was observed during class — a classmate-safe summary for the family.`
  return { title, desc }
}

export function DailyReflection({ caregiver = false }: { caregiver?: boolean }) {
  const { setScreen, openChild, selectedChildId } = useAppStore()
  const childId = selectedChildId
  const [liveName, setLiveName] = useState('Child')
  const [moments, setMoments] = useState<LiveMoment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    void Promise.all([
      apiFetch<{ name?: string }>(`/children/${encodeURIComponent(childId)}`),
      apiFetch<{ live?: LiveMoment[] }>(`/parents/child/${encodeURIComponent(childId)}/moments`),
    ]).then(([childRes, momRes]) => {
      if (cancelled) return
      if (childRes.ok && childRes.data?.name) setLiveName(childRes.data.name)
      const live = momRes.ok && momRes.data?.live ? momRes.data.live : []
      setMoments(live)
      if (!childRes.data?.name && live[0]?.childName) setLiveName(live[0].childName)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [childId])

  const first = childFirstName(liveName)
  const today = moments.filter((m) => {
    const d = new Date(m.confirmedAt || m.createdAt)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })
  const latest = today[0] ?? moments[0]
  const hero = latest ? parentFacingCopy(latest, first) : null

  return (
    <div className="space-y-6">
      <GlassCard padding="lg">
        <GlassBadge tone="ap">{first} · Kindergarten</GlassBadge>
        <h1 className="text-2xl text-slate-900 dark:text-white mt-3">
          {hero
            ? hero.title
            : loading
              ? `${first}'s day…`
              : `${first} · waiting for today's school update`}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
          {hero
            ? hero.desc
            : loading
              ? 'Loading Haeru Voice AI updates…'
              : `When a teacher sends a voice note and the Director confirms it, ${first}'s update appears here.`}
        </p>
        {latest?.domain ? (
          <div className="mt-3">
            <GlassBadge tone="violet">{latest.domain}</GlassBadge>
          </div>
        ) : null}
      </GlassCard>

      {caregiver ? (
        <div className="obsidian-pill rounded-xl px-4 py-3 text-sm text-violet-700 dark:text-violet-200 border border-violet-400/30">
          You&apos;re an approved caregiver for {first}. Pickup and medical details are shared.{' '}
          <b>Fees stay private to parents.</b>
        </div>
      ) : (
        <GlassCard
          padding="md"
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 !border-amber-400/30"
        >
          <div className="flex-1">
            <b className="text-amber-700 dark:text-amber-200">
              October fees · {formatNu(1000)} due 15 Oct
            </b>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pay by mBoB or bank transfer, then report the journal number in the app
            </p>
          </div>
          <GlassButton onClick={() => setScreen('payments')}>Pay now</GlassButton>
        </GlassCard>
      )}

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <GlassCard padding="lg" className="space-y-4">
          <h2 className="text-lg text-slate-900 dark:text-white">Today at school</h2>
          {today.length === 0 && !latest ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No confirmed Haeru Voice AI moments for {first} yet today.
            </p>
          ) : (
            <ul className="space-y-3">
              {(today.length ? today : latest ? [latest] : []).map((m) => {
                const copy = parentFacingCopy(m, first)
                return (
                  <li
                    key={m.id}
                    className="obsidian-pill rounded-xl p-3 space-y-1 border border-teal-400/20"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <GlassBadge tone="ap">Haeru Voice AI</GlassBadge>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {new Date(m.confirmedAt || m.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <b className="block text-sm text-slate-900 dark:text-white">{copy.title}</b>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{copy.desc}</p>
                  </li>
                )
              })}
            </ul>
          )}
        </GlassCard>

        <div className="space-y-4">
          <GlassCard padding="lg">
            <h2 className="text-lg text-slate-900 dark:text-white mb-3">Coming up</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Centre calendar sync arrives in the next sprint. Ask the Director for this week&apos;s
              school events.
            </p>
          </GlassCard>
          <GlassCard padding="lg" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-slate-900 dark:text-white">Progress</h2>
              <button
                type="button"
                className="text-xs font-bold text-emerald-700 dark:text-emerald-300"
                onClick={() => childId && openChild(childId)}
              >
                Open profile →
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              MoESD ELDS domains update when facilitators record checklists or Director-confirmed
              Haeru Voice AI moments land.
            </p>
            <GlassButton variant="soft" className="w-full" onClick={() => setScreen('pprogress')}>
              See development domains
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
