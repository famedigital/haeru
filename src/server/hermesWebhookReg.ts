/**
 * Register Telegram webhook on boot (Coolify / production).
 * Customer brand: Haeru Voice AI — never mention Hermes in bot copy.
 */

export type WebhookRegResult =
  | { ok: true; url: string; skipped?: boolean }
  | { ok: false; error: string }

export async function registerTelegramWebhook(): Promise<WebhookRegResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '')
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET

  if (!token) {
    return { ok: true, url: '', skipped: true }
  }
  if (!publicUrl) {
    return { ok: false, error: 'PUBLIC_URL not set — cannot register Telegram webhook' }
  }

  const webhookUrl = `${publicUrl}/api/telegram/webhook`
  const body: Record<string, unknown> = {
    url: webhookUrl,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: false,
  }
  // Telegram only allows A-Z a-z 0-9 _ - (1–256). Slash/base64 secrets fail setWebhook.
  if (secret) {
    if (!/^[A-Za-z0-9_-]{1,256}$/.test(secret)) {
      return {
        ok: false,
        error:
          'TELEGRAM_WEBHOOK_SECRET has illegal characters (use A–Z a–z 0–9 _ - only)',
      }
    }
    body.secret_token = secret
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as { ok?: boolean; description?: string }
    if (!json.ok) {
      return { ok: false, error: json.description || 'setWebhook failed' }
    }
    return { ok: true, url: webhookUrl }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'setWebhook network error',
    }
  }
}

export async function getTelegramWebhookInfo(): Promise<unknown> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return { ok: false, error: 'TELEGRAM_BOT_TOKEN not set' }
  const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)
  return res.json()
}
