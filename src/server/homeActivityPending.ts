/** Short-lived “how did it go?” wait after Telegram We did it. */

type Pending = { activityId: string; userId: string; expiresAt: number }

const byChat = new Map<string, Pending>()

const TTL_MS = 30 * 60 * 1000

export function savePendingHomeNote(chatId: string, activityId: string, userId: string) {
  byChat.set(String(chatId), { activityId, userId, expiresAt: Date.now() + TTL_MS })
}

export function getPendingHomeNote(chatId: string): Pending | null {
  const row = byChat.get(String(chatId))
  if (!row) return null
  if (row.expiresAt < Date.now()) {
    byChat.delete(String(chatId))
    return null
  }
  return row
}

export function clearPendingHomeNote(chatId: string) {
  byChat.delete(String(chatId))
}
