import { getSidebarTree } from '@/lib/content'
import { SidebarNav } from '@/components/sidebar-nav'
import type { Locale } from '@/lib/types'

export async function DocSidebar({ locale = 'en' }: { locale?: Locale }) {
  const categories = await getSidebarTree(locale)
  return (
    // Sticky + its own bounded height so it scrolls independently of the
    // page (VitePress-style) instead of scrolling away with the content.
    <nav className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r py-6 pr-4 md:block">
      <SidebarNav categories={categories} locale={locale} />
    </nav>
  )
}
