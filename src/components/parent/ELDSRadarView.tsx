import { CHILDREN, PARENT_CHILD_ID, childFirstName } from '../../data/enterprise'
import { ChildProgressPanel } from '../shared/ChildProgressPanel'
import { PageHeader } from '../shared/PageHeader'
import { useAppStore } from '../../lib/store/appStore'

export function ELDSRadarView() {
  const { selectedChildId, role } = useAppStore()
  const child =
    CHILDREN.find((c) => c.id === selectedChildId) ??
    CHILDREN.find((c) => c.id === PARENT_CHILD_ID)!

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${childFirstName(child.name)}'s progress`}
        subtitle="4-year checklist · Bhutan MoESD ELDS 2019"
      />
      <ChildProgressPanel
        childFirstName={childFirstName(child.name)}
        staff={role === 'owner' || role === 'facilitator'}
      />
    </div>
  )
}
