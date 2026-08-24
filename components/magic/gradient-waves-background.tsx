'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

// Ambient hero background, replacing the earlier MoltenBackground attempt
// (user: "doesn't look good") — softer rolling gradient wave silhouettes
// fading into haze near the top, in the spirit of reactbits.dev's "Gradient
// Waves" (an original reimplementation: their version raymarches a 3D
// plasma heightfield; this is a much cheaper layered sine-silhouette +
// vertical fog approach reaching for the same "soft rolling waves fading
// into haze" feel, not their code or algorithm).
//
// Same mount/perf scaffold as the file it replaces: dark-mode only, and a
// MutationObserver actually mounts/unmounts the WebGL renderer on theme
// toggle rather than just CSS-hiding it (no next-themes/theme context in
// this project — see lib/theme-transition.ts); skipped under
// prefers-reduced-motion; WebGL2 creation is try/caught so unsupported
// devices just get a flat hero, never a crash.
const VERTEX = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uBrightness;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  uv.y = 1.0 - uv.y; // 0 at top of the hero, 1 at the bottom
  float aspect = iResolution.x / iResolution.y;
  float x = uv.x * aspect;
  float t = iTime * uSpeed;

  // Two soft rolling wave silhouettes (a fainter, higher "back" swell and a
  // bolder "front" one), each a sum of two sines so the crest line isn't a
  // perfectly regular sine — reads as organic rolling motion, not a dial.
  float backWave = 0.32
    + sin(x * uWaveScale * 2.0 + t * 0.6) * uAmplitude * 0.02
    + sin(x * uWaveScale * 4.3 - t * 0.35) * uAmplitude * 0.01;
  float frontWave = 0.54
    + sin(x * uWaveScale * 1.6 + t * 0.9 + 1.7) * uAmplitude * 0.035
    + sin(x * uWaveScale * 3.1 - t * 0.5 + 0.4) * uAmplitude * 0.015;

  float dBack = uv.y - backWave;
  float dFront = uv.y - frontWave;

  // Soft fill below each wave line (the "body" of the wave), plus a thin
  // brighter crest right at the line itself.
  float backBody = smoothstep(-0.02, 0.06, dBack);
  float frontBody = smoothstep(-0.02, 0.06, dFront);
  float backCrest = exp(-pow(dBack * 90.0, 2.0)) * 0.5;
  float frontCrest = exp(-pow(dFront * 90.0, 2.0));

  vec3 col = uHorizonColor;
  col = mix(col, uWaveColor * 0.7, backBody * 0.35);
  col = mix(col, uWaveColor, frontBody * 0.5);
  col += uCrestColor * (backCrest + frontCrest) * 0.4;
  col *= uBrightness;

  // Fades to transparent near the top of the hero ("into haze"). Capped
  // well under 1.0 even at the bottom — this sits directly behind body
  // text (design feedback: the first version read as a solid orange block
  // and made the hero copy unreadable), so it has to stay a soft wash, not
  // a fill.
  float alpha = smoothstep(0.0, 0.6, uv.y) * 0.3;
  fragColor = vec4(col * alpha, alpha);
}
`

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return [1, 1, 1]
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
}

export function GradientWavesBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let stop: (() => void) | null = null

    function start() {
      if (stop || !container) return
      stop = mount(container)
    }

    if (document.documentElement.classList.contains('dark')) start()

    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark')
      if (dark) start()
      else if (stop) {
        stop()
        stop = null
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
      stop?.()
    }
  }, [])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}

// Sets up one WebGL render loop against `container`, returns its teardown.
// No WebGL2 support means the hero just stays flat, not a broken section —
// this is decoration, never load-bearing.
function mount(container: HTMLDivElement): (() => void) | null {
  let renderer: Renderer
  try {
    renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
  } catch {
    return null
  }
  const gl = renderer.gl
  gl.clearColor(0, 0, 0, 0)
  const canvas = gl.canvas as HTMLCanvasElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  container.appendChild(canvas)

  const geometry = new Triangle(gl)
  const program = new Program(gl, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    uniforms: {
      iResolution: { value: [1, 1] },
      iTime: { value: 0 },
      uSpeed: { value: 0.3 },
      uAmplitude: { value: 1.4 },
      uWaveScale: { value: 1.3 },
      uBrightness: { value: 1.0 },
      // Site's own dark-mode tokens, not a reference palette — resolved via
      // canvas 2d (forces oklch() -> rgb) in the browser, see commit.
      uHorizonColor: { value: hexToRgb('#0a0a0a') }, // --background (dark)
      uWaveColor: { value: hexToRgb('#ff8a31') }, // --primary (dark)
      uCrestColor: { value: hexToRgb('#ffffff') },
    },
  })
  const mesh = new Mesh(gl, { geometry, program })

  function resize() {
    const w = container?.clientWidth ?? 0
    const h = container?.clientHeight ?? 0
    renderer.setSize(w, h)
    program.uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height]
  }
  window.addEventListener('resize', resize)
  resize()

  let raf = 0
  let visible = true
  function loop(t: number) {
    raf = requestAnimationFrame(loop)
    if (!visible) return
    program.uniforms.iTime.value = t * 0.001
    renderer.render({ scene: mesh })
  }
  raf = requestAnimationFrame(loop)

  function onVisibility() {
    visible = document.visibilityState === 'visible'
  }
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
    container.removeChild(canvas)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
