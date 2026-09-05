#!/usr/bin/env node
// Extends the existing "UI/UX Design Principles" category (22 lessons,
// scripts/create-ui-ux-content.mjs) with 10 more lessons covering the
// behavior-design / growth-design side that was missing — BJ Fogg's
// Behavior Model, Nir Eyal's Hook Model, Nudge Theory, persuasion &
// engagement mechanics, and the lightweight business-strategy tools
// (Business Model Canvas, SWOT) a product designer actually uses. Scoped
// from a roadmap.sh "UX Design" roadmap PDF the user shared 2026-09-03 —
// asked "have you included all the topics here", answered no (none of this
// behavior/business-strategy track existed), user picked "new lessons
// inside ui-ux".
//
// Deliberately covers the persuasion/engagement techniques honestly, with
// an explicit ethics boundary against dark patterns (nudge-theory lesson,
// engagement-mechanics lesson) — this is the one place on the site closest
// to manipulative-pattern territory, so each lesson that touches it says
// plainly where the line is.
//
// No images in this batch — text/table/callout only, same density as the
// rest of the category. sort_order continues from 23 (existing max is 22).
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-ui-ux-behavior-design-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders (same shape as every other content script) ───────────

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []
let n = 23

lessons.push({
  slug: 'understanding-user-behavior', sortOrder: n++,
  en: {
    title: 'Understanding User Behavior — Why People Do What They Do',
    metaTitle: 'Understanding User Behavior | Learn Computer Academy',
    metaDescription: 'A short introduction to behavior design — the Dual Process Theory of thinking, and the spectrum from a fully conscious decision to a fully automatic habit.',
    blocks: [
      p('<p>Everything so far in this course is about making a product usable — easy to understand, easy to operate. This next stretch of lessons is about something related but different: <b>behavior design</b> — understanding why people act the way they do, so a product can be designed to actually support the behavior it\'s meant to enable.</p>'),
      h(2, 'Dual Process Theory — Two Ways of Thinking'),
      p('<p>Psychologists describe human thinking as running on two systems. <b>System 1</b> is fast, automatic, and intuitive — it\'s what reacts to a red error message or a familiar icon without conscious effort. <b>System 2</b> is slow, deliberate, and effortful — it\'s what engages when reading terms and conditions or comparing pricing plans carefully. Most everyday product interactions run on System 1; a design that forces System 2 thinking for a simple task (a confusing form, an unclear button) creates real friction.</p>'),
      h(2, 'The Spectrum of Thinking Interventions'),
      p('<p>Design decisions sit on a spectrum between two ends: fully conscious, deliberate choices (comparing options, reading details) and fully automatic habits (tapping a familiar app icon without thinking). Neither end is "better" — a banking app\'s transfer confirmation should sit closer to the deliberate end on purpose, while a habit-forming daily-use app benefits from sitting closer to the automatic end.</p>'),
      table(['System', 'Speed', 'Good product fit'], [
        ['System 1 (fast, intuitive)', 'Instant, low effort', 'Everyday, repeated actions — navigation, familiar icons, habitual flows'],
        ['System 2 (slow, deliberate)', 'Effortful, considered', 'High-stakes or irreversible actions — payments, deletions, legal agreements'],
      ]),
      callout('note', '<p>The lessons ahead build directly on this idea — Fogg\'s Behavior Model and the Hook Model are both, in effect, frameworks for understanding which system a given product moment is designed for.</p>', 'Why this comes first'),
    ],
  },
  bn: {
    title: 'User Behavior বোঝা — মানুষ কেন যা করে তা করে',
    metaTitle: 'User Behavior বোঝা | Learn Computer Academy',
    metaDescription: 'Behavior design-এর একটা ছোট পরিচয় — চিন্তার Dual Process Theory, আর একটা সম্পূর্ণ conscious সিদ্ধান্ত থেকে একটা সম্পূর্ণ automatic habit পর্যন্ত spectrum।',
    blocks: [
      p('<p>এই কোর্সে এখন পর্যন্ত সবকিছু একটা product-কে usable বানানো নিয়ে — বোঝা সহজ, চালানো সহজ। এই পরের কয়েকটা lesson সম্পর্কিত কিন্তু ভিন্ন একটা বিষয় নিয়ে: <b>behavior design</b> — মানুষ কেন যেভাবে কাজ করে তা বোঝা, যাতে একটা product এমনভাবে design করা যায় যা এর জন্য বানানো আচরণটাকে আসলেই সাপোর্ট করে।</p>'),
      h(2, 'Dual Process Theory — চিন্তার দুটো উপায়', 'dual-process-theory-চিন্তার-দুটো-উপায়'),
      p('<p>Psychologist-রা মানুষের চিন্তাকে দুটো system-এ চলা হিসেবে বর্ণনা করেন। <b>System 1</b> দ্রুত, automatic, আর intuitive — এটাই একটা লাল error message বা পরিচিত icon-এ conscious চেষ্টা ছাড়া react করে। <b>System 2</b> ধীর, deliberate, আর effortful — এটাই terms and conditions পড়া বা pricing plan সাবধানে তুলনা করার সময় কাজে লাগে। বেশিরভাগ প্রতিদিনের product interaction System 1-এ চলে; একটা সহজ কাজের জন্য System 2 চিন্তা করতে বাধ্য করা একটা design (একটা confusing form, একটা অস্পষ্ট button) আসল friction তৈরি করে।</p>'),
      h(2, 'Thinking Intervention-এর Spectrum', 'thinking-intervention-এর-spectrum'),
      p('<p>Design সিদ্ধান্ত দুটো প্রান্তের মধ্যে একটা spectrum-এ থাকে: সম্পূর্ণ conscious, deliberate পছন্দ (option তুলনা করা, detail পড়া) আর সম্পূর্ণ automatic habit (না ভেবেই একটা পরিচিত app icon চাপা)। কোনো প্রান্তই "ভালো" না — একটা banking app-এর transfer confirmation ইচ্ছাকৃতভাবে deliberate প্রান্তের কাছাকাছি থাকা উচিত, যেখানে একটা habit-forming দৈনিক-ব্যবহারের app automatic প্রান্তের কাছাকাছি থাকলে উপকৃত হয়।</p>'),
      table(['System', 'গতি', 'ভালো product fit'], [
        ['System 1 (দ্রুত, intuitive)', 'তাৎক্ষণিক, কম effort', 'প্রতিদিনের, বারবার হওয়া action — navigation, পরিচিত icon, habitual flow'],
        ['System 2 (ধীর, deliberate)', 'Effortful, বিবেচিত', 'High-stakes বা irreversible action — payment, deletion, legal agreement'],
      ]),
      callout('note', '<p>সামনের lesson-গুলো সরাসরি এই ধারণার উপর তৈরি — Fogg-এর Behavior Model আর Hook Model দুটোই, কার্যকরভাবে, একটা নির্দিষ্ট product moment কোন system-এর জন্য design করা তা বোঝার framework।</p>', 'কেন এটা প্রথমে আসে'),
    ],
  },
})

lessons.push({
  slug: 'bj-foggs-behavior-model', sortOrder: n++,
  en: {
    title: "BJ Fogg's Behavior Model",
    metaTitle: "BJ Fogg's Behavior Model | Learn Computer Academy",
    metaDescription: "B=MAP — Behavior happens when Motivation, Ability, and a Prompt converge at the same moment. How the model is used to diagnose why a designed action isn't happening.",
    blocks: [
      p('<p>Stanford researcher BJ Fogg proposed a simple, useful model for when a behavior actually happens: <b>B = MAP</b> — Behavior occurs when <b>M</b>otivation, <b>A</b>bility, and a <b>P</b>rompt all converge at the same moment. Miss any one of the three, and the behavior doesn\'t happen, no matter how well-designed the rest of the experience is.</p>'),
      h(2, 'The Three Elements'),
      table(['Element', 'What it means', 'Example'], [
        ['Motivation', 'How much the person wants to do it right now', 'Wanting to save money vs. not caring today'],
        ['Ability', 'How easy the action actually is to do', 'A one-tap checkout vs. a 12-field form'],
        ['Prompt', 'Something that triggers the action at the right moment', 'A notification, a visible button, a reminder email'],
      ]),
      h(2, 'Diagnosing a Failing Action'),
      p('<p>The model\'s real value is diagnostic — when users aren\'t doing something a product wants them to do, the model asks which of the three is actually missing. A designer\'s instinct is often to add more motivation (bigger call-to-action, more persuasive copy), but the real problem is frequently <b>ability</b> — the action is simply too hard, and no amount of motivational copy fixes that. Fogg\'s own advice: when in doubt, make it easier before trying to make people want it more.</p>'),
      h(2, "Fogg's Behavior Grid"),
      p('<p>Fogg also classifies behaviors along two axes: whether the behavior is <b>new or existing</b>, and whether it\'s meant to happen <b>once, for a period, or forever</b> (as a habit). A one-time signup and a daily habit loop are fundamentally different design problems — the grid is a quick check on which one is actually being designed for before reaching for a specific technique.</p>'),
      callout('tip', '<p>Before adding another motivational nudge to a struggling flow, ask honestly: is this actually an ability problem in disguise? Reducing steps usually beats adding persuasion.</p>', 'The most common mistake this model catches'),
    ],
  },
  bn: {
    title: "BJ Fogg-এর Behavior Model",
    metaTitle: "BJ Fogg-এর Behavior Model | Learn Computer Academy",
    metaDescription: "B=MAP — Behavior ঘটে যখন Motivation, Ability, আর একটা Prompt একই মুহূর্তে একসাথে আসে। একটা design করা action কেন ঘটছে না তা diagnose করতে model কীভাবে ব্যবহার হয়।",
    blocks: [
      p('<p>Stanford গবেষক BJ Fogg একটা behavior আসলে কখন ঘটে তার জন্য একটা সহজ, useful model প্রস্তাব করেছিলেন: <b>B = MAP</b> — Behavior ঘটে যখন <b>M</b>otivation, <b>A</b>bility, আর একটা <b>P</b>rompt সবগুলো একই মুহূর্তে একসাথে আসে। তিনটার যেকোনো একটা মিস করলে, বাকি experience যতই ভালো design হোক না কেন, behavior ঘটে না।</p>'),
      h(2, 'তিনটা Element', 'তিনটা-element'),
      table(['Element', 'এর মানে কী', 'উদাহরণ'], [
        ['Motivation', 'এই মুহূর্তে মানুষ এটা কতটা করতে চায়', 'টাকা বাঁচানোর ইচ্ছা বনাম আজ পরোয়া না করা'],
        ['Ability', 'কাজটা আসলে করা কতটা সহজ', 'এক-tap checkout বনাম ১২-field একটা form'],
        ['Prompt', 'সঠিক মুহূর্তে action trigger করে এমন কিছু', 'একটা notification, একটা visible button, একটা reminder email'],
      ]),
      h(2, 'একটা ব্যর্থ Action Diagnose করা', 'একটা-ব্যর্থ-action-diagnose-করা'),
      p('<p>এই model-এর আসল value diagnostic — একটা product চায় এমন কিছু user-রা যখন করছে না, model জিজ্ঞেস করে তিনটার মধ্যে আসলে কোনটা নেই। একজন designer-এর instinct প্রায়ই বেশি motivation যোগ করা (বড় call-to-action, বেশি persuasive copy), কিন্তু আসল সমস্যা প্রায়ই <b>ability</b> — action-টা কেবল খুব কঠিন, আর কোনো পরিমাণ motivational copy সেটা ঠিক করে না। Fogg-এর নিজের advice: সন্দেহ হলে, মানুষকে বেশি চাইতে বানানোর আগে সেটা সহজ করুন।</p>'),
      h(2, "Fogg-এর Behavior Grid"),
      p('<p>Fogg behavior-কে দুটো axis-এ classify করেন: behavior <b>নতুন না existing</b>, আর এটা <b>একবার, একটা সময়ের জন্য, বা চিরকাল</b> (একটা habit হিসেবে) ঘটার কথা। একটা one-time signup আর একটা দৈনিক habit loop মৌলিকভাবে ভিন্ন design সমস্যা — একটা নির্দিষ্ট technique-এ যাওয়ার আগে আসলে কোনটার জন্য design করা হচ্ছে তার একটা দ্রুত check এই grid।</p>'),
      callout('tip', '<p>একটা struggling flow-তে আরেকটা motivational nudge যোগ করার আগে, সৎভাবে জিজ্ঞেস করুন: এটা কি আসলে ছদ্মবেশে একটা ability সমস্যা? Step কমানো সাধারণত persuasion যোগ করার চেয়ে ভালো কাজ করে।</p>', 'এই model যে সবচেয়ে common ভুল ধরে'),
    ],
  },
})

lessons.push({
  slug: 'nir-eyals-hook-model', sortOrder: n++,
  en: {
    title: "Nir Eyal's Hook Model",
    metaTitle: "Nir Eyal's Hook Model | Learn Computer Academy",
    metaDescription: "The four-step loop behind habit-forming products — Trigger, Action, Variable Reward, Investment — and why the loop matters more than any single step.",
    blocks: [
      p('<p>From his book <i>Hooked</i>, Nir Eyal\'s model describes a four-step loop that habit-forming products run their users through, repeatedly, until the behavior becomes automatic — matching the "habit" end of Fogg\'s Behavior Grid from the previous lesson.</p>'),
      h(2, 'The Four Steps'),
      table(['Step', 'What it is', 'Example'], [
        ['1. Trigger', 'External (a notification) or internal (boredom, loneliness) cue that starts the loop', 'A message notification; the internal urge to check for updates'],
        ['2. Action', 'The simplest behavior done in anticipation of a reward', 'Opening the app, scrolling the feed'],
        ['3. Variable Reward', 'A reward whose exact content or size isn\'t fully predictable', 'Not knowing what the next post, like count, or message will be'],
        ['4. Investment', 'The user puts something in — data, content, followers, effort — that makes the product more valuable next time', 'Posting content, building a follower list, customizing a profile'],
      ]),
      h(2, 'Why "Variable" Reward Matters'),
      p('<p>A <i>predictable</i> reward loses its pull quickly — a slot machine and a vending machine both dispense something, but only one is designed to keep someone pulling the lever. Variability (not knowing exactly what\'s coming) is what makes step 3 psychologically sticky, borrowed directly from behavioral psychology research on reward schedules.</p>'),
      h(2, 'Investment Closes the Loop'),
      p('<p>The Investment step is what turns a single use into a habit loop — a user who has built a profile, a follower list, or a history of saved content has a reason to come back that a brand-new user doesn\'t. Each pass through the loop, done well, seeds the next Trigger (a new follower, a reply to a comment) automatically.</p>'),
      callout('warning', '<p>This exact model, used without restraint, is also the mechanism behind genuinely addictive product design — infinite scroll, unpredictable notification timing, and engagement metrics chased for their own sake. The next lesson draws the ethical line the Hook Model itself doesn\'t draw.</p>', 'Where this gets ethically risky'),
    ],
  },
  bn: {
    title: "Nir Eyal-এর Hook Model",
    metaTitle: "Nir Eyal-এর Hook Model | Learn Computer Academy",
    metaDescription: "Habit-forming product-এর পেছনের চার-ধাপের loop — Trigger, Action, Variable Reward, Investment — আর কেন কোনো একক ধাপের চেয়ে loop-টাই বেশি গুরুত্বপূর্ণ।",
    blocks: [
      p('<p>তার বই <i>Hooked</i> থেকে, Nir Eyal-এর model একটা চার-ধাপের loop বর্ণনা করে যার মধ্য দিয়ে habit-forming product তাদের user-দের বারবার নিয়ে যায়, যতক্ষণ না behavior automatic হয়ে যায় — আগের lesson-এর Fogg-এর Behavior Grid-এর "habit" প্রান্তের সাথে মিলে যায়।</p>'),
      h(2, 'চারটা ধাপ', 'চারটা-ধাপ'),
      table(['ধাপ', 'এটা কী', 'উদাহরণ'], [
        ['1. Trigger', 'External (একটা notification) বা internal (একঘেয়েমি, একাকীত্ব) cue যা loop শুরু করে', 'একটা message notification; update check করার internal তাগিদ'],
        ['2. Action', 'একটা reward-এর প্রত্যাশায় করা সবচেয়ে সহজ behavior', 'App খোলা, feed scroll করা'],
        ['3. Variable Reward', 'একটা reward যার সঠিক বিষয়বস্তু বা আকার সম্পূর্ণ predictable না', 'পরের post, like সংখ্যা, বা message কী হবে তা না জানা'],
        ['4. Investment', 'User কিছু ঢালে — data, content, follower, effort — যা পরের বার product-কে বেশি মূল্যবান করে', 'Content post করা, follower list বানানো, profile customize করা'],
      ]),
      h(2, 'কেন "Variable" Reward গুরুত্বপূর্ণ', 'কেন-variable-reward-গুরুত্বপূর্ণ'),
      p('<p>একটা <i>predictable</i> reward দ্রুত এর টান হারায় — একটা slot machine আর একটা vending machine দুটোই কিছু দেয়, কিন্তু শুধু একটা কাউকে lever টানতে থাকার জন্য design করা। Variability (ঠিক কী আসছে তা না জানা) হলো যা step 3-কে psychologically sticky বানায়, reward schedule নিয়ে behavioral psychology research থেকে সরাসরি ধার করা।</p>'),
      h(2, 'Investment Loop বন্ধ করে', 'investment-loop-বন্ধ-করে'),
      p('<p>Investment step হলো যা একটা একক ব্যবহারকে একটা habit loop-এ পরিণত করে — একটা profile, একটা follower list, বা saved content-এর একটা history বানানো একজন user-এর ফিরে আসার একটা কারণ আছে যা একদম নতুন user-এর নেই। Loop-এর প্রতিটা পাস, ভালোভাবে করা হলে, স্বয়ংক্রিয়ভাবে পরের Trigger বপন করে (একটা নতুন follower, একটা comment-এর reply)।</p>'),
      callout('warning', '<p>সংযম ছাড়া ব্যবহার করা এই একই model সত্যিকারের addictive product design-এর পেছনের mechanism-ও — infinite scroll, অনির্দেশ্য notification timing, আর নিজের জন্যই তাড়া করা engagement metric। পরের lesson সেই ethical লাইন টানে যা Hook Model নিজে টানে না।</p>', 'যেখানে এটা ethically ঝুঁকিপূর্ণ হয়ে যায়'),
    ],
  },
})

lessons.push({
  slug: 'nudge-theory-and-ethical-persuasion', sortOrder: n++,
  en: {
    title: 'Nudge Theory and the Line Against Dark Patterns',
    metaTitle: 'Nudge Theory and Ethical Persuasion | Learn Computer Academy',
    metaDescription: 'What a nudge actually is, how defaults and incidental design shape choices without removing them, and the concrete test that separates a nudge from a dark pattern.',
    blocks: [
      p('<p>A <b>nudge</b> (from Thaler and Sunstein\'s book of the same name) is any small design choice that predictably shapes behavior without restricting anyone\'s options or changing their economic incentives — the philosophy behind it is sometimes called <b>libertarian paternalism</b>: guide the easy path toward a good outcome, without blocking any other path.</p>'),
      h(2, 'Defaulting'),
      p('<p>Whatever option is pre-selected gets chosen disproportionately often, simply because changing it takes more effort than accepting it. Organ donation opt-out countries have dramatically higher donation rates than opt-in countries for exactly this reason — the outcome-relevant choice barely changed, only which option required effort.</p>'),
      h(2, 'Making the Desired Action Incidental'),
      p('<p>Some of the most effective nudges don\'t ask for a decision at all — they build the desired outcome into a step the user is already taking for another reason. A retirement contribution automatically increasing a little with each raise (unless opted out) achieves the savings goal as a side effect of a raise the user already wanted.</p>'),
      h(2, 'The Test: Nudge or Dark Pattern?'),
      table(['Question', 'Nudge', 'Dark pattern'], [
        ['Is the alternative option still genuinely easy to find and choose?', 'Yes', 'No — hidden, tiny, or deliberately confusing'],
        ['Does it benefit the user, or only the business?', 'The user, primarily', 'The business, at the user\'s expense'],
        ['Would the user feel tricked upon noticing it?', 'No', 'Yes'],
        ['Is it reversible without real difficulty?', 'Yes', 'Often deliberately hard to undo'],
      ]),
      callout('danger', '<p>A confirm-shaming cancel button ("No thanks, I don\'t want to save money"), a subscription that\'s one click to start and eight steps to cancel, or a pre-checked box adding a paid add-on at checkout are all dark patterns, not nudges — they fail the table above on every row. Recognizing this line matters as much as knowing the techniques themselves.</p>', 'This is the boundary that matters most in this whole track'),
    ],
  },
  bn: {
    title: 'Nudge Theory আর Dark Pattern-এর বিরুদ্ধে সীমারেখা',
    metaTitle: 'Nudge Theory আর Ethical Persuasion | Learn Computer Academy',
    metaDescription: 'একটা nudge আসলে কী, কীভাবে default আর incidental design বিকল্প সরিয়ে না দিয়ে পছন্দকে shape করে, আর একটা nudge আর একটা dark pattern-কে আলাদা করা concrete test।',
    blocks: [
      p('<p>একটা <b>nudge</b> (Thaler আর Sunstein-এর একই নামের বই থেকে) যেকোনো ছোট design পছন্দ যা কারো option সীমিত না করে বা তাদের economic incentive না বদলে predictably behavior shape করে — এর পেছনের philosophy-কে কখনো কখনো <b>libertarian paternalism</b> বলা হয়: অন্য কোনো পথ block না করে, একটা ভালো ফলাফলের দিকে সহজ পথ guide করা।</p>'),
      h(2, 'Defaulting'),
      p('<p>যে option pre-selected থাকে তা অসামঞ্জস্যপূর্ণভাবে বেশি বেছে নেওয়া হয়, কারণ এটা বদলানো এটা মেনে নেওয়ার চেয়ে বেশি effort নেয়। Organ donation opt-out দেশগুলোর opt-in দেশের চেয়ে নাটকীয়ভাবে বেশি donation rate আছে ঠিক এই কারণে — outcome-relevant পছন্দ প্রায় বদলায়নি, শুধু কোন option effort লাগে সেটা বদলেছে।</p>'),
      h(2, 'চাওয়া Action-কে Incidental বানানো', 'চাওয়া-action-কে-incidental-বানানো'),
      p('<p>সবচেয়ে effective কিছু nudge কোনো সিদ্ধান্তই চায় না — এগুলো চাওয়া outcome-কে একটা step-এর মধ্যে build করে যা user ইতিমধ্যে অন্য কারণে নিচ্ছে। প্রতিটা raise-এর সাথে একটা retirement contribution স্বয়ংক্রিয়ভাবে একটু বাড়া (opt out না করলে) সঞ্চয়ের লক্ষ্য অর্জন করে একটা raise-এর side effect হিসেবে যা user ইতিমধ্যে চেয়েছিল।</p>'),
      h(2, 'Test: Nudge না Dark Pattern?', 'test-nudge-না-dark-pattern'),
      table(['প্রশ্ন', 'Nudge', 'Dark pattern'], [
        ['বিকল্প option কি এখনো সত্যিকারভাবে খুঁজে পাওয়া আর বেছে নেওয়া সহজ?', 'হ্যাঁ', 'না — লুকানো, ছোট, বা ইচ্ছাকৃতভাবে confusing'],
        ['এটা কি user-কে, নাকি শুধু business-কে উপকৃত করে?', 'প্রধানত user-কে', 'business-কে, user-এর খরচে'],
        ['User এটা লক্ষ্য করলে কি ঠকানো মনে করবে?', 'না', 'হ্যাঁ'],
        ['এটা কি সত্যিকারের কষ্ট ছাড়াই reversible?', 'হ্যাঁ', 'প্রায়ই ইচ্ছাকৃতভাবে undo করা কঠিন'],
      ]),
      callout('danger', '<p>একটা confirm-shaming cancel button ("না ধন্যবাদ, আমি টাকা বাঁচাতে চাই না"), শুরু করতে এক click আর বাতিল করতে আট step লাগা একটা subscription, বা checkout-এ একটা paid add-on যোগ করা একটা pre-checked box — সবগুলোই dark pattern, nudge না — এগুলো উপরের table-এর প্রতিটা row-তে fail করে। কৌশলগুলো জানার মতোই এই সীমারেখাটা চেনাও গুরুত্বপূর্ণ।</p>', 'এই পুরো track-এ এটাই সবচেয়ে গুরুত্বপূর্ণ সীমারেখা'),
    ],
  },
})

lessons.push({
  slug: 'getting-attention-and-building-trust', sortOrder: n++,
  en: {
    title: 'Getting Users\' Attention and Building Trust',
    metaTitle: 'Getting Users\' Attention and Building Trust | Learn Computer Academy',
    metaDescription: 'Practical techniques for a fleeting first impression — clearing distractions, clear calls to act, and the honest use of authority, social proof, and urgency.',
    blocks: [
      p('<p>Attention is scarce and a first impression is fleeting — a user decides whether to engage within seconds. This lesson covers the concrete techniques for that narrow window, and where they honestly work is answering a question the user already has, not manufacturing one that isn\'t real.</p>'),
      h(2, 'Clearing the Page of Distractions'),
      p('<p>Every extra element on a screen competes for the same limited attention as the one action that actually matters. A landing page or key screen with one dominant call to action consistently outperforms one crowded with equally-weighted options — this is the same visual hierarchy principle from earlier in this course, applied specifically to a moment meant to prompt action.</p>'),
      h(2, 'Make It Clear Where to Act'),
      p('<p>Tell the user plainly what the action is and ask for it directly — "Start your free trial" beats a vague "Learn more" when the goal is genuinely to start a trial. Clarity about what happens next removes hesitation that has nothing to do with actual interest.</p>'),
      h(2, 'The Honest Use of Persuasion Principles'),
      table(['Principle', 'What it is', 'Honest use vs. manipulation'], [
        ['Authority', 'People trust credible, expert sources', 'Real credentials and real expert endorsement vs. fabricated or exaggerated authority'],
        ['Social proof', 'People look to others\' behavior to decide', 'Genuine review counts and real usage numbers vs. fake or inflated testimonials'],
        ['Urgency / scarcity', 'People act faster against a real deadline or limit', 'An actual limited-time offer vs. a fake countdown that resets on refresh'],
        ['Loss aversion', 'Losing something feels worse than gaining the equivalent', 'Honestly framing a real risk vs. inventing a loss that doesn\'t exist'],
      ]),
      callout('warning', '<p>Every technique in that table has a real, honest version and a manipulative, dishonest version that looks nearly identical on the surface. The test from the previous lesson still applies: would the user feel tricked on finding out how it actually works?</p>', 'Same techniques, same ethical test'),
    ],
  },
  bn: {
    title: 'User-দের মনোযোগ পাওয়া আর বিশ্বাস তৈরি করা',
    metaTitle: 'User-দের মনোযোগ পাওয়া আর বিশ্বাস তৈরি করা | Learn Computer Academy',
    metaDescription: 'একটা ক্ষণস্থায়ী প্রথম impression-এর জন্য practical technique — distraction সরানো, স্পষ্ট call to action, আর authority, social proof, আর urgency-এর সৎ ব্যবহার।',
    blocks: [
      p('<p>মনোযোগ কম আর একটা প্রথম impression ক্ষণস্থায়ী — একজন user সেকেন্ডের মধ্যে engage করবে কিনা সিদ্ধান্ত নেয়। এই lesson সেই সংকীর্ণ window-এর জন্য concrete technique কভার করে, আর এগুলো সৎভাবে কোথায় কাজ করে তা user ইতিমধ্যে যে প্রশ্ন করেছে তার উত্তর দেওয়া, যা আসল না এমন একটা তৈরি করা না।</p>'),
      h(2, 'পেজ থেকে Distraction সরানো', 'পেজ-থেকে-distraction-সরানো'),
      p('<p>একটা screen-এর প্রতিটা অতিরিক্ত element যেটা আসলে গুরুত্বপূর্ণ সেই একটা action-এর মতোই সীমিত মনোযোগের জন্য প্রতিযোগিতা করে। একটা প্রধান call to action সহ একটা landing page বা key screen সমান-weight-এর option দিয়ে ভরা একটার চেয়ে ধারাবাহিকভাবে ভালো করে — এই কোর্সের আগের একই visual hierarchy নীতি, action prompt করার জন্য বানানো একটা মুহূর্তে specifically প্রয়োগ করা।</p>'),
      h(2, 'কোথায় Act করতে হবে তা স্পষ্ট করুন', 'কোথায়-act-করতে-হবে-তা-স্পষ্ট-করুন'),
      p('<p>User-কে সরাসরি বলুন action কী আর সরাসরি চান — লক্ষ্য যখন সত্যিই একটা trial শুরু করা, তখন একটা অস্পষ্ট "Learn more"-এর চেয়ে "আপনার ফ্রি trial শুরু করুন" ভালো কাজ করে। পরে কী হবে তা নিয়ে স্পষ্টতা আসল আগ্রহের সাথে কোনো সম্পর্ক নেই এমন দ্বিধা সরিয়ে দেয়।</p>'),
      h(2, 'Persuasion নীতির সৎ ব্যবহার', 'persuasion-নীতির-সৎ-ব্যবহার'),
      table(['নীতি', 'এটা কী', 'সৎ ব্যবহার বনাম manipulation'], [
        ['Authority', 'মানুষ credible, expert source বিশ্বাস করে', 'আসল credential আর আসল expert endorsement বনাম বানানো বা বাড়িয়ে বলা authority'],
        ['Social proof', 'মানুষ সিদ্ধান্ত নিতে অন্যদের behavior দেখে', 'আসল review সংখ্যা আর আসল usage সংখ্যা বনাম fake বা বাড়িয়ে বলা testimonial'],
        ['Urgency / scarcity', 'একটা আসল deadline বা limit-এর বিরুদ্ধে মানুষ দ্রুত act করে', 'একটা আসল limited-time offer বনাম refresh-এ reset হওয়া একটা fake countdown'],
        ['Loss aversion', 'কিছু হারানো সমতুল্য কিছু পাওয়ার চেয়ে খারাপ লাগে', 'একটা আসল ঝুঁকি সৎভাবে frame করা বনাম নেই এমন একটা ক্ষতি বানানো'],
      ]),
      callout('warning', '<p>ওই table-এর প্রতিটা technique-এরই একটা আসল, সৎ version আছে আর একটা manipulative, অসৎ version যা উপর থেকে প্রায় একই দেখায়। আগের lesson-এর test এখনো প্রযোজ্য: এটা আসলে কীভাবে কাজ করে তা জানার পর user কি ঠকানো মনে করবে?</p>', 'একই technique, একই ethical test'),
    ],
  },
})

lessons.push({
  slug: 'behavior-change-strategies', sortOrder: n++,
  en: {
    title: 'Designing for Behavior Change',
    metaTitle: 'Designing for Behavior Change | Learn Computer Academy',
    metaDescription: 'Practical strategies for helping a user build a new habit or change an existing one — reducing friction, making progress visible, and helping them notice their own cues.',
    blocks: [
      p('<p>Where the earlier lessons in this track explain <i>why</i> behavior happens, this one is about concrete strategies for a product actually meant to help someone build, change, or break a behavior — a fitness app, a budgeting tool, a habit tracker.</p>'),
      h(2, 'For an Existing Behavior — Reduce Friction'),
      p('<p>When a user already wants to do something, the design job is mostly getting out of the way — fewer steps, fewer fields, fewer decisions. This is Fogg\'s "ability" lever from two lessons back, applied specifically to a wanted behavior rather than a business-desired one.</p>'),
      h(2, 'For a New Behavior — Help It Start Small'),
      p('<p>A new habit is far more likely to stick if it starts small enough to require almost no willpower — a habit-tracking app that opens on "log one glass of water" rather than "plan your full daily nutrition" is applying this directly. Once the small version becomes routine, it naturally has room to grow.</p>'),
      h(2, 'Making Progress Visible and Meaningful'),
      p('<p>A progress bar, a streak counter, or a checklist that fills in does two things: it shows the user they\'re making real progress (which sustains motivation on its own), and it makes the eventual completion feel earned rather than sudden. A completion state should also be unmistakably, visibly different from an in-progress one — vague or subtle "done" states waste this entirely.</p>'),
      table(['Design lever', 'What it does', 'Example'], [
        ['Reduce friction on a wanted action', 'Removes the ability barrier', 'One-tap logging instead of a multi-field form'],
        ['Start small', 'Requires less motivation to begin', 'A 2-minute starter habit instead of the full routine'],
        ['Make progress visible', 'Sustains motivation mid-way through', 'A progress bar, a streak, a percentage-complete indicator'],
        ['Make completion clear', 'Delivers the psychological reward', 'A distinct "done" state, a checkmark animation, a completion message'],
      ]),
      callout('tip', '<p>These same levers work for good and for exploitative design equally well — a streak counter that quietly guilt-trips a user for missing one day (rather than simply letting them resume) has crossed from behavior support into the dark-pattern territory from two lessons back.</p>', 'The line is intent, not the technique'),
    ],
  },
  bn: {
    title: 'Behavior Change-এর জন্য Design করা',
    metaTitle: 'Behavior Change-এর জন্য Design করা | Learn Computer Academy',
    metaDescription: 'একজন user-কে নতুন habit বানাতে বা একটা বিদ্যমান habit বদলাতে সাহায্য করার practical strategy — friction কমানো, progress visible বানানো, আর তাদের নিজের cue লক্ষ্য করতে সাহায্য করা।',
    blocks: [
      p('<p>এই track-এর আগের lesson-গুলো ব্যাখ্যা করে behavior <i>কেন</i> ঘটে, এটা concrete strategy নিয়ে যা একটা product আসলে কাউকে একটা behavior বানাতে, বদলাতে, বা ভাঙতে সাহায্য করার জন্য বানানো — একটা fitness app, একটা budgeting tool, একটা habit tracker।</p>'),
      h(2, 'একটা বিদ্যমান Behavior-এর জন্য — Friction কমান', 'একটা-বিদ্যমান-behavior-এর-জন্য-friction-কমান'),
      p('<p>একজন user যখন ইতিমধ্যে কিছু করতে চায়, design-এর কাজ বেশিরভাগ পথ থেকে সরে যাওয়া — কম step, কম field, কম সিদ্ধান্ত। এটাই দুই lesson আগের Fogg-এর "ability" lever, একটা business-চাওয়া behavior-এর বদলে একটা চাওয়া behavior-এ specifically প্রয়োগ করা।</p>'),
      h(2, 'একটা নতুন Behavior-এর জন্য — ছোট শুরু করতে সাহায্য করুন', 'একটা-নতুন-behavior-এর-জন্য-ছোট-শুরু-করতে-সাহায্য-করুন'),
      p('<p>একটা নতুন habit টিকে থাকার সম্ভাবনা অনেক বেশি যদি এটা এতটা ছোট হয়ে শুরু হয় যে প্রায় কোনো willpower লাগে না — একটা habit-tracking app যা "আপনার পুরো দৈনিক nutrition plan করুন"-এর বদলে "এক গ্লাস পানি log করুন" দিয়ে খোলে এটা সরাসরি প্রয়োগ করছে। ছোট version routine হয়ে গেলে, এটার স্বাভাবিকভাবেই বাড়ার জায়গা থাকে।</p>'),
      h(2, 'Progress Visible আর Meaningful বানানো', 'progress-visible-আর-meaningful-বানানো'),
      p('<p>একটা progress bar, একটা streak counter, বা ভরে ওঠা একটা checklist দুটো কাজ করে: এটা user-কে দেখায় তারা আসল progress করছে (যা নিজে থেকেই motivation টিকিয়ে রাখে), আর এটা শেষ পর্যন্ত completion-কে হঠাৎ না, অর্জিত মনে করায়। একটা completion state-ও একটা in-progress state থেকে ভুল-করা-যায়-না রকম, দৃশ্যমানভাবে ভিন্ন হওয়া উচিত — অস্পষ্ট বা সূক্ষ্ম "done" state এটা সম্পূর্ণ নষ্ট করে।</p>'),
      table(['Design lever', 'এটা কী করে', 'উদাহরণ'], [
        ['একটা চাওয়া action-এ friction কমান', 'ability বাধা সরায়', 'multi-field form-এর বদলে one-tap logging'],
        ['ছোট শুরু করুন', 'শুরু করতে কম motivation লাগে', 'পুরো routine-এর বদলে একটা ২-মিনিটের starter habit'],
        ['Progress visible বানান', 'মাঝপথে motivation টিকিয়ে রাখে', 'একটা progress bar, একটা streak, একটা percentage-complete indicator'],
        ['Completion স্পষ্ট বানান', 'psychological reward দেয়', 'একটা distinct "done" state, একটা checkmark animation, একটা completion message'],
      ]),
      callout('tip', '<p>এই একই lever ভালো আর exploitative design দুটোর জন্যই সমানভাবে কাজ করে — একটা streak counter যা চুপচাপ একজন user-কে এক দিন মিস করার জন্য guilt-trip করে (তাদের সহজে আবার শুরু করতে দেওয়ার বদলে) দুই lesson আগের behavior support থেকে dark-pattern territory-তে পার হয়ে গেছে।</p>', 'সীমারেখাটা উদ্দেশ্য, technique না'),
    ],
  },
})

lessons.push({
  slug: 'engagement-and-retention-mechanics', sortOrder: n++,
  en: {
    title: 'Engagement and Retention Mechanics',
    metaTitle: 'Engagement and Retention Mechanics | Learn Computer Academy',
    metaDescription: 'The common UI patterns that bring users back — reminders, gamification, status reports, and social sharing — and when each one genuinely helps versus wears out its welcome.',
    blocks: [
      p('<p>Beyond a single well-designed moment, most products need a set of recurring mechanics that bring users back over time. This lesson is a practical catalog of the common ones, and where each earns its place.</p>'),
      h(2, 'The Common Mechanics'),
      table(['Mechanic', 'What it does', 'Genuinely helps when...'], [
        ['Reminders', 'Prompts the user at a relevant moment', 'Tied to something the user actually asked for or scheduled'],
        ['Status reports', 'Summarizes recent activity or progress', 'The information is genuinely useful, not just a re-engagement excuse'],
        ['Tutorials', 'Teaches a feature at the moment it becomes relevant', 'Shown contextually, not as an unskippable wall on first open'],
        ['Gamification (points, badges, streaks)', 'Adds a game-like reward layer', 'The underlying task is genuinely improved by tracking progress'],
        ['Goal trackers', 'Lets a user set and monitor a personal target', 'The goal is the user\'s own, not one assigned to hit a business metric'],
        ['Social sharing', 'Lets a user broadcast an achievement or activity', 'Optional, and framed around the user\'s own accomplishment'],
        ['Planners', 'Helps organize future action', 'Reduces real planning effort rather than adding another thing to manage'],
      ]),
      h(2, 'When Gamification Backfires'),
      p('<p>Points and badges layered onto a task that isn\'t actually improved by them read as hollow — gamification works when the game layer reflects real progress on something the user cares about, and reads as manipulative the moment it\'s obviously there just to drive numbers up.</p>'),
      h(2, 'Notification Fatigue Is Real'),
      p('<p>Every one of these mechanics competes for the same limited attention and goodwill. A product that reminds, reports, and prompts constantly trains users to ignore or mute it entirely — the same mechanics used sparingly, tied to genuinely relevant moments, stay effective far longer.</p>'),
      callout('note', '<p>A useful gut check for any of these mechanics: would a user, told plainly why this exists, feel it respects their time — or feel farmed for engagement? The honest answer to that question is usually obvious.</p>', 'The same test, one more time'),
    ],
  },
  bn: {
    title: 'Engagement আর Retention Mechanics',
    metaTitle: 'Engagement আর Retention Mechanics | Learn Computer Academy',
    metaDescription: 'User-দের ফিরিয়ে আনা common UI pattern — reminder, gamification, status report, আর social sharing — আর কখন প্রতিটা সত্যিকারভাবে সাহায্য করে বনাম কখন এর স্বাগত ফুরিয়ে যায়।',
    blocks: [
      p('<p>একটা একক ভালো-design করা মুহূর্তের বাইরে, বেশিরভাগ product-এর সময়ের সাথে user ফিরিয়ে আনা recurring mechanics-এর একটা set দরকার। এই lesson common mechanics-গুলোর একটা practical catalog, আর প্রতিটা কোথায় এর জায়গা অর্জন করে।</p>'),
      h(2, 'Common Mechanics'),
      table(['Mechanic', 'এটা কী করে', 'সত্যিকারভাবে সাহায্য করে যখন...'], [
        ['Reminder', 'একটা প্রাসঙ্গিক মুহূর্তে user-কে prompt করে', 'User আসলে যা চেয়েছিল বা schedule করেছিল তার সাথে যুক্ত'],
        ['Status report', 'সাম্প্রতিক activity বা progress summarize করে', 'তথ্যটা সত্যিকারভাবে useful, শুধু re-engagement-এর অজুহাত না'],
        ['Tutorial', 'একটা feature প্রাসঙ্গিক হওয়ার মুহূর্তে শেখায়', 'contextually দেখানো হয়, প্রথম খোলার সময় একটা skip-করা-না-যাওয়া দেওয়াল হিসেবে না'],
        ['Gamification (point, badge, streak)', 'একটা game-এর মতো reward layer যোগ করে', 'progress track করে আসল কাজটা সত্যিকারভাবে উন্নত হয়'],
        ['Goal tracker', 'একজন user-কে একটা personal target সেট আর monitor করতে দেয়', 'লক্ষ্যটা user-এর নিজের, একটা business metric হিট করতে দেওয়া কারো না'],
        ['Social sharing', 'একজন user-কে একটা achievement বা activity broadcast করতে দেয়', 'Optional, আর user-এর নিজের অর্জনের চারপাশে frame করা'],
        ['Planner', 'ভবিষ্যৎ action organize করতে সাহায্য করে', 'পরিচালনা করার আরেকটা জিনিস যোগ করার বদলে আসল planning effort কমায়'],
      ]),
      h(2, 'কখন Gamification ব্যর্থ হয়', 'কখন-gamification-ব্যর্থ-হয়'),
      p('<p>একটা কাজের উপর যোগ করা point আর badge যা আসলে এগুলো দিয়ে উন্নত হয় না ফাঁপা মনে হয় — gamification কাজ করে যখন game layer user যা পরোয়া করে তাতে আসল progress প্রতিফলিত করে, আর manipulative মনে হয় যেই মুহূর্তে এটা স্পষ্টভাবে শুধু সংখ্যা বাড়ানোর জন্য।</p>'),
      h(2, 'Notification Fatigue আসল', 'notification-fatigue-আসল'),
      p('<p>এই mechanics-এর প্রতিটাই একই সীমিত মনোযোগ আর goodwill-এর জন্য প্রতিযোগিতা করে। একটা product যা ক্রমাগত reminder পাঠায়, report করে, আর prompt করে user-দের একে সম্পূর্ণ ignore বা mute করতে train করে — একই mechanics কম কম ব্যবহার করা, সত্যিকারভাবে প্রাসঙ্গিক মুহূর্তের সাথে যুক্ত, অনেক বেশি সময় effective থাকে।</p>'),
      callout('note', '<p>এই mechanics-এর যেকোনোটার জন্য একটা useful gut check: স্পষ্টভাবে বলা হলে এটা কেন আছে, একজন user কি মনে করবে এটা তাদের সময়কে সম্মান করে — নাকি engagement-এর জন্য farmed হচ্ছে বলে মনে করবে? সেই প্রশ্নের সৎ উত্তর সাধারণত স্পষ্ট।</p>', 'একই test, আরেকবার'),
    ],
  },
})

lessons.push({
  slug: 'business-model-basics-for-designers', sortOrder: n++,
  en: {
    title: 'Business Model Basics for Designers',
    metaTitle: 'Business Model Basics for Designers | Learn Computer Academy',
    metaDescription: "Why a designer benefits from understanding how a product actually makes money, and a practical walkthrough of the Business Model Canvas and Lean Canvas.",
    blocks: [
      p('<p>Design decisions don\'t happen in a vacuum — a feature that\'s great for the user but breaks how the product actually makes money won\'t survive contact with a real business, no matter how well-designed it is. Understanding the business model isn\'t a detour from design work; it\'s context that makes design decisions defensible.</p>'),
      h(2, 'The Business Model Canvas'),
      p('<p>A one-page framework (Alexander Osterwalder) breaking a business into 9 building blocks: <b>Customer Segments</b> (who it\'s for), <b>Value Proposition</b> (what problem it solves), <b>Channels</b> (how it reaches customers), <b>Customer Relationships</b> (how it interacts with them), <b>Revenue Streams</b> (how it makes money), <b>Key Resources</b>, <b>Key Activities</b>, <b>Key Partnerships</b>, and <b>Cost Structure</b>. Filling this in for an existing product, even roughly, quickly surfaces which design decisions actually matter to the business and which are purely cosmetic preference.</p>'),
      h(2, 'The Lean Canvas — A Startup-Focused Variant'),
      p('<p>Ash Maurya\'s adaptation swaps a few blocks for ones more relevant to an early, unproven product: <b>Problem</b> (the top 1-3 problems worth solving), <b>Solution</b>, <b>Key Metrics</b>, an <b>Unfair Advantage</b> (something competitors can\'t easily copy), replacing Key Resources/Activities/Partnerships from the original canvas. It\'s built for a product that doesn\'t have paying customers or proven revenue yet.</p>'),
      table(['Question a designer should be able to answer', 'Canvas block it maps to'], [
        ['Who is this actually for?', 'Customer Segments'],
        ['What problem does this solve that a competitor doesn\'t?', 'Value Proposition / Unfair Advantage'],
        ['How does this product actually make money?', 'Revenue Streams'],
        ['What number does this feature need to move to matter?', 'Key Metrics'],
      ]),
      callout('tip', '<p>A designer who can answer these four questions about a product they\'re working on can defend a design decision in business terms, not just aesthetic ones — a genuinely useful skill in any real product conversation.</p>', 'Why this is worth 20 minutes'),
    ],
  },
  bn: {
    title: 'Designer-দের জন্য Business Model Basics',
    metaTitle: 'Designer-দের জন্য Business Model Basics | Learn Computer Academy',
    metaDescription: 'একজন designer কেন একটা product আসলে কীভাবে টাকা income করে তা বোঝা থেকে উপকৃত হয়, আর Business Model Canvas আর Lean Canvas-এর একটা practical walkthrough।',
    blocks: [
      p('<p>Design সিদ্ধান্ত শূন্যে ঘটে না — একটা feature যেটা user-এর জন্য দুর্দান্ত কিন্তু product আসলে কীভাবে টাকা income করে তা ভেঙে দেয় সেটা যতই ভালো design হোক না কেন একটা আসল business-এর সংস্পর্শে টিকবে না। Business model বোঝা design কাজ থেকে একটা বিরতি না; এটা এমন context যা design সিদ্ধান্তকে defensible বানায়।</p>'),
      h(2, 'Business Model Canvas'),
      p('<p>একটা এক-পাতার framework (Alexander Osterwalder) একটা business-কে ৯টা building block-এ ভাঙে: <b>Customer Segments</b> (এটা কার জন্য), <b>Value Proposition</b> (এটা কোন সমস্যা সমাধান করে), <b>Channels</b> (এটা কীভাবে customer-দের কাছে পৌঁছায়), <b>Customer Relationships</b> (এটা কীভাবে তাদের সাথে interact করে), <b>Revenue Streams</b> (এটা কীভাবে টাকা income করে), <b>Key Resources</b>, <b>Key Activities</b>, <b>Key Partnerships</b>, আর <b>Cost Structure</b>। একটা বিদ্যমান product-এর জন্য এটা পূরণ করা, মোটামুটিভাবেও, দ্রুত দেখায় কোন design সিদ্ধান্ত আসলে business-এর জন্য গুরুত্বপূর্ণ আর কোনটা শুধু cosmetic পছন্দ।</p>'),
      h(2, 'Lean Canvas — একটা Startup-Focused Variant', 'lean-canvas-একটা-startup-focused-variant'),
      p('<p>Ash Maurya-র adaptation কয়েকটা block একটা early, unproven product-এর জন্য বেশি প্রাসঙ্গিক block দিয়ে বদলায়: <b>Problem</b> (সমাধান করার যোগ্য top ১-৩টা সমস্যা), <b>Solution</b>, <b>Key Metrics</b>, একটা <b>Unfair Advantage</b> (competitor-রা সহজে copy করতে পারে না এমন কিছু), original canvas থেকে Key Resources/Activities/Partnerships বদলে। এটা এমন একটা product-এর জন্য বানানো যার এখনো paying customer বা প্রমাণিত revenue নেই।</p>'),
      table(['একজন designer-এর উত্তর দিতে পারা উচিত এমন প্রশ্ন', 'Canvas block যেটাতে এটা map হয়'], [
        ['এটা আসলে কার জন্য?', 'Customer Segments'],
        ['একটা competitor করে না এমন কোন সমস্যা এটা সমাধান করে?', 'Value Proposition / Unfair Advantage'],
        ['এই product আসলে কীভাবে টাকা income করে?', 'Revenue Streams'],
        ['গুরুত্বপূর্ণ হতে এই feature-এর কোন সংখ্যা বদলাতে হবে?', 'Key Metrics'],
      ]),
      callout('tip', '<p>যে designer একটা product নিয়ে যেটাতে তারা কাজ করছে এই চারটা প্রশ্নের উত্তর দিতে পারে সে একটা design সিদ্ধান্তকে business শর্তে defend করতে পারে, শুধু aesthetic শর্তে না — যেকোনো আসল product আলোচনায় একটা সত্যিকারভাবে useful দক্ষতা।</p>', 'কেন এটা ২০ মিনিটের যোগ্য'),
    ],
  },
})

lessons.push({
  slug: 'competitor-analysis-and-swot', sortOrder: n++,
  en: {
    title: 'Competitor Analysis and SWOT for Designers',
    metaTitle: 'Competitor Analysis and SWOT for Designers | Learn Computer Academy',
    metaDescription: 'A lightweight version of competitive analysis a designer can actually use — SWOT analysis, and a quick look at competitive pressure with the Five Forces Model.',
    blocks: [
      p('<p>A designer redesigning or improving a product benefits from understanding the competitive landscape it sits in — not at the depth of a business strategy consultant, but enough to know why a feature exists, what alternatives users are comparing against, and where the product\'s design can genuinely differentiate.</p>'),
      h(2, 'SWOT Analysis'),
      p('<p>A simple four-quadrant framework, useful for a specific product or feature, not just a whole company. <b>Strengths</b> and <b>Weaknesses</b> are internal — what the product is good or bad at right now. <b>Opportunities</b> and <b>Threats</b> are external — what\'s happening in the market that could help or hurt, regardless of what the product itself does.</p>'),
      table(['Quadrant', 'Internal or external?', 'Example question for a UX designer'], [
        ['Strengths', 'Internal', "What does this product's UX do better than every competitor's?"],
        ['Weaknesses', 'Internal', 'Where do users consistently get stuck or drop off?'],
        ['Opportunities', 'External', 'Is there a user need competitors are all currently ignoring?'],
        ['Threats', 'External', 'Is a competitor about to ship something that makes this flow feel dated?'],
      ]),
      h(2, "A Quick Look at the Five Forces Model"),
      p('<p>Michael Porter\'s framework for the competitive pressure surrounding a business — competitive rivalry, threat of new entrants, threat of substitutes, supplier power, and buyer power. A designer doesn\'t need the full depth of this model, but the underlying question is useful directly: how easily could a user switch to an alternative, and does the product\'s UX give them a real reason to stay?</p>'),
      h(2, 'A Practical Competitor Audit'),
      p('<p>The lightest useful version of this whole lesson: pick 2-3 real competitors, walk through their onboarding, their core flow, and their pricing page as an actual user would, and note what feels genuinely better or worse than the product being designed. This alone catches most of the value without any formal framework at all.</p>'),
      callout('note', '<p>The point of competitor analysis in design work is never to copy a competitor\'s UI — it\'s to understand what users are comparing against, so design decisions account for a real alternative rather than an imagined one.</p>', 'What this is actually for'),
    ],
  },
  bn: {
    title: 'Designer-দের জন্য Competitor Analysis আর SWOT',
    metaTitle: 'Designer-দের জন্য Competitor Analysis আর SWOT | Learn Computer Academy',
    metaDescription: 'একজন designer আসলে ব্যবহার করতে পারে এমন competitive analysis-এর একটা lightweight version — SWOT analysis, আর Five Forces Model দিয়ে competitive pressure-এর একটা দ্রুত দেখা।',
    blocks: [
      p('<p>একটা product redesign বা improve করা একজন designer এটা যে competitive landscape-এ বসে আছে তা বোঝা থেকে উপকৃত হয় — একজন business strategy consultant-এর গভীরতায় না, কিন্তু যথেষ্ট যাতে জানা যায় একটা feature কেন আছে, user-রা কোন বিকল্পের সাথে তুলনা করছে, আর product-এর design কোথায় সত্যিকারভাবে আলাদা হতে পারে।</p>'),
      h(2, 'SWOT Analysis'),
      p('<p>একটা সহজ চার-quadrant framework, শুধু একটা পুরো company না, একটা নির্দিষ্ট product বা feature-এর জন্যও useful। <b>Strengths</b> আর <b>Weaknesses</b> internal — product এখন কী ভালো বা খারাপ করে। <b>Opportunities</b> আর <b>Threats</b> external — market-এ কী ঘটছে যা product নিজে যা করে তা নির্বিশেষে সাহায্য বা ক্ষতি করতে পারে।</p>'),
      table(['Quadrant', 'Internal না external?', 'একজন UX designer-এর জন্য উদাহরণ প্রশ্ন'], [
        ['Strengths', 'Internal', 'এই product-এর UX প্রতিটা competitor-এর চেয়ে কী ভালো করে?'],
        ['Weaknesses', 'Internal', 'User-রা ধারাবাহিকভাবে কোথায় আটকে যায় বা drop off করে?'],
        ['Opportunities', 'External', 'এমন কোনো user need আছে যা এখন competitor-রা সবাই ignore করছে?'],
        ['Threats', 'External', 'একটা competitor কি এমন কিছু ship করতে যাচ্ছে যা এই flow-কে পুরনো মনে করায়?'],
      ]),
      h(2, "Five Forces Model-এর একটা দ্রুত দেখা", 'five-forces-model-এর-একটা-দ্রুত-দেখা'),
      p('<p>একটা business-কে ঘিরে থাকা competitive pressure-এর জন্য Michael Porter-এর framework — competitive rivalry, নতুন entrant-এর হুমকি, substitute-এর হুমকি, supplier power, আর buyer power। একজন designer-এর এই model-এর পুরো গভীরতা দরকার নেই, কিন্তু underlying প্রশ্নটা সরাসরি useful: একজন user কতটা সহজে একটা বিকল্পে switch করতে পারে, আর product-এর UX কি তাদের থাকার একটা আসল কারণ দেয়?</p>'),
      h(2, 'একটা Practical Competitor Audit'),
      p('<p>এই পুরো lesson-এর সবচেয়ে হালকা useful version: ২-৩টা আসল competitor বেছে নিন, তাদের onboarding, তাদের core flow, আর তাদের pricing page একজন আসল user যেমন করবে তেমনভাবে দেখুন, আর design করা product-এর চেয়ে আসলেই কী ভালো বা খারাপ লাগে তা note করুন। এটা একাই কোনো formal framework ছাড়াই বেশিরভাগ value ধরে ফেলে।</p>'),
      callout('note', '<p>Design কাজে competitor analysis-এর উদ্দেশ্য কখনো একটা competitor-এর UI copy করা না — এটা user-রা কী তুলনা করছে তা বোঝা, যাতে design সিদ্ধান্ত একটা কল্পিত বিকল্পের বদলে একটা আসল বিকল্প হিসাব করে।</p>', 'এটা আসলে কীসের জন্য'),
    ],
  },
})

lessons.push({
  slug: 'measuring-design-impact-ab-testing', sortOrder: n++,
  en: {
    title: 'Measuring Design Impact — A/B Testing Basics',
    metaTitle: 'Measuring Design Impact — A/B Testing Basics | Learn Computer Academy',
    metaDescription: "How A/B testing actually validates a design change, the difference between A/B and multivariate testing, and the common mistakes that make test results misleading.",
    blocks: [
      p('<p>Every technique in this track — nudges, hooks, engagement mechanics — is a hypothesis about what will improve a real metric, not a guarantee. Testing is how a design decision moves from "we believe this helps" to "we measured that it does."</p>'),
      h(2, 'A/B Testing — The Basic Idea'),
      p('<p>Split real users into two groups at random: one sees the current design (the <b>control</b>), the other sees the new design (the <b>variant</b>). Measure the metric that matters (signups, completion rate, time on task) for both groups, and compare. Because the split is random, any real difference between the groups is attributable to the design change, not to who happened to see it.</p>'),
      h(2, 'A/B vs. Multivariate Testing'),
      table(['Type', 'What changes', 'When to use it'], [
        ['A/B (or A/B/n) testing', 'One element, isolated — a button color, a headline, a flow step', 'Testing one specific change with a clear before/after'],
        ['Multivariate testing', 'Multiple elements at once, testing combinations', 'Understanding how several changes interact — needs far more traffic to reach significance'],
      ]),
      h(2, 'Incremental Testing'),
      p('<p>Rather than one big redesign tested all at once, incremental testing ships smaller, individually-testable changes in sequence — each one\'s impact is measurable on its own, and a change that hurts the metric can be reverted without losing everything else that was working.</p>'),
      h(2, 'Common Mistakes That Mislead'),
      table(['Mistake', 'Why it\'s a problem'], [
        ['Calling a result significant too early', 'Small sample sizes produce noisy results that often reverse with more data'],
        ['Testing during an unusual period', 'A holiday, a marketing campaign, or an outage skews behavior for both groups unevenly'],
        ['Optimizing for the wrong metric', 'A change that increases clicks but decreases actual task completion is not really a win'],
        ['Running too many variants at once without enough traffic', 'Splits the sample too thin to reach a confident conclusion for any of them'],
      ]),
      callout('tip', '<p>This closes the loop with the Double Diamond process from earlier in this course — Define and Develop propose a solution, Deliver ships it, and testing is how the loop confirms it actually worked before calling it done.</p>', 'Ties back to the design process'),
    ],
  },
  bn: {
    title: 'Design-এর প্রভাব মাপা — A/B Testing-এর বেসিক',
    metaTitle: 'Design-এর প্রভাব মাপা — A/B Testing-এর বেসিক | Learn Computer Academy',
    metaDescription: 'A/B testing আসলে কীভাবে একটা design পরিবর্তন validate করে, A/B আর multivariate testing-এর মধ্যে পার্থক্য, আর common ভুল যা test result-কে বিভ্রান্তিকর বানায়।',
    blocks: [
      p('<p>এই track-এর প্রতিটা technique — nudge, hook, engagement mechanics — একটা আসল metric উন্নত করবে তা নিয়ে একটা hypothesis, কোনো গ্যারান্টি না। Testing হলো কীভাবে একটা design সিদ্ধান্ত "আমরা বিশ্বাস করি এটা সাহায্য করে" থেকে "আমরা মেপেছি এটা করে"-তে যায়।</p>'),
      h(2, 'A/B Testing — মূল ধারণা'),
      p('<p>আসল user-দের random-এ দুটো group-এ ভাগ করুন: একটা বর্তমান design দেখে (<b>control</b>), অন্যটা নতুন design দেখে (<b>variant</b>)। যে metric গুরুত্বপূর্ণ (signup, completion rate, task-এ সময়) তা দুই group-এর জন্য মাপুন, আর তুলনা করুন। Split random হওয়ায়, group-দুটোর মধ্যে যেকোনো আসল পার্থক্য design পরিবর্তনের জন্য দায়ী, কে দেখেছে তার জন্য না।</p>'),
      h(2, 'A/B বনাম Multivariate Testing'),
      table(['ধরন', 'কী বদলায়', 'কখন ব্যবহার করবেন'], [
        ['A/B (বা A/B/n) testing', 'একটা element, আলাদা — একটা button রং, একটা headline, একটা flow step', 'স্পষ্ট before/after সহ একটা নির্দিষ্ট পরিবর্তন test করা'],
        ['Multivariate testing', 'একসাথে একাধিক element, combination test করা', 'কয়েকটা পরিবর্তন কীভাবে interact করে তা বোঝা — significance-এ পৌঁছাতে অনেক বেশি traffic দরকার'],
      ]),
      h(2, 'Incremental Testing'),
      p('<p>একবারে test করা একটা বড় redesign-এর বদলে, incremental testing ক্রমান্বয়ে ছোট, আলাদাভাবে-testable পরিবর্তন ship করে — প্রতিটার প্রভাব নিজে থেকেই measurable, আর metric-এর ক্ষতি করা একটা পরিবর্তন কাজ করছিল এমন বাকি সবকিছু না হারিয়ে revert করা যায়।</p>'),
      h(2, 'বিভ্রান্তিকর করা Common ভুল', 'বিভ্রান্তিকর-করা-common-ভুল'),
      table(['ভুল', 'কেন এটা একটা সমস্যা'], [
        ['খুব তাড়াতাড়ি একটা result significant বলা', 'ছোট sample size noisy result দেয় যা প্রায়ই বেশি data-তে উল্টে যায়'],
        ['একটা অস্বাভাবিক সময়ে test করা', 'একটা holiday, একটা marketing campaign, বা একটা outage দুই group-এর behavior-কেই অসমানভাবে skew করে'],
        ['ভুল metric-এর জন্য optimize করা', 'একটা পরিবর্তন যা click বাড়ায় কিন্তু আসল task completion কমায় আসলে জেতা না'],
        ['যথেষ্ট traffic ছাড়া একসাথে অনেক variant চালানো', 'sample-কে এতটা পাতলা করে যে কোনোটার জন্যই একটা confident সিদ্ধান্তে পৌঁছানো যায় না'],
      ]),
      callout('tip', '<p>এটা এই কোর্সের আগের Double Diamond process-এর সাথে loop বন্ধ করে — Define আর Develop একটা সমাধান প্রস্তাব করে, Deliver এটা ship করে, আর testing হলো loop কীভাবে নিশ্চিত করে এটা done বলার আগে আসলেই কাজ করেছে।</p>', 'Design process-এর সাথে ফিরে যায়'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'ui-ux').single()
  if (catErr || !category) {
    console.error('Category "ui-ux" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] ui-ux/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] ui-ux/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `ui-ux/${lesson.slug}`
    const row = {
      category_id: category.id,
      slug: lesson.slug,
      path,
      old_path: null,
      title: lesson.en.title,
      meta_title: lesson.en.metaTitle,
      meta_description: lesson.en.metaDescription,
      blocks: lesson.en.blocks,
      toc: toc(lesson.en.blocks),
      status: 'published',
      sort_order: lesson.sortOrder,
      published_at: new Date().toISOString(),
    }

    const { data: existing } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
    let docId = existing?.id
    if (docId) {
      const { error: docErr } = await supabase.from('docs').update(row).eq('id', docId)
      if (docErr) { console.error(`Failed ${lesson.slug} (en update):`, docErr.message); continue }
    } else {
      const { data: inserted, error: docErr } = await supabase.from('docs').insert(row).select('id').single()
      if (docErr) { console.error(`Failed ${lesson.slug} (en insert):`, docErr.message); continue }
      docId = inserted.id
    }
    console.log(`  ✓ en  ${path}`)

    const trRow = {
      doc_id: docId,
      locale: 'bn',
      title: lesson.bn.title,
      meta_title: lesson.bn.metaTitle,
      meta_description: lesson.bn.metaDescription,
      blocks: lesson.bn.blocks,
      toc: toc(lesson.bn.blocks),
    }
    const { data: existingTr } = await supabase.from('doc_translations').select('doc_id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
    const { error: trErr } = existingTr
      ? await supabase.from('doc_translations').update(trRow).eq('doc_id', docId).eq('locale', 'bn')
      : await supabase.from('doc_translations').insert(trRow)
    if (trErr) { console.error(`Failed ${lesson.slug} (bn):`, trErr.message); continue }
    console.log(`  ✓ bn  ${path}`)
  }

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
