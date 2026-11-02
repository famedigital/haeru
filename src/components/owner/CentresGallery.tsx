import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

const PLACEHOLDERS = [
  { name: 'Paro Valley ECCD', place: 'Paro · coming soon', tone: 'from-sky-500/30 to-emerald-600/20' },
  { name: 'Punakha Lotus Nest', place: 'Punakha · coming soon', tone: 'from-amber-400/25 to-rose-500/20' },
]

export function CentresGallery() {
  const { setScreen, role } = useAppStore()

  return (
    <div className="relative -mx-4 md:-mx-8 -mt-6 min-h-[calc(100vh-5rem)] overflow-hidden px-4 md:px-8 pt-6 pb-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(16,185,129,0.35), transparent 55%), radial-gradient(ellipse 70% 45% at 90% 10%, rgba(245,158,11,0.28), transparent 50%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(14,165,233,0.2), transparent 55%)',
        }}
      />
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-10 left-0 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl -z-10" />

      <PageHeader
        title="Centres"
        subtitle="A living glass atlas of Bhutan ECCD — enter your school to operate."
      />

      <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-6 max-w-6xl">
        <GlassCard
          padding="none"
          className="relative overflow-hidden border-emerald-400/30 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.45)] hover:-translate-y-1 transition-transform duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/25 via-teal-600/10 to-amber-400/15" />
          <div className="relative p-8 md:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <GlassBadge tone="ap">Live</GlassBadge>
              <GlassBadge tone="violet">WSH</GlassBadge>
              <GlassBadge tone="neutral">Thimphu</GlassBadge>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-200/90 font-bold mb-2">
                Flagship centre
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Wangchuk&apos;s School of Heroes
              </h2>
              <p className="mt-3 text-slate-700 dark:text-slate-200 max-w-xl flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-emerald-600 dark:text-emerald-300" />
                Thimphu · Bhutan — MoESD ELDS 2019 · Haeru ready
              </p>
            </div>
            <ul className="grid sm:grid-cols-3 gap-3 text-sm">
              {[
                ['Rooms', 'Toddlers · Nursery · KG'],
                ['Pulse', 'Hermes photo & voice'],
                ['Pay', 'mBoB / mPAY QR'],
              ].map(([k, v]) => (
                <li key={k} className="obsidian-pill rounded-2xl p-3">
                  <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">{k}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 mt-1">{v}</div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <GlassButton
                onClick={() => setScreen(role === 'facilitator' ? 'ftoday' : 'today')}
              >
                Enter centre <ArrowRight className="w-4 h-4" />
              </GlassButton>
              {role === 'owner' && (
                <GlassButton variant="soft" onClick={() => setScreen('settings')}>
                  Bank &amp; QR settings
                </GlassButton>
              )}
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" /> Expanding atlas
          </div>
          {PLACEHOLDERS.map((p) => (
            <GlassCard
              key={p.name}
              padding="lg"
              className={`opacity-70 bg-gradient-to-br ${p.tone} border-white/10`}
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-lg text-slate-900 dark:text-white">{p.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{p.place}</p>
                </div>
                <GlassBadge tone="neutral">Soon</GlassBadge>
              </div>
            </GlassCard>
          ))}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-school tenancy stays future work — this gallery is the luxury shell for WSH
            operations today.
          </p>
        </div>
      </div>
    </div>
  )
}
