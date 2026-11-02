import { useEffect, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { cn } from '../../lib/utils/cn'
import type { Role } from '../../types/enterprise'
import { HaeruLogo } from '../haeru'
import HaeruInteractive from '../haeru/HaeruInteractive'
import '../haeru/haeru.css'
import { GlassButton, GlassCard } from '../ui'

type AuthRole = Exclude<Role, 'signin' | 'landing'>

const CAROUSEL_SLIDES = [
  {
    tag: 'THE GUARDIAN PRINCIPLE',
    headline: 'One staff action becomes a child-scoped family reflection.',
    description: 'Parents only see their own child. Zero public classroom dumps.',
    highlight: '100% Child-Atomic Privacy',
  },
  {
    tag: 'BHUTAN MoESD ELDS 2019',
    headline: 'Observed, never tested. Milestones in seconds.',
    description: 'Telegram voice → Hermes AI → Director review gate.',
    highlight: '6 Official Domains',
  },
  {
    tag: 'NATIVE BHUTANESE BANKING',
    headline: 'Automated 4-tier tuition with Bank of Bhutan QR.',
    description: 'mBoB / mPay reconciliation with catch-up proration.',
    highlight: 'Bank of Bhutan & BNB Native',
  },
] as const

const CAROUSEL_MS = 5500

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function SignInShowcaseAside() {
  const [slide, setSlide] = useState(0)
  const current = CAROUSEL_SLIDES[slide]!

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % CAROUSEL_SLIDES.length)
    }, CAROUSEL_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <aside
      aria-label="Haeru live centre showcase"
      className="relative hidden lg:flex flex-col overflow-hidden m-2 rounded-[2rem] bg-emerald-950/5 dark:bg-slate-900/60 border border-emerald-500/20 dark:border-white/10 p-4 xl:p-5 min-h-0 h-[calc(100vh-1rem)]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(16,185,129,0.22), transparent 60%), linear-gradient(to top, rgba(16,185,129,0.12), transparent 45%)',
        }}
      />

      <div className="relative z-10 flex justify-center shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/25 dark:border-emerald-400/25 shadow-sm text-[10px] xl:text-[11px] font-semibold text-slate-900 dark:text-white">
          <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
          Live School Day · 40 / 45 Here · WSH Thimphu
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center py-2">
        <div className="absolute top-1 right-0 haeru-float-chip-1 z-20 hidden xl:flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-teal-500/20 dark:border-teal-400/20 shadow-lg max-w-[13.5rem]">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-700 dark:text-teal-400 text-xs font-bold">
            ✓
          </div>
          <div className="text-left text-[11px] min-w-0">
            <p className="font-bold text-slate-900 dark:text-white">Director Review Gate</p>
            <p className="text-slate-600 dark:text-slate-300">12 ELDS milestones verified</p>
          </div>
        </div>

        <div className="absolute bottom-1 left-0 haeru-float-chip-2 z-20 hidden xl:flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 dark:border-amber-400/20 shadow-lg max-w-[13.5rem]">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center text-sm" aria-hidden>
            👶
          </div>
          <div className="text-left text-[11px] min-w-0">
            <p className="font-bold text-slate-900 dark:text-white">Tashi&apos;s Daily Care</p>
            <p className="text-slate-600 dark:text-slate-300">🍚 Porridge · 😴 45m · 🔒</p>
          </div>
        </div>

        <div className="absolute bottom-2 right-0 haeru-float-chip-3 z-20 hidden 2xl:flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-400/20 shadow-lg max-w-[13.5rem]">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-sm" aria-hidden>
            🏦
          </div>
          <div className="text-left text-[11px] min-w-0">
            <p className="font-bold text-slate-900 dark:text-white">mBoB Reconciled</p>
            <p className="text-slate-600 dark:text-slate-300">#BoB-9842 · Nu. 6,000</p>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center">
          <div
            className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 blur-3xl -z-10 pointer-events-none"
            aria-hidden
          />
          <div className="relative z-10 scale-90 xl:scale-100 origin-center">
            <HaeruInteractive
              size={148}
              expression="happy"
              label="Haeru, your school companion"
              showSoundToggle
            />
          </div>
        </div>
      </div>

      <GlassCard
        padding="sm"
        className="relative z-10 shrink-0 space-y-2 border border-slate-200/80 dark:border-white/10 shadow-md"
      >
        <div key={slide} className="space-y-1 animate-[landingFadeUp_0.4s_ease-out]">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
            ✦ {current.tag}
          </p>
          <p className="text-xs font-semibold leading-snug text-slate-900 dark:text-white">
            {current.headline}
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {current.description}
          </p>
          <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
            {current.highlight}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Showcase slides">
          {CAROUSEL_SLIDES.map((s, i) => {
            const active = i === slide
            return (
              <button
                key={s.tag}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show slide ${i + 1}: ${s.tag}`}
                onClick={() => setSlide(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  active
                    ? 'w-5 bg-teal-500 dark:bg-teal-400'
                    : 'w-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500',
                )}
              />
            )
          })}
        </div>
      </GlassCard>

      <p className="relative z-10 mt-2 shrink-0 text-center text-[10px] text-slate-600 dark:text-slate-300">
        🇧🇹 MoESD ELDS 2019 · Wangchuk&apos;s School of Heroes, Babesa
      </p>
    </aside>
  )
}

/**
 * Enterprise Haeru sign-in — layout adapted from 21st "Split Sign In Form"
 * (diarmuradi/sign-in-3), restyled to Haeru glass tokens. No social OAuth in this slice.
 */
export function RoleLogin() {
  const id = useId()
  const { login: applySession, showToast, setRole } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)

  const login = async (e = email, p = password) => {
    setBusy(true)
    try {
      const r = await apiFetch<{
        role: AuthRole
        name: string
        childIds: string[]
        token: string
        user?: {
          id: string
          name: string
          role: AuthRole
          email?: string | null
          phone: string
          room?: string | null
          centreId: string
        }
        centre?: {
          id: string
          code: string
          name: string
          place: string
          city: string
        }
        id?: string
        email?: string | null
        room?: string | null
      }>('/auth/login', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email: e, password: p }),
      })
      if (!r.ok || !r.data?.token) {
        showToast('Login failed · check email and password')
        return
      }
      const d = r.data
      const user = d.user ?? {
        id: d.id || 'unknown',
        name: d.name,
        role: d.role,
        email: d.email,
        phone: '',
        room: d.room,
        centreId: d.centre?.id || 'WSH',
      }
      const centre = d.centre ?? {
        id: 'WSH',
        code: 'WSH',
        name: "Wangchuk's School of Heroes",
        place: 'Rigpai Ling, Babesa, Thimphu',
        city: 'Thimphu',
      }
      applySession(user, centre, d.token, d.childIds || [])
      showToast(`Welcome, ${user.name}`)
    } catch {
      showToast('Network error · try again or check API')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main
      aria-label="Sign in"
      className="wsh-canvas grid h-svh max-h-svh w-full overflow-hidden grid-cols-1 lg:grid-cols-2"
    >
      <section className="relative flex flex-col justify-center px-6 py-6 sm:px-10 min-h-0 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl bg-violet-500/12" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl bg-teal-500/10" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-2xl bg-rose-500/10" />
        </div>
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-px hidden lg:block bg-gradient-to-b from-transparent via-teal-400/40 to-transparent"
          aria-hidden
        />
        <button
          type="button"
          onClick={() => setRole('landing')}
          className="relative z-10 mb-4 self-start text-sm font-semibold text-teal-700 dark:text-teal-300 hover:underline"
        >
          ← Back to Haeru
        </button>

        <div className="relative z-10 mx-auto w-full max-w-sm space-y-5">
          <header className="space-y-3">
            <HaeruLogo showTagline />
            <div>
              <h1 className="display text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-500 via-blue-500 to-violet-500 dark:from-teal-300 dark:via-blue-300 dark:to-violet-400 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Sign in to your centre — care, ELDS, and families, child-scoped.
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Wangchuk&apos;s School of Heroes · Babesa, Thimphu
              </p>
            </div>
          </header>

          <GlassCard padding="md" className="space-y-3">
            <form
              className="space-y-3"
              onSubmit={(ev) => {
                ev.preventDefault()
                void login(email.trim(), password)
              }}
            >
              <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
                Email
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="username"
                  className="glass-input h-10"
                  placeholder="you@wsh.bt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
                Password
                <div className="relative">
                  <input
                    id={`${id}-password`}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="glass-input h-10 pr-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              <GlassButton disabled={busy} type="submit" className="w-full">
                {busy ? 'Signing in…' : 'Sign in'}
              </GlassButton>
            </form>
          </GlassCard>

        </div>
      </section>

      <SignInShowcaseAside />
    </main>
  )
}
