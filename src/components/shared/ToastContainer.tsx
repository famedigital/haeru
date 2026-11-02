import { useAppStore } from '../../lib/store/appStore'

export function ToastContainer() {
  const { toast } = useAppStore()
  if (!toast) return null
  return (
    <div
      role="status"
      className="fixed left-1/2 bottom-24 -translate-x-1/2 z-[60] max-w-md w-[90%] rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-semibold shadow-xl border border-emerald-500/30"
    >
      {toast}
    </div>
  )
}
