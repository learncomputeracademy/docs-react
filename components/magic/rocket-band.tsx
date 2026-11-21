import { ArrowRight } from 'lucide-react'

// Homepage "from the team behind" band (2026-11-21, owner reference: a purple
// space card with a rocket on the left). All art is inline SVG and all motion
// is CSS (rocket-* keyframes in globals.css) — no JS, no images, nothing to
// load. The card is deliberately dark purple in both themes, like a poster.
// Motion: the rocket hovers, its flame flickers, exhaust clouds drift, stars
// twinkle; on hover the rocket lifts a little further. prefers-reduced-motion
// turns all of it off.
export function RocketBand({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className="group relative isolate overflow-hidden rounded-2xl border border-violet-400/25 bg-[radial-gradient(120%_140%_at_15%_50%,#3b1a78_0%,#1e1240_45%,#0f0a24_100%)] shadow-[0_0_60px_-20px_rgba(139,92,246,0.55)]">
      {/* Stars */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full" preserveAspectRatio="none">
        {STARS.map(([x, y, r, d], i) => (
          <circle key={i} cx={`${x}%`} cy={`${y}%`} r={r} fill="#fff" className="rocket-twinkle" style={{ animationDelay: `${d}s` }} />
        ))}
      </svg>
      {/* Soft glow behind the rocket */}
      <div aria-hidden className="pointer-events-none absolute -left-16 top-1/2 -z-10 size-72 -translate-y-1/2 rounded-full bg-fuchsia-500/25 blur-3xl" />

      <div className="flex flex-col items-center gap-6 px-6 py-8 text-center sm:flex-row sm:gap-8 sm:py-6 sm:pl-4 sm:pr-8 sm:text-left">
        <Rocket />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-violet-100/75">{body}</p>
        </div>
        <a
          href="https://learncomputer.in"
          target="_blank"
          rel="noopener noreferrer"
          className="rocket-cta inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(168,85,247,0.8)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_-2px_rgba(192,132,252,0.95)] sm:w-auto"
        >
          {cta}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  )
}

function Rocket() {
  return (
    <div aria-hidden className="relative -my-2 h-32 w-48 shrink-0 sm:h-36 sm:w-56">
      {/* Exhaust clouds */}
      <div className="absolute inset-0">
        {CLOUDS.map(([l, b, s, c, d], i) => (
          <span
            key={i}
            className="rocket-cloud absolute rounded-full blur-[1.5px]"
            style={{ left: `${l}%`, bottom: `${b}%`, width: s, height: s, background: c, animationDelay: `${d}s` }}
          />
        ))}
      </div>
      {/* The rocket, tilted up and to the right */}
      <div className="rocket-hover absolute left-[34%] top-[-4%] w-[60%] transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:translate-x-2">
        <svg viewBox="0 0 120 120" className="w-full rotate-45 overflow-visible drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]">
          <defs>
            <linearGradient id="rb-body" x1="0" x2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#e6e3f5" />
              <stop offset="1" stopColor="#b9b2d9" />
            </linearGradient>
            <linearGradient id="rb-fin" x1="0" x2="1">
              <stop offset="0" stopColor="#e0457b" />
              <stop offset="1" stopColor="#8b2fc9" />
            </linearGradient>
            <radialGradient id="rb-flame" cx="0.5" cy="0.2" r="0.8">
              <stop offset="0" stopColor="#fff7c2" />
              <stop offset="0.35" stopColor="#ffc24a" />
              <stop offset="0.75" stopColor="#ff6b2c" />
              <stop offset="1" stopColor="#ff6b2c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rb-window" cx="0.35" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#9be7ff" />
              <stop offset="1" stopColor="#2b6fd6" />
            </radialGradient>
          </defs>
          {/* Flame */}
          <g className="rocket-flame" style={{ transformOrigin: '60px 92px' }}>
            <path d="M46 92 Q60 150 74 92 Z" fill="url(#rb-flame)" />
            <path d="M52 92 Q60 126 68 92 Z" fill="#fff4b0" opacity="0.9" />
          </g>
          {/* Fins */}
          <path d="M44 70 L28 92 L46 88 Z" fill="url(#rb-fin)" />
          <path d="M76 70 L92 92 L74 88 Z" fill="url(#rb-fin)" />
          {/* Body */}
          <path d="M60 10 C78 26 82 52 76 92 L44 92 C38 52 42 26 60 10 Z" fill="url(#rb-body)" />
          {/* Nose */}
          <path d="M60 10 C67 16 71 24 73 32 L47 32 C49 24 53 16 60 10 Z" fill="url(#rb-fin)" />
          {/* Window */}
          <circle cx="60" cy="52" r="11" fill="#d7d2ee" />
          <circle cx="60" cy="52" r="8" fill="url(#rb-window)" />
          <circle cx="57" cy="49" r="2.4" fill="#fff" opacity="0.8" />
          {/* Centre fin + exhaust ring */}
          <path d="M58 72 L62 72 L62 94 L58 94 Z" fill="url(#rb-fin)" />
          <rect x="45" y="89" width="30" height="5" rx="2" fill="#7a6fa8" />
        </svg>
      </div>
    </div>
  )
}

// [x%, y%, radius, animation delay s]
const STARS: [number, number, number, number][] = [
  [8, 18, 1, 0], [22, 78, 0.8, 1.2], [34, 12, 1.2, 2.1], [46, 70, 0.7, 0.6], [55, 22, 1, 1.8],
  [63, 84, 0.8, 2.6], [71, 14, 1.1, 0.3], [80, 62, 0.7, 1.5], [88, 28, 1, 2.3], [94, 80, 0.8, 0.9],
  [40, 40, 0.6, 3], [76, 40, 0.6, 1.1],
]

// [left%, bottom%, size px, colour, delay s] — exhaust trailing down-left
const CLOUDS: [number, number, number, string, number][] = [
  [26, 26, 40, 'radial-gradient(circle at 35% 30%, #fbcfe8, #c026d3 75%)', 0.4],
  [14, 12, 56, 'radial-gradient(circle at 35% 30%, #e9d5ff, #8b5cf6 75%)', 0],
  [-6, 2, 64, 'radial-gradient(circle at 35% 30%, #c4b5fd, #6d28d9 75%)', 1.2],
  [30, 4, 44, 'radial-gradient(circle at 35% 30%, #f5d0fe, #a855f7 75%)', 0.8],
  [4, 30, 38, 'radial-gradient(circle at 35% 30%, #ddd6fe, #7c3aed 75%)', 1.8],
  [-10, 30, 46, 'radial-gradient(circle at 35% 30%, #a78bfa, #5b21b6 75%)', 2.4],
  [40, 18, 26, 'radial-gradient(circle at 35% 30%, #fff1f9, #e879f9 75%)', 1.5],
]
