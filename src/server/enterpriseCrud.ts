import { randomBytes } from 'node:crypto'
import {
  AdmissionCompleteSchema,
  AuthLoginSchema,
  CentreBankQrSchema,
  CentrePatchSchema,
  EldsObservationCreateSchema,
  StaffCreateSchema,
  TelegramPairingCreateSchema,
} from '../lib/api/schemas'
import { centreReceiveEmv, parseCentreBank } from '../lib/payments/centreBank'
import { adoptBankQr } from '../lib/payments/centreBank'
import { prisma } from './prisma'

function uidCode(prefix: string) {
  const n = Math.floor(100 + Math.random() * 900)
  return `${prefix}-${n}`
}

function telegramBotUsername() {
  return (process.env.TELEGRAM_BOT_USERNAME || 'HaeruEccdBot').replace(/^@/, '')
}

function pairingDeepLink(token: string) {
  return `https://t.me/${telegramBotUsername()}?start=${encodeURIComponent(token)}`
}

function makePairingToken(centreCode: string, name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 18)
  const rand = randomBytes(3).toString('hex')
  const code = (centreCode || 'wsh').toLowerCase().replace(/[^a-z0-9]/g, '')
  // Telegram start payload max 64 chars
  return `pair_${code}_${slug || 'user'}_${rand}`.slice(0, 64)
}

function pairingStatus(user: {
  telegramChatId: string | null
  pairingToken: string | null
}) {
  if (user.telegramChatId) return 'paired' as const
  if (user.pairingToken) return 'pending' as const
  return 'unlinked' as const
}

export async function getCentre() {
  let centre = await prisma.centre.findUnique({ where: { code: 'WSH' } })
  if (!centre) {
    centre = await prisma.centre.create({
      data: {
        id: 'WSH',
        code: 'WSH',
        name: "Wangchuk's School of Heroes",
        place: 'Thimphu · Bhutan',
        city: 'Thimphu',
        payeeName: "Wangchuk's School of Heroes",
      },
    })
  }
  return { ok: true as const, status: 200, data: centre }
}

export async function patchCentre(body: unknown) {
  const parsed = CentrePatchSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  await getCentre()
  const data = parsed.data
  const centre = await prisma.centre.update({
    where: { code: 'WSH' },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.place !== undefined ? { place: data.place } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.bank !== undefined ? { bank: data.bank } : {}),
      ...(data.accountNo !== undefined ? { accountNo: data.accountNo } : {}),
      ...(data.payeeName !== undefined ? { payeeName: data.payeeName } : {}),
      ...(data.emvStatic !== undefined ? { emvStatic: data.emvStatic } : {}),
    },
  })
  return { ok: true as const, status: 200, data: centre }
}

export async function saveCentreBankQr(body: unknown) {
  const parsed = CentreBankQrSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const input = parsed.data
  let emvStatic = input.emvStatic || ''
  let accountNo = input.accountNo
  let payeeName = input.payeeName

  if (input.rawEmv) {
    const adopted = adoptBankQr(input.rawEmv)
    if (!adopted) {
      return { ok: false as const, status: 422, error: 'Invalid bank EMV QR payload' }
    }
    emvStatic = adopted.emvStatic
    if (adopted.accountNo) accountNo = adopted.accountNo
    if (adopted.payeeName) payeeName = adopted.payeeName
  }

  const centreRow = (await getCentre()).data
  emvStatic = centreReceiveEmv({
    emvStatic,
    accountNo,
    payeeName,
    centreName: centreRow.name,
    city: centreRow.city,
  })

  const centre = await prisma.centre.update({
    where: { code: 'WSH' },
    data: {
      bank: parseCentreBank(input.bank),
      accountNo,
      payeeName,
      emvStatic,
    },
  })
  return { ok: true as const, status: 200, data: centre }
}

export async function listStaff() {
  const users = await prisma.user.findMany({
    where: { role: { in: ['owner', 'facilitator'] } },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      phone: true,
      room: true,
      createdAt: true,
    },
  })
  return { ok: true as const, status: 200, data: users }
}

export async function createStaff(body: unknown) {
  const parsed = StaffCreateSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const d = parsed.data
  try {
    const centre = await getCentre()
    const centreId = centre.data.id
    const user = await prisma.user.create({
      data: {
        name: d.name,
        phone: d.phone,
        email: d.email,
        role: d.role,
        room: d.room,
        password: d.password,
        centreId,
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        phone: true,
        room: true,
        centreId: true,
      },
    })
    return { ok: true as const, status: 201, data: user }
  } catch (err) {
    return {
      ok: false as const,
      status: 409,
      error: err instanceof Error ? err.message : 'Could not create staff',
    }
  }
}

export async function completeAdmission(body: unknown) {
  const parsed = AdmissionCompleteSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const d = parsed.data
  const code = d.childCode || uidCode('WSH-26')
  try {
    const centre = await getCentre()
    const centreId = centre.data.id
    const child = await prisma.child.create({
      data: {
        code,
        name: d.childName,
        room: d.room,
        dob: new Date(d.dob),
        gender: d.gender,
        photoConsentFeed: d.photoConsentFeed,
        centreId,
      },
    })

    let parent = await prisma.user.findUnique({ where: { phone: d.guardianPhone } })
    if (!parent) {
      parent = await prisma.user.create({
        data: {
          name: d.guardianName,
          phone: d.guardianPhone,
          email: d.guardianEmail,
          role: 'parent',
          password: d.parentPassword,
          centreId,
        },
      })
    }

    await prisma.childGuardian.create({
      data: {
        childId: child.id,
        userId: parent.id,
        relation: d.relation,
        isPrimary: true,
        canViewFinance: true,
        canPickup: true,
      },
    })

    return {
      ok: true as const,
      status: 201,
      data: { child, parent: { id: parent.id, name: parent.name, phone: parent.phone, email: parent.email } },
    }
  } catch (err) {
    return {
      ok: false as const,
      status: 409,
      error: err instanceof Error ? err.message : 'Admission failed',
    }
  }
}

export async function createEldsObservation(body: unknown) {
  const parsed = EldsObservationCreateSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const d = parsed.data
  let facilitatorId = d.facilitatorId
  if (!facilitatorId) {
    const fac = await prisma.user.findFirst({ where: { role: 'facilitator' } })
    facilitatorId = fac?.id
  }
  if (!facilitatorId) {
    return { ok: false as const, status: 400, error: 'No facilitator user to attach observation' }
  }
  const row = await prisma.eldsObservation.create({
    data: {
      childId: d.childId,
      window: d.window,
      domain: d.domain,
      indicator: d.indicator,
      rating: d.rating,
      remark: d.remark,
      source: 'manual',
      facilitatorId,
      isConfirmed: false,
    },
  })
  return { ok: true as const, status: 201, data: row }
}

export async function listEldsObservations(childId?: string) {
  const rows = await prisma.eldsObservation.findMany({
    where: childId ? { childId } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { child: { select: { name: true, code: true } } },
  })
  return { ok: true as const, status: 200, data: rows }
}

const MOESD_DOMAINS = [
  'Physical & motor',
  'Social & emotional',
  'Language & communication',
  'Approaches to learning',
  'Cognition & knowledge',
  'Spiritual, moral & cultural',
] as const

function canonicalDomain(raw: string): (typeof MOESD_DOMAINS)[number] | null {
  const n = raw.toLowerCase().replace(/\s+/g, ' ').trim()
  const hit = MOESD_DOMAINS.find((d) => {
    const dd = d.toLowerCase()
    return n === dd || n.includes(dd) || dd.includes(n)
  })
  if (hit) return hit
  if (n.includes('physical') || n.includes('motor')) return 'Physical & motor'
  if (n.includes('social') || n.includes('emotional')) return 'Social & emotional'
  if (n.includes('language') || n.includes('literacy') || n.includes('communication'))
    return 'Language & communication'
  if (n.includes('approach')) return 'Approaches to learning'
  if (n.includes('cognit') || n.includes('knowledge') || n.includes('general'))
    return 'Cognition & knowledge'
  if (n.includes('spiritual') || n.includes('moral') || n.includes('cultural'))
    return 'Spiritual, moral & cultural'
  return null
}

function ageLabel(dob: Date): string {
  const now = new Date()
  let months =
    (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth())
  if (now.getDate() < dob.getDate()) months -= 1
  const y = Math.floor(Math.max(0, months) / 12)
  const m = Math.max(0, months) % 12
  return `${y}y ${m}m`
}

export async function loginUser(body: unknown) {
  const parsed = AuthLoginSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    include: { centre: true },
  })
  if (!user || user.password !== parsed.data.password) {
    return { ok: false as const, status: 401, error: 'Invalid email or password' }
  }

  let childIds: string[] = []
  if (user.role === 'parent' || user.role === 'caregiver') {
    const links = await prisma.childGuardian.findMany({
      where: { userId: user.id },
      select: { childId: true },
    })
    childIds = links.map((l) => l.childId)
  }

  const role = user.role as
    | 'superadmin'
    | 'owner'
    | 'facilitator'
    | 'parent'
    | 'caregiver'
  const token = `uat-${user.id}`
  const appUser = {
    id: user.id,
    name: user.name,
    role,
    email: user.email,
    phone: user.phone,
    room: user.room,
    centreId: user.centreId,
  }
  const centre = {
    id: user.centre.id,
    code: user.centre.code,
    name: user.centre.name,
    place: user.centre.place,
    city: user.centre.city,
  }

  return {
    ok: true as const,
    status: 200,
    data: {
      // Flat fields kept for older clients
      id: user.id,
      name: user.name,
      email: user.email,
      role,
      room: user.room,
      childIds,
      token,
      user: appUser,
      centre,
    },
  }
}

export async function getAuthMe(token: string | null) {
  if (!token) return { ok: false as const, status: 401, error: 'Unauthorized' }
  const m = token.replace(/^Bearer\s+/i, '').match(/^uat-(.+)$/)
  if (!m) return { ok: false as const, status: 401, error: 'Invalid token' }
  const user = await prisma.user.findUnique({
    where: { id: m[1]! },
    include: { centre: true },
  })
  if (!user) return { ok: false as const, status: 401, error: 'Session expired' }

  let childIds: string[] = []
  if (user.role === 'parent' || user.role === 'caregiver') {
    const links = await prisma.childGuardian.findMany({
      where: { userId: user.id },
      select: { childId: true },
    })
    childIds = links.map((l) => l.childId)
  }

  const role = user.role as
    | 'superadmin'
    | 'owner'
    | 'facilitator'
    | 'parent'
    | 'caregiver'

  return {
    ok: true as const,
    status: 200,
    data: {
      user: {
        id: user.id,
        name: user.name,
        role,
        email: user.email,
        phone: user.phone,
        room: user.room,
        centreId: user.centreId,
      },
      centre: {
        id: user.centre.id,
        code: user.centre.code,
        name: user.centre.name,
        place: user.centre.place,
        city: user.centre.city,
      },
      childIds,
      token: `uat-${user.id}`,
    },
  }
}

export async function logoutAuth() {
  return { ok: true as const, status: 200, data: { cleared: true } }
}

export async function listChildrenDb(opts?: { room?: string; centreId?: string }) {
  const rows = await prisma.child.findMany({
    where: {
      ...(opts?.room ? { room: opts.room } : {}),
      ...(opts?.centreId ? { centreId: opts.centreId } : {}),
    },
    orderBy: { code: 'asc' },
    include: {
      guardians: {
        include: {
          user: { select: { id: true, name: true, phone: true, email: true, role: true } },
        },
      },
    },
  })
  const data = rows.map((c) => ({
    ...c,
    age: ageLabel(c.dob),
  }))
  return { ok: true as const, status: 200, data }
}

export async function getChild(id: string) {
  const child = await prisma.child.findUnique({
    where: { id },
    include: {
      guardians: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
              telegramChatId: true,
              pairingToken: true,
            },
          },
        },
      },
      pickupLogs: { orderBy: { pickupTime: 'desc' }, take: 10 },
      careLogs: { orderBy: { date: 'desc' }, take: 5 },
    },
  })
  if (!child) return { ok: false as const, status: 404, error: 'Child not found' }
  return {
    ok: true as const,
    status: 200,
    data: {
      ...child,
      age: ageLabel(child.dob),
      feedConsent: child.photoConsentFeed,
      socialConsent: child.photoConsentSocial,
      guardians: child.guardians.map((g) => ({
        ...g,
        user: {
          ...g.user,
          telegramPaired: Boolean(g.user.telegramChatId),
          pairingStatus: pairingStatus(g.user),
          pairingToken: g.user.pairingToken,
          deepLink: g.user.pairingToken ? pairingDeepLink(g.user.pairingToken) : null,
        },
      })),
      emergency: {
        allergies: child.allergies,
        medication: child.medication,
        doctorInfo: child.doctorInfo,
        napRoutine: child.napRoutine,
        toiletStatus: child.toiletStatus,
        motherTongue: child.motherTongue,
      },
    },
  }
}

export async function listTelegramPairingPeople(centreId?: string) {
  const centre = await getCentre()
  const cid = centreId || centre.data.id
  const users = await prisma.user.findMany({
    where: {
      centreId: cid,
      role: { in: ['owner', 'facilitator', 'parent', 'caregiver'] },
    },
    orderBy: [{ role: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      phone: true,
      room: true,
      telegramChatId: true,
      pairingToken: true,
      guardianLinks: {
        select: {
          relation: true,
          isPrimary: true,
          child: { select: { id: true, name: true, code: true, room: true } },
        },
      },
    },
  })

  const bot = telegramBotUsername()
  const data = users.map((u) => {
    const status = pairingStatus(u)
    return {
      id: u.id,
      name: u.name,
      role: u.role,
      email: u.email,
      phone: u.phone,
      room: u.room,
      telegramPaired: Boolean(u.telegramChatId),
      pairingStatus: status,
      pairingToken: u.pairingToken,
      deepLink: u.pairingToken ? pairingDeepLink(u.pairingToken) : null,
      botUsername: bot,
      children: u.guardianLinks.map((l) => ({
        id: l.child.id,
        name: l.child.name,
        code: l.child.code,
        room: l.child.room,
        relation: l.relation,
        isPrimary: l.isPrimary,
      })),
    }
  })

  return { ok: true as const, status: 200, data: { botUsername: bot, people: data } }
}

export async function createTelegramPairing(body: unknown) {
  const parsed = TelegramPairingCreateSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const { userId, reset } = parsed.data
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { ok: false as const, status: 404, error: 'User not found' }

  const centre = await prisma.centre.findUnique({ where: { id: user.centreId } })
  const centreCode = centre?.code || user.centreId || 'WSH'

  let token = makePairingToken(centreCode, user.name)
  // Extremely unlikely collision — retry once
  const clash = await prisma.user.findFirst({ where: { pairingToken: token } })
  if (clash) token = makePairingToken(centreCode, user.name)

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      pairingToken: token,
      ...(reset
        ? { telegramChatId: null, telegramUserId: null }
        : {}),
    },
    select: {
      id: true,
      name: true,
      role: true,
      pairingToken: true,
      telegramChatId: true,
    },
  })

  return {
    ok: true as const,
    status: 200,
    data: {
      userId: updated.id,
      name: updated.name,
      role: updated.role,
      pairingToken: updated.pairingToken!,
      deepLink: pairingDeepLink(updated.pairingToken!),
      botUsername: telegramBotUsername(),
      pairingStatus: pairingStatus(updated),
      telegramPaired: Boolean(updated.telegramChatId),
      instructions:
        `Open the link on the parent's phone, or ask them to message @${telegramBotUsername()} and send: ${updated.pairingToken}`,
    },
  }
}

export async function getChildProgress(childId: string) {
  const child = await prisma.child.findUnique({ where: { id: childId } })
  if (!child) return { ok: false as const, status: 404, error: 'Child not found' }

  const observations = await prisma.eldsObservation.findMany({
    where: { childId },
    orderBy: { createdAt: 'desc' },
    include: {
      facilitator: { select: { id: true, name: true } },
    },
  })

  const hermes = await prisma.hermesMoment.findMany({
    where: { childId, status: 'delivered' },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  const domainStats = MOESD_DOMAINS.map((domain) => {
    const rows = observations.filter((o) => canonicalDomain(o.domain) === domain)
    const hermesHits = hermes.filter((h) => canonicalDomain(h.domain) === domain)
    let ap = rows.filter((r) => r.rating === 'ap').length
    let bl = rows.filter((r) => r.rating === 'bl').length
    let nya = rows.filter((r) => r.rating === 'nya').length
    // Delivered Voice AI moments count as achieved evidence when no checklist yet
    ap += hermesHits.length
    const total = ap + bl + nya
    const score = total === 0 ? 0 : Math.round(((ap + bl * 0.5) / total) * 1000) / 10
    const lastObs = rows[0]?.createdAt ?? hermesHits[0]?.confirmedAt ?? hermesHits[0]?.createdAt
    return {
      domain,
      ap,
      bl,
      nya,
      total,
      score,
      lastObserved: lastObs ? lastObs.toISOString() : null,
      voiceAiCount: hermesHits.length,
    }
  })

  const values = domainStats.map((d) => (d.total === 0 ? 0.35 : Math.min(1, d.score / 100)))
  const radarSeries = [
    {
      window: 'Oct–Nov' as const,
      color: '#2dd4bf',
      fill: 'rgba(45, 212, 191, 0.18)',
      dots: true,
      values,
    },
    {
      window: 'Aug–Sep' as const,
      color: 'rgba(148, 163, 184, 0.55)',
      dash: true,
      values: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
    },
  ]

  const recentMilestones = [
    ...observations.slice(0, 20).map((o) => ({
      id: o.id,
      date: (o.confirmedAt ?? o.createdAt).toISOString(),
      domain: o.domain,
      indicator: o.indicator,
      rating: o.rating,
      source: o.source,
      facilitatorName: o.facilitator.name,
      isConfirmed: o.isConfirmed,
    })),
    ...hermes.slice(0, 10).map((h) => {
      let indicator = h.transcription || 'Classroom voice moment'
      try {
        const raw = JSON.parse(h.rawHermesJson) as { milestone?: string; parentSafeTitle?: string }
        indicator = raw.parentSafeTitle || raw.milestone || indicator
      } catch {
        /* keep */
      }
      return {
        id: h.id,
        date: (h.confirmedAt ?? h.createdAt).toISOString(),
        domain: h.domain,
        indicator,
        rating: 'ap',
        source: 'voice',
        facilitatorName: 'Haeru Voice AI',
        isConfirmed: true,
      }
    }),
  ].sort((a, b) => (a.date < b.date ? 1 : -1))

  return {
    ok: true as const,
    status: 200,
    data: {
      childId: child.id,
      childName: child.name,
      room: child.room,
      totalObservations: observations.length + hermes.length,
      domainStats,
      radarSeries,
      recentMilestones,
    },
  }
}
