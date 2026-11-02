/**
 * Cloudinary upload helper for Hermes Phase B media.
 * Server-only (Vite middleware). Never put API secret in the browser.
 *
 * Env (host only — see docs/hermes/.env.example):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *   CLOUDINARY_UPLOAD_PRESET  (optional unsigned preset)
 *   CLOUDINARY_FOLDER         (optional, default eccd/moments)
 */

import { createHash } from 'node:crypto'

export type CloudinaryUploadResult = {
  ok: true
  url: string
  publicId: string
  bytes?: number
  format?: string
  resourceType: 'image' | 'video' | 'raw' | 'auto'
}

export type CloudinaryUploadFailure = {
  ok: false
  error: string
  configured: boolean
}

function env(name: string): string | undefined {
  const v = process.env[name]
  return v && v.trim() ? v.trim() : undefined
}

export function isCloudinaryConfigured(): boolean {
  const cloud = env('CLOUDINARY_CLOUD_NAME')
  if (!cloud) return false
  if (env('CLOUDINARY_UPLOAD_PRESET')) return true
  return Boolean(env('CLOUDINARY_API_KEY') && env('CLOUDINARY_API_SECRET'))
}

function folder(): string {
  return env('CLOUDINARY_FOLDER') ?? 'eccd/moments'
}

export async function uploadFromRemoteUrl(
  fileUrl: string,
  opts?: { publicId?: string; resourceType?: 'image' | 'video' | 'auto' },
): Promise<CloudinaryUploadResult | CloudinaryUploadFailure> {
  const cloud = env('CLOUDINARY_CLOUD_NAME')
  if (!cloud) {
    return { ok: false, error: 'CLOUDINARY_CLOUD_NAME not set', configured: false }
  }

  const resourceType = opts?.resourceType ?? 'auto'
  const endpoint = `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`
  const preset = env('CLOUDINARY_UPLOAD_PRESET')
  const body = new URLSearchParams()
  body.set('file', fileUrl)
  body.set('folder', folder())
  if (opts?.publicId) body.set('public_id', opts.publicId)

  if (preset) {
    body.set('upload_preset', preset)
  } else {
    const apiKey = env('CLOUDINARY_API_KEY')
    const apiSecret = env('CLOUDINARY_API_SECRET')
    if (!apiKey || !apiSecret) {
      return {
        ok: false,
        error: 'Set CLOUDINARY_UPLOAD_PRESET or API_KEY + API_SECRET',
        configured: false,
      }
    }
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const toSign: string[] = [`folder=${folder()}`, `timestamp=${timestamp}`]
    if (opts?.publicId) toSign.unshift(`public_id=${opts.publicId}`)
    toSign.sort()
    const signature = createHash('sha1')
      .update(`${toSign.join('&')}${apiSecret}`)
      .digest('hex')
    body.set('api_key', apiKey)
    body.set('timestamp', timestamp)
    body.set('signature', signature)
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const json = (await res.json()) as {
      secure_url?: string
      url?: string
      public_id?: string
      bytes?: number
      format?: string
      resource_type?: string
      error?: { message?: string }
    }
    if (!res.ok || (!json.secure_url && !json.url)) {
      return {
        ok: false,
        error: json.error?.message ?? `Cloudinary HTTP ${res.status}`,
        configured: true,
      }
    }
    const url = json.secure_url ?? json.url!
    const rt = (json.resource_type as CloudinaryUploadResult['resourceType']) ?? resourceType
    return {
      ok: true,
      url,
      publicId: json.public_id ?? opts?.publicId ?? 'unknown',
      bytes: json.bytes,
      format: json.format,
      resourceType: rt === 'video' ? 'video' : rt === 'raw' ? 'raw' : 'image',
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Cloudinary upload failed',
      configured: true,
    }
  }
}

export async function resolveMediaUrls(input: {
  mediaUrls?: string[]
  telegramFileUrl?: string
  resourceType?: 'image' | 'video' | 'auto'
}): Promise<{ ok: true; mediaUrls: string[] } | { ok: false; error: string }> {
  if (input.mediaUrls && input.mediaUrls.length > 0) {
    return { ok: true, mediaUrls: input.mediaUrls }
  }
  if (!input.telegramFileUrl) {
    return { ok: false, error: 'Provide mediaUrls or telegramFileUrl' }
  }
  if (!isCloudinaryConfigured()) {
    if (/^https:\/\//i.test(input.telegramFileUrl)) {
      return { ok: true, mediaUrls: [input.telegramFileUrl] }
    }
    return {
      ok: false,
      error:
        'Cloudinary is not configured. Set CLOUDINARY_* env or pass mediaUrls after upload.',
    }
  }
  const uploaded = await uploadFromRemoteUrl(input.telegramFileUrl, {
    resourceType: input.resourceType ?? 'auto',
  })
  if (!uploaded.ok) return { ok: false, error: uploaded.error }
  return { ok: true, mediaUrls: [uploaded.url] }
}
