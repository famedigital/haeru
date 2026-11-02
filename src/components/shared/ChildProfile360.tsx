import { useEffect, useState } from 'react'
import { ROOMS, formatNu, childFirstName } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import type { RoomId } from '../../types/enterprise'
import { GlassBadge, GlassButton, GlassCard, GlassTabs } from '../ui'
import { ChildDailyLog } from './ChildDailyLog'
import {
  ChildProgressPanel,
  type DomainStat,
  type ProgressMilestone,
} from './ChildProgressPanel'
import type { RadarSeries } from '../../types/enterprise'

type GuardianRow = {
  id: string
  relation: string
  isPrimary: boolean
  canViewFinance: boolean
  canPickup: boolean
  user: { id: string; name: string; phone: string; email?: string | null; role: string }
}

type PickupRow = {
  id: string
  pickupTime: string
  personName: string
  relation: string
}

type LiveChild = {
  id: string
  code: string
  name: string
  room: string
  age?: string
  gender: string
  allergies?: string | null
  medication?: string | null
  napRoutine?: string | null
  toiletStatus?: string | null
  motherTongue?: string | null
  doctorInfo?: string | null
  feedConsent?: boolean
  socialConsent?: boolean
  photoConsentFeed?: boolean
  photoConsentSocial?: boolean
  guardians?: GuardianRow[]
  pickupLogs?: PickupRow[]
  emergency?: {
    allergies?: string | null
    medication?: string | null
    doctorInfo?: string | null
    napRoutine?: string | null
    toiletStatus?: string | null
    motherTongue?: string | null
  }
}

type ProgressPayload = {
  domainStats: DomainStat[]
  radarSeries: RadarSeries[]
  recentMilestones: ProgressMilestone[]
}

export function ChildProfile360() {
  const { role, selectedChildId, setScreen, showToast } = useAppStore()
  const [tab, setTab] = useState(0)
  const [child, setChild] = useState<LiveChild | null>(null)
  const [progress, setProgress] = useState<ProgressPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedChildId) return
    let cancelled = false
    setLoading(true)
    void Promise.all([
      apiFetch<LiveChild>(`/children/${encodeURIComponent(selectedChildId)}`),
      apiFetch<ProgressPayload>(`/children/${encodeURIComponent(selectedChildId)}/progress`),
    ]).then(([childRes, progRes]) => {
      if (cancelled) return
      if (childRes.ok && childRes.data) setChild(childRes.data)
      else {
        setChild(null)
        showToast('Could not load child profile')
      }
      if (progRes.ok && progRes.data) setProgress(progRes.data)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [selectedChildId, showToast])

  const canSeeFees = role === 'owner' || role === 'parent'
  const tabs = canSeeFees
    ? ['Overview', 'Daily log', 'Progress', 'Family', 'Fees', 'Photos']
    : ['Overview', 'Daily log', 'Progress', 'Family', 'Photos']

  const backLabel =
    role === 'facilitator' ? 'My children' : role === 'parent' || role === 'caregiver' ? 'Home' : 'Children'
  const backScreen =
    role === 'facilitator'
      ? 'children'
      : role === 'parent'
        ? 'phome'
        : role === 'caregiver'
          ? 'chome'
          : 'children'

  if (loading && !child) {
    return (
      <div className="text-sm text-slate-600 dark:text-slate-300 py-12 text-center">
        Loading child profile…
      </div>
    )
  }

  if (!child) {
    return (
      <GlassCard padding="lg" className="max-w-lg mx-auto text-center space-y-3">
        <h2 className="text-lg text-slate-900 dark:text-white">Child not found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Open a child from the directory or parent home after signing in.
        </p>
        <GlassButton onClick={() => setScreen(backScreen)}>← Back</GlassButton>
      </GlassCard>
    )
  }

  const roomKey = (child.room in ROOMS ? child.room : 'kg') as RoomId
  const room = ROOMS[roomKey]
  const first = childFirstName(child.name)
  const emergency = child.emergency || {
    allergies: child.allergies,
    medication: child.medication,
    doctorInfo: child.doctorInfo,
    napRoutine: child.napRoutine,
    toiletStatus: child.toiletStatus,
    motherTongue: child.motherTongue,
  }
  const guardians = child.guardians || []
  const pickups = child.pickupLogs || []
  const feedOk = child.feedConsent ?? child.photoConsentFeed ?? true
  const socialOk = child.socialConsent ?? child.photoConsentSocial ?? true

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => setScreen(backScreen)}
        className="text-sm text-emerald-700 dark:text-emerald-300 font-bold hover:text-emerald-700 dark:hover:text-emerald-200"
      >
        ← {backLabel}
      </button>

      <GlassCard padding="lg" className="flex flex-col sm:flex-row sm:items-center gap-5">
        <span
          className="w-[76px] h-[76px] rounded-2xl flex items-center justify-center text-xl font-bold text-slate-900 shrink-0"
          style={{ background: room.bg }}
        >
          {child.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
        </span>
        <div className="flex-1 min-w-0 space-y-2">
          <h1 className="text-2xl md:text-3xl text-slate-900 dark:text-white">{child.name}</h1>
          <div className="flex flex-wrap gap-2">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-slate-900"
              style={{ background: room.bg }}
            >
              {room.name}
            </span>
            <GlassBadge tone="neutral">{child.age || ''}</GlassBadge>
            <GlassBadge tone="neutral">{child.code}</GlassBadge>
            <GlassBadge tone="ap">Live profile</GlassBadge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(role === 'owner' || role === 'facilitator') && (
            <GlassButton
              onClick={() => setScreen(role === 'facilitator' ? 'ftoday' : 'children')}
            >
              Daily update
            </GlassButton>
          )}
        </div>
      </GlassCard>

      <GlassTabs items={tabs} value={tab} onChange={setTab} />

      {tabs[tab] === 'Daily log' && (
        <ChildDailyLog childId={child.id} firstName={first} />
      )}

      {tabs[tab] === 'Overview' && (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
          <div className="space-y-5">
            <ChildDailyLog childId={child.id} firstName={first} />
            <GlassCard padding="lg">
              <h2 className="text-lg text-slate-900 dark:text-white mb-4">Care & medical</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['Allergies', emergency.allergies || 'None recorded'],
                  ['Medication', emergency.medication || 'None'],
                  ['Nap', emergency.napRoutine || 'Not set'],
                  ['Toileting', emergency.toiletStatus || 'Not set'],
                  ['Mother tongue', emergency.motherTongue || '—'],
                  ['Doctor', emergency.doctorInfo || '—'],
                ].map(([a, b]) => (
                  <div key={a}>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{a}</span>
                    <b className="text-slate-800 dark:text-slate-100 text-sm">{b}</b>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard padding="lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg text-slate-900 dark:text-white">Pickup log</h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">Recent</span>
              </div>
              {pickups.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">No pickup events logged yet.</p>
              ) : (
                pickups.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 py-2.5 border-b border-slate-200/80 dark:border-white/5 last:border-0"
                  >
                    <GlassBadge tone="neutral">
                      {new Date(p.pickupTime).toLocaleDateString()}
                    </GlassBadge>
                    <div className="flex-1 min-w-0">
                      <b className="text-slate-900 dark:text-white text-sm block">{p.personName}</b>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{p.relation}</span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(p.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </GlassCard>
          </div>

          <div className="space-y-5">
            <GlassCard padding="lg" className="space-y-3">
              <h2 className="text-lg text-slate-900 dark:text-white">Media consent</h2>
              <div className="flex justify-between items-center py-2 border-b border-slate-200/80 dark:border-white/5">
                <span className="text-sm text-slate-600 dark:text-slate-300">In-app feed photos</span>
                <GlassBadge tone={feedOk ? 'ap' : 'nya'}>{feedOk ? 'Yes' : 'No'}</GlassBadge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600 dark:text-slate-300">Centre social media</span>
                <GlassBadge tone={socialOk ? 'ap' : 'nya'}>{socialOk ? 'Yes' : 'No'}</GlassBadge>
              </div>
            </GlassCard>

            <GlassCard padding="lg">
              <h2 className="text-lg text-slate-900 dark:text-white mb-3">Room</h2>
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 text-xs font-bold"
                  style={{ background: room.bg }}
                >
                  {room.name[0]}
                </span>
                <div>
                  <b className="text-slate-900 dark:text-white text-sm">
                    {room.name} · {room.band}
                  </b>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{child.code}</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {tabs[tab] === 'Progress' && (
        <ChildProgressPanel
          childFirstName={first}
          staff={role === 'owner' || role === 'facilitator'}
          domainStats={progress?.domainStats}
          radarSeries={progress?.radarSeries}
          recentMilestones={progress?.recentMilestones}
          loading={loading}
        />
      )}

      {tabs[tab] === 'Family' && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {guardians.length === 0 ? (
            <GlassCard padding="lg">
              <p className="text-sm text-slate-600 dark:text-slate-300">No guardians linked yet.</p>
            </GlassCard>
          ) : (
            guardians.map((g) => (
              <GlassCard key={g.id} padding="lg" className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                  {g.user.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <b className="text-slate-900 dark:text-white block">{g.user.name}</b>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {g.relation}
                    {g.isPrimary ? ' · primary' : ''}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {g.user.email || '—'}
                  <br />
                  +975 {g.user.phone}
                </div>
                <GlassBadge tone={g.canViewFinance ? 'ap' : 'violet'}>
                  {g.canViewFinance ? 'Can pay & view all' : 'Pickup · limited'}
                  {!g.canPickup ? ' · no pickup' : ''}
                </GlassBadge>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {tabs[tab] === 'Fees' && canSeeFees && (
        <GlassCard padding="lg" className="space-y-3 max-w-xl">
          <h2 className="text-lg text-slate-900 dark:text-white">Fees</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Live invoice wiring continues in finance module. Balance preview uses centre fee plans.
          </p>
          <div className="display text-3xl text-slate-900 dark:text-white">{formatNu(1000)}</div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Sample due · extended time</span>
          {role === 'parent' && (
            <GlassButton onClick={() => setScreen('payments')}>Pay now</GlassButton>
          )}
          {role === 'owner' && (
            <GlassButton variant="soft" onClick={() => setScreen('finance')}>
              Open invoices →
            </GlassButton>
          )}
        </GlassCard>
      )}

      {tabs[tab] === 'Photos' && (
        <GlassCard padding="lg" className="text-center space-y-2 max-w-lg">
          <h2 className="text-lg text-slate-900 dark:text-white">Photos</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Confirmed photo moments for {first} appear in Photos & updates. Voice AI text logs are
            under Daily log.
          </p>
          <GlassButton variant="soft" onClick={() => setScreen('feed')}>
            Open photos & updates →
          </GlassButton>
        </GlassCard>
      )}
    </div>
  )
}
