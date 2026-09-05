import Link from 'next/link'
import { Box, Layers, Palette, LayoutGrid, MousePointer2, Ruler, Contrast, Grid3x3, Scaling, ArrowLeftRight, Sparkles, Droplets, Eye, SwatchBook, Type, Image as ImageIcon, Clapperboard, Binary, NotebookText, Layers3, FunctionSquare, Boxes, Search, GitBranch, ListOrdered, Database, FileCode2, ArrowRight } from 'lucide-react'
import { tis, type ToolEntry } from '@/lib/tools-index-i18n'
import type { Locale } from '@/lib/types'
import { MagicCard } from '@/components/magic/magic-card'
import { ProximityGrid } from '@/components/magic/proximity-grid'

const ICONS = { Box, Layers, Palette, LayoutGrid, MousePointer2, Ruler, Contrast, Grid3x3, Scaling, ArrowLeftRight, Sparkles, Droplets, Eye, SwatchBook, Type, ImageIcon, Clapperboard, Binary, NotebookText, Layers3, FunctionSquare, Boxes, Search, GitBranch, ListOrdered, Database, FileCode2 }

function ToolCard({ tool, locale, openLabel }: { tool: ToolEntry; locale: Locale; openLabel: string }) {
  const Icon = ICONS[tool.icon]
  const href = locale === 'bn' ? `/bn/tools/${tool.slug}` : `/tools/${tool.slug}`
  return (
    <MagicCard className="rounded-xl" glow>
      <Link
        href={href}
        className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5"
      >
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold">{tool.name}</h2>
          {/* line-clamp-3, not the full text — descriptions range ~110-250
              chars (deliberately, some tools have more to say than others),
              which made cards in the same row 3 lines vs 4+ lines tall
              (user report). Clamping to a fixed count is the standard
              card-grid fix: every card is the same height regardless of
              copy length, at the cost of an ellipsis on the longer ones. */}
          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{tool.description}</p>
        </div>
        <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary">
          {openLabel} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </MagicCard>
  )
}

export function ToolsIndex({ locale }: { locale: Locale }) {
  const s = tis(locale)
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{s.title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{s.subtitle}</p>
      <ProximityGrid className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} locale={locale} openLabel={s.openTool} />
        ))}
      </ProximityGrid>
    </div>
  )
}
