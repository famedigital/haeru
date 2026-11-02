/** 15-minute idle auto-lock for owner / finance-sensitive views (Phase 6). */
export const IDLE_LOCK_MS = 15 * 60 * 1000

const SENSITIVE_SCREENS = new Set([
  'finance',
  'newinvoice',
  'autoinv',
  'feestructure',
  'feesetup',
  'reports',
  'people',
  'confirm',
])

export function isSensitiveScreen(screen: string): boolean {
  return SENSITIVE_SCREENS.has(screen)
}

export function createIdleWatcher(
  onIdle: () => void,
  timeoutMs: number = IDLE_LOCK_MS,
): () => void {
  let timer = window.setTimeout(onIdle, timeoutMs)

  const bump = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(onIdle, timeoutMs)
  }

  const events: Array<keyof WindowEventMap> = [
    'mousemove',
    'mousedown',
    'keydown',
    'touchstart',
    'scroll',
  ]
  events.forEach((e) => window.addEventListener(e, bump, { passive: true }))

  return () => {
    window.clearTimeout(timer)
    events.forEach((e) => window.removeEventListener(e, bump))
  }
}
