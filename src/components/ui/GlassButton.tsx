import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

type Variant = 'primary' | 'soft' | 'ghost' | 'sm' | 'destructive' | 'success'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
  loading?: boolean
}

const VARIANT: Record<Variant, string> = {
  primary:
    'group relative overflow-hidden text-white bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400 hover:from-teal-300 hover:via-blue-300 hover:to-violet-300 shadow-lg shadow-blue-400/20 hover:shadow-xl hover:shadow-blue-400/30 border border-white/20 active:scale-[0.97]',
  soft:
    'text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/15 hover:border-blue-400/50 hover:shadow-md hover:shadow-blue-400/10 bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/8 active:scale-[0.97]',
  ghost:
    'bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-white/15 hover:bg-white/60 dark:hover:bg-slate-800/60 shadow-sm active:scale-[0.97]',
  sm: 'relative overflow-hidden text-white text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 via-blue-400 to-violet-400 border border-white/20 hover:from-teal-300 hover:via-blue-300 hover:to-violet-300 active:scale-[0.97]',
  destructive:
    'text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 shadow-md shadow-rose-500/20 border border-rose-300/30 active:scale-[0.97]',
  success:
    'text-white bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 shadow-md shadow-teal-500/20 border border-teal-300/30 active:scale-[0.97]',
}

export function GlassButton({
  children,
  variant = 'primary',
  loading = false,
  className,
  disabled,
  ...rest
}: GlassButtonProps) {
  const isSm = variant === 'sm'
  const showShimmer = variant === 'primary'
  const { type = 'button', ...btnRest } = rest
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold cursor-pointer transition-all duration-200 ease-out select-none disabled:opacity-50 disabled:cursor-not-allowed',
        isSm ? 'rounded-xl' : 'rounded-xl px-4 py-2.5 text-sm',
        VARIANT[variant],
        className,
      )}
      {...btnRest}
    >
      {showShimmer && (
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
          aria-hidden
        />
      )}
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}
