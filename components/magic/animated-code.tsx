'use client'

import { useEffect, useRef, useState } from 'react'
import { BorderBeam } from '@/components/magic/border-beam'

// Adapted from animate-ui.com's animate/code component (typing effect +
// live Shiki highlighting) — https://animate-ui.com/docs/components/animate/code
// That component types out one fixed snippet once; this loops through
// several languages forever, since it's decorative chrome for the homepage
// hero, not a one-shot demo.
//
// Theme: same ayu-light/dracula pair as lib/shiki.ts (lesson content), and
// deliberately *not* re-highlighting per theme toggle. codeToHtml's
// defaultColor defaults to 'light', which bakes light colors directly and
// exposes dark as a --shiki-dark/-bg custom property — exactly what
// app/globals.css's `.dark .shiki` rule expects to override via var().
// Passing defaultColor: 'dark' here would make that global rule reference
// a --shiki-dark var that no longer exists on the element, breaking
// highlighting in dark mode — so this always highlights as light and lets
// that existing site-wide CSS rule do the theme switch, same as every
// lesson code block already does.
import { SNIPPETS } from '@/components/magic/animated-code-snippets'
import type { CodeTokens } from '@/lib/shiki'

const TYPE_DURATION = 2800
const HOLD_DURATION = 1400

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Highlighting happens on the server (HomeContent passes `tokens`, one entry
// per snippet, from lib/shiki.ts tokenize). It used to load shiki core, a
// JS regex engine and 7 grammars in the browser: a 116 KB chunk and a ~530 ms
// main-thread task on Lighthouse mobile (2026-11-23).

// Same markup codeToHtml produced (shiki/shiki-themes classes, --shiki-dark
// vars) so the site-wide `.dark .shiki` rule in globals.css still applies.
function renderTokens(t: CodeTokens, count: number) {
  let left = count
  const lines: string[] = []
  for (let li = 0; li < t.lines.length; li++) {
    if (li > 0) {
      if (left <= 0) break
      left -= 1 // the newline
    }
    let out = ''
    for (const tok of t.lines[li]) {
      if (left <= 0) break
      const c = tok.content.slice(0, left)
      left -= c.length
      out += `<span style="${tok.style}">${escapeHtml(c)}</span>`
    }
    lines.push(`<span class="line">${out}</span>`)
  }
  return `${t.pre}<code>${lines.join('\n')}</code></pre>`
}

export function AnimatedCode({ tokens: all }: { tokens: CodeTokens[] }) {
  const [index, setIndex] = useState(0)
  // Starts fully typed: the server HTML paints the whole first snippet at
  // once, so the panel settles as an LCP candidate immediately instead of
  // growing character by character. Typing starts with the second snippet.
  const [count, setCount] = useState<number>(SNIPPETS[0].code.length)
  const [typing, setTyping] = useState(false)
  const mounted = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const snippet = SNIPPETS[index]

  // Types the current snippet in, then hands off to the next one — forever.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setCount(0)
    setTyping(true)
    const total = snippet.code.length
    let i = 0
    const id = setInterval(() => {
      i += 1
      setCount(i)
      if (i >= total) {
        clearInterval(id)
        setTyping(false)
      }
    }, TYPE_DURATION / total)
    return () => clearInterval(id)
  }, [snippet.code])

  useEffect(() => {
    if (typing) return
    const id = setTimeout(() => setIndex((n) => (n + 1) % SNIPPETS.length), HOLD_DURATION)
    return () => clearTimeout(id)
  }, [typing])

  const tokens = all[index]
  const html = tokens
    ? renderTokens(tokens, count)
    : `<pre class="!m-0 h-full p-5"><code>${escapeHtml(snippet.code.slice(0, count))}</code></pre>`

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [html])

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card shadow-lg">
      <BorderBeam duration={10} />
      <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-destructive/60" />
        <span className="size-2.5 rounded-full bg-primary/60" />
        <span className="size-2.5 rounded-full bg-emerald-500/60" />
        <span className="ml-3 text-xs text-muted-foreground">{snippet.filename}</span>
      </div>
      <div
        ref={scrollRef}
        data-typing={typing}
        className="animated-code h-64 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-sm leading-relaxed [&_code]:text-[13px] [&_code_.line]:px-0 [&>pre]:!m-0 [&>pre]:h-full [&>pre]:p-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
