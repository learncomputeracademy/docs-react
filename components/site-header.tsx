'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Sun, Moon, Languages } from 'lucide-react'
import { t, localizedPath, localeFromPathname } from '@/lib/i18n'
import { animateThemeChange } from '@/lib/theme-transition'
import { SiteNav } from './site-nav'
import { MobileMenuDrawer } from './mobile-menu-drawer'
import type { NavNode } from '@/lib/content'

// Not loaded until the header itself hydrates and this runs — keeps cmdk +
// Radix Dialog off the critical-path JS for a page someone's just reading.
const CommandMenu = dynamic(() => import('./command-menu').then(m => m.CommandMenu), { ssr: false })

export function SiteHeader({ navItems, logoLightUrl, logoDarkUrl }: { navItems: NavNode[]; logoLightUrl: string; logoDarkUrl: string }) {
  const [dark, setDark] = useState(false)
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const strings = t(locale)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  // Origin comes from e.currentTarget, not a ref, since this same handler
  // fires from two different buttons (the desktop one below, and the one
  // inside MobileMenuDrawer) — the circular reveal should expand from
  // whichever one was actually clicked.
  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = !dark
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    animateThemeChange(left + width / 2, top + height / 2, () => {
      setDark(next)
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
    })
  }

  const otherLocale = locale === 'en' ? 'bn' : 'en'
  const switchHref = localizedPath(pathname, otherLocale)

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 backdrop-blur px-6 py-3">
      <Link href={locale === 'bn' ? '/bn' : '/'} className="flex items-center">
        {/* Plain <img>, not next/image: the global custom loader is wired for
            Cloudinary delivery URLs specifically, and these already come
            from Cloudinary pre-sized via cldUrl (app/layout.tsx) — a second
            resize layer on top would just add a loader hop for nothing.
            Two full wordmarks (text baked into the artwork, light = black
            text, dark = white text), swapped with Tailwind's dark: variant
            rather than the `dark` state below — the theme class on <html>
            is already set before paint by app/layout.tsx's inline script,
            so a state-driven swap would flash the wrong logo on first
            render; a CSS-only swap can't. */}
        <img src={logoLightUrl} alt={strings.siteName} width={8588} height={1498} className="block h-8 w-auto dark:hidden" />
        <img src={logoDarkUrl} alt={strings.siteName} width={8723} height={1850} className="hidden h-8 w-auto dark:block" />
      </Link>
      {/* Admin-editable (D-40/D-43, /admin/menu) — hidden below sm; the same
          items render again inside MobileMenuDrawer for narrow viewports. */}
      <SiteNav navItems={navItems} locale={locale} />
      <div className="flex items-center gap-2">
        <CommandMenu />
        {/* Language + theme: desktop-only here — on mobile they move into
            MobileMenuDrawer (set-once preferences, not worth header space
            next to search, which is the control people actually reach for
            repeatedly). */}
        <div className="hidden items-center gap-1 sm:flex">
          <div className="mx-1 h-5 w-px bg-border" aria-hidden />
          <Link
            href={switchHref}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[15px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Languages className="size-4" />
            {strings.languageSwitchTo}
          </Link>
          <button
            onClick={toggle}
            aria-label={strings.toggleTheme}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
        <MobileMenuDrawer navItems={navItems} locale={locale} dark={dark} onToggleTheme={toggle} switchHref={switchHref} />
      </div>
    </header>
  )
}
