'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring } from 'motion/react'

// MagicUI-style NumberTicker, minus the scroll-into-view gate: the only
// usage here (hero stats row) is always above the fold on load, so waiting
// for useInView() added a real failure mode for no benefit — it
// intermittently never fired on at least one mobile device (likely an
// IntersectionObserver/geometry race while the hero's own mount animation
// is still mid-transform) and left the number stuck at 0 forever. Animating
// unconditionally on mount removes that class of bug entirely.
// Writes textContent directly from the spring's `change` event instead of
// React state, so the count-up doesn't re-render the component every frame.
export function NumberTicker({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })

  useEffect(() => {
    motionValue.set(value)
  }, [motionValue, value])

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toString()
    })
  }, [springValue])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
