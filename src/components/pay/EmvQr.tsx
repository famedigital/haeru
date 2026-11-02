import { useEffect, useState } from 'react'

const SIZE = {
  sm: 'w-28 h-28',
  md: 'w-40 h-40',
  lg: 'w-56 h-56',
  xl: 'w-64 h-64 sm:w-72 sm:h-72',
} as const

export function EmvQr({
  payload,
  size = 'lg',
  className = '',
}: {
  payload: string
  size?: keyof typeof SIZE
  className?: string
}) {
  const [svg, setSvg] = useState('')
  const box = SIZE[size]

  useEffect(() => {
    if (!payload) {
      setSvg('')
      return
    }
    let gone = false
    void import('qrcode')
      .then((mod) =>
        mod.toString(payload, {
          type: 'svg',
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: '#0f172a', light: '#ffffff' },
        }),
      )
      .then((next) => {
        if (!gone) setSvg(next)
      })
      .catch(() => {
        if (!gone) setSvg('')
      })
    return () => {
      gone = true
    }
  }, [payload])

  if (!payload) {
    return (
      <div
        className={`mx-auto shrink-0 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 ${box} ${className}`}
        aria-hidden
      />
    )
  }

  if (!svg) {
    return (
      <div
        className={`mx-auto shrink-0 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 ${box} ${className}`}
        aria-hidden
      />
    )
  }

  return (
    <div
      className={`mx-auto shrink-0 rounded-xl bg-white p-2 shadow-sm border border-slate-200 [&_svg]:block [&_svg]:h-full [&_svg]:w-full ${box} ${className}`}
      aria-label="Payment QR code"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
