# Bhutan ECCD Backend

Prisma schema + Zod-validated Pulse API contracts.

## Setup

```bash
# from repo root
cp backend/.env.example backend/.env
# edit DATABASE_URL

npm install
npx prisma generate --schema backend/prisma/schema.prisma
npx prisma migrate dev --schema backend/prisma/schema.prisma --name init
```

## API contracts (Zod in `src/lib/api/`)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/observations/from-hermes` | Hermes ELDS extraction ingest |
| POST | `/api/moments/:id/confirm` | Facilitator / director confirm |
| POST | `/api/invoices/auto-run` | 14-day lead automatic invoicing |
| POST | `/api/payments/report` | Parent mBoB / mPay journal report |

In-memory handlers live in `src/lib/api/pulseApiServer.ts` until Express/Next routes bind Prisma.
