import { useCallback, useEffect, useRef, useState } from 'react'
import { haeruSounds } from '../../lib/audio/haeruSounds'
import { cn } from '../../lib/utils/cn'
import HaeruCharacter, { type HaeruExpression } from './HaeruCharacter'
import './haeru.css'

type Particle = { id: number; emoji: string; x: number; dx: string }

export interface HaeruInteractiveProps {
  expression?: HaeruExpression
  size?: number
  className?: string
  label?: string
  showSoundToggle?: boolean
  onCharacterClick?: () => void
}

function reducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Living Haeru: eye-tracking, jelly squish, petting, idle sleep, Web Audio chirps. */
export default function HaeruInteractive({
  expression = 'happy',
  size = 220,
  className,
  label,
  showSoundToggle = true,
  onCharacterClick,
}: HaeruInteractiveProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [squish, setSquish] = useState(false)
  const [wiggle, setWiggle] = useState(false)
  const [crescentEyes, setCrescentEyes] = useState(false)
  const [sleepy, setSleepy] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [muted, setMuted] = useState(() => haeruSounds.isMuted())
  const [reduceMotion] = useState(() => reducedMotion())

  const clickTimes = useRef<number[]>([])
  const idleTimer = useRef<number | null>(null)
  const particleId = useRef(0)

  const resetIdle = useCallback(() => {
    setSleepy(false)
    if (idleTimer.current) window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => setSleepy(true), 12_000)
  }, [])

  useEffect(() => {
    resetIdle()
    const onMove = (e: MouseEvent) => {
      resetIdle()
      const el = rootRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.hypot(deltaX, deltaY)
      const maxDistance = 4.5
      const angle = Math.atan2(deltaY, deltaX)
      const clampedDistance = Math.min(distance / 45, maxDistance)
      const pupilX = Math.cos(angle) * clampedDistance
      const pupilY = Math.sin(angle) * (clampedDistance * 0.8)
      setEyeOffset({
        x: Math.max(-4.5, Math.min(4.5, pupilX)),
        y: Math.max(-3.5, Math.min(3.5, pupilY)),
      })
    }
    const onLeave = () => setEyeOffset({ x: 0, y: 0 })
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [resetIdle])

  const spawnParticle = (emoji: string) => {
    if (reduceMotion) return
    const id = ++particleId.current
    const dx = `${(Math.random() * 40 - 20).toFixed(0)}px`
    setParticles((prev) => [...prev, { id, emoji, x: 40 + Math.random() * 40, dx }])
    window.setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id))
    }, 950)
  }

  const onHoverEnter = () => {
    setHovered(true)
    haeruSounds.playChirp()
  }

  const onHoverLeave = () => setHovered(false)

  const onClick = () => {
    const now = Date.now()
    clickTimes.current = [...clickTimes.current.filter((t) => now - t < 1200), now]
    const streak = clickTimes.current.length

    if (!reduceMotion) {
      setSquish(true)
      window.setTimeout(() => setSquish(false), 550)
    }

    if (streak >= 3) {
      haeruSounds.playPurr()
      setCrescentEyes(true)
      if (!reduceMotion) {
        setWiggle(true)
        window.setTimeout(() => setWiggle(false), 700)
      }
      spawnParticle('💖')
      spawnParticle('🌸')
      spawnParticle('✦')
      spawnParticle('🌈')
      window.setTimeout(() => setCrescentEyes(false), 2200)
      clickTimes.current = []
    } else if (streak === 2) {
      haeruSounds.playChirp()
      spawnParticle('✦')
      spawnParticle('🌸')
      spawnParticle('✦')
    } else {
      haeruSounds.playPop()
      spawnParticle('💖')
    }

    onCharacterClick?.()
  }

  return (
    <div className={cn('relative inline-flex flex-col items-center gap-2', className)}>
      {showSoundToggle && (
        <button
          type="button"
          onClick={() => setMuted(!haeruSounds.toggleSound())}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors shadow-sm"
        >
          {muted ? '🔇 Sound Off' : '🔊 Sound On'}
        </button>
      )}

      <div
        ref={rootRef}
        role="button"
        tabIndex={0}
        aria-label={label ?? 'Interactive Haeru — tap to pet'}
        className={cn(
          'relative cursor-pointer select-none haeru-interactive-root outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 rounded-[2rem]',
          hovered && !reduceMotion && 'haeru-hover-lift',
          squish && 'haeru-squish',
          wiggle && 'haeru-wiggle',
        )}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
      >
        <HaeruCharacter
          size={size}
          expression={expression}
          animate
          label={label}
          eyeOffset={eyeOffset}
          blushOpacity={hovered ? 0.8 : 0.45}
          crescentEyes={crescentEyes}
          wingHover={hovered}
          sleepy={sleepy && !crescentEyes}
        />

        {sleepy && !crescentEyes && (
          <div className="absolute top-2 right-6 pointer-events-none text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span className="absolute haeru-zzz-1">z</span>
            <span className="absolute left-3 haeru-zzz-2">z</span>
            <span className="absolute left-6 haeru-zzz-3">z</span>
          </div>
        )}

        {particles.map((p) => (
          <span
            key={p.id}
            className="haeru-particle"
            style={{ left: `${p.x}%`, top: '30%', ['--dx' as string]: p.dx }}
            aria-hidden
          >
            {p.emoji}
          </span>
        ))}
      </div>
    </div>
  )
}
