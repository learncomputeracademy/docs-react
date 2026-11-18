'use client'

import { useMemo, useState } from 'react'
import { pvs } from '@/lib/protocols-i18n'
import { flatten } from '@/lib/protocols/net'
import { hex, size, type Layer, type LayerKind } from '@/lib/protocols/packet'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

// ── packet inspector ────────────────────────────────────────────────────
const LAYER_STYLE: Record<LayerKind, { chip: string; byte: string; on: string }> = {
  link: { chip: 'border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300', byte: 'bg-slate-500/10', on: 'bg-slate-600 text-white' },
  ip: { chip: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300', byte: 'bg-sky-500/10', on: 'bg-sky-600 text-white' },
  transport: { chip: 'border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300', byte: 'bg-violet-500/10', on: 'bg-violet-600 text-white' },
  app: { chip: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300', byte: 'bg-amber-500/10', on: 'bg-amber-600 text-white' },
}

export function Inspector({ layers, locale }: { layers: Layer[]; locale: Locale }) {
  const s = pvs(locale)
  const [active, setActive] = useState<string | null>(null)
  const { bytes, fields } = useMemo(() => flatten(layers), [layers])
  const id = (l: number, fi: number) => `${l}:${fi}`
  const current = fields.find((x) => id(x.layer, x.field) === active)
  const currentField = current ? layers[current.layer].fields[current.field] : null

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        {layers.map((layer, li) => (
          <div key={li} className={cn('overflow-hidden rounded-md border', LAYER_STYLE[layer.kind].chip)}>
            <div className="flex items-baseline justify-between gap-2 px-2.5 py-1.5 text-xs font-semibold">
              <span>{layer.name} <span className="font-normal opacity-70">· {s.layers[layer.kind]}</span></span>
              <span className="font-mono font-normal tabular-nums opacity-70">{size(layer.fields)} {s.bytes}</span>
            </div>
            <div className="divide-y bg-background text-foreground">
              {layer.fields.map((fd, fi) => (
                <button
                  key={fi}
                  type="button"
                  onMouseEnter={() => setActive(id(li, fi))}
                  onFocus={() => setActive(id(li, fi))}
                  onClick={() => setActive(id(li, fi))}
                  className={cn('flex w-full items-baseline justify-between gap-3 px-2.5 py-1 text-left text-xs transition-colors', active === id(li, fi) ? 'bg-muted' : 'hover:bg-muted/50')}
                >
                  <span className="shrink-0 text-muted-foreground">{fd.name}</span>
                  <span className="min-w-0 break-words text-right font-mono">{fd.value}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
        <div className="min-h-28 rounded-md border bg-muted/40 p-3 text-sm" aria-live="polite">
          {currentField && current ? (
            <>
              <p className="flex flex-wrap items-baseline gap-x-2 font-semibold">
                {currentField.name}
                <span className={cn('rounded border px-1.5 py-0.5 text-xs font-medium', LAYER_STYLE[layers[current.layer].kind].chip)}>{layers[current.layer].name}</span>
                <span className="font-mono text-xs font-normal text-muted-foreground">{current.length} {s.bytes}</span>
              </p>
              <p className="mt-1.5 text-muted-foreground">{currentField.note[locale]}</p>
            </>
          ) : (
            <p className="text-muted-foreground">{s.fieldHint}</p>
          )}
        </div>

        <div>
          <p className="mb-1.5 flex items-baseline justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>{s.hexView}</span>
            <span className="font-mono font-normal normal-case tabular-nums">{s.total}: {bytes.length} {s.bytes}</span>
          </p>
          <div className="max-h-80 overflow-y-auto rounded-md border bg-background p-2 font-mono text-xs leading-6">
            {fields.map((x) => {
              const kind = layers[x.layer].kind
              const fid = id(x.layer, x.field)
              const chunk = bytes.slice(x.offset, x.offset + x.length)
              // a long run of one value (DHCP's 192 zero bytes) is one token
              const run = chunk.length > 24 && chunk.every((b) => b === chunk[0])
              return (
                <span
                  key={fid}
                  onMouseEnter={() => setActive(fid)}
                  onClick={() => setActive(fid)}
                  className={cn('cursor-pointer rounded-sm transition-colors [box-decoration-break:clone]', active === fid ? LAYER_STYLE[kind].on : LAYER_STYLE[kind].byte)}
                >
                  {run ? ` ${hex(chunk[0])} × ${chunk.length} ` : chunk.map((b) => ` ${hex(b)}`).join('') + ' '}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
