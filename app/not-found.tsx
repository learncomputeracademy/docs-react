import Link from 'next/link'
import { ArrowRight, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroReveal } from '@/components/magic/hero-reveal'
import { ShimmerButton } from '@/components/magic/shimmer-button'
import { BorderBeam } from '@/components/magic/border-beam'
import { NumberTicker } from '@/components/magic/number-ticker'

// Global catch-all — rendered inside the root layout, so the usual
// SiteHeader/SiteFooter frame it. One page, English only, same as the old
// Jekyll site's single 404.html (docs/URLS.md) — no per-locale variant
// added since nothing here calls notFound() with a Bengali-specific path
// today.
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <HeroReveal>
        <div className="relative isolate mx-auto w-fit rounded-2xl border bg-card px-10 py-6">
          <BorderBeam />
          <span className="text-7xl font-bold tracking-tight sm:text-8xl">
            <NumberTicker value={404} />
          </span>
        </div>

        <h1 className="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">Lost in the syllabus?</h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist — it may have moved, or the URL might be off.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ShimmerButton asChild>
            <Link href="/">
              Back to home <ArrowRight className="size-4" />
            </Link>
          </ShimmerButton>
          <Button variant="outline" asChild>
            <Link href="/#subjects">
              <Compass className="size-4" /> Browse subjects
            </Link>
          </Button>
        </div>
      </HeroReveal>
    </main>
  )
}
