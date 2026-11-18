'use client'

import { useEffect, useId, useState } from 'react'
import { motion } from 'motion/react'
import { BookOpen, Building2, Camera, Clock, Cpu, Folder, Globe, KeyRound, Lock, Mail, Phone, Shuffle, Tv, User, Video, type LucideIcon } from 'lucide-react'
import { route, type Badge, type DeviceKind, type Step, type Topology } from '@/lib/protocols/net'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

// The isometric scene: a floor grid, devices drawn as shaded 3D blocks, a
// camera that glides to whatever the current step is about, and a packet
// that floats along the route. All artwork here is drawn from scratch with
// one helper (`Prism`) — no image assets.

type Pt = { x: number; y: number }
const S = 44 // half a floor tile's width; a tile is 2S wide, S tall
const RATIO = 16 / 9

/** Floor-grid position → screen position. */
const P = (gx: number, gy: number): Pt => ({ x: (gx - gy) * S, y: ((gx + gy) * S) / 2 })
/** A point offset from `c` by (a, b) on the floor and lifted `up` px. */
const O = (c: Pt, a: number, b: number, up = 0): Pt => ({ x: c.x + (a - b) * S, y: c.y + ((a + b) * S) / 2 - up })
const pts = (...p: Pt[]) => p.map((q) => `${q.x},${q.y}`).join(' ')

/** A box standing on the floor: top face plus the two faces turned to the viewer. */
function Prism({ c, w, d, h, z = 0, solid = false }: { c: Pt; w: number; d: number; h: number; z?: number; solid?: boolean }) {
  const at = (a: number, b: number, up: number) => O(c, a, b, z + up)
  const [x0, x1, y0, y1] = [-w / 2, w / 2, -d / 2, d / 2]
  const faces: [string, number][] = [
    [pts(at(x0, y0, h), at(x1, y0, h), at(x1, y1, h), at(x0, y1, h)), solid ? 0.55 : 0.07], // top
    [pts(at(x0, y1, h), at(x1, y1, h), at(x1, y1, 0), at(x0, y1, 0)), solid ? 0.8 : 0.16], // facing left
    [pts(at(x1, y1, h), at(x1, y0, h), at(x1, y0, 0), at(x1, y1, 0)), solid ? 1 : 0.28], // facing right
  ]
  return (
    <>
      {faces.map(([points, shade], i) => (
        <g key={i}>
          <polygon points={points} className="fill-background" />
          <polygon points={points} fill="currentColor" fillOpacity={shade} stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
        </g>
      ))}
    </>
  )
}

/** A flat panel on a prism's left-facing wall (a display, a row of ports). */
function Panel({ c, y, a0, a1, up0, up1, opacity = 0.3 }: { c: Pt; y: number; a0: number; a1: number; up0: number; up1: number; opacity?: number }) {
  return <polygon points={pts(O(c, a0, y, up1), O(c, a1, y, up1), O(c, a1, y, up0), O(c, a0, y, up0))} fill="currentColor" fillOpacity={opacity} />
}

// How far above the floor each device's top is — used to place badges,
// call-outs and to give the camera headroom.
const TOP: Record<DeviceKind, number> = { laptop: 52, phone: 50, router: 46, switch: 16, ap: 34, server: 60, cloud: 62, box: 30 }

function Device({ kind, c, busy, still }: { kind: DeviceKind; c: Pt; busy: boolean; still: boolean }) {
  switch (kind) {
    case 'laptop': {
      const back = O(c, 0, -0.36)
      return (
        <>
          <Prism c={c} w={1} d={0.78} h={5} />
          <polygon points={pts(O(c, -0.36, -0.12, 5), O(c, 0.36, -0.12, 5), O(c, 0.36, 0.2, 5), O(c, -0.36, 0.2, 5))} fill="currentColor" fillOpacity={0.18} />
          <Prism c={back} w={1} d={0.06} h={40} z={5} />
          <Panel c={back} y={0.03} a0={-0.42} a1={0.42} up0={10} up1={40} opacity={busy ? 0.5 : 0.28} />
          {busy && !still && (
            <motion.g initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <Panel c={back} y={0.035} a0={-0.34} a1={0.1} up0={30} up1={33} opacity={0.9} />
              <Panel c={back} y={0.035} a0={-0.34} a1={0.28} up0={23} up1={26} opacity={0.7} />
            </motion.g>
          )}
        </>
      )
    }
    case 'phone': {
      return (
        <>
          <Prism c={c} w={0.44} d={0.08} h={46} />
          <Panel c={c} y={0.04} a0={-0.17} a1={0.17} up0={6} up1={41} opacity={busy ? 0.5 : 0.28} />
        </>
      )
    }
    case 'router': {
      const tip = O(c, 0.34, -0.24, 44)
      return (
        <>
          <Prism c={c} w={0.96} d={0.7} h={13} />
          {[-0.28, -0.12, 0.04].map((a) => {
            const p = O(c, a, 0.35, 6.5)
            return <circle key={a} cx={p.x} cy={p.y} r={2} fill="currentColor" opacity={busy ? 1 : 0.55} />
          })}
          <line x1={O(c, 0.34, -0.24, 13).x} y1={O(c, 0.34, -0.24, 13).y} x2={tip.x} y2={tip.y} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <circle cx={tip.x} cy={tip.y} r={3} fill="currentColor" />
        </>
      )
    }
    case 'switch':
      return (
        <>
          <Prism c={c} w={1.3} d={0.56} h={11} />
          {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((a) => <Panel key={a} c={c} y={0.28} a0={a - 0.06} a1={a + 0.06} up0={3} up1={8} opacity={0.55} />)}
        </>
      )
    case 'ap': {
      const top = O(c, 0, 0, 14)
      return (
        <>
          <Prism c={c} w={0.62} d={0.62} h={7} />
          {[8, 15, 22].map((r, i) => (
            <motion.ellipse key={r} cx={top.x} cy={top.y} rx={r} ry={r / 2} fill="none" stroke="currentColor" strokeWidth={1.4} initial={false} animate={still ? { opacity: 0.5 } : { opacity: [0.15, 0.8, 0.15] }} transition={{ duration: 1.8, delay: i * 0.25, repeat: Infinity }} style={{ translateY: -6 - i * 5 }} />
          ))}
        </>
      )
    }
    case 'server':
      return (
        <>
          <Prism c={c} w={0.72} d={0.72} h={56} />
          {[12, 23, 34, 45].map((up) => {
            const [a, b] = [O(c, -0.26, 0.36, up), O(c, 0.26, 0.36, up)]
            return <line key={up} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" opacity={0.5} />
          })}
          {[14, 25, 36, 47].map((up, i) => {
            const p = O(c, 0.36, 0.2, up)
            return <motion.circle key={up} cx={p.x} cy={p.y} r={1.8} fill="currentColor" initial={false} animate={busy && !still ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.6 }} transition={{ duration: 0.7, delay: i * 0.12, repeat: Infinity }} />
          })}
        </>
      )
    case 'cloud': {
      const o = { x: c.x, y: c.y - 34 }
      const cloud = `M${o.x - 34} ${o.y + 16} a17 17 0 0 1 2 -33 a24 24 0 0 1 45 -5 a19 19 0 0 1 22 38 z`
      return (
        <>
          <ellipse cx={c.x} cy={c.y} rx={44} ry={15} fill="currentColor" opacity={0.1} />
          <motion.g initial={false} animate={still ? undefined : { y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <path d={cloud} transform="translate(5 6)" fill="currentColor" fillOpacity={0.28} stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
            <path d={cloud} className="fill-background" />
            <path d={cloud} fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
            <Globe x={o.x - 9} y={o.y - 12} width={22} height={22} strokeWidth={1.6} />
          </motion.g>
        </>
      )
    }
    default:
      return <Prism c={c} w={0.76} d={0.76} h={26} />
  }
}

const BADGE: Record<Badge, LucideIcon> = {
  dns: BookOpen, web: Globe, mail: Mail, proxy: Shuffle, lock: Lock, camera: Camera, call: Phone, key: KeyRound,
  chip: Cpu, clock: Clock, tv: Tv, files: Folder, user: User, video: Video, isp: Building2,
}

/** Types text out one character at a time, like the device is thinking. */
function Typed({ text, instant }: { text: string; instant: boolean }) {
  const chars = Array.from(text)
  const [n, setN] = useState(instant ? chars.length : 0)
  useEffect(() => {
    if (instant) return
    const id = setInterval(() => setN((k) => (k >= chars.length ? k : k + 1)), 26)
    return () => clearInterval(id)
  }, [instant, chars.length])
  return (
    <>
      {chars.slice(0, n).join('')}
      {n < chars.length && <span className="ml-px inline-block h-3 w-0.5 translate-y-0.5 animate-pulse bg-primary" />}
    </>
  )
}

function along(path: Pt[], p: number): Pt {
  const lens = path.slice(1).map((b, i) => Math.hypot(b.x - path[i].x, b.y - path[i].y))
  let d = p * lens.reduce((a, b) => a + b, 0)
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const k = lens[i] ? d / lens[i] : 0
      return { x: path[i].x + (path[i + 1].x - path[i].x) * k, y: path[i].y + (path[i + 1].y - path[i].y) * k }
    }
    d -= lens[i]
  }
  return path[path.length - 1]
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

/**
 * The travelling packet: a small cube floating above the floor with its
 * shadow on the route. Owns its own requestAnimationFrame clock so only this
 * subtree re-renders per frame.
 */
function PacketFlight({ path, duration, delay, label, lost, lostText, onDone }: { path: Pt[]; duration: number; delay: number; label: string; lost: boolean; lostText: string; onDone: () => void }) {
  const [p, setP] = useState(duration <= 0 ? 1 : 0)

  useEffect(() => {
    if (duration <= 0) { onDone(); return }
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now + delay
      const x = Math.max(0, Math.min(1, (now - start) / duration))
      setP(x)
      if (x < 1) raf = requestAnimationFrame(tick)
      else onDone()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, delay, onDone])

  const e = easeInOut(p)
  const pos = along(path, e)
  const end = path[path.length - 1]
  const done = p >= 1
  // rises out of the sender, cruises, sinks into the receiver
  const lift = 20 * Math.min(1, e * 8, (1 - e) * 8 + (lost ? 1 : 0)) + 6
  const d = path.map((q, i) => `${i ? 'L' : 'M'}${q.x} ${q.y}`).join(' ')
  const text = done && lost ? `${label} · ${lostText}` : label
  const w = Array.from(text).length * 6.6 + 20

  return (
    <g className={lost && done ? 'text-red-500' : 'text-primary'}>
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e} fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" opacity={done ? 0.3 : 0.65} />
      {done && (
        <motion.ellipse cx={end.x} cy={end.y} fill="none" stroke="currentColor" strokeWidth={2} initial={{ rx: 14, ry: 7, opacity: 0.9 }} animate={{ rx: 70, ry: 35, opacity: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      )}
      {done && lost && (
        <motion.g initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ transformOrigin: `${end.x}px ${end.y - 12}px` }} stroke="currentColor" strokeWidth={4} strokeLinecap="round">
          <line x1={end.x - 10} y1={end.y - 22} x2={end.x + 10} y2={end.y - 2} />
          <line x1={end.x + 10} y1={end.y - 22} x2={end.x - 10} y2={end.y - 2} />
        </motion.g>
      )}
      {!(done && lost) && (
        <g opacity={done ? 0 : 1} style={{ transition: 'opacity 220ms' }}>
          <ellipse cx={pos.x} cy={pos.y} rx={10} ry={5} fill="currentColor" opacity={0.25} />
          <Prism c={pos} w={0.24} d={0.24} h={11} z={lift} solid />
        </g>
      )}
      {text && (
        <g transform={`translate(${pos.x} ${pos.y - lift - 30})`} opacity={done && !lost ? 0 : 1} style={{ transition: 'opacity 300ms' }}>
          <rect x={-w / 2} y={-11} width={w} height={22} rx={11} fill="currentColor" />
          <text textAnchor="middle" dominantBaseline="central" className="fill-background font-mono text-[11px] font-semibold">{text}</text>
        </g>
      )}
    </g>
  )
}

/** The viewBox that frames a set of floor points, padded and fitted to the scene's shape. */
function frame(points: Pt[], headroom: number, minWidth: number): string {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  let [x0, x1, y0, y1] = [Math.min(...xs) - 84, Math.max(...xs) + 84, Math.min(...ys) - headroom, Math.max(...ys) + 72]
  const grow = (need: number, a: number, b: number): [number, number] => (b - a >= need ? [a, b] : [(a + b - need) / 2, (a + b + need) / 2])
  ;[x0, x1] = grow(minWidth, x0, x1)
  ;[y0, y1] = grow((x1 - x0) / RATIO, y0, y1)
  ;[x0, x1] = grow((y1 - y0) * RATIO, x0, x1)
  return [x0, y0, x1 - x0, y1 - y0].map((n) => Math.round(n)).join(' ')
}

export function ProtocolScene({ topo, step, sceneKey, runKey, speed, locale, lostText, follow, reduced, arrived, onDone, label }: {
  topo: Topology
  step: Step
  /** Changes when the lesson changes, so devices animate in again. */
  sceneKey: string
  runKey: number
  speed: number
  locale: Locale
  lostText: string
  /** Camera follows the action; off = always show the whole network. */
  follow: boolean
  reduced: boolean
  arrived: boolean
  onDone: () => void
  label: string
}) {
  const gridId = useId()
  const ids = Object.keys(topo.nodes)
  const pos = (id: string) => P(...topo.nodes[id].at)
  const path = step.to ? route(topo, step.from, step.to) : [step.from]
  // a lost packet dies on the way, just past the middle of its route
  const full = path.map(pos)
  const flight = step.lost ? [...full.slice(0, Math.ceil(full.length / 2)), along(full, 0.55)] : full
  const onRoute = (a: string, b: string) => path.some((n, i) => (n === a && path[i + 1] === b) || (n === b && path[i + 1] === a))

  const focus = follow ? path : ids
  const tall = Math.max(...focus.map((id) => TOP[topo.nodes[id].kind]))
  const viewBox = frame(focus.map(pos), tall + (step.to ? 62 : 104), follow && !step.to ? 400 : 480)
  const hops = flight.length - 1
  const duration = reduced ? 0 : (520 + 440 * hops) / speed
  const order = [...ids].sort((a, b) => topo.nodes[a].at[0] + topo.nodes[a].at[1] - (topo.nodes[b].at[0] + topo.nodes[b].at[1]))
  const here = pos(step.from)
  const hereTop = TOP[topo.nodes[step.from].kind]

  return (
    <motion.svg
      viewBox={viewBox}
      initial={false}
      animate={{ viewBox }}
      transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="aspect-video w-full select-none rounded-md bg-muted/30"
      role="img"
      aria-label={label}
    >
      <defs>
        <pattern id={gridId} width={S * 2} height={S} patternUnits="userSpaceOnUse">
          <path d={`M0 ${S / 2} L${S} 0 L${S * 2} ${S / 2} L${S} ${S} Z`} fill="none" className="stroke-foreground/10" strokeWidth={1} />
        </pattern>
      </defs>
      <rect x={-4000} y={-4000} width={8000} height={8000} fill={`url(#${gridId})`} />

      {topo.links.map(([a, b, kind]) => {
        const [p, q] = [pos(a), pos(b)]
        const active = onRoute(a, b)
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            strokeWidth={active ? 2.5 : 2}
            strokeLinecap="round"
            strokeDasharray={kind === 'wireless' ? '2 7' : '7 6'}
            className={cn('transition-colors duration-300', active ? 'stroke-primary/60' : 'stroke-foreground/25')}
            initial={false}
            animate={active && !reduced ? { strokeDashoffset: [0, -26] } : { strokeDashoffset: 0 }}
            transition={active && !reduced ? { duration: 1.1, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
          />
        )
      })}

      {step.broadcast && !arrived && !reduced && (
        <g key={`ripple-${runKey}`} className="text-primary">
          {[0, 1, 2].map((i) => (
            <motion.ellipse key={i} cx={here.x} cy={here.y} fill="none" stroke="currentColor" strokeWidth={1.6} initial={{ rx: 20, ry: 10, opacity: 0.7 }} animate={{ rx: 170, ry: 85, opacity: 0 }} transition={{ duration: 1.7, delay: i * 0.42, repeat: Infinity, ease: 'easeOut' }} />
          ))}
        </g>
      )}

      {order.map((id, i) => {
        const n = topo.nodes[id]
        const c = pos(id)
        const ends = id === step.from || id === step.to
        const busy = !step.to && id === step.from
        const Icon = n.badge ? BADGE[n.badge] : null
        return (
          <motion.g
            key={`${sceneKey}-${id}`}
            initial={reduced ? false : { opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: reduced ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={cn('transition-colors duration-300', ends ? 'text-primary' : 'text-foreground/70')}
          >
            <ellipse cx={c.x} cy={c.y + 4} rx={46} ry={20} fill="currentColor" opacity={ends ? 0.16 : 0.07} className="transition-opacity duration-300" />
            <Device kind={n.kind} c={c} busy={busy} still={reduced} />
            {Icon && (
              <g transform={`translate(${c.x + 30} ${c.y - TOP[n.kind] - 4})`}>
                <circle r={11} className="fill-background" stroke="currentColor" strokeWidth={1.4} />
                <Icon x={-6.5} y={-6.5} width={13} height={13} strokeWidth={2} />
              </g>
            )}
            <text x={c.x} y={c.y + 40} textAnchor="middle" className="fill-foreground text-[12px] font-semibold">{n.label[locale]}</text>
            {n.sub && <text x={c.x} y={c.y + 54} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">{n.sub}</text>}
          </motion.g>
        )
      })}

      {step.to && (
        <PacketFlight key={`flight-${runKey}-${speed}`} path={flight} duration={duration} delay={reduced ? 0 : 320} label={step.label ?? ''} lost={Boolean(step.lost)} lostText={lostText} onDone={onDone} />
      )}

      {!step.to && (
        <motion.g key={`say-${runKey}`} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: reduced ? 0 : 0.35 }} className="text-primary">
          <line x1={here.x} y1={here.y - hereTop - 6} x2={here.x} y2={here.y - hereTop - 26} stroke="currentColor" strokeWidth={1.6} strokeDasharray="3 4" />
          <foreignObject x={here.x - 150} y={here.y - hereTop - 92} width={300} height={66}>
            <div className="flex h-full items-end justify-center">
              <div className="max-w-full rounded-lg border-2 border-primary bg-background px-3 py-1.5 text-center text-xs font-semibold leading-snug text-foreground shadow-md">
                <Typed key={`${runKey}`} text={step.title[locale]} instant={reduced} />
              </div>
            </div>
          </foreignObject>
        </motion.g>
      )}
    </motion.svg>
  )
}
