/**
 * Legacy mock module — intentionally empty.
 * Live children, guardians, and progress come from /api/* + Prisma.
 */
import type { Child, Guardian, Observation } from '../types'

export const CHILDREN_DATA: Child[] = []
export const GUARDIANS_DATA: Guardian[] = []
export const OBSERVATIONS_DATA: Observation[] = []
export const DEMO_PARENT_GUARDIAN_ID = ''
