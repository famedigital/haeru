import { useState } from 'react'
import { Fingerprint } from 'lucide-react'
import { useAppStore } from '../../lib/store/appStore'
import { GlassButton, GlassCard } from '../ui'
import { cn } from '../../lib/utils/cn'
import { HaeruCharacter } from '../haeru'

export function QuickUnlock() {
  const { setRole, showToast } = useAppStore()
  const [pin, setPin] = useState('')

  const press = (d: string) => {
    if (pin.length >= 6) return
    const next = pin + d
    setPin(next)
    if (next.length === 6) {
      showToast('Unlocked · welcome back')
      setRole('owner')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <GlassCard padding="lg" className="w-full max-w-sm space-y-6 text-center">
        <div className="flex flex-col items-center">
          <HaeruCharacter size={120} expression="calm" animate />
          <h1 className="text-2xl text-slate-900 dark:text-white mt-2">Quick Unlock</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter your 6-digit PIN</p>
        </div>

        <div className="flex justify-center gap-3" aria-label="PIN progress">
          {Array.from({ length: 6 }).map((_, i) => (
            <i
              key={i}
              className={cn(
                'w-3.5 h-3.5 rounded-full border-2',
                i < pin.length ? 'bg-white border-white' : 'border-slate-500',
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 justify-center max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k) =>
            k === '' ? (
              <span key="empty" />
            ) : (
              <button
                key={k}
                type="button"
                onClick={() => {
                  if (k === '⌫') setPin((p) => p.slice(0, -1))
                  else press(k)
                }}
                className="h-[68px] rounded-full obsidian-pill text-xl display text-slate-900 dark:text-white hover:bg-white/10"
              >
                {k}
              </button>
            ),
          )}
        </div>

        <GlassButton
          variant="soft"
          className="w-full"
          onClick={() => {
            showToast('Touch ID / passkey success')
            setRole('owner')
          }}
        >
          <Fingerprint className="w-4 h-4" /> Unlock with Touch ID
        </GlassButton>

        <button
          type="button"
          className="text-xs text-emerald-700 dark:text-emerald-300 font-bold"
          onClick={() => showToast('Password sign-in coming in Phase 2')}
        >
          Use email & password instead
        </button>
      </GlassCard>
    </div>
  )
}
