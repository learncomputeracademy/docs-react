import Link from 'next/link'
import { Box, Layers, Palette, LayoutGrid, MousePointer2, Ruler, Contrast, ArrowRight } from 'lucide-react'
import { tis, type ToolEntry } from '@/lib/tools-index-i18n'
import type { Locale } from '@/lib/types'

const ICONS = { Box, Layers, Palette, LayoutGrid, MousePointer2, Ruler, Contrast }

function ToolCard({ tool, locale, openLabel }: { tool: ToolEntry; locale: Locale; openLabel: string }) {
  const Icon = ICONS[tool.icon]
  const href = locale === 'bn' ? `/bn/tools/${tool.slug}` : `/tools/${tool.slug}`
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="font-semibold">{tool.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
      </div>
      <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary">
        {openLabel} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

export function ToolsIndex({ locale }: { locale: Locale }) {
  const s = tis(locale)
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{s.title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{s.subtitle}</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} locale={locale} openLabel={s.openTool} />
        ))}
      </div>
    </div>
  )
}
