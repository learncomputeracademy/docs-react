'use client'

import { AnimatePresence, motion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

// Adapted from magicui.design's Text Animate — "Blur In by Text" preset
// (https://magicui.design/docs/components/text-animate#blur-in-by-text).
// Trimmed to the one animation this project uses (blurIn) instead of
// porting all ten of magicui's presets.
type SplitBy = 'text' | 'word' | 'character' | 'line'

const staggerTimings: Record<SplitBy, number> = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06,
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const blurInItem: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3 } },
}

export function TextAnimate({
  children,
  className,
  segmentClassName,
  delay = 0,
  duration = 0.3,
  by = 'word',
  as: Tag = 'span',
}: {
  children: string
  className?: string
  segmentClassName?: string
  delay?: number
  duration?: number
  by?: SplitBy
  as?: 'span' | 'h1' | 'p' | 'div'
}) {
  const MotionTag = motion[Tag]
  const segments = by === 'character' ? children.split('') : by === 'line' ? children.split('\n') : by === 'word' ? children.split(/(\s+)/) : [children]

  const container: Variants = {
    hidden: { opacity: 1 },
    show: { ...containerVariants.show, transition: { delayChildren: delay, staggerChildren: duration / segments.length } },
  }

  return (
    <AnimatePresence mode="popLayout">
      <MotionTag variants={container} initial="hidden" animate="show" className={cn('whitespace-pre-wrap', className)} aria-label={children}>
        <span className="sr-only">{children}</span>
        {segments.map((segment, i) => (
          <motion.span
            key={`${by}-${segment}-${i}`}
            variants={blurInItem}
            className={cn(by === 'line' ? 'block' : 'inline-block whitespace-pre', segmentClassName)}
            aria-hidden
          >
            {segment}
          </motion.span>
        ))}
      </MotionTag>
    </AnimatePresence>
  )
}
