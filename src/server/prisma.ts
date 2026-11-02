import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')

/** Prefer /data in production containers; else backend/prisma/dev.db for local. */
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:./')) {
  const prodPath = '/data/haeru.db'
  const localAbs = path.join(repoRoot, 'backend', 'prisma', 'dev.db').replace(/\\/g, '/')
  const useProd =
    process.env.NODE_ENV === 'production' || process.env.HAERU_DATA_DIR === '/data'
  process.env.DATABASE_URL = useProd ? `file:${prodPath}` : `file:${localAbs}`
}

const globalForPrisma = globalThis as unknown as { __eccdPrisma?: PrismaClient }

export const prisma =
  globalForPrisma.__eccdPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__eccdPrisma = prisma
}
