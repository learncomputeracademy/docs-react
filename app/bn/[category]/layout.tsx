import { getSidebarTree } from '@/lib/content'
import { DocSidebar } from '@/components/doc-sidebar'
import { MobileSidebarTrigger } from '@/components/mobile-sidebar-trigger'
import { SidebarProvider, SidebarInset } from '@/components/magic/sidebar'

export default async function CategoryLayoutBn({ children }: { children: React.ReactNode }) {
  const categories = await getSidebarTree('bn')

  return (
    <SidebarProvider>
      <DocSidebar categories={categories} locale="bn" />
      <MobileSidebarTrigger categories={categories} locale="bn" />
      <SidebarInset>
        <div className="mx-auto flex w-full gap-8 px-6 lg:px-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
