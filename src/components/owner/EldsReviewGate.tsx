import { useSyncExternalStore } from 'react'
import { ELDS_REVIEW } from '../../data/enterprise'
import {
  listPendingDirectorMoments,
  postConfirmMoment,
  subscribePulseStore,
} from '../../lib/api/pulseApiServer'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'
import { ELDS_MOTTO } from '../../lib/elds/domains'

function useDirectorMoments() {
  return useSyncExternalStore(
    subscribePulseStore,
    listPendingDirectorMoments,
    listPendingDirectorMoments,
  )
}

export function EldsReviewGate() {
  const { showToast } = useAppStore()
  const hermesPending = useDirectorMoments()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress review"
        subtitle="Oct–Nov window · ELDS 2019 checklists + Hermes voice & photo moments"
        actions={
          <GlassButton
            onClick={() => {
              let n = 0
              for (const m of listPendingDirectorMoments()) {
                const r = postConfirmMoment(m.id, { role: 'owner' })
                if (r.ok) n += 1
              }
              showToast(
                n > 0
                  ? `${n} Hermes moment(s) confirmed · families can see them in the feed`
                  : '24 static ratings confirmed · families can now see them',
              )
            }}
          >
            Confirm all pending
          </GlassButton>
        }
      />

      <div className="obsidian-pill rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
        {ELDS_MOTTO} Families see a rating or Hermes moment only after you confirm it.
      </div>

      {hermesPending.length > 0 && (
        <GlassCard padding="none">
          <div className="p-5 border-b border-slate-200 dark:border-white/10">
            <h2 className="text-lg text-slate-900 dark:text-white">
              Hermes moments awaiting confirmation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Facilitator already verified · your confirm delivers to the child feed (and simulated
              Telegram)
            </p>
          </div>
          <ul className="divide-y divide-slate-200/80 dark:divide-white/5">
            {hermesPending.map((m) => {
              const thumb = m.mediaUrls?.[0]
              return (
                <li
                  key={m.id}
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="w-full sm:w-28 h-36 sm:h-20 object-cover rounded-xl border border-slate-300 dark:border-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-full sm:w-28 h-20 rounded-xl obsidian-pill flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 shrink-0">
                      Voice
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <b className="text-slate-900 dark:text-white">{m.childName}</b>
                      <GlassBadge tone={m.source === 'photo' ? 'ap' : 'violet'}>
                        {m.tag ?? m.source}
                      </GlassBadge>
                    </div>
                    <b className="text-sm text-slate-800 dark:text-slate-100 block">{m.title}</b>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {m.desc}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{m.domain}</p>
                  </div>
                  <GlassButton
                    variant="sm"
                    onClick={() => {
                      const r = postConfirmMoment(m.id, { role: 'owner' })
                      showToast(
                        r.ok
                          ? `Confirmed · visible on ${m.childName.split(' ')[0]}'s feed`
                          : 'Confirm failed',
                      )
                    }}
                  >
                    Confirm & deliver
                  </GlassButton>
                </li>
              )
            })}
          </ul>
        </GlassCard>
      )}

      <GlassCard padding="none">
        <div className="p-5 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-lg text-slate-900 dark:text-white">Checklist ratings awaiting confirmation</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
                <th className="px-5 py-3">Child</th>
                <th className="px-5 py-3">Indicator</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Remark</th>
                <th className="px-5 py-3">By</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {ELDS_REVIEW.map((row) => (
                <tr
                  key={row.childId + row.indicator}
                  className="border-t border-slate-200/80 dark:border-white/5"
                >
                  <td className="px-5 py-3 text-slate-900 dark:text-white font-bold">
                    {row.childName}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{row.indicator}</td>
                  <td className="px-5 py-3">
                    <GlassBadge rating={row.rating} />
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs">
                    {row.remark || '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs">{row.by}</td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <GlassButton
                        variant="ghost"
                        className="!text-xs !py-1.5"
                        onClick={() => showToast('Sent back to facilitator with a question')}
                      >
                        Query
                      </GlassButton>
                      <GlassButton
                        variant="sm"
                        onClick={() => showToast('Rating confirmed')}
                      >
                        Confirm
                      </GlassButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
