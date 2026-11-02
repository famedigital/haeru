import { useAppStore } from '../../lib/store/appStore'
import { CENTRES } from '../../data/enterprise'

export default function ImpersonationBanner() {
  const { isImpersonating, currentCentreId, impersonationReason, exitImpersonation } = useAppStore()
  if (!isImpersonating) return null

  const centre = CENTRES.find((c) => c.id === currentCentreId)

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500/95 text-slate-950 font-bold px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-lg text-xs tracking-wide">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping shrink-0" />
        <span className="truncate">
          SUPPORT SESSION: Viewing as{' '}
          <strong>{centre?.name ?? 'Centre'}</strong>
          {impersonationReason ? ` — Reason: ${impersonationReason}` : ''} · All write actions are
          recorded.
        </span>
      </div>
      <button
        type="button"
        onClick={() => exitImpersonation()}
        className="px-3 py-1.5 bg-slate-950 text-white rounded-lg hover:bg-slate-800 text-xs font-semibold shrink-0"
      >
        Exit Support Session
      </button>
    </div>
  )
}
