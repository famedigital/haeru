import {
  Activity,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  CreditCard,
  FileText,
  Home,
  Image,
  Lock,
  LogOut,
  Mic,
  PlusCircle,
  Receipt,
  Server,
  ShieldAlert,
  Smile,
  Sparkles,
  UserRound,
  Users,
  Wallet,
  Repeat,
  X,
  type LucideIcon,
} from 'lucide-react'
import { ROLE_CONFIGS } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import type { Role } from '../../types/enterprise'
import { cn } from '../../lib/utils/cn'
import { HaeruAvatar } from '../haeru'

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  smile: Smile,
  file: FileText,
  briefcase: Briefcase,
  users: Users,
  receipt: Receipt,
  sparkle: Sparkles,
  image: Image,
  camera: Camera,
  mic: Mic,
  wallet: Wallet,
  calendar: Calendar,
  lock: Lock,
  repeat: Repeat,
  message: Users,
  shield: Lock,
  plus: PlusCircle,
  bell: FileText,
  sliders: FileText,
  activity: Activity,
  building: Building2,
  'credit-card': CreditCard,
  server: Server,
  'shield-alert': ShieldAlert,
}

type SectionKey = 'children' | 'finance' | 'learning' | 'people' | 'operations' | 'superadmin'

const SECTION_COLORS: Record<SectionKey, { active: string; dot: string }> = {
  children: {
    active: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-1 ring-inset ring-rose-400/25',
    dot: 'bg-rose-400',
  },
  finance: {
    active: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-1 ring-inset ring-amber-400/25',
    dot: 'bg-amber-400',
  },
  learning: {
    active: 'bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-1 ring-inset ring-violet-400/25',
    dot: 'bg-violet-400',
  },
  people: {
    active: 'bg-blue-400/15 text-blue-600 dark:text-blue-300 ring-1 ring-inset ring-blue-400/25',
    dot: 'bg-blue-400',
  },
  operations: {
    active: 'bg-teal-400/15 text-teal-700 dark:text-teal-300 ring-1 ring-inset ring-teal-400/25',
    dot: 'bg-teal-400',
  },
  superadmin: {
    active: 'bg-amber-400/15 text-amber-700 dark:text-amber-200 ring-1 ring-inset ring-amber-300/25',
    dot: 'bg-amber-300',
  },
}

function sectionFromLabel(label: string, role: Role): SectionKey {
  const l = label.toLowerCase()
  if (role === 'superadmin') {
    if (l.includes('saas') || l.includes('billing')) return 'finance'
    if (l.includes('moesd') || l.includes('learning')) return 'learning'
    if (l.includes('centre')) return 'children'
    if (l.includes('operation') || l.includes('platform')) return 'operations'
    return 'superadmin'
  }
  if (l.includes('child') || l.includes('kinley') || l.includes('my room')) return 'children'
  if (l.includes('finance') || l.includes('payment') || l.includes('invoice')) return 'finance'
  if (l.includes('learning') || l.includes('progress') || l.includes('feed')) return 'learning'
  if (l.includes('people') || l.includes('staff')) return 'people'
  return 'operations'
}

type PanelProps = {
  showClose?: boolean
  onClose?: () => void
}

function NavPanel({ showClose, onClose }: PanelProps) {
  const {
    role,
    screen,
    setScreen,
    currentUser,
    currentCentre,
    logout,
    showToast,
  } = useAppStore()
  if (role === 'signin' || role === 'landing') return null

  const cfg = ROLE_CONFIGS[role as Exclude<Role, 'signin' | 'landing'>]
  const displayName = currentUser?.name || cfg.userName
  const displayRole = currentUser?.role || cfg.label
  const roomLabel = currentUser?.room || 'All rooms'
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const go = (id: string) => {
    setScreen(id)
    onClose?.()
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 overflow-y-auto">
      <div className="flex items-start justify-between gap-2 px-2 pt-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <HaeruAvatar size="sm" expression="happy" />
            <span className="display text-lg font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              haeru
            </span>
          </div>
          <div className="pl-[42px]">
            <b className="block text-xs text-slate-900 dark:text-white leading-tight">
              {currentCentre?.name || 'Haeru ECCD'}
            </b>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {currentCentre?.place || currentCentre?.city || 'Bhutan'}
            </span>
          </div>
        </div>
        {showClose ? (
          <button
            type="button"
            className="w-9 h-9 rounded-xl obsidian-pill flex items-center justify-center text-slate-600 dark:text-slate-300"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      <nav className="flex flex-col gap-3 flex-1">
        {cfg.nav.map((group, gi) => {
          const section = sectionFromLabel(group.label || 'operations', role)
          const colors = SECTION_COLORS[section]
          return (
            <div key={group.label || `home-${gi}`} className="flex flex-col gap-0.5">
              {gi > 0 && (
                <div
                  className="mx-3 my-1.5 h-px bg-gradient-to-r from-transparent via-slate-200/60 dark:via-white/10 to-transparent"
                  aria-hidden
                />
              )}
              {group.label ? (
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[color:var(--text-faint)] px-3 py-1">
                  <span className={cn('size-1.5 rounded-full', colors.dot)} aria-hidden />
                  {group.label}
                </div>
              ) : null}
              {group.items.map((item) => {
                const Icon = ICONS[item.icon] ?? Home
                const on = screen === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.id)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-bold transition-all duration-150 w-full active:scale-[0.985]',
                      on
                        ? cn(colors.active, 'font-semibold')
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/30 dark:hover:bg-white/5 border border-transparent',
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {typeof item.badge === 'number' && (
                      <span className="text-[10px] bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-400/30 rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div className="space-y-2">
        <div className="obsidian-pill rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400/30 via-blue-400/25 to-violet-400/30 text-teal-800 dark:text-teal-200 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-slate-900 dark:text-white font-bold truncate">
              {displayName}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate capitalize">
              {displayRole} · {roomLabel}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              showToast(`${displayName} · ${displayRole}`)
              go(role === 'owner' ? 'settings' : role === 'parent' ? 'child' : 'ftoday')
            }}
            className="obsidian-pill rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-white/10"
          >
            <UserRound className="w-3.5 h-3.5" />
            Profile
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Sign out of Haeru?')) {
                onClose?.()
                logout()
              }
            }}
            className="obsidian-pill rounded-xl px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center justify-center gap-1.5 hover:bg-rose-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

type Props = {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function NavigationSidebar({ mobileOpen = false, onMobileClose }: Props) {
  const { role } = useAppStore()
  if (role === 'signin' || role === 'landing') return null

  return (
    <>
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[color:var(--glass-border)] bg-[color:var(--pill-bg)] backdrop-blur-xl sticky top-0 h-screen">
        <NavPanel />
      </aside>

      {mobileOpen ? (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            aria-label="Dismiss menu"
            onClick={onMobileClose}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(18rem,88vw)] border-r border-[color:var(--glass-border)] bg-[color:var(--pill-bg)] backdrop-blur-xl shadow-2xl">
            <NavPanel showClose onClose={onMobileClose} />
          </aside>
        </div>
      ) : null}
    </>
  )
}
