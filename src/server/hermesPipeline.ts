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

async function handlePairing(text: string, from: TgUser, chat: TgChat) {
  const m = text.trim().match(/^\/start(?:@\w+)?\s+(pair_\S+)/i)
  if (!m) {
    await tgReply(
      chat.id,
      '👋 Welcome to Haeru Voice AI! Please use your staff pairing link from your Director.',
    )
    return
  }
  const token = m[1]!
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
  const fileId = msg.voice?.file_id || msg.audio?.file_id
  if (!fileId) return

  try {
    const buf = await downloadVoiceFile(fileId)
    const { text } = await transcribeAudio(buf, 'voice.ogg')
    if (!text) {
      await tgReply(msg.chat.id, '⚠️ Haeru could not hear that note clearly. Please try again.')
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
    await tgReply(
      msg.chat.id,
      '⚠️ Haeru Voice AI hit a temporary error. Please try once more in a minute.',
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
  if (text.startsWith('/start')) {
    await handlePairing(text, msg.from, msg.chat)
    return
  }

  const user = await prisma.user.findFirst({
    where: { telegramUserId: String(msg.from.id) },
  })

  if (!user) {
    if (text) {
      await tgReply(
        msg.chat.id,
        '👋 Welcome to Haeru Voice AI! Please use your staff pairing link from your Director.',
      )
    }
    return
  }

  if (msg.voice || msg.audio) {
    if (user.role !== 'facilitator' && user.role !== 'owner') {
      await tgReply(msg.chat.id, 'Voice notes are for paired facilitators. Thanks!')
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
