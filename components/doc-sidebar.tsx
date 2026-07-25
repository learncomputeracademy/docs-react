import { getSidebarTree } from '@/lib/content'
import { SidebarNav } from '@/components/sidebar-nav'

export async function DocSidebar({ activePath }: { activePath?: string }) {
  const categories = await getSidebarTree()
  return (
    <nav className="w-64 shrink-0 border-r overflow-y-auto py-6 pr-4 hidden md:block">
      <SidebarNav categories={categories} activePath={activePath} />
    </nav>
  )
}
