'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { groupNavChildren } from '@/lib/nav-megamenu'
import type { NavNode, NavItem } from '@/lib/content'
import type { Locale } from '@/lib/types'

// EXPERIMENT (2026-08-19) — mega-menu dropdowns for Docs/Tools, modeled on
// https://21st.dev/@ln-dev7/components/dorpdown-navigation. Flip to false to
// revert every dropdown to the old flat NavDropdown below instantly — no
// other changes needed, MegaDropdown is purely additive.
const MEGAMENU_ENABLED = true

// Exported for MobileMenuDrawer, which renders the same nav items as a
// vertical list inside the drawer rather than SiteNav's horizontal/dropdown
// layout — same data, same link semantics, different presentation.
export function labelFor(item: NavItem, locale: Locale) {
  return locale === 'bn' ? (item.label_bn ?? item.label) : item.label
}

function isExternal(url: string) {
  return url.startsWith('http')
}

export function itemLinkProps(url: string) {
  return isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' as const } : {}
}

// Compact pill sizing (~30px tall, 15px medium text), per shadcnblocks'
// navbar12 — https://www.shadcnblocks.com/block/navbar12
const LINK_CLASS =
  'rounded-full px-3 py-1.5 text-[15px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'

// Click-to-open, not hover: a hover dropdown is unreachable on touch and
// hostile to keyboard users. Escape closes, click-outside closes, and the
// trigger carries aria-expanded/aria-haspopup so it reads correctly to
// screen readers.
function NavDropdown({ node, locale }: { node: NavNode; locale: Locale }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(LINK_CLASS, 'flex items-center gap-1', open && 'bg-muted text-foreground')}
      >
        {labelFor(node, locale)}
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-dropdown-in absolute left-0 top-full z-50 mt-1.5 min-w-48 origin-top-left overflow-y-auto rounded-xl border bg-background p-1.5 shadow-lg max-h-[min(28rem,calc(100vh-5rem))]"
        >
          {/* The parent's own page first — nesting a child under it must
              never make the parent itself unreachable. */}
          <Link
            href={node.url}
            role="menuitem"
            onClick={() => setOpen(false)}
            {...itemLinkProps(node.url)}
            className="block rounded-md px-2.5 py-2 text-sm font-medium hover:bg-muted"
          >
            {labelFor(node, locale)}
          </Link>
          <div className="my-1 border-t" />
          {node.children.map((child) => (
            <Link
              key={child.id}
              href={child.url}
              role="menuitem"
              onClick={() => setOpen(false)}
              {...itemLinkProps(child.url)}
              className="block rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {labelFor(child, locale)}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// Same open/close/escape/click-outside contract as NavDropdown above — only
// the panel body differs (grouped columns vs. a flat list). Only rendered
// when groupNavChildren() has a config for this node; every other dropdown
// still gets the plain NavDropdown.
function MegaDropdown({ node, locale }: { node: NavNode; locale: Locale }) {
  const [open, setOpen] = useState(false)
  // Full-width panel is `fixed`, whose containing block is the viewport, not
  // the trigger — `top-full` (a % of the trigger) can't position it, so the
  // trigger's own bottom edge is measured in pixels at open time instead.
  const [panelTop, setPanelTop] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const groups = groupNavChildren(node)!

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  function show() {
    clearCloseTimer()
    // +8px gap so the panel visibly floats below the header instead of
    // sitting flush against it (mt on a fixed element works, but baking the
    // gap into the measured value keeps the math in one place).
    if (ref.current) setPanelTop(ref.current.getBoundingClientRect().bottom + 8)
    setOpen(true)
  }
  // Grace period, not an instant close: the mouse crossing the gap between
  // trigger and panel would otherwise read as "left the dropdown" and slam
  // it shut before it's reachable.
  function scheduleHide() {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => () => clearCloseTimer(), [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
      onBlur={(e) => {
        // React normalizes blur to bubble, so this catches focus leaving any
        // descendant (button or a menu link), not just the div itself.
        if (!ref.current) return
        if (!e.relatedTarget || !ref.current.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : show())}
        onFocus={show}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(LINK_CLASS, 'flex items-center gap-1', open && 'bg-muted text-foreground')}
      >
        {labelFor(node, locale)}
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {/* Always mounted (not open && (...)) — a transition animates both
          open AND close; conditional rendering would only animate open and
          make the panel vanish instantly on close. inert removes it from
          tab order and AT while closed without touching the fade/slide. */}
      <div
        role="menu"
        aria-hidden={!open}
        inert={!open}
        style={{ top: panelTop }}
        className={cn(
          'fixed inset-x-4 z-50 overflow-y-auto rounded-2xl border bg-background px-10 py-6 shadow-xl transition-all duration-200 ease-out max-h-[calc(100vh-6rem)]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
        )}
      >
        <div
          className="mx-auto grid max-w-[110rem] gap-x-10 gap-y-4"
          style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))` }}
        >
          {groups.map((group) => (
              <div key={group.title}>
                <div className="mb-2 flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <group.icon className="size-3.5" />
                  {group.title}
                </div>
                <div className="flex flex-col">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      {...itemLinkProps(item.url)}
                      className="flex items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted"
                    >
                      <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium leading-tight">{labelFor(item, locale)}</span>
                        {item.hint && <span className="text-xs leading-tight text-muted-foreground">{item.hint}</span>}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t pt-3">
            <Link
              href={node.url}
              role="menuitem"
              onClick={() => setOpen(false)}
              {...itemLinkProps(node.url)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted"
            >
              Browse all {labelFor(node, locale)}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
  )
}

export function SiteNav({ navItems, locale }: { navItems: NavNode[]; locale: Locale }) {
  if (navItems.length === 0) return null

  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {navItems.map((node) => {
        if (node.children.length === 0) {
          return (
            <Link key={node.id} href={node.url} {...itemLinkProps(node.url)} className={LINK_CLASS}>
              {labelFor(node, locale)}
            </Link>
          )
        }
        return MEGAMENU_ENABLED && groupNavChildren(node) ? (
          <MegaDropdown key={node.id} node={node} locale={locale} />
        ) : (
          <NavDropdown key={node.id} node={node} locale={locale} />
        )
      })}
    </nav>
  )
}
