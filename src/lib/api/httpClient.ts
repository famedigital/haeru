const KEY = 'dev-pulse-key'

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<{ ok: boolean; status: number; data?: T; error?: unknown }> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  if (init?.auth !== false) headers.set('X-Pulse-Key', KEY)
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 12_000)
  try {
    const res = await fetch(`/api${path.startsWith('/') ? path : `/${path}`}`, {
      ...init,
      headers,
      signal: init?.signal ?? ctrl.signal,
    })
    const json = (await res.json()) as { ok?: boolean; data?: T; error?: unknown }
    return {
      ok: Boolean(json.ok ?? res.ok),
      status: res.status,
      data: json.data,
      error: json.error,
    }
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : 'Network error',
    }
  } finally {
    clearTimeout(timer)
  }
}
