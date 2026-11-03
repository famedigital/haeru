/**
 * Inbound Telegram → Haeru Voice AI pipeline (tenant-isolated).
 * UI/Telegram copy: never say "Hermes".
 */

import { prisma } from './prisma'
import { downloadVoiceFile } from './hermesDownload'
import { transcribeAudio } from './hermesSTT'
import {
  extractObservation,
  matchChildFromTranscript,
  type HermesObservation,
  type RosterChild,
} from './hermesExtractor'
import { saveHermesMoment, confirmMomentAndDeliver, rejectMoment } from './hermesMomentStore'
import { notifyDirector } from './hermesDirectorNotify'
import {
  clearPendingVoice,
  getPendingByChat,
  getPendingVoice,
  savePendingVoice,
} from './hermesPendingVoice'

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

type StaffUser = {
  id: string
  name: string
  centreId: string
  room: string | null
  role: string
}

async function tgReply(
  chatId: number | string,
  text: string,
  extra?: Record<string, unknown>,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, ...extra }),
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
  const start = t.match(/^\/start(?:@\w+)?\s+(pair_[A-Za-z0-9_-]+)\s*$/i)
  if (start) return start[1]!
  const bare = t.match(/^(pair_[A-Za-z0-9_-]+)\s*$/i)
  if (bare) return bare[1]!
  const cmd = t.match(/^\/pair(?:@\w+)?\s+(pair_[A-Za-z0-9_-]+)\s*$/i)
  if (cmd) return cmd[1]!
  return null
}

function childPickKeyboard(pendingId: string, roster: RosterChild[]) {
  const rows: Array<Array<{ text: string; callback_data: string }>> = []
  let row: Array<{ text: string; callback_data: string }> = []
  for (const c of roster.slice(0, 20)) {
    const first = c.name.split(/\s+/)[0] || c.name
    row.push({ text: first, callback_data: `pick:${pendingId}:${c.id}` })
    if (row.length === 2) {
      rows.push(row)
      row = []
    }
  }
  if (row.length) rows.push(row)
  return { inline_keyboard: rows }
}

async function loadRoster(user: StaffUser): Promise<RosterChild[]> {
  const rosterWhere =
    user.role === 'facilitator' && user.room
      ? { centreId: user.centreId, room: user.room }
      : { centreId: user.centreId }
  return prisma.child.findMany({
    where: rosterWhere,
    select: { id: true, name: true, code: true },
    take: 40,
    orderBy: { name: 'asc' },
  })
}

async function finishVoiceMoment(
  obs: HermesObservation,
  user: StaffUser,
  chatId: number | string,
  msgId?: number,
  fromId?: string,
) {
  const moment = await saveHermesMoment({
    obs,
    centreId: user.centreId,
    telegramChatId: String(chatId),
    telegramMsgId: msgId,
    facilitatorTgId: fromId,
  })
  await tgReply(
    chatId,
    `✅ Haeru saved ${obs.childName}'s moment — awaiting Director review.\n\nHeard: “${(obs.transcription || '').slice(0, 180)}”`,
  )
  await notifyDirector(moment.id, user.centreId)
  return moment
}

async function askWhichChild(
  transcript: string,
  roster: RosterChild[],
  user: StaffUser,
  chat: TgChat,
  msgId: number,
  fromId: string,
) {
  if (roster.length === 0) {
    await tgReply(
      chat.id,
      `I heard: “${transcript.slice(0, 180)}”\n\nNo children on the live roster yet. Admit a child in Haeru first.`,
    )
    return
  }

  const pending = savePendingVoice({
    transcript,
    centreId: user.centreId,
    chatId: String(chat.id),
    fromId,
    msgId,
    roster,
  })

  const names = roster.map((c) => c.name.split(/\s+/)[0]).join(', ')
  await tgReply(
    chat.id,
    `I heard: “${transcript.slice(0, 220)}”\n\nWhich child is this about?\n${names}\n\nTap a name, or reply with the child's first name.`,
    { reply_markup: childPickKeyboard(pending.id, roster) },
  )
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
    `✅ Paired with ${user.name} @ ${user.centreId}. Send a short voice note and say the child's name (e.g. “Kinley ate lunch and napped well”).`,
  )
}

async function handleVoice(msg: TgMessage, user: StaffUser) {
  const fileId = msg.voice?.file_id || msg.audio?.file_id || msg.video_note?.file_id
  if (!fileId) return

  await tgReply(msg.chat.id, '🎧 Heard your note — Haeru is listening…')

  try {
    const buf = await downloadVoiceFile(fileId)
    const { text } = await transcribeAudio(buf, 'voice.ogg')
    if (!text) {
      await tgReply(
        msg.chat.id,
        '⚠️ Haeru could not hear that note clearly. Please try a shorter voice note (5–20 seconds) and say the child’s first name.',
      )
      return
    }

    const roster = await loadRoster(user)
    const named = matchChildFromTranscript(text, roster)
    if (!named) {
      await askWhichChild(
        text,
        roster,
        user,
        msg.chat,
        msg.message_id,
        String(msg.from?.id ?? ''),
      )
      return
    }

    const obs = await extractObservation(text, roster)
    if (!obs.childId || obs.childName === 'Unknown child') {
      obs.childId = named.id
      obs.childName = named.name
    }
    await finishVoiceMoment(obs, user, msg.chat.id, msg.message_id, String(msg.from?.id ?? ''))
  } catch (err) {
    console.error('[haeru-voice] voice pipeline', err)
    const hint = err instanceof Error ? err.message : ''
    const sttMissing = /No STT provider|GROQ_API_KEY|OPENAI_API_KEY|DEEPGRAM/i.test(hint)
    await tgReply(
      msg.chat.id,
      sttMissing
        ? '⚠️ Voice AI is not fully configured on the server (speech-to-text key).'
        : '⚠️ Haeru Voice AI hit a temporary error. Please try once more in a minute.',
    )
  }
}

async function completePendingPick(
  pendingId: string,
  child: RosterChild,
  user: StaffUser,
  chatId: number | string,
) {
  const pending = getPendingVoice(pendingId) || getPendingByChat(String(chatId))
  if (!pending || pending.centreId !== user.centreId) return false
  const obs = await extractObservation(pending.transcript, pending.roster)
  obs.childId = child.id
  obs.childName = child.name
  const first = child.name.split(/\s+/)[0] || child.name
  if (!obs.parentSafeTitle || obs.parentSafeTitle.toLowerCase().includes('unknown')) {
    obs.parentSafeTitle = `${first} had a learning moment today`
  }
  if (!obs.parentSafeDesc || obs.parentSafeDesc.toLowerCase().includes('will be confirmed')) {
    obs.parentSafeDesc = `${first} was observed during class — a classmate-safe summary for the family.`
  }
  await finishVoiceMoment(obs, user, chatId, pending.msgId, pending.fromId)
  clearPendingVoice(pending.id, pending.chatId)
  return true
}

async function handleCallback(cb: TgCallback) {
  const data = cb.data || ''
  const staff = await prisma.user.findFirst({
    where: { telegramUserId: String(cb.from.id) },
  })

  if (data.startsWith('pick:')) {
    if (!staff || (staff.role !== 'owner' && staff.role !== 'facilitator')) {
      await answerCallback(cb.id, 'Pair as staff to choose a child.')
      return
    }
    const parts = data.split(':')
    const pendingId = parts[1]
    const childId = parts[2]
    if (!pendingId || !childId) {
      await answerCallback(cb.id, 'Invalid pick')
      return
    }
    const pending = getPendingVoice(pendingId)
    const child = pending?.roster.find((c) => c.id === childId)
    if (!pending || !child) {
      await answerCallback(cb.id, 'That choice expired. Send the voice note again.')
      return
    }
    await answerCallback(cb.id, `Saving for ${child.name.split(' ')[0]}…`)
    await completePendingPick(pendingId, child, staff, cb.message?.chat.id || pending.chatId)
    return
  }

  const director = staff?.role === 'owner' ? staff : null
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
      await tgReply(
        cb.message.chat.id,
        result.ok ? `✅ Confirmed & delivered · ${moment.childName}` : `❌ ${result.error}`,
      )
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

  if (text && (user.role === 'owner' || user.role === 'facilitator')) {
    const pending = getPendingByChat(String(msg.chat.id))
    if (pending) {
      const named = matchChildFromTranscript(text, pending.roster)
      if (named) {
        await completePendingPick(pending.id, named, user, msg.chat.id)
        return
      }
      await tgReply(
        msg.chat.id,
        `I still need a child from the roster. Tap a name above, or reply with one of: ${pending.roster.map((c) => c.name.split(/\s+/)[0]).join(', ')}`,
      )
      return
    }
  }

  if (text && (text === '/help' || text === '/today')) {
    await tgReply(
      msg.chat.id,
      'Haeru Voice AI · send a short voice note.\nSay the child’s first name, plus meals / nap / mood if you can.\nIf Haeru misses the name, it will list children for you to tap.',
    )
  }
}
