import { useMemo } from 'react'
import { CHILDREN, ROOMS, formatNu } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

export function ChildrenDirectory() {
  const { roomFilter, setScreen, openChild, role } = useAppStore()

  const rows = useMemo(() => {
    let list = CHILDREN
    if (role === 'facilitator') list = list.filter((c) => c.room === 'nursery')
    else if (roomFilter !== 'all') list = list.filter((c) => c.room === roomFilter)
    return list
  }, [roomFilter, role])

  return (
    <div className="space-y-6">
      <PageHeader
        title={role === 'facilitator' ? 'My children' : 'Children'}
        subtitle={
          role === 'facilitator'
            ? 'Nursery · 17 children · 15 here today'
            : '45 enrolled across 3 rooms'
        }
        actions={
          role === 'owner' ? (
            <GlassButton onClick={() => setScreen('applications')}>New admission</GlassButton>
          ) : undefined
        }
      />

      <GlassCard padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
                <th className="px-5 py-3">Child</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Age</th>
                <th className="px-5 py-3">Guardian</th>
                <th className="px-5 py-3">Media consent</th>
                <th className="px-5 py-3">{role === 'facilitator' ? 'Today' : 'Fees'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((k) => (
                <tr
                  key={k.id}
                  className="border-t border-white/5 hover:bg-white/[0.03] cursor-pointer"
                  onClick={() => openChild(k.id)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                        style={{ background: ROOMS[k.room].bg }}
                      >
                        {k.name
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                      <div>
                        <b className="text-slate-900 dark:text-white block">{k.name}</b>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{k.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="pill text-xs px-2 py-1 rounded-full text-slate-900 font-bold"
                      style={{ background: ROOMS[k.room].bg }}
                    >
                      {ROOMS[k.room].name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{k.age}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{k.guardian}</td>
                  <td className="px-5 py-3">
                    {k.feedConsent ? (
                      <GlassBadge tone="ap">Feed & social</GlassBadge>
                    ) : (
                      <GlassBadge tone="nya">No feed photos</GlassBadge>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {role === 'facilitator' ? (
                      <GlassBadge tone="bl">Log update</GlassBadge>
                    ) : (
                      <GlassBadge
                        tone={
                          k.feeStatus === 'overdue'
                            ? 'nya'
                            : k.feeStatus === 'due'
                              ? 'bl'
                              : 'ap'
                        }
                      >
                        {k.feeStatus === 'due' ? 'Due 15 Oct' : k.feeStatus}
                      </GlassBadge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {role === 'owner' && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Overdue sample reference: {formatNu(25400)} across families flagged on Today.
        </p>
      )}
    </div>
  )
}
