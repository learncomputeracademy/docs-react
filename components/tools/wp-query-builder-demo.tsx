'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Copy, Check, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl } from '@/components/tools/tool-controls'
import { wqbs } from '@/lib/wp-query-builder-i18n'
import type { Locale } from '@/lib/types'

type TaxRow = { id: string; taxonomy: string; field: 'slug' | 'term_id' | 'name'; terms: string; operator: 'IN' | 'NOT IN' | 'AND' }
type MetaRow = { id: string; key: string; value: string; compare: string; type: string }
type DateMode = 'none' | 'simple' | 'range'
type Fields = 'all' | 'ids' | 'id=>parent'

type State = {
  postType: string
  postStatus: string[]
  postsPerPage: number
  paged: number
  offset: number
  orderby: string
  order: 'ASC' | 'DESC'
  ignoreSticky: boolean
  categoryName: string
  categoryNotIn: string
  tag: string
  tagNotIn: string
  taxRows: TaxRow[]
  taxRelation: 'AND' | 'OR'
  authorName: string
  authorNotIn: string
  search: string
  metaRows: MetaRow[]
  metaRelation: 'AND' | 'OR'
  dateMode: DateMode
  dateYear: string
  dateMonth: string
  dateDay: string
  dateAfter: string
  dateBefore: string
  dateInclusive: boolean
  excludeCurrent: boolean
  fields: Fields
  disableCacheResults: boolean
  disableMetaCache: boolean
  disableTermCache: boolean
}

const DEFAULT_STATE: State = {
  postType: 'post', postStatus: ['publish'], postsPerPage: 6, paged: 1, offset: 0,
  orderby: 'date', order: 'DESC', ignoreSticky: false,
  categoryName: '', categoryNotIn: '', tag: '', tagNotIn: '',
  taxRows: [], taxRelation: 'AND',
  authorName: '', authorNotIn: '', search: '',
  metaRows: [], metaRelation: 'AND',
  dateMode: 'none', dateYear: '', dateMonth: '', dateDay: '', dateAfter: '', dateBefore: '', dateInclusive: true,
  excludeCurrent: false, fields: 'all',
  disableCacheResults: false, disableMetaCache: false, disableTermCache: false,
}

const POST_STATUSES = ['publish', 'draft', 'pending', 'private', 'future', 'trash'] as const

// Add-row ids only ever come from this counter, called from client-only
// event handlers (never at module scope or inside a preset/DEFAULT_STATE
// object) — the exact gotcha documented in docs/TOOLS.md: a useState
// initializer that calls an id generator at definition time hydration-
// mismatches, since SSR and the client's hydration pass would each produce
// a different random-looking id for what's supposed to be the same row.
let rowUid = 0
function newRowId(prefix: string) { rowUid += 1; return `${prefix}${rowUid}` }

const PRESETS: Record<string, Partial<State>> = {
  latest: { postType: 'post', postsPerPage: 3, orderby: 'date', order: 'DESC' },
  category: { postType: 'post', postsPerPage: 6, orderby: 'date', order: 'DESC', categoryName: 'news' },
  cpt: { postType: 'product', postsPerPage: 12, orderby: 'title', order: 'ASC' },
  search: { postType: 'post', postsPerPage: 10, orderby: 'relevance', order: 'DESC', search: 'flexbox' },
  related: { postType: 'post', postsPerPage: 3, orderby: 'rand', order: 'DESC', tag: 'react', excludeCurrent: true },
  meta: {
    postType: 'post', postsPerPage: 6,
    metaRows: [{ id: 'meta-preset-1', key: 'featured', value: 'yes', compare: '=', type: 'CHAR' }],
  },
  dateRange: { postType: 'post', postsPerPage: 10, dateMode: 'range', dateAfter: '2026-01-01', dateBefore: '2026-12-31', dateInclusive: true },
  taxonomy: {
    postType: 'post', postsPerPage: 9,
    taxRows: [{ id: 'tax-preset-1', taxonomy: 'genre', field: 'slug', terms: 'thriller, mystery', operator: 'IN' }],
  },
}

function parseIntList(csv: string): number[] {
  return csv.split(',').map((s) => s.trim()).filter(Boolean).map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n))
}

function taxRowPhp(r: TaxRow): string {
  const terms = r.terms.split(',').map((t) => t.trim()).filter(Boolean).map((t) => `'${t}'`).join(', ')
  return `        array(\n            'taxonomy' => '${r.taxonomy}',\n            'field'    => '${r.field}',\n            'terms'    => array( ${terms} ),\n            'operator' => '${r.operator}',\n        ),`
}

function metaRowPhp(r: MetaRow): string {
  const typeLine = r.type !== 'CHAR' ? `\n            'type'    => '${r.type}',` : ''
  return `        array(\n            'key'     => '${r.key}',\n            'value'   => '${r.value}',\n            'compare' => '${r.compare}',${typeLine}\n        ),`
}

function buildPhp(st: State): string {
  const lines: string[] = [`'post_type'      => '${st.postType}',`]

  if (!(st.postStatus.length === 1 && st.postStatus[0] === 'publish')) {
    if (st.postStatus.length === 0) lines.push(`'post_status'    => 'any',`)
    else if (st.postStatus.length === 1) lines.push(`'post_status'    => '${st.postStatus[0]}',`)
    else lines.push(`'post_status'    => array( ${st.postStatus.map((s) => `'${s}'`).join(', ')} ),`)
  }

  lines.push(`'posts_per_page' => ${st.postsPerPage},`)
  if (st.paged > 1) lines.push(`'paged'          => ${st.paged},`)
  if (st.offset !== 0) lines.push(`'offset'         => ${st.offset},`)
  lines.push(`'orderby'        => '${st.orderby}',`)
  lines.push(`'order'          => '${st.order}',`)
  if (st.ignoreSticky) lines.push(`'ignore_sticky_posts' => true,`)

  if (st.categoryName) lines.push(`'category_name'  => '${st.categoryName}',`)
  const catNotIn = parseIntList(st.categoryNotIn)
  if (catNotIn.length) lines.push(`'category__not_in' => array( ${catNotIn.join(', ')} ),`)
  if (st.tag) lines.push(`'tag'            => '${st.tag}',`)
  const tagNotIn = parseIntList(st.tagNotIn)
  if (tagNotIn.length) lines.push(`'tag__not_in'    => array( ${tagNotIn.join(', ')} ),`)

  if (st.taxRows.length) {
    const rows = st.taxRows.map(taxRowPhp).join('\n')
    const relationLine = st.taxRows.length > 1 ? `        'relation' => '${st.taxRelation}',\n` : ''
    lines.push(`'tax_query'      => array(\n${relationLine}${rows}\n    ),`)
  }

  if (st.authorName) lines.push(`'author_name'    => '${st.authorName}',`)
  const authNotIn = parseIntList(st.authorNotIn)
  if (authNotIn.length) lines.push(`'author__not_in' => array( ${authNotIn.join(', ')} ),`)

  if (st.search) lines.push(`'s'              => '${st.search}',`)

  if (st.metaRows.length) {
    const rows = st.metaRows.map(metaRowPhp).join('\n')
    const relationLine = st.metaRows.length > 1 ? `        'relation' => '${st.metaRelation}',\n` : ''
    lines.push(`'meta_query'     => array(\n${relationLine}${rows}\n    ),`)
  }

  if (st.dateMode === 'simple' && (st.dateYear || st.dateMonth || st.dateDay)) {
    const parts: string[] = []
    if (st.dateYear) parts.push(`'year'  => ${st.dateYear}`)
    if (st.dateMonth) parts.push(`'month' => ${st.dateMonth}`)
    if (st.dateDay) parts.push(`'day'   => ${st.dateDay}`)
    lines.push(`'date_query'     => array(\n        array( ${parts.join(', ')} ),\n    ),`)
  } else if (st.dateMode === 'range' && (st.dateAfter || st.dateBefore)) {
    const parts: string[] = []
    if (st.dateAfter) parts.push(`'after'     => '${st.dateAfter}'`)
    if (st.dateBefore) parts.push(`'before'    => '${st.dateBefore}'`)
    parts.push(`'inclusive' => ${st.dateInclusive ? 'true' : 'false'}`)
    lines.push(`'date_query'     => array(\n        array( ${parts.join(', ')} ),\n    ),`)
  }

  if (st.excludeCurrent) lines.push(`'post__not_in'   => array( get_the_ID() ),`)
  if (st.fields !== 'all') lines.push(`'fields'         => '${st.fields}',`)
  if (st.disableCacheResults) lines.push(`'cache_results'  => false,`)
  if (st.disableMetaCache) lines.push(`'update_post_meta_cache' => false,`)
  if (st.disableTermCache) lines.push(`'update_post_term_cache' => false,`)

  return `$query = new WP_Query( array(\n    ${lines.join('\n    ')}\n) );\n\nif ( $query->have_posts() ) :\n    while ( $query->have_posts() ) : $query->the_post();\n        // your markup here\n        the_title();\n    endwhile;\n    wp_reset_postdata();\nendif;`
}

function textInput(value: string, onChange: (v: string) => void, mono = true) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-md border bg-background px-2 py-1.5 text-sm ${mono ? 'font-mono' : ''}`}
    />
  )
}

export function WpQueryBuilderDemo({ locale }: { locale: Locale }) {
  const s = wqbs(locale)
  const [st, setSt] = useState<State>(DEFAULT_STATE)
  const [copied, setCopied] = useState(false)

  const code = useMemo(() => buildPhp(st), [st])
  function set<K extends keyof State>(key: K, value: State[K]) {
    setSt((prev) => ({ ...prev, [key]: value }))
  }
  function applyPreset(key: keyof typeof PRESETS) {
    setSt({ ...DEFAULT_STATE, ...PRESETS[key] })
  }
  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function toggleStatus(status: string) {
    setSt((prev) => ({
      ...prev,
      postStatus: prev.postStatus.includes(status) ? prev.postStatus.filter((x) => x !== status) : [...prev.postStatus, status],
    }))
  }

  function addTaxRow() {
    setSt((prev) => ({ ...prev, taxRows: [...prev.taxRows, { id: newRowId('tax'), taxonomy: 'genre', field: 'slug', terms: '', operator: 'IN' }] }))
  }
  function updateTaxRow(id: string, patch: Partial<TaxRow>) {
    setSt((prev) => ({ ...prev, taxRows: prev.taxRows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }))
  }
  function removeTaxRow(id: string) {
    setSt((prev) => ({ ...prev, taxRows: prev.taxRows.filter((r) => r.id !== id) }))
  }

  function addMetaRow() {
    setSt((prev) => ({ ...prev, metaRows: [...prev.metaRows, { id: newRowId('meta'), key: '', value: '', compare: '=', type: 'CHAR' }] }))
  }
  function updateMetaRow(id: string, patch: Partial<MetaRow>) {
    setSt((prev) => ({ ...prev, metaRows: prev.metaRows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }))
  }
  function removeMetaRow(id: string) {
    setSt((prev) => ({ ...prev, metaRows: prev.metaRows.filter((r) => r.id !== id) }))
  }

  const presetLabels: [keyof typeof PRESETS, string][] = [
    ['latest', s.presetLatest], ['category', s.presetCategory], ['cpt', s.presetCpt], ['search', s.presetSearch],
    ['related', s.presetRelated], ['meta', s.presetMeta], ['dateRange', s.presetDate], ['taxonomy', s.presetTaxonomy],
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/wordpress/the-loop' : '/wordpress/the-loop'}>{s.lessonCta} <ArrowRight className="size-3.5" /></Link>
        </Button>
      </header>

      <p className="mx-auto mt-4 max-w-3xl rounded-md bg-muted/50 px-3 py-2 text-center text-xs text-muted-foreground">{s.note}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_28rem]">
        {/* min-w-0 on both grid items: a `1fr`/fixed-width grid column's
            default min-width:auto lets a long unwrapped line (the <pre>
            output, potentially several nested-array lines wide) force the
            track past its share and overflow the whole page — the exact
            bug caught and fixed on the SERP Previewer (D-131). */}
        <div className="min-w-0 space-y-4">
          <Section title={s.presets}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {presetLabels.map(([key, label]) => (
                <button key={key} type="button" onClick={() => applyPreset(key)} className="rounded-md border p-2 text-left text-xs hover:border-primary/50 hover:bg-accent/50">
                  {label}
                </button>
              ))}
            </div>
          </Section>

          <Section title={s.postSelection}>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.postType}</span>
              {textInput(st.postType, (v) => set('postType', v))}
              <span className="mt-0.5 block text-xs text-muted-foreground">{s.postTypeHint}</span>
            </label>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.postStatus}</span>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {POST_STATUSES.map((status) => (
                  <label key={status} className="flex items-center gap-1.5 text-xs">
                    <input type="checkbox" checked={st.postStatus.includes(status)} onChange={() => toggleStatus(status)} />
                    {status}
                  </label>
                ))}
              </div>
              <span className="mt-0.5 block text-xs text-muted-foreground">{s.postStatusHint}</span>
            </div>
          </Section>

          <Section title={s.paginationOrder}>
            <div className="grid grid-cols-3 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.postsPerPage}</span>
                <input type="number" value={st.postsPerPage} onChange={(e) => set('postsPerPage', Number(e.target.value))} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.paged}</span>
                <input type="number" min={1} value={st.paged} onChange={(e) => set('paged', Number(e.target.value))} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.offset}</span>
                <input type="number" value={st.offset} onChange={(e) => set('offset', Number(e.target.value))} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
              </label>
            </div>
            {st.paged > 1 && <p className="text-xs text-muted-foreground">{s.pagedHint}</p>}
            {st.offset !== 0 && st.paged > 1 && <p className="text-xs text-destructive">{s.offsetHint}</p>}
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.orderby}</span>
                <select value={st.orderby} onChange={(e) => set('orderby', e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                  {['date', 'title', 'menu_order', 'rand', 'relevance', 'meta_value', 'meta_value_num', 'ID', 'author', 'modified', 'comment_count'].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.order}</span>
                <SegmentedControl value={st.order} onChange={(v) => set('order', v)} options={[{ value: 'DESC', label: 'DESC' }, { value: 'ASC', label: 'ASC' }]} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={st.ignoreSticky} onChange={(e) => set('ignoreSticky', e.target.checked)} />
              {s.ignoreStickyPosts}
            </label>
            {st.ignoreSticky && <p className="text-xs text-muted-foreground">{s.ignoreStickyPostsHint}</p>}
          </Section>

          <Section title={s.categoryTag}>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.categoryName}</span>
                {textInput(st.categoryName, (v) => set('categoryName', v))}
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.categoryNotIn}</span>
                {textInput(st.categoryNotIn, (v) => set('categoryNotIn', v))}
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.tag}</span>
                {textInput(st.tag, (v) => set('tag', v))}
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.tagNotIn}</span>
                {textInput(st.tagNotIn, (v) => set('tagNotIn', v))}
              </label>
            </div>
          </Section>

          <Section title={s.taxonomyQuery} action={<button type="button" onClick={addTaxRow} className="flex items-center gap-1 text-primary normal-case hover:underline"><Plus className="size-3" />{s.addRow}</button>}>
            <p className="text-xs text-muted-foreground">{s.taxonomyQueryHint}</p>
            {st.taxRows.map((row) => (
              <div key={row.id} className="space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">{s.taxonomy}</span>
                  <button type="button" onClick={() => removeTaxRow(row.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.taxonomy}</span>
                    {textInput(row.taxonomy, (v) => updateTaxRow(row.id, { taxonomy: v }))}
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.field}</span>
                    <select value={row.field} onChange={(e) => updateTaxRow(row.id, { field: e.target.value as TaxRow['field'] })} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                      {['slug', 'term_id', 'name'].map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{s.terms}</span>
                  {textInput(row.terms, (v) => updateTaxRow(row.id, { terms: v }))}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{s.operator}</span>
                  <SegmentedControl value={row.operator} onChange={(v) => updateTaxRow(row.id, { operator: v })} options={[{ value: 'IN', label: 'IN' }, { value: 'NOT IN', label: 'NOT IN' }, { value: 'AND', label: 'AND' }]} />
                </label>
              </div>
            ))}
            {st.taxRows.length > 1 && (
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.relation}</span>
                <SegmentedControl value={st.taxRelation} onChange={(v) => set('taxRelation', v)} options={[{ value: 'AND', label: 'AND' }, { value: 'OR', label: 'OR' }]} />
              </label>
            )}
          </Section>

          <Section title={s.authorSection}>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.authorName}</span>
                {textInput(st.authorName, (v) => set('authorName', v))}
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.authorNotIn}</span>
                {textInput(st.authorNotIn, (v) => set('authorNotIn', v))}
              </label>
            </div>
          </Section>

          <Section title={s.searchSection}>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.searchKeyword}</span>
              {textInput(st.search, (v) => set('search', v))}
            </label>
          </Section>

          <Section title={s.metaQuery} action={<button type="button" onClick={addMetaRow} className="flex items-center gap-1 text-primary normal-case hover:underline"><Plus className="size-3" />{s.addRow}</button>}>
            <p className="text-xs text-muted-foreground">{s.metaQueryHint}</p>
            {st.metaRows.map((row) => (
              <div key={row.id} className="space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-end">
                  <button type="button" onClick={() => removeMetaRow(row.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.metaKey}</span>
                    {textInput(row.key, (v) => updateMetaRow(row.id, { key: v }))}
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.metaValue}</span>
                    {textInput(row.value, (v) => updateMetaRow(row.id, { value: v }))}
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.compare}</span>
                    <select value={row.compare} onChange={(e) => updateMetaRow(row.id, { compare: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                      {['=', '!=', '>', '>=', '<', '<=', 'LIKE', 'NOT LIKE', 'EXISTS', 'NOT EXISTS'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.type}</span>
                    <select value={row.type} onChange={(e) => updateMetaRow(row.id, { type: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                      {['CHAR', 'NUMERIC', 'DATE', 'DATETIME', 'DECIMAL'].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            ))}
            {st.metaRows.length > 1 && (
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.relation}</span>
                <SegmentedControl value={st.metaRelation} onChange={(v) => set('metaRelation', v)} options={[{ value: 'AND', label: 'AND' }, { value: 'OR', label: 'OR' }]} />
              </label>
            )}
          </Section>

          <Section title={s.dateQuery}>
            <SegmentedControl
              value={st.dateMode}
              onChange={(v) => set('dateMode', v)}
              options={[{ value: 'none', label: s.dateModeNone }, { value: 'simple', label: s.dateModeSimple }, { value: 'range', label: s.dateModeRange }]}
            />
            {st.dateMode === 'simple' && (
              <div className="grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{s.year}</span>
                  {textInput(st.dateYear, (v) => set('dateYear', v))}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{s.month}</span>
                  {textInput(st.dateMonth, (v) => set('dateMonth', v))}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{s.day}</span>
                  {textInput(st.dateDay, (v) => set('dateDay', v))}
                </label>
              </div>
            )}
            {st.dateMode === 'range' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.after}</span>
                    <input type="date" value={st.dateAfter} onChange={(e) => set('dateAfter', e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.before}</span>
                    <input type="date" value={st.dateBefore} onChange={(e) => set('dateBefore', e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={st.dateInclusive} onChange={(e) => set('dateInclusive', e.target.checked)} />
                  {s.inclusive}
                </label>
              </>
            )}
          </Section>

          <Section title={s.otherOptions}>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={st.excludeCurrent} onChange={(e) => set('excludeCurrent', e.target.checked)} />{s.excludeCurrent}</label>
            {st.excludeCurrent && <p className="text-xs text-muted-foreground">{s.excludeCurrentHint}</p>}
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.fields}</span>
              <select value={st.fields} onChange={(e) => set('fields', e.target.value as Fields)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                <option value="all">{s.fieldsAll}</option>
                <option value="ids">{s.fieldsIds}</option>
                <option value="id=>parent">{s.fieldsIdParent}</option>
              </select>
            </label>
          </Section>

          <Section title={s.performance}>
            <p className="text-xs text-muted-foreground">{s.performanceHint}</p>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={st.disableCacheResults} onChange={(e) => set('disableCacheResults', e.target.checked)} />{s.disableCacheResults}</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={st.disableMetaCache} onChange={(e) => set('disableMetaCache', e.target.checked)} />{s.disableMetaCache}</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={st.disableTermCache} onChange={(e) => set('disableTermCache', e.target.checked)} />{s.disableTermCache}</label>
          </Section>
        </div>

        <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <Section title={s.generatedCode}>
            <pre className="max-h-[70vh] overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{code}</code></pre>
            <Button size="sm" variant="outline" className="w-full" onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copy}
            </Button>
          </Section>
        </div>
      </div>
    </div>
  )
}
