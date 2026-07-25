'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import type { SidebarCategory } from '@/lib/content'

export function SidebarNav({ categories, activePath }: { categories: SidebarCategory[]; activePath?: string }) {
  const activeCategory = categories.find(c => c.docs.some(d => d.path === activePath))?.slug

  return (
    <Accordion type="multiple" defaultValue={activeCategory ? [activeCategory] : [categories[0]?.slug]} className="text-sm">
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
                      href={`/${doc.path}`}
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
