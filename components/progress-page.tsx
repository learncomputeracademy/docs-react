import { getSidebarTree } from '@/lib/content'
import Link from '@/components/hover-link'
import { ProgressOverview } from '@/components/badges'
import type { Locale } from '@/lib/types'

// Shell for /progress and /bn/progress. The numbers and badges come from the
// visitor's own browser (client component); only the subject list is server data.
export async function ProgressPage({ locale }: { locale: Locale }) {
  const categories = await getSidebarTree(locale)
  const subjects = categories.map((c) => ({ slug: c.slug, title: c.title, paths: c.docs.map((d) => d.path) }))
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{locale === 'bn' ? 'আমার অগ্রগতি' : 'My progress'}</h1>
      <div className="mt-8">
        <ProgressOverview subjects={subjects} locale={locale} />
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        <Link href={`${locale === 'bn' ? '/bn' : ''}/account`} className="underline-offset-4 hover:text-foreground hover:underline">
          {locale === 'bn' ? 'আপনার তথ্য ডাউনলোড বা মুছে ফেলুন' : 'Download or clear your data'}
        </Link>
      </p>
    </main>
  )
}
