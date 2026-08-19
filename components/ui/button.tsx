'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Public site gets a liquid-glass + cursor-spotlight treatment, plus a
// fatter pill shape, on every variant — user-referenced:
// https://21st.dev/@designali-in/components/liquid-glass-button and
// https://lunarui.dev/components/react/buttons/spotlight-button. Admin
// opts out (dense forms/tables, not marketing chrome — same rounded-md/h-9
// sizing it always had) by wrapping its root in <ButtonGlassOff> once
// (app/admin/layout.tsx); every other call site needs no change, since the
// default is "on."
const ButtonGlassContext = React.createContext(true)
export function ButtonGlassOff({ children }: { children: React.ReactNode }) {
  return <ButtonGlassContext.Provider value={false}>{children}</ButtonGlassContext.Provider>
}

// Shape/size and color are both branched on glassOn below (SHAPE/GLASS vs.
// PLAIN maps) — CVA here only supplies the static base classes and the
// variant/size prop typing, not the values themselves.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: { default: '', outline: '', ghost: '' },
      size: { default: '', sm: '', lg: '', icon: '' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

type ColorVariant = 'default' | 'outline' | 'ghost'
type SizeVariant = 'default' | 'sm' | 'lg' | 'icon'

// Pill-shaped and a step fatter than the plain admin sizing — "more rounded
// and fatter" per user feedback; a pill reads as glass (a filled/frosted
// capsule) more convincingly than a soft-cornered rect.
const SHAPE: Record<SizeVariant, string> = {
  default: 'h-11 rounded-full px-6 py-2',
  sm: 'h-9 rounded-full px-4 text-xs',
  lg: 'h-12 rounded-full px-8 text-base',
  icon: 'size-11 rounded-full',
}
const PLAIN_SHAPE: Record<SizeVariant, string> = {
  default: 'h-9 rounded-md px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-6',
  icon: 'size-9 rounded-md',
}

const PLAIN: Record<ColorVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
}

// Shared cursor-tracked spotlight — position comes from --spot-x/--spot-y,
// set imperatively on mousemove (see onMouseMove below), not React state,
// so hovering doesn't trigger a re-render per pixel. isolate + -z-10 keeps
// the glow behind the label; rounded-[inherit] keeps it inside the pill.
// 170px/opacity 0.45 (bumped up from an earlier, subtler pass) per "make it
// more prominent."
const SPOTLIGHT =
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:[background:radial-gradient(170px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(255,255,255,0.45),transparent_70%)] hover:before:opacity-100"
const GLASS_BASE = `relative isolate overflow-hidden backdrop-blur-lg ${SPOTLIGHT}`

// outline/ghost start from a transparent or near-transparent background, so
// their glass needs a visibly tinted fill at rest (not just on hover) or
// the blur has nothing to read against — that was the "isn't prominent on
// transparent buttons" gap.
const GLASS: Record<ColorVariant, string> = {
  default: `${GLASS_BASE} border border-primary-foreground/25 bg-primary/70 text-primary-foreground shadow-[0_8px_28px_-10px_rgba(0,0,0,0.45)] hover:bg-primary/80`,
  outline: `${GLASS_BASE} border border-foreground/20 bg-foreground/[0.08] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.25)] hover:bg-foreground/[0.14] hover:border-foreground/30`,
  ghost: `${GLASS_BASE} border border-foreground/10 bg-foreground/[0.08] hover:bg-foreground/[0.16] hover:border-foreground/20`,
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  onMouseMove,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const glassOn = React.useContext(ButtonGlassContext)
  const v: ColorVariant = variant ?? 'default'
  const s: SizeVariant = size ?? 'default'
  const Comp = asChild ? Slot : 'button'

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    onMouseMove?.(e)
    if (!glassOn) return
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    e.currentTarget.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size }),
        glassOn ? SHAPE[s] : PLAIN_SHAPE[s],
        glassOn ? GLASS[v] : PLAIN[v],
        className
      )}
      onMouseMove={handleMouseMove}
      {...props}
    />
  )
}

export { Button, buttonVariants }
