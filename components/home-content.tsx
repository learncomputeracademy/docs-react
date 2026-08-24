import Link from 'next/link'
import { ArrowRight, GraduationCap, Languages, MapPin } from 'lucide-react'
import { getSidebarTree, getSiteSettings } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { HeroReveal } from '@/components/magic/hero-reveal'
import { AnimatedCode } from '@/components/magic/animated-code'
import { MagicCard } from '@/components/magic/magic-card'
import { ProximityGrid } from '@/components/magic/proximity-grid'
import { TiltCard, TiltLayer } from '@/components/magic/tilt-card'
import { MoltenBackground } from '@/components/magic/molten-background'

// "Runnable examples" dropped (design feedback 2026-08-24) — the Try It
// editor isn't built yet (CLAUDE.md §6 stage 6), so the claim was
// aspirational. A replacement stat card (NumberTicker on totalLessons) was
// tried and then dropped too (user: remove it, just keep these two) — no
// third item, two cards is the shipped shape.
const FEATURES = {
  en: [
    { icon: GraduationCap, title: 'Beginner friendly', body: 'Structured like a real syllabus, from computer basics through to React, one topic at a time.' },
    { icon: Languages, title: 'Available in Bengali too', body: 'The whole site, and a growing number of lessons, read natively in বাংলা — switch anytime from the header.' },
  ],
  bn: [
    { icon: GraduationCap, title: 'শিক্ষার্থীবান্ধব', body: 'কম্পিউটার বেসিক্স থেকে শুরু করে React পর্যন্ত, একটি বাস্তব সিলেবাসের মতো ধাপে ধাপে সাজানো।' },
    { icon: Languages, title: 'বাংলাতেও পাওয়া যায়', body: 'সাইটের প্রতিটি অংশ এবং ক্রমবর্ধমান সংখ্যক পাঠ সরাসরি বাংলায় পড়া যায় — হেডার থেকে যেকোনো সময় ভাষা পাল্টান।' },
  ],
} as const

// Presentation-only grouping for the subject index — independent of the
// categories table's own `sort_order` (which drives the sidebar/admin and
// stays untouched). The hero promises an arc ("design, development,
// deployment, and the career skills that come after"); the old flat
// 18-card grid didn't reflect it (design critique 2026-08-06, P1) — this
// does. A category not listed in any group here still ships, appended as
// its own trailing "More" panel by the `ungrouped` fallback below, rather
// than silently vanishing the next time a category ships and this list
// isn't updated.
const SUBJECT_GROUPS = [
  { key: 'start', slugs: ['basics', 'office', 'programming', 'ai'], label: { en: 'Start here', bn: 'শুরু করুন' } },
  { key: 'design', slugs: ['design', 'ui-ux', 'photoshop', 'figma'], label: { en: 'Design', bn: 'ডিজাইন' } },
  { key: 'web', slugs: ['html', 'css', 'javascript', 'react'], label: { en: 'Build the web', bn: 'ওয়েব তৈরি' } },
  { key: 'backend', slugs: ['php', 'sql', 'wordpress', 'python', 'nodejs', 'mongodb'], label: { en: 'Backend & data', bn: 'ব্যাকএন্ড ও ডেটা' } },
  { key: 'launch', slugs: ['freelancing', 'hosting', 'marketing', 'seo', 'career'], label: { en: 'Launch & grow', bn: 'লঞ্চ ও ক্যারিয়ার' } },
] as const

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

  const byslug = new Map(categories.map(c => [c.slug, c]))
  // Any category not accounted for by SUBJECT_GROUPS still ships — appended
  // as its own trailing group — rather than silently vanishing from the
  // homepage the next time a category is added and this list isn't updated.
  const grouped = new Set<string>(SUBJECT_GROUPS.flatMap(g => g.slugs))
  const ungrouped = categories.filter(c => !grouped.has(c.slug) && c.docs.length > 0)

  return (
    <main className="flex-1">
      {/* Hero — flat surface, no ambient decoration. Typography and the one
          real product proof (AnimatedCode, live-typing) carry the page.
          One deliberate exception (user-requested): MoltenBackground, an
          ambient WebGL glow behind the hero, dark-mode only — see its own
          file comment for the perf/accessibility guardrails. Light mode
          stays exactly as flat as before. */}
      <section className="relative overflow-hidden border-b">
        <MoltenBackground className="absolute inset-0 hidden opacity-40 dark:block" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <HeroReveal>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              {heroTitle1}<span className="text-primary">{heroTitle2}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">{heroSub}</p>
            {firstLesson && (
              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild size="lg">
                    <Link href={`${prefix}/${firstLesson.path}`}>
                      {s.startLearning} <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#subjects">{s.browseSubjects}</Link>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{s.freeLessonsSubjects(totalLessons, categories.length)}</p>
              </div>
            )}
          </HeroReveal>

          {/* Was `hidden lg:block` — mobile visitors never saw the one
              element that demonstrates the product (design critique
              2026-08-06, Casey persona). Visible at every width now. */}
          <div>
            <AnimatedCode />
          </div>
        </div>
      </section>

      {/* Features — round 2: the MagicCard/glow version (2026-08-24 first
          pass) still read flat to the user, who pointed at 21st.dev's
          "Animated 3D Card" as the target instead — a cursor-driven
          perspective tilt with the icon/heading popping forward in Z on
          hover (TiltCard/TiltLayer, new). Colors stay this site's own
          neutral bg-card + single orange accent (confirmed with the user)
          rather than the reference's per-card rainbow gradients, which
          would break DESIGN.md's one-accent-color rule sitewide. Two cards,
          not three — the stat card (NumberTicker on totalLessons) was tried
          and then dropped (user: just keep these two). */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <TiltCard key={f.title} className="rounded-xl border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <TiltLayer depth={40}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <f.icon className="size-5" />
                  </span>
                </TiltLayer>
                <TiltLayer depth={24} className="mt-3">
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </TiltLayer>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects — grouped card grid, matching the card language every
          category page already uses (MagicCard glow + hover-lift), not the
          bordered-panel/hairline-list scaffold this section used to have.
          That mismatch — home read as a doc-index widget, category pages
          read as a modern card grid — was the "old school" complaint
          (2026-08-17). Group headers stay plain text labels, not another
          boxed header bar. */}
      <section id="subjects" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight">{s.pickASubject}</h2>
        <p className="mt-1 text-muted-foreground">{s.pickASubjectSub}</p>

        <div className="mt-10 space-y-10">
          {SUBJECT_GROUPS.map((group) => {
            const items = group.slugs.map(slug => byslug.get(slug)).filter((c): c is NonNullable<typeof c> => !!c && c.docs.length > 0)
            if (items.length === 0) return null
            return (
              <SubjectGroup key={group.key} label={group.label[locale]} items={items} prefix={prefix} locale={locale} s={s} />
            )
          })}
          {ungrouped.length > 0 && (
            <SubjectGroup label={locale === 'bn' ? 'আরও' : 'More'} items={ungrouped} prefix={prefix} locale={locale} s={s} />
          )}
        </div>
      </section>

      {/* About band */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start gap-6 rounded-xl border bg-card p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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

type PanelItem = { id: string; slug: string; title: string; docs: { path: string }[] }

function SubjectGroup({ label, items, prefix, locale, s }: {
  label: string
  items: PanelItem[]
  prefix: string
  locale: Locale
  s: ReturnType<typeof t>
}) {
  return (
    <div>
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</h3>
      <ProximityGrid className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.slug]
          return (
            <MagicCard key={cat.id} className="rounded-xl" glow>
              <Link
                href={`${prefix}/${cat.slug}`}
                className="group flex flex-col gap-3 rounded-xl bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5"
              >
                {/* text-primary, not text-foreground: Lucide's monochrome
                    icons (conceptual categories) were reading as a colder,
                    separate system from the brand-color tech logos in the
                    same badge (finish review 2026-08-06) — tinting them
                    brand-orange instead of neutral warms the whole grid
                    toward one palette. Brand logos ignore this; they carry
                    their own fill colors. */}
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  {Icon && <Icon className="size-5" />}
                </span>
                <span className="min-w-0 truncate text-sm font-medium group-hover:text-primary">{cat.title}</span>
                <span className="flex items-center justify-between text-xs text-muted-foreground">
                  {cat.docs.length} {cat.docs.length === 1 ? s.lesson : s.lessons}
                  <ArrowRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </Link>
            </MagicCard>
          )
        })}
      </ProximityGrid>
    </div>
  )
}
