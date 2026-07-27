'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, FileText, Images, FolderTree, Settings, BookMarked, Users, History, Trash2, Sun, Moon, Layers, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SignOutButton } from './sign-out-button'

// Same toggle logic as components/site-header.tsx — duplicated rather
// than shared, since the two live in otherwise-unrelated chrome trees and
// the whole thing is four lines. Root layout's inline head script (D-19
// era) already applies the stored/system theme before paint on every
// route including /admin, so there's no separate FOUC concern here.
function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

// Flat list, not a tree — unlike the public DocSidebar this never grows
// past a handful of top-level screens. Items without an href yet show
// disabled so the full shape of the panel is visible without linking to
// 404s. No Leads item — user decided against a contact form/leads
// pipeline entirely; /contact is static info linking out to the main
// site's own contact form instead (D-36).
// adminOnly items are filtered out entirely for editors (D-37) — not
// grayed out like unbuilt items, since an editor navigating there
// directly gets redirected by proxy.ts anyway; hiding them here is just
// so the sidebar doesn't advertise screens they can't open.
const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, adminOnly: false },
  { href: '/admin/docs', label: 'Docs', icon: FileText, exact: false, adminOnly: false },
  { href: '/admin/media', label: 'Media', icon: Images, exact: false, adminOnly: false },
  { href: '/admin/pages', label: 'Pages', icon: Layers, exact: false, adminOnly: false },
  { href: '/admin/seo', label: 'SEO', icon: Search, exact: false, adminOnly: false },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree, exact: false, adminOnly: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false, adminOnly: true },
  { href: '/admin/resources', label: 'Resources', icon: BookMarked, exact: false, adminOnly: true },
  { href: '/admin/users', label: 'Users', icon: Users, exact: false, adminOnly: true },
  { href: '/admin/activity', label: 'Activity', icon: History, exact: false, adminOnly: true },
  { href: '/admin/trash', label: 'Trash', icon: Trash2, exact: false, adminOnly: true },
] as const

export function AdminSidebar({ email, role, builtHrefs, version }: { email: string | undefined; role: 'admin' | 'editor' | null; builtHrefs: string[]; version: string }) {
  const pathname = usePathname()
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || role === 'admin')

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r bg-muted/20">
      <div className="border-b px-4 py-3">
        <Link href="/admin" className="font-semibold">Admin</Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {items.map((item) => {
          const built = builtHrefs.includes(item.href)
          const active = built && (item.exact ? pathname === item.href : pathname.startsWith(item.href))
          const Icon = item.icon
          if (!built) {
            return (
              <span
                key={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground/40"
                title="Not built yet"
              >
                <Icon className="size-4" /> {item.label}
              </span>
            )
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                active ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="size-4" /> {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-2">
        <ThemeToggle />
      </div>
      <div className="border-t p-3">
        <p className="truncate text-xs text-muted-foreground" title={email}>{email}</p>
        <div className="mt-2">
          <SignOutButton />
        </div>
        <p className="mt-2 font-mono text-xs text-muted-foreground/60">v{version}</p>
      </div>
    </aside>
  )
}
