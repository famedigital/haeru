import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CENTRES, PARENT_CHILD_ID, ROLE_CONFIGS } from '../../data/enterprise'
import type { Role, RoomId } from '../../types/enterprise'

export type Theme = 'dark' | 'light'

interface AppState {
  role: Role
  screen: string
  roomFilter: RoomId | 'all'
  selectedChildId: string
  toast: string | null
  theme: Theme
  currentCentreId: string | null
  isImpersonating: boolean
  impersonationReason: string | null
  setRole: (role: Role) => void
  setScreen: (screen: string) => void
  setRoomFilter: (room: RoomId | 'all') => void
  openChild: (childId: string) => void
  showToast: (msg: string) => void
  clearToast: () => void
  toggleTheme: () => void
  startImpersonation: (centreId: string, reason: string) => void
  exitImpersonation: () => void
}

const AppCtx = createContext<AppState | null>(null)

const CAREGIVER_BLOCKED = new Set([
  'payments',
  'finance',
  'feesetup',
  'newinvoice',
  'autoinv',
  'feestructure',
  'reports',
])

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem('wsh_theme')
  return saved === 'light' ? 'light' : 'dark'
}

const APP_ROLES = new Set<Role>([
  'superadmin',
  'owner',
  'facilitator',
  'parent',
  'caregiver',
])

function readSessionRole(): Role | null {
  if (typeof window === 'undefined') return null
  // Production: never restore a role without a login session
  if (!import.meta.env.DEV) {
    try {
      const raw = localStorage.getItem('wsh_uat_session')
      if (!raw) return null
      const parsed = JSON.parse(raw) as { role?: Role }
      if (parsed.role && APP_ROLES.has(parsed.role)) return parsed.role
    } catch {
      return null
    }
    return null
  }
  return null
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => readSessionRole() ?? 'landing')
  const [screen, setScreenState] = useState(() => {
    const r = readSessionRole()
    if (r && r !== 'landing' && r !== 'signin') return ROLE_CONFIGS[r].home
    return 'landing'
  })
  const [roomFilter, setRoomFilter] = useState<RoomId | 'all'>('all')
  const [selectedChildId, setSelectedChildId] = useState(PARENT_CHILD_ID)
  const [toast, setToast] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>(readInitialTheme)
  const [currentCentreId, setCurrentCentreId] = useState<string | null>(null)
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [impersonationReason, setImpersonationReason] = useState<string | null>(null)
  const [preImpersonationRole, setPreImpersonationRole] = useState<Role | null>(null)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    localStorage.setItem('wsh_theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const setRole = useCallback((next: Role) => {
    // Production: block persona hopping into app roles without a session
    if (
      !import.meta.env.DEV &&
      APP_ROLES.has(next) &&
      typeof window !== 'undefined'
    ) {
      try {
        const raw = localStorage.getItem('wsh_uat_session')
        const parsed = raw ? (JSON.parse(raw) as { role?: Role }) : null
        if (!parsed?.role || parsed.role !== next) {
          setRoleState('signin')
          setScreenState('unlock')
          return
        }
      } catch {
        setRoleState('signin')
        setScreenState('unlock')
        return
      }
    }
    setRoleState(next)
    if (next === 'signin' || next === 'landing') {
      try {
        localStorage.removeItem('wsh_uat_session')
      } catch {
        /* ignore */
      }
      setScreenState(next === 'landing' ? 'landing' : 'unlock')
      setIsImpersonating(false)
      setImpersonationReason(null)
      setCurrentCentreId(null)
      setPreImpersonationRole(null)
      return
    }
    if (next === 'parent' || next === 'caregiver') {
      setSelectedChildId(PARENT_CHILD_ID)
    }
    setScreenState(ROLE_CONFIGS[next].home)
  }, [])

  const setScreen = useCallback(
    (next: string) => {
      if (role === 'caregiver' && CAREGIVER_BLOCKED.has(next)) {
        setToast('Fees stay private to parents. Caregivers cannot view invoices.')
        return
      }
      setScreenState(next)
    },
    [role],
  )

  const openChild = useCallback((childId: string) => {
    setSelectedChildId(childId)
    setScreenState('child')
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const startImpersonation = useCallback(
    (centreId: string, reason: string) => {
      const centre = CENTRES.find((c) => c.id === centreId)
      if (!centre) {
        setToast('Centre not found')
        return
      }
      if (!reason.trim()) {
        setToast('Impersonation reason is required')
        return
      }
      setPreImpersonationRole(role)
      setCurrentCentreId(centreId)
      setImpersonationReason(reason.trim())
      setIsImpersonating(true)
      setRoleState('owner')
      setScreenState('today')
      setToast(`Support session · ${centre.name}`)
    },
    [role],
  )

  const exitImpersonation = useCallback(() => {
    setIsImpersonating(false)
    setImpersonationReason(null)
    setCurrentCentreId(null)
    const restore = preImpersonationRole === 'superadmin' ? 'superadmin' : 'superadmin'
    setPreImpersonationRole(null)
    setRoleState(restore)
    setScreenState('super_centres')
    setToast('Exited support session')
  }, [preImpersonationRole])

  const value = useMemo(
    () => ({
      role,
      screen,
      roomFilter,
      selectedChildId,
      toast,
      theme,
      currentCentreId,
      isImpersonating,
      impersonationReason,
      setRole,
      setScreen,
      setRoomFilter,
      openChild,
      showToast,
      clearToast: () => setToast(null),
      toggleTheme,
      startImpersonation,
      exitImpersonation,
    }),
    [
      role,
      screen,
      roomFilter,
      selectedChildId,
      toast,
      theme,
      currentCentreId,
      isImpersonating,
      impersonationReason,
      setRole,
      setScreen,
      openChild,
      showToast,
      toggleTheme,
      startImpersonation,
      exitImpersonation,
    ],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useAppStore(): AppState {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}
