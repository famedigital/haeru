import type { ReactNode } from 'react'
import type { RatingLevel } from '../../types/enterprise'
import { RATING_SHORT } from '../../lib/elds/domains'
import { cn } from '../../lib/utils/cn'

interface GlassBadgeProps {
  rating?: RatingLevel
  children?: ReactNode
  className?: string
  tone?: 'ap' | 'bl' | 'nya' | 'violet' | 'neutral' | 'present' | 'absent' | 'late' | 'pending' | 'paid' | 'overdue'
}

const TONE: Record<NonNullable<GlassBadgeProps['tone']>, string> = {
  ap: 'badge-present',
  bl: 'badge-late',
  nya: 'badge-absent',
  present: 'badge-present',
  absent: 'badge-absent',
  late: 'badge-late',
  pending: 'badge-pending',
  paid: 'badge-paid',
  overdue: 'badge-overdue',
  violet: 'badge-overdue',
  neutral:
    'bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200',
}

export function GlassBadge({
  rating,
  children,
  className,
  tone,
}: GlassBadgeProps) {
  const resolved = tone ?? rating ?? 'neutral'
  const label = children ?? (rating ? RATING_SHORT[rating] : null)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap',
        TONE[resolved],
        className,
      )}
    >
      {label}
    </span>
  )
}
