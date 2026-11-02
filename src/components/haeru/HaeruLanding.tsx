import { useEffect, useState } from 'react'
import { useAppStore } from '../../lib/store/appStore'
import type { Role } from '../../types/enterprise'
import { GlassCard } from '../ui'
import { cn } from '../../lib/utils/cn'
import HaeruCharacter from './HaeruCharacter'
import HaeruPortalBadge, { type HaeruPersona } from './HaeruPortalBadge'
import './haeru.css'

const TILES: Array<{
  persona: HaeruPersona
  role: Exclude<Role, 'signin' | 'landing'>
  label: string
  sub: string
}> = [
  { persona: 'owner', role: 'owner', label: 'Director Portal', sub: 'Owner · Director' },
  {
    persona: 'facilitator',
    role: 'facilitator',
    label: 'Facilitator Hub',
    sub: 'Teachers & Carers',
  },
  { persona: 'parent', role: 'parent', label: 'Family Portal', sub: 'Parents & Guardians' },
]

export default function HaeruLanding() {
  const { setRole } = useAppStore()
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div
      className={cn(
        'min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden',
        'bg-gradient-to-b from-emerald-50 via-teal-50 to-amber-50',
        'dark:from-slate-950 dark:via-slate-900 dark:to-teal-950',
      )}
    >
      <div className="relative flex flex-col items-center text-center max-w-3xl w-full">
        {/* Orbiting sparkle dots */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'absolute haeru-orbit',
                i === 1 && 'haeru-orbit-delay-1',
                i === 2 && 'haeru-orbit-delay-2',
              )}
              style={{ width: 220 + i * 40, height: 220 + i * 40 }}
            >
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 text-emerald-500/70 dark:text-emerald-300/60 text-sm"
                style={{ transform: `translateX(${i * 8}px)` }}
              >
                ✦
              </span>
            </div>
          ))}
        </div>

        <div className={cn(!entered && 'haeru-entrance', 'relative z-10')}>
          <HaeruCharacter size={260} expression="happy" animate={entered} />
        </div>

        <h1 className="display font-bold tracking-tight lowercase text-4xl md:text-5xl text-slate-900 dark:text-white mt-2 relative z-10">
          haeru
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 relative z-10">
          Watches over every day at school.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 w-full mt-10 relative z-10">
          {TILES.map((tile) => (
            <button
              key={tile.persona}
              type="button"
              onClick={() => setRole(tile.role)}
              className="text-left group"
            >
              <GlassCard
                padding="lg"
                className="h-full space-y-3 transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98]"
              >
                <HaeruPortalBadge persona={tile.persona} />
                <div>
                  <b className="block text-slate-900 dark:text-white text-sm">{tile.label}</b>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{tile.sub}</span>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>

        <p className="mt-12 text-xs text-slate-400 dark:text-slate-500 relative z-10">
          Haeru · Demo centre Wangchuk&apos;s School of Heroes · Babesa, Thimphu
        </p>
      </div>
    </div>
  )
}
