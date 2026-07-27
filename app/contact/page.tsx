import type { Metadata } from 'next'

// Static — no form, no backend. User: "the contact page too won't have any
// contact form, just the basic info of our institute and if someone want to
// contact they can visit the main website's contact form." Only established
// facts reused here (Habra, West Bengal / learncomputer.in), nothing fabricated.
export const metadata: Metadata = {
  title: 'Contact | Learn Computer Academy',
  description: 'Learn Computer Academy is a hands-on training institute in Habra, West Bengal.',
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          Learn Computer Academy is a hands-on training institute in Habra, West Bengal.
          This site is a free, open resource built from the same lessons taught there.
        </p>
        <p>
          To get in touch with the institute — course enquiries, admissions, or anything
          else — please use the contact form on our main website.
        </p>
      </div>
      <a
        href="https://learncomputer.in/contact/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
      >
        Visit learncomputer.in/contact
      </a>
    </main>
  )
}
