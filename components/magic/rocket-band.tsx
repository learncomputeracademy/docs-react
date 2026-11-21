import { ArrowRight } from 'lucide-react'
import SpecularButton from './specular-button'

// Homepage "from the team behind" band (2026-11-21, owner references: a
// space card with a rocket on the left). All art is inline SVG and all motion
// is CSS (rocket-* keyframes in globals.css) — no JS, no images, nothing to
// load. Dark card with the site's orange accent (owner's 2nd reference), the
// same in both themes, like a poster.
// Motion: the rocket hovers, its flame flickers, exhaust clouds drift, embers
// glow; on hover the rocket lifts a little further. prefers-reduced-motion
// turns all of it off.
export function RocketBand({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className="group relative isolate overflow-hidden rounded-2xl border border-orange-500/30 bg-[radial-gradient(110%_160%_at_12%_60%,#4a1d06_0%,#1d0d05_45%,#0c0806_100%)] shadow-[0_0_60px_-24px_rgba(249,115,22,0.6)]">
      {/* Embers */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full" preserveAspectRatio="none">
        {STARS.map(([x, y, r, d], i) => (
          <circle key={i} cx={`${x}%`} cy={`${y}%`} r={r * 1.1} fill={i % 3 ? '#fdba74' : '#fb923c'} className="rocket-twinkle" style={{ animationDelay: `${d}s` }} />
        ))}
      </svg>
      {/* Soft glow behind the rocket */}
      <div aria-hidden className="pointer-events-none absolute -left-16 top-1/2 -z-10 size-72 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl" />

      {/* Diagonal light streak on the right */}
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 -z-10 h-[220%] w-24 rotate-[35deg] bg-gradient-to-b from-transparent via-orange-500/50 to-transparent blur-md" />
      <div aria-hidden className="pointer-events-none absolute -right-2 -top-10 -z-10 h-[220%] w-3 rotate-[35deg] bg-gradient-to-b from-transparent via-orange-300/60 to-transparent blur-[2px]" />
      <div className="flex flex-col items-center gap-6 px-6 py-8 text-center sm:flex-row sm:gap-8 sm:py-6 sm:pl-4 sm:pr-8 sm:text-left">
        <Rocket />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-orange-50/70">{body}</p>
        </div>
        <SpecularButton
          href="https://learncomputer.in"
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          radius={999}
          tint="#f97316"
          tintOpacity={1}
          textColor="#1c0a00"
          lineColor="#fff7ed"
          baseColor="#c2410c"
          intensity={1.5}
          idleIntensity={0.6}
          thickness={1.6}
          className="rocket-cta min-h-11 w-full shrink-0 font-semibold shadow-[0_0_24px_-6px_#f97316] sm:w-auto"
        >
          {cta}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </SpecularButton>
      </div>
    </div>
  )
}

function Rocket() {
  return (
    <div aria-hidden className="relative -my-2 h-32 w-48 shrink-0 sm:h-36 sm:w-56">
      {/* Exhaust clouds, over a soft haze so they read as smoke, not balls */}
      <div className="absolute inset-0">
        <span className="absolute -left-6 bottom-0 h-20 w-36 rounded-full bg-orange-600/45 blur-xl" />
        {CLOUDS.map(([l, b, s, c, d], i) => (
          <span
            key={i}
            className="rocket-cloud absolute rounded-full opacity-90 blur-[4px]"
            style={{ left: `${l}%`, bottom: `${b}%`, width: s, height: s, background: c, animationDelay: `${d}s` }}
          />
        ))}
      </div>
      {/* The rocket, tilted up and to the right */}
      <div className="rocket-hover absolute left-[34%] top-[-4%] w-[60%] transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:translate-x-2">
        <svg viewBox="0 0 120 120" className="w-full overflow-visible">
          <defs>
            <linearGradient id="rb-body" x1="0" x2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#efebe7" />
              <stop offset="1" stopColor="#c9c3bd" />
            </linearGradient>
            <linearGradient id="rb-fin" x1="0" x2="1">
              <stop offset="0" stopColor="#ff8a2b" />
              <stop offset="1" stopColor="#c2410c" />
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
          {/* Rotated in SVG space (not a CSS rotate + filter on the animated layer, which rasterised it soft). */}
          <g transform="rotate(45 60 60)">
          {/* Flame */}
          <g className="rocket-flame" style={{ transformBox: 'fill-box', transformOrigin: '50% 0%' }}>
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
          <circle cx="60" cy="52" r="11" fill="#e5ddd6" />
          <circle cx="60" cy="52" r="8" fill="url(#rb-window)" />
          <circle cx="57" cy="49" r="2.4" fill="#fff" opacity="0.8" />
          {/* Centre fin + exhaust ring */}
          <path d="M58 72 L62 72 L62 94 L58 94 Z" fill="url(#rb-fin)" />
          <rect x="45" y="89" width="30" height="5" rx="2" fill="#8a7d72" />
          </g>
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
  [26, 26, 40, 'radial-gradient(circle at 35% 30%, #ffedd5, #f97316 75%)', 0.4],
  [14, 12, 56, 'radial-gradient(circle at 35% 30%, #fed7aa, #ea580c 75%)', 0],
  [-6, 2, 64, 'radial-gradient(circle at 35% 30%, #fdba74, #9a3412 78%)', 1.2],
  [30, 4, 44, 'radial-gradient(circle at 35% 30%, #fde68a, #f97316 75%)', 0.8],
  [4, 30, 38, 'radial-gradient(circle at 35% 30%, #fed7aa, #c2410c 78%)', 1.8],
  [-10, 30, 46, 'radial-gradient(circle at 35% 30%, #fb923c, #7c2d12 80%)', 2.4],
  [40, 18, 26, 'radial-gradient(circle at 35% 30%, #fff7ed, #fb923c 75%)', 1.5],
]
