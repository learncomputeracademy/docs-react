'use client'

import { motion, useMotionValue, useMotionTemplate } from 'motion/react'
import { cn } from '@/lib/utils'

// MagicUI-style MagicCard: a glowing 1px border ring that follows the cursor.
// Wraps any card-shaped child — spotlight is pointer-events-none so it never
// intercepts clicks on the wrapped link/button.
export function MagicCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const background = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--primary) 60%, transparent), transparent 70%)`

  return (
    <div onMouseMove={onMouseMove} className={cn('group relative rounded-[inherit]', className)}>
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background,
          padding: 1,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
    </div>
  )
}
