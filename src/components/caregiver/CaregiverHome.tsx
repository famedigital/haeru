import { DailyReflection } from '../parent/DailyReflection'
import { GlassCard } from '../ui'
import { CHILDREN, PARENT_CHILD_ID } from '../../data/enterprise'

export function CaregiverHome() {
  const child = CHILDREN.find((c) => c.id === PARENT_CHILD_ID)!

  return (
    <div className="space-y-6">
      <DailyReflection caregiver />

      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard padding="lg" className="space-y-3">
          <h2 className="text-lg text-slate-900 dark:text-white">Pickup authorization</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You may pick up <b className="text-slate-900 dark:text-white">{child.name}</b> after 3:00 pm. Please show
            your approved caregiver QR at the gate.
          </p>
          <div className="obsidian-pill rounded-xl p-3 text-xs text-violet-700 dark:text-violet-200">
            Last pickup: Wed · 3:40 pm · Dawa Zam (Grandmother)
          </div>
        </GlassCard>

        <GlassCard padding="lg" className="space-y-3 !border-rose-400/30">
          <h2 className="text-lg text-slate-900 dark:text-white">Medical alerts</h2>
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-xs">Allergies</span>
              <div className="text-rose-700 dark:text-rose-300 font-bold">Mild dust allergy</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-xs">Medication</span>
              <div className="text-slate-900 dark:text-white">None</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-xs">Doctor</span>
              <div className="text-slate-900 dark:text-white">JDWNR Hospital, Dr. Tandin</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
