#!/usr/bin/env node
// User-supplied rewrite of the bn translation for basics/what-is-a-computer
// (2026-09-08) — simpler wording throughout, and per the user's confirmed
// choice, drops two sections that only exist in the bn copy's old draft
// (the four-operations table + calculator analogy, and the standalone
// "general-purpose machine" explanation) plus turns the tip callout into a
// plain heading+paragraph. NOTE: the English translation still has the old,
// fuller structure — this makes bn and en diverge; not fixed here, flagged
// to the user separately.
//
// Both existing images are kept, just the cycle-diagram one moves up (the
// user's new bullet-list text references "the image above").
//
// Usage: node scripts/fix-what-is-a-computer-bn.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const ROOT = path.resolve(import.meta.dirname, '..')
const DRY_RUN = process.argv.includes('--dry-run')

const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

const bnBlocks = [
  {
    id: 'zlX_Z-IOJBez', type: 'richtext',
    html: '<p><b>কম্পিউটার</b> এমন একটি যন্ত্র যা তথ্য গ্রহণ করে (ইনপুট), একটি নির্দিষ্ট নির্দেশাবলী অনুসরণ করে সেই তথ্য নিয়ে কাজ করে (প্রসেস), আর একটি ফলাফল তৈরি করে (আউটপুট)। ব্যাস, এটুকুই — আপনার পকেটের ফোন থেকে শুরু করে একটি ওয়েবসাইট চালানো সার্ভার পর্যন্ত, কম্পিউটার সম্পর্কে আপনি যা কিছু শিখবেন, সবকিছুরই ভিত্তি এই একটি ধারণা।</p>',
  },
  {
    id: 'IR9B5J21HUtr', type: 'heading', level: 2, anchor: 'what-makes-something-a-computer',
    text: 'কোন বিষয়গুলো একটি কম্পিউটারকে কম্পিউটার বানায়?',
  },
  {
    id: 'ISWPwjjFnRjj', type: 'richtext',
    html: '<p>"কম্পিউটার" শব্দটি শুনলে হয়তো আপনার মনে একটি ডেস্কটপ পিসি-র ছবি ভেসে ওঠে, কিন্তু আসল বিষয়টা এর চেয়ে অনেক বড়। কম্পিউটার এমন একটা যন্ত্র, যা <b>ইনপুট</b> গ্রহণ করতে পারে, একটি স্টোরড ইন্সট্রাকশন সেট (যাকে বলা হয় <b>প্রোগ্রাম</b>) অনুযায়ী সেটি প্রসেস করতে পারে, আর <b>আউটপুট</b> দিতে পারে — সম্পূর্ণ অটোম্যাটিক্যালি, প্রতিবার ইউজারকে নিজে হাতে কাজটা করতে হয় না।</p>',
  },
  {
    id: 'S18mXp3CQENJ', type: 'image', width: 1024, height: 768,
    publicId: 'docs/img/basics/what-is-a-computer-1',
    alt: 'চারটি মৌলিক কম্পিউটার কাজ — ইনপুট, প্রসেস, আউটপুট, আর স্টোরেজ — একটি চক্রাকারে দেখানো ডায়াগ্রাম',
    caption: 'ইনপুট, প্রসেস, আউটপুট, আর স্টোরেজ — এই ক্রমেই প্রতিটি কম্পিউটার এই চারটি কাজ করে।',
  },
  {
    id: 'KYgbA_VrsMuM', type: 'heading', level: 2, anchor: 'where-you-already-use-computers',
    text: 'আপনি ইতিমধ্যেই বিভিন্ন জায়গায় কম্পিউটার ব্যবহার করছেন',
  },
  {
    id: 'NAn0a6in4rUT', type: 'richtext',
    html: '<p>কম্পিউটার প্রায় সব জায়গাতেই আছে, শুধু ডেস্কে নয়:</p><ul><li>আপনার পকেটের <b>স্মার্টফোন</b>টিও একটি কম্পিউটার, যেটি পাশাপাশি ফোন কলও করতে পারে।</li><li>একটি <b>স্মার্ট টিভি</b>, ডিজিটাল ডিসপ্লে-যুক্ত একটি <b>ওয়াশিং মেশিন</b>, আর আধুনিক <b>গাড়ির ড্যাশবোর্ড</b> — এদের সবগুলোর ভেতরেই ছোট ছোট কম্পিউটার নিজস্ব প্রোগ্রাম চালাচ্ছে।</li><li>একটি <b>ATM</b> ইনপুট নেয় (আপনার কার্ড আর PIN), সেটি প্রসেস করে (আপনার ব্যালেন্স যাচাই করে), আর আউটপুট দেয় (আপনার টাকা আর একটি রসিদ) — উপরের ছবিতে দেখানো সেই একই চার-ধাপের চক্র।</li></ul>',
  },
  {
    id: 'dFC7DLI3nMnB', type: 'heading', level: 2, anchor: 'do-you-need-engineering',
    text: 'কম্পিউটার শেখার জন্য আমাকে ইঞ্জিনিয়ারিং পড়তে হবে নাকি?',
  },
  {
    id: 'gYq0f4pR3sKz', type: 'richtext',
    html: '<p>একদমই না। একটি প্রসেসর চিপ-স্তরে কীভাবে কাজ করে তা বোঝার দরকার নেই। কম্পিউটার ভালোভাবে ব্যবহার করতে, এমনকি এতে দক্ষ হয়ে উঠতে সায়েন্স বা ইঞ্জিনিয়ারিং পড়তে হবে না। ইনপুট, প্রসেস, আউটপুট, স্টোরেজ, আর "জেনারেল-পারপাস" — এই ধারণাগুলো বুঝলেই বাকি সব কিছু শিখতে সুবিধা হবে।</p>',
  },
  {
    id: 'gHFtdSj96hMG', type: 'heading', level: 2, anchor: 'what-this-section-covers',
    text: 'এই অংশে যা যা শিখবেন',
  },
  {
    id: 'MVoL8gRvDmZA', type: 'richtext',
    html: '<p>Computer Basics-এর বাকি অধ্যায়গুলো এই পুরো ছবিটার প্রতিটি অংশ ক্রমানুসারে দেখাবে: সময়ের সাথে কম্পিউটার কীভাবে বদলেছে, হার্ডওয়্যার কেমন, এটি কীভাবে তথ্য মনে রাখে আর স্টোর করে রাখে, মাত্র দুটি সংখ্যা (০ আর ১) দিয়ে এটি কীভাবে "চিন্তা" করে, কোন সফটওয়্যার একে কী করতে হবে বলে দেয়, আর লক্ষ লক্ষ কম্পিউটার কীভাবে নেটওয়ার্কের মাধ্যমে একে অপরের সাথে কথা বলে — এমনকি এখন এই যে ওয়েব পেজটি দেখছেন সেটি কীভাবে কাজ করছে সেই বিষয়টিও বুঝতে পারবেন।</p>',
  },
  {
    id: '-DU1P7GNgneK', type: 'image', width: 1536, height: 1024,
    publicId: 'docs/img/basics/what-is-a-computer',
    alt: 'একটা infographic যেখানে কম্পিউটারের চারটি মূল operation দেখানো হয়েছে — input, process, output, storage — স্মার্টফোন, ATM, আর ওয়াশিং মেশিনের মতো দৈনন্দিন উদাহরণ সহ',
    caption: 'প্রতিটি কম্পিউটার যে চারটি মূল কাজ করে — কীবোর্ডে টাইপ করা থেকে স্ক্রিনে ভিডিও দেখা পর্যন্ত।',
  },
]

const metaDescription = 'কম্পিউটার আসলে কী, আর প্রতিটি কম্পিউটার যে চারটি মৌলিক কাজ করে তার একটি সহজবোধ্য পরিচিতি।'

const { data: doc, error: docErr } = await supabase.from('docs').select('id').eq('path', 'basics/what-is-a-computer').single()
if (docErr) throw docErr

console.log(DRY_RUN ? '[dry-run] would update' : 'updating', 'doc_translations for', doc.id, 'locale bn')
console.log('blocks:', bnBlocks.length, '| headings:', toc(bnBlocks).length)

if (!DRY_RUN) {
  const { error } = await supabase.from('doc_translations')
    .update({ blocks: bnBlocks, toc: toc(bnBlocks), meta_description: metaDescription })
    .eq('doc_id', doc.id).eq('locale', 'bn')
  if (error) throw error
  console.log('done')
}
