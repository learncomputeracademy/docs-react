import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// MagicUI-style shimmer sweep, layered on the existing shadcn Button rather
// than a parallel button system — keeps variant/size tokens and asChild
// support, just adds a diagonal highlight sweeping across on a loop.
export function ShimmerButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        'relative isolate overflow-hidden',
        "before:absolute before:inset-0 before:content-[''] before:bg-[length:200%_100%] before:bg-[linear-gradient(110deg,transparent_35%,color-mix(in_oklch,var(--primary-foreground)_35%,transparent)_50%,transparent_65%)] before:animate-shimmer-sweep",
        className
      )}
      {...props}
    />
  )
}
