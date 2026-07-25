-- ============================================================
-- i18n support: Bengali translations
-- Run this in the Supabase SQL editor, same as supabase/schema.sql.
--
-- Design: English content stays in `docs` (unchanged, untouched by this
-- migration). Translations live in a separate `doc_translations` table —
-- locale-independent metadata (category, sort_order, status, path) is
-- never duplicated per language, only the actually-translatable fields are.
-- Category titles are the one exception: 7 fixed rows, a column is simpler
-- than a join table for something that small.
-- ============================================================

-- ── Category titles ──────────────────────────────────────────

alter table categories add column if not exists title_bn text;

update categories set title_bn = 'কম্পিউটার বেসিক্স' where slug = 'basics';
update categories set title_bn = 'এইচটিএমএল'          where slug = 'html';
update categories set title_bn = 'সিএসএস'             where slug = 'css';
update categories set title_bn = 'জাভাস্ক্রিপ্ট'       where slug = 'javascript';
update categories set title_bn = 'রিয়্যাক্ট'          where slug = 'react';
update categories set title_bn = 'গ্রাফিক ডিজাইন'      where slug = 'design';
update categories set title_bn = 'ফটোশপ'              where slug = 'photoshop';

-- ── New category: Intro to Programming ──────────────────────

insert into categories (slug, title, title_bn, sort_order)
values ('programming', 'Intro to Programming', 'প্রোগ্রামিং পরিচিতি', 8)
on conflict (slug) do nothing;

-- ── Translations table ───────────────────────────────────────

create table doc_translations (
  id               uuid        primary key default gen_random_uuid(),
  doc_id           uuid        not null references docs(id) on delete cascade,
  locale           text        not null check (locale in ('bn')), -- English lives in docs itself
  title            text        not null,
  meta_title       text,
  meta_description text,
  blocks           jsonb       not null default '[]',
  toc              jsonb       not null default '[]',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (doc_id, locale)
);

create index doc_translations_doc_idx on doc_translations(doc_id);

create trigger doc_translations_updated_at
  before update on doc_translations
  for each row execute function set_updated_at();

alter table doc_translations enable row level security;

-- Public reads a translation only if its parent doc is published — same
-- gate as the English content, not a separate publish workflow.
create policy "public reads translations of published docs" on doc_translations
  for select using (
    exists (select 1 from docs where docs.id = doc_translations.doc_id and docs.status = 'published')
  );

create policy "admin manages translations" on doc_translations
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Verify ───────────────────────────────────────────────────
--   select slug, title, title_bn from categories order by sort_order; -- expect 8 rows, all title_bn filled
--   select count(*) from doc_translations; -- 0 until the pilot translation runs
