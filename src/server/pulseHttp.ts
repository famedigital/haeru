/**
 * Shared HTTP request handler for Pulse API (Vite SSR middleware).
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  postConfirmMoment,
  postObservationFromHermes,
  postAutoInvoiceRun,
  postPaymentReport,
  listPendingDirectorMoments,
  listParentMomentsForChild,
  listDeliveredMomentsForChildren,
  listAllDeliveredMoments,
} from '../lib/api/pulseApiServer'
import { postPhotoBatchFromHermes } from './hermesPhotoBatch'
import {
  completeAdmission,
  createEldsObservation,
  createStaff,
  createTelegramPairing,
  getAuthMe,
  getCentre,
  getChild,
  getChildProgress,
  listChildrenDb,
  listEldsObservations,
  listStaff,
  listTelegramPairingPeople,
  loginUser,
  logoutAuth,
  patchCentre,
  saveCentreBankQr,
} from './enterpriseCrud'
import { handleTelegramWebhook } from './telegramWebhook'
import { getTelegramWebhookInfo } from './hermesWebhookReg'
import {
  confirmMomentAndDeliver,
  listDeliveredForChild,
  listPendingDirector,
} from './hermesMomentStore'
import { prisma } from './prisma'
import {
  completeHomeActivity,
  listHomeActivitiesForGuardian,
  listHomeActivitiesForStaff,
  reviewHomeActivity,
} from './homeActivity'
import { notifyStaffHomeDone } from './homeActivityTelegram'

const DEV_KEY = process.env.PULSE_API_KEY || 'dev-pulse-key'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function send(res: ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Pulse-Key, X-Centre-Code, X-Telegram-Bot-Api-Secret-Token',
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  res.end(body)
}

function centreFromReq(req: IncomingMessage): string {
  const h = req.headers['x-centre-code']
  if (typeof h === 'string' && h.trim()) return h.trim()
  return process.env.DEFAULT_CENTRE_ID || 'WSH'
}

function authorize(req: IncomingMessage): boolean {
  const keyHeader = req.headers['x-pulse-key']
  if (typeof keyHeader === 'string' && keyHeader === DEV_KEY) return true
  const auth = req.headers.authorization
  if (typeof auth === 'string' && auth === `Bearer ${DEV_KEY}`) return true
  // Session tokens from login (uat-<userId>)
  if (typeof auth === 'string' && /^Bearer\s+uat-/i.test(auth)) return true
  return false
}

function bearerToken(req: IncomingMessage): string | null {
  const auth = req.headers.authorization
  if (typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim()
  }
  return null
}

async function actorFromReq(req: IncomingMessage) {
  const token = bearerToken(req)
  const m = token?.match(/^uat-(.+)$/)
  if (!m) return null
  const user = await prisma.user.findUnique({ where: { id: m[1]! } })
  if (!user) return null
  return {
    id: user.id,
    role: user.role,
    centreId: user.centreId,
    room: user.room,
  }
}

export async function handlePulseHttp(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const url = req.url ?? ''
  if (!url.startsWith('/api/')) return false

  if (req.method === 'OPTIONS') {
    send(res, 204, {})
    return true
  }

  try {
    if (req.method === 'POST' && (url === '/api/telegram/webhook' || url.startsWith('/api/telegram/webhook?'))) {
      await handleTelegramWebhook(req, res)
      return true
    }

    if (req.method === 'GET' && url === '/api/telegram/webhook-status') {
      // Read-only Telegram registration status — no child data
      const info = await getTelegramWebhookInfo()
      send(res, 200, { ok: true, data: info })
      return true
    }

    if (req.method === 'POST' && url === '/api/observations/from-hermes') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized · set X-Pulse-Key or Bearer token' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = postObservationFromHermes(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/media/photo-from-hermes') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized · set X-Pulse-Key or Bearer token' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await postPhotoBatchFromHermes(json)
      send(res, result.status, result)
      return true
    }

    const confirmMatch = url.match(/^\/api\/moments\/([^/]+)\/confirm\/?$/)
    if (req.method === 'POST' && confirmMatch) {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = postConfirmMoment(decodeURIComponent(confirmMatch[1]!), json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/invoices/auto-run') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = postAutoInvoiceRun(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/payments/report') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = postPaymentReport(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'GET' && (url === '/api/moments/pending-director' || url.startsWith('/api/moments/pending-director?'))) {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const centreId = centreFromReq(req)
      const live = await listPendingDirector(centreId)
      const legacy = listPendingDirectorMoments()
      send(res, 200, { ok: true, data: { live, legacy, centreId } })
      return true
    }

    const confirmLive = url.match(/^\/api\/haeru-moments\/([^/]+)\/confirm\/?$/)
    if (req.method === 'POST' && confirmLive) {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const id = decodeURIComponent(confirmLive[1]!)
      const result = await confirmMomentAndDeliver(id)
      send(res, result.ok ? 200 : 400, result)
      return true
    }

    const parentMatch = url.match(/^\/api\/parents\/child\/([^/]+)\/moments\/?$/)
    if (req.method === 'GET' && parentMatch) {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const childId = decodeURIComponent(parentMatch[1]!)
      const live = await listDeliveredForChild(childId)
      const legacy = listParentMomentsForChild(childId)
      send(res, 200, { ok: true, data: { live, legacy } })
      return true
    }

    const classroomMatch = url.match(/^\/api\/feeds\/classroom\/([^/]+)\/moments\/?$/)
    if (req.method === 'GET' && classroomMatch) {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const room = decodeURIComponent(classroomMatch[1]!)
      const roster = await listChildrenDb({ room })
      const ids = roster.ok ? roster.data.map((c) => c.id) : []
      send(res, 200, { ok: true, data: listDeliveredMomentsForChildren(ids) })
      return true
    }

    if (req.method === 'GET' && url === '/api/feeds/center/moments') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      send(res, 200, { ok: true, data: listAllDeliveredMoments() })
      return true
    }

    if (req.method === 'POST' && url === '/api/auth/login') {
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await loginUser(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'GET' && url === '/api/auth/me') {
      const result = await getAuthMe(bearerToken(req))
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/auth/logout') {
      const result = await logoutAuth()
      send(res, result.status, result)
      return true
    }

    if (req.method === 'GET' && url === '/api/centre') {
      const result = await getCentre()
      send(res, result.status, result)
      return true
    }

    if (req.method === 'PATCH' && url === '/api/centre') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await patchCentre(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/centre/bank-qr') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await saveCentreBankQr(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'GET' && url === '/api/staff') {
      const result = await listStaff()
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/staff') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await createStaff(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'GET' && url === '/api/telegram/pairing') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const result = await listTelegramPairingPeople()
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/telegram/pairing') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await createTelegramPairing(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/admissions/complete') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await completeAdmission(json)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'GET' && (url === '/api/elds/observations' || url.startsWith('/api/elds/observations?'))) {
      const q = new URL(url, 'http://local').searchParams.get('childId') ?? undefined
      const result = await listEldsObservations(q || undefined)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'POST' && url === '/api/elds/observations') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await createEldsObservation(json)
      send(res, result.status, result)
      return true
    }

    const pathOnly = url.split('?')[0] || url

    if (req.method === 'GET' && pathOnly === '/api/home-activities') {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const actor = await actorFromReq(req)
      if (!actor) {
        send(res, 401, { ok: false, error: 'Session required' })
        return true
      }
      const q = new URL(url, 'http://local')
      const childId = q.searchParams.get('childId')
      const view = q.searchParams.get('view')
      if (actor.role === 'parent' || actor.role === 'caregiver') {
        if (!childId) {
          send(res, 400, { ok: false, error: 'childId required' })
          return true
        }
        const result = await listHomeActivitiesForGuardian(actor.id, childId)
        send(res, result.status, result)
        return true
      }
      if (actor.role === 'owner' || actor.role === 'facilitator') {
        const result = await listHomeActivitiesForStaff(
          actor,
          view === 'open' ? 'open' : 'review',
        )
        send(res, result.status, result)
        return true
      }
      send(res, 403, { ok: false, error: 'Forbidden' })
      return true
    }

    const homeDone = pathOnly.match(/^\/api\/home-activities\/([^/]+)\/done\/?$/)
    if (req.method === 'POST' && homeDone) {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const actor = await actorFromReq(req)
      if (!actor) {
        send(res, 401, { ok: false, error: 'Session required' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const id = decodeURIComponent(homeDone[1]!)
      const result = await completeHomeActivity(id, actor, json, 'web')
      if (result.ok && result.data.status === 'done') {
        void notifyStaffHomeDone({
          centreId: result.data.centreId,
          childName: result.data.childName || 'Child',
          title: result.data.title,
          howWent: result.data.howWent,
          effort: result.data.effort,
        })
      }
      send(res, result.status, result)
      return true
    }

    const homeConfirm = pathOnly.match(/^\/api\/home-activities\/([^/]+)\/confirm-progress\/?$/)
    if (req.method === 'POST' && homeConfirm) {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const actor = await actorFromReq(req)
      if (!actor) {
        send(res, 401, { ok: false, error: 'Session required' })
        return true
      }
      const raw = await readBody(req)
      const json = raw ? JSON.parse(raw) : {}
      const result = await reviewHomeActivity(
        decodeURIComponent(homeConfirm[1]!),
        actor,
        'confirm',
        json,
      )
      send(res, result.status, result)
      return true
    }

    const homeDismiss = pathOnly.match(/^\/api\/home-activities\/([^/]+)\/dismiss\/?$/)
    if (req.method === 'POST' && homeDismiss) {
      if (!authorize(req)) {
        send(res, 401, { ok: false, error: 'Unauthorized' })
        return true
      }
      const actor = await actorFromReq(req)
      if (!actor) {
        send(res, 401, { ok: false, error: 'Session required' })
        return true
      }
      const result = await reviewHomeActivity(
        decodeURIComponent(homeDismiss[1]!),
        actor,
        'dismiss',
        {},
      )
      send(res, result.status, result)
      return true
    }

    const childProgress = url.match(/^\/api\/children\/([^/]+)\/progress\/?$/)
    if (req.method === 'GET' && childProgress) {
      const id = decodeURIComponent(childProgress[1]!)
      const result = await getChildProgress(id)
      send(res, result.status, result)
      return true
    }

    const childOne = url.match(/^\/api\/children\/([^/]+)\/?$/)
    if (req.method === 'GET' && childOne) {
      const id = decodeURIComponent(childOne[1]!)
      const result = await getChild(id)
      send(res, result.status, result)
      return true
    }

    if (req.method === 'GET' && (url === '/api/children' || url.startsWith('/api/children?'))) {
      const q = new URL(url, 'http://local')
      const room = q.searchParams.get('room') || undefined
      const centreId = q.searchParams.get('centreId') || undefined
      const result = await listChildrenDb({ room, centreId })
      send(res, result.status, result)
      return true
    }

    send(res, 404, { ok: false, error: 'Not found' })
    return true
  } catch (err) {
    send(res, 500, {
      ok: false,
      error: err instanceof Error ? err.message : 'Server error',
    })
    return true
  }
}
