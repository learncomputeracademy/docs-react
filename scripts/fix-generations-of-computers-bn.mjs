#!/usr/bin/env node
// User-supplied wording fix (2026-09-08) for the bn translation of
// basics/generations-of-computers — polish pass on the intro + all 5
// generation paragraphs, headings unchanged. The user's paste stopped after
// the fifth-generation paragraph, so the "At a Glance" table, timeline
// image, "years are approximate" callout, closing paragraph, and final
// infographic are left untouched (copied verbatim from the current row).
// Bold markup on key terms (re-added, wasn't in the user's plain-text
// paste) matches the existing style. One typo fixed: duplicate "কেন" in
// the intro's last sentence.
//
// Usage: node scripts/fix-generations-of-computers-bn.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const ROOT = path.resolve(import.meta.dirname, '..')
const DRY_RUN = process.argv.includes('--dry-run')

const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

const { data: doc, error: docErr } = await supabase.from('docs').select('id').eq('path', 'basics/generations-of-computers').single()
if (docErr) throw docErr

const { data: tr, error: trErr } = await supabase.from('doc_translations').select('blocks').eq('doc_id', doc.id).eq('locale', 'bn').single()
if (trErr) throw trErr

const revisedHtml = {
  ZeAprDmi0mQ8: '<p>অতীতে কম্পিউটার আজকের মতো দেখতে বা কাজ করত না। কম্পিউটারের সার্কিট তৈরিতে ব্যবহৃত মূল প্রযুক্তির ভিত্তিতে ইতিহাসবিদ আর ইঞ্জিনিয়াররা কম্পিউটারের বিবর্তনকে পাঁচটি বড় Generation-এ (প্রজন্ম) ভাগ করেন। এই প্রজন্মগুলো বুঝলে আপনি বুঝতে পারবেন কেন আপনার পকেটের স্মার্ট ফোনটি একসময় পুরো একটি ঘর জুড়ে থাকা কম্পিউটারের চেয়েও বেশি শক্তিশালী।</p>',
  gG13bc1JZU_7: '<p>প্রথম দিকের ইলেকট্রনিক কম্পিউটারগুলো তথ্য জমা বা স্টোরে রাখতে আর প্রসেস করতে <b>ভ্যাকুয়াম টিউব</b> ব্যবহার করত। একটি ভ্যাকুয়াম টিউব একটি প্রাথমিক ইলেকট্রনিক সুইচের মতো কাজ করত, কিন্তু প্রতিটির আকার প্রায় একটি বাল্বের সমান ছিল, প্রচুর তাপ তৈরি করত, আর প্রায়ই নষ্ট হয়ে যেত। ফলে প্রথম-প্রজন্মের কম্পিউটার ছিল বিশাল আকারের — প্রায়ই একটি সম্পূর্ণ ঘর জুড়ে থাকত — এটা তৈরি ও চালাতে অত্যন্ত ব্যয়বহুল, আর ঘনঘন খারাপ হয়ে যেত।</p><p>প্রোগ্রাম ইনপুট দেওয়া হতো <b>পাঞ্চ কার্ড</b> দিয়ে, আর ফলাফল বের হতো প্রিন্টআউটে — আজকের মতো কীবোর্ড বা স্ক্রিন তখন ছিল না। এর অন্যতম সুপরিচিত উদাহরণ <b>ENIAC</b>, যা 1945 সালে সম্পন্ন হয়, এতে হাজার হাজার ভ্যাকুয়াম টিউব ব্যবহার করা হয়েছিল।</p>',
  V0zPn2NLQiHr: '<p>ভারী, বড়ো ভ্যাকুয়াম টিউবের জায়গায় স্থান করে নিল <b>ট্রানজিস্টর</b> — এটি একটি ইলেক্ট্রনিক সুইচ। এটি ভ্যাকুয়াম টিউবের তুলনায় অনেক হালকা, ছোট আর অনেক বেশি নির্ভরযোগ্য। ট্রানজিস্টর অনেক কম পাওয়ার খরচ করত, অনেক কম তাপ উৎপন্ন করত, আর ভ্যাকুয়াম টিউবের তুলনায় খুব কমই নষ্ট হতো — যার মানে কম্পিউটার একই সাথে অনেক ছোট, দ্রুত, আর নির্ভরযোগ্য হয়ে উঠতে পারল।</p><p>এই প্রজন্ম এমন কিছু প্রাথমিক প্রোগ্রামিং ভাষারও প্রচলন করেছিল যা সরাসরি মেশিন নির্দেশাবলীর (machine instruction) তুলনায় ইংরেজি ভাষার বেশি কাছাকাছি ছিল, যার ফলে মেশিনের অভ্যন্তরীণ তারের সংযোগ নিয়ে সরাসরি কাজ না করেই মানুষের পক্ষে সফটওয়্যার লেখা সহজ হয়ে যায়।</p>',
  wcBOt3PApsvx: '<p>এই জেনেরেশনে ইঞ্জিনিয়াররা এমন একটি উপায় খুঁজে বের করলেন যাতে অনেকগুলো ট্রানজিস্টর সিলিকনের একটি ছোট চিপের উপর বসানো যায়, যাকে বলা হয় <b>ইন্টিগ্রেটেড সার্কিট</b>। হাজার হাজার আলাদা ট্রানজিস্টর হাতে জোড়া লাগানোর বদলে, এখন একটি মাত্র চিপ অনেকগুলোর কাজ করতে পারত — এতে কম্পিউটার আরও ছোট হলো, খরচ কমল, আর নির্ভরযোগ্যতাও একই সাথে বাড়ল।</p><p>এই প্রজন্মেই কম্পিউটার প্রথম এমন একটি যন্ত্রে পরিণত হয়, যা ব্যবহারকারী কেবল পাঞ্চ কার্ড ও প্রিন্টআউটের পরিবর্তে <b>কিবোর্ড</b> ও <b>মনিটর</b> ব্যবহার করে সরাসরি ব্যবহার করতে পারত।</p>',
  TnDfZ6CSqvlX: '<p>চতুর্থ প্রজন্ম এলো যখন ইঞ্জিনিয়াররা একটি সম্পূর্ণ <b>প্রসেসর</b> বা কম্পিউটারের "মস্তিষ্ক" — একটি মাত্র চিপে বসাতে সক্ষম হলেন, যাকে বলা হয় <b>মাইক্রোপ্রসেসর</b>। এটাই ছিল সেই যুগান্তকারী আবিষ্কার যা <b>পার্সোনাল কম্পিউটার</b>কে সম্ভব করে তুলল — এমন একটি কম্পিউটার যা একটি ঘর জুড়ে না থেকে একটি ডেস্কে, এমনকি পরবর্তীতে একটি কোলে বসার মতো ছোট আর সাশ্রয়ী হয়ে উঠল।</p><p>আজ আপনি যে কম্পিউটারের সাথে কাজ করেন — ডেস্কটপ, ল্যাপটপ, স্মার্টফোন, ট্যাবলেট, এমনকি স্মার্ট যন্ত্রপাতি — সবই এই চতুর্থ প্রজন্মের দান। 1970-এর দশক থেকে যা বদলেছে তা শুধু মাইক্রোপ্রসেসরের মূল ধারণা নয়, বরং প্রতিটি নতুন চিপ কতটা ছোট, দ্রুত, আর কম বিদ্যুৎ খরচ করে তৈরি হচ্ছে।</p>',
  wbC9BQkDvRhO: '<p>পঞ্চম প্রজন্মের কোনো নির্দিষ্ট ও সর্বসম্মত শুরুর সময় নেই, যেভাবে আগের প্রজন্মগুলোর ছিল, কারণ এটি নির্দিষ্ট কোনো হার্ডওয়্যার দিয়ে নয়, বরং কম্পিউটার আসলে কী করার জন্য তৈরি হচ্ছে তার ধারাবাহিক পরিবর্তন দিয়ে সংজ্ঞায়িত — যেমন: স্বাভাবিক ভাষা বোঝা, ছবি আর কণ্ঠস্বর চেনা, আর <b>কৃত্রিম বুদ্ধিমত্তা (AI)</b>-র কৌশল ব্যবহার করে সিদ্ধান্ত নেওয়া। এই প্রজন্মের ধারণাগুলো নিয়ে এই অংশের পরের দিকে আরও গভীরে যাওয়া হবে।</p>',
}

const bnBlocks = tr.blocks.map((b) => (b.id in revisedHtml ? { ...b, html: revisedHtml[b.id] } : b))

console.log(DRY_RUN ? '[dry-run] would update' : 'updating', 'doc_translations for', doc.id, 'locale bn')
console.log('blocks touched:', Object.keys(revisedHtml).length, '/ total blocks:', bnBlocks.length)

if (!DRY_RUN) {
  const { error } = await supabase.from('doc_translations')
    .update({ blocks: bnBlocks, toc: toc(bnBlocks) })
    .eq('doc_id', doc.id).eq('locale', 'bn')
  if (error) throw error
  console.log('done')
}
