import { AlertTriangle, Calendar, FileText, Receipt, Smile, Wallet } from 'lucide-react'
import { ROOMS, formatNu } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { cn } from '../../lib/utils/cn'
import { GlassButton, GlassCard, GlassBadge } from '../ui'

export function TodayDashboard() {
  const { setScreen, currentUser } = useAppStore()
  const firstName = (currentUser?.name || 'Director').split(' ')[0]
  const todayLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

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
          Review ELDS confirmations, check today&apos;s rooms, and clear parent payments waiting for
          your check.
        </p>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Smile,
            label: 'Here today',
            value: '40 / 45',
            sub: '5 absent · 2 notified',
            go: 'children',
            tint: 'border-l-2 border-teal-400/60 bg-teal-400/5 dark:bg-teal-400/5',
            iconTone: 'bg-teal-400/15 text-teal-700 dark:text-teal-300',
          },
          {
            icon: FileText,
            label: 'Applications',
            value: '3',
            sub: 'To review',
            go: 'applications',
            tint: 'border-l-2 border-violet-400/60 bg-violet-400/5 dark:bg-violet-400/5',
            iconTone: 'bg-violet-400/15 text-violet-700 dark:text-violet-300',
          },
          {
            icon: Receipt,
            label: 'Overdue invoices',
            value: formatNu(25400),
            sub: '2 families',
            go: 'finance',
            tint: 'border-l-2 border-amber-400/60 bg-amber-400/5 dark:bg-amber-400/5',
            iconTone: 'bg-amber-400/15 text-amber-700 dark:text-amber-300',
          },
          {
            icon: Calendar,
            label: 'Leave requests',
            value: '2',
            sub: 'Awaiting approval',
            go: 'people',
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
          {Object.values(ROOMS).map((r) => (
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
                    {r.here} here · {r.enrolled}/{r.cap}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <i
                    className="block h-full rounded-full bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400"
                    style={{ width: `${(r.here / r.cap) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard padding="lg" className="space-y-3">
          <h2 className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Needs your attention
          </h2>
          {[
            ['3 parent payments to confirm', 'finance', 'bl', 'Fees'],
            ['4 ELDS ratings to confirm', 'confirm', 'ap', 'ELDS'],
            ['2 posts awaiting approval', 'feed', 'nya', 'Media'],
          ].map(([t, go, tone, badge]) => (
            <button
              key={t}
              type="button"
              onClick={() => setScreen(go)}
              className="w-full flex items-center justify-between gap-2 obsidian-pill rounded-xl px-3 py-2.5 text-left"
            >
              <span className="text-sm text-slate-700 dark:text-slate-200">{t}</span>
              <GlassBadge tone={tone as 'ap' | 'bl' | 'nya'}>{badge}</GlassBadge>
            </button>
          ))}
          <GlassButton variant="soft" className="w-full" onClick={() => setScreen('finance')}>
            <Wallet className="w-4 h-4" /> Open finance
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  )
}
