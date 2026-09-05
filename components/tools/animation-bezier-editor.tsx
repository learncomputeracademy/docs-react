'use client'

import { useEffect, useRef, useState } from 'react'
import { parseBezier } from '@/lib/animation'

const SIZE = 200
const PAD = 20
const Y_MIN = -0.6
const Y_MAX = 1.6

function toPx(x: number, y: number) {
  return {
    px: PAD + x * (SIZE - 2 * PAD),
    py: PAD + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * (SIZE - 2 * PAD),
  }
}
function fromPx(px: number, py: number) {
  const x = (px - PAD) / (SIZE - 2 * PAD)
  const y = Y_MAX - ((py - PAD) / (SIZE - 2 * PAD)) * (Y_MAX - Y_MIN)
  return { x: Math.min(1, Math.max(0, x)), y: Math.min(2, Math.max(-1, y)) }
}

// A real, draggable cubic-bezier(x1,y1,x2,y2) editor — the curve math is
// exact by spec (see lib/animation.ts's comment), but "does it actually feel
// like that" is answered by the small dot below the curve, which is driven
// by the real Web Animations API on a loop using the live value, not a CSS
// transition simulated by re-reading the curve's own math (house rule 4).
export function BezierEditor({ value, onChange }: { value: string; onChange: (css: string) => void }) {
  const [x1, y1, x2, y2] = parseBezier(value)
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const dotAnimRef = useRef<Animation | null>(null)

  useEffect(() => {
    const el = dotRef.current
    if (!el) return
    dotAnimRef.current?.cancel()
    dotAnimRef.current = el.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(152px)' }],
      { duration: 1400, easing: `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`, iterations: Infinity, direction: 'alternate' }
    )
    return () => dotAnimRef.current?.cancel()
  }, [x1, y1, x2, y2])

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const { x, y } = fromPx(e.clientX - rect.left, e.clientY - rect.top)
    const round = (n: number) => Math.round(n * 100) / 100
    if (dragging === 'p1') onChange(`cubic-bezier(${round(x)}, ${round(y)}, ${x2}, ${y2})`)
    else onChange(`cubic-bezier(${x1}, ${y1}, ${round(x)}, ${round(y)})`)
  }

  const p0 = toPx(0, 0), p1 = toPx(x1, y1), p2 = toPx(x2, y2), p3 = toPx(1, 1)
  const zero = toPx(0, 0).py, one = toPx(0, 1).py

  return (
    <div className="space-y-2">
      <svg
        width={SIZE}
        height={SIZE}
        className="rounded-md border bg-muted/20 touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragging(null)}
      >
        <line x1={PAD} y1={zero} x2={SIZE - PAD} y2={zero} className="stroke-border" strokeWidth={1} />
        <line x1={PAD} y1={one} x2={SIZE - PAD} y2={one} className="stroke-border" strokeWidth={1} />
        <line x1={p0.px} y1={p0.py} x2={p3.px} y2={p3.py} className="stroke-border" strokeDasharray="3 3" strokeWidth={1} />
        <line x1={p0.px} y1={p0.py} x2={p1.px} y2={p1.py} stroke="currentColor" className="text-primary/40" strokeWidth={1.5} />
        <line x1={p3.px} y1={p3.py} x2={p2.px} y2={p2.py} stroke="currentColor" className="text-primary/40" strokeWidth={1.5} />
        <path d={`M ${p0.px} ${p0.py} C ${p1.px} ${p1.py} ${p2.px} ${p2.py} ${p3.px} ${p3.py}`} fill="none" stroke="currentColor" className="text-primary" strokeWidth={2} />
        <circle
          cx={p1.px} cy={p1.py} r={7}
          className="fill-primary cursor-grab stroke-background"
          strokeWidth={2}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging('p1') }}
        />
        <circle
          cx={p2.px} cy={p2.py} r={7}
          className="fill-primary cursor-grab stroke-background"
          strokeWidth={2}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging('p2') }}
        />
      </svg>
      <div className="h-6 w-44 overflow-hidden">
        <div ref={dotRef} className="size-6 rounded-full bg-primary" />
      </div>
      <p className="font-mono text-xs text-muted-foreground">{`cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`}</p>
    </div>
  )
}
