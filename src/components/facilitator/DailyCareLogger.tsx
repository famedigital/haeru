import { useEffect, useState } from 'react'
import { ROOMS } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'

const CARE_KEYS = [
  { key: 'meals', emoji: '🍚', label: 'Meals' },
  { key: 'nap', emoji: '😴', label: 'Nap' },
  { key: 'mood', emoji: '😊', label: 'Mood' },
  { key: 'toilet', emoji: '🚽', label: 'Toilet' },
] as const

type CareKey = (typeof CARE_KEYS)[number]['key']

const DEFAULTS: Record<CareKey, string> = {
  meals: 'Ate all lunch',
  nap: '40 min',
  mood: 'Cheerful',
  toilet: 'Independent',
}

type LiveChild = {
  id: string
  name: string
  code: string
  room: string
  feedConsent?: boolean
  photoConsentFeed?: boolean
}

export function DailyCareLogger() {
  const { setScreen, openChild, showToast, currentUser } = useAppStore()
  const room = currentUser?.room || 'kg'
  const firstName = (currentUser?.name || 'Facilitator').split(' ')[0]
  const [roster, setRoster] = useState<LiveChild[]>([])
  const [selected, setSelected] = useState<string | undefined>()
  const [care, setCare] = useState<Record<CareKey, string>>({ ...DEFAULTS })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void apiFetch<LiveChild[]>(`/children?room=${encodeURIComponent(room)}`).then((r) => {
      if (cancelled) return
      const rows = r.ok && r.data ? r.data : []
      setRoster(rows)
      setSelected((prev) => prev || rows[0]?.id)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [room])

  const child = roster.find((c) => c.id === selected) ?? roster[0]
  const roomName = ROOMS[room]?.name || room
  const todayLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <div className="space-y-6">
      <GlassCard padding="lg">
        <GlassBadge tone="ap">
          {roomName} · {todayLabel}
        </GlassBadge>
        <h1 className="text-2xl text-slate-900 dark:text-white mt-3">
          Kuzuzangpo, {firstName}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          {loading
            ? 'Loading your room roster…'
            : `${roster.length} children in ${roomName}. Log meals, nap, mood, and toileting before pickup.`}
        </p>
      </GlassCard>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <GlassCard padding="lg" className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-slate-900 dark:text-white">Daily updates to log</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Meals · nap · mood · toileting
            </span>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-4">Loading children…</p>
          ) : roster.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-4">
              No children in {roomName}. Complete an admission first.
            </p>
          ) : (
            roster.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setSelected(k.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left border transition ${
                  selected === k.id
                    ? 'bg-emerald-500/15 border-emerald-400/40'
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                <span className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-200 flex items-center justify-center text-xs font-bold">
                  {k.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <b className="text-slate-900 dark:text-white text-sm block">{k.name}</b>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{k.code}</span>
                </div>
                {!(k.feedConsent ?? k.photoConsentFeed) && (
                  <GlassBadge tone="nya">No feed</GlassBadge>
                )}
                <GlassButton
                  variant="ghost"
                  className="!text-[11px] !py-1 !px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    openChild(k.id)
                  }}
                >
                  Profile
                </GlassButton>
              </button>
            ))
          )}
        </GlassCard>

        <GlassCard padding="lg" className="space-y-4">
          <h2 className="text-lg text-slate-900 dark:text-white">
            {child ? `Update · ${child.name.split(' ')[0]}` : 'Select a child'}
          </h2>
          {CARE_KEYS.map((row) => (
            <label key={row.key} className="block space-y-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {row.emoji} {row.label}
              </span>
              <input
                value={care[row.key]}
                onChange={(e) => setCare((c) => ({ ...c, [row.key]: e.target.value }))}
                className="w-full rounded-xl border border-[color:var(--glass-border)] bg-white/40 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </label>
          ))}
          <GlassButton
            className="w-full"
            disabled={!child}
            onClick={() => {
              if (!child) return
              showToast(`Care log saved for ${child.name.split(' ')[0]} (local draft)`)
              setScreen('post')
            }}
          >
            Save care log
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  )
}
