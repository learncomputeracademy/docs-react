import Link from 'next/link'
import { ArrowRight, Zap, GraduationCap, Languages, MapPin } from 'lucide-react'
import { getSidebarTree, getSiteSettings } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { HeroReveal } from '@/components/magic/hero-reveal'
import { AnimatedCode } from '@/components/magic/animated-code'
import { ShimmerButton } from '@/components/magic/shimmer-button'
import { BorderBeam } from '@/components/magic/border-beam'
import { MagicCard } from '@/components/magic/magic-card'

const FEATURES = {
  en: [
    { icon: Zap, title: 'Runnable examples', body: 'Every lesson comes with code you can edit and run right in the page — no setup required.' },
    { icon: GraduationCap, title: 'Beginner friendly', body: 'Structured like a real syllabus, from computer basics through to React, one topic at a time.' },
    { icon: Languages, title: 'Available in Bengali too', body: 'The whole site, and a growing number of lessons, read natively in বাংলা — switch anytime from the header.' },
  ],
  bn: [
    { icon: Zap, title: 'রান করার মতো উদাহরণ', body: 'প্রতিটি পাঠে এমন কোড থাকে যা আপনি পাতার মধ্যেই এডিট করে রান করতে পারবেন — কোনো সেটআপ ছাড়াই।' },
    { icon: GraduationCap, title: 'শিক্ষার্থীবান্ধব', body: 'কম্পিউটার বেসিক্স থেকে শুরু করে React পর্যন্ত, একটি বাস্তব সিলেবাসের মতো ধাপে ধাপে সাজানো।' },
    { icon: Languages, title: 'বাংলাতেও পাওয়া যায়', body: 'সাইটের প্রতিটি অংশ এবং ক্রমবর্ধমান সংখ্যক পাঠ সরাসরি বাংলায় পড়া যায় — হেডার থেকে যেকোনো সময় ভাষা পাল্টান।' },
  ],
} as const

// Optional per-locale text overrides from /admin/settings, layered on top
// of lib/i18n.ts's defaults — an empty/missing site_settings row (true
// today until an admin fills it in) changes nothing, so this can never
// blank out the homepage. Only the plain-text fields are overridable;
// feature-card and coming-soon icons stay hardcoded (CLAUDE.md §4 bans
// runtime icon loading, so there's no safe way to make icon choice
// admin-editable without it).
type HomeOverrides = Partial<{
  heroTitle1: string
  heroTitle2: string
  heroSub: string
  aboutBandTitle: string
  aboutBandBody: string
}>

export async function HomeContent({ locale }: { locale: Locale }) {
  const [categories, settings] = await Promise.all([getSidebarTree(locale), getSiteSettings('home')])
  const firstLesson = categories.find(c => c.slug === 'basics')?.docs[0] ?? categories[0]?.docs[0]
  const totalLessons = categories.reduce((sum, c) => sum + c.docs.length, 0)
  const s = t(locale)
  const override = (settings[locale] ?? {}) as HomeOverrides
  // || not ?? — the settings form always sends a string (possibly ''), and
  // an empty override means "cleared, use the default," never "show blank."
  const heroTitle1 = override.heroTitle1 || s.heroTitle1
  const heroTitle2 = override.heroTitle2 || s.heroTitle2
  const heroSub = override.heroSub || s.heroSub
  const aboutBandTitle = override.aboutBandTitle || s.aboutBandTitle
  const aboutBandBody = override.aboutBandBody || s.aboutBandBody
  const prefix = locale === 'bn' ? '/bn' : ''
  const features = FEATURES[locale]

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 right-0 -z-10 size-[32rem] rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <HeroReveal>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-accent/50 px-3 py-1 text-xs font-medium text-accent-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {s.freeLessonsSubjects(totalLessons, categories.length)}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {heroTitle1}<span className="text-primary">{heroTitle2}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">{heroSub}</p>
            {firstLesson && (
              <div className="mt-8 flex flex-wrap gap-3">
                <ShimmerButton asChild size="lg">
                  <Link href={`${prefix}/${firstLesson.path}`}>
                    {s.startLearning} <ArrowRight className="size-4" />
                  </Link>
                </ShimmerButton>
                <Button asChild size="lg" variant="outline">
                  <Link href="#subjects">{s.browseSubjects}</Link>
                </Button>
              </div>
            )}
          </HeroReveal>

          {/* Decorative code mockup — cycles HTML/CSS/JS/React/PHP/SQL
              snippets forever (AnimatedCode). Code itself stays in
              English/CSS syntax in both locales, on purpose. */}
          <div className="hidden lg:block">
            <AnimatedCode />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </div>
              <h2 className="font-semibold">{f.title}</h2>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight">{s.pickASubject}</h2>
        <p className="mt-1 text-muted-foreground">{s.pickASubjectSub}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug]
            if (cat.docs.length === 0) return null
            return (
              <MagicCard key={cat.id} className="rounded-xl" glow>
                <Link
                  href={`${prefix}/${cat.slug}`}
                  className="group relative flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent">
                    {Icon && <Icon className="size-6" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{cat.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cat.docs.length} {cat.docs.length === 1 ? s.lesson : s.lessons}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto size-4 shrink-0 self-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </MagicCard>
            )
          })}
        </div>
      </section>

      {/* About band */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative flex flex-col items-start gap-6 overflow-hidden rounded-2xl border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <BorderBeam duration={14} />
          <div>
            <h2 className="text-lg font-semibold">{aboutBandTitle}</h2>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {aboutBandBody}
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <a href="https://learncomputer.in" target="_blank" rel="noopener noreferrer">
              {s.aboutBandCta} <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>
    </main>
  )
}
