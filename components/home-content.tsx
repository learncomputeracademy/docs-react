import Link from 'next/link'
import { ArrowRight, Zap, GraduationCap, Gift } from 'lucide-react'
import { getSidebarTree } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

const FEATURES = {
  en: [
    { icon: Zap, title: 'Runnable examples', body: 'Every lesson comes with code you can edit and run right in the page — no setup required.' },
    { icon: GraduationCap, title: 'Beginner friendly', body: 'Structured like a real syllabus, from computer basics through to React, one topic at a time.' },
    { icon: Gift, title: 'Completely free', body: 'No paywall, no signup wall. Every lesson is free for anyone, students or not.' },
  ],
  bn: [
    { icon: Zap, title: 'রান করার মতো উদাহরণ', body: 'প্রতিটি পাঠে এমন কোড থাকে যা আপনি পাতার মধ্যেই এডিট করে রান করতে পারবেন — কোনো সেটআপ ছাড়াই।' },
    { icon: GraduationCap, title: 'শিক্ষার্থীবান্ধব', body: 'কম্পিউটার বেসিক্স থেকে শুরু করে React পর্যন্ত, একটি বাস্তব সিলেবাসের মতো ধাপে ধাপে সাজানো।' },
    { icon: Gift, title: 'সম্পূর্ণ ফ্রি', body: 'কোনো পেওয়াল নেই, সাইনআপের বাধা নেই। প্রতিটি পাঠ সবার জন্য ফ্রি, শিক্ষার্থী হোক বা না হোক।' },
  ],
} as const

export async function HomeContent({ locale }: { locale: Locale }) {
  const categories = await getSidebarTree(locale)
  const firstLesson = categories.find(c => c.slug === 'html')?.docs[0] ?? categories[0]?.docs[0]
  const totalLessons = categories.reduce((sum, c) => sum + c.docs.length, 0)
  const s = t(locale)
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
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-accent/50 px-3 py-1 text-xs font-medium text-accent-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {s.freeLessonsSubjects(totalLessons)}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {s.heroTitle1}<span className="text-primary">{s.heroTitle2}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">{s.heroSub}</p>
            {firstLesson && (
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={`${prefix}/${firstLesson.path}`}>
                    {s.startLearning} <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#subjects">{s.browseSubjects}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Decorative code mockup — static, not interactive. Code itself
              stays in English/CSS syntax in both locales, on purpose. */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
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
            const first = cat.docs[0]
            if (!first) return null // category-index pages are a fuller Stage 5 build-out, not this pass
            return (
              <Link
                key={cat.id}
                href={`${prefix}/${first.path}`}
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
            )
          })}
        </div>
      </section>
    </main>
  )
}
