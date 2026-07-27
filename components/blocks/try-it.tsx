'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildReactDoc, buildWebDoc } from '@/lib/tryit'

type Files = { html?: string; css?: string; js?: string; jsx?: string }

const TAB_LABELS: Record<keyof Files, string> = { html: 'HTML', css: 'CSS', js: 'JS', jsx: 'JSX' }

export function TryIt({ mode, files }: { mode: 'web' | 'react'; files: Files }) {
  // Unique per instance so the sliding indicator's layoutId doesn't cross-
  // animate between two separate TryIt blocks on the same lesson page.
  const indicatorId = useId()
  const tabs = (Object.keys(files) as (keyof Files)[]).filter((k) => files[k] !== undefined)
  const [active, setActive] = useState(tabs[0])
  const [current, setCurrent] = useState<Files>(files)
  const [srcDoc, setSrcDoc] = useState('')
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source === iframeRef.current?.contentWindow && e.data?.source === 'tryit') {
        setError(e.data.message)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Set imperatively, not via the `srcDoc` JSX prop: React's controlled
  // prop for it doesn't reliably force the iframe to (re)navigate when the
  // value changes right after mount. Direct DOM assignment does.
  useEffect(() => {
    if (iframeRef.current) iframeRef.current.srcdoc = srcDoc
  }, [srcDoc])

  function run() {
    setError(null)
    if (mode === 'react') {
      const { doc, error: buildError } = buildReactDoc(current)
      if (buildError) { setError(buildError); return }
      setSrcDoc(doc)
    } else {
      setSrcDoc(buildWebDoc(current))
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { run() }, []) // initial render, before any edits

  function reset() {
    setCurrent(files)
    setActive(tabs[0])
    setError(null)
  }

  // Tab key inserts two spaces instead of moving focus — expected editor
  // behavior, not a browser default a plain textarea gives you for free.
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const el = e.currentTarget
    const { selectionStart: start, selectionEnd: end } = el
    const value = current[active] ?? ''
    const next = value.slice(0, start) + '  ' + value.slice(end)
    setCurrent((prev) => ({ ...prev, [active]: next }))
    requestAnimationFrame(() => el.setSelectionRange(start + 2, start + 2))
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted/50 px-2">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`relative px-3 py-2 text-xs font-medium transition-colors ${
                active === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {TAB_LABELS[tab]}
              {active === tab && (
                <motion.span
                  layoutId={`tryit-tab-${indicatorId}`}
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 py-1.5">
          <Button size="sm" variant="ghost" onClick={reset} aria-label="Reset">
            <RotateCcw className="size-3.5" />
          </Button>
          <Button size="sm" onClick={run}>
            <Play className="size-3.5" /> Run
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <textarea
          value={current[active] ?? ''}
          onChange={(e) => setCurrent((prev) => ({ ...prev, [active]: e.target.value }))}
          onKeyDown={onKeyDown}
          spellCheck={false}
          className="h-[280px] w-full resize-none border-b bg-background p-3 font-mono text-sm outline-none md:border-b-0 md:border-r"
        />
        <div className="flex flex-col">
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts"
            className="h-[280px] w-full bg-white"
            title="Preview"
          />
          {error && (
            <div className="border-t bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
