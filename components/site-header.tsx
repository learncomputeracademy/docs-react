'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Sun, Moon, Languages } from 'lucide-react'
import { t, localizedPath, localeFromPathname } from '@/lib/i18n'
import { SiteNav } from './site-nav'
import type { NavNode } from '@/lib/content'

// Not loaded until the header itself hydrates and this runs — keeps cmdk +
// Radix Dialog off the critical-path JS for a page someone's just reading.
const CommandMenu = dynamic(() => import('./command-menu').then(m => m.CommandMenu), { ssr: false })

export function SiteHeader({ navItems }: { navItems: NavNode[] }) {
  const [dark, setDark] = useState(false)
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const strings = t(locale)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const otherLocale = locale === 'en' ? 'bn' : 'en'
  const switchHref = localizedPath(pathname, otherLocale)

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 backdrop-blur px-6 py-3">
      <Link href={locale === 'bn' ? '/bn' : '/'} className="flex items-center gap-2.5">
        {/* Plain <img>, not next/image: the global custom loader is wired for
            Cloudinary delivery URLs, not local /public files. Icon only, not
            the full wordmark PNG — its text is baked in black and would be
            invisible in dark mode. Real text below adapts via text-foreground. */}
        <img src="/logo-icon.png" alt="" width={64} height={64} className="size-8" />
        <span className="font-semibold tracking-tight">{strings.siteName}</span>
      </Link>
      {/* Admin-editable (D-40/D-43, /admin/menu) — hidden below sm since the
          command menu/language/theme controls already crowd narrow
          viewports; a dedicated mobile nav drawer is a real gap once this
          list grows past a couple of entries. */}
      <SiteNav navItems={navItems} locale={locale} />
      <div className="flex items-center gap-2">
        <CommandMenu />
        <Link
          href={switchHref}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Languages className="size-4" />
          {strings.languageSwitchTo}
        </Link>
        <button
          onClick={toggle}
          aria-label={strings.toggleTheme}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </header>
  )
}
