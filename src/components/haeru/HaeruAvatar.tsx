import { cn } from '../../lib/utils/cn'
import HaeruCharacter, { type HaeruExpression } from './HaeruCharacter'
import './haeru.css'

const SIZE_PX = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
} as const

export interface HaeruAvatarProps {
  size?: keyof typeof SIZE_PX
  expression?: HaeruExpression
  pulse?: boolean
  className?: string
  label?: string
}

export default function HaeruAvatar({
  size = 'md',
  expression = 'happy',
  pulse = false,
  className,
  label,
}: HaeruAvatarProps) {
  const px = SIZE_PX[size]
  const aria =
    label ??
    (expression === 'bringing'
      ? 'Haeru bringing a new moment from school'
      : 'Haeru, your school companion')

  return (
    <div
      role="img"
      aria-label={aria}
      className={cn(
        'rounded-full overflow-hidden bg-transparent inline-flex items-center justify-center shrink-0',
        pulse && 'haeru-pulse',
        className,
      )}
      style={{ width: px, height: px }}
    >
      <HaeruCharacter
        size={Math.round(px * 1.15)}
        expression={expression}
        animate={!pulse}
        label={aria}
        className="-mt-[6%] pointer-events-none"
      />
    </div>
  )
}
