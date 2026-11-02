import { cn } from '../../lib/utils/cn'

interface GlassTabsProps {
  items: string[]
  value: number
  onChange: (index: number) => void
  className?: string
}

export function GlassTabs({ items, value, onChange, className }: GlassTabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex gap-1 border-b border-slate-200 dark:border-white/10 mb-5 overflow-x-auto no-scrollbar',
        className,
      )}
    >
      {items.map((item, i) => (
        <button
          key={item}
          role="tab"
          type="button"
          aria-selected={value === i}
          onClick={() => onChange(i)}
          className={cn(
            'px-3.5 py-2.5 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px active:scale-[0.985]',
            value === i
              ? 'text-emerald-700 dark:text-emerald-300 border-emerald-500 dark:border-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent',
          )}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
