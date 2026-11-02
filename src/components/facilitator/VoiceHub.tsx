import { useEffect, useState } from 'react'
import { Mic, Radio, Sparkles } from 'lucide-react'
import {
  postConfirmMoment,
  postObservationFromHermes,
} from '../../lib/api/pulseApiServer'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard, GlassChips } from '../ui'
import { PageHeader } from '../shared/PageHeader'

const SCENARIOS = [
  {
    id: 'kinley-share',
    label: 'Kinley · sharing',
    transcription:
      'During morning blocks, Kinley Wangchuk hesitated to share. Soft Dzongkha calming and a hand gesture helped him offer two blocks to a classmate.',
    childName: 'Kinley Wangchuk',
    childId: 'c1',
    domain: 'Social & emotional',
    trigger: 'Resource sharing boundary',
    strategy: 'Calm Dzongkha prompt + hand gesture',
    milestone: 'Shares play materials after soft prompt',
    confidence: '96% · MoESD ELDS 3.2',
    parentSafeTitle: "Kinley's sharing moment",
    parentSafeDesc:
      'Kinley offered blocks to a classmate after a calm prompt — great Social & Emotional progress.',
  },
  {
    id: 'kinley-language',
    label: 'Kinley · language',
    transcription:
      'At circle time Kinley Wangchuk named three colours in English after a Dzongkha bridge prompt from Kuenga.',
    childName: 'Kinley Wangchuk',
    childId: 'c1',
    domain: 'Language & communication',
    trigger: 'None (Positive Reinforcement)',
    strategy: 'Dzongkha–English bridge prompt',
    milestone: 'Uses new vocabulary in group circle',
    confidence: '91% · MoESD ELDS 2.1',
    parentSafeTitle: 'New words at circle',
    parentSafeDesc:
      'Kinley named colours in English after a gentle bridge prompt — lovely Language progress.',
  },
  {
    id: 'pema-share',
    label: 'Pema · sharing',
    transcription:
      'Pema Dorji was reluctant to share wooden blocks. Soft Dzongkha calming helped him offer two blocks to a friend.',
    childName: 'Pema Dorji',
    childId: 'c3',
    domain: 'Social & emotional',
    trigger: 'Resource sharing boundary',
    strategy: 'Calm Dzongkha prompt + hand gesture',
    milestone: 'Shares play materials after soft prompt',
    confidence: '94% · MoESD ELDS 3.2',
    parentSafeTitle: "Pema's sharing moment",
    parentSafeDesc:
      'Pema offered blocks to a classmate after a calm prompt — great Social & Emotional progress.',
  },
] as const

type WebhookInfo = {
  ok?: boolean
  result?: { url?: string; pending_update_count?: number; last_error_message?: string }
}

export function VoiceHub() {
  const { showToast, role, setRole, setScreen } = useAppStore()
  const [recording, setRecording] = useState(false)
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [webhook, setWebhook] = useState<WebhookInfo | null>(null)
  const [livePending, setLivePending] = useState(0)
  const scenario = SCENARIOS[scenarioIdx] ?? SCENARIOS[0]

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

      <GlassCard padding="lg" className="space-y-4 relative overflow-hidden">
        <GlassBadge tone="violet">@HaeruEccdBot · pairing required</GlassBadge>
        <h2 className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-teal-500" /> Voice note assessor
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
          Facilitators send short Telegram voice notes. Haeru Voice AI maps care + ELDS milestones —
          then queues the Director review gate before parents see anything.
        </p>
        <GlassChips
          items={SCENARIOS.map((s) => s.label)}
          value={scenarioIdx}
          onChange={setScenarioIdx}
        />
        <GlassButton
          variant={recording ? 'ghost' : 'primary'}
          onClick={() => {
            setRecording((r) => !r)
            if (recording) showToast('Simulated note ready · queue for Director')
          }}
        >
          {recording ? 'Stop & parse' : 'Simulate Telegram voice note'}
        </GlassButton>
      </GlassCard>

      <GlassCard padding="lg" className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" /> Extraction preview
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 italic">
          &ldquo;{scenario.transcription}&rdquo;
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['Child', scenario.childName],
            ['Domain', scenario.domain],
            ['Trigger', scenario.trigger],
            ['Milestone', scenario.milestone],
          ].map(([l, v]) => (
            <div key={l} className="obsidian-pill rounded-xl p-3">
              <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">{l}</div>
              <div className="text-sm text-slate-800 dark:text-slate-100 font-bold mt-1">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">{scenario.confidence}</span>
          <GlassButton
            onClick={() => {
              const ingest = postObservationFromHermes({
                childId: scenario.childId,
                childName: scenario.childName,
                domain: scenario.domain,
                trigger: scenario.trigger,
                strategy: scenario.strategy,
                milestone: scenario.milestone,
                confidence: scenario.confidence,
                source: 'voice',
                transcription: scenario.transcription,
                parentSafeTitle: scenario.parentSafeTitle,
                parentSafeDesc: scenario.parentSafeDesc,
              })
              if (!ingest.ok) {
                showToast('Observation failed schema validation')
                return
              }
              const queued = postConfirmMoment(ingest.data.moment.id, {
                role: 'facilitator',
              })
              if (!queued.ok) {
                showToast('Could not queue for Director review')
                return
              }
              showToast('Queued for Director ELDS review · parents not notified yet')
              if (role !== 'owner') {
                setRole('owner')
              }
              setScreen('confirm')
            }}
          >
            Confirm log to review gate
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}
