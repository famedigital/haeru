import type { RosterChild } from './hermesExtractor'

export type PendingVoice = {
  id: string
  transcript: string
  centreId: string
  chatId: string
  fromId: string
  msgId: number
  roster: RosterChild[]
  expiresAt: number
}

const TTL_MS = 15 * 60 * 1000
const pending = new Map<string, PendingVoice>()

function prune() {
  const now = Date.now()
  for (const [id, row] of pending) {
    if (row.expiresAt < now) pending.delete(id)
  }
}

export function savePendingVoice(
  row: Omit<PendingVoice, 'id' | 'expiresAt'> & { id?: string },
): PendingVoice {
  prune()
  const id = row.id || Math.random().toString(36).slice(2, 10)
  const stored: PendingVoice = {
    ...row,
    id,
    expiresAt: Date.now() + TTL_MS,
  }
  pending.set(id, stored)
  pending.set(`chat:${row.chatId}`, stored)
  return stored
}

export function getPendingVoice(id: string): PendingVoice | undefined {
  prune()
  return pending.get(id)
}

export function getPendingByChat(chatId: string): PendingVoice | undefined {
  prune()
  return pending.get(`chat:${chatId}`)
}

export function clearPendingVoice(id: string, chatId?: string) {
  pending.delete(id)
  if (chatId) pending.delete(`chat:${chatId}`)
}
