import type { CategoryId, Lesson } from '../net'
import { CORE_LESSONS as C } from './core'

export const CATEGORIES: CategoryId[] = ['core', 'web', 'files', 'security']

// The six original lessons ship with the page. The other 32 are ~75 KB of
// gzipped text (docs/TOOLS.md house rule 7: JS < 100 KB), so they load in
// the background after first paint — see loadAllLessons().
export const FIRST_LESSONS: Lesson[] = [C.dhcp, C.dns, C.tcp, C.udp, C.http, C.https]

/** Every lesson, in display order: within a category, roughly the order you'd meet them. */
export async function loadAllLessons(): Promise<Lesson[]> {
  const [network, web, files, security] = await Promise.all([import('./network'), import('./web'), import('./files'), import('./security')])
  return [
    C.dhcp, C.dns, C.tcp, C.udp, ...network.NETWORK_LESSONS,
    C.http, C.https, ...web.WEB_LESSONS,
    ...files.FILES_LESSONS,
    ...security.SECURITY_LESSONS,
  ]
}
