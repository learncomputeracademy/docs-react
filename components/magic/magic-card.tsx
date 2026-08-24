'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate, animate } from 'motion/react'
import { cn } from '@/lib/utils'
import { useProximity } from '@/components/magic/proximity-grid'

const PROXIMITY_RADIUS = 160 // px beyond the card's own edge where glow starts fading in

// MagicUI-style MagicCard: a glowing 1px border ring that follows the cursor.
// Wraps any card-shaped child — spotlight is pointer-events-none so it never
// intercepts clicks on the wrapped link/button. `glow` adds a smoothui.dev
// glow-hover-card–style soft fill under the ring (opt-in, default off, so
// existing callers like category-content.tsx keep the plain ring).
//
// Inside a <ProximityGrid>, the glow reacts to cursor distance across the
// whole grid — cards near the pointer start glowing before the pointer is
// literally over them (react-bits Magic Bento style), and every card fades
// together on grid mouse-leave. Outside one, falls back to plain per-card
// hover (own onMouseMove + CSS group-hover), unchanged from before.
export function MagicCard({ children, className, glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const proximity = useProximity()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const proximityOpacity = useMotionValue(0)

  useEffect(() => {
    if (!proximity) return
    function update() {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      const x = proximity!.mouseX.get()
      const y = proximity!.mouseY.get()
      mouseX.set(x - rect.left)
      mouseY.set(y - rect.top)
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.hypot(x - cx, y - cy)
      const maxDist = Math.hypot(rect.width, rect.height) / 2 + PROXIMITY_RADIUS
      const target = proximity!.active.get() ? Math.max(0, 1 - dist / maxDist) : 0
      animate(proximityOpacity, target, { duration: 0.2 })
    }
    const unsubs = [proximity.mouseX.on('change', update), proximity.mouseY.on('change', update), proximity.active.on('change', update)]
    return () => unsubs.forEach((u) => u())
  }, [proximity, mouseX, mouseY, proximityOpacity])

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (proximity) return // grid drives position instead
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const ringBackground = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--primary) 60%, transparent), transparent 70%)`
  const fillBackground = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--primary) 15%, transparent), transparent 70%)`

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={cn('group relative rounded-[inherit]', className)}>
      {children}
      {glow && (
        <motion.div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300',
            proximity ? '' : 'opacity-0 group-hover:opacity-100'
          )}
          style={{ background: fillBackground, opacity: proximity ? proximityOpacity : undefined }}
        />
      )}
      <motion.div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300',
          proximity ? '' : 'opacity-0 group-hover:opacity-100'
        )}
        style={{
          background: ringBackground,
          opacity: proximity ? proximityOpacity : undefined,
          padding: 1,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
    </div>
  )
}
