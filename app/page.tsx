import Link from 'next/link'
import { Cpu, PenTool, ArrowRight } from 'lucide-react'
import IconCss from '~icons/logos/css-3'
import IconHtml from '~icons/logos/html-5'
import IconJs from '~icons/logos/javascript'
import IconReact from '~icons/logos/react'
import IconPhotoshop from '~icons/logos/adobe-photoshop'
import { getSidebarTree } from '@/lib/content'
import { Button } from '@/components/ui/button'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  basics: Cpu,
  html: IconHtml,
  css: IconCss,
  javascript: IconJs,
  react: IconReact,
  design: PenTool,
  photoshop: IconPhotoshop,
}

export default async function Home() {
  const categories = await getSidebarTree()
  const firstLesson = categories.find(c => c.slug === 'html')?.docs[0] ?? categories[0]?.docs[0]

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b px-6 py-24 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Learn to build <span className="text-primary">for the web</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Free lessons on HTML, CSS, JavaScript, React, and graphic design — with runnable
          examples, for absolutely anyone.
        </p>
        {firstLesson && (
          <Button asChild size="lg" className="mt-8">
            <Link href={`/${firstLesson.path}`}>
              Start learning <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = ICONS[cat.slug] ?? Cpu
            const first = cat.docs[0]
            if (!first) return null // category-index pages are a fuller Stage 5 build-out, not this pass
            return (
              <Link
                key={cat.id}
                href={`/${first.path}`}
                className="group relative flex items-start gap-4 rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold">{cat.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {cat.docs.length} {cat.docs.length === 1 ? 'lesson' : 'lessons'}
                  </p>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 self-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
