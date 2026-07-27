# Admin panel — build plan (Stage 7)

**Status:** plan only, nothing built. Written 2026-07-27.
**Spec it implements:** [`ADMIN.md`](ADMIN.md) · **Content model:** [`CONTENT-MODEL.md`](CONTENT-MODEL.md)
**Governed by:** D-10 (content in Postgres), D-11 (blocks), D-18 (revalidation), D-19 (no CodeMirror)

**The requirement in one line:** every piece of content on the public site must be
creatable, readable, updatable and deletable from `/admin` — without a deploy, a script, or
the Supabase SQL editor.

That last clause is the actual work. The database CRUD is easy. The gap is that **a
meaningful share of the site's content isn't in the database at all** — it's hardcoded in
TSX, or it lives in a table nothing renders, or it's a page that doesn't exist yet. This
plan starts from that inventory, not from the screen list.

---

## 1. Content inventory — every surface, and whether it's reachable

Audited against the live repo 2026-07-27. **"CRUD-able today" is `no` for everything** —
the panel doesn't exist. The column that matters is the last one.

### 1a. In the database already

| Content | Table | Rows | Rendered by | Gap to close |
|---|---|---|---|---|
| Lessons (English) | `docs` | 150 | `[category]/[slug]` | Block editor. The big one. |
| Lessons (Bengali) | `doc_translations` | 150 | `bn/[category]/[slug]` | Side-by-side translation editor |
| Categories | `categories` | 8 | sidebar, home, `[category]` | Simple CRUD + reorder. **Icon is a code change — see §6** |
| Category titles (bn) | `categories.title_bn` | 8 | sidebar (bn) | One extra field on the category form |
| Lesson order | `docs.sort_order` | — | sidebar, prev/next | ⚠️ **currently file-scan order, wrong.** Fixing it is a Stage 7 deliverable, not a side effect |
| Resources | `resources` | **0** | **nothing** | Table exists, page doesn't. See §1c |
| Testimonials | `testimonials` | **0** | **nothing** | Table exists, no surface. **Defer — see §8** |
| Leads | `leads` | **0** | contact form (Stage 8) | Inbox screen. Read/status/export only, never create |
| Settings | `site_settings` | **0** | **nothing** | Empty table. Becomes the home/footer content store — see §1b |

### 1b. Hardcoded in TSX — invisible to any admin panel until moved

This is the part that gets missed. Each of these is real, editor-facing copy that a
content owner would reasonably expect to change, currently requiring a code edit + deploy.

| Content | Lives in | Verdict |
|---|---|---|
| Homepage hero, feature cards, "more subjects on the way", closing band | `components/home-content.tsx` | **Move to `site_settings`** (key `home`, one jsonb row). Reuses the existing table — no new table, no new editor if the body is `blocks[]` |
| Footer links / tagline | `components/site-footer.tsx` | Same row, key `footer` |
| Homepage stats (150 lessons, 8 subjects) | computed from live data | ✅ already correct — leave alone |
| UI chrome strings (nav, buttons, banners), both locales | `lib/i18n.ts` | **Stays hardcoded.** ~20 strings that change when the code changes; DB-driving them adds a fetch to every page render to serve a dictionary. Rung 1 of the ladder: skip it |
| Category → brand icon map | `lib/category-icons.tsx` | **Stays hardcoded** — icons are compiled to SVG at build time (`unplugin-icons`), and runtime Iconify is explicitly banned by `CLAUDE.md` §4. Admin gets a generic fallback icon for new categories; a real brand icon is a 2-line code change. Documented ceiling, not a bug |
| Code themes, Shiki config | `lib/shiki.ts` | Code. Not content |

### 1c. Pages that don't exist yet

`urls-before.txt` has 140 URLs. 131 are lessons (now 150 after Programming). The
remaining 8 standalone pages were flagged for Stage 5 and **were never built** — `app/`
contains only `page.tsx`, `[category]/`, `bn/` and `api/`.

| URL | What it is | Plan |
|---|---|---|
| `/` | homepage | Built. Content moves to `site_settings.home` |
| `/about/` | real copy still outstanding (O-1) | **Content page — needs CRUD** |
| `/syllabus/` | the course outline | **Generate from `getSidebarTree()`.** It *is* the syllabus — zero content to manage |
| `/resourses/` (sic) | link directory | Renders the `resources` table. **Needs CRUD** |
| `/contact/` | form | Stage 8. Form is code; the address/phone/email around it → `site_settings` |
| `/box-model/`, `/box-shadow-generator/` | interactive tools | **Code, not content.** No CRUD |
| `/404` | not-found | Code |

**So exactly one free-form static page needs a content editor: `/about/`.** Building a
`pages` table for one row is the classic trap.

**Recommendation:** make `docs.category_id` nullable. A standalone page is then a `docs`
row with `category_id IS NULL` and `path = 'about'` — it inherits the block editor, the
block renderer, draft/publish, revalidation, translations and full-text search with zero
new code. The sidebar query walks `categories → docs`, so null-category rows are excluded
for free. Route: `app/about/page.tsx` → `getDoc('about')`, five lines.

> ⚠️ One caveat this creates: `getAllDocPaths()` feeds `[category]/[slug]`'s
> `generateStaticParams`, and `'about'` has no `/` in it. Filter to `path.includes('/')`
> there, or the param split breaks. One line, but it must not be forgotten.

Alternative if the nullable-FK sentinel reads as too clever: a `pages` table with the same
`blocks jsonb` shape. Costs a duplicate editor route and a second revalidation path. Take
it only if `/about/` is joined by privacy/terms pages soon.

### 1d. Content-adjacent things that are not rows

| Thing | Today | Plan |
|---|---|---|
| Images / video / PDFs | 191 images + 18 PDFs on Cloudinary + R2. **No table tracks them** | Media picker in the block editor. See §5, Screen 8 |
| 301 redirects (140 legacy URLs + 2 indexed PDFs — non-negotiables §3.2/§3.7) | none exist | `next.config.ts` static list from `scripts/url-map.json`. **Not an admin screen** — see §4.7 |
| Search index | `docs.search_vector`, generated column | Automatic. Nothing to manage |
| Sitemap | Stage 9 | Generated. Nothing to manage |

---

## 2. What "CRUD from the admin panel" resolves to

Nine screens. Six are forms over a table; two are the real engineering; one is read-only.

| # | Screen | Route | Difficulty |
|---|---|---|---|
| 1 | Login | `/admin/login` | trivial |
| 2 | Dashboard + usage panel | `/admin` | small |
| 3 | Docs list (filter, reorder, bulk publish) | `/admin/docs` | medium |
| 4 | **Doc editor (block editor)** | `/admin/docs/[id]` | ⭐ **the project** |
| 5 | **Translation editor (bn)** | `/admin/docs/[id]/bn` | ⭐ medium-large |
| 6 | Draft preview | `/admin/docs/[id]/preview` | small — see §4.4 |
| 7 | Categories | `/admin/categories` | small |
| 8 | Media library | `/admin/media` | medium |
| 9 | Resources | `/admin/resources` | small |
| 10 | Leads inbox | `/admin/leads` | small (Stage 8 dependency) |
| 11 | Site content (home, footer, contact details) | `/admin/settings` | small |

Testimonials are deliberately absent. See §8.

---

## 3. Data model changes — migration `003-admin.sql`

Small. The schema was designed for this.

```sql
-- 1. Standalone pages (§1c) — a doc with no category
alter table docs alter column category_id drop not null;
-- (the FK is already `on delete restrict`; null is now the "standalone page" sentinel)

-- 2. Settings seed — the store for homepage/footer/contact copy (§1b)
insert into site_settings (key, value) values
  ('home',    '{}'::jsonb),
  ('footer',  '{}'::jsonb),
  ('contact', '{}'::jsonb)
on conflict (key) do nothing;

-- 3. Media library (§5 screen 8) — the only genuinely new table
create table media (
  id           uuid primary key default gen_random_uuid(),
  backend      text not null check (backend in ('cloudinary','r2')),
  public_id    text not null,          -- Cloudinary publicId or R2 key
  url          text not null,
  kind         text not null check (kind in ('image','video','file')),
  alt          text,
  width        int,
  height       int,
  bytes        int,
  created_at   timestamptz not null default now(),
  unique (backend, public_id)
);
alter table media enable row level security;
create policy "public reads media"  on media for select using (true);
create policy "admin manages media" on media for all
  using (public.is_admin()) with check (public.is_admin());

-- 4. Backfill: the 209 assets already on Cloudinary/R2 are invisible to the
--    picker until they're indexed. One-off from scripts/image-map.json + pdf-map.json.
```

**No `redirects` table** — see §4.7. **No `pages` table** — see §1c. **No `audit_log`** —
one editor, `updated_at` already exists, Supabase keeps 7 days of PITR-adjacent logs on
free tier. Add it the day a second editor gets an account.

---

## 4. Architecture decisions — take these before writing screens

### 4.1 Auth guard: re-add `proxy.ts`, scoped to `/admin`

`proxy.ts` (Next 16's `middleware.ts`) was **deleted in session 11** — its only job then
was feeding an `x-locale` header. It comes back for the route guard:

```ts
export const config = { matcher: '/admin/:path*' }
```

The matcher is not cosmetic. Session 11's lesson was that a dynamic API in the *root
layout* poisons every route's rendering mode; a matcher-scoped proxy touches only `/admin`
and leaves the 150 static lesson pages alone. **Verify with `next build`'s route table
after adding it** — `●`/`○` on every public route, same as today.

Guard logic: read the Supabase session cookie, check
`app_metadata.role === 'admin'` (never `user_metadata` — ADMIN.md §Auth), redirect to
`/admin/login` otherwise. RLS is the real enforcement; the proxy is UX.

### 4.2 Writes go through `lib/admin/*.ts`, not raw Supabase in components

`CLAUDE.md` §4 mandates `lib/content.ts` as the read choke point. Writes get the mirror
treatment: `lib/admin/docs.ts`, `lib/admin/settings.ts`, etc. — Server Actions only, never
a client component holding a Supabase client. This is what made reversing D-01 cheap.

Use the **cookie-aware SSR client** (`lib/supabase/server.ts`), not the service-role
client, for everything an editor does. RLS then enforces admin-ness on every write even if
a guard is bypassed. Service-role (`lib/supabase/admin.ts`) is reserved for the two things
RLS can't do: the usage panel's `db_size()` RPC and media uploads that need the Cloudinary
secret.

### 4.3 Publish revalidates directly — the webhook is the backup, not the path

O-6 (create the Supabase Database Webhook) is resolved as of D-21 — a hand-rolled `pg_net`
trigger, since the Database Webhooks UI is broken on this project. The admin panel doesn't
depend on it either way:

```ts
// in the publish server action, after the write succeeds
revalidateTag(`doc:${path}`, { expire: 0 })
revalidateTag('sidebar', { expire: 0 })
revalidatePath(`/${path}`, 'page')
revalidatePath(`/bn/${path}`, 'page')
```

Same calls `/api/revalidate` already makes — call them in-process instead of POSTing to
your own server with a shared secret. Faster, no secret in the loop, works in `next dev`.

The webhook stays valuable for **out-of-band** edits (SQL editor, a translation script,
a future second app). Keep the route; it is no longer on the critical path.

**This also closes O-5.** The `generateMetadata` staleness only bit `revalidateTag`-only
invalidation; the route already pairs it with `revalidatePath`, which forces the whole
route including metadata. The publish action must do both — dropping `revalidatePath`
as "redundant" would silently reintroduce stale `<title>`s.

### 4.4 Draft preview is a separate admin route — never a flag on the public route

ADMIN.md asks for preview-before-publish. The tempting implementation — let
`[category]/[slug]` render drafts when an admin cookie is present — is the wrong one: it
forces that route dynamic, which breaks `CLAUDE.md` §3.3 (content in server HTML) and the
free-tier guardrail (never SSR a doc page). It would put every crawler hit back on Postgres.

Instead: `app/admin/docs/[id]/preview/page.tsx`, dynamic and admin-only, rendering the
**same `<BlockRenderer>`** against the draft row. The public route is not touched at all.
Cost: the preview lacks the sidebar/TOC chrome unless those components are reused too
(they can be — both take plain data).

### 4.5 Rich text: spike Tiptap for one hour before committing

`richtext` blocks are stored as HTML and rendered through `dangerouslySetInnerHTML`.
Tiptap is the choice in `docs/UI.md`. But D-19 is a live warning: CodeMirror 6 was also in
that document and cost ~2 hours proving it doesn't work with React 19 in this stack.

**Spike first, in isolation, before any editor UI is built around it.** Tiptap v3 claims
React 19 support; prove it renders and emits HTML in this exact Next 16.2.11 + webpack
setup. If it fails, the fallback is a plain `<textarea>` of HTML plus a live preview pane
— ugly, but the source content is already HTML and the site has exactly one editor.

Whatever wins, **sanitize on write** (server-side, in the action). Admin-authored HTML is
semi-trusted, but a paste from the old live site can carry anything, and it lands in
`dangerouslySetInnerHTML` on a public page.

### 4.6 Code blocks: `<textarea>`, decided in advance

D-19 already settled this for Try-It. The admin's code editor hits the identical wall.
Monospace textarea + Tab-key indent + a language `<select>` fed by the `Lang` union in
`lib/types.ts`. Shiki preview on blur if it's wanted; not required.

### 4.7 Reordering: a `sort_order` number field, not `dnd-kit`

`docs/UI.md` names `dnd-kit`. It is a new dependency, and drag-and-drop across a 36-item
list in a scrolling container is genuinely fiddly to build well.

**Ship first:** each row in the docs list has an editable order number, one "Save order"
button, one `upsert`. Blocks in the editor get ↑/↓ buttons (a 40-block lesson is edited by
moving one block a few positions, not by dragging across the page). Zero dependencies.

Add `dnd-kit` when the number field is measurably annoying — and it will be measurable,
because fixing the 150 wrong `sort_order` values is the very first thing this screen does.

### 4.8 `path` is locked after first publish. No redirects table.

ADMIN.md offers "lock the field, or auto-create a 301." Take the lock — it's zero code.
A `redirects` table means a runtime lookup on every 404, a cache tag, an invalidation path
and a screen, all to serve a rename that should be rare and deliberate.

The 140 legacy URLs and the 2 indexed PDFs (non-negotiables §3.2 / §3.7) are a **known,
frozen list** — `scripts/url-map.json` already holds 131 of them. They belong in
`next.config.ts`'s `redirects()`, built once in Stage 9/10. Not an admin concern.

If a path genuinely must change post-launch: DB edit + a line in the static redirect list
+ deploy. Rare enough to be manual, deliberate enough that it *should* be.

### 4.9 Autosave writes drafts; only Publish is destructive

Autosave to `status='draft'` is safe for a **new** doc and dangerous for a **published**
one — it would overwrite live content on every keystroke. Two behaviours:

- Doc is `draft` → autosave freely, no revalidation.
- Doc is `published` → **no autosave.** Edits live in local state; explicit "Save &
  publish" writes and revalidates. Warn on navigate-away with unsaved changes.

A draft-copy-of-a-published-doc workflow (a `docs_drafts` shadow row) is the "proper"
answer and is not worth it for one editor. Revisit if content review ever gets a second
person.

---

## 5. Screens — what each one actually contains

**Screen 1 · Login** `/admin/login`
Email + password against Supabase Auth. No signup, no password reset UI (one user, created
by hand — ADMIN.md). `robots: noindex` on the whole `/admin` subtree via the layout's
`metadata`.

**Screen 2 · Dashboard** `/admin`
Counts (docs by status, translations, categories, unread leads), 5 most recently edited
docs, and the **usage panel** from ADMIN.md §Usage. Build all five rows, and make **days
since last DB activity** the visually dominant one — the 7-day pause is the limit that
will actually bite; storage will read 1% for years. Service-role read, cached 1 hour.

**Screen 3 · Docs list** `/admin/docs`
Table: title, category, path, status, `sort_order`, updated. Filter by category and
status; text filter on title. Row actions: edit, preview, publish/unpublish, delete
(confirm — deleting a doc cascades its translation). Bulk publish via checkboxes. Editable
order numbers + "Save order" (§4.7). **"New doc" creates a draft with an empty
`blocks: []` and a path derived from category + slug.**

**Screen 4 · Doc editor** `/admin/docs/[id]` — the one that matters

*Metadata pane:* title, slug, category (or "standalone page"), `path` (**locked once
`published_at` is set**), meta title, meta description, status, sort order.

*Block editor:* vertical list, each block rendered by a type-specific editor component.
Per block: ↑/↓, duplicate, delete. Between blocks: a `+` menu listing block types. All
Phase-1+2 types must be editable, because all of them exist in the live content:

| Type | Editor UI |
|---|---|
| `richtext` | Tiptap, or HTML textarea + preview (§4.5) |
| `heading` | text input + level select; **anchor auto-generated with per-doc dedup** — session 8 fixed 15 colliding anchors, the editor must not recreate them |
| `code` | textarea + language select + filename + "make runnable" toggle → converts to `tryit` |
| `tryit` | mode select (web/react) + a tab per file; reuse `lib/tryit.ts` for a live preview |
| `image` / `loop` | media picker (Screen 8) + alt + caption; width/height read from the media row |
| `table` | header row + row grid, add/remove row & column |
| `callout` | variant select + title + richtext body |
| `video` | provider select + id + title |
| `file` | media picker filtered to PDFs + label + size |
| `quiz` | **not built.** Phase 3, no rows exist |

*Derived on save, server-side, never hand-edited:* `toc` (from `heading` blocks) and
`updated_at`. If the ToC is editable by hand it will drift from the anchors.

*Paste handling* — CONTENT-MODEL.md calls this "worth more than three extra widget types,"
and that's right, but it is **not** phase 1. Ship typing first, measure the pain.

**Screen 5 · Translation editor** `/admin/docs/[id]/bn`
Two columns: English blocks read-only on the left, Bengali editable on the right, aligned
by block `id`. This alignment is the whole feature — it's what makes a partial translation
obvious and what stops the table-rows-left-in-English bug that session 9 caught by hand.

Rules the UI should enforce or at least display, from the translation scripts:
`code` block contents stay **byte-identical**; anchors stay identical to English; West
Bengal / Indian Bengali vocabulary (জল, not পানি). A "copy English → Bengali" button per
block for code/table blocks that shouldn't change.

Creating a translation = clone the English `blocks`, then edit. Deleting one is fine — the
public site already falls back to English with a banner.

**Screen 6 · Preview** `/admin/docs/[id]/preview` — §4.4.

**Screen 7 · Categories** `/admin/categories`
Slug, title, `title_bn`, description, sort order. Delete blocked while docs reference it
(the FK is `on delete restrict` — surface that as a clear message, not a raw PG error).
**New categories get a fallback icon** with a note that a brand icon is a code change
(§1b).

**Screen 8 · Media library** `/admin/media`
Grid of the `media` table. Upload → `lib/storage.ts`'s `pickBackend()` already routes
≥10 MB to R2 and the rest to Cloudinary; the UI's job is to **warn before uploading an
oversized image**, since R2 does no transformation (the comment in `storage.ts` explicitly
defers this warning to Stage 7). Fields: alt text, replace, delete. Deleting a referenced
asset should warn — a `blocks @> ...` jsonb containment query finds references.

Backfill the 191 images + 18 PDFs already live, or the picker starts empty next to a full
Cloudinary account.

**Screen 9 · Resources** `/admin/resources`
CRUD over `resources`, grouped by `group_name`, with ordering. **Blocked on `/resourses/`
existing** — build the public page in the same pass or this screen edits invisible data.

**Screen 10 · Leads** `/admin/leads`
Read, status (new/contacted/closed), CSV export. No create, no edit of submitted content.
Depends on Stage 8's contact form; the screen is ~1 hour once rows exist.

**Screen 11 · Site content** `/admin/settings`
Forms over `site_settings`: homepage copy (hero, feature cards, coming-soon subjects,
closing band), footer, contact details (phone/email/address/social). Requires
`home-content.tsx` and `site-footer.tsx` to read from the DB first — that refactor is part
of this screen's work, not a prerequisite someone else does.

---

## 6. Build order

Each phase ends in a state worth committing. Content extraction, design and infra stay in
separate commits (`CLAUDE.md` §5).

| Phase | Contents | Done when |
|---|---|---|
| **0** | ✅ Tiptap spike in isolation (§4.5) — **done, D-22: it works.** No textarea fallback needed |
| **1** | Migration 003 · `proxy.ts` guard · login · `/admin` shell + noindex | A non-admin cannot reach `/admin/docs`; `next build` still shows `●`/`○` on all public routes |
| **2** | Docs list + `sort_order` fix | The sidebar order across all 8 categories is finally correct on the live site |
| **3** | ✅ ⭐ Doc editor: metadata + `richtext`/`heading`/`code`/`table` blocks · save · publish + revalidate — **built, D-27** | Edit a real lesson, publish, see it change on the public URL with no redeploy — code-verified, not yet user-verified against real content |
| **4** | ✅ Preview route · draft/publish rules (§4.9) — **built, D-28** | A draft is viewable by an admin and invisible to anon (verify with a logged-out request) |
| **5** | ✅ Media library + backfill · `image`/`loop`/`file` block editors — **built, D-29** | An image can be uploaded and placed in a lesson end-to-end — code-verified against the real (backfilled) media table, not yet user-verified through a real upload |
| **6** | Remaining block editors: `callout`, `tryit`, `video` | Every block type present in the 150 live lessons is editable |
| **7** | Translation editor | A Bengali lesson is editable without a script in `scripts/` |
| **8** | Categories · settings + home/footer refactor · `/about/` page | No editor-facing copy remains hardcoded except `lib/i18n.ts` and the icon map |
| **9** | Resources screen + `/resourses/` page · dashboard usage panel · daily keep-alive/backup Action | ADMIN.md is fully implemented |

**Phase 3 is the project.** Phases 1–2 are a day. If phase 3 slips, everything after it
slips, and no amount of parallel work on screens 7–11 helps.

The daily keep-alive/backup GitHub Action (ADMIN.md §Keep-alive) can land any time and
should land **early** — it protects against the 7-day pause while the panel is being
built, and it's ~15 lines.

---

## 7. Verification — per phase, not at the end

```bash
# 1. No secret leaked to the client (CLAUDE.md §3.4) — run before every deploy
npm run build && grep -rn "SUPABASE_SERVICE_ROLE_KEY\|CLOUDINARY_API_SECRET\|R2_SECRET" .next/static/ && echo "LEAK" || echo "clean"

# 2. Public routes still static after adding proxy.ts (§4.1)
npm run build   # route table: ● or ○ on every public route, never ƒ

# 3. Drafts are invisible to anon
curl -s https://<preview>/<draft-path>/ -o /dev/null -w '%{http_code}'   # expect 404

# 4. Publish actually revalidates (the D-18 test, repeated)
#    edit a title in /admin -> publish -> curl the public URL -> new title in the HTML,
#    including <title>, without a redeploy

# 5. Content still ships in server HTML (§3.3)
curl -s https://<preview>/css/css-intro/ | grep -c "Cascading Style Sheets"
```

⚠️ `rm -rf .next/cache` before any build used as a cache-behaviour test — session 11 lost
real time to a stale Data Cache making a fixed bug look unfixed.

---

## 8. Deliberately not built

| Thing | Why | Add when |
|---|---|---|
| Testimonials screen | Table has 0 rows and **nothing on the site renders testimonials**. Building CRUD for content with no surface is rung 1 of the ladder | A page displays them |
| `redirects` table + screen | §4.8 — the legacy list is static and frozen; renames are locked | A path must change post-launch, twice |
| `pages` table | One standalone page needs it (§1c) | A second free-form page appears |
| Audit log / revisions | One editor. `updated_at` covers "when" | A second editor gets an account |
| Roles beyond `admin` | Same reason | Same |
| `dnd-kit` drag reorder | §4.7 — number fields ship today with zero dependencies | The number field is measurably annoying |
| `quiz` block editor | Phase 3 in CONTENT-MODEL.md, zero rows exist | Someone asks for a quiz |
| Paste-to-blocks conversion | Genuinely valuable, genuinely not phase 1 | After a week of real authoring |
| DB-driven UI strings / category icons | §1b — build-time compiled, and a per-render fetch to serve 20 constants | Never, realistically |
| Media CDN transformations UI | Cloudinary already does `f_auto,q_auto` in the URL builder | — |

---

## 9. Known risks

1. ~~Tiptap may not work in this stack.~~ **Resolved, D-22 — it works.** Verified real
   interactive editing (not just installing cleanly, which is exactly where CodeMirror's
   failure hid) and a clean production build.
2. **`sort_order` is wrong for 150 rows.** Fixing it means someone decides the correct
   lesson sequence per category — that's a content judgement, possibly needing the user,
   not something the screen decides. Surface it as a question before phase 2, not during.
3. **The `path` lock is only as good as the UI.** RLS lets an admin update `path` freely;
   the lock is client-side. Acceptable for one trusted editor. A DB trigger blocking
   `path` changes on `published` rows is the hardening if it ever matters.
4. **`proxy.ts` returning to the codebase.** Deleted in session 11 for good reason. The
   matcher scope is what keeps it harmless — check `next build`'s route table after adding
   it, every time, not once.
5. **Deleting a category or media asset can orphan content.** FK `restrict` covers
   categories; media has no FK to `blocks` at all, so a deleted image leaves a broken
   `publicId` in a jsonb array. The reference-check query in Screen 8 is not optional.
6. **`generateMetadata` staleness (O-5)** is closed *only* by keeping `revalidatePath`
   alongside `revalidateTag` in the publish action (§4.3). It will look redundant to a
   future reader. It isn't.
