import { getSidebarTree } from '@/lib/content'
import { DocSidebar } from '@/components/doc-sidebar'
import { MobileSidebarTrigger } from '@/components/mobile-sidebar-trigger'
import { SidebarProvider, SidebarInset } from '@/components/magic/sidebar'

// Shared by the category index page and every lesson under it. Sidebar
// doesn't depend on category/slug params, so it persists across navigation
// instead of being torn down and rebuilt behind loading.tsx on every click.
// Fetched once here rather than inside DocSidebar — MobileSidebarTrigger
// needs the same tree for its chapter-position badge.
export default async function CategoryLayout({ children }: { children: React.ReactNode }) {
  const categories = await getSidebarTree('en')

  return (
    <SidebarProvider>
      <DocSidebar categories={categories} locale="en" />
      <MobileSidebarTrigger categories={categories} locale="en" />
      <SidebarInset>
        <div className="mx-auto flex w-full gap-8 px-6 lg:px-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
