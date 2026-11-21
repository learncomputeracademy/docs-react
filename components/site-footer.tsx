'use client'

import { usePathname } from 'next/navigation'
import Link from '@/components/hover-link'
import IconYoutube from '~icons/simple-icons/youtube'
import IconFacebook from '~icons/simple-icons/facebook'
import IconInstagram from '~icons/simple-icons/instagram'
import IconX from '~icons/simple-icons/x'
import { t, localeFromPathname } from '@/lib/i18n'

// Social links copied from learncomputer.in's own footer (2026-11-21).
const SOCIAL = [
  { label: 'YouTube', href: 'https://www.youtube.com/@learncomputeracademy', icon: IconYoutube },
  { label: 'Facebook', href: 'https://www.facebook.com/learncomputeracademy', icon: IconFacebook },
  { label: 'Instagram', href: 'https://www.instagram.com/learncomputeracademy/', icon: IconInstagram },
  { label: 'X', href: 'https://x.com/welearncomputer', icon: IconX },
]

const LINKS = {
  en: [['Docs', '/#subjects'], ['Resources', '/resources'], ['Tools', '/tools'], ['Typing Test', '/typing-test'], ['Contact', '/contact']],
  bn: [['ডকস', '/bn#subjects'], ['রিসোর্স', '/resources'], ['টুলস', '/bn/tools'], ['টাইপিং টেস্ট', '/bn/typing-test'], ['যোগাযোগ', '/contact']],
} as const

export function SiteFooter() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const s = t(locale)
  return (
    <footer className="border-t text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <p className="max-w-xs text-center md:text-left">{s.footerTagline}</p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {LINKS[locale].map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-primary">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-1" aria-label={s.footerFollow}>
          {SOCIAL.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-primary">
              <Icon className="size-[18px]" />
            </a>
          ))}
        </div>
      </div>
      <p className="border-t px-6 py-4 text-center text-xs">{s.footer(new Date().getFullYear())}</p>
    </footer>
  )
}
