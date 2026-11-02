import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import type { HaeruExpression } from '../haeru/HaeruCharacter'
import HaeruInteractive from '../haeru/HaeruInteractive'
import { haeruSounds } from '../../lib/audio/haeruSounds'
import { GlassButton, GlassCard } from '../ui'
import { cn } from '../../lib/utils/cn'
import '../haeru/haeru.css'

const CHAPTER_MS = 5000

const EASTER_EGGS = [
  "Tashi says: 'Haeru, look at my drawing!' 🎨",
  'Tr. Sonam confirmed today’s reflection in 1 tap!',
  "100% child-scoped. No other parent sees Tashi’s day.",
]

type Chapter = {
  id: 0 | 1 | 2 | 3
  time: string
  scrubber: string
  expression: HaeruExpression
  quote: string
  badge: string
  cardTitle: string
  tags: string[]
}

const CHAPTERS: Chapter[] = [
  {
    id: 0,
    time: '8:30 AM',
    scrubber: '🌅 8:30 AM · Arrival',
    expression: 'happy',
    quote:
      'Kuzu Zangpo La! Tashi arrived at 8:32 AM. Shoes in cubby, warm suja & porridge eaten. Ready for a bright day!',
    badge: 'Morning Check-in',
    cardTitle: 'Arrival & care logged',
    tags: ['Arrival: 8:32 AM', 'Breakfast: Porridge 🥣', 'Mood: Radiant 😊'],
  },
  {
    id: 1,
    time: '11:00 AM',
    scrubber: '🧩 11:00 AM · Wonder',
    expression: 'bringing',
    quote:
      'Look what Tashi built! A 6-block wooden bridge. Tr. Sonam recorded a 10s voice note — Haeru Voice AI mapped it to ELDS Milestone 4.2!',
    badge: 'ELDS Observation',
    cardTitle: 'Approaches to Learning · Achieved (ap)',
    tags: ['Domain: Approaches', 'Rating: ap 🌿', 'Haeru Voice AI'],
  },
  {
    id: 2,
    time: '1:15 PM',
    scrubber: '😴 1:15 PM · Rest',
    expression: 'calm',
    quote:
      'Shhh… quiet time in the Kindergarten room. 45-minute cozy nap after lunch. Recharging little heroes.',
    badge: 'Rest & Wellbeing',
    cardTitle: 'Nap & lunch snapshot',
    tags: ['Lunch: Rice & Ema Datshi 🍚', 'Nap: 45 min 😴', 'Toileting: Independent 🚽'],
  },
  {
    id: 3,
    time: '3:30 PM',
    scrubber: '🔒 3:30 PM · Delivery',
    expression: 'bringing',
    quote:
      'Director Choki verified today’s notes! Delivering Tashi’s private reflection directly to Mummy Deki. Zero other eyes see this.',
    badge: 'Private Delivery',
    cardTitle: 'Child-scoped to Deki Choden',
    tags: ['Delivered 📱', 'Child-Scoped 🔒', 'Director confirmed ✅'],
  },
]

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Interactive 4-chapter "A Day with Haeru" hero story — Tashi at WSH Thimphu. */
export default function HaeruStoryHero() {
  const [currentChapter, setCurrentChapter] = useState<0 | 1 | 2 | 3>(0)
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion())
  const [progress, setProgress] = useState(0)
  const [interactiveQuote, setInteractiveQuote] = useState<string | null>(null)
  const [bounce, setBounce] = useState(false)
  const eggTimer = useRef<number | null>(null)
  const chapter = CHAPTERS[currentChapter]

  const jumpTo = useCallback((idx: 0 | 1 | 2 | 3) => {
    setCurrentChapter(idx)
    setProgress(0)
    setInteractiveQuote(null)
  }, [])

  useEffect(() => {
    if (!isPlaying || interactiveQuote) return
    const started = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const elapsed = now - started
      const pct = Math.min(100, (elapsed / CHAPTER_MS) * 100)
      setProgress(pct)
      if (elapsed >= CHAPTER_MS) {
        setCurrentChapter((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3)
        setProgress(0)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, currentChapter, interactiveQuote])

  useEffect(() => {
    return () => {
      if (eggTimer.current) window.clearTimeout(eggTimer.current)
    }
  }, [])

  const onHaeruClick = () => {
    const note = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)]!
    setInteractiveQuote(note)
    setBounce(true)
    haeruSounds.playJoy()
    window.setTimeout(() => setBounce(false), 1200)
    if (eggTimer.current) window.clearTimeout(eggTimer.current)
    eggTimer.current = window.setTimeout(() => {
      setInteractiveQuote(null)
      eggTimer.current = null
    }, 3500)
  }

  const speech = interactiveQuote ?? chapter.quote

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-8">
        <div className="flex flex-col items-center gap-3 order-2 lg:order-1 w-full lg:w-auto">
          <div
            key={interactiveQuote ? 'egg' : `ch-${currentChapter}`}
            className="relative rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-teal-500/20 dark:border-teal-400/20 p-4 shadow-xl text-slate-800 dark:text-slate-100 max-w-md text-sm md:text-base leading-relaxed animate-[landingFadeUp_0.45s_ease-out]"
            aria-live="polite"
          >
            <p>{speech}</p>
            <span
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/90 dark:bg-slate-900/90 border-r border-b border-teal-500/20 dark:border-teal-400/20"
              aria-hidden
            />
          </div>

          <div
            className={cn(
              'relative rounded-[2rem] border border-emerald-400/20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl px-4 py-3',
              bounce && 'haeru-bringing',
            )}
          >
            <div className="absolute inset-0 scale-110 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />
            <HaeruInteractive
              size={200}
              expression={chapter.expression}
              label={`Haeru narrating chapter ${currentChapter + 1}`}
              showSoundToggle
              onCharacterClick={onHaeruClick}
            />
            <p className="relative text-center text-[10px] font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300 mt-1">
              Tap Haeru to interact ✦
            </p>
          </div>
        </div>

        <GlassCard
          key={`card-${currentChapter}`}
          padding="md"
          className="order-3 lg:order-2 w-full max-w-sm space-y-2 border border-slate-200/80 dark:border-white/10 shadow-lg hover:-translate-y-0.5 transition-transform animate-[landingFadeUp_0.45s_ease-out]"
        >
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="font-bold text-teal-700 dark:text-teal-300">{chapter.badge}</span>
            <span className="text-slate-500 dark:text-slate-400">{chapter.time}</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{chapter.cardTitle}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            {chapter.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
            Live moment on Haeru · Demo centre WSH Thimphu · Kindergarten
          </p>
        </GlassCard>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          {CHAPTERS.map((c) => {
            const active = c.id === currentChapter
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => jumpTo(c.id)}
                className={cn(
                  'relative px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-transform hover:-translate-y-0.5 overflow-hidden',
                  active
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-800 dark:text-teal-300'
                    : 'border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                {c.scrubber}
                {active && (
                  <span
                    className="absolute left-0 bottom-0 h-0.5 bg-teal-500/80 dark:bg-teal-300/80 transition-[width] duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex justify-center">
          <GlassButton
            variant="soft"
            className="!text-xs"
            onClick={() => setIsPlaying((p) => !p)}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Story
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play Story
              </>
            )}
          </GlassButton>
        </div>
      </div>
    </div>
  )
}
