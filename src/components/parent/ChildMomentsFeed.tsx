import { Heart, ImageOff } from 'lucide-react'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { childFirstName } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import {
  listAllDeliveredMoments,
  listDeliveredMomentsForChildren,
  listParentMomentsForChild,
  subscribePulseStore,
  type MomentRow,
} from '../../lib/api/pulseApiServer'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

type LiveHermes = {
  id: string
  childName: string
  domain: string
  transcription: string | null
  rawHermesJson?: string
  confirmedAt?: string | null
  createdAt: string
  source?: string
}

type LiveChild = { id: string; name: string; room: string }

function liveToRow(m: LiveHermes): MomentRow {
  let title = `${m.childName.split(' ')[0]} — learning moment`
  let desc =
    m.domain
      ? `${m.childName.split(' ')[0]} was observed during class — a classmate-safe summary for the family.`
      : 'Learning moment'
  try {
    const raw = m.rawHermesJson ? JSON.parse(m.rawHermesJson) : null
    if (raw?.parentSafeTitle) title = raw.parentSafeTitle
    if (raw?.parentSafeDesc) desc = raw.parentSafeDesc
  } catch {
    /* keep defaults */
  }
  return {
    id: m.id,
    childId: '',
    childName: m.childName,
    title,
    desc,
    domain: m.domain,
    source: (m.source as MomentRow['source']) || 'voice',
    status: 'delivered',
    observationId: m.id,
    createdAt: m.createdAt,
    deliveredAt: m.confirmedAt || m.createdAt,
    tag: 'Haeru Voice AI',
  }
}

function useFeedMoments(): MomentRow[] {
  const { role, selectedChildId, currentUser } = useAppStore()
  const [roomIds, setRoomIds] = useState<string[]>([])
  const [live, setLive] = useState<MomentRow[]>([])

  useEffect(() => {
    if (role !== 'facilitator') {
      setRoomIds([])
      return
    }
    const room = currentUser?.room || 'kg'
    let cancelled = false
    void apiFetch<LiveChild[]>(`/children?room=${encodeURIComponent(room)}`).then((r) => {
      if (cancelled) return
      setRoomIds(r.ok && r.data ? r.data.map((c) => c.id) : [])
    })
    return () => {
      cancelled = true
    }
  }, [role, currentUser?.room])

  const legacy = useSyncExternalStore(
    subscribePulseStore,
    () => {
      if (role === 'owner') return listAllDeliveredMoments()
      if (role === 'facilitator') return listDeliveredMomentsForChildren(roomIds)
      return listParentMomentsForChild(selectedChildId)
    },
    () => [] as MomentRow[],
  )

  useEffect(() => {
    if (role !== 'parent' && role !== 'caregiver') {
      setLive([])
      return
    }
    if (!selectedChildId) return
    let cancelled = false
    void apiFetch<{ live?: LiveHermes[] }>(
      `/parents/child/${encodeURIComponent(selectedChildId)}/moments`,
    ).then((r) => {
      if (cancelled) return
      setLive((r.data?.live ?? []).map(liveToRow))
    })
    return () => {
      cancelled = true
    }
  }, [role, selectedChildId])

  return useMemo(() => {
    if (role === 'parent' || role === 'caregiver') {
      const ids = new Set(live.map((m) => m.id))
      return [...live, ...legacy.filter((m) => !ids.has(m.id))]
    }
    return legacy
  }, [role, live, legacy])
}

function FeedEmpty({ subtitle }: { subtitle: string }) {
  return (
    <GlassCard padding="lg" className="max-w-xl mx-auto text-center space-y-3">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 flex items-center justify-center">
        <ImageOff className="w-6 h-6 text-slate-500 dark:text-slate-400" aria-hidden />
      </div>
      <h2 className="text-lg text-slate-900 dark:text-white">Nothing here yet</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
    </GlassCard>
  )
}

function MomentMedia({ urls, title }: { urls: string[]; title: string }) {
  const primary = urls[0]
  if (!primary) return null
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(primary) || primary.includes('/video/upload/')
  if (isVideo) {
    return (
      <video
        className="w-full max-h-[420px] object-cover bg-slate-900"
        controls
        playsInline
        preload="metadata"
        aria-label={title}
      >
        <source src={primary} />
      </video>
    )
  }
  return (
    <img
      src={primary}
      alt={title}
      className="w-full max-h-[420px] object-cover bg-slate-900"
      loading="lazy"
    />
  )
}

function FeedPost({ moment, showChild }: { moment: MomentRow; showChild: boolean }) {
  const when = moment.deliveredAt ?? moment.createdAt
  const media = moment.mediaUrls ?? []

  return (
    <GlassCard padding="none" className="overflow-hidden max-w-xl mx-auto">
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {showChild ? moment.childName : moment.title}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {showChild ? moment.title : 'School'} ·{' '}
            {when ? new Date(when).toLocaleString() : ''}
          </div>
        </div>
        <GlassBadge tone={moment.source === 'photo' ? 'ap' : 'violet'}>
          {moment.tag ?? moment.source}
        </GlassBadge>
      </div>

      {media.length > 0 ? <MomentMedia urls={media} title={moment.title} /> : null}

      <div className="px-4 py-3 space-y-2">
        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
          {moment.desc}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{moment.domain}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <Heart className="w-3.5 h-3.5" aria-hidden />
          <span>Likes coming later</span>
        </div>
      </div>
    </GlassCard>
  )
}

export function ChildMomentsFeed() {
  const { role, selectedChildId, currentUser } = useAppStore()
  const moments = useFeedMoments()
  const [childName, setChildName] = useState('your child')

  useEffect(() => {
    if ((role !== 'parent' && role !== 'caregiver') || !selectedChildId) return
    let cancelled = false
    void apiFetch<{ name?: string }>(`/children/${encodeURIComponent(selectedChildId)}`).then(
      (r) => {
        if (cancelled) return
        if (r.ok && r.data?.name) setChildName(r.data.name)
      },
    )
    return () => {
      cancelled = true
    }
  }, [role, selectedChildId])

  const meta = useMemo(() => {
    if (role === 'owner') {
      return {
        title: 'Center feed',
        subtitle: 'Delivered photos, voice moments, and updates across the center',
        empty: 'No delivered posts yet. Confirm pending moments in Progress review.',
        showChild: true,
      }
    }
    if (role === 'facilitator') {
      const room = currentUser?.room || 'kg'
      return {
        title: 'Classroom feed',
        subtitle: `Delivered posts for your ${room} children`,
        empty: 'No delivered posts for this classroom yet.',
        showChild: true,
      }
    }
    const first = childFirstName(childName)
    return {
      title: 'Photos & updates',
      subtitle: `Moments from ${first}'s days at school`,
      empty: `No posts for ${first} yet. When school shares photos or voice moments — and the Director confirms — they appear here.`,
      showChild: false,
    }
  }, [role, childName, currentUser?.room])

  return (
    <div className="space-y-6">
      <PageHeader title={meta.title} subtitle={meta.subtitle} />

      <div className="obsidian-pill rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl">
        {role === 'parent' || role === 'caregiver'
          ? "Only your child's posts appear here. Peers stay anonymous. Media appears only after Director confirmation."
          : 'Staff see delivered posts only. Pending media stays in Progress review until Director confirms.'}
      </div>

      {moments.length === 0 ? (
        <FeedEmpty subtitle={meta.empty} />
      ) : (
        <div className="space-y-4">
          {moments.map((m) => (
            <FeedPost key={m.id} moment={m} showChild={meta.showChild} />
          ))}
        </div>
      )}
    </div>
  )
}
