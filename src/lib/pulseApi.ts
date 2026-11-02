/**
 * Compatibility facade — all Pulse logic lives in lib/api/pulseApiServer.ts
 */
export {
  postObservationFromHermes as createObservationFromHermesRaw,
  postConfirmMoment,
  postObservationFromHermes,
  listParentMomentsForChild,
  listDeliveredMomentsForChildren,
  listAllDeliveredMoments,
  listPendingDirectorMoments,
  listPendingMoments,
  subscribePulseStore,
  getMoment,
  getObservation,
  PULSE_CHILD_ROSTER,
} from './api/pulseApiServer'

import {
  listParentMomentsForChild,
  postConfirmMoment,
  postObservationFromHermes,
} from './api/pulseApiServer'

/** Demo helper used by older call sites */
export function ingestVoiceAnalysis(input: {
  childName: string
  domain: string
  triggerDetected: string
  strategyUsed: string
  milestoneHit: string
  confidence: string
  transcription: string
  childId?: string
}) {
  return postObservationFromHermes({
    childId: input.childId,
    childName: input.childName,
    domain: input.domain,
    trigger: input.triggerDetected,
    strategy: input.strategyUsed,
    milestone: input.milestoneHit,
    confidence: input.confidence,
    source: 'voice' as const,
    transcription: input.transcription,
  })
}

export function confirmMoment(momentId: string) {
  return postConfirmMoment(momentId, { role: 'owner' })
}

export function getParentMomentsByChild(childId: string) {
  return listParentMomentsForChild(childId)
}
