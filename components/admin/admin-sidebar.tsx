'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Images, FolderTree, Settings, BookMarked } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SignOutButton } from './sign-out-button'

// Flat list, not a tree — unlike the public DocSidebar this never grows
// past a handful of top-level screens. Items without an href yet show
// disabled so the full shape of the panel is visible without linking to
// 404s. No Leads item — user decided against a contact form/leads
// pipeline entirely; /contact is static info linking out to the main
// site's own contact form instead (D-36).
const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/docs', label: 'Docs', icon: FileText, exact: false },
  { href: '/admin/media', label: 'Media', icon: Images, exact: false },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree, exact: false },
  { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
  { href: '/admin/resources', label: 'Resources', icon: BookMarked, exact: false },
] as const

export function AdminSidebar({ email, builtHrefs }: { email: string | undefined; builtHrefs: string[] }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r bg-muted/20">
      <div className="border-b px-4 py-3">
        <Link href="/admin" className="font-semibold">Admin</Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
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
      <div className="border-t p-3">
        <p className="truncate text-xs text-muted-foreground" title={email}>{email}</p>
        <div className="mt-2">
          <SignOutButton />
        </div>
      </div>
    </aside>
  )
}
