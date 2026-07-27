'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'

// MagicUI-style NumberTicker: counts up to `value` once scrolled into view.
// Writes textContent directly from the spring's `change` event instead of
// React state, so the count-up doesn't re-render the component every frame.
export function NumberTicker({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, motionValue, value])

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
