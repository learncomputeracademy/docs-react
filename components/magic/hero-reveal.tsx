// One-shot entrance for the homepage hero only — per docs/UI.md, motion earns
// its place in chrome/transitions, never in scroll-triggered lesson content.
// Pure CSS (was Framer Motion): a motion.div's `initial` state renders as an
// inline opacity:0 style in the server HTML, so the hero was invisible until
// React hydrated and framer-motion's runtime ran — a JS-hydration-speed
// dependency for content that should just paint. This animates on paint
// instead, no client JS involved, no 'use client' needed either.
export function HeroReveal({ children }: { children: React.ReactNode }) {
  return <div className="animate-hero-in">{children}</div>
}
