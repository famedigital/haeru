import { useState, useSyncExternalStore } from 'react'
import { CHILDREN, ROOMS, formatNu, childFirstName } from '../../data/enterprise'
import {
  listParentMediaMomentsForChild,
  subscribePulseStore,
} from '../../lib/api/pulseApiServer'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard, GlassTabs } from '../ui'
import { ChildDailyLog, useChildLiveMoments } from './ChildDailyLog'
import { ChildProgressPanel } from './ChildProgressPanel'


const FAMILY = [
  {
    name: 'Deki Choden',
    role: 'Mother · primary',
    phone: '17 12 34 56',
    job: 'Staff Nurse, JDWNR Hospital',
    access: 'Can pay & view all',
    tone: 'ap' as const,
  },
  {
    name: 'Ugyen Wangchuk',
    role: 'Father',
    phone: '17 65 43 21',
    job: 'Programme Officer, MoESD',
    access: 'Can pay & view all',
    tone: 'ap' as const,
  },
  {
    name: 'Dawa Zam',
    role: 'Grandmother · caregiver',
    phone: '77 11 22 33',
    job: 'Approved by Deki · 2 Oct',
    access: 'Pickup · medical only',
    tone: 'violet' as const,
  },
]

const FEE_ROWS: Array<[string, string, number, 'paid' | 'due' | 'sched']> = [
  ['Tuition · installment 1 of 3', '20 Feb', 19400, 'paid'],
  ['Uniform · Winter wear (annual)', '20 Feb', 1500, 'paid'],
  ['Tuition · installment 2 of 3', '30 Jun', 19400, 'paid'],
  ['Tuition · installment 3 of 3', '1 Sep', 19400, 'paid'],
  ['Extended time · October', '15 Oct', 1000, 'due'],
  ['Extended time · November', '15 Nov', 1000, 'sched'],
]

const PICKUPS = [
  ['Today', '3:15 pm', 'Deki Choden', 'Mother'],
  ['Wed', '3:40 pm', 'Dawa Zam', 'Grandmother · approved caregiver'],
  ['Tue', '3:10 pm', 'Ugyen Wangchuk', 'Father'],
]


function ChildPhotosGrid({ childId, firstName }: { childId: string; firstName: string }) {
  const moments = useSyncExternalStore(
    subscribePulseStore,
    () => listParentMediaMomentsForChild(childId),
    () => listParentMediaMomentsForChild(childId),
  )
  if (moments.length === 0) {
    return (
      <GlassCard padding="lg" className="text-center space-y-2 max-w-lg">
        <h2 className="text-lg text-slate-900 dark:text-white">No photos yet</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          When school shares photos of {firstName} and the Director confirms them, they show up here.
        </p>
      </GlassCard>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {moments.map((m) => (
        <a
          key={m.id}
          href={m.mediaUrls![0]}
          target="_blank"
          rel="noreferrer"
          className="aspect-square rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 bg-slate-900 block hover:-translate-y-0.5 transition-transform"
          aria-label={m.title}
        >
          <img src={m.mediaUrls![0]} alt={m.title} className="w-full h-full object-cover" loading="lazy" />
        </a>
      ))}
    </div>
  )
}

export function ChildProfile360() {
  const { role, selectedChildId, setScreen, showToast } = useAppStore()
  const [tab, setTab] = useState(0)

  // Login may select a live DB child id; fall back to Kinley pilot mock for profile chrome
  const child =
    CHILDREN.find((c) => c.id === selectedChildId) ??
    CHILDREN.find((c) => c.id === 'c1') ??
    CHILDREN[0]!
  const liveChildId = selectedChildId || child.id
  const { moments: liveMoments } = useChildLiveMoments(liveChildId)
  const liveName = liveMoments[0]?.childName || child.name
  const room = ROOMS[child.room]
  const first = childFirstName(liveName)
  const canSeeFees = role === 'owner' || role === 'parent'
  const tabs = canSeeFees
    ? ['Overview', 'Daily log', 'Progress', 'Family', 'Fees', 'Photos']
    : ['Overview', 'Daily log', 'Progress', 'Family', 'Photos']
  const liveDomains = liveMoments.map((m) => m.domain)

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

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => setScreen(backScreen)}
        className="text-sm text-emerald-700 dark:text-emerald-300 font-bold hover:text-emerald-700 dark:text-emerald-200"
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
          <h1 className="text-2xl md:text-3xl text-slate-900 dark:text-white">{liveName}</h1>
          <div className="flex flex-wrap gap-2">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-slate-900"
              style={{ background: room.bg }}
            >
              {room.name}
            </span>
            <GlassBadge tone="neutral">{child.age.replace('y', ' yrs').replace('m', ' mths')}</GlassBadge>
            <GlassBadge tone="neutral">{child.code}</GlassBadge>
            <GlassBadge tone="ap">Here today · in 8:05 am</GlassBadge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {role === 'owner' && (
            <GlassButton variant="ghost" onClick={() => showToast('Opens original application PDF')}>
              Original application
            </GlassButton>
          )}
          {(role === 'owner' || role === 'facilitator') && (
            <GlassButton
              onClick={() =>
                setScreen(role === 'facilitator' ? 'ftoday' : 'children')
              }
            >
              Daily update
            </GlassButton>
          )}
        </div>
      </GlassCard>

      <GlassTabs items={tabs} value={tab} onChange={setTab} />

      {tabs[tab] === 'Daily log' && (
        <ChildDailyLog childId={liveChildId} firstName={first} />
      )}

      {tabs[tab] === 'Overview' && (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
          <div className="space-y-5">
            <ChildDailyLog childId={liveChildId} firstName={first} />
            <GlassCard padding="lg">
              <h2 className="text-lg text-slate-900 dark:text-white mb-4">Care & medical</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['Allergies', 'Mild dust allergy'],
                  ['Medication', 'None'],
                  ['Nap', 'One nap, 45 min after lunch'],
                  ['Toileting', 'Fully independent'],
                  ['Mother tongue', 'Dzongkha · learning English'],
                  ['Doctor', 'JDWNR Hospital, Dr. Tandin'],
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
                <span className="text-xs text-slate-500 dark:text-slate-400">Last 5 days</span>
              </div>
              {PICKUPS.map(([d, t, n, r]) => (
                <div
                  key={d + t}
                  className="flex items-center gap-3 py-2.5 border-b border-slate-200/80 dark:border-white/5 last:border-0"
                >
                  <GlassBadge tone="neutral">{d}</GlassBadge>
                  <div className="flex-1 min-w-0">
                    <b className="text-slate-900 dark:text-white text-sm block">{n}</b>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{r}</span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t}</span>
                </div>
              ))}
            </GlassCard>
          </div>

          <div className="space-y-5">
            <GlassCard padding="lg" className="space-y-3">
              <h2 className="text-lg text-slate-900 dark:text-white">Media consent</h2>
              <div className="flex justify-between items-center py-2 border-b border-slate-200/80 dark:border-white/5">
                <span className="text-sm text-slate-600 dark:text-slate-300">In-app feed photos</span>
                <GlassBadge tone={child.feedConsent ? 'ap' : 'nya'}>
                  {child.feedConsent ? 'Yes' : 'No'}
                </GlassBadge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600 dark:text-slate-300">Centre social media</span>
                <GlassBadge tone={child.socialConsent ? 'ap' : 'nya'}>
                  {child.socialConsent ? 'Yes' : 'No'}
                </GlassBadge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Standard Media Policy, accepted 20 Feb 2026. Guardians can withdraw anytime.
              </p>
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
                  <div className="text-xs text-slate-500 dark:text-slate-400">Kuenga Rinzin, Pema Lhaden</div>
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
          liveDomainHits={liveDomains}
        />
      )}

      {tabs[tab] === 'Family' && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {FAMILY.map((f) => (
            <GlassCard key={f.name} padding="lg" className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                {f.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <b className="text-slate-900 dark:text-white block">{f.name}</b>
                <span className="text-xs text-slate-500 dark:text-slate-400">{f.role}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {f.job}
                <br />
                +975 {f.phone}
              </div>
              <GlassBadge tone={f.tone}>{f.access}</GlassBadge>
            </GlassCard>
          ))}
        </div>
      )}

      {tabs[tab] === 'Fees' && canSeeFees && (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
          <GlassCard padding="none">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10">
              <div>
                <h2 className="text-lg text-slate-900 dark:text-white">Fee plan 2026</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  3 installments (3% off tuition) · Extended time · finalised 20 Feb
                </p>
              </div>
              <GlassBadge tone="ap">Locked for 2026</GlassBadge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
                    <th className="px-5 py-3">What</th>
                    <th className="px-5 py-3">Due</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {FEE_ROWS.map(([what, due, amt, st]) => (
                    <tr key={what} className="border-t border-slate-200/80 dark:border-white/5">
                      <td className="px-5 py-3 text-slate-900 dark:text-white font-bold">{what}</td>
                      <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{due}</td>
                      <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">{formatNu(amt)}</td>
                      <td className="px-5 py-3">
                        <GlassBadge
                          tone={st === 'due' ? 'bl' : st === 'sched' ? 'neutral' : 'ap'}
                        >
                          {st === 'due' ? 'Due 15 Oct' : st === 'sched' ? 'Scheduled' : 'Paid'}
                        </GlassBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <GlassCard padding="lg" className="space-y-3 h-fit">
            <h2 className="text-lg text-slate-900 dark:text-white">Balance</h2>
            <div className="display text-3xl text-slate-900 dark:text-white">{formatNu(1000)}</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Due 15 Oct · October extended time</span>
            <div className="obsidian-pill rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300">
              The next invoice is created automatically on 1 Nov.
            </div>
            {role === 'owner' && (
              <GlassButton variant="soft" onClick={() => setScreen('finance')}>
                Open invoices →
              </GlassButton>
            )}
            {role === 'parent' && (
              <GlassButton onClick={() => setScreen('payments')}>Pay now</GlassButton>
            )}
          </GlassCard>
        </div>
      )}

      {tabs[tab] === 'Photos' && (
        <ChildPhotosGrid childId={liveChildId} firstName={first} />
      )}
    </div>
  )
}
