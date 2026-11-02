import { cn } from '../../lib/utils/cn'
import HaeruAvatar from './HaeruAvatar'

export interface HaeruLogoProps {
  showTagline?: boolean
  className?: string
}

export default function HaeruLogo({ showTagline = false, className }: HaeruLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
      <HaeruAvatar size="sm" expression="happy" />
      <div className="min-w-0 leading-tight">
        <div className="display font-bold tracking-tight text-teal-700 dark:text-teal-300 text-base lowercase">
          haeru
        </div>
        {showTagline ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            watches over every day
          </p>
        ) : null}
      </div>
    </div>
  )
}
