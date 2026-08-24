'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

const MAX_TILT_DEG = 20

// Aceternity/21st-style "3D Card": the whole card tilts in perspective to
// follow the cursor, and `TiltLayer` children pop forward in Z for a
// layered, physical depth-on-hover feel — same idea as
// https://21st.dev/@shailendrakumar19999/components/animated-3d-card, ported
// to this codebase's own motion/react idiom (see magic-card.tsx) instead of
// Aceternity's vanilla-DOM-ref version. Springs, not raw .set(), because a
// hard-snap tilt reads as glitchy rather than physical — unlike MagicCard's
// glow (deliberately instant, see its own comment), the whole point here
// *is* the springy motion.
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  // .set() has to land on the *source* value that drives the spring — an
  // earlier version called .set() on useSpring's returned value directly,
  // which just overwrote it instantly with no spring involved and no
  // visible tilt at all (caught live: hovering a card produced zero skew).
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(rawX, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(rawY, { stiffness: 300, damping: 30 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rawY.set(px * MAX_TILT_DEG)
    rawX.set(py * -MAX_TILT_DEG)
  }

  function onMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('group/tilt', className)}
      >
        {children}
      </motion.div>
    </div>
  )
}

// One layer of content inside a TiltCard, popping toward the viewer by
// `depth` pixels along Z whenever the pointer is anywhere over the card
// (the shared `group/tilt` state) — not its own tiny hitbox, or the icon and
// title would pop independently instead of lifting together as one card.
// Needs the parent's `preserve-3d` to read as depth, not just a scale-up.
export function TiltLayer({ children, depth, className }: { children: React.ReactNode; depth: number; className?: string }) {
  return (
    <div
      className={cn(
        '[transform:translateZ(0px)] transition-transform duration-300 ease-out group-hover/tilt:[transform:translateZ(var(--tilt-depth))]',
        className
      )}
      style={{ '--tilt-depth': `${depth}px` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
