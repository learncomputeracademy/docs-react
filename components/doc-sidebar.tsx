import { SidebarNav } from '@/components/sidebar-nav'
import { Sidebar, SidebarHeader, SidebarContent, SidebarRail, SidebarTrigger } from '@/components/magic/sidebar'
import type { SidebarCategory } from '@/lib/content'
import type { Locale } from '@/lib/types'

// Takes categories as a prop (fetched once by the layout) instead of
// fetching its own — MobileSidebarTrigger needs the same tree to compute
// its chapter-position badge, and a server layout is the natural place to
// fetch it once for both rather than each doing it separately.
export function DocSidebar({ categories, locale = 'en' }: { categories: SidebarCategory[]; locale?: Locale }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center justify-end">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarNav categories={categories} locale={locale} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
