import { Camera, CloudUpload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { childFirstName } from '../../data/enterprise'
import {
  postConfirmMoment,
  postObservationFromHermes,
} from '../../lib/api/pulseApiServer'
import {
  parseChildTagsFromCaption,
  stripTagsFromCaption,
} from '../../lib/media/captionTags'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

/** Public Cloudinary demo assets — replaced by real upload when CLOUDINARY_* is set on Hermes host. */
const DEMO_MEDIA = [
  {
    id: 'blocks',
    label: 'Blocks',
    url: 'https://res.cloudinary.com/demo/image/upload/w_800,c_fill,q_auto/docs/models.jpg',
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    url: 'https://res.cloudinary.com/demo/image/upload/w_800,c_fill,q_auto/sample.jpg',
  },
  {
    id: 'art',
    label: 'Art',
    url: 'https://res.cloudinary.com/demo/image/upload/w_800,c_fill,q_auto/docs/business.jpg',
  },
] as const

type LiveChild = {
  id: string
  name: string
  feedConsent?: boolean
  photoConsentFeed?: boolean
}

export function PhotoStaging() {
  const { showToast, currentUser } = useAppStore()
  const room = currentUser?.room || 'kg'
  const [roster, setRoster] = useState<LiveChild[]>([])
  const [mediaIdx, setMediaIdx] = useState(0)
  const [caption, setCaption] = useState(
    '@Kinley Rainbow hands today — mixing colours to make green.',
  )
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    void apiFetch<LiveChild[]>(`/children?room=${encodeURIComponent(room)}`).then((r) => {
      if (cancelled) return
      setRoster(r.ok && r.data ? r.data : [])
    })
    return () => {
      cancelled = true
    }
  }, [room])

  const media = DEMO_MEDIA[mediaIdx] ?? DEMO_MEDIA[0]
  const rosterForTags = useMemo(
    () => roster.map((c) => ({ id: c.id, name: c.name })),
    [roster],
  )
  const tagged = useMemo(
    () => parseChildTagsFromCaption(caption, rosterForTags),
    [caption, rosterForTags],
  )
  const noConsent = tagged.filter((t) => {
    const child = roster.find((c) => c.id === t.id)
    return child && !(child.feedConsent ?? child.photoConsentFeed)
  })

  const sendToDirector = () => {
    if (tagged.length === 0) {
      showToast('Add @ChildName tags in the caption (e.g. @Kinley)')
      return
    }
    if (noConsent.length > 0) {
      showToast(
        `${childFirstName(noConsent[0]!.name)} has no feed consent — split or remove tag before send`,
      )
      return
    }

    setBusy(true)
    const clean = stripTagsFromCaption(caption)
    let created = 0
    for (const child of tagged) {
      const first = childFirstName(child.name)
      const ingest = postObservationFromHermes({
        childId: child.id,
        childName: child.name,
        domain: 'Approaches to Learning',
        trigger: 'Photo / video classroom moment',
        strategy: 'Documented via Telegram + caption tags',
        milestone: clean || `Photo moment for ${first}`,
        confidence: 'Caption-tagged photo · awaiting Director confirm',
        source: 'photo',
        parentSafeTitle: `${first} at school`,
        parentSafeDesc: clean
          ? `${first}: ${clean}`
          : `${first} was in today's classroom photos.`,
        mediaUrls: [media.url],
        rawRef: `telegram-sim:${media.id}`,
      })
      if (!ingest.ok) {
        showToast('Photo observation failed schema validation')
        setBusy(false)
        return
      }
      const queued = postConfirmMoment(ingest.data.moment.id, { role: 'facilitator' })
      if (!queued.ok) {
        showToast('Could not queue for Director review')
        setBusy(false)
        return
      }
      created += 1
    }
    setBusy(false)
    showToast(
      `${created} child post(s) queued · same Cloudinary photo · Director must confirm`,
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telegram photos"
        subtitle="Facilitator sends a photo with @ChildName tags — Hermes uploads to Cloudinary and fans out one post per child."
      />

      <GlassCard padding="lg" className="space-y-4 relative overflow-hidden">
        <GlassBadge tone="violet">Hermes · Cloudinary · Director gate</GlassBadge>
        <h2 className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-500" /> Stage classroom photo
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
          Caption with <code className="text-emerald-700 dark:text-emerald-300">@Kinley</code>{' '}
          tags. One upload, one pending post per tagged child. Parents see nothing until Director
          confirms.
        </p>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard padding="lg" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-slate-900 dark:text-white">Media</h2>
            <GlassBadge tone="neutral">
              <span className="inline-flex items-center gap-1">
                <CloudUpload className="w-3 h-3" aria-hidden /> Cloudinary demo
              </span>
            </GlassBadge>
          </div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-300 dark:border-white/10 bg-slate-900">
            <img
              src={media.url}
              alt={media.label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_MEDIA.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMediaIdx(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  i === mediaIdx
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-700 dark:text-emerald-200'
                    : 'obsidian-pill text-slate-500 dark:text-slate-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live Hermes uploads Telegram files to Cloudinary, then POSTs{' '}
            <code className="text-slate-700 dark:text-slate-200">/api/media/photo-from-hermes</code>.
            EXIF / GPS stripped on upload.
          </p>
        </GlassCard>

        <GlassCard padding="lg" className="space-y-4">
          <h2 className="text-lg text-slate-900 dark:text-white">Caption tags</h2>
          <label className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            Telegram caption
            <textarea
              className="glass-input min-h-[100px]"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </label>

          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Matched children ({tagged.length}
              {roster.length ? ` · ${roster.length} in room` : ''})
            </div>
            <div className="flex flex-wrap gap-2">
              {tagged.length === 0 ? (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  No tags yet — try @Kinley
                </span>
              ) : (
                tagged.map((c) => {
                  const live = roster.find((x) => x.id === c.id)
                  const consent = live?.feedConsent ?? live?.photoConsentFeed
                  return (
                    <GlassBadge key={c.id} tone={consent ? 'ap' : 'nya'}>
                      {childFirstName(c.name)}
                      {!consent ? ' · no consent' : ''}
                    </GlassBadge>
                  )
                })
              )}
            </div>
          </div>

          {noConsent.length > 0 && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-100 space-y-1">
              <b>{childFirstName(noConsent[0]!.name)}&apos;s family has not agreed to feed photos.</b>
              <p>Remove their tag or split the post before queuing.</p>
            </div>
          )}

          <div className="obsidian-pill rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300">
            <b className="text-emerald-700 dark:text-emerald-300">Who will see this:</b> each tagged
            child&apos;s family only, after Director confirm. Same Cloudinary URL on every child
            post.
          </div>

          <div className="flex justify-end gap-2">
            <GlassButton disabled={busy} onClick={sendToDirector}>
              {busy ? 'Queuing…' : 'Send to Director queue'}
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
