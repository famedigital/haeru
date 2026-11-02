/**
 * Bundle Pulse + Haeru Voice AI server for Node production (Coolify).
 * node_modules (incl. Prisma) stay external.
 */
import * as esbuild from 'esbuild'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

await esbuild.build({
  absWorkingDir: appRoot,
  entryPoints: {
    'server/pulseHttp': 'src/server/pulseHttp.ts',
    'server/hermesWebhookReg': 'src/server/hermesWebhookReg.ts',
  },
  outdir: 'dist-server',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  sourcemap: true,
  packages: 'external',
  logLevel: 'info',
})

console.log('[build-server] wrote dist-server/server/*.js')
