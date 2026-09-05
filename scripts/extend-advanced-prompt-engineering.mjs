#!/usr/bin/env node
// Extends ai/advanced-prompt-engineering with 2 sections from roadmap.sh's
// Prompt Engineering roadmap PDF (user-supplied 2026-09-03): sampling
// parameters (temperature, top-k/top-p, max tokens, stop sequences) and a
// few more reasoning techniques (step-back, self-consistency, ReAct).
// Everything else on that roadmap (fine-tuning, prompt debiasing/ensembling,
// LLM self-eval, calibration, automated eval, prompt versioning, red
// teaming) judged AI-engineer/production territory, out of scope — see
// D-127 discussion in DECISIONS.md. Prompt injection already covered via an
// existing callout, not touched.
//
// Inserts both new sections right before the lesson's closing paragraph
// (matched by block id), for en and bn. Idempotent: checks for the new
// heading anchors before inserting.
//
// Usage: node scripts/extend-advanced-prompt-engineering.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')
const PATH = 'ai/advanced-prompt-engineering'
const CLOSING_PARA_ID_EN = 'rIAqv6sqxUVF'
const CLOSING_PARA_ID_BN = '6IfbZVb1VHkq'

function h(level, text, anchor) { return { id: nanoid(12), type: 'heading', level, text, anchor } }
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function table(header, rows, caption) { return { id: nanoid(12), type: 'table', header, rows, caption } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

const newBlocksEn = [
  h(2, 'Controlling Output: Sampling Parameters', 'controlling-output-sampling-parameters'),
  p('<p>Beyond the prompt itself, most AI tools — especially when used through an API or a "playground" — expose settings that control <i>how</i> the model picks its next word. Knowing these helps explain why the same prompt can give a different answer twice, and lets you dial an AI toward consistency or creativity on purpose.</p>'),
  table(
    ['Setting', 'What it controls'],
    [
      ['Temperature', 'Randomness. Low (near 0) gives focused, repeatable answers — good for facts and code. High (near 1-2) gives varied, creative answers — good for brainstorming.'],
      ['Top-K / Top-P', 'How many candidate next-words the model is allowed to consider. Lower values narrow it to the most likely few words; higher values allow more variety.'],
      ['Max Tokens', 'A hard cap on response length. Useful to stop a runaway answer or keep API costs predictable.'],
      ['Stop Sequences', 'Text that tells the model to stop generating the moment it appears — e.g. stopping right after a closing <code>```</code> in a code block.'],
    ]
  ),
  p('<p>You won\'t see all of these in every AI chat app — many hide them behind a simple "creative / balanced / precise" toggle. But the underlying idea is the same: temperature is the one worth knowing by name, since it\'s the setting you\'ll most often see exposed directly.</p>'),

  h(2, 'A Few More Reasoning Techniques', 'a-few-more-reasoning-techniques'),
  p('<p>Chain-of-thought covers most everyday cases. A few related techniques go further for harder problems — worth recognising by name even if you reach for them rarely.</p>'),
  table(
    ['Technique', 'What it does'],
    [
      ['Step-back prompting', 'Ask the model a broader, more general question first ("what pricing models exist for SaaS products?"), then use that answer to tackle the specific question. Helps when a direct answer tends to be too narrow or misses context.'],
      ['Self-consistency', 'Ask the same question multiple times (or with slightly different phrasing) and go with the answer that comes up most often. Catches cases where one single attempt happens to reason its way to a wrong answer.'],
      ['ReAct (Reason + Act)', 'The model alternates between reasoning about what to do and actually taking an action — like searching the web or calling a tool — using each result to decide the next step. This is the core idea behind how AI agents work, covered in this course\'s own agents lesson.'],
    ]
  ),
]

const newBlocksBn = [
  h(2, 'আউটপুট নিয়ন্ত্রণ: স্যাম্পলিং প্যারামিটার', 'controlling-output-sampling-parameters'),
  p('<p>প্রম্পটের বাইরেও, বেশিরভাগ AI টুল — বিশেষ করে API বা "প্লেগ্রাউন্ড"-এর মাধ্যমে ব্যবহার করলে — এমন সেটিং দেখায় যা নিয়ন্ত্রণ করে মডেল কীভাবে তার পরের শব্দ বেছে নেয়। এগুলো জানা বুঝতে সাহায্য করে কেন একই প্রম্পট দুইবার ভিন্ন উত্তর দিতে পারে, আর ইচ্ছাকৃতভাবে একটা AI-কে সামঞ্জস্যতা বা সৃজনশীলতার দিকে নিয়ে যেতে দেয়।</p>'),
  table(
    ['সেটিং', 'কী নিয়ন্ত্রণ করে'],
    [
      ['Temperature', 'র‍্যান্ডমনেস। কম (০-এর কাছাকাছি) ফোকাসড, পুনরাবৃত্তিযোগ্য উত্তর দেয় — তথ্য আর কোডের জন্য ভালো। বেশি (১-২-এর কাছাকাছি) বৈচিত্র্যময়, সৃজনশীল উত্তর দেয় — ব্রেনস্টর্মিংয়ের জন্য ভালো।'],
      ['Top-K / Top-P', 'মডেলকে কতগুলো সম্ভাব্য পরবর্তী-শব্দ বিবেচনা করতে দেওয়া হয়। কম মান সবচেয়ে সম্ভাব্য কয়েকটা শব্দে সংকুচিত করে; বেশি মান বেশি বৈচিত্র্যের সুযোগ দেয়।'],
      ['Max Tokens', 'উত্তরের দৈর্ঘ্যের একটা কঠোর সীমা। একটা চলতে থাকা উত্তর থামাতে বা API খরচ পূর্বাভাসযোগ্য রাখতে দরকারি।'],
      ['Stop Sequences', 'যে টেক্সট দেখা মাত্র মডেলকে জেনারেট করা থামাতে বলে — যেমন একটা কোড ব্লকে বন্ধ হওয়া <code>```</code>-এর ঠিক পরে থামানো।'],
    ]
  ),
  p('<p>প্রতিটা AI চ্যাট অ্যাপে এগুলো সব দেখতে পাবেন না — অনেকে এগুলো একটা সহজ "সৃজনশীল / ভারসাম্যপূর্ণ / নির্ভুল" টগলের পেছনে লুকিয়ে রাখে। কিন্তু মূল ধারণা একই: temperature নাম ধরে জানার মতো একটা, কারণ এটাই সবচেয়ে বেশি সরাসরি দেখানো সেটিং।</p>'),

  h(2, 'আরও কয়েকটা রিজনিং কৌশল', 'a-few-more-reasoning-techniques'),
  p('<p>চেইন-অফ-থট বেশিরভাগ প্রতিদিনের ক্ষেত্র কভার করে। আরও কঠিন সমস্যার জন্য কয়েকটা সম্পর্কিত কৌশল আরও এগিয়ে যায় — কদাচিৎ ব্যবহার করলেও নাম ধরে চেনার মতো।</p>'),
  table(
    ['কৌশল', 'এটা কী করে'],
    [
      ['স্টেপ-ব্যাক প্রম্পটিং', 'প্রথমে মডেলকে একটা বিস্তৃত, আরও সাধারণ প্রশ্ন করুন ("SaaS প্রোডাক্টের জন্য কী কী প্রাইসিং মডেল আছে?"), তারপর সেই উত্তর ব্যবহার করে নির্দিষ্ট প্রশ্নে যান। যখন একটা সরাসরি উত্তর খুব সংকীর্ণ হতে থাকে বা কনটেক্সট মিস করে তখন সাহায্য করে।'],
      ['সেলফ-কনসিসটেন্সি', 'একই প্রশ্ন একাধিকবার (বা সামান্য ভিন্ন ভাষায়) জিজ্ঞাসা করুন আর যে উত্তরটা সবচেয়ে বেশি আসে সেটা নিন। এমন ক্ষেত্র ধরে যেখানে একটা মাত্র চেষ্টা ভুল উত্তরে যুক্তি করে ফেলে।'],
      ['ReAct (Reason + Act)', 'মডেল কী করতে হবে তা নিয়ে যুক্তি করা আর আসলে একটা কাজ করার মধ্যে পালাক্রমে চলে — যেমন ওয়েব সার্চ করা বা একটা টুল কল করা — প্রতিটা ফলাফল ব্যবহার করে পরের ধাপ ঠিক করে। এটাই AI এজেন্ট কীভাবে কাজ করে তার মূল ধারণা, এই কোর্সের নিজস্ব এজেন্ট পাঠে কভার করা হয়েছে।'],
    ]
  ),
]

async function main() {
  const { data: doc, error: docErr } = await supabase.from('docs').select('id,blocks').eq('path', PATH).single()
  if (docErr || !doc) { console.error('Not found:', docErr?.message); process.exit(1) }

  if (doc.blocks.some(b => b.anchor === 'controlling-output-sampling-parameters')) {
    console.log('Already extended (en). Skipping en.')
  }
  const { data: tr, error: trErr } = await supabase.from('doc_translations').select('blocks').eq('doc_id', doc.id).eq('locale', 'bn').single()
  if (trErr || !tr) { console.error('bn not found:', trErr?.message); process.exit(1) }

  const enDone = doc.blocks.some(b => b.anchor === 'controlling-output-sampling-parameters')
  const bnDone = tr.blocks.some(b => b.anchor === 'controlling-output-sampling-parameters')

  console.log(`en: ${enDone ? 'already extended, skip' : `insert ${newBlocksEn.length} blocks`}`)
  console.log(`bn: ${bnDone ? 'already extended, skip' : `insert ${newBlocksBn.length} blocks`}`)

  if (DRY_RUN) { console.log('\n[dry-run] no writes made.'); return }

  if (!enDone) {
    const idx = doc.blocks.findIndex(b => b.id === CLOSING_PARA_ID_EN)
    if (idx === -1) { console.error('Closing paragraph (en) not found — anchor id may have changed.'); process.exit(1) }
    const enBlocks = [...doc.blocks.slice(0, idx), ...newBlocksEn, ...doc.blocks.slice(idx)]
    const { error } = await supabase.from('docs').update({ blocks: enBlocks, toc: toc(enBlocks) }).eq('id', doc.id)
    if (error) { console.error('en update failed:', error.message); process.exit(1) }
    console.log('✓ en updated')
  }

  if (!bnDone) {
    const idx = tr.blocks.findIndex(b => b.id === CLOSING_PARA_ID_BN)
    if (idx === -1) { console.error('Closing paragraph (bn) not found — anchor id may have changed.'); process.exit(1) }
    const bnBlocks = [...tr.blocks.slice(0, idx), ...newBlocksBn, ...tr.blocks.slice(idx)]
    const { error } = await supabase.from('doc_translations').update({ blocks: bnBlocks, toc: toc(bnBlocks) }).eq('doc_id', doc.id).eq('locale', 'bn')
    if (error) { console.error('bn update failed:', error.message); process.exit(1) }
    console.log('✓ bn updated')
  }

  console.log('\n✅ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
