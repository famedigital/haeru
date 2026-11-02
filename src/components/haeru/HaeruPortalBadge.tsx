import { cn } from '../../lib/utils/cn'
import HaeruCharacter from './HaeruCharacter'

export type HaeruPersona = 'owner' | 'facilitator' | 'parent' | 'caregiver'

const FILTER: Record<HaeruPersona, string> = {
  owner: 'hue-rotate(200deg) saturate(0.7)',
  facilitator: 'none',
  parent: 'hue-rotate(20deg) saturate(0.85)',
  caregiver: 'hue-rotate(240deg) saturate(0.6)',
}

export interface HaeruPortalBadgeProps {
  persona: HaeruPersona
  className?: string
}

/** One SVG character, four CSS filter persona tints. */
export default function HaeruPortalBadge({ persona, className }: HaeruPortalBadgeProps) {
  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      style={{ filter: FILTER[persona] }}
    >
      <HaeruCharacter
        size={64}
        expression="happy"
        animate={false}
        label={`Haeru · ${persona} portal`}
      />
    </div>
  )
}
