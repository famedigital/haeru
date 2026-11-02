import { useEffect, useState } from 'react'
import { DailyReflection } from '../parent/DailyReflection'
import { GlassCard } from '../ui'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'

type LiveChild = {
  id: string
  name: string
  allergies?: string | null
  medication?: string | null
  doctorInfo?: string | null
  emergency?: {
    allergies?: string | null
    medication?: string | null
    doctorInfo?: string | null
  }
  pickupLogs?: Array<{
    pickupTime: string
    personName: string
    relation: string
  }>
}

export function CaregiverHome() {
  const { selectedChildId, showToast } = useAppStore()
  const [child, setChild] = useState<LiveChild | null>(null)

  useEffect(() => {
    if (!selectedChildId) return
    let cancelled = false
    void apiFetch<LiveChild>(`/children/${encodeURIComponent(selectedChildId)}`).then((r) => {
      if (cancelled) return
      if (r.ok && r.data) setChild(r.data)
      else {
        setChild(null)
        showToast('Could not load caregiver child profile')
      }
    })
    return () => {
      cancelled = true
    }
  }, [selectedChildId, showToast])

  const name = child?.name || 'your child'
  const allergies = child?.emergency?.allergies || child?.allergies || 'None recorded'
  const medication = child?.emergency?.medication || child?.medication || 'None'
  const doctor = child?.emergency?.doctorInfo || child?.doctorInfo || 'Not recorded'
  const lastPickup = child?.pickupLogs?.[0]

  return (
    <div className="space-y-6">
      <DailyReflection caregiver />

      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard padding="lg" className="space-y-3">
          <h2 className="text-lg text-slate-900 dark:text-white">Pickup authorization</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You may pick up <b className="text-slate-900 dark:text-white">{name}</b> after 3:00 pm.
            Please show your approved caregiver QR at the gate.
          </p>
          <div className="obsidian-pill rounded-xl p-3 text-xs text-violet-700 dark:text-violet-200">
            {lastPickup
              ? `Last pickup: ${new Date(lastPickup.pickupTime).toLocaleString()} · ${lastPickup.personName} (${lastPickup.relation})`
              : 'No pickup logs yet for this child.'}
          </div>
        </GlassCard>

        <GlassCard padding="lg" className="space-y-3 !border-rose-400/30">
          <h2 className="text-lg text-slate-900 dark:text-white">Medical alerts</h2>
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-xs">Allergies</span>
              <div className="text-rose-700 dark:text-rose-300 font-bold">{allergies}</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-xs">Medication</span>
              <div className="text-slate-900 dark:text-white">{medication}</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-xs">Doctor</span>
              <div className="text-slate-900 dark:text-white">{doctor}</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
