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

/** Ultra-cute 3D luminous chromatic Haeru — hooded kitten, Octocat-inspired. */
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
  const faceChroma = `haeru-face-chroma-${uid}`
  const cheekBloom = `haeru-cheek-bloom-${uid}`
  const eyeDepth = `haeru-eye-depth-${uid}`
  const hoodDepth = `haeru-hood-depth-${uid}`
  const cheekBlur = `haeru-cheek-blur-${uid}`
  const earBounce = `haeru-ear-bounce-${uid}`

  const aria =
    label ??
    (expression === 'bringing'
      ? 'Haeru bringing a new moment from school'
      : 'Haeru, your school companion')

  const bodyScale = expression === 'calm' || sleepy ? 0.97 : expression === 'bringing' ? 1.03 : 1
  const eyeScale = expression === 'bringing' && !sleepy ? 1.08 : 1
  const showCrescents = crescentEyes || sleepy
  const blush = blushOpacity ?? 0.75
  const pawLift = wingHover ? -3 : 0

  const mouthPath =
    expression === 'bringing' && !sleepy
      ? 'M 92 134 Q 97 141 100 138 Q 103 141 108 134'
      : sleepy || expression === 'calm'
        ? 'M 95 136 Q 100 139 105 136'
        : 'M 94 135 Q 97 138 100 136 Q 103 138 106 135'

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
        <linearGradient id={faceChroma} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb3d1" className="haeru-stop-1" />
          <stop offset="45%" stopColor="#fed7aa" className="haeru-stop-2" />
          <stop offset="100%" stopColor="#ff6548" className="haeru-stop-3" />
        </linearGradient>

        <radialGradient id={cheekBloom} cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#ff7a59" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff9980" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={eyeDepth} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#191038" />
          <stop offset="60%" stopColor="#2e1b5c" />
          <stop offset="100%" stopColor="#4a2e85" />
        </linearGradient>

        <radialGradient id={earBounce} cx="50%" cy="70%" r="55%">
          <stop offset="0%" stopColor="#ffb3d1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#181326" stopOpacity="0" />
        </radialGradient>

        <filter id={cheekBlur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        <filter id={hoodDepth} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#090514" floodOpacity="0.5" />
        </filter>
      </defs>

      <g
        className={cn(animate && expression === 'bringing' && !sleepy && 'haeru-bringing')}
        style={{
          transform: `scale(${bodyScale})`,
          transformOrigin: '100px 100px',
        }}
      >
        {/* ── 1. OUTER HOOD & EARS (Velvet Obsidian) ── */}
        <path
          d="M 46 75
             C 40 45, 48 30, 62 34
             C 75 38, 86 52, 100 52
             C 114 52, 125 38, 138 34
             C 152 30, 160 45, 154 75
             C 166 100, 164 140, 150 168
             C 138 185, 118 190, 100 190
             C 82 190, 62 185, 50 168
             C 36 140, 34 100, 46 75 Z"
          fill="#181326"
          filter={`url(#${hoodDepth})`}
        />
        {/* Specular top rim */}
        <path
          d="M 58 48 C 72 42, 88 52, 100 52 C 112 52, 128 42, 142 48"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Ear inner recesses + warm bounce */}
        <path d="M 54 44 C 50 38, 56 36, 62 42 C 66 46, 68 55, 66 60 Z" fill="#100d1c" />
        <path d="M 54 44 C 50 38, 56 36, 62 42 C 66 46, 68 55, 66 60 Z" fill={`url(#${earBounce})`} />
        <path d="M 146 44 C 150 38, 144 36, 138 42 C 134 46, 132 55, 134 60 Z" fill="#100d1c" />
        <path
          d="M 146 44 C 150 38, 144 36, 138 42 C 134 46, 132 55, 134 60 Z"
          fill={`url(#${earBounce})`}
        />

        {/* ── 2. LUMINOUS CHROMATIC FACE ── */}
        <path
          d="M 64 88
             C 64 68, 80 58, 100 58
             C 120 58, 136 68, 136 88
             C 136 102, 146 114, 144 135
             C 142 155, 124 168, 100 168
             C 76 168, 58 155, 56 135
             C 54 114, 64 102, 64 88 Z"
          fill={`url(#${faceChroma})`}
          className={cn(animate && 'haeru-chroma-face')}
        />

        {/* Subsurface cheek / chin warm glow */}
        <path
          d="M 56 135 C 58 155, 76 168, 100 168 C 124 168, 142 155, 144 135 C 136 130, 64 130, 56 135 Z"
          fill={`url(#${cheekBloom})`}
          opacity={blush}
          filter={`url(#${cheekBlur})`}
          className={cn(animate && 'haeru-cheek-glow')}
        />

        {/* Soft cheek bloom dots */}
        <ellipse
          cx="72"
          cy="132"
          rx="14"
          ry="10"
          fill="#ff4d6d"
          opacity={blush * 0.45}
          filter={`url(#${cheekBlur})`}
        />
        <ellipse
          cx="128"
          cy="132"
          rx="14"
          ry="10"
          fill="#ff4d6d"
          opacity={blush * 0.45}
          filter={`url(#${cheekBlur})`}
        />

        {/* ── 3. LIQUID COSMIC EYES ── */}
        <g
          className={cn(animate && !showCrescents && 'haeru-eye-left')}
          style={{
            transform: `scale(${eyeScale})`,
            transformOrigin: '80px 115px',
          }}
        >
          {showCrescents ? (
            <path
              d="M 68 118 Q 80 106 92 118"
              fill="none"
              stroke="#2e1b5c"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ) : (
            <>
              <ellipse cx="80" cy="115" rx="13" ry="18" fill={`url(#${eyeDepth})`} />
              <g
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: 'transform 0.06s ease-out',
                }}
              >
                <ellipse cx="84" cy="108" rx="4.5" ry="6.5" fill="#ffffff" opacity="0.95" />
                <circle cx="75" cy="122" r="2.2" fill="#ffffff" opacity="0.65" />
              </g>
            </>
          )}
        </g>

        <g
          className={cn(animate && !showCrescents && 'haeru-eye-right')}
          style={{
            transform: `scale(${eyeScale})`,
            transformOrigin: '120px 115px',
          }}
        >
          {showCrescents ? (
            <path
              d="M 108 118 Q 120 106 132 118"
              fill="none"
              stroke="#2e1b5c"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ) : (
            <>
              <ellipse cx="120" cy="115" rx="13" ry="18" fill={`url(#${eyeDepth})`} />
              <g
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: 'transform 0.06s ease-out',
                }}
              >
                <ellipse cx="124" cy="108" rx="4.5" ry="6.5" fill="#ffffff" opacity="0.95" />
                <circle cx="115" cy="122" r="2.2" fill="#ffffff" opacity="0.65" />
              </g>
            </>
          )}
        </g>

        {/* ── 4. TRUFFLE NOSE & KITTEN MOUTH ── */}
        <ellipse cx="100" cy="128" rx="3.2" ry="2.4" fill="#201535" />
        <circle cx="100.8" cy="127.3" r="0.8" fill="#ffffff" opacity="0.5" />

        <path
          d={mouthPath}
          fill="none"
          stroke="#221738"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── 5. PEEKING PAWS ── */}
        <g
          className="haeru-paws"
          style={{
            transform: `translateY(${pawLift}px)`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          <ellipse
            cx="68"
            cy="180"
            rx="10"
            ry="7"
            fill="#181326"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <ellipse cx="65" cy="181" rx="1.2" ry="2" fill="#100d1c" opacity="0.5" />
          <ellipse cx="68" cy="182" rx="1.2" ry="2" fill="#100d1c" opacity="0.5" />
          <ellipse cx="71" cy="181" rx="1.2" ry="2" fill="#100d1c" opacity="0.5" />
          <ellipse
            cx="132"
            cy="180"
            rx="10"
            ry="7"
            fill="#181326"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <ellipse cx="129" cy="181" rx="1.2" ry="2" fill="#100d1c" opacity="0.5" />
          <ellipse cx="132" cy="182" rx="1.2" ry="2" fill="#100d1c" opacity="0.5" />
          <ellipse cx="135" cy="181" rx="1.2" ry="2" fill="#100d1c" opacity="0.5" />
        </g>
      </g>
    </svg>
  )
}
