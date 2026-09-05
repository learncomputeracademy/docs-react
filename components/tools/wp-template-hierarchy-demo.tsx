'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, FileCheck2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/tools/tool-controls'
import { wths } from '@/lib/wp-template-hierarchy-i18n'
import { QUERY_TYPES, type QueryTypeId } from '@/lib/wp-template-hierarchy'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

export function WpTemplateHierarchyDemo({ locale }: { locale: Locale }) {
  const s = wths(locale)
  const [typeId, setTypeId] = useState<QueryTypeId>('single-post')
  const [exists, setExists] = useState<Record<string, boolean>>({})

  const type = QUERY_TYPES.find((t) => t.id === typeId)!
  const indexFile = type.chain[type.chain.length - 1] // always index.php, always exists
  const winner = type.chain.find((f) => f === indexFile || exists[f]) ?? indexFile

  function selectType(id: QueryTypeId) {
    setTypeId(id)
    setExists({})
  }
  function toggle(file: string) {
    if (file === indexFile) return
    setExists((prev) => ({ ...prev, [file]: !prev[file] }))
  }
  function checkAll() {
    const next: Record<string, boolean> = {}
    for (const f of type.chain) next[f] = true
    setExists(next)
  }
  function uncheckAll() {
    setExists({})
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/wordpress/template-hierarchy' : '/wordpress/template-hierarchy'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[16rem_1fr]">
        <Section title={s.requestType}>
          <div className="grid grid-cols-1 gap-1.5">
            {QUERY_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectType(t.id)}
                className={cn(
                  'rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors',
                  t.id === typeId ? 'border-primary/50 bg-accent font-medium' : 'hover:border-primary/30 hover:bg-accent/50'
                )}
              >
                <div>{locale === 'bn' ? t.labelBn : t.label}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{locale === 'bn' ? t.exampleBn : t.example}</div>
              </button>
            ))}
          </div>
        </Section>

        <div className="space-y-3">
          <Section
            title={s.chain}
            action={
              <div className="flex gap-2 normal-case">
                <button type="button" onClick={checkAll} className="text-primary hover:underline">{s.resetAll}</button>
                <button type="button" onClick={uncheckAll} className="text-muted-foreground hover:underline">{s.uncheckAll}</button>
              </div>
            }
          >
            <p className="text-xs text-muted-foreground">{s.chainHint}</p>
            <ol className="space-y-2">
              {type.chain.map((file, i) => {
                const isWinner = file === winner
                const checked = file === indexFile || !!exists[file]
                return (
                  <li key={file} className="flex items-center gap-3">
                    <span className="w-4 shrink-0 text-center text-xs text-muted-foreground">{i + 1}</span>
                    <label
                      className={cn(
                        'flex flex-1 items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors',
                        isWinner ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/40'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={checked} disabled={file === indexFile} onChange={() => toggle(file)} />
                        <code className="text-sm">{file}</code>
                      </span>
                      {isWinner && (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary">
                          <FileCheck2 className="size-3.5" /> {s.winner}
                        </span>
                      )}
                    </label>
                  </li>
                )
              })}
            </ol>
          </Section>

          <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{s.placeholderNote}</p>
        </div>
      </div>
    </div>
  )
}
