/**
 * Multi-provider cloud STT for Haeru Voice AI (OpenAI / Groq / Deepgram).
 */

export type SttProvider = 'openai' | 'groq' | 'deepgram'

function pickProvider(): SttProvider {
  const forced = (process.env.STT_PROVIDER || '').toLowerCase()
  if (forced === 'openai' || forced === 'groq' || forced === 'deepgram') return forced
  if (process.env.GROQ_API_KEY) return 'groq'
  if (process.env.OPENAI_API_KEY) return 'openai'
  if (process.env.DEEPGRAM_API_KEY) return 'deepgram'
  throw new Error('No STT provider configured · set GROQ_API_KEY, OPENAI_API_KEY, or DEEPGRAM_API_KEY')
}

async function whisperCompatible(
  url: string,
  apiKey: string,
  model: string,
  audio: Buffer,
  filename: string,
): Promise<string> {
  const form = new FormData()
  form.append('file', new Blob([new Uint8Array(audio)], { type: 'audio/ogg' }), filename)
  form.append('model', model)
  form.append('language', process.env.STT_LANGUAGE || 'en')

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`STT HTTP ${res.status}: ${errText.slice(0, 200)}`)
  }
  const json = (await res.json()) as { text?: string }
  return (json.text || '').trim()
}

async function deepgramTranscribe(apiKey: string, audio: Buffer): Promise<string> {
  const res = await fetch(
    'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'audio/ogg',
      },
      body: audio,
    },
  )
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Deepgram HTTP ${res.status}: ${errText.slice(0, 200)}`)
  }
  const json = (await res.json()) as {
    results?: { channels?: Array<{ alternatives?: Array<{ transcript?: string }> }> }
  }
  return json.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || ''
}

/** Transcribe Telegram voice note bytes → plain text */
export async function transcribeAudio(
  audio: Buffer,
  filename = 'voice.ogg',
): Promise<{ text: string; provider: SttProvider }> {
  const provider = pickProvider()
  if (provider === 'groq') {
    const key = process.env.GROQ_API_KEY!
    const text = await whisperCompatible(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      key,
      process.env.GROQ_STT_MODEL || 'whisper-large-v3-turbo',
      audio,
      filename,
    )
    return { text, provider }
  }
  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY!
    const text = await whisperCompatible(
      'https://api.openai.com/v1/audio/transcriptions',
      key,
      process.env.OPENAI_STT_MODEL || 'whisper-1',
      audio,
      filename,
    )
    return { text, provider }
  }
  const text = await deepgramTranscribe(process.env.DEEPGRAM_API_KEY!, audio)
  return { text, provider }
}
