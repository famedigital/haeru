/**
 * Parse facilitator Telegram captions for child tags.
 * Supports @Kinley, @kinley, and bare first/full names from the center roster.
 */

export type CaptionChildRef = {
  id: string
  name: string
}

const WORD = /[A-Za-z\u00C0-\u024F]+/g

/** Extract @handles and match roster names (longest match first). */
export function parseChildTagsFromCaption(
  caption: string,
  roster: CaptionChildRef[],
): CaptionChildRef[] {
  const found = new Map<string, CaptionChildRef>()
  const text = caption.trim()
  if (!text || roster.length === 0) return []

  const atHandles = text.match(/@([A-Za-z][A-Za-z-]*)/g) ?? []
  for (const raw of atHandles) {
    const handle = raw.slice(1).toLowerCase()
    const hit = roster.find((c) => {
      const first = (c.name.split(/\s+/)[0] ?? '').toLowerCase()
      return first === handle || c.name.toLowerCase().replace(/\s+/g, '') === handle
    })
    if (hit) found.set(hit.id, hit)
  }

  const sorted = [...roster].sort((a, b) => b.name.length - a.name.length)
  const lower = text.toLowerCase()
  for (const child of sorted) {
    if (found.has(child.id)) continue
    const full = child.name.toLowerCase()
    const first = (child.name.split(/\s+/)[0] ?? '').toLowerCase()
    if (includesNameToken(lower, full) || includesNameToken(lower, first)) {
      found.set(child.id, child)
    }
  }

  return Array.from(found.values())
}

function includesNameToken(haystack: string, name: string) {
  if (!name || name.length < 2) return false
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(?:^|[^a-z])${escaped}(?:$|[^a-z])`, 'i')
  return re.test(haystack)
}

/** Caption text with @tags stripped for parent-safe body copy. */
export function stripTagsFromCaption(caption: string): string {
  return caption
    .replace(/@[A-Za-z][A-Za-z-]*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Soft check that caption has at least one plausible name token (for UX hints). */
export function captionHasNameLikeTokens(caption: string): boolean {
  const words = caption.match(WORD) ?? []
  return words.some((w) => w[0] === w[0]?.toUpperCase() && w.length > 2)
}
