import { Heart, ImageOff } from 'lucide-react'
import { useMemo, useSyncExternalStore } from 'react'
import { CHILDREN, childFirstName } from '../../data/enterprise'
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

/** Facilitator demo classroom — nursery (matches PhotoStaging). */
const FACILITATOR_ROOM = 'nursery'

function feedSnapshot(role: string, selectedChildId: string): MomentRow[] {
  if (role === 'owner') return listAllDeliveredMoments()
  if (role === 'facilitator') {
    const ids = CHILDREN.filter((c) => c.room === FACILITATOR_ROOM).map((c) => c.id)
    return listDeliveredMomentsForChildren(ids)
  }
  return listParentMomentsForChild(selectedChildId)
}

function useFeedMoments(): MomentRow[] {
  const { role, selectedChildId } = useAppStore()
  return useSyncExternalStore(
    subscribePulseStore,
    () => feedSnapshot(role, selectedChildId),
    () => feedSnapshot(role, selectedChildId),
  )
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
          {moment.telegramSimulated ? <GlassBadge tone="neutral">Telegram simulated</GlassBadge> : null}
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
  const { role, selectedChildId } = useAppStore()
  const moments = useFeedMoments()

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
      return {
        title: 'Classroom feed',
        subtitle: 'Delivered posts for your nursery children',
        empty: 'No delivered posts for this classroom yet.',
        showChild: true,
      }
    }
    const child = CHILDREN.find((c) => c.id === selectedChildId)
    const first = child ? childFirstName(child.name) : 'your child'
    return {
      title: 'Photos & updates',
      subtitle: `Moments from ${first}'s days at school`,
      empty: `No posts for ${first} yet. When school shares photos or voice moments — and the Director confirms — they appear here.`,
      showChild: false,
    }
  }, [role, selectedChildId])

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
        <div className="space-y-5">
          {moments.map((m) => (
            <FeedPost key={m.id} moment={m} showChild={meta.showChild} />
          ))}
        </div>
      )}
    </div>
  )
}
