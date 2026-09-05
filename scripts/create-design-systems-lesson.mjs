#!/usr/bin/env node
// Adds one new capstone lesson to "css": "Design Systems & Component
// Thinking". Source: roadmap.sh's Design System roadmap PDF (user-supplied
// 2026-09-03) — only the thin concept-level slice (what a design system is,
// design tokens, atomic design). Everything design-systems-team/org-process
// (governance, contribution guidelines, semantic versioning, release
// strategy, analytics, community meetings) judged out of scope — see D-128
// in DECISIONS.md.
//
// Appended at the end of the category (sort_order 50, after
// css-accessibility-and-performance) — no reshuffle needed. Deliberately
// references css/variables (custom properties) as the concrete mechanism
// behind design tokens.
//
// Usage: node scripts/create-design-systems-lesson.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const DRY_RUN = process.argv.includes('--dry-run')

function h(level, text, anchor) { const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'); return { id: nanoid(12), type: 'heading', level, text, anchor: a } }
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, codeText) { return { id: nanoid(12), type: 'code', language, code: codeText.trim() } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows, caption) { return { id: nanoid(12), type: 'table', header, rows, caption } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }
function ul(items) { return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` }

const lesson = {
  slug: 'design-systems-and-component-thinking',
  sortOrder: 50,
  en: {
    title: 'Design Systems & Component Thinking',
    metaTitle: 'Design Systems & Component Thinking | Learn Computer Academy',
    metaDescription: 'What a design system actually is, how design tokens turn colors/spacing/type into reusable values, and atomic design — the concepts behind every consistent, professional-looking site.',
    blocks: [
      p('<p>Ever noticed how a well-built site\'s buttons, spacing, and colors all feel like they belong to the same family, no matter which page you\'re on? That consistency isn\'t an accident — it comes from thinking in <b>design systems</b> rather than styling each page from scratch.</p>'),

      h(2, 'What Is a Design System?'),
      p('<p>A <b>design system</b> is a single source of truth for how a product looks and behaves — a shared set of colors, type sizes, spacing values, and reusable components that every page pulls from, instead of every page (or every developer) picking its own.</p>'),
      p('<p>Without one, it\'s easy to end up with fourteen shades of "almost blue" scattered across a site, each one hand-picked in a different CSS file. A design system is what prevents that drift.</p>'),
      callout('note', '<p>A design system is broader than a "component library." A component library is the actual code (buttons, cards, modals you can import). A design system also includes the rules, values, and guidelines behind those components — the library is one output of the system, not the whole thing.</p>', 'Design System vs. Component Library'),

      h(2, 'Design Tokens — Values Instead of Guesses'),
      p('<p><b>Design tokens</b> are the named, reusable values a design system is built from — a color, a spacing size, a font size — defined once and referenced everywhere, instead of typed fresh in every stylesheet.</p>'),
      p('<p>In CSS, tokens are usually built with <a href="/css/variables">custom properties</a>:</p>'),
      code('css', `:root {
  --color-primary: #2563eb;
  --color-text: #1f2937;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --font-size-body: 1rem;
  --font-size-heading: 1.75rem;
}

.button {
  background: var(--color-primary);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-body);
}`),
      p('<p>Change <code>--color-primary</code> once and every button, link, and highlight that references it updates together — the same idea behind dark mode toggles, and the reason design tokens matter far beyond just looking tidy.</p>'),
      table(
        ['Token category', 'Typical values'],
        [
          ['Color', 'Brand colors, text colors, background colors, functional colors (error red, success green)'],
          ['Typography', 'Font family, font sizes on a consistent scale, line height, font weight'],
          ['Spacing', 'A fixed scale (e.g. 4px, 8px, 16px, 32px) used for all margin/padding instead of arbitrary numbers'],
          ['Layout', 'Breakpoints, grid columns, container max-widths'],
        ]
      ),

      h(2, 'Atomic Design — Building Up From the Smallest Pieces'),
      p('<p><b>Atomic design</b> is a way of thinking about UI in layers, from smallest to largest — a useful mental model for organising components in any codebase, not just a specific tool.</p>'),
      table(
        ['Layer', 'Example'],
        [
          ['Atoms', 'The smallest pieces — a single button, an input field, a label. Can\'t be broken down further and still be useful.'],
          ['Molecules', 'A few atoms combined for one purpose — a search bar is an input atom plus a button atom.'],
          ['Organisms', 'Several molecules combined into a distinct section — a header with a logo, a nav, and a search bar.'],
          ['Templates / Pages', 'Organisms arranged into an actual page layout, filled with real content.'],
        ]
      ),
      p('<p>The payoff: a "Button" built once, styled from tokens, gets reused across every form, every card, and every modal in the whole site — instead of being redesigned, slightly differently, every time it\'s needed.</p>'),

      h(2, 'Where This Leaves You'),
      p('<p>You don\'t need a formal design-system tool or a whole team to benefit from this thinking. Even a small personal project gets more consistent the moment you define your colors, spacing, and type sizes as variables once and reuse them everywhere, and build a button or a card as one reusable piece instead of retyping its styles on every page.</p>')
    ],
  },
  bn: {
    title: 'ডিজাইন সিস্টেম আর কম্পোনেন্ট থিংকিং',
    metaTitle: 'ডিজাইন সিস্টেম আর কম্পোনেন্ট থিংকিং | Learn Computer Academy',
    metaDescription: 'একটা ডিজাইন সিস্টেম আসলে কী, ডিজাইন টোকেন কীভাবে রং/স্পেসিং/টাইপকে পুনরায় ব্যবহারযোগ্য value-এ পরিণত করে, আর atomic design — প্রতিটা সামঞ্জস্যপূর্ণ, পেশাদার-দেখানো সাইটের পেছনের ধারণা।',
    blocks: [
      p('<p>কখনো খেয়াল করেছেন একটা ভালোভাবে তৈরি সাইটের বাটন, spacing, আর রং সব একই family-র মনে হয়, যে page-এই থাকুন না কেন? এই সামঞ্জস্যতা কোনো accident না — এটা আসে প্রতিটা page আলাদাভাবে style করার বদলে <b>design system</b>-এ চিন্তা করা থেকে।</p>'),

      h(2, 'ডিজাইন সিস্টেম কী?', 'what-is-a-design-system'),
      p('<p>একটা <b>design system</b> হলো একটা product কেমন দেখায় আর কেমন আচরণ করে তার একক source of truth — রং, টাইপ সাইজ, spacing value, আর পুনরায় ব্যবহারযোগ্য component-এর একটা শেয়ার করা সেট যা থেকে প্রতিটা page টেনে নেয়, প্রতিটা page (বা প্রতিটা developer) নিজের মতো বেছে নেওয়ার বদলে।</p>'),
      p('<p>এটা ছাড়া, একটা সাইট জুড়ে ভিন্ন ভিন্ন CSS ফাইলে হাতে বেছে নেওয়া চোদ্দটা "প্রায়-নীল" শেড ছড়িয়ে থাকা সহজ। একটা design system এই drift প্রতিরোধ করে।</p>'),
      callout('note', '<p>একটা design system একটা "component library"-র চেয়ে বিস্তৃত। একটা component library হলো আসল code (বাটন, card, modal যা import করা যায়)। একটা design system-এ সেই component-গুলোর পেছনের নিয়ম, value, আর guideline-ও থাকে — library হলো system-এর একটা output, পুরো জিনিসটা না।</p>', 'ডিজাইন সিস্টেম বনাম কম্পোনেন্ট লাইব্রেরি'),

      h(2, 'ডিজাইন টোকেন — অনুমানের বদলে value', 'design-tokens-values-instead-of-guesses'),
      p('<p><b>ডিজাইন টোকেন</b> হলো নামযুক্ত, পুনরায় ব্যবহারযোগ্য value যা দিয়ে একটা design system তৈরি — একটা রং, একটা spacing size, একটা font size — একবার define করা আর সবজায়গায় reference করা, প্রতিটা stylesheet-এ নতুন করে টাইপ করার বদলে।</p>'),
      p('<p>CSS-এ, টোকেন সাধারণত <a href="/css/variables">custom properties</a> দিয়ে তৈরি হয়:</p>'),
      code('css', `:root {
  --color-primary: #2563eb;
  --color-text: #1f2937;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --font-size-body: 1rem;
  --font-size-heading: 1.75rem;
}

.button {
  background: var(--color-primary);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-body);
}`),
      p('<p><code>--color-primary</code> একবার পরিবর্তন করুন আর এটা reference করা প্রতিটা বাটন, link, আর হাইলাইট একসাথে update হয় — dark mode toggle-এর পেছনের একই ধারণা, আর কারণ ডিজাইন টোকেন শুধু গোছানো দেখানোর চেয়ে অনেক বেশি গুরুত্বপূর্ণ।</p>'),
      table(
        ['টোকেন ক্যাটাগরি', 'সাধারণ value'],
        [
          ['রং', 'ব্র্যান্ড রং, টেক্সট রং, ব্যাকগ্রাউন্ড রং, functional রং (error লাল, success সবুজ)'],
          ['টাইপোগ্রাফি', 'ফন্ট ফ্যামিলি, একটা সামঞ্জস্যপূর্ণ স্কেলে ফন্ট সাইজ, line height, ফন্ট weight'],
          ['স্পেসিং', 'সব margin/padding-এর জন্য একটা fixed scale (যেমন 4px, 8px, 16px, 32px), যেকোনো সংখ্যার বদলে'],
          ['লেআউট', 'Breakpoint, grid column, container max-width'],
        ]
      ),

      h(2, 'অ্যাটমিক ডিজাইন — সবচেয়ে ছোট অংশ থেকে গড়ে তোলা', 'atomic-design-building-up-from-the-smallest-pieces'),
      p('<p><b>Atomic design</b> হলো UI-কে ছোট থেকে বড় লেয়ারে ভাবার একটা উপায় — যেকোনো codebase-এ component সংগঠিত করার জন্য একটা কার্যকর mental model, শুধু একটা নির্দিষ্ট টুলের জন্য না।</p>'),
      table(
        ['লেয়ার', 'উদাহরণ'],
        [
          ['Atoms', 'সবচেয়ে ছোট অংশ — একটা একক বাটন, একটা input field, একটা label। আরও ভাঙা যায় না আর তবুও কাজে লাগে।'],
          ['Molecules', 'একটা উদ্দেশ্যে একত্রিত কয়েকটা atom — একটা search bar একটা input atom আর একটা button atom।'],
          ['Organisms', 'একটা আলাদা section-এ একত্রিত কয়েকটা molecule — একটা logo, একটা nav, আর একটা search bar সহ একটা header।'],
          ['Templates / Pages', 'একটা আসল page layout-এ সাজানো organism, আসল content দিয়ে ভরা।'],
        ]
      ),
      p('<p>ফলাফল: একবার তৈরি করা, token থেকে style করা একটা "Button" পুরো সাইটের প্রতিটা form, প্রতিটা card, আর প্রতিটা modal-এ পুনরায় ব্যবহার হয় — প্রয়োজন হওয়ার প্রতিবার সামান্য ভিন্নভাবে পুনরায় ডিজাইন করার বদলে।</p>'),

      h(2, 'এরপর কোথায়', 'where-this-leaves-you'),
      p('<p>এই চিন্তা থেকে উপকৃত হতে একটা formal design-system টুল বা একটা পুরো টিম দরকার নেই। একটা ছোট personal project-ও একবার আপনার রং, spacing, আর টাইপ সাইজ variable হিসেবে define করে সবজায়গায় পুনরায় ব্যবহার করলে, আর একটা বাটন বা card প্রতিটা page-এ এর style নতুন করে টাইপ করার বদলে একটা পুনরায় ব্যবহারযোগ্য অংশ হিসেবে তৈরি করলেই বেশি সামঞ্জস্যপূর্ণ হয়ে ওঠে।</p>')
    ],
  },
}

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'css').single()
  if (catErr || !category) { console.error('Category "css" not found.'); process.exit(1) }

  console.log(`Category id: ${category.id}`)
  if (DRY_RUN) {
    console.log(`  [en] css/${lesson.slug} — ${lesson.en.title} (${lesson.en.blocks.length} blocks, sort_order ${lesson.sortOrder})`)
    console.log(`  [bn] css/${lesson.slug} — ${lesson.bn.title} (${lesson.bn.blocks.length} blocks)`)
    console.log('\n[dry-run] no writes made.')
    return
  }

  const path = `css/${lesson.slug}`
  const row = {
    category_id: category.id, slug: lesson.slug, path, old_path: null,
    title: lesson.en.title, meta_title: lesson.en.metaTitle, meta_description: lesson.en.metaDescription,
    blocks: lesson.en.blocks, toc: toc(lesson.en.blocks), status: 'published',
    sort_order: lesson.sortOrder, published_at: new Date().toISOString(),
  }
  const { data: existing } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
  let docId = existing?.id
  if (docId) {
    const { error } = await supabase.from('docs').update(row).eq('id', docId)
    if (error) { console.error('en update failed:', error.message); process.exit(1) }
  } else {
    const { data: inserted, error } = await supabase.from('docs').insert(row).select('id').single()
    if (error) { console.error('en insert failed:', error.message); process.exit(1) }
    docId = inserted.id
  }
  console.log(`  ✓ en  ${path}`)

  const trRow = {
    doc_id: docId, locale: 'bn', title: lesson.bn.title, meta_title: lesson.bn.metaTitle,
    meta_description: lesson.bn.metaDescription, blocks: lesson.bn.blocks, toc: toc(lesson.bn.blocks),
  }
  const { data: existingTr } = await supabase.from('doc_translations').select('doc_id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
  const { error: trErr } = existingTr
    ? await supabase.from('doc_translations').update(trRow).eq('doc_id', docId).eq('locale', 'bn')
    : await supabase.from('doc_translations').insert(trRow)
  if (trErr) { console.error('bn failed:', trErr.message); process.exit(1) }
  console.log(`  ✓ bn  ${path}`)
  console.log('\n✅ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
