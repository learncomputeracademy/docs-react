#!/usr/bin/env node
// scripts/daily-backup.mjs
// Run daily by .github/workflows/supabase-daily.yml. Two jobs in one
// script (ADMIN.md "Keep-alive + backup job"):
//   1. Ping — any real query resets Supabase free tier's 7-day inactivity
//      pause clock. The project pausing with no automated backups is the
//      actual risk this whole job exists to prevent.
//   2. Export — every docs/categories/doc_translations row to backup/,
//      versioned by git (each day's commit is itself a restore point).
//
// backup/ is a backup, never a source of truth — never edited, never
// built from, only read during an actual restore. See backup/README.md.
//
// Reads NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY directly from
// process.env (GitHub Actions injects secrets this way) rather than
// parsing .env.local like the one-off local scripts do.

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function slugifyFile(text) {
  return text.replace(/[^a-zA-Z0-9-_]/g, '-')
}

function frontmatter(fields) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
  return `---\n${lines.join('\n')}\n---\n`
}

async function main() {
  console.log('Pinging DB to reset the 7-day inactivity clock...')
  const { error: pingError } = await supabase.from('categories').select('id').limit(1)
  if (pingError) throw pingError
  console.log('Ping OK.')

  console.log('Fetching all content...')
  const [{ data: docs, error: docsError }, { data: categories, error: catError }, { data: translations, error: trError }] =
    await Promise.all([
      supabase.from('docs').select('*, category:categories(slug)'),
      supabase.from('categories').select('*'),
      supabase.from('doc_translations').select('*'),
    ])
  if (docsError) throw docsError
  if (catError) throw catError
  if (trError) throw trError

  const backupDir = new URL('../backup/', import.meta.url)
  const contentDir = new URL('content/', backupDir)
  await fs.rm(contentDir, { recursive: true, force: true })
  await fs.mkdir(contentDir, { recursive: true })

  for (const doc of docs) {
    const categorySlug = doc.category?.slug ?? '_standalone'
    const dir = new URL(`${categorySlug}/`, contentDir)
    await fs.mkdir(dir, { recursive: true })
    const file = new URL(`${slugifyFile(doc.slug)}.mdx`, dir)
    const fm = frontmatter({
      id: doc.id,
      title: doc.title,
      path: doc.path,
      status: doc.status,
      meta_title: doc.meta_title,
      meta_description: doc.meta_description,
      sort_order: doc.sort_order,
      updated_at: doc.updated_at,
    })
    // Blocks are structured jsonb, not prose — a fenced JSON block
    // preserves everything needed to restore without writing a
    // blocks-to-markdown renderer a backup file doesn't need.
    const body = '```json\n' + JSON.stringify(doc.blocks, null, 2) + '\n```\n'
    await fs.writeFile(file, fm + '\n' + body, 'utf8')
  }
  console.log(`Wrote ${docs.length} .mdx files under backup/content/.`)

  await fs.writeFile(
    new URL('docs.json', backupDir),
    JSON.stringify({ exported_at: new Date().toISOString(), docs, categories, translations }, null, 2),
    'utf8'
  )
  console.log('Wrote backup/docs.json (full JSON dump, the actual restore source).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
