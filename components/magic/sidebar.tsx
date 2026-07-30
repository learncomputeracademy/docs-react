'use client'

// Adapted from animate-ui.com's Radix Sidebar
// (https://animate-ui.com/docs/components/radix/sidebar), itself an
// animated fork of shadcn/ui's Sidebar. Ported with a few deliberate
// substitutions instead of pulling in animate-ui's full dependency chain:
//
// - No separate `--sidebar-*` theme namespace — this project has one
//   color system already (app/globals.css), so `bg-sidebar-accent` etc.
//   map onto the existing `--accent`/`--border`/`--ring` tokens.
// - The generic `Highlight`/`HighlightItem` primitive (~450 lines,
//   multi-mode bounds-tracking) is replaced by a much smaller
//   layoutId-based hover highlight scoped to exactly what a sidebar menu
//   needs — hover/active background sliding between menu buttons.
// - The mobile Sheet is built on @radix-ui/react-dialog (already a
//   dependency here, already used by components/mobile-sidebar-drawer.tsx)
//   instead of animate-ui's own Sheet-on-the-`radix-ui`-meta-package, with
//   the same slide-in keyframes (`drawer-in`/`drawer-in-right`) the site's
//   other drawers already use.
// - The Tooltip (shown on collapsed icon-only buttons) is a minimal
//   Radix Tooltip wrapper instead of animate-ui's own animated primitive
//   layer — same fade-in keyframe already used for dropdowns.

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'motion/react'
import { PanelLeftIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(window.innerWidth < 768)
    mql.addEventListener('change', onChange)
    onChange()
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

// ── Context ──────────────────────────────────────────────────────────────

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within a SidebarProvider')
  return ctx
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) setOpenProp(openState)
      else _setOpen(openState)
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((v) => !v) : setOpen((v) => !v)
  }, [isMobile, setOpen])

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleSidebar])

  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipPrimitive.Provider delayDuration={0}>
        <div
          style={{ '--sidebar-width': SIDEBAR_WIDTH, '--sidebar-width-icon': SIDEBAR_WIDTH_ICON, ...style } as React.CSSProperties}
          className={cn('group/sidebar-wrapper flex w-full', className)}
          {...props}
        >
          {children}
        </div>
      </TooltipPrimitive.Provider>
    </SidebarContext.Provider>
  )
}

// ── Hover/active highlight ───────────────────────────────────────────────
// A scoped stand-in for animate-ui's generic Highlight/HighlightItem:
// one shared layoutId per sidebar instance, moved between whichever menu
// button is hovered or (falling back to) marked active.

const HighlightContext = React.createContext<{
  hoveredValue: string | null
  setHoveredValue: (v: string | null) => void
  layoutId: string
} | null>(null)

function useHighlight() {
  return React.useContext(HighlightContext)
}

function HighlightGroup({ children }: { children: React.ReactNode }) {
  const [hoveredValue, setHoveredValue] = React.useState<string | null>(null)
  const layoutId = React.useId()
  return <HighlightContext.Provider value={{ hoveredValue, setHoveredValue, layoutId }}>{children}</HighlightContext.Provider>
}

// ── Sidebar shell ────────────────────────────────────────────────────────

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'icon',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { side?: 'left' | 'right'; variant?: 'sidebar' | 'floating' | 'inset'; collapsible?: 'offcanvas' | 'icon' | 'none' }) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div className={cn('bg-background text-foreground flex h-full w-(--sidebar-width) flex-col', className)} {...props}>
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Dialog.Root open={openMobile} onOpenChange={setOpenMobile}>
        <Dialog.Portal>
          <Dialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className={cn(
              'fixed inset-y-0 z-50 flex w-(--sidebar-width) flex-col bg-background p-0',
              side === 'left' ? 'animate-drawer-in left-0 border-r' : 'animate-drawer-in-right right-0 border-l'
            )}
            style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
          >
            <Dialog.Title className="sr-only">Sidebar</Dialog.Title>
            <Dialog.Description className="sr-only">Displays the mobile sidebar.</Dialog.Description>
            <HighlightGroup>
              <div className="flex h-full w-full flex-col">{children}</div>
            </HighlightGroup>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  return (
    <div className="group peer text-foreground hidden md:block" data-state={state} data-collapsible={state === 'collapsed' ? collapsible : ''} data-variant={variant} data-side={side}>
      {/* Reserves layout space; the actual sidebar is a fixed-position sibling below, so both can animate width in sync without content reflow. */}
      <div
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-300 ease-in-out',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset' ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]' : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
        )}
      />
      <div
        className={cn(
          'fixed top-14 bottom-0 z-10 hidden h-[calc(100vh-3.5rem)] w-(--sidebar-width) transition-[left,right,width] duration-300 ease-in-out md:flex',
          side === 'left' ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]' : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]'
            : cn('group-data-[collapsible=icon]:w-(--sidebar-width-icon)', side === 'left' ? 'border-r' : 'border-l')
        )}
        {...props}
      >
        <HighlightGroup>
          <div className={cn('flex h-full w-full flex-col bg-background', variant === 'floating' && 'rounded-lg border shadow-sm')}>{children}</div>
        </HighlightGroup>
      </div>
    </div>
  )
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('size-7', className)}
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'hover:after:bg-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-px sm:flex',
        'group-data-[side=left]:cursor-w-resize group-data-[side=right]:cursor-e-resize',
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return <main className={cn('bg-background relative flex w-full flex-1 flex-col', 'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm', className)} {...props} />
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 p-2', className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 p-2', className)} {...props} />
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div role="separator" className={cn('bg-border mx-2 h-px w-auto', className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('relative flex w-full min-w-0 flex-col p-2', className)} {...props} />
}

function SidebarGroupLabel({ className, asChild = false, ...props }: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      className={cn(
        'text-muted-foreground ring-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-300 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('w-full text-sm', className)} {...props} />
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('group/menu-item relative', className)} {...props} />
}

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-ring transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar-action]/menu-item:pr-8 data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: { size: 'default' },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  size = 'default',
  tooltip,
  value,
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean; isActive?: boolean; tooltip?: string; value?: string } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : 'button'
  const { isMobile, state } = useSidebar()
  const highlight = useHighlight()
  const highlightValue = value ?? (typeof props.children === 'string' ? props.children : undefined)
  const isHovered = highlight && highlightValue ? highlight.hoveredValue === highlightValue : false

  const button = (
    <div
      className="relative"
      onMouseEnter={(e) => {
        onMouseEnter?.(e as never)
        if (highlight && highlightValue) highlight.setHoveredValue(highlightValue)
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e as never)
        if (highlight && highlightValue) highlight.setHoveredValue(null)
      }}
    >
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            layoutId={highlight ? `sidebar-highlight-${highlight.layoutId}` : undefined}
            className="bg-accent/60 absolute inset-0 z-0 rounded-md"
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          />
        )}
      </AnimatePresence>
      <Comp data-size={size} data-active={isActive} className={cn(sidebarMenuButtonVariants({ size }), 'relative z-10', className)} {...props} />
    </div>
  )

  if (!tooltip) return button

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{button}</TooltipPrimitive.Trigger>
      {state === 'collapsed' && !isMobile && (
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content side="right" align="center" sideOffset={10} className="animate-dropdown-in z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">
            {tooltip}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      )}
    </TooltipPrimitive.Root>
  )
}

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'text-muted-foreground pointer-events-none absolute right-1 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
        'peer-data-[active=true]/menu-button:text-accent-foreground group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }: React.ComponentProps<'div'> & { showIcon?: boolean }) {
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, [])
  return (
    <div className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)} {...props}>
      {showIcon && <Skeleton className="size-4 rounded-md" />}
      <Skeleton className="h-4 flex-1" style={{ maxWidth: width }} />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('border-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5', 'group-data-[collapsible=icon]:hidden', className)} {...props} />
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('group/menu-sub-item relative', className)} {...props} />
}

function SidebarMenuSubButton({ asChild = false, size = 'md', isActive = false, className, ...props }: React.ComponentProps<'a'> & { asChild?: boolean; size?: 'sm' | 'md'; isActive?: boolean }) {
  const Comp = asChild ? Slot : 'a'
  return (
    <Comp
      data-size={size}
      data-active={isActive}
      className={cn(
        'text-muted-foreground ring-ring hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        'data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
