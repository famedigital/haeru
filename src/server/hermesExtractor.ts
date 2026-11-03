/**
 * Tenant-scoped observation extraction for Haeru Voice AI.
 * Customer messages never say "Hermes".
 */

import { z } from 'zod'

export const HermesObservationSchema = z
  .object({
    childId: z.string().optional(),
    childName: z.string().min(1),
    domain: z.string().min(1),
    trigger: z.string().min(1),
    strategy: z.string().min(1),
    milestone: z.string().min(1),
    confidence: z.string().min(1),
    source: z.enum(['voice', 'photo', 'cctv']),
    transcription: z.string().optional(),
    parentSafeTitle: z.string().optional(),
    parentSafeDesc: z.string().optional(),
    rawRef: z.string().optional(),
    mediaUrls: z.array(z.string()).optional(),
  })
  .strict()

export type HermesObservation = z.infer<typeof HermesObservationSchema>

export type RosterChild = { id: string; name: string; code?: string }

function firstName(name: string) {
  return (name.split(/\s+/)[0] || name).toLowerCase()
}

function includesLoose(hay: string, needle: string) {
  if (!needle || needle.length < 3) return false
  if (hay.includes(needle)) return true
  // STT often drops a letter (Kinle / Kinley)
  if (needle.length >= 5 && hay.includes(needle.slice(0, -1))) return true
  return false
}

/** Match a roster child from spoken text. Does NOT guess the first child. */
export function matchChildFromTranscript(
  transcript: string,
  roster: RosterChild[],
): RosterChild | null {
  const lower = transcript.toLowerCase()
  const full = roster.find((c) => includesLoose(lower, c.name.toLowerCase()))
  if (full) return full
  const byFirst = roster.find((c) => includesLoose(lower, firstName(c.name)))
  if (byFirst) return byFirst
  return null
}

function careBits(transcript: string): string[] {
  const t = transcript.toLowerCase()
  const bits: string[] = []
  if (/\b(ate|eaten|lunch|breakfast|porridge|rice|soup|meal)\b/.test(t)) bits.push('meals noted')
  if (/\b(nap|slept|sleep|rest)\b/.test(t)) bits.push('rest/nap noted')
  if (/\b(happy|cheerful|sad|upset|mood|calm|radiant)\b/.test(t)) bits.push('mood noted')
  if (/\b(toilet|potty|wee|diaper)\b/.test(t)) bits.push('toileting noted')
  return bits
}

function heuristicExtract(transcript: string, roster: RosterChild[]): HermesObservation {
  const matched = matchChildFromTranscript(transcript, roster)
  const childName = matched?.name || 'Unknown child'
  const childId = matched?.id

  return HermesObservationSchema.parse({
    childId,
    childName,
    domain: 'Approaches to Learning',
    trigger: 'None (Positive Reinforcement)',
    strategy: 'Facilitator voice observation via Haeru Voice AI',
    milestone: 'Classroom moment captured from spoken note',
    confidence: 'Heuristic fallback · configure GEMINI_API_KEY for full ELDS mapping',
    source: 'voice',
    transcription: transcript,
    parentSafeTitle: matched
      ? `${childName.split(' ')[0]} had a learning moment today`
      : 'Learning moment today',
    parentSafeDesc: matched
      ? `${childName.split(' ')[0]} was observed during class${careBits(transcript).length ? ` (${careBits(transcript).join(', ')})` : ''} — a classmate-safe summary for the family.`
      : 'A classroom moment was recorded. Child will be confirmed by staff.',
  })
}

function stripJsonFence(text: string): string {
  const trimmed = text.trim()
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence?.[1]) return fence[1].trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1)
  return trimmed
}

/** Extract ELDS observation; roster is already filtered to one centre+room */
export async function extractObservation(
  transcript: string,
  roster: RosterChild[],
): Promise<HermesObservation> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return heuristicExtract(transcript, roster)
  }

  const rosterLines = roster.map((c) => `- ${c.name} (id:${c.id})`).join('\n') || '- (empty roster)'
  const system = `You are Haeru Voice AI, an ECCD observation extractor for Bhutan MoESD ELDS 2019.
Return JSON ONLY matching this shape:
{ childId?, childName, domain, trigger, strategy, milestone, confidence, source, transcription?, parentSafeTitle?, parentSafeDesc? }
Rules:
- source must be "voice"
- If the transcript clearly names a roster child, set childName + childId.
- If the child is UNCLEAR, set childName to "UNKNOWN" and omit childId. Do not guess.
- parentSafeTitle/parentSafeDesc name ONLY the subject child; peers become "a friend" / "a classmate"
- Never invent children not in the roster
- Extract care if spoken: meals, nap, mood, toileting into parentSafeDesc
- Domains prefer: Physical & Motor; Social & Emotional; Cognitive; Language (Dzo/Eng); Cultural & Moral; Approaches to Learning

Valid children for THIS classroom only:
${rosterLines}`

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${system}\n\nFacilitator transcript:\n${transcript}` }],
        },
      ],
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
    }),
  })

  if (!res.ok) {
    console.error('[haeru-voice] Gemini extract failed', await res.text())
    return heuristicExtract(transcript, roster)
  }

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
  try {
    const parsed = JSON.parse(stripJsonFence(text)) as Record<string, unknown>
    if (!parsed.source) parsed.source = 'voice'
    if (!parsed.transcription) parsed.transcription = transcript
    const parsedName = String(parsed.childName || '')
    if (!parsedName || parsedName.toUpperCase() === 'UNKNOWN') {
      parsed.childName = 'Unknown child'
      delete parsed.childId
    }
    const matched = matchChildFromTranscript(transcript, roster)
    if (matched && (!parsed.childId || parsed.childName === 'Unknown child')) {
      parsed.childId = matched.id
      parsed.childName = matched.name
    }
    return HermesObservationSchema.parse(parsed)
  } catch (err) {
    console.error('[haeru-voice] Zod/parse failed', err)
    return heuristicExtract(transcript, roster)
  }
}
