'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavNode, NavItem } from '@/lib/content'
import type { Locale } from '@/lib/types'

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

const LINK_CLASS =
  'rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'

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
          className="animate-dropdown-in absolute left-0 top-full z-50 mt-1 min-w-48 origin-top-left overflow-hidden rounded-lg border bg-background shadow-lg"
        >
          {/* The parent's own page first — nesting a child under it must
              never make the parent itself unreachable. */}
          <Link
            href={node.url}
            role="menuitem"
            onClick={() => setOpen(false)}
            {...itemLinkProps(node.url)}
            className="block px-3 py-2 text-sm hover:bg-muted"
          >
            {labelFor(node, locale)}
          </Link>
          <div className="border-t" />
          {node.children.map((child) => (
            <Link
              key={child.id}
              href={child.url}
              role="menuitem"
              onClick={() => setOpen(false)}
              {...itemLinkProps(child.url)}
              className="block px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {labelFor(child, locale)}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function SiteNav({ navItems, locale }: { navItems: NavNode[]; locale: Locale }) {
  if (navItems.length === 0) return null

  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {navItems.map((node) =>
        node.children.length > 0 ? (
          <NavDropdown key={node.id} node={node} locale={locale} />
        ) : (
          <Link key={node.id} href={node.url} {...itemLinkProps(node.url)} className={LINK_CLASS}>
            {labelFor(node, locale)}
          </Link>
        )
      )}
    </nav>
  )
}
