/**
 * Server-only Hermes photo batch (Cloudinary + caption fan-out).
 * Do not import from React components — uses Node crypto via cloudinary helper.
 */

import {
  HermesPhotoBatchSchema,
} from '../lib/api/schemas'
import {
  PULSE_CHILD_ROSTER,
  postConfirmMoment,
  postObservationFromHermes,
  type MomentRow,
} from '../lib/api/pulseApiServer'
import {
  parseChildTagsFromCaption,
  stripTagsFromCaption,
  type CaptionChildRef,
} from '../lib/media/captionTags'
import { resolveMediaUrls } from './cloudinary'
import type { HermesObservationIngest } from '../lib/api/schemas'

export async function postPhotoBatchFromHermes(body: unknown) {
  const parsed = HermesPhotoBatchSchema.safeParse(body)
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: parsed.error.flatten() }
  }
  const data = parsed.data

  const media = await resolveMediaUrls({
    mediaUrls: data.mediaUrls,
    telegramFileUrl: data.telegramFileUrl,
    resourceType: data.resourceType,
  })
  if (!media.ok) {
    return { ok: false as const, status: 400, error: media.error }
  }

  let children: CaptionChildRef[] = []
  if (data.childIds && data.childIds.length > 0) {
    children = data.childIds
      .map((id) => PULSE_CHILD_ROSTER.find((c) => c.id === id))
      .filter((c): c is CaptionChildRef => Boolean(c))
  } else {
    children = parseChildTagsFromCaption(data.caption, PULSE_CHILD_ROSTER)
  }

  if (children.length === 0) {
    return {
      ok: false as const,
      status: 422,
      error:
        'No children matched caption tags. Use @FirstName (e.g. @Kinley @Tashi) or pass childIds.',
    }
  }

  const cleanCaption = stripTagsFromCaption(data.caption)
  const created: MomentRow[] = []

  for (const child of children) {
    const first = child.name.split(' ')[0] ?? child.name
    const ingestBody: HermesObservationIngest = {
      childId: child.id,
      childName: child.name,
      domain: data.domain,
      trigger: data.trigger,
      strategy: data.strategy,
      milestone: data.milestone ?? (cleanCaption || `Photo moment for ${first}`),
      confidence: data.confidence,
      source: 'photo',
      parentSafeTitle: data.parentSafeTitle ?? `${first} at school`,
      parentSafeDesc:
        data.parentSafeDesc ??
        (cleanCaption
          ? `${first}: ${cleanCaption}`
          : `${first} was in today's classroom photos.`),
      rawRef: data.rawRef,
      mediaUrls: media.mediaUrls,
    }
    const result = postObservationFromHermes(ingestBody)
    if (!result.ok) {
      return { ok: false as const, status: result.status, error: result.error }
    }
    let moment = result.data.moment
    if (data.queueForDirector) {
      const queued = postConfirmMoment(moment.id, { role: 'facilitator' })
      if (queued.ok) moment = queued.data
    }
    created.push(moment)
  }

  return {
    ok: true as const,
    status: 201,
    data: {
      mediaUrls: media.mediaUrls,
      childCount: created.length,
      moments: created,
    },
  }
}
