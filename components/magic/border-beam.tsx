import { cn } from '@/lib/utils'

// MagicUI-style BorderBeam, pure CSS (@property --border-angle + conic-gradient
// mask-exclude ring) — no motion/JS needed for a beam that just rotates forever.
// Drop inside a `relative` (and usually `rounded-*`) parent.
export function BorderBeam({
  className,
  duration = 8,
  color = 'var(--primary)',
}: {
  className?: string
  duration?: number
  color?: string
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit] animate-border-beam', className)}
      style={
        {
          '--border-beam-duration': `${duration}s`,
          padding: 1.5,
          background: `conic-gradient(from var(--border-angle), transparent 75%, ${color})`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        } as React.CSSProperties
      }
    />
  )
}
