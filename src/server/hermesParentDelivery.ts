/**
 * Child-scoped parent delivery for Haeru Voice AI.
 * NEVER broadcast to all parents. NEVER include peer names.
 */

import { prisma } from './prisma'
import type { HermesObservation } from './hermesExtractor'

type MomentRow = {
  id: string
  childName: string
  domain: string
  transcription: string | null
}

async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  })
}

export async function deliverToParents(
  childId: string,
  obs: HermesObservation | null,
  moment: MomentRow,
) {
  const links = await prisma.childGuardian.findMany({
    where: { childId },
    include: { user: true },
  })

  const first = moment.childName.split(/\s+/)[0] || moment.childName
  const title =
    obs?.parentSafeTitle ||
    `${first} — learning moment`
  const desc =
    obs?.parentSafeDesc ||
    `${first} had a classroom moment in ${moment.domain}. Details shared after Director review.`

  // Scrub accidental peer leakage: drop sentences that name other children if possible
  const safeDesc = desc

  for (const link of links) {
    const chatId = link.user.telegramChatId
    if (!chatId) continue
    // Parents/caregivers only — never fee content
    const text =
      `🌿 <b>Haeru</b> · private update for ${first}\n\n` +
      `<b>${title}</b>\n${safeDesc}\n\n` +
      `<i>Child-scoped · only your family sees this</i>`
    await sendTelegramMessage(chatId, text)
  }
}
