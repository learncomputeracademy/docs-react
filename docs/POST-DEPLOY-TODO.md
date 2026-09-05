# Post-deploy TODO

Checklist for **after** the next `git push` to `main` and the resulting Vercel redeploy goes
live. Nothing here should be done before that — see the active constraint at the top of
`CLAUDE.md` (ISR write quota exhausted, no push until the user says so). This file is a
holding pen; work it only when explicitly told to.

---

## 1. GitHub Actions — add the missing repo secrets

`supabase-daily.yml` (keep-alive + backup) has failed on **every run since day one**
(`Error: supabaseUrl is required.`) because these two repo secrets were never set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Add them at **GitHub → repo → Settings → Secrets and variables → Actions**, same values as
`.env.local`. Not push-dependent — can be done anytime — but flagged here so it isn't
forgotten. Verify with `gh run list --workflow=supabase-daily.yml --limit 1` afterward.

## 2. Revalidate the sidebar cache for the new Python Practice Projects doc

`python/practice-projects` (Session 2026-08-17) was written straight to Supabase via
`scripts/create-python-practice-projects.mjs` — it bypassed the admin panel's publish
action, so it never called `revalidateTag('sidebar')`. The live site's cached sidebar won't
list it until that tag is invalidated. After deploy:

- Either publish/re-save anything through the admin panel once (any save calls the
  webhook), or
- Hit `/api/revalidate` directly for the `sidebar` tag (check `app/api/revalidate/route.ts`
  for the expected payload/secret).

## 2b. Revalidate the sidebar cache for Office Skills and Figma too

Same bypass as #2, for two more categories written straight to Supabase this session:
`office/*` (36 lessons, `scripts/create-office-skills-content.mjs`) and `figma/*` (9 lessons,
`scripts/create-figma-content.mjs`). One `sidebar` tag revalidation after deploy covers all
three pending categories at once — no need to repeat it per category.

## 3. Verify the new doc live (CONTENT-PIPELINE.md §7 checklist)

- [ ] `/python/practice-projects` loads, shows all 4 levels / 24 projects
- [ ] `/bn/python/practice-projects` loads, shows Bengali
- [ ] view-source shows the lesson text (not just client-rendered) — SEO gate
- [ ] sidebar lists it under Python, last position
- [ ] accordions (project + nested solution) open/close correctly with JS disabled too
      (they're native `<details>`, should need no JS — worth double-checking on the real
      domain)
- [ ] no console errors

## 4. Vercel usage sanity check

Before or right after this push, glance at the Vercel usage panel again — confirm ISR
Writes and the other exceeded metrics (Fast Origin Transfer, ISR Reads, Fluid Active CPU)
have reset for the new billing cycle, or are at least not immediately re-exceeded by the
deploy itself.

## 5. Homepage redesign — decide before this ships live

The current homepage (`components/home-content.tsx`, `PRODUCT.md`, `DESIGN.md`) is a
Linear/Raycast-tier redesign that went through Impeccable's full review pipeline and got a
"ship" verdict — but the user rejected it afterward ("looks like designed 10 years ago"),
pointed at horizonx.so as the actual reference, and the conversation was interrupted before
a new direction was chosen. **Do not treat the current homepage as final.** Confirm with the
user whether to ship as-is, hold the push until a new direction is built, or something else,
before this goes live.

Also minor, independent of the above: the React category icon (`lib/category-icons.tsx`,
`~icons/logos/react`) rendered as a generic/off-brand icon in one screenshot during the
"Pick a subject" redesign — worth a quick visual check post-deploy.

## 6. SEO for new pages — what's automatic vs. what needs doing by hand

**Lesson pages under `/[category]/[slug]/`** (i.e. any doc row, including
`python/practice-projects`): fully automatic, nothing to do per page.
`app/[category]/[slug]/page.tsx` and its `/bn` twin build `generateMetadata` from the
doc's own `meta_title` / `meta_description` columns via `lib/seo.ts` (`docMetaTitle`,
`buildAlternates` for canonical + hreflang, `articleJsonLd` for structured data), and
`app/sitemap.ts` pulls every **published** doc from the DB directly (`getAllPublishedPaths`
/ `getTranslatedPathsForSitemap`) — a doc appears in the sitemap the moment it's published,
never hand-added. The only thing a content script has to get right is setting
`meta_title` and `meta_description` on the row, which `scripts/create-python-practice-projects.mjs`
already did for both locales — confirmed set, nothing outstanding for this specific page.

**Any standalone route that is NOT a `docs` row** — a new `/tools/*` page, a new static
page like `/about` or `/contact`, or anything else added directly under `app/` — is **not**
automatic. For each one of those, by hand:
- [ ] `export const metadata` (or `generateMetadata`) with a real `title` and `description`
- [ ] a canonical / hreflang pair via `buildAlternates()` if it has a `/bn` twin
- [ ] add the URL to `app/sitemap.ts`'s hand-listed block (the `tools/*` entries there are
      the existing pattern to copy) — otherwise it never gets indexed
- [ ] an OG image if it's a page worth sharing (falls back to the site default otherwise)

Verify after deploy: `/sitemap.xml` includes `python/practice-projects` and its `/bn` path,
and `view-source` on that page shows the real `<title>`/`<meta description>` (not the
layout's generic default).

## 7. Subject-grid redesign — sanity check on the real domain

The "Pick a subject" section was changed from list-panels to a `MagicCard` grid (glow-on-hover,
matching the category pages). Confirmed working on localhost; re-check on the live domain for
any prod-only regressions (font loading, hydration, etc.) once deployed.
