'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Public site gets a liquid-glass + cursor-spotlight treatment on the
// `default` (filled/primary) variant — user-referenced:
// https://21st.dev/@designali-in/components/liquid-glass-button and
// https://lunarui.dev/components/react/buttons/spotlight-button. Admin
// opts out (dense forms/tables, not marketing chrome) by wrapping its root
// in <ButtonGlassOff> once (app/admin/layout.tsx) — every other call site
// needs no change, since the default is "on."
const ButtonGlassContext = React.createContext(true)
export function ButtonGlassOff({ children }: { children: React.ReactNode }) {
  return <ButtonGlassContext.Provider value={false}>{children}</ButtonGlassContext.Provider>
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: '', // filled in by DEFAULT_GLASS/DEFAULT_PLAIN below — the one variant with a glass/plain split
        outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const DEFAULT_PLAIN = 'bg-primary text-primary-foreground hover:bg-primary/90'

// Frosted glass: translucent primary fill + blur + a hairline border with a
// soft top highlight (the classic glassmorphism inset). `before:` carries
// the cursor-tracked spotlight — its position comes from --spot-x/--spot-y,
// set imperatively on mousemove (see onMouseMove below), not React state,
// so hovering doesn't trigger a re-render per pixel. isolate + -z-10 keeps
// the glow behind the label; rounded-[inherit] keeps it inside the corners.
const DEFAULT_GLASS =
  'relative isolate overflow-hidden border border-primary-foreground/20 bg-primary/75 text-primary-foreground backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_8px_24px_-10px_rgba(0,0,0,0.4)] hover:bg-primary/85 ' +
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:[background:radial-gradient(140px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(255,255,255,0.35),transparent_70%)] hover:before:opacity-100"

function Button({
  className,
  variant,
  size,
  asChild = false,
  onMouseMove,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const glassOn = React.useContext(ButtonGlassContext)
  const isDefault = (variant ?? 'default') === 'default'
  const showGlass = isDefault && glassOn
  const Comp = asChild ? Slot : 'button'

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    onMouseMove?.(e)
    if (!showGlass) return
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    e.currentTarget.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), isDefault && (showGlass ? DEFAULT_GLASS : DEFAULT_PLAIN), className)}
      onMouseMove={handleMouseMove}
      {...props}
    />
  )
}

export { Button, buttonVariants }
