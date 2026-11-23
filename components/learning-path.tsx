import Link from '@/components/hover-link'
import { BookOpen, Code, Database, Globe, Plus, Sparkle } from 'lucide-react'
import { SUBJECT_GROUPS } from '@/lib/subject-groups'
import type { Locale } from '@/lib/types'

// Homepage "Learn, one step at a time" path + the two feature cards
// (2026-11-23). Replaces the TiltCard + ElectricBorder feature pair, which
// the owner no longer liked; layout borrowed from the owner's docs-v2 mock
// (C:\Users\Raptor\Downloads\docs-v2). Pure CSS, no client JS. Each step is
// one subject group and jumps to that group further down the page.

const STEP_ICONS = { start: BookOpen, design: Sparkle, web: Code, backend: Database, launch: Globe } as const

const T = {
  en: {
    eyebrow: 'Your next chapter',
    title: 'Learn, one step at a time.',
    sub: 'From computer basics through to React, one topic at a time.',
    beginnerTitle: 'Beginner friendly',
    beginnerBody: 'Structured like a real syllabus, from computer basics through to React, one topic at a time.',
    langWord: 'বাংলা',
    langTitle: 'Available in Bengali too',
    langBody: 'The whole site, and a growing number of lessons, read natively in বাংলা. Switch anytime from the header.',
    langCta: 'বাংলা',
    langHref: '/bn',
  },
  bn: {
    eyebrow: 'আপনার পরের অধ্যায়',
    title: 'ধাপে ধাপে শিখুন।',
    sub: 'কম্পিউটার বেসিক্স থেকে React পর্যন্ত, একবারে একটি বিষয়।',
    beginnerTitle: 'শিক্ষার্থীবান্ধব',
    beginnerBody: 'কম্পিউটার বেসিক্স থেকে শুরু করে React পর্যন্ত, একটি বাস্তব সিলেবাসের মতো ধাপে ধাপে সাজানো।',
    langWord: 'English',
    langTitle: 'ইংরেজিতেও পড়ুন',
    langBody: 'পুরো সাইট ইংরেজিতেও আছে। হেডার থেকে যেকোনো সময় ভাষা পাল্টান।',
    langCta: 'English',
    langHref: '/',
  },
} as const

export function LearningPath({ locale, titles }: { locale: Locale; titles: Map<string, string> }) {
  const s = T[locale]
  const steps = SUBJECT_GROUPS.map((g) => ({
    key: g.key,
    label: g.label[locale],
    Icon: STEP_ICONS[g.key],
    subjects: g.slugs.map((slug) => titles.get(slug)).filter(Boolean).slice(0, 3).join(', '),
  })).filter((st) => st.subjects)

  return (
    <section className="relative overflow-hidden border-b">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{s.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">{s.title}</h2>
        <p className="mt-3 text-muted-foreground">{s.sub}</p>

        <ol className="relative mt-12 grid gap-6 lg:grid-cols-5 lg:gap-4">
          {/* Connector line behind the books (desktop only) */}
          <span aria-hidden className="absolute top-14 right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-border via-primary/40 to-border lg:block" />
          {steps.map(({ key, label, Icon, subjects }) => (
            <li key={key} className="relative">
              <a href={`#group-${key}`} className="group flex items-center gap-4 lg:flex-col lg:text-center">
                <span className="relative shrink-0">
                  <span className="relative flex h-20 w-16 items-center justify-center rounded-r-md rounded-l-sm border border-l-[6px] border-l-primary bg-card text-primary shadow-[3px_3px_0_0_var(--border)] transition duration-300 group-hover:-translate-y-1.5 group-hover:bg-primary group-hover:text-primary-foreground lg:h-28 lg:w-[5.5rem]">
                    <Icon className="size-6 lg:size-7" aria-hidden />
                  </span>
                  <span aria-hidden className="mx-auto mt-1.5 block h-1.5 w-16 rounded-full bg-foreground/10 blur-[2px] lg:w-24" />
                </span>
                <span>
                  <span className="block font-semibold group-hover:text-primary">{label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{subjects}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 sm:p-8">
            <span aria-hidden className="relative flex h-16 w-24 items-center justify-center">
              <span className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 -rotate-12 rounded-[50%] border border-primary/30" />
              <BookOpen className="relative size-10 text-primary" strokeWidth={1.5} />
            </span>
            <h3 className="mt-5 text-xl font-semibold">{s.beginnerTitle}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{s.beginnerBody}</p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-l-4 border-l-primary bg-gradient-to-br from-primary/10 to-card p-6 sm:p-8">
            <span aria-hidden className="pointer-events-none absolute top-2 right-4 text-7xl font-bold text-primary/10 select-none sm:text-8xl">{s.langWord}</span>
            <span lang={locale === 'en' ? 'bn' : 'en'} className="relative block h-16 text-5xl leading-[4rem] font-bold text-primary">{s.langWord}</span>
            <h3 className="relative mt-5 text-xl font-semibold">{s.langTitle}</h3>
            <p className="relative mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{s.langBody}</p>
            <Link href={s.langHref} lang={locale === 'en' ? 'bn' : 'en'} className="relative mt-4 inline-flex min-h-11 items-center gap-6 border-b border-primary/40 text-primary hover:border-primary">
              {s.langCta}
              <Plus className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
