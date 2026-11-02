import { useEffect, useMemo, useState } from 'react'
import { ROOMS, formatNu } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import type { RoomId } from '../../types/enterprise'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

type LiveChild = {
  id: string
  code: string
  name: string
  room: string
  age?: string
  feedConsent?: boolean
  photoConsentFeed?: boolean
  guardians?: Array<{
    isPrimary?: boolean
    user?: { name?: string }
  }>
}

function roomSafe(room: string): RoomId {
  if (room in ROOMS) return room as RoomId
  return 'kg'
}

export function ChildrenDirectory() {
  const { roomFilter, setScreen, openChild, role, currentUser, showToast } = useAppStore()
  const [rows, setRows] = useState<LiveChild[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const qs =
      role === 'facilitator' && currentUser?.room
        ? `?room=${encodeURIComponent(currentUser.room)}`
        : roomFilter !== 'all'
          ? `?room=${encodeURIComponent(roomFilter)}`
          : ''
    void apiFetch<LiveChild[]>(`/children${qs}`).then((r) => {
      if (cancelled) return
      if (r.ok && r.data) setRows(r.data)
      else {
        setRows([])
        showToast('Could not load children roster')
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [role, roomFilter, currentUser?.room, showToast])

  const subtitle = useMemo(() => {
    if (role === 'facilitator') {
      const room = currentUser?.room || 'kg'
      return `${ROOMS[room]?.name || room} · ${rows.length} children`
    }
    return `${rows.length} enrolled${roomFilter !== 'all' ? ` · ${ROOMS[roomFilter]?.name}` : ' across rooms'}`
  }, [role, currentUser?.room, rows.length, roomFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title={role === 'facilitator' ? 'My children' : 'Children'}
        subtitle={subtitle}
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
                <th className="px-5 py-3">{role === 'facilitator' ? 'Today' : 'Profile'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-slate-500 dark:text-slate-400 text-sm">
                    Loading live roster…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-slate-500 dark:text-slate-400 text-sm">
                    No children yet. Complete an admission to populate the roster.
                  </td>
                </tr>
              ) : (
                rows.map((k) => {
                  const room = roomSafe(k.room)
                  const guardian =
                    k.guardians?.find((g) => g.isPrimary)?.user?.name ||
                    k.guardians?.[0]?.user?.name ||
                    '—'
                  const consent = k.feedConsent ?? k.photoConsentFeed
                  return (
                    <tr
                      key={k.id}
                      className="border-t border-white/5 hover:bg-white/[0.03] cursor-pointer"
                      onClick={() => openChild(k.id)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                            style={{ background: ROOMS[room].bg }}
                          >
                            {k.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)}
                          </span>
                          <div>
                            <b className="text-slate-900 dark:text-white block">{k.name}</b>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {k.code}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="pill text-xs px-2 py-1 rounded-full text-slate-900 font-bold"
                          style={{ background: ROOMS[room].bg }}
                        >
                          {ROOMS[room].name}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                        {k.age || '—'}
                      </td>
                      <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{guardian}</td>
                      <td className="px-5 py-3">
                        {consent ? (
                          <GlassBadge tone="ap">Feed & social</GlassBadge>
                        ) : (
                          <GlassBadge tone="nya">No feed photos</GlassBadge>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {role === 'facilitator' ? (
                          <GlassBadge tone="bl">Log update</GlassBadge>
                        ) : (
                          <GlassBadge tone="ap">Open</GlassBadge>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {role === 'owner' && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Live roster from admissions · fee summaries stay on Finance ({formatNu(0)} placeholder until
          invoice sync).
        </p>
      )}
    </div>
  )
}
