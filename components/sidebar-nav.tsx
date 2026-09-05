'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/magic/sidebar'
import type { SidebarCategory } from '@/lib/content'
import type { Locale } from '@/lib/types'
import { SUBJECT_GROUPS } from '@/lib/subject-groups'

export function SidebarNav({ categories, locale = 'en' }: { categories: SidebarCategory[]; locale?: Locale }) {
  const { state, isMobile } = useSidebar()
  const pathname = usePathname()
  const activePath = pathname.replace(/^\/bn(\/|$)/, '/').replace(/^\//, '')
  const activeCategory = categories.find((c) => c.slug === activePath || c.docs.some((d) => d.path === activePath))?.slug
  const prefix = locale === 'bn' ? '/bn' : ''

  // Same reasoning as the old Accordion-based version: this persists across
  // lesson AND category-index navigation, so which section is open reacts
  // to the route changing underneath it rather than being a one-time default.
  const [openItems, setOpenItems] = useState<string[]>(() => (activeCategory ? [activeCategory] : [categories[0]?.slug].filter((s): s is string => !!s)))
  useEffect(() => {
    if (activeCategory) setOpenItems((prev) => (prev.includes(activeCategory) ? prev : [...prev, activeCategory]))
  }, [activeCategory])

  function toggle(slug: string) {
    setOpenItems((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  }

  // Grouped into named sections (2026-09-02, matches the homepage subject
  // index — same SUBJECT_GROUPS source) instead of one flat category list.
  // A category not listed in any group still ships, in its own trailing
  // "More" section, rather than silently vanishing.
  const byslug = new Map(categories.map((c) => [c.slug, c]))
  const grouped = new Set(SUBJECT_GROUPS.flatMap((g) => g.slugs as readonly string[]))
  const sections = [
    ...SUBJECT_GROUPS.map((g) => ({
      key: g.key,
      label: g.label[locale],
      cats: g.slugs.map((slug) => byslug.get(slug)).filter((c): c is SidebarCategory => !!c),
    })),
    { key: 'more', label: locale === 'bn' ? 'আরও' : 'More', cats: categories.filter((c) => !grouped.has(c.slug)) },
  ].filter((section) => section.cats.length > 0)

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.key} className="p-0">
          <SidebarGroupLabel className="text-primary/80 font-semibold tracking-wide uppercase">{section.label}</SidebarGroupLabel>
          <SidebarMenu>{section.cats.map(renderCategory)}</SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )

  function renderCategory(cat: SidebarCategory) {
    const Icon = CATEGORY_ICONS[cat.slug]
    const isOpen = openItems.includes(cat.slug)
    // Icon-rail mode has no room for a sub-list, and clicking a toggle
    // that visibly does nothing is a dead end — the icon becomes a
    // real link to the category's own index page instead. Mobile's
    // Sheet is always full-width, so it never hits this collapsed state.
    const iconOnly = state === 'collapsed' && !isMobile

    return (
      <SidebarMenuItem key={cat.id}>
        {iconOnly ? (
          <SidebarMenuButton value={cat.slug} tooltip={cat.title} asChild isActive={activeCategory === cat.slug}>
            <Link href={`${prefix}/${cat.slug}`}>
              {Icon && <Icon className="size-4 shrink-0" />}
              <span className="truncate">{cat.title}</span>
            </Link>
          </SidebarMenuButton>
        ) : (
          <SidebarMenuButton value={cat.slug} tooltip={cat.title} onClick={() => toggle(cat.slug)}>
            {Icon && <Icon className="size-4 shrink-0" />}
            <span className="truncate">{cat.title}</span>
            <span className="ml-auto shrink-0 text-xs font-normal text-muted-foreground group-data-[collapsible=icon]:hidden">{cat.docs.length}</span>
            <ChevronRight className={cn('size-3.5 shrink-0 transition-transform group-data-[collapsible=icon]:hidden', isOpen && 'rotate-90')} />
          </SidebarMenuButton>
        )}
        {isOpen && (
          <SidebarMenuSub>
            {cat.docs.map((doc) => (
              <SidebarMenuSubItem key={doc.path}>
                <SidebarMenuSubButton asChild isActive={activePath === doc.path}>
                  <Link href={`${prefix}/${doc.path}`}>{doc.title}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    )
  }
}
