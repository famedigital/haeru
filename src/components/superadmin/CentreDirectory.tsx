import { useMemo, useState } from 'react'
import { CENTRES, DZONGKHAGS } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import type { CentreRecord, CentreStatus, SubscriptionTier } from '../../types/enterprise'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

const STATUS_TONE: Record<CentreStatus, 'ap' | 'bl' | 'nya' | 'neutral'> = {
  active: 'ap',
  provisioning: 'bl',
  grace_period: 'nya',
  suspended: 'nya',
}

const TIER_LABEL: Record<SubscriptionTier, string> = {
  community: 'Community',
  standard: 'Standard',
  enterprise: 'Enterprise',
}

export default function CentreDirectory() {
  const { startImpersonation, showToast, setScreen } = useAppStore()
  const [q, setQ] = useState('')
  const [dz, setDz] = useState('all')
  const [status, setStatus] = useState<'all' | CentreStatus>('all')
  const [reasonFor, setReasonFor] = useState<CentreRecord | null>(null)
  const [reason, setReason] = useState('')

  const rows = useMemo(() => {
    return CENTRES.filter((c) => {
      if (dz !== 'all' && c.dzongkhag !== dz) return false
      if (status !== 'all' && c.status !== status) return false
      if (!q.trim()) return true
      const hay = `${c.name} ${c.moesdCode} ${c.directorName}`.toLowerCase()
      return hay.includes(q.trim().toLowerCase())
    })
  }, [q, dz, status])

  return (
    <div className="space-y-6">
      <PageHeader
        title="ECCD Directory"
        subtitle={`${CENTRES.length} centres · multi-tenant Haeru network`}
        actions={
          <GlassButton onClick={() => setScreen('super_provision')}>Provision New</GlassButton>
        }
      />

      <GlassCard padding="lg" className="grid sm:grid-cols-3 gap-3">
        <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          Search
          <input
            className="glass-input"
            placeholder="Name, MoESD code, director"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          Dzongkhag
          <select className="glass-input" value={dz} onChange={(e) => setDz(e.target.value)}>
            <option value="all">All</option>
            {DZONGKHAGS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          Status
          <select
            className="glass-input"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="provisioning">Provisioning</option>
            <option value="grace_period">Grace period</option>
            <option value="suspended">Suspended</option>
          </select>
        </label>
      </GlassCard>

      <GlassCard padding="none" className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
              <th className="px-4 py-3">Centre</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Director</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const pct = Math.round((c.enrolledCount / Math.max(c.maxChildren, 1)) * 100)
              const bar =
                pct >= 100 ? 'bg-rose-500' : pct >= 85 ? 'bg-amber-400' : 'bg-emerald-500'
              return (
                <tr key={c.id} className="border-t border-slate-200/60 dark:border-white/5">
                  <td className="px-4 py-3">
                    <b className="block text-slate-900 dark:text-white">{c.name}</b>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.slug}.haeru.bt · {c.moesdCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {c.gewog}, {c.dzongkhag}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block text-slate-800 dark:text-slate-100">{c.directorName}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.directorPhone}
                    </span>
                  </td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <span className="text-slate-900 dark:text-white font-bold">
                      {c.enrolledCount} / {c.maxChildren}
                    </span>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div className={`h-full ${bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <GlassBadge tone="neutral">{TIER_LABEL[c.tier]}</GlassBadge>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Renew {c.renewalDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <GlassBadge tone={STATUS_TONE[c.status]}>{c.status.replace('_', ' ')}</GlassBadge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                    <GlassButton
                      variant="ghost"
                      className="!text-xs !py-1.5"
                      onClick={() => showToast(`Centre 360 · ${c.name} (mock)`)}
                    >
                      View 360
                    </GlassButton>
                    <GlassButton
                      variant="soft"
                      className="!text-xs !py-1.5"
                      onClick={() => {
                        setReasonFor(c)
                        setReason('')
                      }}
                    >
                      Impersonate Support Mode
                    </GlassButton>
                    <GlassButton
                      variant="ghost"
                      className="!text-xs !py-1.5"
                      onClick={() => showToast(`Edit quotas · ${c.name}`)}
                    >
                      Edit Quotas
                    </GlassButton>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>

      {reasonFor && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <GlassCard padding="lg" className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Impersonate · {reasonFor.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mandatory reason is logged to the global audit trail.
            </p>
            <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
              Reason
              <textarea
                className="glass-input min-h-[88px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Assisting Director with invoice proration"
              />
            </label>
            <div className="flex justify-end gap-2">
              <GlassButton variant="ghost" onClick={() => setReasonFor(null)}>
                Cancel
              </GlassButton>
              <GlassButton
                onClick={() => {
                  startImpersonation(reasonFor.id, reason)
                  setReasonFor(null)
                }}
              >
                Start support session
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
