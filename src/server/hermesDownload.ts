/**
 * Download Telegram voice/audio file bytes for STT.
 */

export async function downloadVoiceFile(fileId: string): Promise<Buffer> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN not set')

  const metaRes = await fetch(
    `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`,
  )
  const meta = (await metaRes.json()) as {
    ok?: boolean
    result?: { file_path?: string }
    description?: string
  }
  if (!meta.ok || !meta.result?.file_path) {
    throw new Error(meta.description || 'Telegram getFile failed')
  }

  const fileUrl = `https://api.telegram.org/file/bot${token}/${meta.result.file_path}`
  const fileRes = await fetch(fileUrl)
  if (!fileRes.ok) throw new Error(`Telegram file download HTTP ${fileRes.status}`)
  const ab = await fileRes.arrayBuffer()
  return Buffer.from(ab)
}
