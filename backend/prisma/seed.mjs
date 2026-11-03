/**
 * Seed WSH centre + pilot role users.
 * Passwords from env (Coolify / .env) — never commit real values.
 * Run: node backend/prisma/seed.mjs  (after prisma db push)
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function pass(key) {
  const v = process.env[key]?.trim()
  if (!v) {
    throw new Error(
      `[seed] Missing ${key}. Set SEED_PASSWORD_* in Coolify env (see .credentials.pilot).`,
    )
  }
  return v
}

async function main() {
  function tlv(tag, value) {
    return `${tag}${String(value.length).padStart(2, '0')}${value}`
  }
  function crc16(data) {
    let crc = 0xffff
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8
      for (let b = 0; b < 8; b++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
        crc &= 0xffff
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0')
  }
  function buildStaticEmv(merchant, name, city) {
    const body =
      tlv('00', '01') +
      tlv('01', '11') +
      tlv('26', merchant.slice(0, 32)) +
      tlv('52', '5411') +
      tlv('53', '064') +
      tlv('58', 'BT') +
      tlv('59', name.slice(0, 25)) +
      tlv('60', city.slice(0, 15)) +
      '6304'
    return body + crc16(body)
  }
  const emvStatic = buildStaticEmv(
    '200844714471',
    "Wangchuk's School of Heroes",
    'Thimphu',
  )

  const centre = await prisma.centre.upsert({
    where: { code: 'WSH' },
    update: {
      name: "Wangchuk's School of Heroes",
      place: 'Rigpai Ling, Babesa, Thimphu',
      city: 'Thimphu',
      payeeName: "Wangchuk's School of Heroes",
      accountNo: '200844714471',
      bank: 'bob',
      emvStatic,
    },
    create: {
      id: 'WSH',
      code: 'WSH',
      name: "Wangchuk's School of Heroes",
      place: 'Rigpai Ling, Babesa, Thimphu',
      city: 'Thimphu',
      bank: 'bob',
      accountNo: '200844714471',
      payeeName: "Wangchuk's School of Heroes",
      emvStatic,
    },
  })

  const users = [
    {
      email: 'superadmin@haeru.bt',
      phone: '17000000',
      name: 'Haeru Ops',
      role: 'superadmin',
      password: pass('SEED_PASSWORD_SUPERADMIN'),
    },
    {
      email: 'director@wsh.bt',
      phone: '17000001',
      name: 'Karma Dechen',
      role: 'owner',
      password: pass('SEED_PASSWORD_OWNER'),
      pairingToken: 'pair_wsh_karma',
    },
    {
      email: 'facilitator@wsh.bt',
      phone: '17000002',
      name: 'Kuenzang Tshomo',
      role: 'facilitator',
      password: pass('SEED_PASSWORD_FACILITATOR'),
      room: 'kg',
      pairingToken: 'pair_wsh_kuenzang',
    },
    {
      email: 'parent@wsh.bt',
      phone: '17111111',
      name: 'Deki Choden',
      role: 'parent',
      password: pass('SEED_PASSWORD_PARENT'),
      pairingToken: 'pair_wsh_deki',
    },
    {
      email: 'caregiver@wsh.bt',
      phone: '77112233',
      name: 'Dawa Zam',
      role: 'caregiver',
      password: pass('SEED_PASSWORD_CAREGIVER'),
    },
  ]

  for (const u of users) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ phone: u.phone }, { email: u.email }, ...(u.role === 'owner' ? [{ email: 'owner@wsh.bt' }] : [])],
      },
    })
    const data = {
      name: u.name,
      role: u.role,
      email: u.email,
      phone: u.phone,
      password: u.password,
      room: u.room ?? null,
      centreId: centre.id,
    }
    if (existing) {
      // Do not clobber Telegram pairing on every boot / redeploy.
      await prisma.user.update({ where: { id: existing.id }, data })
    } else {
      await prisma.user.create({
        data: { ...data, pairingToken: u.pairingToken ?? null },
      })
    }
  }

  await prisma.user.deleteMany({
    where: { email: 'owner@wsh.bt' },
  })

  const kinley = await prisma.child.upsert({
    where: { code: 'WSH-24-018' },
    update: { name: 'Kinley Wangchuk', centreId: centre.id, room: 'kg' },
    create: {
      code: 'WSH-24-018',
      name: 'Kinley Wangchuk',
      room: 'kg',
      centreId: centre.id,
      dob: new Date('2021-03-15'),
      gender: 'M',
      photoConsentFeed: true,
      photoConsentSocial: true,
      allergies: 'Mild dust allergy',
      motherTongue: 'Dzongkha',
    },
  })

  const parent = await prisma.user.findUnique({ where: { phone: '17111111' } })
  const caregiver = await prisma.user.findUnique({ where: { phone: '77112233' } })
  if (parent) {
    const existing = await prisma.childGuardian.findFirst({
      where: { childId: kinley.id, userId: parent.id },
    })
    if (!existing) {
      await prisma.childGuardian.create({
        data: {
          childId: kinley.id,
          userId: parent.id,
          relation: 'Mother',
          isPrimary: true,
          canViewFinance: true,
          canPickup: true,
        },
      })
    }
  }
  if (caregiver) {
    const existing = await prisma.childGuardian.findFirst({
      where: { childId: kinley.id, userId: caregiver.id },
    })
    if (!existing) {
      await prisma.childGuardian.create({
        data: {
          childId: kinley.id,
          userId: caregiver.id,
          relation: 'Grandmother',
          isPrimary: false,
          canViewFinance: false,
          canPickup: true,
        },
      })
    }
  }

  console.log('Seed OK', {
    centre: centre.code,
    child: kinley.code,
    users: users.map((u) => u.email),
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
