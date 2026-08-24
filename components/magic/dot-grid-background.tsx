'use client'

import { useEffect, useRef } from 'react'

// Ambient hero background, fifth attempt — Molten/GradientWaves/Lightfall/
// LiquidEther were all rejected. Those were each an "inspired by" WebGL
// approximation of a much heavier reference technique (real fluid sims,
// raymarched tunnels), which is exactly why none of them matched their
// example: the fidelity gap was baked in from the start. A dot grid with a
// cursor-proximity glow has no such gap — the real technique is this
// simple — so this is a faithful build, not an approximation.
//
// Plain Canvas 2D, no WebGL/ogl: cheaper than every prior attempt, and
// genuinely idle when the pointer isn't over the hero (redraws happen on
// pointermove/resize only, no persistent requestAnimationFrame loop
// running forever like the WebGL versions needed to justify). Dark-mode
// only via CSS (`dark:block`) — no MutationObserver mount/unmount dance
// this time; there's no meaningful idle cost in light mode to defend
// against without one.
const SPACING = 26 // px between dot centers
const BASE_RADIUS = 1.3
const MAX_RADIUS = 3
const GLOW_RADIUS = 140 // px — how far the cursor's influence reaches

export function DotGridBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      if (!container || !canvas) return
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      const mouse = mouseRef.current
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          let radius = BASE_RADIUS
          let alpha = 0.18
          if (mouse) {
            const dist = Math.hypot(x - mouse.x, y - mouse.y)
            const influence = Math.max(0, 1 - dist / GLOW_RADIUS)
            radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * influence
            alpha = 0.18 + 0.75 * influence
          }
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 138, 49, ${alpha})` // --primary (dark), see commit
          ctx.fill()
        }
      }
    }

    let queued = false
    function requestDraw() {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        draw()
      })
    }

    function onPointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
        mouseRef.current = null
      } else {
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      }
      requestDraw()
    }
    function onPointerLeave() {
      mouseRef.current = null
      requestDraw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
