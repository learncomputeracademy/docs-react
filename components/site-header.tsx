'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function SiteHeader() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 backdrop-blur px-6 py-3">
      <Link href="/" className="flex items-center gap-2.5">
        {/* Plain <img>, not next/image: the global custom loader is wired for
            Cloudinary delivery URLs, not local /public files. Icon only, not
            the full wordmark PNG — its text is baked in black and would be
            invisible in dark mode. Real text below adapts via text-foreground. */}
        <img src="/logo-icon.png" alt="" width={64} height={64} className="size-8" />
        <span className="font-semibold tracking-tight">Learn Computer Academy</span>
      </Link>
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    </header>
  )
}
