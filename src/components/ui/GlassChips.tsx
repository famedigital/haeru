import { cn } from '../../lib/utils/cn'

interface GlassChipsProps {
  items: string[]
  value: number
  onChange: (index: number) => void
  className?: string
}

export function GlassChips({ items, value, onChange, className }: GlassChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="listbox">
      {items.map((item, i) => (
        <button
          key={item}
          type="button"
          role="option"
          aria-selected={value === i}
          onClick={() => onChange(i)}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border active:scale-[0.985]',
            value === i
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.2)]'
              : 'bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-white/25',
          )}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
