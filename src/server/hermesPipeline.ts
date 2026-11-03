/**
 * Inbound Telegram → Haeru Voice AI pipeline (tenant-isolated).
 * UI/Telegram copy: never say "Hermes".
 */

import { prisma } from './prisma'
import { downloadVoiceFile } from './hermesDownload'
import { transcribeAudio } from './hermesSTT'
import { extractObservation } from './hermesExtractor'
import { saveHermesMoment, confirmMomentAndDeliver, rejectMoment } from './hermesMomentStore'
import { notifyDirector } from './hermesDirectorNotify'

type TgUser = { id: number; first_name?: string; username?: string }
type TgChat = { id: number; type: string }
type TgVoice = { file_id: string; duration?: number }
type TgMessage = {
  message_id: number
  from?: TgUser
  chat: TgChat
  text?: string
  voice?: TgVoice
  audio?: { file_id: string }
  video_note?: { file_id: string }
}
type TgCallback = {
  id: string
  from: TgUser
  data?: string
  message?: { chat: TgChat; message_id: number }
}
export type TelegramUpdate = {
  update_id: number
  message?: TgMessage
  callback_query?: TgCallback
}

async function tgReply(chatId: number | string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

async function answerCallback(callbackId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackId, text, show_alert: false }),
  })
}

function extractPairingToken(text: string): string | null {
  const t = text.trim()
  // Deep link: /start pair_wsh_karma  ·  /start@HaeruEccdBot pair_…
  const start = t.match(/^\/start(?:@\w+)?\s+(pair_[A-Za-z0-9_-]+)\s*$/i)
  if (start) return start[1]!
  // Bare token (staff paste from Director): pair_wsh_karma
  const bare = t.match(/^(pair_[A-Za-z0-9_-]+)\s*$/i)
  if (bare) return bare[1]!
  // Explicit: /pair pair_wsh_karma
  const cmd = t.match(/^\/pair(?:@\w+)?\s+(pair_[A-Za-z0-9_-]+)\s*$/i)
  if (cmd) return cmd[1]!
  return null
}

async function handlePairing(text: string, from: TgUser, chat: TgChat) {
  const token = extractPairingToken(text)
  if (!token) {
    await tgReply(
      chat.id,
      '👋 Welcome to Haeru Voice AI!\n\nTo pair, send your code (e.g. pair_wsh_karma) or open the Director link:\nhttps://t.me/HaeruEccdBot?start=pair_wsh_karma',
    )
    return
  }
  const user = await prisma.user.findFirst({ where: { pairingToken: token } })
  if (!user) {
    await tgReply(chat.id, '❌ That pairing link is invalid or already used. Ask your Director for a new one.')
    return
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      telegramUserId: String(from.id),
      telegramChatId: String(chat.id),
      pairingToken: null,
    },
  })
  await tgReply(
    chat.id,
    `✅ Paired with ${user.name} @ ${user.centreId}. You can send voice notes to Haeru Voice AI now.`,
  )
}

async function handleVoice(msg: TgMessage, user: {
  id: string
  name: string
  centreId: string
  room: string | null
  role: string
}) {
  const fileId = msg.voice?.file_id || msg.audio?.file_id || msg.video_note?.file_id
  if (!fileId) return

  await tgReply(msg.chat.id, '🎧 Heard your note — Haeru is listening…')

  try {
    const buf = await downloadVoiceFile(fileId)
    const { text } = await transcribeAudio(buf, 'voice.ogg')
    if (!text) {
      await tgReply(msg.chat.id, '⚠️ Haeru could not hear that note clearly. Please try a shorter voice note (5–20 seconds).')
      return
    }

    const rosterWhere =
      user.room
        ? { centreId: user.centreId, room: user.room }
        : { centreId: user.centreId }

    const roster = await prisma.child.findMany({
      where: rosterWhere,
      select: { id: true, name: true, code: true },
      take: 40,
    })

    const obs = await extractObservation(text, roster)
    const moment = await saveHermesMoment({
      obs,
      centreId: user.centreId,
      telegramChatId: String(msg.chat.id),
      telegramMsgId: msg.message_id,
      facilitatorTgId: String(msg.from?.id ?? ''),
    })

    await tgReply(
      msg.chat.id,
      `✅ Haeru received ${obs.childName}'s moment — awaiting Director review`,
    )
    await notifyDirector(moment.id, user.centreId)
  } catch (err) {
    console.error('[haeru-voice] voice pipeline', err)
    const hint = err instanceof Error ? err.message : ''
    const sttMissing = /No STT provider|GROQ_API_KEY|OPENAI_API_KEY|DEEPGRAM/i.test(hint)
    await tgReply(
      msg.chat.id,
      sttMissing
        ? '⚠️ Voice AI is not fully configured on the server (speech-to-text key). Director can retry after ops add GROQ_API_KEY.'
        : '⚠️ Haeru Voice AI hit a temporary error. Please try once more in a minute.',
    )
  }
}

async function handleCallback(cb: TgCallback) {
  const data = cb.data || ''
  const director = await prisma.user.findFirst({
    where: { telegramUserId: String(cb.from.id), role: 'owner' },
  })
  if (!director) {
    await answerCallback(cb.id, 'Only a paired Director can confirm.')
    return
  }

  if (data.startsWith('confirm:')) {
    const id = data.slice('confirm:'.length)
    const moment = await prisma.hermesMoment.findUnique({ where: { id } })
    if (!moment || moment.centreId !== director.centreId) {
      await answerCallback(cb.id, 'Moment not found for your centre.')
      return
    }
    const result = await confirmMomentAndDeliver(id, director.id)
    await answerCallback(cb.id, result.ok ? 'Delivered to family ✅' : result.error || 'Failed')
    if (cb.message?.chat.id) {
      await tgReply(cb.message.chat.id, result.ok ? `✅ Confirmed & delivered · ${moment.childName}` : `❌ ${result.error}`)
    }
    return
  }

  if (data.startsWith('reject:')) {
    const id = data.slice('reject:'.length)
    const moment = await prisma.hermesMoment.findUnique({ where: { id } })
    if (!moment || moment.centreId !== director.centreId) {
      await answerCallback(cb.id, 'Moment not found for your centre.')
      return
    }
    await rejectMoment(id, director.id)
    await answerCallback(cb.id, 'Rejected')
    if (cb.message?.chat.id) {
      await tgReply(cb.message.chat.id, `❌ Rejected · ${moment.childName}`)
    }
  }
}

export async function processTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    await handleCallback(update.callback_query)
    return
  }

  const msg = update.message
  if (!msg?.from) return

  const text = msg.text?.trim() || ''
  if (text.startsWith('/start') || text.startsWith('/pair') || /^pair_[A-Za-z0-9_-]+$/i.test(text)) {
    await handlePairing(text, msg.from, msg.chat)
    return
  }

  const user = await prisma.user.findFirst({
    where: { telegramUserId: String(msg.from.id) },
  })

  if (!user) {
    await tgReply(
      msg.chat.id,
      '👋 Welcome to Haeru Voice AI!\n\nThis phone is not paired yet, so voice notes cannot be processed.\n\nAsk the Director to open Haeru → Children → Telegram pairing → Generate link, then tap that link here.',
    )
    return
  }

  if (msg.voice || msg.audio || msg.video_note) {
    if (user.role !== 'facilitator' && user.role !== 'owner') {
      await tgReply(
        msg.chat.id,
        'Voice notes are for paired facilitators and the Director. Parents receive private updates after Director confirm — no need to send voice here.',
      )
      return
    }
    await handleVoice(msg, user)
    return
  }

  if (text && (text === '/help' || text === '/today')) {
    await tgReply(
      msg.chat.id,
      'Haeru Voice AI · send a short voice note about a child. Director confirms before parents see it.',
    )
  }
}
