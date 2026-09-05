'use client'

import { useRef, useState } from 'react'

// Single-series line chart — WPM sampled over the run. Per the dataviz
// skill: one series needs no legend (the section title names it), thin 2px
// line with rounded data-ends, recessive grid, and a hover crosshair since
// this is an interactive SVG, not a bare stat tile. Color comes from the
// site's own `--primary` token via `currentColor` + `text-primary`, not a
// new hardcoded hex — consistent with every other tool's chrome and
// automatically correct in both light and dark mode without a separate
// palette to validate.
export function WpmGraph({ samples, label }: { samples: { t: number; wpm: number }[]; label: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  if (samples.length < 2) {
    return <p className="text-sm text-muted-foreground">—</p>
  }

  const width = 600
  const height = 180
  const padding = 24
  const maxT = Math.max(...samples.map((s) => s.t))
  const maxWpm = Math.max(...samples.map((s) => s.wpm), 10)

  const x = (t: number) => padding + (t / maxT) * (width - padding * 2)
  const y = (wpm: number) => height - padding - (wpm / maxWpm) * (height - padding * 2)

  const points = samples.map((s) => `${x(s.t)},${y(s.wpm)}`).join(' ')
  const areaPoints = `${x(0)},${height - padding} ${points} ${x(maxT)},${height - padding}`

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxWpm * f))

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * width
    let nearest = 0
    let bestDist = Infinity
    samples.forEach((s, i) => {
      const dist = Math.abs(x(s.t) - px)
      if (dist < bestDist) { bestDist = dist; nearest = i }
    })
    setHoverIdx(nearest)
  }

  const hover = hoverIdx !== null ? samples[hoverIdx] : null

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full text-primary"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {gridLines.map((g) => (
          <g key={g}>
            <line x1={padding} y1={y(g)} x2={width - padding} y2={y(g)} className="stroke-muted-foreground/15" strokeWidth={1} />
            <text x={2} y={y(g) + 3} className="fill-muted-foreground text-[9px]">{g}</text>
          </g>
        ))}

        <polygon points={areaPoints} className="fill-primary/10" />
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {hover && (
          <>
            <line x1={x(hover.t)} y1={padding} x2={x(hover.t)} y2={height - padding} className="stroke-muted-foreground/30" strokeWidth={1} />
            <circle cx={x(hover.t)} cy={y(hover.wpm)} r={4} fill="currentColor" className="text-primary" />
          </>
        )}
      </svg>
      {hover && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2 py-1 text-xs shadow-sm"
          style={{ left: `${(x(hover.t) / width) * 100}%`, top: `${(y(hover.wpm) / height) * 100}%` }}
        >
          {hover.wpm} {label} · {hover.t}s
        </div>
      )}
    </div>
  )
}
