'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Copy, Check, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl } from '@/components/tools/tool-controls'
import { wegs } from '@/lib/wp-enqueue-generator-i18n'
import type { Locale } from '@/lib/types'

type Kind = 'style' | 'script'
type VersionMode = 'filemtime' | 'static' | 'none'
type Asset = {
  id: string
  kind: Kind
  handle: string
  path: string
  deps: string
  versionMode: VersionMode
  versionValue: string
  inFooter: boolean
  media: string
}

let uid = 0
function newId() { uid += 1; return `a${uid}` }

function makeAsset(kind: Kind): Asset {
  return {
    id: newId(), kind,
    handle: kind === 'style' ? 'mytheme-style' : 'mytheme-main',
    path: kind === 'style' ? '/css/style.css' : '/js/main.js',
    deps: kind === 'script' ? 'jquery' : '',
    versionMode: 'filemtime', versionValue: '1.0.0',
    inFooter: true, media: 'all',
  }
}

const DEFAULT_ASSETS: Asset[] = [
  { id: 'default-1', kind: 'style', handle: 'mytheme-style', path: '/css/style.css', deps: '', versionMode: 'filemtime', versionValue: '1.0.0', inFooter: true, media: 'all' },
  { id: 'default-2', kind: 'script', handle: 'mytheme-main', path: '/js/main.js', deps: 'jquery', versionMode: 'filemtime', versionValue: '1.0.0', inFooter: true, media: 'all' },
]

function depsArray(deps: string): string {
  const list = deps.split(',').map((d) => d.trim()).filter(Boolean)
  return list.length ? `array( ${list.map((d) => `'${d}'`).join(', ')} )` : 'array()'
}

function versionExpr(a: Asset): string {
  if (a.versionMode === 'none') return 'null'
  if (a.versionMode === 'static') return `'${a.versionValue}'`
  return `filemtime( $dir . '${a.path}' )`
}

function buildPhp(functionName: string, directoryUriFn: string, directoryPathFn: string, assets: Asset[]): string {
  const lines = assets.map((a) => {
    if (a.kind === 'style') {
      const mediaArg = a.media !== 'all' ? `, '${a.media}'` : ''
      return `    wp_enqueue_style( '${a.handle}', $uri . '${a.path}', ${depsArray(a.deps)}, ${versionExpr(a)}${mediaArg} );`
    }
    return `    wp_enqueue_script( '${a.handle}', $uri . '${a.path}', ${depsArray(a.deps)}, ${versionExpr(a)}, ${a.inFooter ? 'true' : 'false'} );`
  })

  return `function ${functionName}() {\n    $uri = ${directoryUriFn}();\n    $dir = ${directoryPathFn}();\n\n${lines.join('\n')}\n}\nadd_action( 'wp_enqueue_scripts', '${functionName}' );`
}

export function WpEnqueueGeneratorDemo({ locale }: { locale: Locale }) {
  const s = wegs(locale)
  const [functionName, setFunctionName] = useState('mytheme_enqueue_assets')
  const [directory, setDirectory] = useState<'template' | 'stylesheet'>('template')
  const [assets, setAssets] = useState<Asset[]>(DEFAULT_ASSETS)
  const [copied, setCopied] = useState(false)

  const directoryUriFn = directory === 'template' ? 'get_template_directory_uri' : 'get_stylesheet_directory_uri'
  const directoryPathFn = directory === 'template' ? 'get_template_directory' : 'get_stylesheet_directory'
  const code = useMemo(() => buildPhp(functionName, directoryUriFn, directoryPathFn, assets), [functionName, directoryUriFn, directoryPathFn, assets])

  function update(id: string, patch: Partial<Asset>) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }
  function remove(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id))
  }
  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/wordpress/enqueuing-assets' : '/wordpress/enqueuing-assets'}>{s.lessonCta} <ArrowRight className="size-3.5" /></Link>
        </Button>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_28rem]">
        <div className="space-y-4">
          <Section title={s.functionName}>
            <input type="text" value={functionName} onChange={(e) => setFunctionName(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
            <div className="mt-3">
              <span className="mb-1 block text-xs text-muted-foreground">{s.directoryFn}</span>
              <SegmentedControl
                value={directory}
                onChange={setDirectory}
                options={[{ value: 'template', label: 'get_template_directory_uri()' }, { value: 'stylesheet', label: 'get_stylesheet_directory_uri()' }]}
              />
              <p className="mt-1 text-xs text-muted-foreground">{s.directoryHint}</p>
            </div>
          </Section>

          <Section
            title={s.assets}
            action={
              <div className="flex gap-2 normal-case">
                <button type="button" onClick={() => setAssets((p) => [...p, makeAsset('style')])} className="flex items-center gap-1 text-primary hover:underline"><Plus className="size-3" />{s.addStyle}</button>
                <button type="button" onClick={() => setAssets((p) => [...p, makeAsset('script')])} className="flex items-center gap-1 text-primary hover:underline"><Plus className="size-3" />{s.addScript}</button>
              </div>
            }
          >
            {assets.map((a) => (
              <div key={a.id} className="space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">{a.kind}</span>
                  <button type="button" onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{s.handle}</span>
                  <input type="text" value={a.handle} onChange={(e) => update(a.id, { handle: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{s.path}</span>
                  <input type="text" value={a.path} onChange={(e) => update(a.id, { path: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{s.deps}</span>
                  <input type="text" value={a.deps} onChange={(e) => update(a.id, { deps: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
                </label>
                <div>
                  <span className="mb-1 block text-xs text-muted-foreground">{s.versionMode}</span>
                  <SegmentedControl
                    value={a.versionMode}
                    onChange={(v) => update(a.id, { versionMode: v })}
                    options={[{ value: 'filemtime', label: s.versionFilemtime }, { value: 'static', label: s.versionStatic }, { value: 'none', label: s.versionNone }]}
                  />
                  {a.versionMode === 'filemtime' && <p className="mt-1 text-xs text-muted-foreground">{s.versionFilemtimeHint}</p>}
                  {a.versionMode === 'static' && (
                    <input type="text" value={a.versionValue} onChange={(e) => update(a.id, { versionValue: e.target.value })} className="mt-1.5 w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" />
                  )}
                </div>
                {a.kind === 'script' ? (
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={a.inFooter} onChange={(e) => update(a.id, { inFooter: e.target.checked })} />{s.inFooter}</label>
                ) : (
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{s.media}</span>
                    <select value={a.media} onChange={(e) => update(a.id, { media: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                      {['all', 'screen', 'print'].map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </label>
                )}
              </div>
            ))}
          </Section>
        </div>

        <div>
          <Section title={s.generatedCode}>
            <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{code}</code></pre>
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
