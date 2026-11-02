import { useState } from 'react'
import { DZONGKHAGS } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import type { SubscriptionTier } from '../../types/enterprise'
import { GlassButton, GlassCard } from '../ui'

const STEPS = ['Identity', 'Director', 'Plan & quotas', 'Rooms'] as const

export interface ProvisionCentreModalProps {
  open: boolean
  onClose: () => void
}

export default function ProvisionCentreModal({ open, onClose }: ProvisionCentreModalProps) {
  const { showToast } = useAppStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [moesd, setMoesd] = useState('')
  const [slug, setSlug] = useState('')
  const [dzongkhag, setDzongkhag] = useState<string>('Thimphu')
  const [gewog, setGewog] = useState('')
  const [phone, setPhone] = useState('')
  const [director, setDirector] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [tier, setTier] = useState<SubscriptionTier>('standard')
  const [maxChildren, setMaxChildren] = useState(50)
  const [maxStaff, setMaxStaff] = useState(10)
  const [voiceMins, setVoiceMins] = useState(300)

  if (!open) return null

  const next = () => setStep((s) => Math.min(3, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const confirm = () => {
    showToast(`Provisioned · ${name || 'New ECCD'} · ${slug || 'slug'}.haeru.bt`)
    onClose()
    setStep(0)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <GlassCard padding="lg" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Provision New ECCD</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Step {step + 1} of 4 · {STEPS[step]}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                i === step
                  ? 'border-emerald-500/50 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10'
                  : i < step
                    ? 'border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200'
                    : 'border-slate-200 dark:border-white/10 text-slate-400'
              }`}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>

        {step === 0 && (
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Centre name" value={name} onChange={setName} />
            <Field label="MoESD registration code" value={moesd} onChange={setMoesd} />
            <Field label="Subdomain" value={slug} onChange={setSlug} hint=".haeru.bt" />
            <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
              Dzongkhag
              <select
                className="glass-input"
                value={dzongkhag}
                onChange={(e) => setDzongkhag(e.target.value)}
              >
                {DZONGKHAGS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Gewog / town" value={gewog} onChange={setGewog} />
            <Field label="Centre phone" value={phone} onChange={setPhone} />
          </div>
        )}

        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Director full name" value={director} onChange={setDirector} />
            <Field label="Director email" value={email} onChange={setEmail} />
            <Field label="Mobile (+975)" value={mobile} onChange={setMobile} />
            <p className="sm:col-span-2 text-xs text-slate-500 dark:text-slate-400">
              Temporary password will be issued; director can rotate on first login.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              {(
                [
                  ['community', 'Community', 'Nu. 0'],
                  ['standard', 'Standard', 'Nu. 4,500'],
                  ['enterprise', 'Enterprise', 'Nu. 8,500'],
                ] as const
              ).map(([id, label, price]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTier(id)}
                  className={`rounded-xl border p-3 text-left transition-transform hover:-translate-y-0.5 ${
                    tier === id
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-slate-200 dark:border-white/10'
                  }`}
                >
                  <b className="block text-sm text-slate-900 dark:text-white">{label}</b>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{price}/mo</span>
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <NumField label="Max children" value={maxChildren} onChange={setMaxChildren} />
              <NumField label="Max staff" value={maxStaff} onChange={setMaxStaff} />
              <NumField label="Voice mins / mo" value={voiceMins} onChange={setVoiceMins} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <p className="font-bold text-slate-900 dark:text-white">Default MoESD rooms</p>
            <ul className="space-y-2">
              <li>Toddlers · 2–3 yrs · Cap 14</li>
              <li>Nursery · 3–4 yrs · Cap 18</li>
              <li>Kindergarten · 4–5 yrs · Cap 20</li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bank of Bhutan (mBoB) / BNB (mPay) receive fields left blank for Director setup.
            </p>
            <div className="rounded-xl border border-slate-200 dark:border-white/10 p-3 text-xs space-y-1">
              <div>
                <b className="text-slate-900 dark:text-white">{name || '—'}</b> · {slug || '—'}.haeru.bt
              </div>
              <div>
                {dzongkhag} · {gewog || '—'} · {moesd || '—'}
              </div>
              <div>
                Director {director || '—'} · {tier} · {maxChildren} children
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <GlassButton variant="ghost" disabled={step === 0} onClick={back}>
            Back
          </GlassButton>
          {step < 3 ? (
            <GlassButton onClick={next}>Continue</GlassButton>
          ) : (
            <GlassButton onClick={confirm}>Confirm &amp; Provision Centre</GlassButton>
          )}
        </div>
      </GlassCard>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
      {label}
      {hint ? <span className="text-[10px]">{hint}</span> : null}
      <input className="glass-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
      {label}
      <input
        type="number"
        className="glass-input"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  )
}
