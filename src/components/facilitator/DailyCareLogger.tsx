import { useState } from 'react'
import { CHILDREN } from '../../data/enterprise'
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

export function DailyCareLogger() {
  const { setScreen, openChild, showToast } = useAppStore()
  const nursery = CHILDREN.filter((c) => c.room === 'nursery')
  const [selected, setSelected] = useState(nursery[0]?.id)
  const [care, setCare] = useState<Record<CareKey, string>>({ ...DEFAULTS })

  const child = nursery.find((c) => c.id === selected) ?? nursery[0]

  return (
    <div className="space-y-6">
      <GlassCard padding="lg">
        <GlassBadge tone="ap">Nursery · Thursday, 9 October</GlassBadge>
        <h1 className="text-2xl text-slate-900 dark:text-white mt-3">Kuzuzangpo, Sonam 🌼</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          15 of 17 children are here. Six daily updates still need logging before pickup at 3 pm.
        </p>
      </GlassCard>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <GlassCard padding="lg" className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-slate-900 dark:text-white">Daily updates to log</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Meals · nap · mood · toileting</span>
          </div>
          {nursery.map((k, i) => (
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
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {i === 1 ? 'Arrived 9:20 am · late drop-off' : 'Arrived 8:10 am'}
                </span>
              </div>
              {!k.feedConsent && <GlassBadge tone="nya">No feed</GlassBadge>}
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
          ))}
        </GlassCard>

        <div className="space-y-4">
          <GlassCard padding="lg" className="space-y-4">
            <div>
              <h2 className="text-lg text-slate-900 dark:text-white">
                Log · {child?.name.split(' ')[0] ?? ''}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Today&apos;s care</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CARE_KEYS.map((c) => (
                <label key={c.key} className="obsidian-pill rounded-xl p-3 space-y-2">
                  <span className="text-2xl block text-center">{c.emoji}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block text-center">{c.label}</span>
                  <input
                    className="glass-input text-center text-xs"
                    value={care[c.key]}
                    onChange={(e) => setCare((prev) => ({ ...prev, [c.key]: e.target.value }))}
                  />
                </label>
              ))}
            </div>
            <GlassButton
              className="w-full"
              onClick={() => showToast(`Update saved for ${child?.name.split(' ')[0]}`)}
            >
              Save daily update
            </GlassButton>
          </GlassCard>

          <GlassCard padding="lg" className="space-y-2">
            <h2 className="text-slate-900 dark:text-white text-lg">Quick actions</h2>
            <GlassButton className="w-full" onClick={() => setScreen('post')}>
              Capture & post photos
            </GlassButton>
            <GlassButton variant="soft" className="w-full" onClick={() => setScreen('record')}>
              Record ELDS observations
            </GlassButton>
            <GlassButton variant="ghost" className="w-full" onClick={() => setScreen('voice-hub')}>
              Telegram audio AI
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
