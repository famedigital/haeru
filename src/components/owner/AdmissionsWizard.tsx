import { useState } from 'react'
import { ADMISSION_STEPS } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

const COLUMNS = [
  {
    title: 'Submitted',
    tone: 'neutral' as const,
    items: [
      ['Karma Dorji', 'Nursery', '2 days ago'],
      ['Thinley Norbu', 'Toddlers', '4 days ago'],
    ],
  },
  {
    title: 'Under review',
    tone: 'bl' as const,
    items: [['Namgay Wangmo', 'Toddlers', 'Interview 11 Oct']],
  },
  {
    title: 'Approved',
    tone: 'ap' as const,
    items: [
      ['Sangay Tenzin', 'Kindergarten', 'Starts Feb 2027'],
      ['Chimi Om', 'Nursery', 'Fees issued'],
    ],
  },
  {
    title: 'Not this time',
    tone: 'nya' as const,
    items: [['Jamyang Dorji', 'Under 2 yrs', 'Invited to reapply']],
  },
]

export function AdmissionsWizard() {
  const { showToast } = useAppStore()
  const [step, setStep] = useState(1)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        subtitle="Admissions for 2026–27 · Toddlers has 2 places left"
        actions={
          <GlassButton onClick={() => showToast('Opens the 9-step admission wizard')}>
            New application
          </GlassButton>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.title} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <GlassBadge tone={col.tone}>{col.title}</GlassBadge>
              <span className="text-xs text-slate-500 dark:text-slate-400">{col.items.length}</span>
            </div>
            {col.items.map(([name, room, meta]) => (
              <GlassCard key={name} padding="sm" className="space-y-2">
                <b className="text-slate-900 dark:text-white text-sm">{name}</b>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {room} · {meta}
                </div>
              </GlassCard>
            ))}
          </div>
        ))}
      </div>

      <GlassCard padding="none" className="overflow-hidden">
        <div className="grid md:grid-template-columns md:grid-cols-[240px_1fr]">
          <div className="p-5 bg-slate-100/80 dark:bg-slate-950/50 border-r border-slate-200 dark:border-white/10 space-y-2">
            <b className="display text-slate-900 dark:text-white text-base">New application</b>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">9-step admission wizard</p>
            {ADMISSION_STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className="flex items-center gap-2.5 w-full text-left py-1.5"
              >
                <span
                  className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center border ${
                    i < step
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : i === step
                        ? 'bg-emerald-50 dark:bg-white text-slate-900 border-emerald-600 dark:border-white'
                        : 'border-slate-300 dark:border-white/20 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span className={i === step ? 'text-slate-900 dark:text-white text-sm' : 'text-slate-500 dark:text-slate-400 text-sm'}>
                  {label}
                </span>
              </button>
            ))}
          </div>
          <div className="p-6 space-y-5">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Step {step + 1} of 9</span>
              <h2 className="text-xl text-slate-900 dark:text-white mt-1">{ADMISSION_STEPS[step]}&apos;s details</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ['Full name', 'Tshering Pelden'],
                ['CID number', '1150•••••••'],
                ['Mobile', '+975 17 •• •• ••'],
                ['Email', 'tshering@example.bt'],
                ['Occupation', 'Teacher'],
                ['Workplace', 'Babesa Higher Secondary School'],
              ].map(([l, v]) => (
                <label key={l} className="stack gap-1.5 flex flex-col text-xs text-slate-500 dark:text-slate-400">
                  {l}
                  <input className="glass-input" defaultValue={v} />
                </label>
              ))}
            </div>
            <div className="obsidian-pill rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300">
              <b className="text-emerald-700 dark:text-emerald-300">Standard Media Policy.</b> Photos may be shared
              privately with families in the app. Guardians can withdraw anytime after enrolment.
            </div>
            <div className="flex justify-between">
              <GlassButton
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </GlassButton>
              <GlassButton
                onClick={() => {
                  if (step < 8) {
                    setStep((s) => s + 1)
                    return
                  }
                  void (async () => {
                    const { apiFetch } = await import('../../lib/api/httpClient')
                    const r = await apiFetch('/admissions/complete', {
                      method: 'POST',
                      body: JSON.stringify({
                        childName: 'Tshering Pelden Jr',
                        room: 'nursery',
                        dob: '2022-06-01',
                        gender: 'F',
                        photoConsentFeed: true,
                        guardianName: 'Tshering Pelden',
                        guardianPhone: `17${String(Date.now()).slice(-6)}`,
                        guardianEmail: `parent.${Date.now()}@example.bt`,
                        relation: 'Mother',
                        parentPassword: 'parent123',
                      }),
                    })
                    showToast(
                      r.ok
                        ? 'Child + parent saved to Prisma · password parent123'
                        : 'Admission failed — check phone uniqueness',
                    )
                  })()
                }}
              >
                {step < 8 ? 'Continue' : 'Submit application'}
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
