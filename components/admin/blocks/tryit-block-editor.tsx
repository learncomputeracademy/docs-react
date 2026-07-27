'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildWebDoc, buildReactDoc } from '@/lib/tryit'

type Files = { html?: string; css?: string; js?: string; jsx?: string }
type Mode = 'web' | 'react'

const WEB_TABS: (keyof Files)[] = ['html', 'css', 'js']
const REACT_TABS: (keyof Files)[] = ['jsx', 'css']

// Deliberately not the public TryIt component (components/blocks/try-it.tsx)
// — that one's "Reset" restores its own original `files` prop, built for a
// reader experimenting, not an admin editing the block's actual saved
// content back out to a parent. Same lib/tryit.ts build functions, a
// smaller admin-focused wrapper around them instead.
export function TryItBlockEditor({
  mode,
  files,
  onChange,
}: {
  mode: Mode
  files: Files
  onChange: (patch: { mode?: Mode; files?: Files }) => void
}) {
  const tabs = mode === 'web' ? WEB_TABS : REACT_TABS
  const [active, setActive] = useState<keyof Files>(tabs[0])
  const [srcDoc, setSrcDoc] = useState('')
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!tabs.includes(active)) setActive(tabs[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source === iframeRef.current?.contentWindow && e.data?.source === 'tryit') setError(e.data.message)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.srcdoc = srcDoc
  }, [srcDoc])

  function run() {
    setError(null)
    if (mode === 'react') {
      const { doc, error: buildError } = buildReactDoc(files)
      if (buildError) { setError(buildError); return }
      setSrcDoc(doc)
    } else {
      setSrcDoc(buildWebDoc(files))
    }
  }

  function onModeChange(nextMode: Mode) {
    const nextFiles: Files = nextMode === 'web'
      ? { html: files.html ?? '', css: files.css ?? '', js: files.js ?? '' }
      : { jsx: files.jsx ?? '', css: files.css ?? '' }
    onChange({ mode: nextMode, files: nextFiles })
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const el = e.currentTarget
    const { selectionStart: start, selectionEnd: end } = el
    const value = files[active] ?? ''
    const next = value.slice(0, start) + '  ' + value.slice(end)
    onChange({ files: { ...files, [active]: next } })
    requestAnimationFrame(() => el.setSelectionRange(start + 2, start + 2))
  }

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <select value={mode} onChange={(e) => onModeChange(e.target.value as Mode)} className="rounded-md border bg-background px-2 py-1.5 text-sm">
          <option value="web">Web (HTML/CSS/JS)</option>
          <option value="react">React</option>
        </select>
        <Button size="sm" onClick={run}>
          <Play className="size-3.5" /> Run
        </Button>
      </div>

      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`px-2 py-1 text-xs font-medium ${active === tab ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <textarea
          value={files[active] ?? ''}
          onChange={(e) => onChange({ files: { ...files, [active]: e.target.value } })}
          onKeyDown={onKeyDown}
          spellCheck={false}
          rows={8}
          className="w-full resize-y rounded-md border bg-background p-2 font-mono text-sm outline-none"
        />
        <div className="flex flex-col gap-2">
          <iframe ref={iframeRef} sandbox="allow-scripts" className="h-[168px] w-full rounded-md border bg-white" title="Try It preview" />
          {error && <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2 font-mono text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  )
}
