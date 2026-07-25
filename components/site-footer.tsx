'use client'

import { usePathname } from 'next/navigation'
import { t, localeFromPathname } from '@/lib/i18n'

export function SiteFooter() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  return (
    <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
      <p>{t(locale).footer(new Date().getFullYear())}</p>
    </footer>
  )
}
