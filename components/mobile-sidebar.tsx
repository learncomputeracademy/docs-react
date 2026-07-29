import { getSidebarTree } from '@/lib/content'
import { MobileSidebarDrawer } from '@/components/mobile-sidebar-drawer'
import type { Locale } from '@/lib/types'

// Sibling to DocSidebar, not a variant of it — DocSidebar is a flex column
// that only makes sense at md+; below that, this fetches the same tree for
// a fixed edge-tab trigger instead (MobileSidebarDrawer), which needs no
// space in normal document flow.
export async function MobileSidebar({ locale = 'en' }: { locale?: Locale }) {
  const categories = await getSidebarTree(locale)
  return <MobileSidebarDrawer categories={categories} locale={locale} />
}
