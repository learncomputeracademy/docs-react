'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

// Ambient hero background — reactbits.dev's "Molten Metal" (a domain-warp
// fractal glow shader), reimplemented from scratch (not their source: only
// partial GLSL was recoverable from the docs page, and this is the same
// well-known "flame"/caustics warp-and-accumulate technique regardless) and
// retuned to this site's own dark-mode palette (brand orange on near-black,
// confirmed with the user) instead of the reference's purple.
//
// This is the one deliberate exception to DESIGN.md's "no ambient
// decorative chrome" rule — user-requested, dark-mode only (hero stays flat
// in light mode, unchanged), and defensively lightweight for the site's
// beginner/budget-device audience: WebGL2 + ~4 warp iterations (cheap per
// pixel), dpr capped at 2, paused via rAF skip when the tab isn't visible,
// and skipped entirely under prefers-reduced-motion (no canvas mounts at
// all, not just a paused one — avoids the GPU/battery cost for anyone who
// asked for less motion, not just less visible motion).
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
uniform vec3 uColorDim;
uniform vec3 uColorMid;
uniform vec3 uColorHot;
out vec4 fragColor;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  vec2 p = uv * 3.0;
  float t = iTime * 0.2;
  vec2 i = p;
  float d = length(p);
  float glow = 0.0;

  for (float n = 0.0; n < 4.0; n++) {
    float a = d + t + p.x * 0.5;
    mat2 rot = mat2(cos(a), sin(a), -sin(a), cos(a));
    p = rot * p * 1.02;
    vec2 q = p + vec2(cos(t - i.x), sin(t + i.y)) * 0.65;
    i -= q;
    glow += 0.09 / (abs(sin(i.x * 2.2) + cos(i.y * 2.2)) + 0.22);
  }
  glow = clamp(glow / 3.0, 0.0, 1.0);

  vec3 col = mix(uColorDim, uColorMid, clamp(glow, 0.0, 1.0));
  col = mix(col, uColorHot, clamp(glow - 0.75, 0.0, 1.0) * 2.5);

  fragColor = vec4(col, clamp(glow * 0.9, 0.0, 1.0));
}
`

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return [1, 1, 1]
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
}

export function MoltenBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // The `dark:` class on the wrapper only hides the canvas visually in
    // light mode — the WebGL loop would keep running underneath, burning
    // GPU/battery for nothing, which is exactly the budget-device cost
    // this file's own comment above promises to avoid. Mount/unmount the
    // whole renderer against <html>'s actual class instead of relying on
    // CSS visibility (this project has no next-themes/React theme context
    // to subscribe to — see lib/theme-transition.ts — so a MutationObserver
    // on the class attribute is the only way to hear a theme change).
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
// No WebGL2 support (some older/budget devices this site's audience may be
// on) means the hero just stays flat, not a broken/crashed section — this
// is decoration, never load-bearing.
function mount(container: HTMLDivElement): (() => void) | null {
  let renderer: Renderer
  try {
    renderer = new Renderer({
      webgl: 2, // shaders are GLSL 300 es, needs a real WebGL2 context
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
      // Site's own dark-mode tokens (not the reference's purple) —
      // resolved via canvas 2d (forces oklch() -> rgb) rather than
      // hardcoded guesses, see commit message.
      uColorDim: { value: hexToRgb('#0a0a0a') }, // --background (dark)
      uColorMid: { value: hexToRgb('#ff8a31') }, // --primary (dark)
      uColorHot: { value: hexToRgb('#ffffff') },
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
