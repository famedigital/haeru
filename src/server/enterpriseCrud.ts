import {
  AdmissionCompleteSchema,
  AuthLoginSchema,
  CentreBankQrSchema,
  CentrePatchSchema,
  EldsObservationCreateSchema,
  StaffCreateSchema,
} from '../lib/api/schemas'
import { centreReceiveEmv, parseCentreBank } from '../lib/payments/centreBank'
import { adoptBankQr } from '../lib/payments/centreBank'
import { prisma } from './prisma'

function uidCode(prefix: string) {
  const n = Math.floor(100 + Math.random() * 900)
  return `${prefix}-${n}`
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

export async function loginUser(body: unknown) {
  const parsed = AuthLoginSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
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

  return {
    ok: true as const,
    status: 200,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'owner' | 'facilitator' | 'parent' | 'caregiver',
      room: user.room,
      childIds,
      token: `uat-${user.id}`,
    },
  }
}

export async function listChildrenDb() {
  const rows = await prisma.child.findMany({ orderBy: { code: 'asc' } })
  return { ok: true as const, status: 200, data: rows }
}
