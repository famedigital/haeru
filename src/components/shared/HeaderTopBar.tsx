import { Bell, Moon, Search, Sun } from 'lucide-react'
import { ROOMS, ROLE_CONFIGS } from '../../data/enterprise'
import { useAppStore } from '../../lib/store/appStore'
import type { Role, RoomId } from '../../types/enterprise'
import { GlassChips } from '../ui/GlassChips'

const ROOM_CHIPS = ['All rooms', 'Toddlers', 'Nursery', 'Kindergarten']
const ROOM_IDS: Array<RoomId | 'all'> = ['all', 'toddlers', 'nursery', 'kg']

export function HeaderTopBar() {
  const { role, roomFilter, setRoomFilter, screen, theme, toggleTheme } = useAppStore()
  if (role === 'signin' || role === 'landing') return null

  const cfg = ROLE_CONFIGS[role as Exclude<Role, 'signin' | 'landing'>]
  const showRooms = role === 'owner' && (screen === 'children' || screen === 'today')
  const chipIndex = Math.max(0, ROOM_IDS.indexOf(roomFilter))

  return (
    <header className="sticky top-0 z-40 flex flex-col gap-3 px-4 md:px-8 py-3 border-b border-[color:var(--glass-border)] bg-[color:var(--pill-bg)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-md flex items-center gap-2 obsidian-pill rounded-xl px-3 py-2 text-[color:var(--text-muted)] text-sm">
          <Search className="w-4 h-4" />
          <span>Search by name or code…</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl obsidian-pill flex items-center justify-center text-[color:var(--text-muted)] hover:-translate-y-0.5 active:scale-[0.985] transition-all"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Sunrise light theme' : 'Midnight dark theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-700 dark:text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            type="button"
            className="relative w-10 h-10 rounded-xl obsidian-pill flex items-center justify-center text-[color:var(--text-muted)] hover:-translate-y-0.5 active:scale-[0.985] transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 border-2 border-[color:var(--pill-bg)]" />
          </button>
          <div className="obsidian-pill rounded-xl px-3 py-2 hidden sm:block">
            <div className="text-xs font-bold text-[color:var(--text-main)]">
              {cfg.userName.split(' ')[0]}
            </div>
            <div className="text-[10px] text-[color:var(--text-muted)]">{cfg.label}</div>
          </div>
        </div>
      </div>

      {showRooms && (
        <GlassChips
          items={ROOM_CHIPS}
          value={chipIndex}
          onChange={(i) => setRoomFilter(ROOM_IDS[i] ?? 'all')}
        />
      )}

      {role === 'facilitator' && (
        <div className="text-xs text-[color:var(--text-muted)]">
          Room filter locked to{' '}
          <span className="text-amber-600 dark:text-amber-700 dark:text-amber-200 font-bold">{ROOMS.nursery.name}</span>{' '}
          · {ROOMS.nursery.here} here today
        </div>
      )}
    </header>
  )
}
