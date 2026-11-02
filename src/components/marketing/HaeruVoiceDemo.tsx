import { useEffect, useState } from 'react'
import { Check, Play, Pause } from 'lucide-react'
import { haeruSounds } from '../../lib/audio/haeruSounds'
import { cn } from '../../lib/utils/cn'
import { GlassBadge, GlassCard } from '../ui'

type ScenarioId = 'building' | 'circle' | 'lunch'

type EldsBadge = {
  domain: string
  detail: string
  rating: 'ap' | 'bl' | 'nya'
  ratingLabel: string
}

type Scenario = {
  id: ScenarioId
  tab: string
  duration: string
  transcript: string
  child: string
  room: string
  care: string
  elds: EldsBadge[]
  parentView: string
  director: string
  photoCaption: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'building',
    tab: '1. Building & Sharing',
    duration: '0:12',
    transcript:
      'Kuzu Zangpo! During morning block play, Tashi Wangchuk built a high arch bridge and counted five blocks out loud. When a classmate asked to play, he hesitated but shared his blue block. Also, Tashi ate all his pumpkin soup and red rice at lunch.',
    child: 'Tashi Wangchuk · Kindergarten',
    room: 'Age 4 · WSH Thimphu',
    care: '🍚 Meals: Full portion · 😊 Mood: Radiant',
    elds: [
      {
        domain: 'Cognition & General Knowledge',
        detail: 'Counting blocks up to 5',
        rating: 'ap',
        ratingLabel: 'Achieved (ap)',
      },
      {
        domain: 'Social & Emotional',
        detail: 'Shares materials after a pause',
        rating: 'ap',
        ratingLabel: 'Achieved (ap)',
      },
    ],
    parentView:
      'Tashi counted 5 blocks and shared with a classmate today. Delivered to Mummy Deki with 100% child-scoped privacy.',
    director: 'Confirmed by Director Karma Dechen in 1 tap',
    photoCaption: 'Block arch · morning play',
  },
  {
    id: 'circle',
    tab: '2. Circle Time Dzongkha',
    duration: '0:10',
    transcript:
      'During circle time, Tashi Wangchuk recited the Dzongkha greeting with clear pronunciation and helped a classmate with Zhugzhuk posture. He listened carefully to the story about Losar.',
    child: 'Tashi Wangchuk · Kindergarten',
    room: 'Age 4 · Language circle',
    care: '😊 Mood: Focused · 🗣️ Expressive · Engaged',
    elds: [
      {
        domain: 'Language & Communication',
        detail: 'Dzongkha greeting & story listening',
        rating: 'ap',
        ratingLabel: 'Achieved (ap)',
      },
      {
        domain: 'Spiritual & Cultural',
        detail: 'Driglam Namzha posture (Zhugzhuk)',
        rating: 'bl',
        ratingLabel: 'Beginning (bl)',
      },
    ],
    parentView:
      'Tashi practiced Dzongkha greetings and listened to a Losar story. Delivered to Mummy Deki with 100% child-scoped privacy.',
    director: 'Confirmed by Director Karma Dechen in 1 tap',
    photoCaption: 'Circle time · Dzongkha bridge',
  },
  {
    id: 'lunch',
    tab: '3. Lunch & Cozy Nap',
    duration: '0:09',
    transcript:
      'At lunch Tashi finished his red rice and ema datshi, drank water, then settled for a cozy 45-minute nap. He woke cheerful and ready for outdoor play.',
    child: 'Tashi Wangchuk · Kindergarten',
    room: 'Age 4 · Care routine',
    care: '🍚 Meals: Full · 😴 Nap: 45m · 😊 Mood: Cheerful',
    elds: [
      {
        domain: 'Physical Development & Health',
        detail: 'Independent meal & rest routine',
        rating: 'ap',
        ratingLabel: 'Achieved (ap)',
      },
    ],
    parentView:
      'Tashi finished lunch and napped peacefully for 45 minutes. Delivered to Mummy Deki with 100% child-scoped privacy.',
    director: 'Confirmed by Director Karma Dechen in 1 tap',
    photoCaption: 'Quiet rest · cozy mat',
  },
]

function WaveBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-5" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'w-0.5 rounded-full bg-sky-500 dark:bg-sky-400 origin-bottom',
            playing ? 'haeru-voice-wave' : 'h-1.5 opacity-60',
          )}
          style={
            playing
              ? {
                  animationDelay: `${i * 0.05}s`,
                  height: `${6 + ((i * 7) % 12)}px`,
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}

/** Interactive Telegram ↔ Haeru Voice AI simulator (customer-facing; no Hermes branding). */
export default function HaeruVoiceDemo() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('building')
  const [playing, setPlaying] = useState(false)
  const [reveal, setReveal] = useState(0)
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]!

  useEffect(() => {
    setPlaying(false)
    setReveal(0)
    const timers = [120, 320, 520, 720, 920].map((ms, i) =>
      window.setTimeout(() => setReveal(i + 1), ms),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [scenarioId])

  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => setPlaying(false), 1800)
    return () => window.clearTimeout(t)
  }, [playing])

  const onPlay = () => {
    const next = !playing
    setPlaying(next)
    if (next) {
      haeruSounds.playChirp()
      window.setTimeout(() => haeruSounds.playPop(), 220)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Haeru Voice scenarios">
        {SCENARIOS.map((s) => {
          const active = s.id === scenarioId
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setScenarioId(s.id)}
              className={cn(
                'px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-colors',
                active
                  ? 'bg-teal-500/15 border-teal-500/35 text-teal-800 dark:text-teal-300'
                  : 'border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              {s.tab}
            </button>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 lg:gap-5 items-stretch">
        {/* Telegram mockup */}
        <GlassCard
          padding="none"
          className="overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-[#2481cc]/10 dark:bg-[#2481cc]/20 border-b border-slate-200/70 dark:border-white/10">
            <div className="size-9 rounded-full bg-gradient-to-br from-teal-400 to-violet-400 flex items-center justify-center text-slate-900 text-xs font-bold shadow-sm">
              H
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                @HaeruEccdBot · Haeru Assistant
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">online · Telegram</p>
            </div>
          </div>

          <div className="flex-1 bg-slate-100/80 dark:bg-slate-950/50 p-4 space-y-3 min-h-[320px]">
            <p className="text-center text-[10px] text-slate-500 dark:text-slate-400">
              Tr. Kuenzang · Kindergarten · today
            </p>

            <div className="max-w-[92%] ml-auto rounded-2xl rounded-br-md bg-[#effdde] dark:bg-emerald-950/50 border border-emerald-500/20 px-3 py-2.5 space-y-2 shadow-sm">
              <button
                type="button"
                onClick={onPlay}
                className="flex items-center gap-2.5 w-full text-left rounded-xl bg-white/70 dark:bg-slate-900/60 px-2.5 py-2 border border-emerald-500/15"
                aria-label={playing ? 'Pause voice note' : 'Play voice note'}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-sky-500 text-slate-900 shrink-0">
                  {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </span>
                <WaveBars playing={playing} />
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 ml-auto">
                  {scenario.duration}
                </span>
              </button>
              <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                🎙️ {scenario.duration} · Voice Note from Tr. Kuenzang
              </p>
              <p
                key={scenario.id + '-tx'}
                className="text-xs leading-relaxed text-slate-800 dark:text-slate-100 animate-[landingFadeUp_0.35s_ease-out]"
              >
                “{scenario.transcript}”
              </p>
            </div>

            <div className="max-w-[85%] ml-auto rounded-2xl rounded-br-md overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 shadow-sm">
              <div
                className="h-24 bg-gradient-to-br from-amber-200/80 via-rose-200/70 to-sky-200/80 dark:from-amber-500/30 dark:via-rose-500/25 dark:to-sky-500/30 flex items-end p-2"
                aria-hidden
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100">
                  📷 {scenario.photoCaption}
                </span>
              </div>
              <div className="px-3 py-2 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-300">
                  EXIF Location Scrubbed ✓
                </span>
              </div>
            </div>

            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/10 px-3 py-2 text-xs text-slate-700 dark:text-slate-200">
              Got it, Tr. Kuenzang — extracting care + MoESD ELDS for Director review…
            </div>
          </div>
        </GlassCard>

        {/* Haeru Voice AI extraction */}
        <GlassCard
          padding="md"
          className="border border-slate-200/80 dark:border-white/10 shadow-lg space-y-3 text-left"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
              ⚡ Haeru Voice AI · Real-time
            </p>
            <GlassBadge tone="violet">Under 3s</GlassBadge>
          </div>

          <div
            className={cn(
              'rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-slate-950/40 px-3 py-2.5 transition-opacity duration-300',
              reveal >= 1 ? 'opacity-100' : 'opacity-30',
            )}
          >
            <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Child identified
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{scenario.child}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">{scenario.room}</p>
          </div>

          <div
            className={cn(
              'rounded-xl border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/5 px-3 py-2.5 transition-opacity duration-300',
              reveal >= 2 ? 'opacity-100' : 'opacity-30',
            )}
          >
            <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Care extracted
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{scenario.care}</p>
          </div>

          <div
            className={cn(
              'space-y-2 transition-opacity duration-300',
              reveal >= 3 ? 'opacity-100' : 'opacity-30',
            )}
          >
            <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              MoESD ELDS 2019
            </p>
            {scenario.elds.map((e) => (
              <div
                key={e.domain + e.detail}
                className="rounded-xl border border-teal-500/20 dark:border-teal-400/20 bg-teal-500/5 px-3 py-2"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Domain: {e.domain}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{e.detail}</p>
                <p className="mt-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                  Rating: {e.ratingLabel}
                </p>
              </div>
            ))}
          </div>

          <div
            className={cn(
              'rounded-xl border border-violet-500/20 dark:border-violet-400/20 bg-violet-500/5 px-3 py-2.5 transition-opacity duration-300',
              reveal >= 4 ? 'opacity-100' : 'opacity-30',
            )}
          >
            <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Parent view preview
            </p>
            <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-100">
              {scenario.parentView}
            </p>
          </div>

          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-800 dark:text-emerald-300 transition-opacity duration-300',
              reveal >= 5 ? 'opacity-100' : 'opacity-30',
            )}
          >
            <Check className="w-3.5 h-3.5" />
            {scenario.director}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
