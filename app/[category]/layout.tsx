import { DocSidebar } from '@/components/doc-sidebar'
import { MobileSidebarTrigger } from '@/components/mobile-sidebar-trigger'
import { SidebarProvider, SidebarInset } from '@/components/magic/sidebar'

// Shared by the category index page and every lesson under it. Sidebar
// doesn't depend on category/slug params, so it persists across navigation
// instead of being torn down and rebuilt behind loading.tsx on every click.
export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DocSidebar locale="en" />
      <MobileSidebarTrigger locale="en" />
      <SidebarInset>
        <div className="mx-auto w-full px-6 lg:px-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
