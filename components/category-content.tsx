import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getSidebarTree } from '@/lib/content'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { MagicCard } from '@/components/magic/magic-card'

export async function loadCategory(slug: string, locale: Locale) {
  const categories = await getSidebarTree(locale)
  const category = categories.find(c => c.slug === slug)
  if (!category || category.docs.length === 0) notFound()
  return category
}

// Rendered inside layout.tsx's flex row alongside the (already-loaded)
// sidebar — same "only render what changes" split as LessonContent.
export async function CategoryContent({ slug, locale }: { slug: string; locale: Locale }) {
  const category = await loadCategory(slug, locale)
  const Icon = CATEGORY_ICONS[category.slug]
  const s = t(locale)
  const prefix = locale === 'bn' ? '/bn' : ''

  return (
    <main className="min-w-0 flex-1 py-8">
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent">
          {Icon && <Icon className="size-7" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {category.docs.length} {category.docs.length === 1 ? s.lesson : s.lessons}
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.docs.map((doc, i) => (
          <MagicCard key={doc.path} className="rounded-xl" glow>
            <Link
              href={`${prefix}/${doc.path}`}
              className="group flex items-center gap-4 rounded-xl bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                {i + 1}
              </span>
              <span className="min-w-0 font-medium group-hover:text-primary">{doc.title}</span>
              <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </MagicCard>
        ))}
      </div>
    </main>
  )
}
