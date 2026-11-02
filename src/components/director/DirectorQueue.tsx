import { useCallback, useEffect, useState } from 'react'
import { Check, RefreshCw, X } from 'lucide-react'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'
import { cn } from '../../lib/utils/cn'

type LiveMoment = {
  id: string
  childName: string
  domain: string
  transcription: string | null
  status: string
  createdAt: string
  centreId: string
}

type PendingPayload = {
  live?: LiveMoment[]
  legacy?: unknown[]
  centreId?: string
}

/** Director review queue for Haeru Voice AI moments (tenant-partitioned). */
export function DirectorQueue() {
  const { showToast } = useAppStore()
  const [rows, setRows] = useState<LiveMoment[]>([])
  const [centreId, setCentreId] = useState('WSH')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const r = await apiFetch<PendingPayload>('/moments/pending-director', {
        headers: { 'X-Centre-Code': centreId },
      })
      if (r.ok && r.data) {
        setRows(r.data.live ?? [])
        if (r.data.centreId) setCentreId(r.data.centreId)
      }
    } catch {
      /* network */
    } finally {
      setLoading(false)
    }
  }, [centreId])

  useEffect(() => {
    void load()
    const t = window.setInterval(() => void load(), 10_000)
    return () => window.clearInterval(t)
  }, [load])

  const confirm = async (id: string) => {
    setBusyId(id)
    try {
      const r = await apiFetch(`/haeru-moments/${id}/confirm`, { method: 'POST', body: '{}' })
      if (r.ok) {
        showToast('Delivered to family · child-scoped')
        await load()
      } else {
        showToast('Confirm failed')
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Haeru Voice AI · Director queue"
        subtitle="Confirm moments before parents see them · child-scoped delivery only"
      />

      <div className="flex items-center justify-between gap-3">
        <GlassBadge tone="pending">Centre {centreId}</GlassBadge>
        <GlassButton variant="soft" className="!text-xs" onClick={() => void load()}>
          <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} /> Refresh
        </GlassButton>
      </div>

      {rows.length === 0 ? (
        <GlassCard padding="lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No pending voice moments. When a facilitator sends a Telegram note to Haeru Voice AI,
            it appears here for 1-tap confirm.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <GlassCard key={m.id} padding="md" className="space-y-2 border-l-2 border-violet-400/50">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{m.childName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.domain}</p>
                </div>
                <GlassBadge tone="pending">Awaiting confirm</GlassBadge>
              </div>
              {m.transcription ? (
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  “{m.transcription.slice(0, 280)}
                  {m.transcription.length > 280 ? '…' : ''}”
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-1">
                <GlassButton
                  variant="success"
                  className="!text-xs"
                  disabled={busyId === m.id}
                  loading={busyId === m.id}
                  onClick={() => void confirm(m.id)}
                >
                  <Check className="w-3.5 h-3.5" /> Confirm &amp; deliver
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  className="!text-xs"
                  disabled={busyId === m.id}
                  onClick={() => showToast('Use Telegram Reject or leave pending')}
                >
                  <X className="w-3.5 h-3.5" /> Later
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
