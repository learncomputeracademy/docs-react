'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import type { SidebarCategory } from '@/lib/content'
import type { Locale } from '@/lib/types'

export function SidebarNav({ categories, locale = 'en' }: { categories: SidebarCategory[]; locale?: Locale }) {
  // Derived from the live URL, not a server-passed prop — keeps this
  // component (and the layout that renders it) independent of the
  // [category]/[slug] params, so it doesn't re-fetch/re-render on every
  // lesson navigation the way it did when activePath came from the page.
  const pathname = usePathname()
  const activePath = pathname.replace(/^\/bn(\/|$)/, '/').replace(/^\//, '')
  const activeCategory = categories.find(c => c.slug === activePath || c.docs.some(d => d.path === activePath))?.slug
  const prefix = locale === 'bn' ? '/bn' : ''

  // The sidebar (and this component) now persists across lesson AND
  // category-index navigation instead of remounting per page — so which
  // section is open can't be a one-time defaultValue, it has to react to
  // the route changing underneath it. Controlled + effect keeps whatever
  // the user manually opened while always including the active section.
  const [openItems, setOpenItems] = useState<string[]>(() => (activeCategory ? [activeCategory] : [categories[0]?.slug].filter((s): s is string => !!s)))
  useEffect(() => {
    if (activeCategory) setOpenItems(prev => (prev.includes(activeCategory) ? prev : [...prev, activeCategory]))
  }, [activeCategory])

  return (
    <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="text-sm">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.slug]
        return (
          <AccordionItem key={cat.id} value={cat.slug}>
            <AccordionTrigger>
              {Icon && <Icon className="size-4 shrink-0" />}
              {cat.title}
              <span className="ml-auto mr-1 text-xs font-normal text-muted-foreground">{cat.docs.length}</span>
            </AccordionTrigger>
            <AccordionContent>
              <ul>
                {cat.docs.map((doc) => (
                  <li key={doc.path}>
                    <Link
                      href={`${prefix}/${doc.path}`}
                      className={cn(
                        'block rounded-md py-1.5 pl-9 pr-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
                        activePath === doc.path && 'bg-accent text-primary font-medium'
                      )}
                    >
                      {doc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
