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

function heuristicExtract(transcript: string, roster: RosterChild[]): HermesObservation {
  const lower = transcript.toLowerCase()
  const matched =
    roster.find((c) => lower.includes(c.name.toLowerCase())) ||
    roster.find((c) =>
      c.name
        .split(/\s+/)
        .some((part) => part.length > 2 && lower.includes(part.toLowerCase())),
    )

  const childName = matched?.name || roster[0]?.name || 'Unknown child'
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
    parentSafeTitle: `${childName.split(' ')[0]} had a learning moment today`,
    parentSafeDesc: `${childName.split(' ')[0]} was observed during class — a classmate-safe summary for the family.`,
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
- childName MUST be one of the roster children below (or closest match). Prefer including childId.
- parentSafeTitle/parentSafeDesc name ONLY the subject child; peers become "a friend" / "a classmate"
- Never invent children not in the roster
- Domains prefer: Physical & Motor; Social & Emotional; Cognitive; Language (Dzo/Eng); Cultural & Moral; Approaches to Learning

Valid children for THIS classroom only:
${rosterLines}`

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
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
    return HermesObservationSchema.parse(parsed)
  } catch (err) {
    console.error('[haeru-voice] Zod/parse failed', err)
    return heuristicExtract(transcript, roster)
  }
}
