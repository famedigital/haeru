import { useEffect, useState } from 'react'
import { Mic, Radio } from 'lucide-react'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

type WebhookInfo = {
  ok?: boolean
  result?: { url?: string; pending_update_count?: number; last_error_message?: string }
}

export function VoiceHub() {
  const { showToast, setScreen } = useAppStore()
  const [webhook, setWebhook] = useState<WebhookInfo | null>(null)
  const [livePending, setLivePending] = useState(0)

  useEffect(() => {
    void apiFetch<WebhookInfo>('/telegram/webhook-status').then((r) => {
      if (r.ok && r.data) setWebhook(r.data)
    })
    void apiFetch<{ live?: unknown[] }>('/moments/pending-director', {
      headers: { 'X-Centre-Code': 'WSH' },
    }).then((r) => {
      if (r.ok && r.data?.live) setLivePending(r.data.live.length)
    })
  }, [])

  const hookUrl = webhook?.result?.url
  const hookErr = webhook?.result?.last_error_message

  return (
    <div className="space-y-6">
      <PageHeader
        title="Haeru Voice AI"
        subtitle="Telegram voice notes → MoESD ELDS · Director confirms before parents see anything"
      />

      <GlassCard padding="md" className="space-y-2 border-l-2 border-teal-400/50">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Radio className="w-4 h-4 text-teal-600 dark:text-teal-300" /> Live bot status
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Webhook:{' '}
          {hookUrl ? (
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">registered</span>
          ) : (
            <span className="text-amber-700 dark:text-amber-300 font-semibold">
              not configured (set TELEGRAM_BOT_TOKEN + PUBLIC_URL)
            </span>
          )}
        </p>
        {hookUrl ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 break-all">{hookUrl}</p>
        ) : null}
        {hookErr ? (
          <p className="text-[11px] text-rose-700 dark:text-rose-300">Last Telegram error: {hookErr}</p>
        ) : null}
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Pending Director moments (live):{' '}
          <span className="font-bold text-slate-900 dark:text-white">{livePending}</span>
        </p>
      </GlassCard>

      <GlassCard padding="lg" className="space-y-4">
        <GlassBadge tone="violet">@HaeruEccdBot · live Telegram</GlassBadge>
        <h2 className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-teal-500" /> How to capture
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 max-w-xl">
          <li>Open Telegram and message @HaeruEccdBot (pair once if asked).</li>
          <li>Hold the mic and send a short voice note naming the child.</li>
          <li>Haeru Voice AI extracts care + MoESD ELDS and queues Director review.</li>
          <li>Parents only see the moment after the Director confirms.</li>
        </ol>
        <div className="flex flex-wrap gap-3">
          <GlassButton
            onClick={() => {
              window.open('https://t.me/HaeruEccdBot', '_blank', 'noopener,noreferrer')
              showToast('Opened @HaeruEccdBot')
            }}
          >
            Open @HaeruEccdBot
          </GlassButton>
          <GlassButton variant="ghost" onClick={() => setScreen('confirm')}>
            Director review queue
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}
