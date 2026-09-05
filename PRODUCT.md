# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Beginner-to-intermediate learners, many total beginners with no prior coding background. Bilingual — read natively in English or Bengali (বাংলা). Free and open to anyone, anywhere; not gated to any single institute's students (explicit non-goal — see Brand Commitments).

## Product Purpose

A free, modern rewrite of docs.learncomputer.in — a W3Schools-style learning site teaching HTML, CSS, JavaScript, React, PHP, Python, SQL, WordPress, Node.js, AI, graphic design, Photoshop, hosting/deployment, digital marketing, SEO, and career skills. Structured like a real syllabus with runnable, in-browser code examples ("Try It Yourself"), not just reference text.

## Positioning

Full curriculum breadth (18 subjects, 467+ lessons spanning "first line of code" to "first job" — design, development, deployment, and the career skills that come after) combined with native Bengali translation and free runnable code examples. A competitor offering only one language, or English-only tutorials, or reference text without runnable examples, could not truthfully claim the same thing.

## Operating Context

Most visitors arrive cold, no signup required. Typical sessions: read one lesson start-to-finish, jump to a specific topic via search or the sidebar, or use a standalone interactive tool (Box Model demo, Flexbox Playground, Gradient Generator, etc.) independent of any lesson. Content is bilingual throughout; a language toggle in the header switches instantly, no page reload of context.

## Capabilities and Constraints

Next.js (App Router) + Supabase Postgres, ISR with on-demand tag revalidation — content updates go live without a redeploy. Content ships in server-rendered HTML on every page (never client-only rendered), a hard SEO constraint. Performance budget: JS < 100 KB gz per lesson page, CSS < 30 KB, fonts < 100 KB, Lighthouse ≥ 95. Admin-authored content is block-based (richtext, code, tryit, image, table, callout, etc.).

## Brand Commitments

Name and logo: "Learn Computer Academy," brand orange accent (oklch hue 53, tuned separately for light/dark contrast). Tied to a real in-person training institute in Habra, West Bengal (learncomputer.in) — the About-band credibility line references this directly and must stay factual, not aspirational marketing language. Explicit non-goal: never frame the site as "for LCA students only" anywhere in UI or copy — it is free and public.

## Evidence on Hand

Real lesson content: 467+ lessons across 18 subjects (exact counts are live data from the `categories`/`docs` tables, not fabricated). Real institute name and location. No testimonials, case studies, customer logos, or usage/outcome statistics exist — future work must not fabricate or imply any.

## Product Principles

1. **Beginner-first.** Plain language, no unexplained jargon; structured like a real syllabus, not a reference dump.
2. **Bilingual by design.** Bengali is a first-class reading experience, not a translated bolt-on — verified against real content reflow, not just string swaps.
3. **Prove, don't just claim.** Runnable examples and real numbers over marketing language.
4. **Free and open.** Never gated, never "students only" framing.
5. **Content ships in real HTML.** SEO/indexability is a hard constraint on every technical and design decision — never trade it for a client-only rendering shortcut.

## Accessibility & Inclusion

Bilingual (EN/BN) support is a core accessibility commitment, not an add-on. WCAG AA contrast is expected sitewide (verified via a live DX audit: all sampled text/background pairs on the homepage cleared AA, most cleared AAA).
