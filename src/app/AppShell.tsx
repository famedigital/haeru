import { useEffect } from 'react'
import { AppStoreProvider, useAppStore } from '../lib/store/appStore'
import { createIdleWatcher, isSensitiveScreen } from '../lib/security/idleLock'
import { NavigationSidebar } from '../components/shared/NavigationSidebar'
import { HeaderTopBar } from '../components/shared/HeaderTopBar'
import { PersonaSwitcher } from '../components/shared/PersonaSwitcher'
import { ToastContainer } from '../components/shared/ToastContainer'
import { RoleLogin } from '../components/auth/RoleLogin'
import { LandingPage } from '../components/marketing/LandingPage'
import { TodayDashboard } from '../components/owner/TodayDashboard'
import { CentresGallery } from '../components/owner/CentresGallery'
import { CentreBankSettings } from '../components/owner/CentreBankSettings'
import { ChildrenDirectory } from '../components/owner/ChildrenDirectory'
import { AdmissionsWizard } from '../components/owner/AdmissionsWizard'
import { StaffLeave } from '../components/owner/StaffLeave'
import { BillingHub } from '../components/owner/BillingHub'
import { AutoInvoicingClock } from '../components/owner/AutoInvoicingClock'
import { EldsReviewGate } from '../components/owner/EldsReviewGate'
import { DirectorQueue } from '../components/director/DirectorQueue'
import { DailyCareLogger } from '../components/facilitator/DailyCareLogger'
import { PhotoStaging } from '../components/facilitator/PhotoStaging'
import { RecordProgressELDS } from '../components/facilitator/RecordProgressELDS'
import { VoiceHub } from '../components/facilitator/VoiceHub'
import { DailyReflection } from '../components/parent/DailyReflection'
import { ChildMomentsFeed } from '../components/parent/ChildMomentsFeed'
import { PaymentReporter } from '../components/parent/PaymentReporter'
import { ELDSRadarView } from '../components/parent/ELDSRadarView'
import { CaregiverHome } from '../components/caregiver/CaregiverHome'
import { ChildProfile360 } from '../components/shared/ChildProfile360'
import SuperOverview from '../components/superadmin/SuperOverview'
import CentreDirectory from '../components/superadmin/CentreDirectory'
import ProvisionCentreScreen from '../components/superadmin/ProvisionCentreScreen'
import SubscriptionManager from '../components/superadmin/SubscriptionManager'
import MoesdEldsMaster from '../components/superadmin/MoesdEldsMaster'
import TelemetryOps from '../components/superadmin/TelemetryOps'
import GlobalAuditLog from '../components/superadmin/GlobalAuditLog'
import ImpersonationBanner from '../components/superadmin/ImpersonationBanner'
import { GlassCard } from '../components/ui'
import { cn } from '../lib/utils/cn'

function ScreenRouter() {
  const { role, screen } = useAppStore()

  if (role === 'landing') return <LandingPage />
  if (role === 'signin') return <RoleLogin />

  switch (screen) {
    case 'centres':
      return <CentresGallery />
    case 'settings':
      return <CentreBankSettings />
    case 'today':
      return <TodayDashboard />
    case 'children':
      return <ChildrenDirectory />
    case 'child':
      return <ChildProfile360 />
    case 'applications':
      return <AdmissionsWizard />
    case 'people':
      return <StaffLeave />
    case 'finance':
      return <BillingHub />
    case 'autoinv':
      return <AutoInvoicingClock />
    case 'confirm':
      return (
        <div className="space-y-10">
          <DirectorQueue />
          <EldsReviewGate />
        </div>
      )
    case 'ftoday':
      return <DailyCareLogger />
    case 'post':
      return <PhotoStaging />
    case 'record':
      return <RecordProgressELDS />
    case 'voice-hub':
      return <VoiceHub />
    case 'phome':
      return <DailyReflection />
    case 'chome':
      return <CaregiverHome />
    case 'feed':
      return <ChildMomentsFeed />
    case 'pprogress':
      return <ELDSRadarView />
    case 'payments':
      return role === 'caregiver' ? <CaregiverHome /> : <PaymentReporter />
    case 'super_overview':
      return <SuperOverview />
    case 'super_centres':
      return <CentreDirectory />
    case 'super_provision':
      return <ProvisionCentreScreen />
    case 'super_subscriptions':
      return <SubscriptionManager />
    case 'super_elds':
      return <MoesdEldsMaster />
    case 'super_telemetry':
      return <TelemetryOps />
    case 'super_audit':
      return <GlobalAuditLog />
    default:
      return (
        <GlassCard padding="lg">
          <h1 className="text-xl text-slate-900 dark:text-white">Screen coming soon</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            `{screen}` is mapped in the nav for Phase 2 expansion.
          </p>
        </GlassCard>
      )
  }
}

function ShellInner() {
  const { role, screen, setRole, showToast, isImpersonating } = useAppStore()

  useEffect(() => {
    if (role !== 'owner' || !isSensitiveScreen(screen) || isImpersonating) return
    return createIdleWatcher(() => {
      showToast('Session locked after 15 minutes idle · Quick Unlock required')
      setRole('signin')
    })
  }, [role, screen, setRole, showToast, isImpersonating])

  if (role === 'landing' || role === 'signin') {
    return (
      <>
        {role === 'landing' ? <LandingPage /> : <RoleLogin />}
        {import.meta.env.DEV ? <PersonaSwitcher /> : null}
        <ToastContainer />
      </>
    )
  }

  return (
    <div className={cn('wsh-canvas min-h-screen flex', isImpersonating && 'pt-12')}>
      <ImpersonationBanner />
      <NavigationSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <HeaderTopBar />
        <main className="flex-1 px-4 md:px-8 py-6 pb-28 max-w-[1240px] w-full mx-auto">
          <ScreenRouter />
        </main>
      </div>
      {import.meta.env.DEV ? <PersonaSwitcher /> : null}
      <ToastContainer />
    </div>
  )
}

export function AppShell() {
  return (
    <AppStoreProvider>
      <ShellInner />
    </AppStoreProvider>
  )
}
