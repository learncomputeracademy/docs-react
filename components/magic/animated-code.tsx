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
const SNIPPETS = [
  {
    lang: 'css',
    filename: 'style.css',
    code: `.center {
  margin: auto;
  width: 60%;
  border: 3px solid orange;
  padding: 10px;
}`,
  },
  {
    lang: 'html',
    filename: 'index.html',
    code: `<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>Hello, world!</h1>
    <p>Learn to build for the web.</p>
  </body>
</html>`,
  },
  {
    lang: 'javascript',
    filename: 'script.js',
    code: `function greet(name) {
  return \`Hello, \${name}!\`
}

document
  .querySelector('#btn')
  .addEventListener('click', () => {
    console.log(greet('world'))
  })`,
  },
  {
    lang: 'jsx',
    filename: 'App.jsx',
    code: `function App() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}`,
  },
  {
    lang: 'php',
    filename: 'index.php',
    code: `<?php
  $name = "world";
  echo "Hello, " . $name . "!";
?>`,
  },
  {
    lang: 'python',
    filename: 'app.py',
    code: `def greet(name):
    return f"Hello, {name}!"

for student in ["Amit", "Priya"]:
    print(greet(student))`,
  },
  {
    lang: 'sql',
    filename: 'query.sql',
    code: `SELECT title, category
FROM lessons
WHERE published = TRUE
ORDER BY created_at DESC
LIMIT 5;`,
  },
] as const

const TYPE_DURATION = 2800
const HOLD_DURATION = 1400

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

type Highlighted = { index: number; pre: string; lines: { content: string; style: string }[][] }

// Fine-grained shiki (core + JS regex engine + only these 7 grammars and 2
// themes), created once and shared. Was `import('shiki')` + codeToHtml on
// every typed character (~every 30ms, forever): the full bundle plus a
// re-tokenize per keystroke kept the main thread busy and swapped in a new
// <pre> each tick, so Lighthouse kept moving LCP (10.3s mobile, 2026-11-19).
// Now each snippet is tokenized once and typing just slices those tokens.
let highlighter: Promise<import('shiki/core').HighlighterCore> | null = null
function getHighlighter() {
  highlighter ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript')]).then(
    ([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [import('shiki/themes/ayu-light.mjs'), import('shiki/themes/dracula.mjs')],
        langs: [
          import('shiki/langs/css.mjs'),
          import('shiki/langs/html.mjs'),
          import('shiki/langs/javascript.mjs'),
          import('shiki/langs/jsx.mjs'),
          import('shiki/langs/php.mjs'),
          import('shiki/langs/python.mjs'),
          import('shiki/langs/sql.mjs'),
        ],
        engine: createJavaScriptRegexEngine(),
      })
  )
  return highlighter
}

// Same markup codeToHtml produced (shiki/shiki-themes classes, --shiki-dark
// vars) so the site-wide `.dark .shiki` rule in globals.css still applies.
function renderTokens(t: Highlighted, count: number) {
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

export function AnimatedCode() {
  const [index, setIndex] = useState(0)
  // Starts fully typed: the server HTML paints the whole first snippet at
  // once, so the panel settles as an LCP candidate immediately instead of
  // growing character by character. Typing starts with the second snippet.
  const [count, setCount] = useState<number>(SNIPPETS[0].code.length)
  const [typing, setTyping] = useState(false)
  const [tokens, setTokens] = useState<Highlighted | null>(null)
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

  // Tokenize once per snippet. Until shiki resolves, plain typed text shows.
  useEffect(() => {
    let cancelled = false
    getHighlighter().then((h) => {
      if (cancelled) return
      const r = h.codeToTokens(snippet.code, {
        lang: snippet.lang,
        themes: { light: 'ayu-light', dark: 'dracula' },
      })
      const styleOf = (s?: Record<string, string>) =>
        Object.entries(s ?? {}).map(([k, v]) => `${k}:${v}`).join(';')
      setTokens({
        index,
        pre: `<pre class="shiki shiki-themes ayu-light dracula" style="background-color:${r.bg};color:${r.fg};${r.rootStyle || ''}">`,
        lines: r.tokens.map((line) =>
          line.map((t) => ({ content: t.content, style: styleOf(t.htmlStyle) || `color:${t.color}` }))
        ),
      })
    })
    return () => {
      cancelled = true
    }
  }, [index, snippet.code, snippet.lang])

  const html =
    tokens && tokens.index === index
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
        className="animated-code h-56 overflow-auto text-sm leading-relaxed [&_code]:text-[13px] [&_code_.line]:px-0 [&>pre]:!m-0 [&>pre]:h-full [&>pre]:p-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
