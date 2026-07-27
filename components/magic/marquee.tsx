import { cn } from '@/lib/utils'

// MagicUI-style Marquee, pure CSS (translateX(-50%) over two duplicated
// copies of children — no motion/JS needed for a constant-speed loop).
// Pauses on hover/focus so the content is actually readable on demand.
export function Marquee({
  children,
  className,
  duration = 30,
}: {
  children: React.ReactNode
  className?: string
  duration?: number
}) {
  return (
    <div className={cn('group relative overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 gap-4">{children}</div>
        <div aria-hidden className="flex shrink-0 gap-4">{children}</div>
      </div>
    </div>
  )
}
