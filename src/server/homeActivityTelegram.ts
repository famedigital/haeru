/** Telegram copy + keyboards for child-scoped home practice. Never fees, never peers. */

import { prisma } from './prisma'

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function homeOfferText(opts: {
  childFirst: string
  title: string
  instruction: string
  domain: string
}) {
  return (
    `🏡 <b>Home practice for ${escapeHtml(opts.childFirst)}</b>\n` +
    `<i>${escapeHtml(opts.domain)}</i>\n\n` +
    `<b>${escapeHtml(opts.title)}</b>\n${escapeHtml(opts.instruction)}\n\n` +
    `When you have tried it, tap <b>We did it</b> (or mark Done in Haeru on the web). Then tell us how it went.\n` +
    `<i>Expires in 7 days · only your family sees this</i>`
  )
}

export function homeDoneKeyboard(activityId: string) {
  return {
    inline_keyboard: [[{ text: '✅ We did it', callback_data: `hd:${activityId}` }]],
  }
}

export function homeEffortKeyboard(activityId: string) {
  return {
    inline_keyboard: [
      [
        { text: 'Easy', callback_data: `he:${activityId}:easy` },
        { text: 'OK', callback_data: `he:${activityId}:ok` },
        { text: 'Hard', callback_data: `he:${activityId}:hard` },
      ],
      [{ text: 'Skip note', callback_data: `hs:${activityId}` }],
    ],
  }
}

export async function deliverHomeActivityToFamily(activityId: string) {
  const row = await prisma.homeActivity.findUnique({
    where: { id: activityId },
    include: { child: { select: { name: true } } },
  })
  if (!row || row.status !== 'offered') return
  const first = (row.child?.name || 'your child').split(/\s+/)[0] || 'your child'
  const links = await prisma.childGuardian.findMany({
    where: { childId: row.childId },
    include: { user: true },
  })
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  const text = homeOfferText({
    childFirst: first,
    title: row.title,
    instruction: row.instruction,
    domain: row.domain,
  })
  for (const link of links) {
    const chatId = link.user.telegramChatId
    if (!chatId) continue
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: homeDoneKeyboard(row.id),
      }),
    })
  }
}

export async function notifyStaffHomeDone(opts: {
  centreId: string
  childName: string
  title: string
  howWent: string | null
  effort: string | null
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  const directors = await prisma.user.findMany({
    where: { centreId: opts.centreId, role: 'owner', telegramChatId: { not: null } },
  })
  const first = opts.childName.split(/\s+/)[0] || opts.childName
  const text =
    `🏡 <b>Home practice done</b> · ${escapeHtml(first)}\n` +
    `${escapeHtml(opts.title)}\n` +
    (opts.effort ? `Effort: ${escapeHtml(opts.effort)}\n` : '') +
    (opts.howWent ? `${escapeHtml(opts.howWent)}\n` : '') +
    `\nConfirm in Haeru → Progress review to update ELDS.`
  for (const d of directors) {
    if (!d.telegramChatId) continue
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: d.telegramChatId, text, parse_mode: 'HTML' }),
    })
  }
}
