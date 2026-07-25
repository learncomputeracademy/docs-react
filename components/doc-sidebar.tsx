import { getSidebarTree } from '@/lib/content'
import { SidebarNav } from '@/components/sidebar-nav'
import type { Locale } from '@/lib/types'

export async function DocSidebar({ activePath, locale = 'en' }: { activePath?: string; locale?: Locale }) {
  const categories = await getSidebarTree(locale)
  return (
    <nav className="w-64 shrink-0 border-r overflow-y-auto py-6 pr-4 hidden md:block">
      <SidebarNav categories={categories} activePath={activePath} locale={locale} />
    </nav>
  )
}
