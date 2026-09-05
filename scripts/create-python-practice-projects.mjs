#!/usr/bin/env node
// One page — python/practice-projects — appended to the end of the existing
// "python" category (sort_order 29, after "where-to-go-next" at 28). Per the
// site owner's instruction (2026-08-17): no new category, single URL, levels
// and projects as native <details> accordions (zero JS — no Accordion/Tabs
// component exists yet and this doesn't need one), rewritten in the site's
// own voice rather than the source tutorials' conversational walkthrough
// style, EN + BN both.
//
// Source: 24 teacher-authored project briefs + full walkthroughs supplied by
// the site owner (four levels: Beginner, Intermediate, GUI/Tkinter, OOP).
// Rewritten here as brief + example + concepts + collapsible solution — the
// original walkthroughs are still teaching material, not this page's job to
// reproduce line-by-line (CONTENT-PIPELINE.md — original, written fresh).
//
// No Try-It block: Python isn't browser-runnable on this site (D-04 scoped
// tryit to HTML/CSS/JS/React only — Pyodide would blow the JS budget).
// Students read the brief here and run the code in their own editor.
//
// Shiki highlighting, same as every other code block on the site — but run
// here at script-write time instead of page-render time. The `code` block
// type (lib/shiki.ts, used by components/blocks/block-renderer.tsx) can't
// nest inside a richtext block's HTML, so there's no way to get a real
// `code` block inside these accordions. Shiki itself is just the `shiki`
// npm package though (same version, same themes, same langs as
// lib/shiki.ts) — calling it directly here and baking the highlighted HTML
// into the stored richtext string gets the identical visual result, because
// Shiki's dual-theme output is inline-styled (CSS custom properties per
// span), not dependent on any page-level class Tailwind would need to have
// scanned this script to generate.
//
// Usage: node scripts/create-python-practice-projects.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'
import { createHighlighter } from 'shiki'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders (same shapes as scripts/create-python-content.mjs) ─────

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// Exact match of lib/shiki.ts's themes/langs so the output is visually
// identical to every other code block on the site.
let highlighterPromise = null
function getHighlighter() {
  highlighterPromise ??= createHighlighter({ themes: ['ayu-light', 'dracula'], langs: ['python', 'text'] })
  return highlighterPromise
}
// Splices layout CSS (padding, overflow, font-size — the equivalent of
// components/blocks/block-renderer.tsx's `[&_pre]:p-4` etc.) onto Shiki's
// own style attribute, which already carries the real theme colors. Done
// as a string edit rather than a Tailwind class because this HTML is
// stored in the DB and rendered via dangerouslySetInnerHTML — no class
// added here would ever be seen by Tailwind's build-time scanner.
function styleCode(html) {
  return html.replace(/<pre([^>]*)style="([^"]*)"/, (_, attrs, style) =>
    `<pre${attrs}style="${style};overflow-x:auto;border-radius:0.5rem;padding:0.75rem;font-size:0.75rem;line-height:1.6"`
  )
}
async function highlight(code, lang) {
  const h = await getHighlighter()
  return styleCode(h.codeToHtml(code, { lang, themes: { light: 'ayu-light', dark: 'dracula' } }))
}

// One project → one <details> accordion, with a nested <details> for the
// solution so it's hidden until the student wants it (native HTML, no JS).
async function projectAccordion(n, proj, locale) {
  const task = locale === 'en' ? proj.taskEn : proj.taskBn
  const explanation = locale === 'en' ? proj.explanationEn : proj.explanationBn
  const note = locale === 'en' ? proj.noteEn : proj.noteBn
  const conceptsLabel = locale === 'en' ? 'Concepts' : 'কনসেপ্ট'
  const solutionLabel = locale === 'en' ? 'Show solution' : 'সমাধান দেখুন'
  const howItWasBuiltLabel = locale === 'en' ? 'How it was built' : 'যেভাবে বানানো হলো'
  const codeLabel = locale === 'en' ? 'Complete code' : 'সম্পূর্ণ কোড'
  const [exampleHtml, solutionHtml] = await Promise.all([
    highlight(proj.example, 'text'),
    highlight(proj.solution.trim(), 'python'),
  ])
  return `
<details class="group not-prose mb-3 rounded-lg border bg-card p-4">
  <summary class="flex cursor-pointer list-none items-center justify-between font-medium marker:content-none">
    <span>${locale === 'en' ? 'Project' : 'প্রজেক্ট'} ${n} — ${proj.title}</span>
    <span class="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
  </summary>
  <div class="mt-4 space-y-3 text-sm">
    <p>${task}</p>
    ${exampleHtml}
    <p class="font-medium">${conceptsLabel}</p>
    <ul class="list-disc pl-5 text-muted-foreground">${proj.concepts.map(c => `<li>${c}</li>`).join('')}</ul>
    <details class="rounded-md border bg-muted/40 p-3">
      <summary class="cursor-pointer text-sm font-medium">${solutionLabel}</summary>
      <div class="mt-3 space-y-3">
        <p class="font-medium">${howItWasBuiltLabel}</p>
        <div class="space-y-2 text-muted-foreground">${explanation}</div>
        <p class="font-medium">${codeLabel}</p>
        ${solutionHtml}
        <p class="text-muted-foreground">${note}</p>
      </div>
    </details>
  </div>
</details>`
}

async function levelHtml(projects, locale) {
  const accordions = await Promise.all(projects.map((proj, i) => projectAccordion(i + 1, proj, locale)))
  return `<div class="not-prose">${accordions.join('')}</div>`
}

// ── The 24 projects, 4 levels ───────────────────────────────────────────

const BEGINNER = [
  {
    title: 'Guess the Number',
    taskEn: 'The program picks a secret number between 1 and 100. The player keeps guessing until they get it right, and the program says whether each guess is too high or too low.',
    taskBn: 'প্রোগ্রামটি ১ থেকে ১০০-এর মধ্যে একটি গোপন নম্বর বেছে নেয়। প্লেয়ার সঠিক উত্তর না পাওয়া পর্যন্ত গেস করতে থাকে, আর প্রোগ্রাম প্রতিটি গেস অনেক বেশি নাকি অনেক কম বলে দেয়।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Pick a secret number the player can't see, with <code>random.randint(1, 100)</code> — it returns a random whole number between 1 and 100, inclusive.</li><li>Wrap everything in <code>while True</code> so the program keeps asking until the player wins — it never stops on its own, only <code>break</code> inside the loop does that.</li><li>Each guess is compared with <code>if</code> / <code>elif</code> / <code>else</code>: too low, too high, or correct.</li><li><code>attempts += 1</code> runs on every pass through the loop, so it's already counting guesses by the time <code>break</code> fires.</li></ol><p><b>Trace:</b> <code>number = 63</code>. Guess 30 → too low. Guess 80 → too high. Guess 63 → correct, <code>attempts</code> is 3, loop stops.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্লেয়ার দেখতে পারে না এমন একটি গোপন নম্বর বেছে নিন <code>random.randint(1, 100)</code> দিয়ে — এটা ১ থেকে ১০০-এর মধ্যে (দুই প্রান্ত সহ) একটি র‍্যান্ডম পূর্ণসংখ্যা রিটার্ন করে।</li><li>সবকিছু <code>while True</code>-এর ভেতরে রাখুন, যাতে প্লেয়ার না জেতা পর্যন্ত প্রোগ্রাম জিজ্ঞেস করতেই থাকে — এটা নিজে থেকে থামে না, শুধু লুপের ভেতরের <code>break</code>-ই থামায়।</li><li>প্রতিটা গেস <code>if</code> / <code>elif</code> / <code>else</code> দিয়ে তুলনা করা হয়: অনেক কম, অনেক বেশি, নাকি সঠিক।</li><li><code>attempts += 1</code> লুপের প্রতিটা পাকে চলে, তাই <code>break</code> চলার সময় ততক্ষণে এটা গেস গোনা হয়ে গেছে।</li></ol><p><b>ট্রেস:</b> <code>number = 63</code>। গেস 30 → too low। গেস 80 → too high। গেস 63 → correct, <code>attempts</code> হয় 3, লুপ থেমে যায়।</p>`,
    example: 'Guess the number: 50\nToo high!\nGuess the number: 25\nToo low!\nGuess the number: 37\nCorrect! You got it in 3 tries.',
    concepts: ['import random', 'while loop', 'if / elif / else', 'break', 'counter'],
    solution: `
import random

number = random.randint(1, 100)
attempts = 0

while True:
    guess = int(input("Guess the number: "))
    attempts += 1

    if guess < number:
        print("Too low!")
    elif guess > number:
        print("Too high!")
    else:
        print(f"Correct! You got it in {attempts} tries.")
        break`,
    noteEn: "The loop keeps asking until `break` fires — everything else is just deciding when that should happen.",
    noteBn: 'লুপটি `break` না চলা পর্যন্ত জিজ্ঞেস করতেই থাকে — বাকি সবকিছু শুধু ঠিক করে কখন সেটা হওয়া উচিত।',
  },
  {
    title: 'Simple Calculator',
    taskEn: 'Ask the user for two numbers and an operator (+, -, *, /), then print the result. Handle division by zero without crashing.',
    taskBn: 'ব্যবহারকারীর কাছ থেকে দুটি সংখ্যা আর একটি operator (+, -, *, /) নিন, তারপর ফলাফল প্রিন্ট করুন। শূন্য দিয়ে ভাগ করলে যেন প্রোগ্রাম ক্র্যাশ না করে সেটা সামলান।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Read both numbers with <code>float(input(...))</code> so decimals work, not just whole numbers — <code>int()</code> would reject "17.5".</li><li>The operator is compared with <code>==</code>, never converted to a number — it stays one of the characters <code>"+"</code>, <code>"-"</code>, <code>"*"</code>, <code>"/"</code>.</li><li><code>if</code> / <code>elif</code> / <code>else</code> checks the operator once and runs exactly one branch — Python stops checking further <code>elif</code>s the moment one matches.</li><li>Division gets its own inner <code>if</code> to guard against <code>num2 == 0</code> before dividing — otherwise it would crash with a <code>ZeroDivisionError</code>.</li></ol><p><b>Trace:</b> <code>num1 = 20</code>, <code>operator = "*"</code>, <code>num2 = 5</code> → skips <code>+</code>, skips <code>-</code>, matches <code>*</code>, prints 100.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>দুটো সংখ্যাই <code>float(input(...))</code> দিয়ে নিন যাতে দশমিক সংখ্যাও কাজ করে, শুধু পূর্ণসংখ্যা না — <code>int()</code> "17.5" নিতে রাজি হবে না।</li><li>operator-কে <code>==</code> দিয়ে তুলনা করা হয়, কখনো সংখ্যায় কনভার্ট করা হয় না — এটা <code>"+"</code>, <code>"-"</code>, <code>"*"</code>, <code>"/"</code> এই ক্যারেক্টারগুলোর একটাই থেকে যায়।</li><li><code>if</code> / <code>elif</code> / <code>else</code> operator একবার চেক করে ঠিক একটা branch চালায় — একটা মিলে গেলে Python বাকি <code>elif</code> আর চেক করে না।</li><li>ভাগের জন্য আলাদা একটা ভেতরের <code>if</code> আছে যা ভাগ করার আগে <code>num2 == 0</code> কিনা চেক করে — নাহলে <code>ZeroDivisionError</code> দিয়ে ক্র্যাশ করত।</li></ol><p><b>ট্রেস:</b> <code>num1 = 20</code>, <code>operator = "*"</code>, <code>num2 = 5</code> → <code>+</code> বাদ, <code>-</code> বাদ, <code>*</code>-এ মিলে যায়, প্রিন্ট হয় 100।</p>`,
    example: 'Enter first number: 25\nEnter operator (+, -, *, /): -\nEnter second number: 8\nResult: 17.0',
    concepts: ['input()', 'float()', 'if / elif / else', 'comparison operators'],
    solution: `
num1 = float(input("Enter first number: "))
operator = input("Enter operator (+, -, *, /): ")
num2 = float(input("Enter second number: "))

if operator == "+":
    print("Result:", num1 + num2)
elif operator == "-":
    print("Result:", num1 - num2)
elif operator == "*":
    print("Result:", num1 * num2)
elif operator == "/":
    if num2 != 0:
        print("Result:", num1 / num2)
    else:
        print("Cannot divide by zero!")
else:
    print("Invalid operator!")`,
    noteEn: 'Every branch does exactly one job — that one-job-per-branch habit scales to much bigger programs later.',
    noteBn: 'প্রতিটি branch ঠিক একটা কাজ করে — এক-branch-এক-কাজের এই অভ্যাসটা পরে অনেক বড় প্রোগ্রামেও কাজে লাগে।',
  },
  {
    title: 'To-Do List',
    taskEn: 'A menu-driven console app to add, view, and remove tasks from a list while the program is running.',
    taskBn: 'প্রোগ্রাম চলাকালীন list-এ task যোগ করা, দেখা, আর মুছে ফেলার জন্য একটি মেনু-চালিত কনসোল অ্যাপ।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>tasks</code> starts as an empty list — <code>.append()</code> adds to the end, <code>.pop(index)</code> removes by position.</li><li>The menu lives inside <code>while True</code> so it keeps redrawing until the user picks Exit and <code>break</code> fires.</li><li><code>enumerate(tasks, start=1)</code> hands back a position and the item together, so the numbers shown to the user don't need a separate counter variable.</li><li>Removing uses <code>n - 1</code> because the user sees 1-based numbers but Python lists are 0-based — task "2" on screen is index 1 in the list.</li></ol><p><b>Trace:</b> adding "Study Python" then "Exercise" leaves <code>tasks = ["Study Python", "Exercise"]</code>; removing task 1 leaves <code>["Exercise"]</code>.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>tasks</code> শুরু হয় একটা খালি list হিসেবে — <code>.append()</code> শেষে যোগ করে, <code>.pop(index)</code> পজিশন অনুযায়ী বাদ দেয়।</li><li>মেনুটা <code>while True</code>-এর ভেতরে থাকে, তাই ব্যবহারকারী Exit বেছে <code>break</code> না চালানো পর্যন্ত এটা বারবার দেখাতে থাকে।</li><li><code>enumerate(tasks, start=1)</code> পজিশন আর আইটেম দুটোই একসাথে দেয়, তাই ব্যবহারকারীকে দেখানো নম্বরের জন্য আলাদা কাউন্টার লাগে না।</li><li>মুছার সময় <code>n - 1</code> ব্যবহার হয় কারণ ব্যবহারকারী 1 থেকে গোনা নম্বর দেখে, কিন্তু Python-এর list 0 থেকে শুরু হয় — স্ক্রিনে "2" নম্বর task আসলে list-এ index 1।</li></ol><p><b>ট্রেস:</b> "Study Python" তারপর "Exercise" যোগ করলে <code>tasks = ["Study Python", "Exercise"]</code>; task 1 মুছলে থাকে <code>["Exercise"]</code>।</p>`,
    example: "1. Add Task\n2. View Tasks\n3. Remove Task\n4. Exit\nEnter your choice: 2\n\nYour Tasks:\n1. Study Python\n2. Go for a walk",
    concepts: ['list', '.append()', '.pop()', 'while True', 'menu loop'],
    solution: `
tasks = []

while True:
    print("\\n1. Add Task\\n2. View Tasks\\n3. Remove Task\\n4. Exit")
    choice = input("Enter your choice: ")

    if choice == "1":
        tasks.append(input("Enter task: "))
        print("Task added!")
    elif choice == "2":
        if not tasks:
            print("No tasks.")
        else:
            for i, task in enumerate(tasks, start=1):
                print(i, ".", task)
    elif choice == "3":
        n = int(input("Enter task number to remove: "))
        if 1 <= n <= len(tasks):
            tasks.pop(n - 1)
            print("Task removed!")
        else:
            print("Invalid task number.")
    elif choice == "4":
        print("Goodbye!")
        break
    else:
        print("Invalid choice!")`,
    noteEn: "`enumerate(tasks, start=1)` gives both the position and the item, so the numbers shown to the user don't need a separate counter.",
    noteBn: '`enumerate(tasks, start=1)` পজিশন আর আইটেম দুটোই একসাথে দেয়, তাই ব্যবহারকারীকে দেখানো নম্বরের জন্য আলাদা কাউন্টার লাগে না।',
  },
  {
    title: 'Student Grade Calculator',
    taskEn: 'Ask for marks in a few subjects, then calculate and print the total, average, and letter grade.',
    taskBn: 'কয়েকটি বিষয়ের নম্বর জিজ্ঞেস করুন, তারপর total, average, আর letter grade হিসেব করে প্রিন্ট করুন।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Collect a fixed number of marks with a <code>for</code> loop and <code>.append()</code>, building the list one entry at a time.</li><li><code>sum(marks)</code> adds every item in the list in one call — no separate accumulator loop needed.</li><li>Dividing by <code>len(marks)</code> turns the total into an average that automatically adapts to however many marks were entered.</li><li>The <code>elif</code> chain is written highest-grade-first, because Python stops at the first true condition — checking <code>>= 60</code> before <code>>= 90</code> would give every passing student a D.</li></ol><p><b>Trace:</b> <code>marks = [85, 72, 90]</code> → total 247, average 82.33 → checks 90 (no), 80 (yes) → grade B.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>for</code> লুপ আর <code>.append()</code> দিয়ে নির্দিষ্ট সংখ্যক নম্বর সংগ্রহ করুন, একটা একটা করে list বানিয়ে।</li><li><code>sum(marks)</code> এক কলেই list-এর সব আইটেম যোগ করে দেয় — আলাদা accumulator লুপ লাগে না।</li><li><code>len(marks)</code> দিয়ে ভাগ করলে total থেকে average হয়ে যায়, যা যতগুলো নম্বর দেওয়া হয়েছে তার সাথে নিজে থেকেই মানিয়ে নেয়।</li><li><code>elif</code> চেইনটা সবচেয়ে বড় গ্রেড থেকে শুরু করে লেখা, কারণ Python প্রথম true condition-এ থেমে যায় — <code>>= 90</code>-এর আগে <code>>= 60</code> চেক করলে পাশ করা প্রতিটা ছাত্রই D পেত।</li></ol><p><b>ট্রেস:</b> <code>marks = [85, 72, 90]</code> → total 247, average 82.33 → 90 চেক (না), 80 চেক (হ্যাঁ) → গ্রেড B।</p>`,
    example: 'Enter marks: 85\nEnter marks: 72\nEnter marks: 90\n\nTotal: 247\nAverage: 82.33\nGrade: B',
    concepts: ['list', 'for loop', 'sum() / accumulator', 'if / elif chain'],
    solution: `
marks = []

for i in range(3):
    marks.append(float(input("Enter marks: ")))

total = sum(marks)
average = total / len(marks)

if average >= 90:
    grade = "A"
elif average >= 80:
    grade = "B"
elif average >= 70:
    grade = "C"
elif average >= 60:
    grade = "D"
else:
    grade = "F"

print("\\nTotal:", total)
print("Average:", round(average, 2))
print("Grade:", grade)`,
    noteEn: "The `elif` chain is checked top to bottom and stops at the first true condition — that's why it's ordered from the highest grade down.",
    noteBn: '`elif` চেইন উপর থেকে নিচে চেক হয় আর প্রথম true condition-এ থেমে যায় — তাই এটা সবচেয়ে বড় গ্রেড থেকে শুরু করে সাজানো।',
  },
  {
    title: 'Shopping Cart',
    taskEn: "Let the user add items and prices one at a time until they type 'done', then show the cart and the total.",
    taskBn: "ব্যবহারকারীকে একটার পর একটা item আর price যোগ করতে দিন যতক্ষণ না 'done' টাইপ করে, তারপর কার্ট আর মোট দেখান।",
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Two lists, <code>items</code> and <code>prices</code>, are built in lockstep — every <code>append()</code> to one is immediately followed by the matching <code>append()</code> to the other, so <code>items[i]</code> and <code>prices[i]</code> always describe the same product.</li><li>The loop is <code>while True</code> with a typed <code>"done"</code> as the exit condition, not a fixed count — useful whenever you don't know in advance how many entries there will be.</li><li>The final loop walks both lists by index (<code>range(len(items))</code>) specifically because it needs one shared index into two lists at once — a plain <code>for item in items</code> loop couldn't also reach into <code>prices</code> at the same position.</li></ol><p><b>Trace:</b> Apple 50, Milk 60, Bread 40 typed in, then "done" → total 150 printed after the loop exits.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>items</code> আর <code>prices</code> — দুটো list একসাথে তৈরি হয় — একটাতে <code>append()</code> করলেই সাথে সাথে অন্যটাতেও একই কাজ হয়, তাই <code>items[i]</code> আর <code>prices[i]</code> সবসময় একই প্রোডাক্টের কথা বলে।</li><li>লুপটা <code>while True</code>, আর টাইপ করা <code>"done"</code>-ই বের হওয়ার শর্ত, নির্দিষ্ট কোনো সংখ্যা না — যখন আগে থেকে জানা নেই কতগুলো এন্ট্রি হবে তখন এটা কাজে লাগে।</li><li>শেষের লুপটা দুটো list-ই index দিয়ে ঘুরে দেখে (<code>range(len(items))</code>) কারণ একসাথে দুটো list-এর একই পজিশনে পৌঁছানোর জন্য একটা শেয়ার্ড index দরকার — শুধু <code>for item in items</code> দিয়ে একই সাথে <code>prices</code>-এও পৌঁছানো যেত না।</li></ol><p><b>ট্রেস:</b> Apple 50, Milk 60, Bread 40 টাইপ করে, তারপর "done" → লুপ শেষ হওয়ার পর total 150 প্রিন্ট হয়।</p>`,
    example: "Enter item name (or 'done' to finish): Apple\nEnter price: 50\n...\nApple - 50\nMilk - 60\nTotal: 110",
    concepts: ['while True', 'two parallel lists', 'break', 'accumulator'],
    solution: `
items = []
prices = []

while True:
    item = input("Enter item name (or 'done' to finish): ")
    if item == "done":
        break
    prices.append(float(input("Enter price: ")))
    items.append(item)

print("\\nShopping Cart")
total = 0
for i in range(len(items)):
    print(items[i], "-", prices[i])
    total += prices[i]

print("Total:", total)`,
    noteEn: '`items` and `prices` are two separate lists kept in sync by position — `items[i]` and `prices[i]` always describe the same product.',
    noteBn: '`items` আর `prices` দুটো আলাদা list, যেগুলো পজিশন অনুযায়ী সিঙ্কে থাকে — `items[i]` আর `prices[i]` সবসময় একই প্রোডাক্টের কথা বলে।',
  },
  {
    title: 'Password Strength Checker',
    taskEn: 'Check whether a password is at least 8 characters and contains a number, an uppercase letter, and a lowercase letter.',
    taskBn: 'একটি পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টার কিনা, আর তাতে একটি সংখ্যা, একটি বড় হাতের আর একটি ছোট হাতের অক্ষর আছে কিনা চেক করুন।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>any(c.isdigit() for c in password)</code> checks every character and stops the moment it finds one that satisfies the condition — a compact way to ask "does at least one character match?"</li><li>The three checks (digit, uppercase, lowercase) run independently over the same string, each producing its own <code>True</code>/<code>False</code>.</li><li>The <code>elif</code> chain reports only the first problem it finds — length first, since a too-short password fails regardless of what characters it contains.</li></ol><p><b>Trace:</b> <code>"hello123"</code> → length 8 ok, has a number, no uppercase → stops at the uppercase check, prints "add an uppercase letter."</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>any(c.isdigit() for c in password)</code> প্রতিটা ক্যারেক্টার চেক করে আর শর্ত মেলা প্রথম ক্যারেক্টার পেলেই থেমে যায় — "অন্তত একটা ক্যারেক্টার মিলেছে কিনা" জিজ্ঞেস করার একটা সংক্ষিপ্ত উপায়।</li><li>তিনটা চেক (digit, uppercase, lowercase) একই স্ট্রিং-এর উপর আলাদাভাবে চলে, প্রতিটা নিজের <code>True</code>/<code>False</code> দেয়।</li><li><code>elif</code> চেইন শুধু প্রথম যে সমস্যা পায় সেটাই জানায় — length সবার আগে, কারণ ক্যারেক্টার যাই থাকুক, খুব ছোট পাসওয়ার্ড এমনিতেই ফেল করে।</li></ol><p><b>ট্রেস:</b> <code>"hello123"</code> → length 8 ঠিক আছে, সংখ্যা আছে, বড় হাতের অক্ষর নেই → uppercase চেকে থেমে যায়, প্রিন্ট হয় "add an uppercase letter."</p>`,
    example: 'Enter your password: Hello123\nStrong password!',
    concepts: ['len()', 'looping over a string', '.isdigit() / .isupper() / .islower()', 'boolean flags'],
    solution: `
password = input("Enter your password: ")

has_number = any(c.isdigit() for c in password)
has_upper = any(c.isupper() for c in password)
has_lower = any(c.islower() for c in password)

if len(password) < 8:
    print("Weak password - must have at least 8 characters.")
elif not has_number:
    print("Weak password - add a number.")
elif not has_upper:
    print("Weak password - add an uppercase letter.")
elif not has_lower:
    print("Weak password - add a lowercase letter.")
else:
    print("Strong password!")`,
    noteEn: '`any(c.isdigit() for c in password)` is the same flag-while-looping idea as a `for` loop that sets `has_number = True` — just shorter.',
    noteBn: '`any(c.isdigit() for c in password)` আসলে একই flag-while-looping আইডিয়া যা `for` লুপে `has_number = True` লিখে করা যেত — শুধু ছোট করে লেখা।',
  },
  {
    title: 'Rock, Paper, Scissors',
    taskEn: 'Play rock-paper-scissors against the computer for 5 rounds and print the final score.',
    taskBn: '৫ রাউন্ড কম্পিউটারের বিপক্ষে rock-paper-scissors খেলুন আর শেষে স্কোর প্রিন্ট করুন।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>random.choice(choices)</code> is what makes the computer's move unpredictable — it picks one item at random from the list each round.</li><li>The three "player wins" combinations are combined into one <code>elif</code> with <code>or</code> — read each parenthesized pair as one sentence: "rock beats scissors."</li><li><code>player in choices</code> catches everything that isn't a draw and isn't a win, but is still a real choice — leaving the final <code>else</code> to catch genuinely invalid input like "banana".</li><li>Running it inside <code>for i in range(5)</code> repeats the whole round five times, with <code>player_score</code> and <code>computer_score</code> persisting across every pass since they're defined outside the loop.</li></ol><p><b>Trace:</b> computer picks "paper", player types "rock" → not a draw, not a player-win combination, but "rock" is in <code>choices</code> → computer wins.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>random.choice(choices)</code>-ই কম্পিউটারের চাল অনিশ্চিত করে তোলে — প্রতি রাউন্ডে list থেকে একটা আইটেম র‍্যান্ডমলি বেছে নেয়।</li><li>"player wins"-এর তিনটা কম্বিনেশন <code>or</code> দিয়ে একটা <code>elif</code>-এ জোড়া — প্রতিটা bracket-করা জোড়াকে একটা বাক্য হিসেবে পড়ুন: "rock scissors-কে হারায়।"</li><li><code>player in choices</code> এমন সবকিছু ধরে যা draw-ও না, win-ও না, কিন্তু আসল একটা choice — শেষের <code>else</code> শুধু "banana"-র মতো সত্যিকারের ভুল ইনপুট ধরার জন্য থাকে।</li><li><code>for i in range(5)</code>-এর ভেতরে চালালে পুরো রাউন্ড পাঁচবার হয়, আর <code>player_score</code> ও <code>computer_score</code> প্রতিবার লুপ পার হয়েও থেকে যায় কারণ এগুলো লুপের বাইরে ডিফাইন করা।</li></ol><p><b>ট্রেস:</b> কম্পিউটার বেছে নেয় "paper", প্লেয়ার টাইপ করে "rock" → draw না, player-win কম্বিনেশনও না, কিন্তু "rock" <code>choices</code>-এ আছে → কম্পিউটার জেতে।</p>`,
    example: 'Round 1\nChoose rock, paper, or scissors: rock\nComputer chose: scissors\nYou win!\n...\nFinal Score\nYou: 3\nComputer: 2',
    concepts: ['import random', 'random.choice()', 'and / or', 'score counters'],
    solution: `
import random

choices = ["rock", "paper", "scissors"]
player_score = 0
computer_score = 0

for i in range(5):
    print("\\nRound", i + 1)
    player = input("Choose rock, paper, or scissors: ")
    computer = random.choice(choices)
    print("Computer chose:", computer)

    if player == computer:
        print("Draw!")
    elif (player == "rock" and computer == "scissors") or \\
         (player == "paper" and computer == "rock") or \\
         (player == "scissors" and computer == "paper"):
        print("You win!")
        player_score += 1
    elif player in choices:
        print("Computer wins!")
        computer_score += 1
    else:
        print("Invalid choice!")

print("\\nFinal Score")
print("You:", player_score)
print("Computer:", computer_score)`,
    noteEn: "The three winning combinations are just facts about the game, chained with `or` — read each line as one sentence: 'rock beats scissors'.",
    noteBn: "তিনটা জেতার কম্বিনেশন আসলে গেমের নিয়ম মাত্র, `or` দিয়ে জোড়া — প্রতিটা লাইনকে একটা বাক্য হিসেবে পড়ুন: 'rock scissors-কে হারায়'।",
  },
  {
    title: 'Quiz Game',
    taskEn: 'Ask a series of questions, check each answer, and print the score at the end.',
    taskBn: 'একের পর এক প্রশ্ন করুন, প্রতিটা উত্তর চেক করুন, আর শেষে স্কোর প্রিন্ট করুন।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Two lists, <code>questions</code> and <code>answers</code>, are kept in step by index — the same relationship as Shopping Cart's <code>items</code>/<code>prices</code>.</li><li><code>for i in range(len(questions))</code> is used instead of <code>for q in questions</code> specifically because the loop needs the same <code>i</code> to reach into both lists at once.</li><li><code>.lower()</code> on the user's typed answer means "Delhi", "delhi", and "DELHI" all count as correct — capitalization stops being the difference between right and wrong.</li></ol><p><b>Trace:</b> <code>i = 2</code>, <code>questions[2]</code> is "What is 5 + 5?", user types "10", <code>answers[2]</code> is "10" → matches, score increases.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>questions</code> আর <code>answers</code> — দুটো list index অনুযায়ী একসাথে চলে — Shopping Cart-এর <code>items</code>/<code>prices</code>-এর মতোই সম্পর্ক।</li><li><code>for q in questions</code>-এর বদলে <code>for i in range(len(questions))</code> ব্যবহার হয় কারণ লুপের একই সময়ে দুটো list-এই পৌঁছাতে একই <code>i</code> দরকার।</li><li>ব্যবহারকারীর টাইপ করা উত্তরে <code>.lower()</code> মানে "Delhi", "delhi", আর "DELHI" — সবগুলোই সঠিক গণ্য হবে; capitalization আর ঠিক-ভুলের পার্থক্য তৈরি করবে না।</li></ol><p><b>ট্রেস:</b> <code>i = 2</code>, <code>questions[2]</code> হলো "What is 5 + 5?", ব্যবহারকারী টাইপ করে "10", <code>answers[2]</code> হলো "10" → মিলে যায়, score বাড়ে।</p>`,
    example: 'Question 1\nWhat is the capital of India?\nYour answer: Delhi\nCorrect!\n...\nYour score: 3 / 4',
    concepts: ['two matching lists', 'for + range(len())', '.lower()', 'accumulator'],
    solution: `
questions = [
    "What is the capital of India?",
    "How many days are in a week?",
    "What is 5 + 5?",
    "Which language are we learning?",
]
answers = ["delhi", "7", "10", "python"]
score = 0

for i in range(len(questions)):
    print("\\nQuestion", i + 1)
    print(questions[i])
    user_answer = input("Your answer: ")

    if user_answer.lower() == answers[i]:
        print("Correct!")
        score += 1
    else:
        print("Wrong! Correct answer:", answers[i])

print("\\nYour score:", score, "/", len(questions))`,
    noteEn: "`.lower()` on the user's answer means 'Delhi', 'delhi', and 'DELHI' all count — without it, capitalization alone would fail a correct answer.",
    noteBn: "ব্যবহারকারীর উত্তরে `.lower()` মানে 'Delhi', 'delhi', আর 'DELHI' — সবগুলোই গণ্য হবে; এটা না থাকলে শুধু capitalization-এর জন্যই একটা সঠিক উত্তর ভুল ধরা হতো।",
  },
  {
    title: 'Contact Book',
    taskEn: 'A menu-driven app to add, view, and search contacts stored as name/phone pairs.',
    taskBn: 'নাম/ফোন জোড়া হিসেবে সেভ করা contact যোগ, দেখা, আর সার্চ করার জন্য একটি মেনু-চালিত অ্যাপ।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Each contact is a small list <code>[name, phone]</code> — a list living inside the bigger <code>contacts</code> list, which is why <code>contact[0]</code> and <code>contact[1]</code> work the way they do.</li><li>Search uses a <code>found</code> flag: start it <code>False</code>, flip it to <code>True</code> the moment a match turns up, then check it once after the loop to decide whether to print "not found."</li><li><code>.lower()</code> on both sides of the comparison makes the search match regardless of how the name was capitalized either time it was typed.</li></ol><p><b>Trace:</b> searching "rahul" against a contact stored as "Rahul" → both sides lowered to "rahul" → match found.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা contact একটা ছোট list <code>[name, phone]</code> — বড় <code>contacts</code> list-এর ভেতরে থাকা একটা list, এজন্যই <code>contact[0]</code> আর <code>contact[1]</code> এভাবে কাজ করে।</li><li>Search-এ একটা <code>found</code> flag ব্যবহার হয়: শুরুতে <code>False</code>, মিল পেলেই <code>True</code>-তে বদলে যায়, তারপর লুপ শেষে একবার চেক করে "not found" প্রিন্ট করবে কিনা ঠিক হয়।</li><li>তুলনার দুই পাশেই <code>.lower()</code> থাকায় নাম যেভাবেই টাইপ করা হোক না কেন সার্চ মিলে যায়।</li></ol><p><b>ট্রেস:</b> "Rahul" নামে সেভ করা contact-এর বিপরীতে "rahul" সার্চ করলে → দুই পাশই "rahul"-এ নেমে আসে → মিল পাওয়া যায়।</p>`,
    example: '1. Add Contact\n2. View Contacts\n3. Search Contact\n4. Exit\nEnter choice: 3\nEnter name to search: Rahul\nName: Rahul\nPhone: 9876543210',
    concepts: ['nested list', 'contact[0] / contact[1]', 'boolean flag', '.lower()'],
    solution: `
contacts = []

while True:
    print("\\n1. Add Contact\\n2. View Contacts\\n3. Search Contact\\n4. Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        name = input("Enter name: ")
        phone = input("Enter phone number: ")
        contacts.append([name, phone])
        print("Contact added!")
    elif choice == "2":
        if not contacts:
            print("No contacts.")
        else:
            for contact in contacts:
                print("Name:", contact[0], "| Phone:", contact[1])
    elif choice == "3":
        search = input("Enter name to search: ")
        found = False
        for contact in contacts:
            if contact[0].lower() == search.lower():
                print("Name:", contact[0])
                print("Phone:", contact[1])
                found = True
        if not found:
            print("Contact not found.")
    elif choice == "4":
        print("Goodbye!")
        break
    else:
        print("Invalid choice!")`,
    noteEn: "Each contact is a small list `[name, phone]` inside the bigger `contacts` list — a list of lists, the same shape you'll meet again as a list of dictionaries in the Intermediate level.",
    noteBn: 'প্রতিটা contact একটা ছোট list `[name, phone]`, যেটা বড় `contacts` list-এর ভেতরে থাকে — এই list-এর-ভেতরে-list গঠনটাই Intermediate লেভেলে dictionary-র list হিসেবে আবার দেখবেন।',
  },
  {
    title: 'Expense Tracker',
    taskEn: 'A menu-driven app to record expenses by category and amount, and show the running total.',
    taskBn: 'ক্যাটাগরি আর পরিমাণ অনুযায়ী খরচ রেকর্ড করার জন্য একটি মেনু-চালিত অ্যাপ, যা চলমান মোট দেখায়।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Each expense is stored the same shape as Contact Book's entries — <code>[category, amount]</code> — a small list inside the bigger <code>expenses</code> list.</li><li><code>sum(expense[1] for expense in expenses)</code> is a generator expression: it visits every expense, pulls out just the amount (index 1), and adds them all up in one line. The loop-based equivalent would be <code>total = 0</code> followed by <code>total += expense[1]</code> inside a <code>for</code> loop.</li></ol><p><b>Trace:</b> <code>expenses = [["Food", 200], ["Transport", 100]]</code> → the generator sees 200 then 100 → total 300.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা expense Contact Book-এর এন্ট্রির মতো একই আকারে সেভ হয় — <code>[category, amount]</code> — বড় <code>expenses</code> list-এর ভেতরে একটা ছোট list।</li><li><code>sum(expense[1] for expense in expenses)</code> একটা generator expression: প্রতিটা expense-এ ঘুরে শুধু amount (index 1) বের করে এক লাইনেই সব যোগ করে দেয়। লুপ দিয়ে করলে হতো <code>total = 0</code>-এর পর <code>for</code> লুপের ভেতরে <code>total += expense[1]</code>।</li></ol><p><b>ট্রেস:</b> <code>expenses = [["Food", 200], ["Transport", 100]]</code> → generator প্রথমে 200 তারপর 100 দেখে → total হয় 300।</p>`,
    example: '1. Add Expense\n2. View Expenses\n3. Show Total\n4. Exit\nEnter choice: 3\nTotal expenses: 800',
    concepts: ['nested list', 'while True menu', 'accumulator loop', 'len() == 0 check'],
    solution: `
expenses = []

while True:
    print("\\n1. Add Expense\\n2. View Expenses\\n3. Show Total\\n4. Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        category = input("Enter category: ")
        amount = float(input("Enter amount: "))
        expenses.append([category, amount])
        print("Expense added!")
    elif choice == "2":
        if not expenses:
            print("No expenses recorded.")
        else:
            for expense in expenses:
                print(expense[0], "-", expense[1])
    elif choice == "3":
        total = sum(expense[1] for expense in expenses)
        print("Total expenses:", total)
    elif choice == "4":
        print("Goodbye!")
        break
    else:
        print("Invalid choice!")`,
    noteEn: '`sum(expense[1] for expense in expenses)` totals just the amounts, ignoring the categories — the same idea as the total loop, written as one line.',
    noteBn: '`sum(expense[1] for expense in expenses)` শুধু পরিমাণগুলো যোগ করে, ক্যাটাগরি বাদ দিয়ে — এটাই total-এর লুপের আইডিয়া, এক লাইনে লেখা।',
  },
]

const INTERMEDIATE = [
  {
    title: 'Bank Account Simulator',
    taskEn: 'A menu-driven bank simulator using functions — check balance, deposit, and withdraw, each as its own function that returns the updated balance.',
    taskBn: 'function ব্যবহার করে একটি মেনু-চালিত ব্যাংক সিমুলেটর — balance দেখা, deposit, আর withdraw, প্রতিটা নিজের একটা function হিসেবে, যা আপডেট হওয়া balance রিটার্ন করে।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Each action becomes its own function — <code>show_balance</code>, <code>deposit</code>, <code>withdraw</code> — so the menu's job shrinks to "figure out which function to call," not "do the work itself."</li><li><code>deposit(balance)</code> takes the current balance in as a parameter and returns the new balance out — it never touches a variable named <code>balance</code> that lives outside the function.</li><li><code>balance = deposit(balance)</code> is the pattern to remember: pass the current value in, capture what comes back, store it in the same name.</li></ol><p><b>Trace:</b> <code>balance = 1000</code>, <code>deposit()</code> asks for 500, returns 1500, <code>balance</code> becomes 1500 back in the main program.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা কাজ নিজের একটা function হয়ে যায় — <code>show_balance</code>, <code>deposit</code>, <code>withdraw</code> — তাই মেনুর কাজ ছোট হয়ে যায় "কোন function ডাকতে হবে সেটা ঠিক করা"-তে, নিজে কাজটা করায় না।</li><li><code>deposit(balance)</code> বর্তমান balance-কে parameter হিসেবে ভেতরে নেয়, নতুন balance বাইরে রিটার্ন করে — function-এর বাইরে থাকা <code>balance</code> নামের কোনো ভ্যারিয়েবল কখনো ছোঁয় না।</li><li><code>balance = deposit(balance)</code> মনে রাখার মতো প্যাটার্ন: বর্তমান মান ভেতরে পাঠান, যা ফেরত আসে সেটা ধরুন, একই নামে সেভ করুন।</li></ol><p><b>ট্রেস:</b> <code>balance = 1000</code>, <code>deposit()</code> 500 চায়, 1500 রিটার্ন করে, মূল প্রোগ্রামে <code>balance</code> হয়ে যায় 1500।</p>`,
    example: '===== BANK =====\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Exit\nEnter choice: 2\nEnter amount: 500\nDeposit successful!',
    concepts: ['def', 'parameters', 'return', 'functions calling functions'],
    solution: `
def show_balance(balance):
    print("Balance:", balance)

def deposit(balance):
    amount = float(input("Enter amount to deposit: "))
    print("Deposit successful!")
    return balance + amount

def withdraw(balance):
    amount = float(input("Enter amount to withdraw: "))
    if amount <= balance:
        print("Withdrawal successful!")
        return balance - amount
    print("Insufficient balance!")
    return balance

balance = 1000

while True:
    print("\\n===== BANK =====\\n1. Check Balance\\n2. Deposit\\n3. Withdraw\\n4. Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        show_balance(balance)
    elif choice == "2":
        balance = deposit(balance)
    elif choice == "3":
        balance = withdraw(balance)
    elif choice == "4":
        print("Thank you!")
        break
    else:
        print("Invalid choice!")`,
    noteEn: '`balance = deposit(balance)` is the core pattern: pass the current value in, get the new value back, store it — no `global` needed.',
    noteBn: '`balance = deposit(balance)` মূল প্যাটার্ন: বর্তমান মান ভেতরে পাঠান, নতুন মান ফেরত পান, সেভ করুন — কোনো `global` লাগে না।',
  },
  {
    title: 'Advanced To-Do App',
    taskEn: 'Extend the To-Do List with a completed status per task, using functions for add / view / complete / delete.',
    taskBn: 'প্রতিটা task-এ completed স্ট্যাটাস যোগ করে To-Do List-কে আরও বড় করুন, add/view/complete/delete-এর জন্য function ব্যবহার করে।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Each task becomes <code>[text, False]</code> instead of a plain string — a small list where index 1 is a Boolean tracking whether it's done, the same two-pieces-of-information idea as Expense Tracker's <code>[category, amount]</code>.</li><li><code>tasks.append(...)</code> and <code>tasks.pop(...)</code> change the list that was passed in, in place — these functions never need to return <code>tasks</code>, unlike <code>deposit()</code>/<code>withdraw()</code> which had to return a new balance because numbers can't be mutated in place.</li><li><code>tasks[index][1] = True</code> reaches two levels deep: first to the task at that position, then to its second element.</li></ol><p><b>Trace:</b> <code>tasks[0]</code> is <code>["Learn Python", False]</code> → after <code>tasks[0][1] = True</code> it's <code>["Learn Python", True]</code>.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা task সাধারণ স্ট্রিং না হয়ে হয়ে যায় <code>[text, False]</code> — একটা ছোট list, যার index 1 একটা Boolean যা বলে কাজটা শেষ হয়েছে কিনা, ঠিক Expense Tracker-এর <code>[category, amount]</code>-এর মতোই দুটো তথ্য একসাথে রাখার আইডিয়া।</li><li><code>tasks.append(...)</code> আর <code>tasks.pop(...)</code> ভেতরে পাঠানো list-টাকে সরাসরি বদলে দেয় — এই function গুলোর <code>tasks</code> রিটার্ন করার দরকার নেই, <code>deposit()</code>/<code>withdraw()</code>-এর মতো না, যাদের নতুন balance রিটার্ন করতেই হতো কারণ সংখ্যা সরাসরি বদলানো যায় না।</li><li><code>tasks[index][1] = True</code> দুই ধাপ গভীরে পৌঁছায়: প্রথমে সেই পজিশনের task-এ, তারপর তার দ্বিতীয় উপাদানে।</li></ol><p><b>ট্রেস:</b> <code>tasks[0]</code> হলো <code>["Learn Python", False]</code> → <code>tasks[0][1] = True</code>-এর পর হয় <code>["Learn Python", True]</code>।</p>`,
    example: '1 ○ Learn Python\n2 ✓ Exercise\nMark task 1 as done\n1 ✓ Learn Python\n2 ✓ Exercise',
    concepts: ['functions taking a shared list', '[text, False] pairs', 'return to exit early'],
    solution: `
def add_task(tasks):
    tasks.append([input("Enter task: "), False])
    print("Task added!")

def view_tasks(tasks):
    if not tasks:
        print("No tasks.")
        return
    for i, task in enumerate(tasks, start=1):
        status = "✓" if task[1] else "○"
        print(i, status, task[0])

def complete_task(tasks):
    view_tasks(tasks)
    n = int(input("Enter task number: "))
    if 1 <= n <= len(tasks):
        tasks[n - 1][1] = True
        print("Task completed!")

def delete_task(tasks):
    view_tasks(tasks)
    n = int(input("Enter task number to delete: "))
    if 1 <= n <= len(tasks):
        tasks.pop(n - 1)
        print("Task deleted!")

tasks = []

while True:
    print("\\n1. Add  2. View  3. Complete  4. Delete  5. Exit")
    choice = input("Enter choice: ")
    if choice == "1": add_task(tasks)
    elif choice == "2": view_tasks(tasks)
    elif choice == "3": complete_task(tasks)
    elif choice == "4": delete_task(tasks)
    elif choice == "5": break
    else: print("Invalid choice!")`,
    noteEn: "`tasks.append(...)` and `tasks.pop(...)` change the list in place, so these functions don't need to `return` it — only values like a number or a string need `return` to get back out.",
    noteBn: '`tasks.append(...)` আর `tasks.pop(...)` list-টাকে সরাসরি বদলে দেয়, তাই এই function গুলোর `return` করার দরকার নেই — শুধু নম্বর বা স্ট্রিং-এর মতো মান বের করে আনতে `return` লাগে।',
  },
  {
    title: 'Expense Tracker with File Storage',
    taskEn: 'Rebuild the Expense Tracker so expenses are stored as dictionaries and saved to a JSON file, surviving between runs.',
    taskBn: 'Expense Tracker-কে নতুন করে বানান যাতে খরচ dictionary হিসেবে সেভ হয় আর একটি JSON ফাইলে সেভ থাকে, রান শেষ হওয়ার পরও টিকে থাকে।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Each expense becomes a dictionary, <code>{"category": ..., "amount": ...}</code>, instead of a list — <code>expense["amount"]</code> says what it means; <code>expense[1]</code> didn't.</li><li><code>json.dump(expenses, file)</code> turns the whole Python list of dictionaries into JSON text and writes it to disk; <code>json.load(file)</code> does the reverse when the program starts again.</li><li><code>try</code>/<code>except FileNotFoundError</code> around the load means the very first run — before the file exists — starts from an empty list instead of crashing.</li></ol><p><b>Trace:</b> first run, no file yet → <code>FileNotFoundError</code> caught → <code>expenses = []</code>. After adding one expense and saving, the next run's <code>json.load()</code> reconstructs it exactly.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা expense list না হয়ে হয়ে যায় একটা dictionary, <code>{"category": ..., "amount": ...}</code> — <code>expense["amount"]</code> বলে দেয় মানে কী; <code>expense[1]</code> বলত না।</li><li><code>json.dump(expenses, file)</code> পুরো Python list-of-dictionaries-কে JSON টেক্সটে বদলে ডিস্কে লিখে দেয়; প্রোগ্রাম আবার চালু হলে <code>json.load(file)</code> উল্টো কাজটা করে।</li><li>load-এর চারপাশে <code>try</code>/<code>except FileNotFoundError</code> থাকায় একদম প্রথম রান — যখন ফাইলটা এখনো নেই — ক্র্যাশ না করে একটা খালি list দিয়ে শুরু করে।</li></ol><p><b>ট্রেস:</b> প্রথম রান, ফাইল নেই → <code>FileNotFoundError</code> ধরা পড়ে → <code>expenses = []</code>। একটা expense যোগ করে সেভ করার পর, পরের রানে <code>json.load()</code> সেটা ঠিকঠাক আবার তৈরি করে।</p>`,
    example: 'expenses.json:\n[{"category": "Food", "amount": 200}]\n\nTotal expenses: 200',
    concepts: ['dictionaries', 'import json', 'json.dump() / json.load()', 'try / except FileNotFoundError'],
    solution: `
import json

def load_expenses():
    try:
        with open("expenses.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_expenses(expenses):
    with open("expenses.json", "w") as file:
        json.dump(expenses, file, indent=4)

def add_expense(expenses):
    expense = {
        "category": input("Enter category: "),
        "amount": float(input("Enter amount: ")),
    }
    expenses.append(expense)
    save_expenses(expenses)
    print("Expense added!")

def show_total(expenses):
    total = sum(e["amount"] for e in expenses)
    print("Total expenses:", total)

expenses = load_expenses()

while True:
    print("\\n1. Add  2. View  3. Total  4. Exit")
    choice = input("Enter choice: ")
    if choice == "1": add_expense(expenses)
    elif choice == "2":
        for e in expenses: print(e["category"], "-", e["amount"])
    elif choice == "3": show_total(expenses)
    elif choice == "4": break
    else: print("Invalid choice!")`,
    noteEn: "`expense['amount']` instead of `expense[1]` is the whole point of switching from a list to a dictionary — the key says what the value means.",
    noteBn: "`expense[1]`-এর বদলে `expense['amount']` — এটাই list থেকে dictionary-তে যাওয়ার আসল কারণ: key নিজেই বলে দেয় মানটা কী বোঝায়।",
  },
  {
    title: 'Quiz Game with Question Database',
    taskEn: 'Load quiz questions from a separate questions.json file instead of hardcoding them, then run the quiz.',
    taskBn: 'কুইজের প্রশ্ন হার্ডকোড না করে আলাদা একটি questions.json ফাইল থেকে লোড করুন, তারপর কুইজ চালান।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Each question is one dictionary with three keys — <code>question</code>, <code>options</code>, <code>answer</code> — and the whole quiz is a list of these, loaded from <code>questions.json</code> instead of typed into the Python file directly.</li><li>Keeping the questions in their own file is what "separate data from logic" means in practice: <code>quiz.py</code> only knows how to run a quiz, not which questions are in it.</li><li><code>ask_question()</code> returns <code>True</code> or <code>False</code> depending on whether the answer matched — <code>sum(ask_question(q) for q in questions)</code> works because Python counts <code>True</code> as 1 and <code>False</code> as 0 when summed.</li></ol><p><b>Trace:</b> <code>q["options"]</code> is <code>["6", "7", "8", "9"]</code>, user types "3" → index 2 → <code>q["options"][2]</code> is "8", matches <code>q["answer"]</code> → returns <code>True</code>.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা প্রশ্ন একটা dictionary, তিনটা key সহ — <code>question</code>, <code>options</code>, <code>answer</code> — আর পুরো কুইজ এগুলোর একটা list, যা সরাসরি Python ফাইলে না লিখে <code>questions.json</code> থেকে লোড হয়।</li><li>প্রশ্নগুলো আলাদা ফাইলে রাখাই বাস্তবে "data-কে logic থেকে আলাদা রাখা" মানে: <code>quiz.py</code> শুধু জানে কীভাবে কুইজ চালাতে হয়, কী কী প্রশ্ন আছে সেটা না।</li><li>উত্তর মিলেছে কিনা তার উপর ভিত্তি করে <code>ask_question()</code> <code>True</code> বা <code>False</code> রিটার্ন করে — <code>sum(ask_question(q) for q in questions)</code> কাজ করে কারণ Python যোগ করার সময় <code>True</code>-কে 1 আর <code>False</code>-কে 0 হিসেবে গোনে।</li></ol><p><b>ট্রেস:</b> <code>q["options"]</code> হলো <code>["6", "7", "8", "9"]</code>, ব্যবহারকারী টাইপ করে "3" → index 2 → <code>q["options"][2]</code> হলো "8", যা <code>q["answer"]</code>-এর সাথে মেলে → <code>True</code> রিটার্ন করে।</p>`,
    example: 'questions.json:\n[{"question": "5 + 3?", "options": [...], "answer": "8"}]\n\nScore: 2 / 3',
    concepts: ['dictionaries in a list', 'separating data from logic', 'json.load()', 'return True / False'],
    solution: `
import json

def load_questions():
    try:
        with open("questions.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def ask_question(q):
    print("\\n" + q["question"])
    for i, option in enumerate(q["options"], start=1):
        print(i, ".", option)
    choice = int(input("Enter your answer: "))
    if q["options"][choice - 1] == q["answer"]:
        print("Correct!")
        return True
    print("Wrong! Correct answer:", q["answer"])
    return False

questions = load_questions()
score = sum(ask_question(q) for q in questions)

print(f"\\nScore: {score} / {len(questions)}")`,
    noteEn: '`sum(ask_question(q) for q in questions)` works because `True` counts as `1` and `False` as `0` in Python — each correct answer adds one to the total.',
    noteBn: '`sum(ask_question(q) for q in questions)` কাজ করে কারণ Python-এ `True` মানে `1` আর `False` মানে `0` — প্রতিটা সঠিক উত্তর মোটের সাথে এক যোগ করে।',
  },
  {
    title: 'Contact Book with Search, Delete, Update',
    taskEn: 'Rebuild the Contact Book using a list of dictionaries, with search, update, and delete, saved to JSON.',
    taskBn: 'Contact Book-কে dictionary-র list দিয়ে নতুন করে বানান, search, update, আর delete সহ, JSON-এ সেভ করে।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Each contact becomes a dictionary inside a list, the same upgrade Expense Tracker made — <code>contact["phone"]</code> instead of <code>contact[1]</code>.</li><li>Updating changes a value already inside a dictionary that's still inside the list (<code>c["phone"] = new_phone</code>) — no removing and re-adding needed, unlike deleting.</li><li>Deleting needs the position, not just the contact itself, because <code>.pop()</code> takes an index — that's why it loops with <code>enumerate()</code> instead of a plain <code>for c in contacts</code>.</li><li>Every add/update/delete calls <code>save_contacts()</code> right after — changing the list in memory doesn't touch the file on disk until that call happens.</li></ol><p><b>Trace:</b> updating Rahul's phone finds the matching dictionary, sets <code>c["phone"]</code> on it directly, then saves — the dictionary's identity in the list never changes, only one value inside it does.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা contact list-এর ভেতরে একটা dictionary হয়ে যায়, Expense Tracker যে upgrade করেছিল সেটাই — <code>contact[1]</code>-এর বদলে <code>contact["phone"]</code>।</li><li>Update করা মানে list-এর ভেতরে থাকা dictionary-র একটা মান বদলানো (<code>c["phone"] = new_phone</code>) — delete-এর মতো সরিয়ে আবার যোগ করার দরকার নেই।</li><li>Delete-এর জন্য শুধু contact না, পজিশনও লাগে, কারণ <code>.pop()</code> একটা index নেয় — এজন্যই সাধারণ <code>for c in contacts</code>-এর বদলে <code>enumerate()</code> দিয়ে লুপ হয়।</li><li>প্রতিটা add/update/delete-এর পরই <code>save_contacts()</code> ডাকা হয় — মেমরিতে list বদলালেই ডিস্কের ফাইল বদলায় না, যতক্ষণ না এই কলটা হয়।</li></ol><p><b>ট্রেস:</b> Rahul-এর ফোন নম্বর update করলে মিলে যাওয়া dictionary-টা খুঁজে পাওয়া যায়, সরাসরি তার <code>c["phone"]</code> সেট হয়, তারপর সেভ হয় — list-এ dictionary-র identity একই থাকে, শুধু তার ভেতরের একটা মান বদলায়।</p>`,
    example: 'Update Rahul\nEnter new phone: 9999999999\nContact updated!',
    concepts: ['list of dictionaries', 'mutating a dict in place', '.pop(i)', 'save after every change'],
    solution: `
import json

def load_contacts():
    try:
        with open("contacts.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_contacts(contacts):
    with open("contacts.json", "w") as file:
        json.dump(contacts, file, indent=4)

def add_contact(contacts):
    contacts.append({
        "name": input("Enter name: "),
        "phone": input("Enter phone: "),
    })
    save_contacts(contacts)

def update_contact(contacts):
    name = input("Enter name to update: ")
    for c in contacts:
        if c["name"].lower() == name.lower():
            c["phone"] = input("Enter new phone: ")
            save_contacts(contacts)
            print("Contact updated!")
            return
    print("Contact not found.")

def delete_contact(contacts):
    name = input("Enter name to delete: ")
    for i, c in enumerate(contacts):
        if c["name"].lower() == name.lower():
            contacts.pop(i)
            save_contacts(contacts)
            print("Contact deleted!")
            return
    print("Contact not found.")

contacts = load_contacts()
# ... menu loop connecting add_contact / update_contact / delete_contact,
# the same shape as the Expense Tracker's menu above.`,
    noteEn: 'Updating just changes `c["phone"]` on the dictionary already inside the list — no need to remove and re-add it, unlike deleting.',
    noteBn: 'Update করা মানে শুধু list-এর ভেতরে থাকা dictionary-র `c["phone"]` বদলানো — delete-এর মতো সরিয়ে আবার যোগ করার দরকার নেই।',
  },
  {
    title: 'Password Generator',
    taskEn: 'Generate a random password of a length the user chooses, made up of letters, digits, and symbols.',
    taskBn: 'ব্যবহারকারীর বেছে নেওয়া দৈর্ঘ্যের একটি র‍্যান্ডম পাসওয়ার্ড বানান, যাতে অক্ষর, সংখ্যা, আর symbol থাকবে।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>string.ascii_letters</code> and <code>string.digits</code> are pre-built character sets from Python's standard library — the alphabet and digits without typing them out by hand.</li><li><code>random.choice(characters)</code> picks one random character from that combined set; running it once per position via a generator expression inside <code>"".join(...)</code> builds the whole password in one line.</li></ol><p><b>Trace:</b> length 4 → four independent <code>random.choice()</code> calls → results joined into one string, e.g. "aT9#".</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>string.ascii_letters</code> আর <code>string.digits</code> হলো Python-এর standard library-র রেডি-মেড ক্যারেক্টার সেট — হাতে না লিখেই পুরো অক্ষরমালা আর সংখ্যা পাওয়া যায়।</li><li><code>random.choice(characters)</code> সেই একসাথে করা সেট থেকে একটা র‍্যান্ডম ক্যারেক্টার বেছে নেয়; একটা generator expression দিয়ে প্রতিটা পজিশনের জন্য একবার করে চালিয়ে, <code>"".join(...)</code>-এর ভেতরে পুরো পাসওয়ার্ড এক লাইনেই তৈরি হয়ে যায়।</li></ol><p><b>ট্রেস:</b> length 4 → চারটা আলাদা <code>random.choice()</code> কল → ফলাফল জোড়া লেগে একটা স্ট্রিং হয়ে যায়, যেমন "aT9#"।</p>`,
    example: 'Enter password length: 12\nGenerated password: aT9#kLp2!qXz',
    concepts: ['import random', 'string module', 'random.choice() in a loop', "''.join()"],
    solution: `
import random
import string

length = int(input("Enter password length: "))
characters = string.ascii_letters + string.digits + "!@#$%^&*"

password = "".join(random.choice(characters) for _ in range(length))
print("Generated password:", password)`,
    noteEn: "`string.ascii_letters` and `string.digits` are ready-made character sets from Python's standard library — no need to type out the alphabet by hand.",
    noteBn: '`string.ascii_letters` আর `string.digits` Python-এর standard library-র রেডি-মেড ক্যারেক্টার সেট — হাতে করে পুরো অক্ষরমালা লেখার দরকার নেই।',
  },
  {
    title: 'Text-Based ATM',
    taskEn: 'An ATM-style menu with a PIN check before allowing balance, deposit, or withdrawal — locking out after 3 wrong PIN attempts.',
    taskBn: 'একটি ATM-স্টাইল মেনু, যেখানে balance, deposit, বা withdraw করার আগে PIN চেক করা হয় — ৩ বার ভুল PIN দিলে লক হয়ে যায়।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>check_pin()</code> loops up to 3 times, returning <code>True</code> the instant the correct PIN is entered — an early <code>return</code> exits the function immediately, skipping the rest of the loop.</li><li>If all 3 attempts fail, the loop finishes normally and the function falls through to <code>return False</code>.</li><li>The rest of the program only runs inside <code>if not check_pin():</code> — a function's return value deciding what happens next, not just what the function itself does.</li></ol><p><b>Trace:</b> wrong PIN twice, correct on the third try → <code>check_pin()</code> returns <code>True</code> on attempt 3 without ever reaching the fail branch.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>check_pin()</code> সর্বোচ্চ ৩ বার লুপ চালায়, সঠিক PIN দেওয়া মাত্রই <code>True</code> রিটার্ন করে — একটা তাড়াতাড়ি <code>return</code> সাথে সাথেই function থেকে বের করে দেয়, লুপের বাকিটা আর চলে না।</li><li>তিনবারই ভুল হলে লুপ স্বাভাবিকভাবে শেষ হয় আর function গিয়ে পৌঁছায় <code>return False</code>-এ।</li><li>বাকি প্রোগ্রাম শুধু <code>if not check_pin():</code>-এর ভেতরেই চলে — একটা function-এর রিটার্ন ভ্যালু ঠিক করে দিচ্ছে এরপর কী হবে, শুধু function নিজে কী করছে তা না।</li></ol><p><b>ট্রেস:</b> দুইবার ভুল PIN, তৃতীয়বারে সঠিক → <code>check_pin()</code> তৃতীয় চেষ্টাতেই <code>True</code> রিটার্ন করে, fail branch-এ কখনো পৌঁছায় না।</p>`,
    example: 'Enter PIN: 0000\nWrong PIN. 2 attempts left.\nEnter PIN: 1234\nWelcome!',
    concepts: ['functions', 'while / for with a fail counter', 'early return', 'nested menu'],
    solution: `
CORRECT_PIN = "1234"
balance = 1000

def check_pin():
    for attempt in range(3):
        pin = input("Enter PIN: ")
        if pin == CORRECT_PIN:
            return True
        print(f"Wrong PIN. {2 - attempt} attempts left.")
    return False

if not check_pin():
    print("Too many wrong attempts. Card blocked.")
else:
    print("Welcome!")
    while True:
        print("\\n1. Balance  2. Deposit  3. Withdraw  4. Exit")
        choice = input("Enter choice: ")
        if choice == "1":
            print("Balance:", balance)
        elif choice == "2":
            balance += float(input("Enter amount: "))
        elif choice == "3":
            amount = float(input("Enter amount: "))
            if amount <= balance:
                balance -= amount
            else:
                print("Insufficient balance!")
        elif choice == "4":
            break
        else:
            print("Invalid choice!")`,
    noteEn: "`check_pin()` returns `True` or `False`, and the rest of the program only runs inside `if not check_pin():` — a function's return value deciding what happens next.",
    noteBn: '`check_pin()` `True` বা `False` রিটার্ন করে, আর বাকি প্রোগ্রাম শুধু `if not check_pin():`-এর ভেতরেই চলে — একটা function-এর রিটার্ন ভ্যালু ঠিক করে দিচ্ছে এরপর কী হবে।',
  },
  {
    title: 'Library Management System',
    taskEn: "Track books as available or borrowed, with functions to add a book, borrow it, return it, and list what's available.",
    taskBn: 'বই available নাকি borrowed তা ট্র্যাক করুন, বই যোগ, borrow, return, আর available বই লিস্ট করার function সহ।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Each book is <code>{"title": ..., "borrowed": False}</code> — the same boolean-flag-in-a-dictionary idea as the Advanced To-Do App's completed status.</li><li><code>borrow_book()</code> only matches a book where <code>borrowed</code> is still <code>False</code> — trying to borrow an already-borrowed book falls through to "Not available."</li><li><code>[b["title"] for b in books if not b["borrowed"]]</code> is a list comprehension: the same filtering <code>for</code> loop, written as one expression instead of several lines.</li></ol><p><b>Trace:</b> two books, one already borrowed → the list comprehension only includes the one still available.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা বই <code>{"title": ..., "borrowed": False}</code> — Advanced To-Do App-এর completed স্ট্যাটাসের মতোই একটা dictionary-র ভেতরে boolean flag রাখার আইডিয়া।</li><li><code>borrow_book()</code> শুধু সেই বইয়ের সাথে মেলে যার <code>borrowed</code> এখনো <code>False</code> — আগে থেকে ধার নেওয়া বই আবার ধার করতে চাইলে "Not available"-এ গিয়ে পড়ে।</li><li><code>[b["title"] for b in books if not b["borrowed"]]</code> একটা list comprehension: একই ফিল্টারিং <code>for</code> লুপ, কয়েক লাইনের বদলে এক expression-এ লেখা।</li></ol><p><b>ট্রেস:</b> দুটো বই, একটা আগে থেকেই ধার নেওয়া → list comprehension শুধু এখনো available যেটা সেটাই রাখে।</p>`,
    example: '1. Add Book  2. Borrow  3. Return  4. List Available  5. Exit\nEnter choice: 2\nEnter title to borrow: Python Basics\nBorrowed!',
    concepts: ['list of dictionaries', 'boolean field', 'filtering with a list comprehension'],
    solution: `
books = []

def add_book(title):
    books.append({"title": title, "borrowed": False})

def borrow_book(title):
    for book in books:
        if book["title"] == title and not book["borrowed"]:
            book["borrowed"] = True
            print("Borrowed!")
            return
    print("Not available.")

def return_book(title):
    for book in books:
        if book["title"] == title and book["borrowed"]:
            book["borrowed"] = False
            print("Returned!")
            return
    print("That book wasn't borrowed.")

def list_available():
    available = [b["title"] for b in books if not b["borrowed"]]
    print("\\n".join(available) if available else "No books available.")`,
    noteEn: '`[b["title"] for b in books if not b["borrowed"]]` is a list comprehension — the same filtering `for` loop written in one line.',
    noteBn: '`[b["title"] for b in books if not b["borrowed"]]` একটা list comprehension — একই ফিল্টারিং `for` লুপ, এক লাইনে লেখা।',
  },
  {
    title: 'Inventory Management System',
    taskEn: 'Track product stock levels, allowing restocking, selling (with a stock check), and a low-stock report.',
    taskBn: 'প্রোডাক্টের স্টক লেভেল ট্র্যাক করুন, restock, sell (স্টক চেক সহ), আর low-stock রিপোর্টের ব্যবস্থা রাখুন।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>inventory</code> is a dictionary keyed directly by product name — <code>inventory["Pen"]</code> is the stock count for pens, no separate list of names needed.</li><li><code>inventory.get(name, 0)</code> returns 0 instead of crashing when a product hasn't been added yet — safer than <code>inventory[name]</code> for a key that might not exist.</li><li><code>sell()</code> checks there's enough stock before subtracting — the same "check before you act" pattern as the Bank Account Simulator's <code>withdraw()</code>.</li></ol><p><b>Trace:</b> <code>inventory = {"Pen": 3}</code>, selling 5 → <code>3 >= 5</code> is false → "Not enough stock" instead of a negative count.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>inventory</code> একটা dictionary, সরাসরি প্রোডাক্টের নাম key হিসেবে ব্যবহার করে — <code>inventory["Pen"]</code> মানে কলমের স্টক সংখ্যা, নামের আলাদা কোনো list লাগে না।</li><li><code>inventory.get(name, 0)</code> প্রোডাক্ট এখনো যোগ না হলে ক্র্যাশ না করে 0 রিটার্ন করে — এমন key-এর জন্য <code>inventory[name]</code>-এর চেয়ে নিরাপদ যা নাও থাকতে পারে।</li><li>বিয়োগ করার আগে <code>sell()</code> চেক করে যথেষ্ট স্টক আছে কিনা — Bank Account Simulator-এর <code>withdraw()</code>-এর মতোই "আগে চেক করো, তারপর করো" প্যাটার্ন।</li></ol><p><b>ট্রেস:</b> <code>inventory = {"Pen": 3}</code>, 5টা বিক্রি করতে চাইলে → <code>3 >= 5</code> মিথ্যা → নেগেটিভ কাউন্ট না হয়ে "Not enough stock" দেখায়।</p>`,
    example: '1. Add Product  2. Restock  3. Sell  4. Low Stock Report  5. Exit\nEnter choice: 3\nSold 5 units of Notebook.',
    concepts: ['dictionary keyed by product name', 'stock arithmetic', 'guarding against negative stock'],
    solution: `
inventory = {}

def add_product(name, qty):
    inventory[name] = inventory.get(name, 0) + qty

def sell(name, qty):
    if inventory.get(name, 0) >= qty:
        inventory[name] -= qty
        print(f"Sold {qty} units of {name}.")
    else:
        print("Not enough stock.")

def low_stock_report(threshold=5):
    for name, qty in inventory.items():
        if qty < threshold:
            print(name, "-", qty, "left")`,
    noteEn: "`inventory.get(name, 0)` returns `0` instead of crashing when a product hasn't been added yet — a safer way to read a dictionary key that might not exist.",
    noteBn: '`inventory.get(name, 0)` প্রোডাক্ট এখনও যোগ না হলে ক্র্যাশ না করে `0` রিটার্ন করে — dictionary-র এমন key পড়ার নিরাপদ উপায় যা নাও থাকতে পারে।',
  },
  {
    title: 'Mini Store Management System',
    taskEn: 'Combine everything from this level into one program: products with stock (dictionaries), a shopping cart, checkout that reduces stock, and a JSON-saved sales log.',
    taskBn: 'এই লেভেলের সবকিছু একটা প্রোগ্রামে একসাথে করুন: স্টক সহ প্রোডাক্ট (dictionary), শপিং কার্ট, চেকআউট যা স্টক কমায়, আর একটি JSON-এ সেভ করা sales log।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>This project doesn't introduce anything new — it's dictionaries for products, a list for the cart, and the load/save JSON pattern from the Expense Tracker, combined into one program.</li><li><code>checkout()</code> reads each cart item's price from the <code>products</code> dictionary, adds them into a total, and appends one record — <code>{"items": ..., "total": ...}</code> — to a growing sales history that gets saved to JSON after every sale.</li></ol><p><b>Trace:</b> cart <code>["Pen", "Notebook"]</code> with <code>products = {"Pen": 10, "Notebook": 40}</code> → total 50, one sale record appended and saved.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>এই প্রজেক্ট নতুন কিছু আনে না — প্রোডাক্টের জন্য dictionary, কার্টের জন্য list, আর Expense Tracker-এর load/save JSON প্যাটার্ন, সব একসাথে একটা প্রোগ্রামে।</li><li><code>checkout()</code> কার্টের প্রতিটা item-এর দাম <code>products</code> dictionary থেকে পড়ে, সব যোগ করে একটা total বানায়, আর একটা রেকর্ড — <code>{"items": ..., "total": ...}</code> — বাড়তে থাকা sales history-তে যোগ করে, যা প্রতিটা বিক্রির পর JSON-এ সেভ হয়।</li></ol><p><b>ট্রেস:</b> কার্ট <code>["Pen", "Notebook"]</code>, <code>products = {"Pen": 10, "Notebook": 40}</code> সহ → total 50, একটা sale রেকর্ড যোগ হয়ে সেভ হয়।</p>`,
    example: '1. Browse  2. Add to Cart  3. Checkout  4. Exit\nCheckout total: ₹450\nSale recorded.',
    concepts: ['functions + dictionaries + JSON', 'combining projects 1–9'],
    solution: `
import json

def load_sales():
    try:
        with open("sales.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_sales(sales):
    with open("sales.json", "w") as file:
        json.dump(sales, file, indent=4)

products = {"Pen": 10, "Notebook": 40, "Eraser": 5}
cart = []
sales = load_sales()

def checkout(cart):
    total = sum(products[item] for item in cart)
    sales.append({"items": cart, "total": total})
    save_sales(sales)
    print("Checkout total:", total)
    print("Sale recorded.")`,
    noteEn: 'This is deliberately a combination, not a new idea — dictionaries for products, a list for the cart, and the same load/save JSON pattern from the Expense Tracker, all in one program.',
    noteBn: 'এটা ইচ্ছাকৃতভাবে একটা কম্বিনেশন, নতুন কোনো আইডিয়া না — প্রোডাক্টের জন্য dictionary, কার্টের জন্য list, আর Expense Tracker-এর একই load/save JSON প্যাটার্ন, সব একসাথে একটা প্রোগ্রামে।',
  },
]

const GUI = [
  {
    title: 'GUI Calculator',
    taskEn: 'The Simple Calculator from Level 1, rebuilt with buttons and text boxes using Tkinter instead of input() / print().',
    taskBn: 'Level 1-এর Simple Calculator, Tkinter দিয়ে বাটন আর টেক্সট বক্স সহ নতুন করে বানানো, input()/print()-এর বদলে।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>Every Tkinter app needs exactly one <code>tk.Tk()</code> — the root window — and one call to <code>root.mainloop()</code> at the very end, which is what keeps the window open and listening for clicks instead of closing immediately.</li><li>Widgets like <code>Entry</code> and <code>Button</code> are created, then placed with <code>.pack()</code> — creating a widget and placing it are two separate steps.</li><li><code>command=calculate</code> on the button means: call this function when clicked — no manual event-listener wiring needed, Tkinter does it through the <code>command</code> argument.</li></ol><p><b>Trace:</b> typing <code>25+8</code> into the entry and clicking <code>=</code> calls <code>calculate()</code>, which evaluates the text and shows 33.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li>প্রতিটা Tkinter অ্যাপে ঠিক একটা <code>tk.Tk()</code> লাগে — root window — আর একদম শেষে একবার <code>root.mainloop()</code> ডাকতে হয়, যা উইন্ডোটাকে খোলা রাখে আর ক্লিকের জন্য অপেক্ষা করায়, সাথে সাথে বন্ধ না করে।</li><li><code>Entry</code> আর <code>Button</code>-এর মতো widget আগে তৈরি হয়, তারপর <code>.pack()</code> দিয়ে জায়গামতো বসানো হয় — widget বানানো আর জায়গায় বসানো দুটো আলাদা ধাপ।</li><li>বাটনে <code>command=calculate</code> মানে: ক্লিক করলে এই function ডাকো — হাতে করে কোনো event-listener জোড়া লাগানোর দরকার নেই, Tkinter <code>command</code> argument দিয়ে এটা করে দেয়।</li></ol><p><b>ট্রেস:</b> entry-তে <code>25+8</code> টাইপ করে <code>=</code>-এ ক্লিক করলে <code>calculate()</code> ডাকা হয়, যা টেক্সটটা হিসেব করে 33 দেখায়।</p>`,
    example: '[ Entry: 25+8 ]\n[ = ]\nResult: 33',
    concepts: ['tkinter.Tk()', 'Entry', 'Button', 'command=', 'mainloop()'],
    solution: `
import tkinter as tk

def calculate():
    try:
        result_var.set(str(eval(entry.get())))
    except Exception:
        result_var.set("Error")

root = tk.Tk()
root.title("Calculator")

entry = tk.Entry(root, font=("Arial", 18))
entry.pack(fill="x", padx=10, pady=10)

result_var = tk.StringVar()
tk.Label(root, textvariable=result_var, font=("Arial", 14)).pack()

tk.Button(root, text="=", command=calculate).pack(pady=5)

root.mainloop()`,
    noteEn: "`root.mainloop()` is what keeps a GUI program running and listening for clicks — without it, the window would flash and close immediately, the same way a console program without a `while True` menu just ends after one pass.",
    noteBn: '`root.mainloop()` GUI প্রোগ্রামটাকে চালু আর ক্লিকের জন্য অপেক্ষারত রাখে — এটা না থাকলে উইন্ডোটা এক ঝলক দেখিয়েই বন্ধ হয়ে যেত, ঠিক যেমন `while True` মেনু ছাড়া একটা কনসোল প্রোগ্রাম এক পাক ঘুরেই শেষ হয়ে যায়।',
  },
  {
    title: 'GUI Temperature Converter',
    taskEn: "A window that converts a temperature between Celsius and Fahrenheit as the user types, with no separate 'convert' click needed.",
    taskBn: "একটি উইন্ডো যা ব্যবহারকারী টাইপ করার সাথে সাথে Celsius আর Fahrenheit-এর মধ্যে তাপমাত্রা কনভার্ট করে, আলাদা কোনো 'convert' বাটনে ক্লিক ছাড়াই।",
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>celsius.trace_add("write", convert)</code> makes <code>convert()</code> run automatically every time the Celsius field's text changes — this is what "event-driven" means: code that reacts to something happening, instead of running once from top to bottom.</li><li>The conversion itself is the plain formula <code>fahrenheit = celsius * 9 / 5 + 32</code> — nothing new there; what's new is when it runs.</li></ol><p><b>Trace:</b> typing "100" into Celsius fires <code>convert()</code> on every keystroke, and once the full number lands, Fahrenheit shows 212.0.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>celsius.trace_add("write", convert)</code> Celsius ফিল্ডের টেক্সট বদলালেই স্বয়ংক্রিয়ভাবে <code>convert()</code> চালায় — এটাই "event-driven" মানে: কিছু ঘটলে তার প্রতিক্রিয়ায় চলা কোড, উপর থেকে নিচে একবার চলার বদলে।</li><li>কনভার্শনটা নিজেই সাধারণ ফর্মুলা <code>fahrenheit = celsius * 9 / 5 + 32</code> — এখানে নতুন কিছু নেই; নতুন যেটা তা হলো এটা কখন চলে।</li></ol><p><b>ট্রেস:</b> Celsius-এ "100" টাইপ করলে প্রতিটা কী-প্রেসে <code>convert()</code> চলে, আর পুরো সংখ্যা টাইপ হয়ে গেলে Fahrenheit দেখায় 212.0।</p>`,
    example: 'Celsius: [ 100 ]  →  Fahrenheit: [ 212.0 ]',
    concepts: ['Entry', 'StringVar', 'trace_add on keystroke', 'formula in a function'],
    solution: `
import tkinter as tk

def convert(*args):
    try:
        c = float(celsius.get())
        fahrenheit_var.set(f"{c * 9 / 5 + 32:.1f}")
    except ValueError:
        fahrenheit_var.set("")

root = tk.Tk()
root.title("Temperature Converter")

celsius = tk.StringVar()
celsius.trace_add("write", convert)
fahrenheit_var = tk.StringVar()

tk.Label(root, text="Celsius").grid(row=0, column=0)
tk.Entry(root, textvariable=celsius).grid(row=0, column=1)
tk.Label(root, text="Fahrenheit").grid(row=1, column=0)
tk.Label(root, textvariable=fahrenheit_var).grid(row=1, column=1)

root.mainloop()`,
    noteEn: '`celsius.trace_add("write", convert)` runs `convert()` automatically every time the text changes — this is what "event-driven" means: code that reacts to something happening, instead of running top to bottom once.',
    noteBn: '`celsius.trace_add("write", convert)` টেক্সট বদলালেই স্বয়ংক্রিয়ভাবে `convert()` চালায় — এটাই "event-driven" মানে: কিছু ঘটলে তার প্রতিক্রিয়ায় চলা কোড, উপর থেকে নিচে একবার চলার বদলে।',
  },
  {
    title: 'GUI Invoice and Billing System',
    taskEn: 'A small billing window: pick items and quantities, add them to a bill list shown in the window, and show a running total.',
    taskBn: 'একটি ছোট বিলিং উইন্ডো: item আর quantity বেছে নিন, উইন্ডোতে দেখানো একটা বিল লিস্টে যোগ করুন, আর চলমান মোট দেখান।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>global total</code> is required because <code>add_item()</code> changes a variable that was created outside any function — the same rule first met in the Bank Account Simulator, just inside a button's callback instead of a menu function.</li><li><code>bill_list.insert("end", ...)</code> adds one line to a <code>Listbox</code> widget every time Add is clicked, building up a visible running record without redrawing the whole window.</li></ol><p><b>Trace:</b> picking "Notebook" at quantity 3 and clicking Add computes <code>40 * 3 = 120</code>, appends "Notebook x3 - ₹120" to the list, and updates the total label to ₹120.</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>global total</code> এখানে দরকার কারণ <code>add_item()</code> কোনো function-এর বাইরে তৈরি হওয়া একটা ভ্যারিয়েবল বদলাচ্ছে — Bank Account Simulator-এ প্রথম দেখা একই নিয়ম, শুধু এবার একটা মেনু function-এর বদলে বাটনের callback-এর ভেতরে।</li><li>Add-এ ক্লিক করলেই <code>bill_list.insert("end", ...)</code> একটা <code>Listbox</code> widget-এ এক লাইন যোগ করে, পুরো উইন্ডো আবার আঁকা ছাড়াই একটা দেখা-যাওয়া চলমান রেকর্ড তৈরি করে।</li></ol><p><b>ট্রেস:</b> "Notebook" আর quantity 3 বেছে Add-এ ক্লিক করলে <code>40 * 3 = 120</code> হিসেব হয়, লিস্টে "Notebook x3 - ₹120" যোগ হয়, আর total লেবেল হয়ে যায় ₹120।</p>`,
    example: 'Item: [Notebook v]  Qty: [3]  [Add]\n\nNotebook x3 - ₹120\nTotal: ₹120',
    concepts: ['Listbox', 'Entry + Button + Listbox together', 'updating a running total label'],
    solution: `
import tkinter as tk

PRICES = {"Notebook": 40, "Pen": 10, "Eraser": 5}
total = 0

def add_item():
    global total
    item = item_var.get()
    qty = int(qty_entry.get())
    cost = PRICES[item] * qty
    total += cost
    bill_list.insert("end", f"{item} x{qty} - ₹{cost}")
    total_var.set(f"Total: ₹{total}")

root = tk.Tk()
root.title("Billing")

item_var = tk.StringVar(value="Notebook")
tk.OptionMenu(root, item_var, *PRICES.keys()).pack()
qty_entry = tk.Entry(root)
qty_entry.pack()
tk.Button(root, text="Add", command=add_item).pack()

bill_list = tk.Listbox(root)
bill_list.pack(fill="both", expand=True)

total_var = tk.StringVar(value="Total: ₹0")
tk.Label(root, textvariable=total_var).pack()

root.mainloop()`,
    noteEn: "`global total` is needed here because `add_item()` changes a variable created outside any function — the same rule you first met in the Bank Account Simulator, just inside a GUI callback instead of a menu function.",
    noteBn: '`global total` এখানে দরকার কারণ `add_item()` কোনো function-এর বাইরে তৈরি হওয়া একটা ভ্যারিয়েবল বদলাচ্ছে — একই নিয়ম যা Bank Account Simulator-এ প্রথম দেখেছিলেন, শুধু এবার একটা মেনু function-এর বদলে GUI callback-এর ভেতরে।',
  },
]

const OOP = [
  {
    title: 'Bank Account Management System',
    taskEn: 'Rebuild the Bank Account Simulator as a class — the account and its behavior (deposit, withdraw, balance) live together in one object instead of a loose balance variable and separate functions.',
    taskBn: 'Bank Account Simulator-কে class হিসেবে নতুন করে বানান — account আর তার আচরণ (deposit, withdraw, balance) একসাথে একটা object-এ থাকে, আলাদা balance ভ্যারিয়েবল আর function-এর বদলে।',
    explanationEn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>class BankAccount</code> bundles data (<code>owner</code>, <code>balance</code>) and behavior (<code>deposit</code>, <code>withdraw</code>, <code>show_balance</code>) into one definition — a blueprint for creating account objects.</li><li><code>__init__</code> runs once, automatically, when <code>BankAccount(...)</code> is called — it's where <code>self.owner</code> and <code>self.balance</code> get their starting values.</li><li><code>self</code> is how a method reaches the specific object it was called on — <code>self.balance</code> inside <code>withdraw()</code> means "this account's balance," not some balance floating outside the class.</li><li>Compare <code>acc.deposit(500)</code> to Level 2's <code>balance = deposit(balance)</code> — the account now carries its own data with it, so there's no passing balance in and getting a new one back; the method just updates <code>self.balance</code> directly.</li></ol><p><b>Trace:</b> <code>acc = BankAccount("Rahul", 1000)</code>, <code>acc.deposit(500)</code> sets <code>self.balance</code> to 1500 on that specific object, so <code>acc.show_balance()</code> prints "Rahul's balance: 1500".</p>`,
    explanationBn: `<ol style="list-style:decimal;padding-left:1.25rem;margin:0;display:flex;flex-direction:column;gap:0.5rem"><li><code>class BankAccount</code> ডেটা (<code>owner</code>, <code>balance</code>) আর আচরণ (<code>deposit</code>, <code>withdraw</code>, <code>show_balance</code>) একসাথে একটা definition-এ বেঁধে ফেলে — account object তৈরি করার একটা ব্লুপ্রিন্ট।</li><li><code>BankAccount(...)</code> ডাকা হলে <code>__init__</code> একবার, স্বয়ংক্রিয়ভাবে চলে — এখানেই <code>self.owner</code> আর <code>self.balance</code> শুরুর মান পায়।</li><li>কোন নির্দিষ্ট object-এ একটা method কাজ করছে তা <code>self</code> দিয়েই বোঝা যায় — <code>withdraw()</code>-এর ভেতরে <code>self.balance</code> মানে "এই account-এর balance," class-এর বাইরে ভাসমান কোনো balance না।</li><li><code>acc.deposit(500)</code>-কে Level 2-এর <code>balance = deposit(balance)</code>-এর সাথে তুলনা করুন — account এখন নিজের ডেটা নিজের সাথেই বহন করে, তাই balance ভেতরে পাঠিয়ে নতুন একটা ফেরত নেওয়ার দরকার নেই; method সরাসরি <code>self.balance</code> আপডেট করে দেয়।</li></ol><p><b>ট্রেস:</b> <code>acc = BankAccount("Rahul", 1000)</code>, <code>acc.deposit(500)</code> সেই নির্দিষ্ট object-এ <code>self.balance</code> 1500 করে দেয়, তাই <code>acc.show_balance()</code> প্রিন্ট করে "Rahul's balance: 1500"।</p>`,
    example: 'acc = BankAccount("Rahul", 1000)\nacc.deposit(500)\nacc.show_balance()\n\nRahul\'s balance: 1500',
    concepts: ['class', '__init__', 'self', 'methods', 'object instances'],
    solution: `
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print("Deposit successful!")

    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            print("Withdrawal successful!")
        else:
            print("Insufficient balance!")

    def show_balance(self):
        print(f"{self.owner}'s balance: {self.balance}")

acc = BankAccount("Rahul", 1000)
acc.deposit(500)
acc.withdraw(200)
acc.show_balance()`,
    noteEn: "Compare this to the function-based version from Level 2: `self.balance` replaces passing `balance` in and out of every function — the account now carries its own data with it. That's the whole idea behind a class.",
    noteBn: 'Level 2-এর function-ভিত্তিক ভার্সনের সাথে তুলনা করুন: `self.balance` প্রতিটা function-এ `balance` ভেতরে-বাইরে পাঠানোর জায়গা নিয়ে নেয় — account এখন নিজের ডেটা নিজের সাথেই বহন করে। এটাই class-এর মূল আইডিয়া।',
  },
]

// ── Assemble the page ───────────────────────────────────────────────────

async function buildBlocks(locale) {
  const introEn = '<p>24 hands-on projects, grouped into the four levels below. Each project has a short brief and an example — try building it yourself first, then open <b>Show solution</b> to check your approach. There\'s no in-browser runner here: write and run these in your own editor (VS Code, IDLE, or similar), the same as any real Python program.</p>'
  const introBn = '<p>নিচে চারটি ধাপে সাজানো ২৪টি হাতে-কলমে প্রজেক্ট আছে। প্রতিটি প্রজেক্টে একটি ছোট ব্রিফ আর উদাহরণ দেওয়া আছে — নিজে বানানোর চেষ্টা করুন, তারপর নিজের অ্যাপ্রোচ মিলিয়ে দেখতে <b>সমাধান দেখুন</b>-এ ক্লিক করুন। এখানে ব্রাউজারে রান করার সুবিধা নেই — নিজের এডিটরে (VS Code, IDLE, বা এরকম কিছু) লিখে রান করুন, ঠিক যেমন যেকোনো বাস্তব Python প্রোগ্রাম করবেন।</p>'

  const levels = [
    { titleEn: 'Level 1 — Beginner', titleBn: 'লেভেল ১ — শুরুর স্তর', anchor: 'level-1-beginner',
      introEn: 'Console programs using variables, input/output, conditions, loops, and lists — no functions yet.',
      introBn: 'ভ্যারিয়েবল, input/output, condition, loop, আর list ব্যবহার করে কনসোল প্রোগ্রাম — এখনও function নেই।',
      projects: BEGINNER },
    { titleEn: 'Level 2 — Intermediate', titleBn: 'লেভেল ২ — ইন্টারমিডিয়েট', anchor: 'level-2-intermediate',
      introEn: 'Adds functions, dictionaries, and file storage (JSON) — these projects remember data between runs.',
      introBn: 'function, dictionary, আর ফাইলে (JSON) সেভ করা যোগ হচ্ছে — এই প্রজেক্টগুলো রান শেষ হওয়ার পরও ডেটা মনে রাখে।',
      projects: INTERMEDIATE },
    { titleEn: 'Level 3 — GUI Development (Tkinter)', titleBn: 'লেভেল ৩ — GUI ডেভেলপমেন্ট (Tkinter)', anchor: 'level-3-gui-development-tkinter',
      introEn: "Graphical programs using Tkinter, Python's built-in GUI toolkit — buttons, text boxes, and windows instead of console text.",
      introBn: 'Python-এর বিল্ট-ইন GUI টুলকিট Tkinter দিয়ে গ্রাফিক্যাল প্রোগ্রাম — কনসোল টেক্সটের বদলে বাটন, টেক্সট বক্স, আর উইন্ডো।',
      projects: GUI },
    { titleEn: 'Level 4 — Object-Oriented Programming', titleBn: 'লেভেল ৪ — অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং', anchor: 'level-4-object-oriented-programming',
      introEn: 'Your first Object-Oriented Python project — organizing a program around a class instead of loose functions and variables.',
      introBn: 'আপনার প্রথম Object-Oriented Python প্রজেক্ট — আলাদা function আর ভ্যারিয়েবলের বদলে একটি class-কে কেন্দ্র করে প্রোগ্রাম সাজানো।',
      projects: OOP },
  ]

  const closingEn = '<p>Once these feel comfortable without copying the solution, the <a href="/python/where-to-go-next/">Where to Go Next</a> lesson covers virtual environments, pip, and which framework or library to look at first.</p>'
  const closingBn = '<p>সমাধান না দেখে এগুলো সহজ মনে হলে, <a href="/bn/python/where-to-go-next/">এরপর কোথায় যাবেন</a> পাঠে virtual environment, pip, আর প্রথমে কোন framework বা library দেখা উচিত তা নিয়ে আলোচনা আছে।</p>'

  const blocks = [p(locale === 'en' ? introEn : introBn)]

  for (const level of levels) {
    blocks.push(h(2, locale === 'en' ? level.titleEn : level.titleBn, level.anchor))
    blocks.push(p(locale === 'en' ? level.introEn : level.introBn))
    blocks.push(p(await levelHtml(level.projects, locale)))
  }

  blocks.push(p(locale === 'en' ? closingEn : closingBn))

  return blocks
}

const enBlocks = await buildBlocks('en')
const bnBlocks = await buildBlocks('bn')

const doc = {
  slug: 'practice-projects',
  sortOrder: 29,
  en: {
    title: 'Python Practice Projects',
    metaTitle: 'Python Practice Projects | Learn Computer Academy',
    metaDescription: '24 hands-on Python projects across four levels — beginner console programs, intermediate apps with files and JSON, Tkinter GUIs, and your first OOP project — each with a brief and a solution to check your work against.',
    blocks: enBlocks,
  },
  bn: {
    title: 'Python অনুশীলন প্রজেক্ট',
    metaTitle: 'Python অনুশীলন প্রজেক্ট | Learn Computer Academy',
    metaDescription: 'চারটি ধাপে ২৪টি হাতে-কলমে Python প্রজেক্ট — বিগিনার কনসোল প্রোগ্রাম থেকে ফাইল ও JSON সহ ইন্টারমিডিয়েট অ্যাপ, Tkinter GUI, আর প্রথম OOP প্রজেক্ট — প্রতিটির সাথে একটি ব্রিফ আর নিজের কাজ মিলিয়ে দেখার জন্য একটি সমাধান।',
    blocks: bnBlocks,
  },
}

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'python').single()
  if (catErr || !category) {
    console.error('Category "python" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`python/${doc.slug} — ${doc.en.title} (${doc.en.blocks.length} blocks, sort_order ${doc.sortOrder})`)

  if (DRY_RUN) {
    console.log('\n[dry-run] no writes made.')
    return
  }

  const path = `python/${doc.slug}`
  const row = {
    category_id: category.id,
    slug: doc.slug,
    path,
    old_path: null,
    title: doc.en.title,
    meta_title: doc.en.metaTitle,
    meta_description: doc.en.metaDescription,
    blocks: doc.en.blocks,
    toc: toc(doc.en.blocks),
    status: 'published',
    sort_order: doc.sortOrder,
    published_at: new Date().toISOString(),
  }

  const { data: existing } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
  let docId = existing?.id
  if (docId) {
    const { error: docErr } = await supabase.from('docs').update(row).eq('id', docId)
    if (docErr) { console.error('Failed (en update):', docErr.message); process.exit(1) }
  } else {
    const { data: inserted, error: docErr } = await supabase.from('docs').insert(row).select('id').single()
    if (docErr) { console.error('Failed (en insert):', docErr.message); process.exit(1) }
    docId = inserted.id
  }
  console.log(`  ✓ en  ${path}`)

  const trRow = {
    doc_id: docId,
    locale: 'bn',
    title: doc.bn.title,
    meta_title: doc.bn.metaTitle,
    meta_description: doc.bn.metaDescription,
    blocks: doc.bn.blocks,
    toc: toc(doc.bn.blocks),
  }
  const { data: existingTr } = await supabase.from('doc_translations').select('doc_id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
  const { error: trErr } = existingTr
    ? await supabase.from('doc_translations').update(trRow).eq('doc_id', docId).eq('locale', 'bn')
    : await supabase.from('doc_translations').insert(trRow)
  if (trErr) { console.error('Failed (bn):', trErr.message); process.exit(1) }
  console.log(`  ✓ bn  ${path}`)

  console.log('\n✅ Done.')
}

// Shiki's WASM engine holds the process open until its highlighter instance
// is disposed — dispose() first, then let the process exit naturally.
// (A bare process.exit() here races Shiki's own WASM teardown on Windows
// and crashes with a libuv assertion — confirmed live.)
main()
  .then(async () => { (await getHighlighter()).dispose() })
  .catch(err => { console.error(err); process.exit(1) })
