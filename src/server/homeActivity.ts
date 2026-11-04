/**
 * Child-scoped home practice: one open activity, parent Done (web/Telegram),
 * Director confirm before ELDS progress moves.
 */

import { prisma } from './prisma'
import { HomeActivityDoneSchema, HomeActivityReviewSchema } from '../lib/api/schemas'
import { homeCopyForDomain } from './homeActivityCopy'

const OPEN = 'offered'
const DONE = 'done'
const EXPIRED = 'expired'
const CONFIRMED = 'progress_confirmed'
const DISMISSED = 'dismissed'

const TTL_MS = 7 * 24 * 60 * 60 * 1000

type Actor = {
  id: string
  role: string
  centreId: string
  room: string | null
}

function dto(
  row: {
    id: string
    childId: string
    centreId: string
    momentId: string | null
    domain: string
    title: string
    instruction: string
    status: string
    effort: string | null
    howWent: string | null
    howWentSource: string | null
    completedAt: Date | null
    expiresAt: Date
    confirmedAt: Date | null
    createdAt: Date
    child?: { name: string; room: string }
  },
) {
  return {
    id: row.id,
    childId: row.childId,
    childName: row.child?.name,
    room: row.child?.room,
    centreId: row.centreId,
    momentId: row.momentId,
    domain: row.domain,
    title: row.title,
    instruction: row.instruction,
    status: row.status,
    effort: row.effort,
    howWent: row.howWent,
    howWentSource: row.howWentSource,
    completedAt: row.completedAt?.toISOString() ?? null,
    expiresAt: row.expiresAt.toISOString(),
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function expireOffered() {
  await prisma.homeActivity.updateMany({
    where: { status: OPEN, expiresAt: { lt: new Date() } },
    data: { status: EXPIRED },
  })
}

async function guardianOf(userId: string, childId: string) {
  return prisma.childGuardian.findFirst({ where: { userId, childId } })
}

export async function offerHomeActivityFromMoment(opts: {
  childId: string
  childName: string
  centreId: string
  momentId: string
  domain: string
}) {
  await expireOffered()
  const open = await prisma.homeActivity.findFirst({
    where: { childId: opts.childId, status: OPEN, expiresAt: { gt: new Date() } },
  })
  if (open) return open

  const copy = homeCopyForDomain(opts.childName, opts.domain)
  return prisma.homeActivity.create({
    data: {
      centreId: opts.centreId,
      childId: opts.childId,
      momentId: opts.momentId,
      domain: opts.domain,
      title: copy.title,
      instruction: copy.instruction,
      status: OPEN,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  })
}

export async function listHomeActivitiesForGuardian(userId: string, childId: string) {
  await expireOffered()
  const link = await guardianOf(userId, childId)
  if (!link) return { ok: false as const, status: 403, error: 'Child is not linked to this family' }
  const rows = await prisma.homeActivity.findMany({
    where: { childId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { child: { select: { name: true, room: true } } },
  })
  return { ok: true as const, status: 200, data: rows.map(dto) }
}

export async function listHomeActivitiesForStaff(actor: Actor, filter: 'review' | 'open' = 'review') {
  await expireOffered()
  const roomFilter =
    actor.role === 'facilitator' && actor.room
      ? { child: { room: actor.room, centreId: actor.centreId } }
      : { centreId: actor.centreId }

  const status = filter === 'review' ? DONE : OPEN
  const rows = await prisma.homeActivity.findMany({
    where: { status, ...roomFilter },
    orderBy: { completedAt: 'desc' },
    take: 50,
    include: { child: { select: { name: true, room: true } } },
  })
  return { ok: true as const, status: 200, data: rows.map(dto) }
}

export async function completeHomeActivity(
  activityId: string,
  actor: Actor,
  body: unknown,
  source: 'web' | 'telegram_text' | 'telegram_voice',
) {
  await expireOffered()
  const parsed = HomeActivityDoneSchema.safeParse(body ?? {})
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const row = await prisma.homeActivity.findUnique({
    where: { id: activityId },
    include: { child: { select: { name: true, room: true, centreId: true } } },
  })
  if (!row) return { ok: false as const, status: 404, error: 'Activity not found' }
  if (row.status === EXPIRED) {
    return { ok: false as const, status: 410, error: 'This home practice expired (7 days)' }
  }
  if (row.status !== OPEN && row.status !== DONE) {
    return { ok: false as const, status: 409, error: 'Already closed' }
  }

  const family = actor.role === 'parent' || actor.role === 'caregiver'
  if (family) {
    const link = await guardianOf(actor.id, row.childId)
    if (!link) return { ok: false as const, status: 403, error: 'Not this child’s family' }
  } else if (actor.role !== 'owner' && actor.role !== 'facilitator') {
    return { ok: false as const, status: 403, error: 'Forbidden' }
  } else if (actor.centreId !== row.centreId) {
    return { ok: false as const, status: 403, error: 'Wrong centre' }
  }

  const howWent = parsed.data.howWent?.trim() || row.howWent
  const effort = parsed.data.effort || row.effort
  const updated = await prisma.homeActivity.update({
    where: { id: activityId },
    data: {
      status: DONE,
      effort: effort ?? null,
      howWent: howWent ?? null,
      howWentSource: source,
      completedAt: row.completedAt ?? new Date(),
      completedById: actor.id,
    },
    include: { child: { select: { name: true, room: true } } },
  })
  return { ok: true as const, status: 200, data: dto(updated) }
}

export async function reviewHomeActivity(
  activityId: string,
  actor: Actor,
  action: 'confirm' | 'dismiss',
  body: unknown,
) {
  if (actor.role !== 'owner') {
    return { ok: false as const, status: 403, error: 'Only the Director can move ELDS from home practice' }
  }
  const parsed = HomeActivityReviewSchema.safeParse(body ?? {})
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const row = await prisma.homeActivity.findUnique({ where: { id: activityId } })
  if (!row) return { ok: false as const, status: 404, error: 'Activity not found' }
  if (row.centreId !== actor.centreId) {
    return { ok: false as const, status: 403, error: 'Wrong centre' }
  }
  if (row.status !== DONE) {
    return { ok: false as const, status: 409, error: 'Family has not marked this done yet' }
  }

  if (action === 'dismiss') {
    const updated = await prisma.homeActivity.update({
      where: { id: activityId },
      data: {
        status: DISMISSED,
        confirmedById: actor.id,
        confirmedAt: new Date(),
      },
      include: { child: { select: { name: true, room: true } } },
    })
    return { ok: true as const, status: 200, data: dto(updated) }
  }

  const rating = parsed.data.rating || (row.effort === 'easy' ? 'ap' : 'bl')
  const remark = [row.howWent, row.effort ? `effort:${row.effort}` : '']
    .filter(Boolean)
    .join(' · ')
    .slice(0, 500)

  const obs = await prisma.eldsObservation.create({
    data: {
      childId: row.childId,
      window: 'Oct–Nov 2026',
      domain: row.domain,
      indicator: row.title,
      rating,
      remark: remark || 'Home practice confirmed',
      source: 'home',
      rawRef: row.id,
      facilitatorId: actor.id,
      confirmedById: actor.id,
      isConfirmed: true,
      confirmedAt: new Date(),
    },
  })

  const updated = await prisma.homeActivity.update({
    where: { id: activityId },
    data: {
      status: CONFIRMED,
      confirmedById: actor.id,
      confirmedAt: new Date(),
      progressObsId: obs.id,
    },
    include: { child: { select: { name: true, room: true } } },
  })
  return { ok: true as const, status: 200, data: dto(updated) }
}

export async function getHomeActivity(id: string) {
  return prisma.homeActivity.findUnique({
    where: { id },
    include: { child: { select: { name: true, room: true } } },
  })
}
