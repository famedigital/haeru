import { useCallback, useEffect, useMemo, useState } from 'react'
import { Copy, Link2, RefreshCw } from 'lucide-react'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassBadge, GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'
import { cn } from '../../lib/utils/cn'

type PairPerson = {
  id: string
  name: string
  role: string
  email: string | null
  phone: string
  room: string | null
  telegramPaired: boolean
  pairingStatus: 'paired' | 'pending' | 'unlinked'
  pairingToken: string | null
  deepLink: string | null
  children: Array<{
    id: string
    name: string
    code: string
    room: string
    relation: string
    isPrimary: boolean
  }>
}

type PairingPayload = {
  botUsername: string
  people: PairPerson[]
}

type Generated = {
  userId: string
  name: string
  pairingToken: string
  deepLink: string
  instructions: string
}

const ROLE_ORDER = ['owner', 'facilitator', 'parent', 'caregiver']

export function TelegramPairing() {
  const { showToast } = useAppStore()
  const [people, setPeople] = useState<PairPerson[]>([])
  const [bot, setBot] = useState('HaeruEccdBot')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'parents' | 'staff' | 'unlinked'>('all')
  const [last, setLast] = useState<Generated | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const r = await apiFetch<PairingPayload>('/telegram/pairing')
    if (r.ok && r.data) {
      setPeople(r.data.people)
      setBot(r.data.botUsername)
    } else {
      showToast('Could not load Telegram pairing list')
    }
    setLoading(false)
  }, [showToast])

  useEffect(() => {
    void load()
  }, [load])

  const rows = useMemo(() => {
    let list = [...people]
    if (filter === 'parents') list = list.filter((p) => p.role === 'parent' || p.role === 'caregiver')
    if (filter === 'staff') list = list.filter((p) => p.role === 'owner' || p.role === 'facilitator')
    if (filter === 'unlinked') list = list.filter((p) => p.pairingStatus !== 'paired')
    list.sort((a, b) => {
      const ra = ROLE_ORDER.indexOf(a.role)
      const rb = ROLE_ORDER.indexOf(b.role)
      if (ra !== rb) return ra - rb
      return a.name.localeCompare(b.name)
    })
    return list
  }, [people, filter])

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`${label} copied`)
    } catch {
      showToast('Could not copy — long-press the text instead')
    }
  }

  const generate = async (userId: string, reset: boolean) => {
    setBusyId(userId)
    const r = await apiFetch<Generated>('/telegram/pairing', {
      method: 'POST',
      body: JSON.stringify({ userId, reset }),
    })
    setBusyId(null)
    if (!r.ok || !r.data) {
      showToast('Could not create pairing link')
      return
    }
    setLast(r.data)
    showToast(`Pairing link ready for ${r.data.name}`)
    await load()
    void copy(r.data.deepLink, 'Telegram link')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telegram pairing"
        subtitle={`One-time codes for @${bot} · parents get private updates after Director confirm`}
        actions={
          <GlassButton variant="ghost" onClick={() => void load()}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </GlassButton>
        }
      />

      <GlassCard padding="lg" className="space-y-3">
        <h2 className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Link2 className="w-4 h-4 text-teal-500" /> How parents connect
        </h2>
        <ol className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal pl-5">
          <li>Generate a link for the parent or caregiver below.</li>
          <li>Send them the Telegram link (WhatsApp / SMS is fine).</li>
          <li>They open it once on their phone — Haeru pairs their chat.</li>
          <li>After you confirm a Hermes moment, they get a private Telegram update.</li>
        </ol>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Codes are one-time. Use <b>Reset</b> if they change phones or the old code was used.
        </p>
      </GlassCard>

      {last ? (
        <GlassCard padding="lg" className="space-y-3 !border-teal-400/40">
          <div className="flex flex-wrap items-center gap-2">
            <GlassBadge tone="ap">Just generated</GlassBadge>
            <b className="text-slate-900 dark:text-white">{last.name}</b>
          </div>
          <code className="block text-sm text-teal-800 dark:text-teal-200 break-all">
            {last.pairingToken}
          </code>
          <code className="block text-xs text-slate-600 dark:text-slate-300 break-all">
            {last.deepLink}
          </code>
          <p className="text-sm text-slate-600 dark:text-slate-300">{last.instructions}</p>
          <div className="flex flex-wrap gap-2">
            <GlassButton onClick={() => void copy(last.deepLink, 'Telegram link')}>
              <Copy className="w-3.5 h-3.5" /> Copy link
            </GlassButton>
            <GlassButton variant="soft" onClick={() => void copy(last.pairingToken, 'Pairing code')}>
              Copy code
            </GlassButton>
            <a
              href={last.deepLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <GlassButton variant="ghost">Open in Telegram</GlassButton>
            </a>
          </div>
        </GlassCard>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', 'All people'],
            ['parents', 'Parents & caregivers'],
            ['staff', 'Staff'],
            ['unlinked', 'Not paired'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold border transition',
              filter === id
                ? 'bg-teal-500/20 border-teal-400/40 text-teal-800 dark:text-teal-200'
                : 'obsidian-pill text-slate-500 dark:text-slate-400 border-transparent',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <GlassCard padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
                <th className="px-5 py-3">Person</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Child</th>
                <th className="px-5 py-3">Telegram</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-slate-500 dark:text-slate-400">
                    Loading people…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-slate-500 dark:text-slate-400">
                    No matching people. Admit a child (with guardian) or add staff first.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id} className="border-t border-white/5 align-top">
                    <td className="px-5 py-3">
                      <b className="text-slate-900 dark:text-white block">{p.name}</b>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {p.email || p.phone}
                      </span>
                    </td>
                    <td className="px-5 py-3 capitalize text-slate-600 dark:text-slate-300">
                      {p.role}
                      {p.room ? ` · ${p.room}` : ''}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {p.children.length === 0
                        ? '—'
                        : p.children.map((c) => `${c.name} (${c.relation})`).join(', ')}
                    </td>
                    <td className="px-5 py-3">
                      <GlassBadge
                        tone={
                          p.pairingStatus === 'paired'
                            ? 'ap'
                            : p.pairingStatus === 'pending'
                              ? 'bl'
                              : 'nya'
                        }
                      >
                        {p.pairingStatus === 'paired'
                          ? 'Paired'
                          : p.pairingStatus === 'pending'
                            ? 'Code waiting'
                            : 'Not linked'}
                      </GlassBadge>
                      {p.pairingToken ? (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 break-all max-w-[12rem]">
                          {p.pairingToken}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="flex flex-wrap justify-end gap-2">
                        {p.deepLink ? (
                          <GlassButton
                            variant="ghost"
                            className="!text-xs !py-1.5"
                            onClick={() => void copy(p.deepLink!, 'Telegram link')}
                          >
                            Copy link
                          </GlassButton>
                        ) : null}
                        <GlassButton
                          variant="sm"
                          disabled={busyId === p.id}
                          onClick={() => void generate(p.id, true)}
                        >
                          {busyId === p.id
                            ? '…'
                            : p.pairingStatus === 'paired'
                              ? 'Reset link'
                              : 'Generate link'}
                        </GlassButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
