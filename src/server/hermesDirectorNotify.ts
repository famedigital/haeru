/**
 * Notify centre Director(s) only — tenant-partitioned by centreId.
 */

import { prisma } from './prisma'

export async function notifyDirector(momentId: string, centreId: string) {
  const moment = await prisma.hermesMoment.findUnique({ where: { id: momentId } })
  if (!moment || moment.centreId !== centreId) return

  const directors = await prisma.user.findMany({
    where: { centreId, role: 'owner', telegramChatId: { not: null } },
  })

  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return

  const snippet = (moment.transcription || '').slice(0, 160)
  const text =
    `📋 <b>Haeru Voice AI</b> · Director review\n\n` +
    `<b>${moment.childName}</b> · ${moment.domain}\n` +
    (snippet ? `<i>“${snippet}${snippet.length >= 160 ? '…' : ''}”</i>\n\n` : '\n') +
    `Confirm before parents see this.`

  for (const d of directors) {
    if (!d.telegramChatId) continue
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: d.telegramChatId,
        text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Confirm & Deliver', callback_data: `confirm:${moment.id}` },
              { text: '❌ Reject', callback_data: `reject:${moment.id}` },
            ],
          ],
        },
      }),
    })
  }
}
