import { adoptBankQr } from './centreBank'

type Detector = {
  detect: (src: ImageBitmap) => Promise<{ rawValue: string }[]>
}

async function detectNative(bitmap: ImageBitmap): Promise<string | null> {
  const Ctor = (
    window as unknown as {
      BarcodeDetector?: new (opts: { formats: string[] }) => Detector
    }
  ).BarcodeDetector
  if (!Ctor) return null
  try {
    const det = new Ctor({ formats: ['qr_code'] })
    const hits = await det.detect(bitmap)
    return hits[0]?.rawValue?.trim() || null
  } catch {
    return null
  }
}

async function detectJsqr(bitmap: ImageBitmap): Promise<string | null> {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(bitmap, 0, 0)
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { default: jsQR } = await import('jsqr')
  const code = jsQR(image.data, image.width, image.height)
  return code?.data?.trim() || null
}

export async function readBankQrFile(file: File) {
  const bitmap = await createImageBitmap(file)
  try {
    const candidates = [await detectNative(bitmap), await detectJsqr(bitmap)].filter(
      (v): v is string => Boolean(v),
    )
    if (!candidates.length) return { error: 'No QR in that photo.' as const }
    for (const raw of candidates) {
      const adopted = adoptBankQr(raw)
      if (adopted) return { ok: true as const, ...adopted }
    }
    return {
      error:
        'That QR is not a bank EMV code. Use the official SCAN & PAY poster from mBoB or mPAY.' as const,
    }
  } finally {
    bitmap.close()
  }
}
