import { CHILDREN, formatNu, PARENT_CHILD_ID } from '../../data/enterprise'
import { KINLEY_RADAR_SERIES } from '../../lib/elds/domains'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard, RadarChart3D } from '../ui'

export function DailyReflection({ caregiver = false }: { caregiver?: boolean }) {
  const { setScreen, openChild } = useAppStore()
  const child = CHILDREN.find((c) => c.id === PARENT_CHILD_ID)!

  return (
    <div className="space-y-6">
      <GlassCard padding="lg">
        <GlassBadge tone="ap">
          {child.name.split(' ')[0]} · Kindergarten
        </GlassBadge>
        <h1 className="text-2xl text-slate-900 dark:text-white mt-3">
          {child.name.split(' ')[0]} had a sunny day ☀️
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
          Checked in at 8:05 am. Ate all her lunch, napped 40 minutes, and spent the afternoon in
          the garden.
        </p>
      </GlassCard>

      {caregiver ? (
        <div className="obsidian-pill rounded-xl px-4 py-3 text-sm text-violet-700 dark:text-violet-200 border border-violet-400/30">
          You&apos;re an approved caregiver for {child.name.split(' ')[0]}. Pickup and medical
          details are shared. <b>Fees stay private to parents.</b>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['🍚', 'Lunch', 'Ate it all'],
              ['😴', 'Nap', '40 min'],
              ['😊', 'Mood', 'Cheerful'],
              ['🚽', 'Toilet', 'Independent'],
            ].map(([e, a, b]) => (
              <div key={a} className="obsidian-pill rounded-xl p-3 text-center space-y-1">
                <div className="text-2xl">{e}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{a}</div>
                <b className="text-slate-900 dark:text-white text-xs">{b}</b>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            &ldquo;Kinley helped plant the chilli seedlings and explained to her friends why they
            need sunlight.&rdquo; · <b className="text-emerald-700 dark:text-emerald-300">Kuenga Rinzin</b>
          </p>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard padding="lg">
            <h2 className="text-lg text-slate-900 dark:text-white mb-3">Coming up</h2>
            {[
              ['14', 'Oct', 'Blessed Rainy Day dance', '10 am · families welcome'],
              ['10', 'Oct', 'Parent–teacher meeting', '2:30 pm with Kuenga'],
            ].map(([d, m, t, s]) => (
              <div key={t} className="flex gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="obsidian-pill w-12 rounded-xl text-center py-1.5">
                  <div className="display text-lg text-slate-900 dark:text-white leading-none">{d}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{m}</div>
                </div>
                <div>
                  <b className="text-slate-900 dark:text-white text-sm">{t}</b>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{s}</div>
                </div>
              </div>
            ))}
          </GlassCard>
          <GlassCard padding="lg" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-slate-900 dark:text-white">Progress</h2>
              <button
                type="button"
                className="text-xs font-bold text-emerald-700 dark:text-emerald-300"
                onClick={() => openChild(child.id)}
              >
                Open profile →
              </button>
            </div>
            {!caregiver && (
              <button type="button" className="w-full text-left" onClick={() => setScreen('pprogress')}>
                <RadarChart3D
                  series={[KINLEY_RADAR_SERIES[2]!]}
                  size={240}
                  title="Progress snapshot"
                  showWindowFilter={false}
                />
              </button>
            )}
            {caregiver && (
              <GlassButton variant="soft" className="w-full" onClick={() => setScreen('pprogress')}>
                See development domains
              </GlassButton>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
