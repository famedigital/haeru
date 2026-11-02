import { useState } from 'react'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

export default function TelemetryOps() {
  const { showToast } = useAppStore()
  const [banner, setBanner] = useState('')
  const [bannerType, setBannerType] = useState<'info' | 'warning' | 'critical'>('info')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hermes AI & Pipelines"
        subtitle="Voice queue · Telegram webhooks · storage · broadcast"
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          ['Queue latency', '2.8s', 'Whisper avg'],
          ['Schema success', '99.4%', 'Hermes JSON extract'],
          ['Webhook ping', '42ms', 'Healthy'],
          ['Object storage', '61%', 'R2 / S3 utilization'],
        ].map(([l, v, s]) => (
          <GlassCard key={l} className="hover:-translate-y-0.5 transition-transform">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {l}
              </span>
              <span className="display text-3xl font-bold text-slate-900 dark:text-white">{v}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{s}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard padding="lg" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Telegram bot gateways</h2>
          <GlassBadge tone="ap">Healthy</GlassBadge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Active webhooks responding · last audio note received 3 minutes ago · EXIF scrub pipeline
          green.
        </p>
      </GlassCard>

      <GlassCard padding="lg" className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          System broadcast banner
        </h2>
        <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          Message
          <textarea
            className="glass-input min-h-[96px]"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            placeholder="Scheduled server maintenance on Sunday from 2:00 AM to 4:00 AM BST…"
          />
        </label>
        <div className="flex flex-wrap gap-2 items-center">
          {(['info', 'warning', 'critical'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setBannerType(t)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border capitalize ${
                bannerType === t
                  ? 'border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
          <GlassButton
            className="ml-auto"
            onClick={() => {
              if (!banner.trim()) {
                showToast('Enter a broadcast message')
                return
              }
              showToast(`Broadcast queued · ${bannerType}`)
              setBanner('')
            }}
          >
            Send to all centres
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}
