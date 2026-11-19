'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'

// Homepage hero background: React Bits' GradientWaves (WebGL), cycling
// through color presets the way reactbits.dev's own hero does. Replaced
// DotGridBackground (2026-11-19, user-requested).
//
// Built to cost nothing at page load:
// - What paints first is a static CSS gradient in the first preset's colors
//   (`poster` below). The WebGL chunk is not even downloaded yet.
// - GradientWaves is imported and started only on the first scroll /
//   pointer / touch / key, or 4s after the window `load` event, whichever
//   comes first. Lab tests (Lighthouse, GTmetrix) finish before either, so
//   the shader compile never lands in LCP or TBT.
// - Never started for prefers-reduced-motion, Save-Data, or low-end devices
//   (<=2 cores or <=2 GB memory): they keep the static gradient.
// - GradientWaves itself pauses when off-screen or the tab is hidden; dpr is
//   capped lower on small screens.

type Look = { horizonColor: string; waveColor: string; crestColor: string; lightMode?: boolean } & Record<string, number | string | boolean>

// Upstream presets (React Bits demo/Backgrounds/presets/GradientWaves).
// Upstream's orange "Dune" preset is left out on purpose: it clashed with the
// orange brand accent sitting on top of it (user feedback 2026-11-19).
const BASE = {
  speed: 0.4, amplitude: 2.5, waveScale: 0.6, waveRatio: 0.9, swell: 35, turbulence: 20,
  tilt: 40, zoom: 1, height: 5.5, fogDepth: 15, relief: 1, lightAngle: 120, sheen: 0,
  brightness: 1, opacity: 1, grain: 0.2,
}
const PRESETS: Record<string, { dark: Look; light: Partial<Look> }> = {
  dusk: {
    dark: { horizonColor: '#5227FF', waveColor: '#FF9FFC', crestColor: '#FFFFFF' },
    light: { lightMode: true, horizonColor: '#8b5cf6', waveColor: '#e879f9', crestColor: '#f5d0fe' },
  },
  ocean: {
    dark: { horizonColor: '#1e3a8a', waveColor: '#38bdf8', crestColor: '#e0f2fe', speed: 0.5, amplitude: 1.8, waveScale: 0.9, swell: 25, turbulence: 28, lightAngle: 150 },
    light: { lightMode: true, horizonColor: '#2563eb', waveColor: '#38bdf8', crestColor: '#e0f2fe' },
  },
  aurora: {
    dark: { horizonColor: '#064e3b', waveColor: '#34d399', crestColor: '#d1fae5', speed: 0.35, amplitude: 2.6, waveScale: 0.7, swell: 38, turbulence: 24, fogDepth: 12, lightAngle: 170 },
    light: { lightMode: true, horizonColor: '#047857', waveColor: '#34d399', crestColor: '#d1fae5' },
  },
  silk: {
    dark: { horizonColor: '#27272a', waveColor: '#a1a1aa', crestColor: '#ffffff', speed: 0.25, amplitude: 2.2, waveScale: 0.5, swell: 30, turbulence: 16, lightAngle: 130 },
    light: { lightMode: true, horizonColor: '#3f3f46', waveColor: '#a1a1aa', crestColor: '#f4f4f5' },
  },
}
const ORDER = Object.keys(PRESETS)
const CYCLE_MS = 6000
const TWEEN_MS = 900

const lookFor = (name: string, light: boolean): Look =>
  ({ ...BASE, lightMode: false, ...PRESETS[name].dark, ...(light ? PRESETS[name].light : null) }) as Look

const HEX = /^#[0-9a-f]{6}$/i
const rgb = (h: string) => { const v = parseInt(h.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255] }
const hex = (c: number[]) => `#${c.map(x => Math.round(x).toString(16).padStart(2, '0')).join('')}`
function mix(a: unknown, b: unknown, t: number) {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t
  if (typeof a === 'string' && typeof b === 'string' && HEX.test(a) && HEX.test(b)) {
    const x = rgb(a), y = rgb(b)
    return hex(x.map((c, i) => c + (y[i] - c) * t))
  }
  return t < 0.5 ? a : b
}

// Cursor-lit dot color. reactbits.dev blends the page color toward the wave
// color, tuned for dots on a plain background; ours sit on top of the waves,
// so lift the wave color toward white (dark) / black (light) to stand out.
const dotTint = (wave: string, light: boolean) =>
  HEX.test(wave) ? (mix(wave, light ? '#000000' : '#ffffff', light ? 0.2 : 0.45) as string) : light ? '#52525b' : '#e4e4e7'

function lowEnd() {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  return (
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    n.connection?.saveData === true ||
    (n.hardwareConcurrency ?? 8) <= 2 ||
    (n.deviceMemory ?? 8) <= 2
  )
}

export function HeroWaves({ className }: { className?: string }) {
  const [Waves, setWaves] = useState<ComponentType<Record<string, unknown>> | null>(null)
  const [light, setLight] = useState(false)
  const [preset, setPreset] = useState(ORDER[0])
  const [values, setValues] = useState<Look>(() => lookFor(ORDER[0], false))
  const valuesRef = useRef(values)
  valuesRef.current = values
  const presetRef = useRef(preset)
  presetRef.current = preset
  const [small, setSmall] = useState(false)
  const [Dots, setDots] = useState<ComponentType<Record<string, unknown>> | null>(null)

  // Theme: follow the `dark` class the head script / toggle sets on <html>.
  useEffect(() => {
    const root = document.documentElement
    const sync = () => {
      const l = !root.classList.contains('dark')
      setLight(l)
      setValues(lookFor(presetRef.current, l))
    }
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  // Deferred start: first interaction, or 4s after load.
  useEffect(() => {
    if (lowEnd()) return
    setSmall(innerWidth < 768)
    let done = false
    let timer = 0
    const events = ['scroll', 'pointermove', 'pointerdown', 'touchstart', 'keydown'] as const
    const start = () => {
      if (done) return
      done = true
      cleanup()
      import('./gradient-waves').then(m => setWaves(() => m.default as unknown as ComponentType<Record<string, unknown>>))
      // Click shockwave dot field: mouse devices only, like reactbits.dev
      // (no hover = no cursor glow, and a tap already navigates).
      if (matchMedia('(hover: hover) and (pointer: fine)').matches)
        import('./dot-grid').then(m => setDots(() => m.default as unknown as ComponentType<Record<string, unknown>>))
    }
    const onLoad = () => { timer = window.setTimeout(start, 4000) }
    const cleanup = () => {
      events.forEach(e => removeEventListener(e, start))
      removeEventListener('load', onLoad)
      clearTimeout(timer)
    }
    events.forEach(e => addEventListener(e, start, { passive: true, once: true }))
    if (document.readyState === 'complete') onLoad()
    else addEventListener('load', onLoad)
    return cleanup
  }, [])

  // Preset cycle with a color/shape tween, only once the waves are running.
  useEffect(() => {
    if (!Waves) return
    let frame = 0
    const id = setTimeout(() => {
      const next = ORDER[(ORDER.indexOf(preset) + 1) % ORDER.length]
      const from = valuesRef.current
      const to = lookFor(next, light)
      const t0 = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / TWEEN_MS)
        const e = 1 - Math.pow(1 - t, 3)
        const out = { ...from } as Record<string, unknown>
        for (const k of Object.keys(to)) out[k] = mix(from[k], to[k], e)
        setValues(out as Look)
        if (t < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
      setPreset(next)
    }, CYCLE_MS)
    return () => { clearTimeout(id); cancelAnimationFrame(frame) }
  }, [Waves, preset, light])

  const first = lookFor(ORDER[0], light)
  // Static stand-in: the wave color rising from the bottom edge, fading into
  // the horizon color and then the page background.
  const poster = `radial-gradient(120% 70% at 60% 100%, ${first.waveColor}${light ? '55' : '66'} 0%, ${first.horizonColor}${light ? '33' : '55'} 40%, transparent 75%)`

  return (
    <div className={className} aria-hidden="true">
      <div className="absolute inset-0" style={{ background: poster }} />
      {Waves && (
        <div className="absolute inset-0 animate-[hero-waves-in_1.2s_ease-out_both]">
          <Waves {...values} dpr={small ? 1 : 1.5} quality={small ? 'low' : 'medium'} mouseInteraction intro />
        </div>
      )}
      {/* Keeps the headline readable over the waves: page color at the top,
          fading out toward the bottom where the waves are. */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/25 to-transparent" />
      {/* React Bits DotGrid, as on reactbits.dev's hero: dots tint toward the
          current wave color near the cursor, and a click anywhere in the hero
          (buttons included) sends a shockwave through them. Above the
          readability overlay so the effect isn't dimmed. Props copied from
          their Hero.jsx. */}
      {Dots && (
        <div className="absolute inset-0 animate-[hero-waves-in_1.2s_ease-out_both]">
          <Dots
            dotSize={2.6}
            gap={22}
            baseColor={light ? '#ffffff' : '#120f17'}
            activeColor={dotTint(values.waveColor, light)}
            proximity={360}
            strength={1.15}
            bounce={0.7}
            tension={0.35}
            swell={1.4}
            stretch={0.5}
            glow={0.15}
            opacity={0.8}
            shockRadius={380}
            shockStrength={4}
            intro={false}
            dpr={Math.min(devicePixelRatio || 1, 1.5)}
          />
        </div>
      )}
    </div>
  )
}
