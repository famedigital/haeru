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

export interface AppUser {
  id: string
  name: string
  role: Role
  email?: string | null
  phone: string
  room?: string | null
  centreId: string
}

export interface AppCentre {
  id: string
  code: string
  name: string
  place: string
  city: string
}

interface AppState {
  currentUser: AppUser | null
  currentCentre: AppCentre | null
  token: string | null
  isAuthenticated: boolean
  role: Role
  screen: string
  roomFilter: RoomId | 'all'
  selectedChildId: string
  toast: string | null
  theme: Theme
  currentCentreId: string | null
  isImpersonating: boolean
  impersonationReason: string | null
  login: (user: AppUser, centre: AppCentre, token: string, childIds?: string[]) => void
  logout: () => void
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

const TOKEN_KEY = 'haeru_token'
const SESSION_KEY = 'haeru_session'
const LEGACY_SESSION = 'wsh_uat_session'

const CAREGIVER_BLOCKED = new Set([
  'payments',
  'finance',
  'feesetup',
  'newinvoice',
  'autoinv',
  'feestructure',
  'reports',
])

const APP_ROLES = new Set<Role>([
  'superadmin',
  'owner',
  'facilitator',
  'parent',
  'caregiver',
])

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem('wsh_theme')
  return saved === 'light' ? 'light' : 'dark'
}

function homeFor(role: Role): string {
  if (role === 'landing' || role === 'signin') return role === 'landing' ? 'landing' : 'unlock'
  return ROLE_CONFIGS[role].home
}

function persistSession(user: AppUser, centre: AppCentre, token: string, childIds: string[]) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ user, centre, token, childIds, role: user.role }),
    )
    // Keep legacy key so PROD gate in setRole still sees a session during transition
    localStorage.setItem(
      LEGACY_SESSION,
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        room: user.room,
        childIds,
        token,
      }),
    )
  } catch {
    /* ignore */
  }
}

function clearSessionStorage() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(LEGACY_SESSION)
  } catch {
    /* ignore */
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [currentCentre, setCurrentCentre] = useState<AppCentre | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRoleState] = useState<Role>('landing')
  const [screen, setScreenState] = useState('landing')
  const [roomFilter, setRoomFilter] = useState<RoomId | 'all'>('all')
  const [selectedChildId, setSelectedChildId] = useState(PARENT_CHILD_ID)
  const [toast, setToast] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>(readInitialTheme)
  const [currentCentreId, setCurrentCentreId] = useState<string | null>(null)
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [impersonationReason, setImpersonationReason] = useState<string | null>(null)
  const [preImpersonationRole, setPreImpersonationRole] = useState<Role | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    localStorage.setItem('wsh_theme', theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const savedToken =
        typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
      if (!savedToken) {
        // Dev: allow landing; Prod: stay landing until login
        setHydrated(true)
        return
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
        const json = (await res.json()) as {
          ok?: boolean
          data?: {
            user: AppUser
            centre: AppCentre
            token: string
            childIds?: string[]
          }
        }
        if (cancelled) return
        if (json.ok && json.data?.user) {
          const u = json.data.user
          const c = json.data.centre
          const t = json.data.token || savedToken
          setCurrentUser(u)
          setCurrentCentre(c)
          setToken(t)
          setRoleState(u.role)
          setScreenState(homeFor(u.role))
          setCurrentCentreId(c.id)
          if (json.data.childIds?.[0]) setSelectedChildId(json.data.childIds[0])
          persistSession(u, c, t, json.data.childIds ?? [])
        } else {
          clearSessionStorage()
          setRoleState(import.meta.env.PROD ? 'signin' : 'landing')
          setScreenState(import.meta.env.PROD ? 'unlock' : 'landing')
        }
      } catch {
        if (!cancelled) {
          // Offline / API down — try local session snapshot
          try {
            const raw = localStorage.getItem(SESSION_KEY)
            if (raw) {
              const parsed = JSON.parse(raw) as {
                user?: AppUser
                centre?: AppCentre
                token?: string
                childIds?: string[]
              }
              if (parsed.user && parsed.centre && parsed.token) {
                setCurrentUser(parsed.user)
                setCurrentCentre(parsed.centre)
                setToken(parsed.token)
                setRoleState(parsed.user.role)
                setScreenState(homeFor(parsed.user.role))
                if (parsed.childIds?.[0]) setSelectedChildId(parsed.childIds[0])
              }
            }
          } catch {
            /* ignore */
          }
        }
      } finally {
        if (!cancelled) setHydrated(true)
      }
    }
    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const login = useCallback(
    (user: AppUser, centre: AppCentre, nextToken: string, childIds: string[] = []) => {
      setCurrentUser(user)
      setCurrentCentre(centre)
      setToken(nextToken)
      setRoleState(user.role)
      setCurrentCentreId(centre.id)
      setIsImpersonating(false)
      setImpersonationReason(null)
      if (childIds[0]) setSelectedChildId(childIds[0])
      setScreenState(homeFor(user.role))
      persistSession(user, centre, nextToken, childIds)
    },
    [],
  )

  const logout = useCallback(() => {
    clearSessionStorage()
    setCurrentUser(null)
    setCurrentCentre(null)
    setToken(null)
    setRoleState('signin')
    setScreenState('unlock')
    setCurrentCentreId(null)
    setIsImpersonating(false)
    setImpersonationReason(null)
    setSelectedChildId(PARENT_CHILD_ID)
    void fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined)
  }, [])

  const setRole = useCallback((next: Role) => {
    if (
      import.meta.env.PROD &&
      APP_ROLES.has(next) &&
      typeof window !== 'undefined'
    ) {
      try {
        const raw = localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_SESSION)
        const parsed = raw ? (JSON.parse(raw) as { role?: Role; user?: { role?: Role } }) : null
        const sessionRole = parsed?.user?.role || parsed?.role
        if (!sessionRole || sessionRole !== next) {
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
      clearSessionStorage()
      setCurrentUser(null)
      setCurrentCentre(null)
      setToken(null)
      setScreenState(next === 'landing' ? 'landing' : 'unlock')
      setIsImpersonating(false)
      setImpersonationReason(null)
      setCurrentCentreId(null)
      setPreImpersonationRole(null)
      return
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
      currentUser,
      currentCentre,
      token,
      isAuthenticated: Boolean(token && currentUser),
      role,
      screen,
      roomFilter,
      selectedChildId,
      toast,
      theme,
      currentCentreId,
      isImpersonating,
      impersonationReason,
      login,
      logout,
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
      currentUser,
      currentCentre,
      token,
      role,
      screen,
      roomFilter,
      selectedChildId,
      toast,
      theme,
      currentCentreId,
      isImpersonating,
      impersonationReason,
      login,
      logout,
      setRole,
      setScreen,
      openChild,
      showToast,
      toggleTheme,
      startImpersonation,
      exitImpersonation,
    ],
  )

  // Avoid flash of landing before session restore in production
  if (!hydrated && import.meta.env.PROD) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm">
        Restoring Haeru session…
      </div>
    )
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useAppStore(): AppState {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}
