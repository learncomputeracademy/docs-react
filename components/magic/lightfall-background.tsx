'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

// Ambient hero background, third attempt — MoltenBackground ("doesn't look
// good") then GradientWavesBackground (also rejected) both replaced. This
// one reaches for reactbits.dev's "Lightfall" tagline ("let the light rain
// down"): thin light streaks falling from a soft glow near the top of the
// hero. Original reimplementation, not their code or technique — theirs
// projects a 3D tunnel via a raymarch-like accumulation loop; this is a
// much simpler per-lane falling-streak loop (each streak is a hashed lane
// with its own speed/phase, a bright head and a fading tail above it).
//
// Learned from the first two rounds: default to LOW intensity, not high —
// both prior attempts had to be dialed down after looking too heavy/busy
// against the hero's actual body text. This one starts capped tighter
// (alpha ~0.35, few streaks, no dense fill) rather than starting bold and
// walking it back.
//
// Same proven scaffold otherwise: dark-mode only, mounted/unmounted via a
// MutationObserver on <html>'s class (no next-themes/theme context in this
// project — see lib/theme-transition.ts), skipped under
// prefers-reduced-motion, WebGL2 creation try/caught so unsupported devices
// just get a flat hero, rAF paused off-tab.
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
uniform float uBrightness;
uniform vec3 uStreakColor;
uniform vec3 uGlowColor;
out vec4 fragColor;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  uv.y = 1.0 - uv.y; // 0 at top of the hero, 1 at the bottom
  float aspect = iResolution.x / iResolution.y;
  float t = iTime * uSpeed;

  vec3 col = vec3(0.0);

  const int COUNT = 10;
  for (int i = 0; i < COUNT; i++) {
    float seed = float(i) * 12.9898 + 3.1;
    float laneX = hash11(seed);
    float speedMul = 0.4 + hash11(seed + 3.7) * 0.7;
    float phase = hash11(seed + 7.1);
    float sway = (hash11(seed + 1.3) - 0.5) * 0.05;

    // Falls from just above the top (-0.15) to just below the bottom
    // (1.15), looping — a comet-style head with a tail trailing upward.
    float head = fract(t * speedMul * 0.12 + phase) * 1.3 - 0.15;
    float x = laneX + sin(head * 5.0 + seed) * sway;
    float dx = (uv.x - x) * aspect;

    float dyAbove = head - uv.y; // positive where the pixel sits above the head (the tail)
    float tail = smoothstep(0.0, 0.35, dyAbove) * smoothstep(0.7, 0.35, dyAbove);
    float headGlow = exp(-dyAbove * dyAbove * 900.0);
    float lineCore = exp(-dx * dx * 3200.0);
    float lineHalo = exp(-dx * dx * 260.0) * 0.25;

    float intensity = lineCore * (tail * 0.6 + headGlow) + lineHalo * (tail * 0.4 + headGlow);
    col += mix(uStreakColor, uGlowColor, hash11(seed + 5.2) * 0.4) * intensity;
  }

  // Soft glow source above the hero, matching the "light rain" origin.
  vec2 source = vec2(0.5, -0.05);
  vec2 d = (uv - source) * vec2(aspect, 1.0);
  col += uGlowColor * exp(-dot(d, d) * 3.0) * 0.35;

  col *= uBrightness;
  float alpha = clamp(length(col), 0.0, 1.0) * 0.35;
  fragColor = vec4(col * alpha, alpha);
}
`

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return [1, 1, 1]
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
}

export function LightfallBackground({ className }: { className?: string }) {
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
      uSpeed: { value: 0.5 },
      uBrightness: { value: 1.0 },
      // Site's own dark-mode tokens, not a reference palette — resolved via
      // canvas 2d (forces oklch() -> rgb) in the browser, see commit.
      uStreakColor: { value: hexToRgb('#ff8a31') }, // --primary (dark)
      uGlowColor: { value: hexToRgb('#ffffff') },
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
