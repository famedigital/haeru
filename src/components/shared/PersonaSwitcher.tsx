import type { Role } from '../../types/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import { cn } from '../../lib/utils/cn'

const OPTIONS: { id: Role; label: string }[] = [
  { id: 'landing', label: 'Landing' },
  { id: 'superadmin', label: 'Superadmin' },
  { id: 'owner', label: 'Owner' },
  { id: 'facilitator', label: 'Facilitator' },
  { id: 'parent', label: 'Parent' },
  { id: 'caregiver', label: 'Caregiver' },
  { id: 'signin', label: 'Sign-in' },
]

export function PersonaSwitcher() {
  const { role, setRole } = useAppStore()
  return (
    <div
      className="fixed left-1/2 bottom-5 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 rounded-full bg-slate-950/90 border border-white/15 shadow-2xl backdrop-blur-xl max-w-[95vw] overflow-x-auto"
      role="group"
      aria-label="Persona switcher"
    >
      <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2 hidden sm:inline shrink-0">
        Role
      </span>
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setRole(o.id)}
          className={cn(
            'px-3 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0',
            role === o.id
              ? o.id === 'superadmin'
                ? 'bg-amber-300 text-slate-950'
                : 'bg-white text-slate-900'
              : 'text-slate-300 hover:text-white',
          )}
        >
          {o.id === 'superadmin' ? (
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>♛</span> {o.label}
            </span>
          ) : (
            o.label
          )}
        </button>
      ))}
    </div>
  )
}
