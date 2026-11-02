import { useEffect, useState } from 'react'
import { childFirstName } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import { ChildProgressPanel } from '../shared/ChildProgressPanel'
import { PageHeader } from '../shared/PageHeader'
import { useAppStore } from '../../lib/store/appStore'

type LiveChild = {
  id: string
  name: string
  age?: string
}

export function ELDSRadarView() {
  const { selectedChildId, role, showToast } = useAppStore()
  const [name, setName] = useState('Child')

  useEffect(() => {
    if (!selectedChildId) return
    let cancelled = false
    void apiFetch<LiveChild>(`/children/${encodeURIComponent(selectedChildId)}`).then((r) => {
      if (cancelled) return
      if (r.ok && r.data?.name) setName(r.data.name)
      else showToast('Could not load child for progress view')
    })
    return () => {
      cancelled = true
    }
  }, [selectedChildId, showToast])

  const first = childFirstName(name)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${first}'s progress`}
        subtitle="Live checklist · Bhutan MoESD ELDS 2019"
      />
      <ChildProgressPanel
        childFirstName={first}
        staff={role === 'owner' || role === 'facilitator'}
      />
    </div>
  )
}
