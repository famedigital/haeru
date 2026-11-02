/**
 * Telegram webhook entry — validate secret, ACK fast, process async.
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import { processTelegramUpdate, type TelegramUpdate } from './hermesPipeline'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export async function handleTelegramWebhook(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET
  if (expected) {
    const got = req.headers['x-telegram-bot-api-secret-token']
    if (got !== expected) {
      sendJson(res, 401, { ok: false, error: 'Invalid webhook secret' })
      return
    }
  }

  let body: TelegramUpdate
  try {
    const raw = await readBody(req)
    body = JSON.parse(raw || '{}') as TelegramUpdate
  } catch {
    sendJson(res, 400, { ok: false, error: 'Invalid JSON' })
    return
  }

  // ACK immediately (<200ms target)
  sendJson(res, 200, { ok: true })

  void processTelegramUpdate(body).catch((err) => {
    console.error('[haeru-voice] processTelegramUpdate', err)
  })
}
