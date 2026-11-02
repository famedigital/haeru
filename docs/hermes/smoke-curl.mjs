#!/usr/bin/env node
/**
 * Smoke test Pulse HTTP binder (npm run dev must be running).
 * Usage: node docs/hermes/smoke-curl.mjs
 */
const BASE = process.env.PULSE_API_URL || 'http://localhost:5173/api'
const KEY = process.env.PULSE_API_KEY || 'dev-pulse-key'

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Pulse-Key': KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  console.log(method, path, res.status, JSON.stringify(json, null, 2))
  if (!res.ok && res.status !== 409) process.exitCode = 1
  return json
}

const ingest = await req('POST', '/observations/from-hermes', {
  childId: 'c1',
  childName: 'Kinley Wangchuk',
  domain: 'Social & emotional',
  trigger: 'Resource sharing boundary',
  strategy: 'Calm Dzongkha prompt',
  milestone: 'Shares play materials after soft prompt',
  confidence: '96% · MoESD ELDS 3.2',
  source: 'voice',
  transcription: 'Kinley shared blocks with a classmate.',
  parentSafeTitle: 'Kinley sharing moment',
  parentSafeDesc: 'Kinley offered blocks to a classmate after a calm prompt.',
})

if (!ingest?.ok) process.exit(1)
const momId = ingest.data.moment.id
await req('POST', `/moments/${momId}/confirm`, { role: 'facilitator' })
await req('POST', `/moments/${momId}/confirm`, { role: 'owner' })
await req('GET', '/parents/child/c1/moments')

const photo = await req('POST', '/media/photo-from-hermes', {
  caption: '@Kinley @Pema Rainbow hands today',
  mediaUrls: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
  queueForDirector: true,
})
if (!photo?.ok) process.exit(1)
for (const m of photo.data.moments ?? []) {
  await req('POST', `/moments/${m.id}/confirm`, { role: 'owner' })
}
await req('GET', '/parents/child/c1/moments')
await req('GET', '/feeds/center/moments')
console.log('Smoke OK')
