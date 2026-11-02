import { useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Lock,
  Menu,
  Moon,
  Shield,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'
import { useAppStore } from '../../lib/store/appStore'
import type { Role } from '../../types/enterprise'
import {
  DOMAIN_STYLES,
  ELDS_DOMAIN_STYLE_KEYS,
  ELDS_MOTTO,
  RATING_LABEL,
} from '../../lib/elds/domains'
import { HaeruLogo } from '../haeru'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { cn } from '../../lib/utils/cn'
import HaeruStoryHero from './HaeruStoryHero'
import HaeruVoiceDemo from './HaeruVoiceDemo'

const NAV = [
  { href: '#haeru-voice', label: 'Haeru Voice AI' },
  { href: '#about', label: 'What is Haeru' },
  { href: '#personas', label: 'Who Can Use' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#curriculum', label: 'ELDS 2019' },
  { href: '#privacy', label: 'Security & Privacy' },
  { href: '#pricing', label: 'Centres & Pricing' },
]

const TRUST = [
  ['100% Child-Scoped', 'Zero public social dumps'],
  ['6 ELDS Domains', 'Observed, never tested'],
  ['mBoB & mPay Native', 'Nu. fees · automated receipts'],
  ['Director Review Gate', 'Zero unverified parent posts'],
]

const FEATURES = [
  {
    title: 'Gently Intelligent',
    body: 'Haeru Voice AI on Telegram transcribes classroom updates from voice notes so teachers never type on small keyboards during class.',
  },
  {
    title: 'Observed, Never Tested',
    body: 'Developmental progress follows MoESD ELDS 2019 — children are celebrated for exploration, never ranked against peers.',
  },
  {
    title: 'Culturally Rooted in Bhutan',
    body: 'Built for Bhutanese centres with Dzongkha-friendly greetings, Driglam Namzha values, and Bank of Bhutan QR reconciliation.',
  },
]

const PAINS = [
  {
    title: 'Teacher Burnout & Paperwork',
    body: '1.5–2 hours of unpaid overtime every night filling MoESD ELDS binders. Exhausted educators quit or cut corners.',
  },
  {
    title: 'Parent Anxiety & Blindness',
    body: 'Parents leave their child for 8 hours wondering: Did he eat? Did he nap? What did he learn?',
  },
  {
    title: 'WhatsApp Privacy Crisis',
    body: 'Whole-room photo dumps to every parent. Peer gossip and severe privacy violations become the norm.',
  },
]

const VOICE_TRUST = [
  ['Zero New Apps', 'Teachers already know Telegram'],
  ['Dzongkha + English', 'Colloquial mixed speech understood'],
  ['1-Tap Director Gate', 'Nothing reaches parents unverified'],
]

type PersonaKey = 'owner' | 'facilitator' | 'parent' | 'caregiver'

const PERSONAS: Record<
  PersonaKey,
  { tab: string; headline: string; features: string[]; demoRole: Exclude<Role, 'signin' | 'landing'> }
> = {
  owner: {
    tab: '👑 For Centre Directors',
    headline: 'Complete Early Childhood Centre Administration & Governance',
    features: [
      '9-step paperless admissions wizard — health, guardians, emergency contacts, transfers.',
      'Automated 4-tier tuition invoicing with mid-year catch-up proration.',
      'Director confirmation gate for ELDS ratings and photo moments before parents see them.',
      'Staff directory & casual leave balances; mBoB / mPay journal reconciliation in one tap.',
    ],
    demoRole: 'owner',
  },
  facilitator: {
    tab: '🎨 For Facilitators',
    headline: 'Spend Time with Children, Not with Paperwork',
    features: [
      '60-second daily care logger for meals, nap, mood, and toilet with rapid chips.',
      'Haeru Voice AI via Telegram — speak 15 seconds; AI maps to MoESD ELDS indicators.',
      'EXIF location stripping and privacy split warnings when social consent is missing.',
    ],
    demoRole: 'facilitator',
  },
  parent: {
    tab: '👨‍👩‍👧 For Parents',
    headline: "A Window into Your Child's Day — Completely Private",
    features: [
      'Daily reflection card: arrival, meals, nap, mood, and teacher quote.',
      'Private moments feed — strictly your child, never peer names.',
      '6-domain MoESD radar across four yearly windows with celebrate / home tips.',
      '1-tap fees: dynamic BoB QR, journal number, digital receipt.',
    ],
    demoRole: 'parent',
  },
  caregiver: {
    tab: '🤝 For Caregivers',
    headline: 'Daily Care Information with Strict Financial Boundaries',
    features: [
      'Authorized pickup verification and clear hand-off guidance.',
      'Daily care highlights — lunch, nap, medicine reminders.',
      'Strict fee cloaking — invoices and tuition plans stay invisible to caregivers.',
    ],
    demoRole: 'caregiver',
  },
}

const STEPS = [
  {
    n: '01',
    title: 'Capture in Seconds',
    body: 'Facilitator snaps a classroom moment or sends a Telegram voice note — under 15 seconds between activities.',
  },
  {
    n: '02',
    title: 'Privacy Split & Director Review',
    body: 'EXIF stripped · Haeru Voice AI maps ELDS domains · Centre Director confirms before anything reaches families.',
  },
  {
    n: '03',
    title: 'Private Child-Scoped Delivery',
    body: 'Parents get a gentle Haeru notification. Only their child’s progress is visible — with home learning tips.',
  },
]

const DOMAINS = [
  { emoji: '🏃', title: 'Physical Development & Motor Skills', body: 'Gross motor, fine motor, sensory balance, hygiene.' },
  { emoji: '🤝', title: 'Social & Emotional Development', body: 'Sharing, self-regulation, empathy, group play.' },
  { emoji: '🗣️', title: 'Language & Early Literacy', body: 'Listening, storytelling, Dzongkha vocabulary, pre-reading.' },
  { emoji: '🔍', title: 'Approaches to Learning', body: 'Exploration, persistence, imagination, curiosity.' },
  { emoji: '🧩', title: 'Cognition & General Knowledge', body: 'Counting, sorting, spatial sense, natural world.' },
  { emoji: '🌸', title: 'Spiritual, Moral & Cultural Values', body: 'Respect for elders, Bhutanese traditions, Driglam Namzha.' },
]

const SECURITY = [
  {
    icon: Shield,
    title: 'Child-Atomic Privacy',
    body: 'Individual child database scoping. Zero peer data leaks on parent feeds.',
  },
  {
    icon: Sparkles,
    title: 'Camera EXIF Stripping',
    body: 'GPS, device IDs, and metadata scrubbed from uploads before storage.',
  },
  {
    icon: Lock,
    title: 'Biometric Quick Unlock',
    body: '6-digit PIN and Touch ID / passkey with 15-minute idle lock on sensitive views.',
  },
  {
    icon: Shield,
    title: 'Data Sovereignty',
    body: 'AES-256 at rest · TLS 1.3 in transit · aligned with national data guidelines.',
  },
]

const PLANS = [
  {
    name: 'Community / NGO',
    price: 'Nu. 0',
    ideal: 'NGO & village ECCDs',
    children: 'Up to 25',
    staff: 'Up to 4',
    voice: '60 mins / month',
    billing: 'Basic manual',
    support: 'Community docs',
  },
  {
    name: 'Standard Private',
    price: 'Nu. 4,500 / mo',
    ideal: 'Standalone private centres',
    children: 'Up to 60',
    staff: 'Up to 12',
    voice: '300 mins / month',
    billing: 'Full wizard + auto-invoice',
    support: 'WhatsApp / phone',
  },
  {
    name: 'Enterprise Network',
    price: 'Nu. 8,500 / mo',
    ideal: 'Multi-branch ECCD groups',
    children: 'Unlimited',
    staff: 'Unlimited',
    voice: 'Unlimited',
    billing: 'Multi-branch consolidated',
    support: '24/7 Priority Ops',
  },
]

const FAQS = [
  {
    q: 'What makes Haeru different from WhatsApp or WeChat photo groups?',
    a: 'Group chats broadcast every child’s photo to all parents. Haeru is child-scoped — parents only see their own child — with MoESD ELDS records and secure tuition invoices.',
  },
  {
    q: 'Can grandparents or nannies use the app?',
    a: 'Yes. The Caregiver role shows daily care and pickup clearance, while tuition fees and payment forms stay strictly hidden.',
  },
  {
    q: 'How does Bank of Bhutan (mBoB) payment work?',
    a: 'Parents scan a dynamic BoB QR with the exact Nu. amount, then submit the mBoB journal number. The Director verifies it with one tap.',
  },
  {
    q: 'Does Haeru replace teachers’ observations?',
    a: 'No. Teachers dictate a short note; Haeru Voice AI maps it to ELDS. Facilitators and Directors keep full editorial control before families see anything.',
  },
  {
    q: 'How can our ECCD centre join Haeru?',
    a: 'Book centre onboarding with our Thimphu team, or launch the interactive demo to try Director and Facilitator portals today.',
  },
]

export function LandingPage() {
  const { setRole, theme, toggleTheme, showToast } = useAppStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [persona, setPersona] = useState<PersonaKey>('owner')
  const [faqOpen, setFaqOpen] = useState<number | null>(0)

  const signIn = () => setRole('signin')

  return (
    <div className="min-h-screen wsh-canvas relative">
      {/* Ambient glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 15% 10%, rgba(16,185,129,0.28), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 5%, rgba(245,158,11,0.22), transparent 50%), radial-gradient(ellipse 50% 35% at 50% 100%, rgba(20,184,166,0.15), transparent 55%)',
        }}
      />

      {/* Floating nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-white/10 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <HaeruLogo />
            <span className="hidden lg:inline h-5 w-px bg-slate-300 dark:bg-white/15" />
            <span className="hidden lg:inline text-xs text-slate-500 dark:text-slate-400 truncate">
              Trusted by Wangchuk&apos;s School of Heroes
            </span>
          </div>

          <nav className="hidden xl:flex items-center gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleTheme()}
              className="p-2 rounded-xl border border-slate-200/70 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <GlassButton variant="ghost" className="!hidden sm:!inline-flex !text-xs !py-2" onClick={signIn}>
              Sign in
            </GlassButton>
            <GlassButton className="!text-xs !py-2" onClick={signIn}>
              Sign in to centre
            </GlassButton>
            <button
              type="button"
              className="xl:hidden p-2 rounded-xl border border-slate-200/70 dark:border-white/15 text-slate-800 dark:text-white"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="xl:hidden max-w-7xl mx-auto pt-3 pb-1 flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-bold text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
              >
                {n.label}
              </a>
            ))}
            <button
              type="button"
              className="px-3 py-2 text-left text-sm font-bold text-emerald-700 dark:text-emerald-300"
              onClick={() => {
                setMenuOpen(false)
                signIn()
              }}
            >
              Sign in
            </button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative px-4 md:px-8 pt-14 pb-16 max-w-7xl mx-auto text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden>
          <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full blur-3xl bg-rose-400/20 dark:bg-rose-400/15 animate-[prism-pulse_4s_ease_infinite]" />
          <div className="absolute top-[10%] right-[-5%] w-80 h-80 rounded-full blur-3xl bg-amber-400/18 dark:bg-amber-400/12 animate-[prism-pulse_5s_ease_1s_infinite]" />
          <div className="absolute bottom-[5%] left-[20%] w-72 h-72 rounded-full blur-3xl bg-violet-400/16 dark:bg-violet-400/12 animate-[prism-pulse_4.5s_ease_0.5s_infinite]" />
          <div className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full blur-3xl bg-teal-400/14 dark:bg-teal-400/10 animate-[prism-pulse_3.5s_ease_1.5s_infinite]" />
        </div>
        <div className="inline-flex items-center gap-2 bg-violet-500/10 dark:bg-violet-400/10 border border-violet-500/20 text-violet-800 dark:text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <span aria-hidden>🇧🇹</span>
          National ECCD Standard · Aligned to MoESD 2019 Curriculum
        </div>
        <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] max-w-4xl mx-auto">
          <span className="text-slate-900 dark:text-white">The Intelligent Operating System for </span>
          <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-violet-500 dark:from-teal-300 dark:via-blue-300 dark:to-violet-400 bg-clip-text text-transparent">
            Bhutanese Early Childhood Care
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
          Haeru watches over every child&apos;s school day — bringing together Centre Directors,
          Teachers, and Families through private daily reflections, audio voice-logging, and
          developmental milestone tracking.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <GlassButton onClick={signIn}>
            Sign in to your centre <ArrowRight className="w-4 h-4" />
          </GlassButton>
          <GlassButton
            variant="soft"
            onClick={() => {
              document.getElementById('haeru-voice')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            See Haeru Voice AI ↓
          </GlassButton>
        </div>

        <div className="mt-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300 mb-4">
            A Day with Haeru · Tashi at WSH Thimphu
          </p>
          <HaeruStoryHero />
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {TRUST.map(([title, sub]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-slate-950/40 backdrop-blur-xl px-4 py-3 text-left hover:-translate-y-0.5 transition-transform"
            >
              <b className="block text-sm text-slate-900 dark:text-white">{title}</b>
              <span className="text-xs text-slate-500 dark:text-slate-400">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* #1 selling point — Haeru Voice AI on Telegram */}
      <section
        id="haeru-voice"
        className="px-4 md:px-8 py-16 md:py-20 max-w-7xl mx-auto scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
            Haeru Voice AI on Telegram · @HaeruEccdBot
          </p>
          <h2 className="display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            The Death of Paperwork
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Speak to Haeru on Telegram. Haeru does the rest — care logs, MoESD ELDS, and
            child-scoped parent delivery in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {PAINS.map((p) => (
            <GlassCard key={p.title} padding="md" className="space-y-2 text-left border border-rose-500/15">
              <p className="text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                Unbearable pain
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{p.body}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard
          padding="md"
          className="mb-8 border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-400/10 text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                The 15-second solution
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                Hold Telegram mic → send to @HaeruEccdBot → teacher&apos;s job is done.
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Haeru Voice AI extracts meals, mood, nap, and ELDS milestones — then queues Director
                confirmation before any parent sees it.
              </p>
            </div>
            <GlassBadge tone="ap">15s · Zero typing</GlassBadge>
          </div>
        </GlassCard>

        <div className="grid sm:grid-cols-3 gap-3 mb-10">
          {VOICE_TRUST.map(([title, sub]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-slate-950/40 backdrop-blur-xl px-4 py-3 text-left"
            >
              <b className="block text-sm text-slate-900 dark:text-white">{title}</b>
              <span className="text-xs text-slate-500 dark:text-slate-400">{sub}</span>
            </div>
          ))}
        </div>

        <HaeruVoiceDemo />
      </section>

      {/* What is Haeru */}
      <section id="about" className="px-4 md:px-8 py-20 max-w-7xl mx-auto scroll-mt-24">
        <h2 className="display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white max-w-2xl">
          What is Haeru?
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Most preschool software is either a spreadsheet or an insecure classroom feed that leaks
          other children&apos;s faces to every parent. Teachers drown in paper reports; families stay
          in the dark about real developmental progress.
        </p>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Named for protection — inspired by the Buddhist virtue of <em>Hārītī</em>, guardian of
          children — Haeru is an <strong className="text-slate-900 dark:text-white">original</strong>{' '}
          digital companion. The child is the atomic privacy unit: one staff action becomes many
          tailored family outcomes, only after Director review.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <GlassCard
              key={f.title}
              padding="lg"
              className="space-y-2 hover:-translate-y-0.5 transition-transform"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Personas */}
      <section id="personas" className="px-4 md:px-8 py-20 max-w-7xl mx-auto scroll-mt-24">
        <h2 className="display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Who can use Haeru?
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl">
          Four roles. One child-scoped privacy model.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(PERSONAS) as PersonaKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPersona(key)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-transform hover:-translate-y-0.5',
                persona === key
                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200',
              )}
            >
              {PERSONAS[key].tab}
            </button>
          ))}
        </div>
        <GlassCard padding="lg" className="mt-6 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {PERSONAS[persona].headline}
          </h3>
          <ul className="space-y-2">
            {PERSONAS[persona].features.map((line) => (
              <li key={line} className="text-sm text-slate-700 dark:text-slate-200 flex gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <GlassButton onClick={signIn}>
              Sign in as {persona} <ArrowRight className="w-4 h-4" />
            </GlassButton>
            <GlassBadge tone="ap">Child privacy enforced</GlassBadge>
          </div>
        </GlassCard>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 md:px-8 py-20 max-w-7xl mx-auto scroll-mt-24">
        <h2 className="display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          How it works
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <GlassCard
              key={s.n}
              padding="lg"
              className="space-y-3 hover:-translate-y-0.5 transition-transform"
            >
              <span className="display text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                {s.n}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ELDS */}
      <section id="curriculum" className="px-4 md:px-8 py-20 max-w-7xl mx-auto scroll-mt-24">
        <h2 className="display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Bhutan MoESD ELDS (2019)
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl">
          Six official developmental domains. {ELDS_MOTTO}
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map((d, i) => {
            const style = DOMAIN_STYLES[ELDS_DOMAIN_STYLE_KEYS[i]!]
            return (
              <GlassCard
                key={d.title}
                padding="lg"
                className={cn(
                  'space-y-2 hover:-translate-y-0.5 transition-transform border',
                  style.bg,
                  style.border,
                )}
              >
                <span className="text-2xl" aria-hidden>
                  {d.emoji}
                </span>
                <h3 className={cn('font-bold', style.text)}>{d.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{d.body}</p>
              </GlassCard>
            )
          })}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {(['ap', 'bl', 'nya'] as const).map((r) => (
            <GlassBadge key={r} rating={r}>
              {r.toUpperCase()} · {RATING_LABEL[r]}
            </GlassBadge>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Children are never ranked, compared, or given numerical grades.
        </p>
      </section>

      {/* Privacy */}
      <section id="privacy" className="px-4 md:px-8 py-20 max-w-7xl mx-auto scroll-mt-24">
        <h2 className="display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Security, privacy &amp; data sovereignty
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {SECURITY.map((s) => (
            <GlassCard
              key={s.title}
              padding="lg"
              className="flex gap-4 hover:-translate-y-0.5 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {s.body}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 md:px-8 py-20 max-w-7xl mx-auto scroll-mt-24">
        <h2 className="display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Centres &amp; pricing
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Transparent SaaS for Bhutanese ECCDs · Ngultrum billing
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <GlassCard
              key={p.name}
              padding="lg"
              className="space-y-3 hover:-translate-y-0.5 transition-transform"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
              <p className="display text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                {p.price}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{p.ideal}</p>
              <ul className="text-sm text-slate-700 dark:text-slate-200 space-y-1.5 pt-2">
                <li>Children: {p.children}</li>
                <li>Staff: {p.staff}</li>
                <li>Haeru Voice AI: {p.voice}</li>
                <li>Billing: {p.billing}</li>
                <li>Support: {p.support}</li>
              </ul>
            </GlassCard>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Custom onboarding available in Thimphu, Paro, and Phuentsholing.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 md:px-8 py-20 max-w-3xl mx-auto scroll-mt-24">
        <h2 className="display text-3xl font-bold text-slate-900 dark:text-white text-center">
          Frequently asked questions
        </h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((item, i) => {
            const open = faqOpen === i
            return (
              <GlassCard key={item.q} padding="none" className="overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  onClick={() => setFaqOpen(open ? null : i)}
                  aria-expanded={open}
                >
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform',
                      open && 'rotate-180',
                    )}
                  />
                </button>
                {open && (
                  <p className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.a}
                  </p>
                )}
              </GlassCard>
            )
          })}
        </div>
      </section>

      {/* Launch CTA */}
      <section className="px-4 md:px-8 pb-16 max-w-5xl mx-auto">
        <GlassCard
          padding="lg"
          className="text-center space-y-5 border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-400/10"
        >
          <h2 className="display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Give your ECCD centre the guardian it deserves
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join forward-thinking Bhutanese ECCDs on Haeru — paperless admissions, calm teachers,
            delighted families. Wangchuk&apos;s School of Heroes runs on Haeru today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <GlassButton onClick={signIn}>
              Sign in to Haeru <ArrowRight className="w-4 h-4" />
            </GlassButton>
            <GlassButton
              variant="soft"
              onClick={() => showToast('Onboarding · contact@haeru.bt · +975-17…')}
            >
              Contact Onboarding Team
            </GlassButton>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-white/10 px-4 md:px-8 py-14 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3">
            <HaeruLogo showTagline />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bhutan&apos;s premier early childhood operating system.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {(
                [
                  ['Director ERP', 'owner'],
                  ['Facilitator Hub', 'facilitator'],
                  ['Family Portal', 'parent'],
                  ['Caregiver View', 'caregiver'],
                  ['Superadmin Console', 'superadmin'],
                ] as const
              ).map(([label]) => (
                <li key={label}>
                  <button
                    type="button"
                    className="hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                    onClick={signIn}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
              Regulatory
            </h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li>Bhutan MoESD ELDS (2019)</li>
              <li>Dzongkhag coverage</li>
              <li>Child Privacy Charter</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>contact@haeru.bt</li>
              <li>+975-17 ··· ···· · Thimphu</li>
            </ul>
          </div>
        </div>
        <p className="max-w-7xl mx-auto mt-12 text-xs text-slate-500 dark:text-slate-400">
          © 2026 Haeru Platform. Built with care for the children of the Kingdom of Bhutan.
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
