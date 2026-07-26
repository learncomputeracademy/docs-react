import { DocSidebar } from '@/components/doc-sidebar'
import { MobileSidebar } from '@/components/mobile-sidebar'

export default function CategoryLayoutBn({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full px-6 lg:px-10">
      <MobileSidebar locale="bn" />
      <div className="flex w-full gap-8">
        <DocSidebar locale="bn" />
        {children}
      </div>
    </div>
  )
}
