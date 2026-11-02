import { useEffect, useState } from 'react'
import { AlertTriangle, Calendar, FileText, Receipt, Smile, Wallet } from 'lucide-react'
import { ROOMS, formatNu } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import { listPendingDirectorMoments } from '../../lib/api/pulseApiServer'
import { useAppStore } from '../../lib/store/appStore'
import { cn } from '../../lib/utils/cn'
import { GlassButton, GlassCard, GlassBadge } from '../ui'

type LiveChild = { id: string; room: string }

export function TodayDashboard() {
  const { setScreen, currentUser } = useAppStore()
  const firstName = (currentUser?.name || 'Director').split(' ')[0]
  const todayLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
  const [children, setChildren] = useState<LiveChild[]>([])
  const [pendingHermes, setPendingHermes] = useState(0)

  useEffect(() => {
    let cancelled = false
    void Promise.all([
      apiFetch<LiveChild[]>('/children'),
      apiFetch<{ live?: unknown[]; legacy?: unknown[] }>('/moments/pending-director'),
    ]).then(([kids, pending]) => {
      if (cancelled) return
      if (kids.ok && kids.data) setChildren(kids.data)
      const live = pending.ok && Array.isArray(pending.data?.live) ? pending.data.live.length : 0
      const legacy = listPendingDirectorMoments().length
      setPendingHermes(Math.max(live, legacy))
    })
    return () => {
      cancelled = true
    }
  }, [])

  const byRoom = Object.fromEntries(
    Object.keys(ROOMS).map((id) => [id, children.filter((c) => c.room === id).length]),
  ) as Record<string, number>

  return (
    <div className="space-y-6">
      <GlassCard padding="lg" className="relative overflow-hidden glass-panel-rainbow">
        <div className="obsidian-pill inline-flex rounded-full px-3 py-1 text-xs text-teal-700 dark:text-teal-300 mb-3">
          {todayLabel}
        </div>
        <h1 className="display text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Good morning, {firstName}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-xl text-sm leading-relaxed">
          {children.length} enrolled child{children.length === 1 ? '' : 'ren'} on the live roster.
          {pendingHermes > 0
            ? ` ${pendingHermes} Hermes moment${pendingHermes === 1 ? '' : 's'} waiting for your confirm.`
            : ' No Hermes moments waiting for confirm.'}
        </p>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Smile,
            label: 'Enrolled',
            value: String(children.length),
            sub: 'Live admissions roster',
            go: 'children',
            tint: 'border-l-2 border-teal-400/60 bg-teal-400/5 dark:bg-teal-400/5',
            iconTone: 'bg-teal-400/15 text-teal-700 dark:text-teal-300',
          },
          {
            icon: FileText,
            label: 'Applications',
            value: '—',
            sub: 'Use New admission to enroll',
            go: 'applications',
            tint: 'border-l-2 border-violet-400/60 bg-violet-400/5 dark:bg-violet-400/5',
            iconTone: 'bg-violet-400/15 text-violet-700 dark:text-violet-300',
          },
          {
            icon: Receipt,
            label: 'Invoices',
            value: formatNu(0),
            sub: 'Live tuition sync next',
            go: 'finance',
            tint: 'border-l-2 border-amber-400/60 bg-amber-400/5 dark:bg-amber-400/5',
            iconTone: 'bg-amber-400/15 text-amber-700 dark:text-amber-300',
          },
          {
            icon: Calendar,
            label: 'Hermes queue',
            value: String(pendingHermes),
            sub: 'Awaiting Director confirm',
            go: 'confirm',
            tint: 'border-l-2 border-rose-400/60 bg-rose-400/5 dark:bg-rose-400/5',
            iconTone: 'bg-rose-400/15 text-rose-700 dark:text-rose-300',
          },
        ].map((k) => (
          <button key={k.label} type="button" onClick={() => setScreen(k.go)} className="text-left w-full">
            <GlassCard interactive className={cn('h-full flex flex-col gap-2', k.tint)}>
              <span className={cn('w-9 h-9 shrink-0 rounded-xl flex items-center justify-center', k.iconTone)}>
                <k.icon className="w-4 h-4" />
              </span>
              <span className="block text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {k.label}
              </span>
              <span className="block display text-xl sm:text-2xl leading-tight text-slate-900 dark:text-white break-words">
                {k.value}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">{k.sub}</span>
            </GlassCard>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        <GlassCard padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-slate-900 dark:text-white">Rooms today</h2>
            <GlassButton variant="ghost" className="!py-1.5 !text-xs" onClick={() => setScreen('children')}>
              View children
            </GlassButton>
          </div>
          {Object.values(ROOMS).map((r) => {
            const enrolled = byRoom[r.id] ?? 0
            return (
              <div key={r.id} className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 text-xs font-bold"
                  style={{ background: r.bg }}
                >
                  {r.name[0]}
                </span>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <b className="text-slate-900 dark:text-white">
                      {r.name} <span className="text-slate-500 dark:text-slate-400 font-medium">· {r.band}</span>
                    </b>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                      {enrolled} enrolled
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <i
                      className="block h-full rounded-full bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400"
                      style={{ width: `${Math.min(100, (enrolled / Math.max(r.cap, 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </GlassCard>

        <GlassCard padding="lg" className="space-y-3">
          <h2 className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Needs your attention
          </h2>
          <button
            type="button"
            onClick={() => setScreen('confirm')}
            className="w-full flex items-center justify-between gap-2 obsidian-pill rounded-xl px-3 py-2.5 text-left"
          >
            <span className="text-sm text-slate-700 dark:text-slate-200">
              {pendingHermes} Hermes moment{pendingHermes === 1 ? '' : 's'} to confirm
            </span>
            <GlassBadge tone="ap">ELDS</GlassBadge>
          </button>
          <GlassButton variant="soft" className="w-full" onClick={() => setScreen('finance')}>
            <Wallet className="w-4 h-4" /> Open finance
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  )
}
