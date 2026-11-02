/**
 * Tenant-partitioned Haeru Voice AI moment store (Director gate before parent delivery).
 */

import { prisma } from './prisma'
import type { HermesObservation } from './hermesExtractor'
import { deliverToParents } from './hermesParentDelivery'

export async function saveHermesMoment(opts: {
  obs: HermesObservation
  centreId: string
  telegramChatId?: string
  telegramMsgId?: number
  facilitatorTgId?: string
}) {
  const { obs, centreId, telegramChatId, telegramMsgId, facilitatorTgId } = opts

  let childId = obs.childId
  if (childId) {
    const owned = await prisma.child.findFirst({ where: { id: childId, centreId } })
    if (!owned) childId = undefined
  }
  if (!childId) {
    const byName = await prisma.child.findFirst({
      where: {
        centreId,
        name: { equals: obs.childName },
      },
    })
    childId = byName?.id
  }

  const row = await prisma.hermesMoment.create({
    data: {
      centreId,
      telegramChatId: telegramChatId ?? null,
      telegramMsgId: telegramMsgId ?? null,
      transcription: obs.transcription ?? null,
      rawHermesJson: JSON.stringify(obs),
      childId: childId ?? null,
      childName: obs.childName,
      domain: obs.domain,
      source: obs.source,
      status: 'pending_director',
      facilitatorTgId: facilitatorTgId ?? null,
    },
  })

  return row
}

export async function confirmMomentAndDeliver(momentId: string, confirmedById?: string) {
  const moment = await prisma.hermesMoment.findUnique({ where: { id: momentId } })
  if (!moment) return { ok: false as const, error: 'Moment not found' }
  if (moment.status === 'delivered') return { ok: true as const, moment }
  if (moment.status === 'rejected') return { ok: false as const, error: 'Moment was rejected' }

  const updated = await prisma.hermesMoment.update({
    where: { id: momentId },
    data: {
      status: 'delivered',
      confirmedAt: new Date(),
      confirmedById: confirmedById ?? null,
    },
  })

  if (updated.childId) {
    let obs: HermesObservation | null = null
    try {
      obs = JSON.parse(updated.rawHermesJson) as HermesObservation
    } catch {
      obs = null
    }
    await deliverToParents(updated.childId, obs, updated)
  }

  return { ok: true as const, moment: updated }
}

export async function rejectMoment(momentId: string, confirmedById?: string) {
  const moment = await prisma.hermesMoment.findUnique({ where: { id: momentId } })
  if (!moment) return { ok: false as const, error: 'Moment not found' }
  const updated = await prisma.hermesMoment.update({
    where: { id: momentId },
    data: {
      status: 'rejected',
      confirmedAt: new Date(),
      confirmedById: confirmedById ?? null,
    },
  })
  return { ok: true as const, moment: updated }
}

export async function listPendingDirector(centreId: string) {
  return prisma.hermesMoment.findMany({
    where: { centreId, status: 'pending_director' },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export async function listDeliveredForChild(childId: string) {
  return prisma.hermesMoment.findMany({
    where: { childId, status: 'delivered' },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}
