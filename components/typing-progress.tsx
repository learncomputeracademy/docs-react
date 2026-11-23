'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Download, Keyboard } from 'lucide-react'
import Link from '@/components/hover-link'
import { onLearningChange, type TypingData } from '@/lib/progress'
import { LESSONS } from '@/lib/typing-test-lessons'
import { localDay } from '@/lib/typing-test-engine'
import type { Locale } from '@/lib/types'

// Typing test section of /progress (2026-11-23, monkeytype-style rework):
// all-time totals, personal bests, a 12-month activity heatmap, WPM over
// time, WPM distribution, and the results table. Reads the typing test's own
// browser stores (synced to the account for signed-in learners). Charts are
// hand-drawn SVG, no chart library.

const KEYS = ['typing-test-history-v1', 'typing-test-lesson-progress-v1', 'typing-test-weak-keys-v1', 'typing-test-daily-v1'] as const

function readRaw(): string {
  try {
    return KEYS.map((k) => localStorage.getItem(k) ?? '').join('\u0000')
  } catch {
    return ''
  }
}

function parse<T>(raw: string, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function subscribe(l: () => void) {
  const off = onLearningChange(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key && (KEYS as readonly string[]).includes(e.key)) l()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    off()
    window.removeEventListener('storage', onStorage)
  }
}

type H = TypingData['history'][number]

// Older results (before 2026-11-23) have no duration; the label gives it for timed tests.
const secsOf = (h: H): number | null => h.secs ?? (/^(\d+)s$/.exec(h.label) ? Number(/^(\d+)s$/.exec(h.label)![1]) : null)

const T = {
  en: {
    title: 'Typing test',
    started: 'Tests started',
    completed: 'Tests completed',
    time: 'Time typing',
    words: 'Estimated words typed',
    pbs: 'Personal bests',
    time_: 'seconds',
    words_: 'words',
    activity: 'Activity',
    lastYear: 'last 12 months',
    testsIn: (n: number) => `${n} test${n === 1 ? '' : 's'}`,
    less: 'less',
    more: 'more',
    overTime: 'Speed over time',
    avg10: 'Average of 10',
    each: 'Each test',
    best: 'Personal best',
    dist: 'Speed distribution',
    testsAxis: 'tests',
    highest: 'highest',
    average: 'average',
    last10: 'last 10',
    wpm: 'WPM',
    raw: 'raw WPM',
    acc: 'accuracy',
    cons: 'consistency',
    results: 'Results',
    chars: 'chars',
    mode: 'test',
    date: 'date',
    showMore: 'Show more',
    csv: 'Export CSV',
    lessons: 'Typing lessons',
    weak: 'Keys you miss most',
    empty: 'No typing tests yet. Your speed, accuracy and a calendar of your practice will show up here.',
    start: 'Take a typing test',
    openLessons: 'Open typing lessons',
    restarts: (n: number) => `${n} restart${n === 1 ? '' : 's'} per completed test`,
    gain: (v: string) => `Change over your tests so far: ${v} WPM`,
    noRaw: 'Raw WPM, characters and time are saved for tests from 23 Nov 2026 on.',
  },
  bn: {
    title: 'টাইপিং টেস্ট',
    started: 'শুরু করা টেস্ট',
    completed: 'শেষ করা টেস্ট',
    time: 'টাইপিংয়ের সময়',
    words: 'আনুমানিক টাইপ করা শব্দ',
    pbs: 'ব্যক্তিগত সেরা',
    time_: 'সেকেন্ড',
    words_: 'শব্দ',
    activity: 'অনুশীলন',
    lastYear: 'গত ১২ মাস',
    testsIn: (n: number) => `${n}টি টেস্ট`,
    less: 'কম',
    more: 'বেশি',
    overTime: 'সময়ের সঙ্গে গতি',
    avg10: '১০টির গড়',
    each: 'প্রতিটি টেস্ট',
    best: 'ব্যক্তিগত সেরা',
    dist: 'গতির বণ্টন',
    testsAxis: 'টেস্ট',
    highest: 'সর্বোচ্চ',
    average: 'গড়',
    last10: 'শেষ ১০টি',
    wpm: 'WPM',
    raw: 'raw WPM',
    acc: 'নির্ভুলতা',
    cons: 'ধারাবাহিকতা',
    results: 'ফলাফল',
    chars: 'অক্ষর',
    mode: 'টেস্ট',
    date: 'তারিখ',
    showMore: 'আরও দেখুন',
    csv: 'CSV ডাউনলোড',
    lessons: 'টাইপিং পাঠ',
    weak: 'যে কী-গুলো বেশি ভুল হয়',
    empty: 'এখনও কোনো টাইপিং টেস্ট দেননি। আপনার গতি, নির্ভুলতা আর অনুশীলনের ক্যালেন্ডার এখানে দেখা যাবে।',
    start: 'টাইপিং টেস্ট দিন',
    openLessons: 'টাইপিং পাঠ খুলুন',
    restarts: (n: number) => `প্রতি শেষ করা টেস্টে ${n} বার নতুন করে শুরু`,
    gain: (v: string) => `এখন পর্যন্ত টেস্টে পরিবর্তন: ${v} WPM`,
    noRaw: 'Raw WPM, অক্ষর আর সময় ২৩ নভেম্বর ২০২৬ থেকে দেওয়া টেস্টের জন্য সেভ হয়।',
  },
} as const

type S = (typeof T)[keyof typeof T]

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
const fmtHms = (secs: number) => {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.round(secs % 60)
  return [h, m, s].map((x) => String(x).padStart(2, '0')).join(':')
}

export function TypingProgress({ locale }: { locale: Locale }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '')
  const s = T[locale]
  const prefix = locale === 'bn' ? '/bn' : ''
  const intl = locale === 'bn' ? 'bn-IN' : 'en-IN'

  const data = useMemo(() => {
    const [h, l, w, d] = raw.split('\u0000')
    const history = parse<H[]>(h ?? '', [])
    const lessons = parse<TypingData['lessons']>(l ?? '', {})
    const weak = parse<TypingData['weakKeys']>(w ?? '', {})
    const stored = parse<TypingData['daily']>(d ?? '', {})

    // Days before per-day totals existed: rebuilt from the saved results.
    const daily: TypingData['daily'] = { ...stored }
    for (const x of history) {
      const day = localDay(x.date)
      if (stored[day]) continue
      const cur = daily[day] ?? { tests: 0, secs: 0, started: 0 }
      daily[day] = { tests: cur.tests + 1, secs: cur.secs + (secsOf(x) ?? 0), started: cur.started + 1 }
    }
    const days = Object.values(daily)
    const completed = Math.max(history.length, days.reduce((a, x) => a + x.tests, 0))
    const started = Math.max(completed, days.reduce((a, x) => a + x.started, 0))
    const secs = days.reduce((a, x) => a + x.secs, 0)
    const words = Math.round(history.reduce((a, x) => a + (secsOf(x) ? (x.wpm * secsOf(x)!) / 60 : 0), 0))

    const pb = (label: string) => {
      const m = history.filter((x) => x.label === label)
      if (!m.length) return null
      return m.reduce((a, b) => (b.wpm > a.wpm ? b : a))
    }
    const last10 = history.slice(0, 10)
    const withRaw = history.filter((x) => x.raw != null)
    const metric = (xs: H[], f: (x: H) => number) => ({
      high: xs.length ? Math.max(...xs.map(f)) : null,
      avg: xs.length ? avg(xs.map(f)) : null,
      last10: xs.length ? avg(xs.slice(0, 10).map(f)) : null,
    })

    return {
      history,
      daily,
      completed,
      started,
      secs,
      words,
      timePbs: [15, 30, 60, 120].map((n) => ({ n, r: pb(`${n}s`) })),
      wordPbs: [10, 25, 50, 100].map((n) => ({ n, r: pb(`${n}w`) })),
      stats: {
        wpm: metric(history, (x) => x.wpm),
        raw: metric(withRaw, (x) => x.raw!),
        acc: metric(history, (x) => x.accuracy),
        cons: metric(history, (x) => x.consistency),
      },
      hasLast10: last10.length > 0,
      lessonsDone: LESSONS.filter((x) => lessons[x.id]?.completed).length,
      weakKeys: Object.entries(weak)
        .filter(([k]) => k.trim())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8),
    }
  }, [raw])

  const heading = (
    <h2 className="flex items-center gap-2 text-lg font-semibold">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Keyboard className="size-4.5" aria-hidden />
      </span>
      {s.title}
    </h2>
  )

  if (data.history.length === 0 && data.lessonsDone === 0) {
    return (
      <section>
        {heading}
        <div className="mt-4 rounded-2xl border border-dashed bg-card/50 p-6">
          <p className="text-sm text-muted-foreground">{s.empty}</p>
          <Link href={`${prefix}/typing-test`} className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
            {s.start}
          </Link>
        </div>
      </section>
    )
  }

  const restarts = data.completed ? (data.started - data.completed) / data.completed : 0
  const st = data.stats
  const n0 = (v: number | null, suffix = '') => (v == null ? '–' : `${Math.round(v)}${suffix}`)

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        {heading}
        <Link href={`${prefix}/typing-test`} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          {s.start} →
        </Link>
      </div>

      {/* Totals */}
      <div className="grid gap-3 rounded-2xl border bg-card p-5 sm:grid-cols-4">
        <Big label={s.started} value={String(data.started)} />
        <Big label={s.completed} value={`${data.completed}`} note={data.started > data.completed ? s.restarts(Math.round(restarts * 10) / 10) : undefined} />
        <Big label={s.time} value={fmtHms(data.secs)} />
        <Big label={s.words} value={data.words.toLocaleString(intl)} />
      </div>

      {/* Personal bests */}
      <div className="grid gap-3 md:grid-cols-2">
        {[
          { unit: s.time_, items: data.timePbs },
          { unit: s.words_, items: data.wordPbs },
        ].map((g) => (
          <div key={g.unit} className="grid grid-cols-4 gap-2 rounded-2xl border bg-card p-4 text-center">
            {g.items.map(({ n, r }) => (
              <div key={n}>
                <p className="text-xs text-muted-foreground">
                  {n} {g.unit}
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular-nums sm:text-3xl">{r ? r.wpm : '–'}</p>
                <p className="font-mono text-xs text-muted-foreground tabular-nums">{r ? `${r.accuracy}%` : '–'}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Heatmap daily={data.daily} s={s} intl={intl} />

      <WpmChart history={data.history} s={s} intl={intl} />

      <div className="grid gap-3 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Histogram history={data.history} s={s} />
        </div>
        <dl className="grid grid-cols-3 gap-x-3 gap-y-4 rounded-2xl border bg-card p-5 lg:col-span-2">
          {[
            { k: s.wpm, m: st.wpm, suf: '' },
            { k: s.raw, m: st.raw, suf: '' },
            { k: s.acc, m: st.acc, suf: '%' },
            { k: s.cons, m: st.cons, suf: '%' },
          ].map(({ k, m, suf }) =>
            [
              { l: `${s.highest} ${k}`, v: n0(m.high, suf) },
              { l: `${s.average} ${k}`, v: n0(m.avg, suf) },
              { l: `${k} (${s.last10})`, v: n0(m.last10, suf) },
            ].map((x) => (
              <div key={x.l}>
                <dt className="text-xs leading-tight text-muted-foreground">{x.l}</dt>
                <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums">{x.v}</dd>
              </div>
            )),
          )}
        </dl>
      </div>

      <ResultsTable history={data.history} s={s} intl={intl} />

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium">{s.lessons}</h3>
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {data.lessonsDone}/{LESSONS.length}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((data.lessonsDone / LESSONS.length) * 100)}%` }} />
          </div>
          <Link href={`${prefix}/typing-test/lessons`} className="mt-3 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline">
            {s.openLessons}
          </Link>
        </div>
        {data.weakKeys.length > 0 && (
          <div className="rounded-2xl border bg-card p-4">
            <h3 className="text-sm font-medium">{s.weak}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {data.weakKeys.map(([k, n]) => (
                <li key={k} className="flex items-center gap-1.5 rounded-md border-b-2 border-primary/40 bg-muted px-2.5 py-1 font-mono text-sm">
                  {k}
                  <span className="text-xs text-muted-foreground tabular-nums">×{n}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function Big({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">{value}</p>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}

// Width of a container, for charts whose text must stay readable on phones
// (a scaled viewBox would shrink the labels).
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

// --- 12-month activity heatmap (GitHub/monkeytype style) ---
const CELL = 11
const GAP = 3
const LEVEL_FILL = ['var(--muted)', 'color-mix(in oklab, var(--primary) 30%, var(--muted))', 'color-mix(in oklab, var(--primary) 55%, var(--muted))', 'color-mix(in oklab, var(--primary) 80%, var(--muted))', 'var(--primary)']
const level = (n: number) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4)

function Heatmap({ daily, s, intl }: { daily: TypingData['daily']; s: S; intl: string }) {
  const { weeks, months, total } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(today)
    start.setDate(start.getDate() - 52 * 7 - ((today.getDay() + 6) % 7)) // a Monday, 53 columns back
    const weeks: { day: string; date: Date; n: number; secs: number; future: boolean }[][] = []
    const months: { col: number; label: string }[] = []
    let total = 0
    for (let c = 0; c < 53; c++) {
      const col = []
      for (let r = 0; r < 7; r++) {
        const date = new Date(start)
        date.setDate(start.getDate() + c * 7 + r)
        const day = localDay(date.getTime())
        const v = daily[day]
        const future = date > today
        if (v && !future) total += v.tests
        col.push({ day, date, n: v?.tests ?? 0, secs: v?.secs ?? 0, future })
        if (date.getDate() === 1 && !future) months.push({ col: c, label: date.toLocaleDateString(intl, { month: 'short' }) })
      }
      weeks.push(col)
    }
    return { weeks, months, total }
  }, [daily, intl])

  const W = 30 + 53 * (CELL + GAP)
  const Hh = 18 + 7 * (CELL + GAP)
  const dayLabel = (r: number) => new Date(2024, 0, 1 + r).toLocaleDateString(intl, { weekday: 'short' }) // 1 Jan 2024 = Monday

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium">
          {s.activity} <span className="font-normal text-muted-foreground">· {s.lastYear} · {s.testsIn(total)}</span>
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {s.less}
          {LEVEL_FILL.map((f) => (
            <span key={f} className="size-2.5 rounded-[3px]" style={{ background: f }} />
          ))}
          {s.more}
        </div>
      </div>
      {/* Scrolls sideways on phones; starts scrolled to the newest week. */}
      <div className="mt-3 overflow-x-auto" ref={(el) => { if (el) el.scrollLeft = el.scrollWidth }}>
        <svg width={W} height={Hh} role="img" style={{ marginInline: "auto" }} aria-label={`${s.activity}: ${s.testsIn(total)}, ${s.lastYear}`} className="block">
          {months.map((m) => (
            <text key={`${m.col}-${m.label}`} x={30 + m.col * (CELL + GAP)} y={10} className="fill-muted-foreground text-xs">
              {m.label}
            </text>
          ))}
          {[0, 2, 4].map((r) => (
            <text key={r} x={0} y={18 + r * (CELL + GAP) + CELL - 2} className="fill-muted-foreground text-xs">
              {dayLabel(r)}
            </text>
          ))}
          {weeks.map((col, c) =>
            col.map((d, r) =>
              d.future ? null : (
                <rect key={d.day} x={30 + c * (CELL + GAP)} y={18 + r * (CELL + GAP)} width={CELL} height={CELL} rx={2.5} fill={LEVEL_FILL[level(d.n)]}>
                  <title>{`${d.date.toLocaleDateString(intl, { day: 'numeric', month: 'short', year: 'numeric' })}: ${s.testsIn(d.n)}${d.secs ? `, ${Math.round(d.secs / 60)} min` : ''}`}</title>
                </rect>
              ),
            ),
          )}
        </svg>
      </div>
    </div>
  )
}

// --- WPM over time: each test as a dot, average of 10 as the line, PB as a step ---
function WpmChart({ history, s, intl }: { history: H[]; s: S; intl: string }) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const pts = useMemo(() => [...history].reverse(), [history]) // oldest first
  const avg10 = useMemo(() => pts.map((_, i) => avg(pts.slice(Math.max(0, i - 9), i + 1).map((p) => p.wpm))), [pts])
  const pb = useMemo(() => {
    const out: number[] = []
    for (const p of pts) out.push(Math.max(out.at(-1) ?? 0, p.wpm))
    return out
  }, [pts])

  const H = 220
  const pad = { l: 34, r: 10, t: 10, b: 22 }
  const maxY = Math.max(10, Math.ceil(Math.max(...pts.map((p) => p.wpm), 0) / 10) * 10)
  const iw = Math.max(1, w - pad.l - pad.r)
  const ih = H - pad.t - pad.b
  const x = (i: number) => pad.l + (pts.length < 2 ? iw / 2 : (i / (pts.length - 1)) * iw)
  const y = (v: number) => pad.t + ih - (v / maxY) * ih
  const line = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  const step = pb.map((v, i) => `${i ? `H${x(i).toFixed(1)}V` : `M${x(i).toFixed(1)},`}${y(v).toFixed(1)}`).join('')
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((maxY / 4) * i))
  const gain = pts.length >= 10 ? avg(pts.slice(-5).map((p) => p.wpm)) - avg(pts.slice(0, 5).map((p) => p.wpm)) : null

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - r.left
    const i = pts.length < 2 ? 0 : Math.round(((px - pad.l) / iw) * (pts.length - 1))
    setHover(Math.min(pts.length - 1, Math.max(0, i)))
  }
  const hp = hover != null ? pts[hover] : null

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium">{s.overTime}</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary/40" />{s.each}</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-primary" />{s.avg10}</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-foreground/35" />{s.best}</span>
        </div>
      </div>
      <div ref={ref} className="relative mt-3">
        {w > 0 && (
          <svg width={w} height={H} className="block touch-pan-y" onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label={s.overTime}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} className="stroke-border" strokeDasharray={t ? '2 4' : undefined} />
                <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" className="fill-muted-foreground font-mono text-xs">{t}</text>
              </g>
            ))}
            <path d={step} fill="none" className="stroke-foreground/35" strokeWidth={1.5} />
            {pts.map((p, i) => (
              <circle key={i} cx={x(i)} cy={y(p.wpm)} r={pts.length > 120 ? 2 : 3} className="fill-primary/35" />
            ))}
            <path d={line(avg10)} fill="none" className="stroke-primary" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {hp && (
              <g>
                <line x1={x(hover!)} x2={x(hover!)} y1={pad.t} y2={pad.t + ih} className="stroke-foreground/30" />
                <circle cx={x(hover!)} cy={y(hp.wpm)} r={5} className="fill-primary stroke-card" strokeWidth={2} />
              </g>
            )}
          </svg>
        )}
        {hp && (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg"
            style={x(hover!) > w / 2 ? { right: w - x(hover!) + 10 } : { left: x(hover!) + 10 }}
          >
            <p className="font-mono text-base font-semibold">{hp.wpm} <span className="text-xs font-normal text-muted-foreground">{s.wpm}</span></p>
            <p className="text-muted-foreground">{hp.accuracy}% {s.acc} · {hp.label}</p>
            <p className="text-muted-foreground">{s.avg10}: {Math.round(avg10[hover!])}</p>
            <p className="text-muted-foreground">{new Date(hp.date).toLocaleString(intl, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        )}
      </div>
      {gain != null && <p className="mt-2 text-center text-xs text-muted-foreground">{s.gain(`${gain >= 0 ? '+' : ''}${gain.toFixed(1)}`)}</p>}
    </div>
  )
}

// --- How many tests landed in each 10-WPM band ---
function Histogram({ history, s }: { history: H[]; s: S }) {
  const buckets = useMemo(() => {
    const top = Math.max(0, ...history.map((h) => Math.floor(h.wpm / 10)))
    const b = Array.from({ length: top + 1 }, (_, i) => ({ from: i * 10, n: 0 }))
    for (const h of history) b[Math.floor(h.wpm / 10)].n++
    return b
  }, [history])
  const max = Math.max(1, ...buckets.map((b) => b.n))
  return (
    <div className="h-full rounded-2xl border bg-card p-4 sm:p-5">
      <h3 className="text-sm font-medium">{s.dist}</h3>
      <div className="mt-4 flex h-40 items-end gap-1.5">
        {buckets.map((b) => (
          <div key={b.from} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" title={`${b.from}-${b.from + 9} ${s.wpm}: ${s.testsIn(b.n)}`}>
            <span className="font-mono text-xs text-muted-foreground opacity-0 transition group-hover:opacity-100">{b.n || ''}</span>
            <div className="w-full rounded-t-[4px] bg-primary/80 transition group-hover:bg-primary" style={{ height: `${(b.n / max) * 100}%`, minHeight: b.n ? 3 : 0 }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5 border-t pt-1.5">
        {buckets.map((b) => (
          <span key={b.from} className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground">
            {b.from}
          </span>
        ))}
      </div>
    </div>
  )
}

// --- Results table with CSV export ---
function ResultsTable({ history, s, intl }: { history: H[]; s: S; intl: string }) {
  const [shown, setShown] = useState(10)
  const exportCsv = () => {
    const rows = [['date', 'test', 'wpm', 'raw_wpm', 'accuracy', 'consistency', 'seconds', 'correct', 'incorrect', 'extra', 'missed']]
    for (const h of history) rows.push([new Date(h.date).toISOString(), h.label, h.wpm, h.raw ?? '', h.accuracy, h.consistency, secsOf(h) ?? '', ...(h.chars ?? ['', '', '', ''])].map(String))
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'typing-results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  const hasNew = history.some((h) => h.raw != null)
  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">{s.results}</h3>
        <button type="button" onClick={exportCsv} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium hover:bg-muted">
          <Download className="size-3.5" aria-hidden />
          {s.csv}
        </button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              {[s.wpm, s.raw, s.acc, s.cons, s.chars, s.mode, s.date].map((h) => (
                <th key={h} className="px-2 pb-2 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {history.slice(0, shown).map((h) => (
              <tr key={`${h.date}-${h.wpm}`} className="odd:bg-muted/50">
                <td className="rounded-l-md px-2 py-2 font-semibold">{h.wpm}</td>
                <td className="px-2 py-2">{h.raw ?? '–'}</td>
                <td className="px-2 py-2">{h.accuracy}%</td>
                <td className="px-2 py-2">{h.consistency}%</td>
                <td className="px-2 py-2 text-muted-foreground">{h.chars ? h.chars.join('/') : '–'}</td>
                <td className="px-2 py-2">{h.label}</td>
                <td className="rounded-r-md px-2 py-2 text-muted-foreground">
                  {new Date(h.date).toLocaleDateString(intl, { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                  <span className="text-xs">{new Date(h.date).toLocaleTimeString(intl, { hour: '2-digit', minute: '2-digit' })}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shown < history.length && (
        <button type="button" onClick={() => setShown((n) => n + 20)} className="mt-3 min-h-10 w-full rounded-lg bg-muted text-sm font-medium hover:bg-muted/70">
          {s.showMore}
        </button>
      )}
      {!hasNew && history.length > 0 && <p className="mt-3 text-xs text-muted-foreground">{s.noRaw}</p>}
    </div>
  )
}
