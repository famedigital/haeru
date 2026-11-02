import { useState } from 'react'
import { GlassButton } from '../ui'
import { PageHeader } from '../shared/PageHeader'
import ProvisionCentreModal from './ProvisionCentreModal'

/** Dedicated provision route — opens the 4-step wizard. */
export default function ProvisionCentreScreen() {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Provision New ECCD"
        subtitle="Onboard a centre across Bhutan’s Dzongkhags"
        actions={
          <GlassButton onClick={() => setOpen(true)}>Open provisioning wizard</GlassButton>
        }
      />
      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
        Creates a tenant shell with Director credentials, plan quotas, and default MoESD rooms.
        Child data stays empty until the centre enrolls families.
      </p>
      <ProvisionCentreModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
