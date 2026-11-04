import { useCallback, useEffect, useState } from 'react'
import { Check, RefreshCw, X } from 'lucide-react'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'
import { cn } from '../../lib/utils/cn'

type Row = {
  id: string
  childName?: string
  domain: string
  title: string
  instruction: string
  effort: string | null
  howWent: string | null
  completedAt: string | null
  status: string
}

export function HomeActivityReview({ facilitator = false }: { facilitator?: boolean }) {
  const { showToast, currentUser } = useAppStore()
  const canConfirm = currentUser?.role === 'owner'
  const [rows, setRows] = useState<Row[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const r = await apiFetch<Row[]>('/home-activities?view=review')
      if (r.ok && Array.isArray(r.data)) setRows(r.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    const t = window.setInterval(() => void load(), 15_000)
    return () => window.clearInterval(t)
  }, [load])

  const act = async (id: string, path: 'confirm-progress' | 'dismiss') => {
    if (!canConfirm) {
      showToast('Only the Director can update ELDS from home practice')
      return
    }
    setBusyId(id)
    try {
      const r = await apiFetch(`/home-activities/${encodeURIComponent(id)}/${path}`, {
        method: 'POST',
        body: '{}',
      })
      if (r.ok) {
        showToast(path === 'dismiss' ? 'Noted without progress change' : 'ELDS updated for this child')
        await load()
      } else {
        showToast('Review failed')
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      {!facilitator ? (
        <PageHeader
          title="Home practice · Director review"
          subtitle="Family Done notes wait here. Confirm to move ELDS. Never auto-jumps a milestone."
        />
      ) : (
        <h2 className="text-lg text-slate-900 dark:text-white">Home practice waiting</h2>
      )}

      <div className="flex justify-end">
        <GlassButton variant="soft" className="!text-xs" onClick={() => void load()}>
          <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} /> Refresh
        </GlassButton>
      </div>

      {rows.length === 0 ? (
        <GlassCard padding="lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No family Done notes yet. After a parent or caregiver marks a home activity done, it
            appears here.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <GlassCard key={m.id} padding="md" className="space-y-2 border-l-2 border-teal-400/50">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{m.childName || 'Child'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.domain}</p>
                </div>
                <GlassBadge tone="pending">{m.effort || 'done'}</GlassBadge>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{m.title}</p>
              {m.howWent ? (
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  “{m.howWent}”
                </p>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No family note — they marked done.</p>
              )}
              {canConfirm ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  <GlassButton
                    variant="success"
                    className="!text-xs"
                    disabled={busyId === m.id}
                    loading={busyId === m.id}
                    onClick={() => void act(m.id, 'confirm-progress')}
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm · update progress
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    className="!text-xs"
                    disabled={busyId === m.id}
                    onClick={() => void act(m.id, 'dismiss')}
                  >
                    <X className="w-3.5 h-3.5" /> Keep on file
                  </GlassButton>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Waiting for Director confirm before this child&apos;s ELDS moves.
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
