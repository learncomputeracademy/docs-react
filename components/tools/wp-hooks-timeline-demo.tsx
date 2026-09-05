'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl } from '@/components/tools/tool-controls'
import { whts } from '@/lib/wp-hooks-timeline-i18n'
import { HOOK_TIMELINE, COMMON_FILTERS, HOOK_CATEGORIES } from '@/lib/wp-hooks-timeline'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

function refSnippet(hook: string, type: 'action' | 'filter') {
  return type === 'filter'
    ? `add_filter( '${hook}', function ( $value ) {\n    // modify $value here\n    return $value;\n} );`
    : `add_action( '${hook}', function () {\n    // your code here\n} );`
}

export function WpHooksTimelineDemo({ locale }: { locale: Locale }) {
  const s = whts(locale)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [categoryId, setCategoryId] = useState(HOOK_CATEGORIES[0].id)
  const [refHookName, setRefHookName] = useState(HOOK_CATEGORIES[0].hooks[0].hook)
  const [refCopied, setRefCopied] = useState(false)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= HOOK_TIMELINE.length - 1) { setPlaying(false); return i }
        return i + 1
      })
    }, 1400)
    return () => clearInterval(id)
  }, [playing])

  const current = HOOK_TIMELINE[index]
  const snippet = `add_action( '${current.hook}', function () {\n    // your code here\n} );`

  async function copy() {
    await navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const category = HOOK_CATEGORIES.find((c) => c.id === categoryId)!
  const refHook = category.hooks.find((h) => h.hook === refHookName) ?? category.hooks[0]
  const refSnippetText = refSnippet(refHook.hook, refHook.type)

  function selectCategory(id: string) {
    setCategoryId(id)
    setRefHookName(HOOK_CATEGORIES.find((c) => c.id === id)!.hooks[0].hook)
  }
  async function copyRef() {
    await navigator.clipboard.writeText(refSnippetText)
    setRefCopied(true)
    setTimeout(() => setRefCopied(false), 1500)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/wordpress/wordpress-hooks-actions-and-filters' : '/wordpress/wordpress-hooks-actions-and-filters'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* min-w-0: same grid-overflow gotcha documented on the query
            builder (D-131) — defensive here even though no long unwrapped
            line currently lives in this column. */}
        <Section className="min-w-0" title={s.actionsTitle} action={<span className="normal-case">{index + 1} / {HOOK_TIMELINE.length}</span>}>
          <p className="text-xs text-muted-foreground">{s.actionsHint}</p>
          <ol className="space-y-1.5">
            {HOOK_TIMELINE.map((step, i) => (
              <li key={step.hook}>
                <button
                  type="button"
                  onClick={() => { setIndex(i); setPlaying(false) }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors',
                    i === index ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/40 hover:bg-muted'
                  )}
                >
                  <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">{i + 1}</span>
                  <code className="text-sm font-medium">{step.hook}</code>
                </button>
              </li>
            ))}
          </ol>

          <div className="flex items-center justify-center gap-1.5 pt-1">
            <Button size="sm" variant="outline" onClick={() => { setPlaying(false); setIndex(0) }}><RotateCcw className="size-3.5" /></Button>
            <Button size="sm" variant="outline" disabled={index === 0} onClick={() => { setPlaying(false); setIndex((i) => Math.max(0, i - 1)) }}><ChevronLeft className="size-3.5" /> {s.prev}</Button>
            <Button size="sm" variant="outline" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />} {playing ? s.pause : s.play}
            </Button>
            <Button size="sm" variant="outline" disabled={index === HOOK_TIMELINE.length - 1} onClick={() => { setPlaying(false); setIndex((i) => Math.min(HOOK_TIMELINE.length - 1, i + 1)) }}>{s.next} <ChevronRight className="size-3.5" /></Button>
          </div>
        </Section>

        <div className="space-y-3">
          <Section title={current.hook}>
            <p className="text-sm">{locale === 'bn' ? current.noteBn : current.note}</p>
          </Section>
          <Section title={s.snippet}>
            <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{snippet}</code></pre>
            <Button size="sm" variant="outline" className="w-full" onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copy}
            </Button>
          </Section>
          <Section title={s.filtersTitle}>
            <p className="text-xs text-muted-foreground">{s.filtersHint}</p>
            <ul className="space-y-2">
              {COMMON_FILTERS.map((f) => (
                <li key={f.hook} className="rounded-md bg-muted/40 p-2">
                  <code className="text-xs font-medium">{f.hook}</code>
                  <p className="mt-0.5 text-xs text-muted-foreground">{locale === 'bn' ? f.noteBn : f.note}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">{s.refTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{s.refHint}</p>

        <div className="mt-4 flex flex-wrap gap-1 rounded-md bg-muted p-0.5">
          {HOOK_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCategory(c.id)}
              className={cn(
                'rounded px-2.5 py-1.5 text-xs transition-colors',
                c.id === categoryId ? 'bg-background font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {locale === 'bn' ? c.titleBn : c.title}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <Section className="min-w-0" title={locale === 'bn' ? category.titleBn : category.title}>
            <ul className="space-y-1.5">
              {category.hooks.map((h) => (
                <li key={h.hook}>
                  <button
                    type="button"
                    onClick={() => setRefHookName(h.hook)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition-colors',
                      h.hook === refHookName ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/40 hover:bg-muted'
                    )}
                  >
                    <code className="text-sm font-medium">{h.hook}</code>
                    <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase', h.type === 'filter' ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400')}>
                      {h.type === 'filter' ? s.filter : s.action}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>

          <div className="space-y-3">
            <Section title={refHook.hook}>
              <p className="text-sm">{locale === 'bn' ? refHook.noteBn : refHook.note}</p>
            </Section>
            <Section title={s.snippet}>
              <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{refSnippetText}</code></pre>
              <Button size="sm" variant="outline" className="w-full" onClick={copyRef}>
                {refCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {refCopied ? s.copied : s.copy}
              </Button>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
