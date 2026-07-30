'use client'

import { useEffect, useRef, useState } from 'react'
import { BorderBeam } from '@/components/magic/border-beam'

// Adapted from animate-ui.com's animate/code component (typing effect +
// live Shiki highlighting) — https://animate-ui.com/docs/components/animate/code
// That component types out one fixed snippet once; this loops through
// several languages forever, since it's decorative chrome for the homepage
// hero, not a one-shot demo. No next-themes here (this project doesn't use
// it — see app/layout.tsx), so theme comes from the same classList the
// header's own toggle already sets.
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

function useIsDark() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    setDark(root.classList.contains('dark'))
    const observer = new MutationObserver(() => setDark(root.classList.contains('dark')))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return dark
}

export function AnimatedCode() {
  const dark = useIsDark()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState('')
  const [typing, setTyping] = useState(true)
  const [html, setHtml] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const snippet = SNIPPETS[index]

  // Types the current snippet in, then hands off to the next one — forever.
  useEffect(() => {
    setVisible('')
    setTyping(true)
    const characters = Array.from(snippet.code)
    const interval = TYPE_DURATION / characters.length
    let i = 0
    const id = setInterval(() => {
      i += 1
      setVisible(characters.slice(0, i).join(''))
      if (i >= characters.length) {
        clearInterval(id)
        setTyping(false)
      }
    }, interval)
    return () => clearInterval(id)
  }, [snippet.code])

  useEffect(() => {
    if (typing) return
    const id = setTimeout(() => setIndex((n) => (n + 1) % SNIPPETS.length), HOLD_DURATION)
    return () => clearTimeout(id)
  }, [typing])

  // Re-highlight as the visible text grows, same as the upstream primitive.
  useEffect(() => {
    let cancelled = false
    import('shiki').then(({ codeToHtml }) =>
      codeToHtml(visible || ' ', {
        lang: snippet.lang,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: dark ? 'dark' : 'light',
      }).then((out) => {
        if (!cancelled) setHtml(out)
      })
    )
    return () => {
      cancelled = true
    }
  }, [visible, snippet.lang, dark])

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
        className="animated-code h-56 overflow-auto p-5 text-sm leading-relaxed [&_code]:text-[13px] [&_code_.line]:px-0 [&>pre,_&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
