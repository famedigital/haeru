import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin, type Connect, type ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

type PulseHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean>

/** Dev middleware — Hermes POSTs /api/* (SSR module instance; curl contract tests) */
function pulseApiPlugin(): Plugin {
  const attach = (server: ViteDevServer, middlewares: Connect.Server) => {
    middlewares.use((req, res, next) => {
      if (!req.url?.startsWith('/api/')) {
        next()
        return
      }
      void server
        .ssrLoadModule('/src/server/pulseHttp.ts')
        .then((mod: { handlePulseHttp?: PulseHandler }) => {
          if (!mod.handlePulseHttp) {
            next()
            return undefined
          }
          return mod.handlePulseHttp(req, res)
        })
        .then((handled) => {
          if (handled === false) next()
          if (handled === undefined) next()
        })
        .catch((err: unknown) => {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              ok: false,
              error: err instanceof Error ? err.message : 'Pulse middleware error',
            }),
          )
        })
    })
  }

  return {
    name: 'eccd-pulse-api',
    configureServer(server) {
      attach(server, server.middlewares)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pulseApiPlugin()],
})
