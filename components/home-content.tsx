import Link from 'next/link'
import { ArrowRight, Zap, GraduationCap, Languages, Sparkles, MapPin } from 'lucide-react'
import IconWordpress from '~icons/logos/wordpress-icon'
import IconPython from '~icons/logos/python'
import IconNodejs from '~icons/logos/nodejs-icon'
import IconOpenai from '~icons/logos/openai-icon'
import { getSidebarTree } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { HeroReveal } from '@/components/magic/hero-reveal'
import { ShimmerButton } from '@/components/magic/shimmer-button'
import { BorderBeam } from '@/components/magic/border-beam'
import { MagicCard } from '@/components/magic/magic-card'
import { NumberTicker } from '@/components/magic/number-ticker'
import { Marquee } from '@/components/magic/marquee'

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

const COMING_SOON = [
  { icon: IconWordpress, en: 'WordPress', bn: 'ওয়ার্ডপ্রেস' },
  { icon: IconPython, en: 'Python', bn: 'পাইথন' },
  { icon: IconNodejs, en: 'Node.js', bn: 'Node.js' },
  { icon: IconOpenai, en: 'AI', bn: 'AI' },
] as const

export async function HomeContent({ locale }: { locale: Locale }) {
  const categories = await getSidebarTree(locale)
  const firstLesson = categories.find(c => c.slug === 'html')?.docs[0] ?? categories[0]?.docs[0]
  const totalLessons = categories.reduce((sum, c) => sum + c.docs.length, 0)
  const s = t(locale)
  const prefix = locale === 'bn' ? '/bn' : ''
  const features = FEATURES[locale]

  const stats = [
    { value: totalLessons, label: s.lessons },
    { value: categories.length, label: s.statSubjects },
    { value: 2, label: s.statLanguages },
  ]

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
              {s.heroTitle1}<span className="text-primary">{s.heroTitle2}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">{s.heroSub}</p>
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

            <dl className="mt-10 flex max-w-sm gap-8 border-t pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold tracking-tight text-foreground">
                    <NumberTicker value={stat.value} />
                  </dd>
                  <dd className="text-sm text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </HeroReveal>

          {/* Decorative code mockup — static, not interactive. Code itself
              stays in English/CSS syntax in both locales, on purpose. */}
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-xl border bg-card shadow-lg">
              <BorderBeam duration={10} />
              <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-destructive/60" />
                <span className="size-2.5 rounded-full bg-primary/60" />
                <span className="size-2.5 rounded-full bg-emerald-500/60" />
                <span className="ml-3 text-xs text-muted-foreground">style.css</span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm leading-relaxed"><code>{`.center {
  margin: auto;
  width: 60%;
  border: 3px solid `}<span className="text-primary">orange</span>{`;
  padding: 10px;
}`}</code></pre>
            </div>
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
              <h3 className="font-semibold">{f.title}</h3>
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
              <MagicCard key={cat.id} className="rounded-xl">
                <Link
                  href={`${prefix}/${cat.slug}`}
                  className="group relative flex items-start gap-4 rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
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

      {/* Coming soon */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-accent/50 px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" />
            {s.comingSoonEyebrow}
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">{s.comingSoonTitle}</h2>
          <p className="mt-1 text-muted-foreground">{s.comingSoonSub}</p>

          <Marquee duration={22} className="mt-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            {COMING_SOON.map((item) => (
              <div
                key={item.en}
                className="flex w-40 shrink-0 flex-col items-center gap-3 rounded-xl border border-dashed bg-card/50 p-6 text-center opacity-80"
              >
                {/* White backing, deliberately theme-independent: WordPress
                    and OpenAI's marks are dark-on-transparent by brand
                    guideline and disappear on a dark card otherwise. */}
                <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <item.icon className="size-8" />
                </div>
                <span className="text-sm font-medium">{locale === 'bn' ? item.bn : item.en}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* About band */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative flex flex-col items-start gap-6 overflow-hidden rounded-2xl border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <BorderBeam duration={14} />
          <div>
            <h2 className="text-lg font-semibold">{s.aboutBandTitle}</h2>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {s.aboutBandBody}
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
