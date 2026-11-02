import { useEffect, useState } from 'react'
import { formatNu } from '../../data/enterprise'
import { apiFetch } from '../../lib/api/httpClient'
import { useAppStore } from '../../lib/store/appStore'
import { GlassButton, GlassCard } from '../ui'
import { PageHeader } from '../shared/PageHeader'

type StaffRow = {
  id: string
  name: string
  role: string
  email: string | null
  phone: string
  room: string | null
}

export function StaffLeave() {
  const { showToast } = useAppStore()
  const [staff, setStaff] = useState<StaffRow[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState<'nursery' | 'kg' | 'toddlers'>('nursery')
  const [busy, setBusy] = useState(false)

  const load = () => {
    void apiFetch<StaffRow[]>('/staff', { auth: false }).then((r) => {
      if (r.ok && r.data) setStaff(r.data)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const add = async () => {
    if (!name.trim() || phone.trim().length < 6) {
      showToast('Name and phone required')
      return
    }
    setBusy(true)
    try {
      const r = await apiFetch<StaffRow>('/staff', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          role: 'facilitator',
          room,
          password: 'staff123',
        }),
      })
      if (!r.ok) {
        showToast(typeof r.error === 'string' ? r.error : 'Could not add staff')
        return
      }
      showToast(`${r.data?.name} added · password staff123`)
      setOpen(false)
      setName('')
      setPhone('')
      setEmail('')
      load()
    } catch {
      showToast('Network error · staff not saved')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & leave"
        subtitle={`${staff.length} staff in Prisma · leave board still demo`}
        actions={
          <>
            <GlassButton variant="ghost" onClick={() => showToast(`Payroll preview · ${formatNu(0)}`)}>
              October payroll
            </GlassButton>
            <GlassButton onClick={() => setOpen((v) => !v)}>
              {open ? 'Close form' : 'Add staff'}
            </GlassButton>
          </>
        }
      />

      {open && (
        <GlassCard padding="lg" className="grid sm:grid-cols-2 gap-3 max-w-3xl">
          <label className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
            Full name
            <input className="glass-input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
            Phone
            <input className="glass-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
            Email (optional)
            <input className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
            Room
            <select className="glass-input" value={room} onChange={(e) => setRoom(e.target.value as typeof room)}>
              <option value="toddlers">Toddlers</option>
              <option value="nursery">Nursery</option>
              <option value="kg">Kindergarten</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <GlassButton disabled={busy} onClick={() => void add()}>
              {busy ? 'Saving…' : 'Save facilitator'}
            </GlassButton>
          </div>
        </GlassCard>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {staff.map((s) => (
          <GlassCard key={s.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
              {s.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <b className="text-slate-900 dark:text-white text-sm block">{s.name}</b>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {s.role}
                {s.room ? ` · ${s.room}` : ''}
              </span>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {s.phone}
                {s.email ? ` · ${s.email}` : ''}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard padding="none">
        <div className="p-5 border-b border-white/10">
          <h2 className="text-lg text-slate-900 dark:text-white">Leave requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 text-left">
                <th className="px-5 py-3">Staff</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Dates</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-sm text-slate-500 dark:text-slate-400"
                >
                  No leave requests yet. Staff leave workflow will list live requests here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
