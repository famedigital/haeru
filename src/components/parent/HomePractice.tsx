import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'

type Activity = {
  id: string
  childName?: string
  domain: string
  title: string
  instruction: string
  status: string
  effort: string | null
  howWent: string | null
  expiresAt: string
  completedAt: string | null
}

const EFFORT: Array<{ id: 'easy' | 'ok' | 'hard'; label: string }> = [
  { id: 'easy', label: 'Easy' },
  { id: 'ok', label: 'OK' },
  { id: 'hard', label: 'Hard' },
]

export function HomePractice({ caregiver = false }: { caregiver?: boolean }) {
  const { selectedChildId, showToast } = useAppStore()
  const [rows, setRows] = useState<Activity[]>([])
  const [howWent, setHowWent] = useState('')
  const [effort, setEffort] = useState<'easy' | 'ok' | 'hard' | ''>('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!selectedChildId) return
    const r = await apiFetch<Activity[]>(
      `/home-activities?childId=${encodeURIComponent(selectedChildId)}`,
    )
    if (r.ok && Array.isArray(r.data)) setRows(r.data)
  }, [selectedChildId])

  useEffect(() => {
    void load()
  }, [load])

  const open = rows.find((a) => a.status === 'offered')
  const recent = rows.filter((a) => a.status !== 'offered').slice(0, 3)

  const markDone = async () => {
    if (!open) return
    setBusy(true)
    try {
      const r = await apiFetch(`/home-activities/${encodeURIComponent(open.id)}/done`, {
        method: 'POST',
        body: JSON.stringify({
          effort: effort || undefined,
          howWent: howWent.trim() || undefined,
        }),
      })
      if (r.ok) {
        showToast('Saved · Director will review before progress updates')
        setHowWent('')
        setEffort('')
        await load()
      } else {
        showToast('Could not save home practice')
      }
    } finally {
      setBusy(false)
    }
  }

  if (!selectedChildId) return null

  return (
    <GlassCard padding="lg" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg text-slate-900 dark:text-white">Home practice</h2>
        {open ? <GlassBadge tone="pending">This week</GlassBadge> : <GlassBadge tone="ap">Caught up</GlassBadge>}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        One activity from school, for this child only. {caregiver ? 'Fees stay private to parents.' : null}{' '}
        Progress on the radar moves only after the Director confirms.
      </p>

      {open ? (
        <div className="space-y-3 obsidian-pill rounded-xl p-4 border border-teal-400/25">
          <GlassBadge tone="violet">{open.domain}</GlassBadge>
          <p className="font-bold text-slate-900 dark:text-white">{open.title}</p>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{open.instruction}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Expires {new Date(open.expiresAt).toLocaleDateString()}
          </p>
          <div className="flex flex-wrap gap-2">
            {EFFORT.map((e) => (
              <GlassButton
                key={e.id}
                variant={effort === e.id ? 'success' : 'soft'}
                className="!text-xs"
                onClick={() => setEffort(e.id)}
              >
                {e.label}
              </GlassButton>
            ))}
          </div>
          <label className="block">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">How did they do it?</span>
            <textarea
              value={howWent}
              onChange={(ev) => setHowWent(ev.target.value)}
              rows={3}
              maxLength={800}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white/70 dark:bg-slate-900/40 px-3 py-2 text-sm text-slate-800 dark:text-slate-100"
              placeholder="A short note — what they tried, what was fun, what was hard."
            />
          </label>
          <GlassButton variant="success" loading={busy} disabled={busy} onClick={() => void markDone()}>
            We did it
          </GlassButton>
        </div>
      ) : (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No open home practice. When the Director confirms a classroom moment, Haeru will suggest one
          activity here and on Telegram.
        </p>
      )}

      {recent.length > 0 ? (
        <ul className="space-y-2">
          {recent.map((a) => (
            <li key={a.id} className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-800 dark:text-slate-100">{a.title}</span>
              {' · '}
              {a.status === 'progress_confirmed'
                ? 'progress updated'
                : a.status === 'done'
                  ? 'waiting for Director'
                  : a.status}
              {a.howWent ? ` — ${a.howWent.slice(0, 80)}` : ''}
            </li>
          ))}
        </ul>
      ) : null}
    </GlassCard>
  )
}
