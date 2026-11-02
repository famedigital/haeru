import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** @deprecated Tilt/rotation is forbidden — use interactive for soft elevation */
  tilt?: boolean
  /** Soft vertical lift on hover + press depression (no rotate) */
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

const PAD: Record<NonNullable<GlassCardProps['padding']>, string> = {
  none: '',
  sm: 'p-3 md:p-4',
  md: 'p-4 md:p-5',
  lg: 'p-5 md:p-6',
}

export function GlassCard({
  children,
  tilt: _tilt = false,
  interactive = false,
  padding = 'md',
  className,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-panel-3d rounded-2xl relative',
        interactive &&
          'hover:-translate-y-0.5 hover:shadow-[var(--glass-hover-shadow)] active:scale-[0.985] active:translate-y-0 transition-all duration-300 ease-out cursor-pointer',
        PAD[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
