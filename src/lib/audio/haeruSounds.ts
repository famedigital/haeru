/**
 * Zero-dependency Haeru sound synthesizer — Web Audio API only.
 * Warm, toddler-safe tones; no external MP3/CDN assets.
 */

class HaeruSoundEngine {
  private ctx: AudioContext | null = null
  private enabled = true

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('haeru_sound_enabled')
      this.enabled = saved !== 'false'
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  public isMuted(): boolean {
    return !this.enabled
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('haeru_sound_enabled', String(this.enabled))
    }
    if (this.enabled) this.playPop()
    return this.enabled
  }

  /** Soft bubble pop — click / squish */
  public playPop() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    const now = ctx.currentTime

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1800, now)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(420, now)
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.07)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.08)
  }

  /** Himalayan crystal chirp — hover / greeting */
  public playChirp() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    ;[740, 932].forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      const start = now + idx * 0.06

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(2400, start)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.18, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.18)
    })
  }

  /** Singing-bowl purr — petting streak */
  public playPurr() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    ;[432, 864].forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1200, now)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      const vol = idx === 0 ? 0.22 : 0.08
      gain.gain.setValueAtTime(vol, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.6)
    })
  }

  /** Celebration arpeggio — joy / delivery */
  public playJoy() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    ;[523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      const start = now + idx * 0.08

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(2200, start)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.2, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.25)
    })
  }
}

export const haeruSounds = new HaeruSoundEngine()
