import { useId } from 'react'
import { cn } from '../../lib/utils/cn'
import './haeru.css'

export type HaeruExpression = 'happy' | 'calm' | 'bringing'

export interface HaeruEyeOffset {
  x: number
  y: number
}

export interface HaeruCharacterProps {
  expression?: HaeruExpression
  size?: number
  animate?: boolean
  className?: string
  label?: string
  /** Interactive: pupil look-at offset in px */
  eyeOffset?: HaeruEyeOffset
  /** Interactive: cheek blush opacity 0–1 */
  blushOpacity?: number
  /** Interactive: happy crescent eyes (^ ^) */
  crescentEyes?: boolean
  /** Kept for API compatibility — paws lift slightly when true */
  wingHover?: boolean
  /** Interactive: sleepy idle face */
  sleepy?: boolean
}

/**
 * Haeru — chibi guardian kitten (not a potato hoodie).
 * Big round head · cream face · teal/violet soft suit · white sclera eyes.
 */
export default function HaeruCharacter({
  expression = 'happy',
  size = 200,
  animate = true,
  className,
  label,
  eyeOffset = { x: 0, y: 0 },
  blushOpacity,
  crescentEyes = false,
  wingHover = false,
  sleepy = false,
}: HaeruCharacterProps) {
  const uid = useId().replace(/:/g, '')
  const fur = `haeru-fur-${uid}`
  const face = `haeru-face-${uid}`
  const earInner = `haeru-ear-inner-${uid}`
  const iris = `haeru-iris-${uid}`
  const cheek = `haeru-cheek-${uid}`
  const softShadow = `haeru-soft-shadow-${uid}`
  const cheekBlur = `haeru-cheek-blur-${uid}`

  const aria =
    label ??
    (expression === 'bringing'
      ? 'Haeru bringing a new moment from school'
      : 'Haeru, your school companion')

  const bodyScale = expression === 'calm' || sleepy ? 0.98 : expression === 'bringing' ? 1.02 : 1
  const eyeScale = expression === 'bringing' && !sleepy ? 1.05 : 1
  const showCrescents = crescentEyes || sleepy
  const blush = blushOpacity ?? 0.7
  const pawLift = wingHover ? -4 : 0

  const mouthPath =
    expression === 'bringing' && !sleepy
      ? 'M 90 118 Q 100 128 110 118'
      : sleepy || expression === 'calm'
        ? 'M 94 120 Q 100 123 106 120'
        : 'M 92 119 Q 96 124 100 121 Q 104 124 108 119'

  return (
    <svg
      role="img"
      aria-label={aria}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={cn(
        'overflow-visible select-none',
        animate && 'haeru-luminous-root',
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft teal–violet suit (subtle shimmer, not rainbow candy) */}
        <linearGradient id={fur} x1="15%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="45%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>

        <radialGradient id={earInner} cx="40%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.55" />
        </radialGradient>

        {/* Cream / peach face — warm, not hot-pink blob */}
        <linearGradient id={face} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="55%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>

        <radialGradient id={iris} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>

        <radialGradient id={cheek} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#fb7185" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>

        <filter id={cheekBlur} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        <filter id={softShadow} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0f766e" floodOpacity="0.22" />
        </filter>
      </defs>

      <g
        className={cn(animate && expression === 'bringing' && !sleepy && 'haeru-bringing')}
        style={{
          transform: `scale(${bodyScale})`,
          transformOrigin: '100px 110px',
        }}
      >
        {/* Soft ground shadow */}
        <ellipse cx="100" cy="178" rx="42" ry="8" fill="#0f766e" opacity="0.12" />

        {/* ── Compact body (under head — not a potato sack) ── */}
        <g className={cn(animate && 'haeru-rainbow-cloth')} filter={`url(#${softShadow})`}>
          <ellipse cx="100" cy="148" rx="48" ry="32" fill={`url(#${fur})`} />
          {/* Belly patch */}
          <ellipse cx="100" cy="152" rx="26" ry="18" fill="#ecfeff" opacity="0.55" />
        </g>

        {/* ── Round head (chibi: head dominates) ── */}
        <g className={cn(animate && 'haeru-rainbow-cloth')}>
          {/* Left ear */}
          <path
            d="M 48 58 L 38 18 Q 58 22 68 48 Z"
            fill={`url(#${fur})`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
          <path d="M 50 52 L 44 28 Q 56 30 62 46 Z" fill={`url(#${earInner})`} />
          {/* Right ear */}
          <path
            d="M 152 58 L 162 18 Q 142 22 132 48 Z"
            fill={`url(#${fur})`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
          <path d="M 150 52 L 156 28 Q 144 30 138 46 Z" fill={`url(#${earInner})`} />

          {/* Head circle */}
          <circle cx="100" cy="88" r="58" fill={`url(#${fur})`} filter={`url(#${softShadow})`} />
          {/* Face plate — cream oval, inset so hood rim reads as fur edge */}
          <ellipse cx="100" cy="94" rx="44" ry="42" fill={`url(#${face})`} />
          {/* Soft forehead highlight */}
          <ellipse cx="100" cy="68" rx="28" ry="12" fill="#ffffff" opacity="0.45" />
        </g>

        {/* Cheeks */}
        <g className="haeru-pure-pink-face">
          <ellipse
            cx="68"
            cy="108"
            rx="12"
            ry="8"
            fill={`url(#${cheek})`}
            opacity={blush}
            filter={`url(#${cheekBlur})`}
          />
          <ellipse
            cx="132"
            cy="108"
            rx="12"
            ry="8"
            fill={`url(#${cheek})`}
            opacity={blush}
            filter={`url(#${cheekBlur})`}
          />
        </g>

        {/* ── Eyes: white sclera + violet iris (reads as cute, not void blobs) ── */}
        <g
          className={cn(animate && !showCrescents && 'haeru-kawaii-blink')}
          style={{ transform: `scale(${eyeScale})`, transformOrigin: '78px 90px' }}
        >
          {showCrescents ? (
            <path
              d="M 64 92 Q 78 78 92 92"
              fill="none"
              stroke="#312e81"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ) : (
            <g>
              <ellipse cx="78" cy="90" rx="16" ry="18" fill="#ffffff" />
              <g
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: 'transform 0.08s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <ellipse cx="78" cy="92" rx="10" ry="12" fill={`url(#${iris})`} />
                <circle cx="78" cy="92" r="4" fill="#0f172a" />
                <ellipse cx="82" cy="86" rx="3.5" ry="4.5" fill="#ffffff" opacity="0.95" />
                <circle cx="73" cy="98" r="1.6" fill="#ffffff" opacity="0.7" />
              </g>
            </g>
          )}
        </g>

        <g
          className={cn(animate && !showCrescents && 'haeru-kawaii-blink')}
          style={{
            transform: `scale(${eyeScale})`,
            transformOrigin: '122px 90px',
            animationDelay: '0.08s',
          }}
        >
          {showCrescents ? (
            <path
              d="M 108 92 Q 122 78 136 92"
              fill="none"
              stroke="#312e81"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ) : (
            <g>
              <ellipse cx="122" cy="90" rx="16" ry="18" fill="#ffffff" />
              <g
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: 'transform 0.08s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <ellipse cx="122" cy="92" rx="10" ry="12" fill={`url(#${iris})`} />
                <circle cx="122" cy="92" r="4" fill="#0f172a" />
                <ellipse cx="126" cy="86" rx="3.5" ry="4.5" fill="#ffffff" opacity="0.95" />
                <circle cx="117" cy="98" r="1.6" fill="#ffffff" opacity="0.7" />
              </g>
            </g>
          )}
        </g>

        {/* Nose + smile */}
        <ellipse cx="100" cy="112" rx="3" ry="2.2" fill="#9f1239" />
        <circle cx="100.8" cy="111.2" r="0.7" fill="#ffffff" opacity="0.65" />
        <path
          d={mouthPath}
          fill="none"
          stroke="#9f1239"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Tiny whisker hints */}
        <g opacity="0.35" stroke="#9f1239" strokeWidth="1.2" strokeLinecap="round">
          <path d="M 58 112 H 48" />
          <path d="M 58 116 H 46" />
          <path d="M 142 112 H 152" />
          <path d="M 142 116 H 154" />
        </g>

        {/* Paws */}
        <g
          className={cn('haeru-paws', animate && 'haeru-rainbow-cloth')}
          style={{
            transform: `translateY(${pawLift}px)`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          <ellipse
            cx="72"
            cy="168"
            rx="14"
            ry="9"
            fill={`url(#${fur})`}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1"
          />
          <ellipse
            cx="128"
            cy="168"
            rx="14"
            ry="9"
            fill={`url(#${fur})`}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1"
          />
          {/* Toe beans hint */}
          <circle cx="68" cy="170" r="2" fill="#fda4af" opacity="0.7" />
          <circle cx="72" cy="171" r="2" fill="#fda4af" opacity="0.7" />
          <circle cx="76" cy="170" r="2" fill="#fda4af" opacity="0.7" />
          <circle cx="124" cy="170" r="2" fill="#fda4af" opacity="0.7" />
          <circle cx="128" cy="171" r="2" fill="#fda4af" opacity="0.7" />
          <circle cx="132" cy="170" r="2" fill="#fda4af" opacity="0.7" />
        </g>
      </g>
    </svg>
  )
}
