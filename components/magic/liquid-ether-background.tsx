'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

// Ambient hero background, fourth attempt — Molten/GradientWaves/Lightfall
// all rejected. Reaches for reactbits.dev's "Liquid Ether" tagline ("the
// web, made fluid at your fingertips"): unlike that reference's real fluid
// simulation (velocity/pressure fields, multiple ping-pong render passes —
// a genuinely heavy technique), this is a soft metaball blend warped by a
// cheap flow field, with the one thing likely doing the actual work here:
// real cursor interaction — the liquid visibly pushes away from the
// pointer. None of the first three attempts had any interactivity at all.
//
// Same low-intensity-first lesson as attempt 3, same proven scaffold
// otherwise: dark-mode only, mounted/unmounted via a MutationObserver on
// <html>'s class, skipped under prefers-reduced-motion, WebGL2 creation
// try/caught, rAF paused off-tab. The one addition: a pointermove listener
// on the window (not the canvas — it's pointer-events:none so clicks pass
// through to the hero content underneath) feeding a damped uMouse uniform.
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
uniform vec2 uMouse;
uniform float uMouseActive;
uniform vec3 uBgColor;
uniform vec3 uLiquidColor;
uniform vec3 uHighlightColor;
out vec4 fragColor;

vec2 blobCenter(int i, float t, float aspect) {
  float fi = float(i);
  float speed = 0.15 + fi * 0.05;
  float radius = 0.22 + fi * 0.06;
  // Spread across the full aspect-scaled width — a hero this wide (often
  // 2.5-3x taller than tall) left every origin bunched on the left half
  // when this wasn't scaled by aspect (caught live: three faint dots,
  // nothing past screen-center).
  vec2 origin = vec2((0.15 + fi * 0.22) * aspect, 0.4 - fi * 0.07);
  return origin + radius * vec2(cos(t * speed + fi * 2.1), sin(t * speed * 1.3 + fi * 1.7));
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float aspect = iResolution.x / iResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = iTime * uSpeed;

  // Cheap flow field (sum of a few sines) so the liquid drifts instead of
  // sitting static between mouse pushes.
  vec2 warp = vec2(
    sin(p.y * 3.0 + t * 0.6) + sin(p.y * 5.3 - t * 0.4) * 0.5,
    sin(p.x * 3.0 - t * 0.5) + sin(p.x * 4.7 + t * 0.3) * 0.5
  ) * 0.03;

  // The pointer pushes the field radially outward from itself, fading with
  // distance — this is the "fluid at your fingertips" part.
  vec2 mouseP = vec2(uMouse.x * aspect, uMouse.y);
  vec2 toMouse = p - mouseP;
  float distM = length(toMouse);
  float push = smoothstep(0.35, 0.0, distM) * uMouseActive;
  warp += (toMouse / max(distM, 1e-4)) * push * 0.12;

  vec2 pw = p + warp;

  float field = 0.0;
  for (int i = 0; i < 4; i++) {
    field += 0.03 / (distance(pw, blobCenter(i, t, aspect)) + 0.05);
  }

  // Thresholds tuned against the field's actual range for 4 blobs spread
  // this far apart (mostly 0.1-0.4 away from any single point) — the
  // original 0.6/1.3 cutoffs assumed a much hotter field and left the
  // whole thing invisible except a few pixels dead-center on a blob
  // (caught live, same pass as the aspect fix above).
  float body = smoothstep(0.12, 0.32, field);
  float core = smoothstep(0.32, 0.55, field);

  vec3 col = mix(uBgColor, uLiquidColor, body);
  col += uHighlightColor * core * 0.5;

  float alpha = body * 0.55;
  fragColor = vec4(col * alpha, alpha);
}
`

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return [1, 1, 1]
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
}

export function LiquidEtherBackground({ className }: { className?: string }) {
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
      uSpeed: { value: 0.4 },
      uMouse: { value: [0.5, 0.5] },
      uMouseActive: { value: 0 },
      // Site's own dark-mode tokens, not a reference palette — resolved via
      // canvas 2d (forces oklch() -> rgb) in the browser, see commit.
      uBgColor: { value: hexToRgb('#0a0a0a') }, // --background (dark)
      uLiquidColor: { value: hexToRgb('#ff8a31') }, // --primary (dark)
      uHighlightColor: { value: hexToRgb('#ffffff') },
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

  // Damped toward the real pointer position so the push feels fluid, not
  // teleporting; fades toward inactive (0) when the pointer leaves.
  const targetMouse = [0.5, 0.5]
  let targetActive = 0

  function onPointerMove(e: PointerEvent) {
    const rect = container.getBoundingClientRect()
    if (e.clientY < rect.top || e.clientY > rect.bottom) {
      targetActive = 0
      return
    }
    targetMouse[0] = (e.clientX - rect.left) / rect.width
    targetMouse[1] = 1 - (e.clientY - rect.top) / rect.height
    targetActive = 1
  }
  function onPointerLeave() {
    targetActive = 0
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerleave', onPointerLeave)

  let raf = 0
  let visible = true
  function loop(t: number) {
    raf = requestAnimationFrame(loop)
    if (!visible) return
    program.uniforms.iTime.value = t * 0.001
    const mouse = program.uniforms.uMouse.value as number[]
    mouse[0] += (targetMouse[0] - mouse[0]) * 0.08
    mouse[1] += (targetMouse[1] - mouse[1]) * 0.08
    program.uniforms.uMouseActive.value += (targetActive - program.uniforms.uMouseActive.value) * 0.06
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
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerleave', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    container.removeChild(canvas)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
