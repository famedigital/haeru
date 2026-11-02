import type { ObservationWindow, RadarSeries, RatingLevel } from '../../types/enterprise'

export const ELDS_DOMAINS = [
  'Physical & motor',
  'Social & emotional',
  'Language & communication',
  'Approaches to learning',
  'Cognition & knowledge',
  'Spiritual, moral & cultural',
] as const

export type EldsDomainStyleKey =
  | 'physical'
  | 'social'
  | 'language'
  | 'approaches'
  | 'cognitive'
  | 'spiritual'

/** Prismatic Himalayan domain tints — map 1:1 to MoESD ELDS 2019 domains */
export const DOMAIN_STYLES: Record<
  EldsDomainStyleKey,
  { bg: string; border: string; text: string; badge: string }
> = {
  physical: {
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/40',
    text: 'text-rose-500 dark:text-rose-300',
    badge: 'bg-rose-400/15',
  },
  social: {
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/40',
    text: 'text-amber-600 dark:text-amber-300',
    badge: 'bg-amber-400/15',
  },
  language: {
    bg: 'bg-lime-400/10',
    border: 'border-lime-400/40',
    text: 'text-lime-600 dark:text-lime-300',
    badge: 'bg-lime-400/15',
  },
  approaches: {
    bg: 'bg-teal-400/10',
    border: 'border-teal-400/40',
    text: 'text-teal-600 dark:text-teal-300',
    badge: 'bg-teal-400/15',
  },
  cognitive: {
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/40',
    text: 'text-blue-600 dark:text-blue-300',
    badge: 'bg-blue-400/15',
  },
  spiritual: {
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/40',
    text: 'text-violet-600 dark:text-violet-300',
    badge: 'bg-violet-400/15',
  },
}

export const ELDS_DOMAIN_STYLE_KEYS: EldsDomainStyleKey[] = [
  'physical',
  'social',
  'language',
  'approaches',
  'cognitive',
  'spiritual',
]

export const OBSERVATION_WINDOWS: ObservationWindow[] = [
  'Feb–Mar',
  'May–Jun',
  'Aug–Sep',
  'Oct–Nov',
]

export const RATING_LABEL: Record<RatingLevel, string> = {
  ap: 'Achieved & progressing',
  bl: 'Beginning to learn',
  nya: 'Not yet',
}

export const RATING_SHORT: Record<RatingLevel, string> = {
  ap: 'Achieved',
  bl: 'Beginning',
  nya: 'Not yet',
}

/** Demo radar series for Kinley — multi-window comparison */
export const KINLEY_RADAR_SERIES: RadarSeries[] = [
  {
    window: 'Feb–Mar',
    color: '#94a3b8',
    dash: true,
    values: [0.45, 0.5, 0.4, 0.55, 0.42, 0.6],
  },
  {
    window: 'May–Jun',
    color: '#F59E0B',
    values: [0.6, 0.62, 0.55, 0.66, 0.58, 0.7],
  },
  {
    window: 'Aug–Sep',
    color: '#10B981',
    fill: 'rgba(16, 185, 129, 0.18)',
    dots: true,
    values: [0.76, 0.7, 0.72, 0.8, 0.68, 0.82],
  },
]

export const ELDS_MOTTO =
  'Observed, never tested. Children are never ranked.'
