'use client'

import { motion } from 'motion/react'

// One-shot entrance for the homepage hero only — per docs/UI.md, motion earns
// its place in chrome/transitions, never in scroll-triggered lesson content.
export function HeroReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
