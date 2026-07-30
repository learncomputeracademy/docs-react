import { DocSidebar } from '@/components/doc-sidebar'
import { MobileSidebarTrigger } from '@/components/mobile-sidebar-trigger'
import { SidebarProvider, SidebarInset } from '@/components/magic/sidebar'

export default function CategoryLayoutBn({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DocSidebar locale="bn" />
      <MobileSidebarTrigger locale="bn" />
      <SidebarInset>
        <div className="mx-auto w-full px-6 lg:px-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
