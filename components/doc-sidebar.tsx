import { getSidebarTree } from '@/lib/content'
import { SidebarNav } from '@/components/sidebar-nav'
import { Sidebar, SidebarHeader, SidebarContent, SidebarRail, SidebarTrigger } from '@/components/magic/sidebar'
import type { Locale } from '@/lib/types'

export async function DocSidebar({ locale = 'en' }: { locale?: Locale }) {
  const categories = await getSidebarTree(locale)
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
