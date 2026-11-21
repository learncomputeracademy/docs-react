'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Link from '@/components/hover-link'
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
import { useCompleted } from '@/lib/progress'
import { DoneCheck, ProgressRing } from '@/components/progress-marks'

export function SidebarNav({ categories, locale = 'en' }: { categories: SidebarCategory[]; locale?: Locale }) {
  const { state, isMobile } = useSidebar()
  const completed = useCompleted()
  const pathname = usePathname()
  const activePath = pathname.replace(/^\/bn(\/|$)/, '/').replace(/^\//, '')
  const activeCategory = categories.find((c) => c.slug === activePath || c.docs.some((d) => d.path === activePath))?.slug
  const prefix = locale === 'bn' ? '/bn' : ''

  // Same reasoning as the old Accordion-based version: this persists across
  // lesson AND category-index navigation, so which section is open reacts
  // to the route changing underneath it rather than being a one-time default.
  const [openItems, setOpenItems] = useState<string[]>(() => (activeCategory ? [activeCategory] : [categories[0]?.slug].filter((s): s is string => !!s)))
  const [prevActive, setPrevActive] = useState(activeCategory)
  if (activeCategory !== prevActive) {
    setPrevActive(activeCategory)
    if (activeCategory) setOpenItems((prev) => (prev.includes(activeCategory) ? prev : [...prev, activeCategory]))
  }

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
    const doneCount = cat.docs.filter((d) => completed.has(d.path)).length

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
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs font-normal tabular-nums text-muted-foreground group-data-[collapsible=icon]:hidden">
              {doneCount > 0 && <>{doneCount}/</>}{cat.docs.length}
              <ProgressRing done={doneCount} total={cat.docs.length} />
            </span>
            <ChevronRight className={cn('size-3.5 shrink-0 transition-transform group-data-[collapsible=icon]:hidden', isOpen && 'rotate-90')} />
          </SidebarMenuButton>
        )}
        {isOpen && (
          <BranchList activePath={activePath}>
            {cat.docs.map((doc) => (
              <SidebarMenuSubItem key={doc.path} className={cn(BRANCH, activePath === doc.path && 'after:border-primary after:delay-200')}>
                <SidebarMenuSubButton asChild isActive={activePath === doc.path} className="data-[active=true]:bg-transparent data-[active=true]:text-primary">
                  <Link href={`${prefix}/${doc.path}`}>
                    <span className="min-w-0 flex-1">{doc.title}</span>
                    {completed.has(doc.path) && <DoneCheck key={doc.path} path={doc.path} />}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </BranchList>
        )}
      </SidebarMenuItem>
    )
  }
}

// Branched lesson list, after React Bits' BranchedMenu (reactbits.dev/micro/
// branched-menu, owner request 2026-11-21). Not the component itself: it
// renders buttons with a fixed row height, and these are links whose titles
// wrap. Same look: the list's left border is the trunk, each lesson gets a
// curved branch, and an orange line runs down the trunk to the current
// lesson, gliding when you move to another one.
const BRANCH =
  'after:pointer-events-none after:absolute after:-left-[11px] after:top-[calc(50%-8px)] after:h-2 after:w-4 after:rounded-bl-[8px] after:border-b after:border-l after:border-border after:transition-colors after:duration-200'

function BranchList({ activePath, children }: { activePath: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    const ul = ref.current
    if (!ul) return
    const place = () => {
      const li = ul.querySelector<HTMLElement>('[data-active=true]')?.closest('li')
      ul.style.setProperty('--reach', li ? `${li.offsetTop + li.offsetHeight / 2 - 8}px` : '0px')
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(ul)
    return () => ro.disconnect()
  }, [activePath])
  return (
    <SidebarMenuSub
      ref={ref}
      className="relative before:pointer-events-none before:absolute before:-left-px before:top-0 before:h-(--reach,0px) before:w-px before:bg-primary before:transition-[height] before:duration-500 before:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:before:transition-none"
    >
      {children}
    </SidebarMenuSub>
  )
}
