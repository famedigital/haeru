/**
 * Haeru production entry — SPA + Pulse API + Telegram webhook.
 * Coolify: PORT, PUBLIC_URL, TELEGRAM_*, DATABASE_URL, STT keys.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 3000)
const distDir = path.join(__dirname, 'dist')

async function boot() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:/data/haeru.db'
  }
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'

  // Ensure sqlite parent dir exists
  if (process.env.DATABASE_URL.startsWith('file:')) {
    const dbPath = process.env.DATABASE_URL.replace(/^file:/, '')
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  }

  const push = spawnSync(
    'npx',
    ['prisma', 'db', 'push', '--schema', 'backend/prisma/schema.prisma', '--skip-generate'],
    { cwd: __dirname, env: process.env, encoding: 'utf8' },
  )
  if (push.status !== 0) {
    console.error('[haeru] prisma db push failed', push.stderr || push.stdout)
  } else {
    console.log('[haeru] prisma schema synced')
  }

  const webhookMod = await import(
    pathToFileURL(path.join(__dirname, 'dist-server/server/hermesWebhookReg.js')).href
  )
  const reg = await webhookMod.registerTelegramWebhook()
  if (reg.skipped) console.log('[haeru] Telegram webhook skipped (no TELEGRAM_BOT_TOKEN)')
  else if (reg.ok) console.log('[haeru] Telegram webhook →', reg.url)
  else console.error('[haeru] Telegram webhook error', reg.error)

  const pulseMod = await import(
    pathToFileURL(path.join(__dirname, 'dist-server/server/pulseHttp.js')).href
  )
  const handlePulseHttp = pulseMod.handlePulseHttp

  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = req.url || '/'

      if (req.method === 'GET' && (url === '/health' || url.startsWith('/health?'))) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: true, ts: Date.now() }))
        return
      }

      if (url.startsWith('/api/')) {
        const handled = await handlePulseHttp(req, res)
        if (handled) return
      }

      let rel = decodeURIComponent(url.split('?')[0] || '/')
      if (rel === '/') rel = '/index.html'
      const filePath = path.normalize(path.join(distDir, rel))
      if (!filePath.startsWith(distDir)) {
        res.statusCode = 403
        res.end('Forbidden')
        return
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath)
        res.statusCode = 200
        res.setHeader('Content-Type', mime[ext] || 'application/octet-stream')
        fs.createReadStream(filePath).pipe(res)
        return
      }

      const indexHtml = path.join(distDir, 'index.html')
      if (fs.existsSync(indexHtml)) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        fs.createReadStream(indexHtml).pipe(res)
        return
      }

      res.statusCode = 404
      res.end('Not found')
    } catch (err) {
      console.error('[haeru] request error', err)
      res.statusCode = 500
      res.end('Server error')
    }
  })

  server.listen(PORT, () => {
    console.log(`[haeru] listening on :${PORT}`)
  })
}

boot().catch((err) => {
  console.error('[haeru] boot failed', err)
  process.exit(1)
})
