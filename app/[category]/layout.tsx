import { DocSidebar } from '@/components/doc-sidebar'
import { MobileSidebar } from '@/components/mobile-sidebar'

// Shared by the category index page and every lesson under it. Sidebar
// doesn't depend on category/slug params, so it persists across navigation
// instead of being torn down and rebuilt behind loading.tsx on every click.
export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full px-6 lg:px-10">
      <MobileSidebar locale="en" />
      <div className="flex w-full gap-8">
        <DocSidebar locale="en" />
        {children}
      </div>
    </div>
  )
}
