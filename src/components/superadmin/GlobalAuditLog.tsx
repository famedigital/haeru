import { useMemo, useState } from 'react'
import { PLATFORM_AUDIT } from '../../data/enterprise'
import { GlassBadge, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

export default function GlobalAuditLog() {
  const [action, setAction] = useState('all')
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    return PLATFORM_AUDIT.filter((r) => {
      if (action !== 'all' && r.action !== action) return false
      if (!q.trim()) return true
      const hay = `${r.actorEmail} ${r.target} ${r.reasonNotes}`.toLowerCase()
      return hay.includes(q.trim().toLowerCase())
    })
  }, [action, q])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Audit Log"
        subtitle="Impersonation · provisioning · plan changes · suspensions"
      />

      <GlassCard padding="lg" className="grid sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          Search
          <input
            className="glass-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Actor, target, reason"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          Action
          <select className="glass-input" value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="all">All</option>
            <option value="IMPERSONATION_STARTED">Impersonation</option>
            <option value="CENTRE_PROVISIONED">Provisioning</option>
            <option value="PLAN_UPGRADED">Plan upgrades</option>
          </select>
        </label>
      </GlassCard>

      <GlassCard padding="none" className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
              <th className="px-5 py-3">Time (UTC)</th>
              <th className="px-5 py-3">Actor</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Target</th>
              <th className="px-5 py-3">IP</th>
              <th className="px-5 py-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-200/60 dark:border-white/5">
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {new Date(r.timestamp).toISOString().replace('T', ' ').slice(0, 19)}
                </td>
                <td className="px-5 py-3 text-slate-900 dark:text-white font-bold">{r.actorEmail}</td>
                <td className="px-5 py-3">
                  <GlassBadge tone="neutral">{r.action}</GlassBadge>
                </td>
                <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{r.target}</td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{r.ipAddress}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300 max-w-xs">
                  {r.reasonNotes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
