import { getSidebarTree } from '@/lib/content'
import { MobileSidebarDrawer } from '@/components/mobile-sidebar-drawer'
import type { Locale } from '@/lib/types'

// Sibling to DocSidebar, not a variant of it — this renders a full-width
// bar above the content on mobile, which the flex row DocSidebar sits in
// can't do (it'd become a squeezed column instead of a top bar). Separate
// component keeps that layout difference out of DocSidebar entirely.
export async function MobileSidebar({ locale = 'en' }: { locale?: Locale }) {
  const categories = await getSidebarTree(locale)
  return (
    <div className="border-b py-3 md:hidden">
      <MobileSidebarDrawer categories={categories} locale={locale} />
    </div>
  )
}
