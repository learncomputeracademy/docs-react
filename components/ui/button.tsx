'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Public site buttons follow reactbits.dev's hero buttons (user-requested
// 2026-11-19, replacing the earlier liquid-glass + spotlight treatment):
// solid fills, 12-13px corners, hover brightens, the trailing icon nudges
// 2px right on hover, and the button presses down to 0.97 on click. All
// CSS transitions, no JS. Admin opts out (dense forms/tables) by wrapping
// its root in <ButtonGlassOff> once (app/admin/layout.tsx); the name is
// historical.
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

// The icon nudge is on the text sizes only, not `icon` (a lone icon
// sliding sideways reads as a glitch, not a hint).
const NUDGE = '[&_svg]:transition-transform [&_svg]:duration-[260ms] [&_svg]:ease-out hover:[&_svg]:translate-x-0.5'
const SHAPE: Record<SizeVariant, string> = {
  default: `h-11 rounded-[12px] px-5 ${NUDGE}`,
  sm: `h-9 rounded-[10px] px-3.5 text-xs ${NUDGE}`,
  lg: `h-[46px] rounded-[13px] px-5 text-[15px] tracking-[-0.01em] ${NUDGE}`,
  icon: 'size-11 rounded-[12px]',
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

const PRESS = 'transition-[background-color,color,box-shadow,filter,transform] duration-150 active:scale-[0.97]'
const STYLED: Record<ColorVariant, string> = {
  default: `${PRESS} bg-primary text-primary-foreground hover:brightness-110`,
  outline: `${PRESS} bg-[var(--ghost)] text-foreground shadow-[var(--ghost-ring)] hover:bg-[var(--ghost-hover)]`,
  ghost: `${PRESS} hover:bg-foreground/[0.06]`,
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const glassOn = React.useContext(ButtonGlassContext)
  const v: ColorVariant = variant ?? 'default'
  const s: SizeVariant = size ?? 'default'
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size }),
        glassOn ? SHAPE[s] : PLAIN_SHAPE[s],
        glassOn ? STYLED[v] : PLAIN[v],
        className
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
