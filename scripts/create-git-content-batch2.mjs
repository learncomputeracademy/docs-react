#!/usr/bin/env node
// Extends the "Git & GitHub" category (20 lessons, scripts/create-git-content.mjs)
// with 5 more lessons, found by checking a second, more detailed roadmap.sh
// "Git and GitHub" PDF the user shared right after the first batch shipped
// ("also use this as your guide"). Real gaps against that fuller roadmap:
// HEAD/detached HEAD (referenced constantly via the <<<<<<< HEAD conflict
// marker, never explained), cherry-picking, git commit --amend, tagging &
// GitHub Releases, adding collaborators, and GitHub Pages (ties directly to
// the Hosting & Deployment course). Everything else on that fuller PDF
// (hooks, reflog, bisect, worktree, LFS, submodules, GitHub CLI, Actions/
// CI-CD, REST/GraphQL API, webhooks, Copilot/Codespaces/Sponsors/Classroom,
// Organizations/Teams) matches that PDF's own "Advanced Git Topics" tier —
// same boundary already used across every gap batch today, left out.
//
// User picked "build all 5" over AskUserQuestion.
//
// Inserted before git/where-this-leaves-you (bumped to the new end), same
// "keep the closer last" pattern as every other new-lesson batch today.
//
// Usage: node scripts/create-git-content-batch2.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, source) { return { id: nanoid(12), type: 'code', language, code: source, runnable: false } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

const lessons = []
let n = 21

// ═══ 1. HEAD AND DETACHED HEAD ═════════════════════════════════════════════

lessons.push({
  slug: 'head-and-detached-head', sortOrder: n++,
  en: {
    title: 'HEAD and Detached HEAD',
    metaTitle: 'Git HEAD and Detached HEAD | Learn Computer Academy',
    metaDescription: 'What HEAD actually points to — the concept behind the conflict markers, resets, and checkouts from earlier lessons — and what "detached HEAD" means.',
    blocks: [
      p('<p><code>HEAD</code> has appeared several times already — the earlier Merge Conflicts lesson\'s <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> marker, and <code>git reset --soft HEAD~1</code> from Undoing Changes. This lesson explains what it actually is.</p>'),
      h(2, 'HEAD Is a Pointer to "Right Now"'),
      p('<p><code>HEAD</code> points to whatever commit is currently checked out — normally, that means it points to the tip of the current branch, which itself points to the latest commit.</p>'),
      code('bash', 'cat .git/HEAD\n# ref: refs/heads/main\n\n# HEAD -> main -> the latest commit on main'),
      h(2, 'Referring to Commits Relative to HEAD'),
      table(['Reference', 'Means'], [
        ['HEAD', 'The current commit'],
        ['HEAD~1', 'One commit before HEAD'],
        ['HEAD~3', 'Three commits before HEAD'],
        ['HEAD^', 'The direct parent of HEAD — equivalent to HEAD~1 for a normal commit'],
      ]),
      h(2, 'Detached HEAD — Checking Out a Specific Commit'),
      p('<p>Normally HEAD points to a branch. Checking out a specific commit directly (rather than a branch name) detaches HEAD from any branch — it now points straight at that one commit instead.</p>'),
      code('bash', 'git checkout a1b2c3d\n# Note: switching to \'a1b2c3d\'.\n# You are in \'detached HEAD\' state...'),
      h(2, 'Why This Matters'),
      p('<p>Looking around in detached HEAD state — checking old file contents, testing something — is completely safe. The risk is committing new changes while detached: those commits exist, but aren\'t on any branch, and become genuinely hard to find again once something else is checked out.</p>'),
      callout('warning', '<p>A commit made in detached HEAD state, with no branch pointing to it, can effectively be lost once HEAD moves elsewhere — Git eventually garbage-collects commits nothing references. To keep work made in this state, create a branch from it before switching away.</p>', 'The real risk of detached HEAD'),
      h(2, 'Getting Back to Safety'),
      code('bash', '# If changes made in detached HEAD are worth keeping, save them to a branch first:\ngit switch -c rescue-branch\n\n# Otherwise, just return to a normal branch:\ngit switch main'),
    ],
  },
  bn: {
    title: 'HEAD ও Detached HEAD',
    metaTitle: 'Git HEAD ও Detached HEAD | Learn Computer Academy',
    metaDescription: 'HEAD আসলে কী point করে — আগের lesson-এর conflict marker, reset, আর checkout-এর পেছনের ধারণা — আর "detached HEAD" মানে কী।',
    blocks: [
      p('<p><code>HEAD</code> ইতিমধ্যে বেশ কয়েকবার এসেছে — আগের Merge Conflicts lesson-এর <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> marker, আর Undoing Changes থেকে <code>git reset --soft HEAD~1</code>। এই lesson ব্যাখ্যা করে এটা আসলে কী।</p>'),
      h(2, 'HEAD "এখন" নির্দেশ করা একটা Pointer', 'head-এখন-নির্দেশ-করা-একটা-pointer'),
      p('<p><code>HEAD</code> বর্তমানে checkout করা যে কোনো commit নির্দেশ করে — সাধারণত, মানে এটা বর্তমান branch-এর tip নির্দেশ করে, যা নিজে সবচেয়ে সাম্প্রতিক commit নির্দেশ করে।</p>'),
      code('bash', 'cat .git/HEAD\n# ref: refs/heads/main\n\n# HEAD -> main -> main-এর সবচেয়ে সাম্প্রতিক commit'),
      h(2, 'HEAD-এর Relative Commit Refer করা', 'head-এর-relative-commit-refer-করা'),
      table(['Reference', 'মানে'], [
        ['HEAD', 'বর্তমান commit'],
        ['HEAD~1', 'HEAD-এর একটা commit আগে'],
        ['HEAD~3', 'HEAD-এর তিনটা commit আগে'],
        ['HEAD^', 'HEAD-এর সরাসরি parent — একটা সাধারণ commit-এর জন্য HEAD~1-এর সমতুল্য'],
      ]),
      h(2, 'Detached HEAD — একটা নির্দিষ্ট Commit Checkout করা', 'detached-head-একটা-নির্দিষ্ট-commit-checkout-করা'),
      p('<p>সাধারণত HEAD একটা branch নির্দেশ করে। একটা branch নামের বদলে সরাসরি একটা নির্দিষ্ট commit checkout করলে HEAD যেকোনো branch থেকে detach হয়ে যায় — এটা এখন সরাসরি সেই একটা commit নির্দেশ করে।</p>'),
      code('bash', 'git checkout a1b2c3d\n# Note: switching to \'a1b2c3d\'.\n# You are in \'detached HEAD\' state...'),
      h(2, 'কেন এটা গুরুত্বপূর্ণ', 'কেন-এটা-গুরুত্বপূর্ণ'),
      p('<p>Detached HEAD state-এ চারপাশে দেখা — পুরনো file content check করা, কিছু test করা — সম্পূর্ণ নিরাপদ। ঝুঁকিটা detached অবস্থায় নতুন পরিবর্তন commit করায়: সেই commit-গুলো থাকে, কিন্তু কোনো branch-এ না, আর অন্য কিছু checkout হয়ে গেলে আবার খুঁজে পাওয়া সত্যিকারভাবে কঠিন হয়ে যায়।</p>'),
      callout('warning', '<p>Detached HEAD state-এ করা একটা commit, কোনো branch এটা নির্দেশ না করলে, HEAD অন্য কোথাও move করলে কার্যকরভাবে হারিয়ে যেতে পারে — Git শেষ পর্যন্ত কিছু reference করে না এমন commit garbage-collect করে। এই state-এ করা কাজ রাখতে, সরে যাওয়ার আগে এটা থেকে একটা branch তৈরি করুন।</p>', 'Detached HEAD-এর আসল ঝুঁকি'),
      h(2, 'নিরাপত্তায় ফিরে যাওয়া', 'নিরাপত্তায়-ফিরে-যাওয়া'),
      code('bash', '# detached HEAD-এ করা পরিবর্তন রাখার যোগ্য হলে, আগে একটা branch-এ save করুন:\ngit switch -c rescue-branch\n\n# না হলে, শুধু একটা সাধারণ branch-এ ফিরে যান:\ngit switch main'),
    ],
  },
})

// ═══ 2. CHERRY-PICKING AND AMENDING ═══════════════════════════════════════

lessons.push({
  slug: 'cherry-picking-and-amending', sortOrder: n++,
  en: {
    title: 'Cherry-Picking and Amending Commits',
    metaTitle: 'Git Cherry-Pick and Commit --amend | Learn Computer Academy',
    metaDescription: 'Copying one specific commit onto another branch, and fixing the very last commit\'s message or contents without creating a new one.',
    blocks: [
      p('<p>Two small, frequently useful commands for handling commits individually, rather than through a full merge or rebase.</p>'),
      h(2, 'git cherry-pick — Copying One Specific Commit'),
      p('<p>Applies a single commit from anywhere in the project\'s history onto the current branch — useful when exactly one fix or change is needed from another branch, not everything on it.</p>'),
      code('bash', 'git switch main\ngit cherry-pick a1b2c3d\n# Applies commit a1b2c3d\'s exact changes as a new commit on main'),
      p('<p>A real use: a bug fix committed on a feature branch also needs to go out immediately on main, without merging the feature branch\'s unfinished work along with it.</p>'),
      h(2, 'Cherry-Pick Conflicts'),
      p('<p>Just like a merge, a cherry-pick can conflict if the target branch has diverged too much — resolved exactly the same way as the earlier Merge Conflicts lesson: edit the file, remove the markers, then continue.</p>'),
      code('bash', '# After resolving conflict markers in the affected files:\ngit add .\ngit cherry-pick --continue\n\n# Or abandon the cherry-pick entirely:\ngit cherry-pick --abort'),
      h(2, 'git commit --amend — Fixing the Last Commit'),
      p('<p>Rather than creating a new commit for a typo or a forgotten file, <code>--amend</code> folds a change into the most recent commit instead.</p>'),
      code('bash', '# Fix just the commit message\ngit commit --amend -m "Corrected commit message"\n\n# Add a forgotten file to the last commit, keeping the same message\ngit add forgotten-file.txt\ngit commit --amend --no-edit'),
      callout('danger', '<p>--amend rewrites the last commit entirely — it gets a new hash. Exactly the same rule as reset and rebase from earlier lessons: never amend a commit that\'s already been pushed and possibly pulled by someone else.</p>', 'The same shared-history rule applies here'),
      table(['Command', 'Use for'], [
        ['git cherry-pick <hash>', 'Copying one specific commit onto the current branch'],
        ['git commit --amend', 'Fixing the message or contents of the most recent, not-yet-shared commit'],
      ]),
    ],
  },
  bn: {
    title: 'Cherry-Pick ও Commit Amend করা',
    metaTitle: 'Git Cherry-Pick ও Commit --amend | Learn Computer Academy',
    metaDescription: 'একটা নির্দিষ্ট commit অন্য একটা branch-এ copy করা, আর নতুন একটা তৈরি না করেই একদম শেষ commit-এর message বা content ঠিক করা।',
    blocks: [
      p('<p>পুরো merge বা rebase-এর বদলে, আলাদাভাবে commit handle করার জন্য দুটো ছোট, প্রায়ই useful command।</p>'),
      h(2, 'git cherry-pick — একটা নির্দিষ্ট Commit Copy করা', 'git-cherry-pick-একটা-নির্দিষ্ট-commit-copy-করা'),
      p('<p>Project history-র যেকোনো জায়গা থেকে একটা একক commit বর্তমান branch-এ apply করে — অন্য branch থেকে ঠিক একটা fix বা পরিবর্তন দরকার হলে useful, এতে থাকা সবকিছু না।</p>'),
      code('bash', 'git switch main\ngit cherry-pick a1b2c3d\n# commit a1b2c3d-এর ঠিক পরিবর্তন main-এ একটা নতুন commit হিসেবে apply করে'),
      p('<p>একটা আসল ব্যবহার: একটা feature branch-এ commit করা একটা bug fix তার সাথে feature branch-এর অসম্পূর্ণ কাজ merge না করেই অবিলম্বে main-এও যেতে হবে।</p>'),
      h(2, 'Cherry-Pick Conflict'),
      p('<p>একটা merge-এর মতোই, target branch খুব বেশি diverge করলে একটা cherry-pick conflict করতে পারে — আগের Merge Conflicts lesson-এর ঠিক একই উপায়ে সমাধান করা: file edit করুন, marker সরান, তারপর continue করুন।</p>'),
      code('bash', '# প্রভাবিত file-এ conflict marker সমাধান করার পর:\ngit add .\ngit cherry-pick --continue\n\n# বা সম্পূর্ণভাবে cherry-pick ছেড়ে দিন:\ngit cherry-pick --abort'),
      h(2, 'git commit --amend — শেষ Commit ঠিক করা', 'git-commit-amend-শেষ-commit-ঠিক-করা'),
      p('<p>একটা typo বা ভুলে যাওয়া file-এর জন্য একটা নতুন commit তৈরি করার বদলে, <code>--amend</code> এর বদলে একটা পরিবর্তন সবচেয়ে সাম্প্রতিক commit-এ ভাঁজ করে।</p>'),
      code('bash', '# শুধু commit message ঠিক করুন\ngit commit --amend -m "Corrected commit message"\n\n# শেষ commit-এ একটা ভুলে যাওয়া file যোগ করুন, একই message রেখে\ngit add forgotten-file.txt\ngit commit --amend --no-edit'),
      callout('danger', '<p>--amend শেষ commit সম্পূর্ণভাবে পুনর্লিখন করে — এটা একটা নতুন hash পায়। আগের lesson থেকে reset আর rebase-এর ঠিক একই নিয়ম: ইতিমধ্যে push হয়ে হয়তো অন্য কেউ pull করেছে এমন একটা commit কখনো amend করবেন না।</p>', 'একই shared-history নিয়ম এখানেও প্রযোজ্য'),
      table(['Command', 'যার জন্য ব্যবহার'], [
        ['git cherry-pick <hash>', 'বর্তমান branch-এ একটা নির্দিষ্ট commit copy করা'],
        ['git commit --amend', 'সবচেয়ে সাম্প্রতিক, এখনো-শেয়ার-না-করা commit-এর message বা content ঠিক করা'],
      ]),
    ],
  },
})

// ═══ 3. TAGGING AND GITHUB RELEASES ═══════════════════════════════════════

lessons.push({
  slug: 'tagging-and-releases', sortOrder: n++,
  en: {
    title: 'Tagging and GitHub Releases',
    metaTitle: 'Git Tagging and GitHub Releases | Learn Computer Academy',
    metaDescription: 'Marking a specific commit as a version — v1.0.0 — with a Git tag, and turning that into a downloadable GitHub Release with notes.',
    blocks: [
      p('<p>A <b>tag</b> marks one specific commit permanently — most commonly to record a release version, so "v1.0.0" always points to the exact commit that was actually shipped.</p>'),
      h(2, 'Creating a Tag'),
      code('bash', '# A lightweight tag — just a name pointing to a commit\ngit tag v1.0.0\n\n# An annotated tag — includes a message, author, and date (recommended for releases)\ngit tag -a v1.0.0 -m "First stable release"'),
      h(2, 'Listing and Viewing Tags'),
      code('bash', 'git tag\n# v1.0.0\n\ngit show v1.0.0\n# Shows the tag\'s message and the commit it points to'),
      h(2, 'Pushing Tags'),
      p('<p>Tags aren\'t included in a normal <code>git push</code> — they need to be pushed explicitly.</p>'),
      code('bash', 'git push origin v1.0.0\n\n# Push every tag at once\ngit push origin --tags'),
      h(2, 'Checking Out a Tag'),
      code('bash', 'git checkout v1.0.0\n# Same detached HEAD situation as checking out any specific commit —\n# from the earlier HEAD lesson'),
      h(2, 'Turning a Tag into a GitHub Release'),
      p('<p>On GitHub, a <b>Release</b> is a tag with release notes, and optionally downloadable files attached (a compiled binary, a build artifact) — created from a repository\'s "Releases" section, usually based on an existing tag.</p>'),
      table(['A plain Git tag', 'A GitHub Release'], [
        ['Just a name pointing to a commit', 'A tag, plus formatted release notes and optional file attachments'],
        ['Works with any Git host, or no host at all', 'A GitHub-specific feature built on top of tags'],
        ['git tag -a / git push origin <tag>', 'Created through GitHub\'s web interface or gh CLI'],
      ]),
      callout('tip', '<p>GitHub can auto-generate release notes from the commits and merged PRs between two tags — a genuinely useful starting point that saves writing a changelog from scratch.</p>', 'Auto-generated release notes'),
    ],
  },
  bn: {
    title: 'Tagging ও GitHub Release',
    metaTitle: 'Git Tagging ও GitHub Release | Learn Computer Academy',
    metaDescription: 'একটা Git tag দিয়ে একটা নির্দিষ্ট commit-কে একটা version হিসেবে চিহ্নিত করা — v1.0.0 — আর এটাকে note সহ একটা download-করা-যায় GitHub Release-এ পরিণত করা।',
    blocks: [
      p('<p>একটা <b>tag</b> স্থায়ীভাবে একটা নির্দিষ্ট commit চিহ্নিত করে — সবচেয়ে common একটা release version রেকর্ড করতে, যাতে "v1.0.0" সবসময় আসলে ship করা ঠিক commit-টা নির্দেশ করে।</p>'),
      h(2, 'একটা Tag তৈরি করা', 'একটা-tag-তৈরি-করা'),
      code('bash', '# একটা lightweight tag — শুধু একটা commit নির্দেশ করা একটা নাম\ngit tag v1.0.0\n\n# একটা annotated tag — একটা message, author, আর date সহ (release-এর জন্য recommended)\ngit tag -a v1.0.0 -m "First stable release"'),
      h(2, 'Tag List ও দেখা', 'tag-list-ও-দেখা'),
      code('bash', 'git tag\n# v1.0.0\n\ngit show v1.0.0\n# tag-এর message আর এটা নির্দেশ করা commit দেখায়'),
      h(2, 'Tag Push করা', 'tag-push-করা'),
      p('<p>একটা সাধারণ <code>git push</code>-এ tag অন্তর্ভুক্ত না — এগুলো স্পষ্টভাবে push করা দরকার।</p>'),
      code('bash', 'git push origin v1.0.0\n\n# একবারে প্রতিটা tag push করুন\ngit push origin --tags'),
      h(2, 'একটা Tag Checkout করা', 'একটা-tag-checkout-করা'),
      code('bash', 'git checkout v1.0.0\n# আগের HEAD lesson থেকে যেকোনো নির্দিষ্ট commit checkout করার মতোই\n# একই detached HEAD পরিস্থিতি'),
      h(2, 'একটা Tag-কে একটা GitHub Release-এ পরিণত করা', 'একটা-tag-কে-একটা-github-release-এ-পরিণত-করা'),
      p('<p>GitHub-এ, একটা <b>Release</b> release note সহ একটা tag, আর ঐচ্ছিকভাবে যুক্ত download-করা-যায় file (একটা compiled binary, একটা build artifact) — একটা repository-র "Releases" section থেকে তৈরি করা, সাধারণত একটা বিদ্যমান tag-এর উপর ভিত্তি করে।</p>'),
      table(['একটা সাধারণ Git tag', 'একটা GitHub Release'], [
        ['শুধু একটা commit নির্দেশ করা একটা নাম', 'একটা tag, প্লাস formatted release note আর ঐচ্ছিক file attachment'],
        ['যেকোনো Git host, বা কোনো host ছাড়াই কাজ করে', 'tag-এর উপরে তৈরি একটা GitHub-নির্দিষ্ট feature'],
        ['git tag -a / git push origin <tag>', 'GitHub-এর web interface বা gh CLI দিয়ে তৈরি'],
      ]),
      callout('tip', '<p>GitHub দুটো tag-এর মধ্যে commit আর merge হওয়া PR থেকে স্বয়ংক্রিয়ভাবে release note generate করতে পারে — শুরু থেকে একটা changelog লেখা বাঁচায় এমন সত্যিকারভাবে useful একটা শুরুর পয়েন্ট।</p>', 'স্বয়ংক্রিয়ভাবে তৈরি হওয়া release note'),
    ],
  },
})

// ═══ 4. ADDING COLLABORATORS ═══════════════════════════════════════════════

lessons.push({
  slug: 'adding-collaborators', sortOrder: n++,
  en: {
    title: 'Adding Collaborators to a Repository',
    metaTitle: 'Adding GitHub Collaborators | Learn Computer Academy',
    metaDescription: 'Giving a teammate direct write access to a repository — the difference between a collaborator and the fork-and-pull-request model, and permission levels.',
    blocks: [
      p('<p>The earlier Forking and Pull Requests lesson covered contributing without direct access — the standard way to work with strangers on a public project. A <b>collaborator</b> is different: someone given direct write access to push straight to the repository itself.</p>'),
      h(2, 'Adding a Collaborator'),
      p('<p>From a repository\'s Settings → Collaborators and teams → "Add people," searching by their GitHub username or email. They receive an invitation, which they need to accept before access takes effect.</p>'),
      h(2, 'Permission Levels'),
      table(['Level', 'Can do'], [
        ['Read', 'View and clone the repository, comment on issues/PRs'],
        ['Triage', 'Read, plus manage issues and PRs without write access to code'],
        ['Write', 'Read/Triage, plus push directly to non-protected branches, and merge PRs'],
        ['Maintain', 'Write, plus manage some repository settings, without full admin access'],
        ['Admin', 'Full control, including deleting the repository or changing who has access'],
      ]),
      h(2, 'Collaborator vs. Fork-and-PR — When to Use Which'),
      table(['Direct collaborator access', 'Fork and pull request'], [
        ['A small, trusted team working on the same private or public project', 'An open-source project accepting contributions from anyone'],
        ['Faster — push straight to a branch, no fork needed', 'Slower per-contribution, but keeps the original repository fully controlled'],
        ['Requires trusting someone with real write access', 'The maintainer reviews every change before it goes in, from anyone'],
      ]),
      h(2, 'Protecting the main Branch'),
      p('<p>Even with collaborators added, a <b>branch protection rule</b> can require every change — even from a collaborator with Write access — to go through a pull request and pass checks before merging into main, rather than allowing a direct push.</p>'),
      callout('tip', '<p>Requiring pull requests even from trusted collaborators, via a branch protection rule, is standard practice on real projects — it keeps a review step and a clean history even when direct push access exists.</p>', 'A common real-world setup'),
    ],
  },
  bn: {
    title: 'একটা Repository-তে Collaborator যোগ করা',
    metaTitle: 'GitHub Collaborator যোগ করা | Learn Computer Academy',
    metaDescription: 'একজন teammate-কে একটা repository-তে সরাসরি write access দেওয়া — একজন collaborator আর fork-and-pull-request model-এর পার্থক্য, আর permission level।',
    blocks: [
      p('<p>আগের Forking and Pull Requests lesson সরাসরি access ছাড়া contribute করা কভার করেছে — একটা public project-এ অপরিচিতদের সাথে কাজ করার standard উপায়। একজন <b>collaborator</b> ভিন্ন: কাউকে repository-তেই সরাসরি push করার জন্য সরাসরি write access দেওয়া।</p>'),
      h(2, 'একজন Collaborator যোগ করা', 'একজন-collaborator-যোগ-করা'),
      p('<p>একটা repository-র Settings → Collaborators and teams → "Add people" থেকে, তাদের GitHub username বা email দিয়ে search করে। তারা একটা invitation পায়, যা access কার্যকর হওয়ার আগে accept করা দরকার।</p>'),
      h(2, 'Permission Level'),
      table(['Level', 'যা করতে পারে'], [
        ['Read', 'Repository দেখা আর clone করা, issue/PR-এ comment করা'],
        ['Triage', 'Read, প্লাস কোড-এ write access ছাড়া issue আর PR manage করা'],
        ['Write', 'Read/Triage, প্লাস non-protected branch-এ সরাসরি push, আর PR merge করা'],
        ['Maintain', 'Write, প্লাস পূর্ণ admin access ছাড়া কিছু repository setting manage করা'],
        ['Admin', 'পূর্ণ নিয়ন্ত্রণ, repository delete করা বা কার access আছে তা বদলানো সহ'],
      ]),
      h(2, 'Collaborator বনাম Fork-and-PR — কখন কোনটা ব্যবহার', 'collaborator-বনাম-fork-and-pr-কখন-কোনটা-ব্যবহার'),
      table(['সরাসরি Collaborator Access', 'Fork ও Pull Request'], [
        ['একই private বা public project-এ কাজ করা একটা ছোট, বিশ্বস্ত team', 'যে কারো contribution accept করা একটা open-source project'],
        ['দ্রুত — সরাসরি একটা branch-এ push, কোনো fork দরকার নেই', 'প্রতি contribution-এ ধীর, কিন্তু আসল repository সম্পূর্ণ নিয়ন্ত্রিত রাখে'],
        ['আসল write access সহ কাউকে বিশ্বাস করা দরকার', 'Maintainer যে কারো থেকে যোগ হওয়ার আগে প্রতিটা পরিবর্তন review করে'],
      ]),
      h(2, 'main Branch Protect করা', 'main-branch-protect-করা'),
      p('<p>Collaborator যোগ করা থাকলেও, একটা <b>branch protection rule</b> দাবি করতে পারে প্রতিটা পরিবর্তন — এমনকি Write access সহ একজন collaborator থেকেও — main-এ merge হওয়ার আগে একটা pull request-এর মধ্য দিয়ে যেতে আর check pass করতে, সরাসরি push অনুমতি দেওয়ার বদলে।</p>'),
      callout('tip', '<p>একটা branch protection rule দিয়ে বিশ্বস্ত collaborator থেকেও pull request দাবি করা আসল project-এ standard practice — সরাসরি push access থাকলেও এটা একটা review step আর একটা পরিষ্কার history রাখে।</p>', 'একটা common বাস্তব setup'),
    ],
  },
})

// ═══ 5. GITHUB PAGES ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'github-pages', sortOrder: n++,
  en: {
    title: 'GitHub Pages — Free Static Site Hosting',
    metaTitle: 'GitHub Pages | Learn Computer Academy',
    metaDescription: 'Turning a repository into a live website for free, directly from GitHub — perfect for a portfolio, project documentation, or a static project.',
    blocks: [
      p('<p><b>GitHub Pages</b> hosts a static site (plain HTML/CSS/JS — the same kind covered in this site\'s HTML and CSS courses) directly from a repository, free, with a real URL — no separate hosting account needed.</p>'),
      h(2, 'Enabling It'),
      p('<p>From a repository\'s Settings → Pages, choose a source — either a specific branch (commonly a dedicated <code>gh-pages</code> branch, or <code>main</code>) and folder, or a GitHub Actions workflow for a build step.</p>'),
      h(2, 'The Simplest Setup'),
      code('text', 'my-portfolio/\n├── index.html\n├── style.css\n└── script.js'),
      p('<p>Push these files to the branch configured in Pages settings, and the site is live within a minute or two at:</p>'),
      code('text', 'https://username.github.io/my-portfolio/'),
      h(2, 'A User/Organization Site vs. a Project Site'),
      table(['Site type', 'Repository name', 'URL'], [
        ['User site (one per account)', 'Must be exactly username.github.io', 'https://username.github.io/'],
        ['Project site (unlimited)', 'Any repository name', 'https://username.github.io/repository-name/'],
      ]),
      h(2, 'Custom Domains'),
      p('<p>A domain already owned (from the earlier Hosting & Deployment course\'s DNS lessons) can point at a GitHub Pages site instead of a traditional host — a CNAME file in the repository plus a DNS record at the domain registrar.</p>'),
      code('text', '# CNAME file, at the root of the repository\nwww.example.com'),
      h(2, 'What GitHub Pages Can\'t Do'),
      table(['Works fine', 'Doesn\'t work'], [
        ['Plain HTML, CSS, JavaScript', 'PHP, Python, Node.js, or any server-side code'],
        ['A React/Vue app, built to static files first', 'A database connection'],
        ['Client-side API calls to another service', 'Anything needing a real backend running continuously'],
      ]),
      callout('tip', '<p>Every static project across this site\'s courses — a portfolio page, a completed CSS/JS project, this course\'s own example projects — is deployable on GitHub Pages in minutes, and pairs directly with the public-GitHub-profile advice from the Career Skills course.</p>', 'The most common real use for a student'),
    ],
  },
  bn: {
    title: 'GitHub Pages — ফ্রি Static Site Hosting',
    metaTitle: 'GitHub Pages | Learn Computer Academy',
    metaDescription: 'সরাসরি GitHub থেকে ফ্রি একটা repository-কে একটা live website-এ পরিণত করা — একটা portfolio, project documentation, বা একটা static project-এর জন্য পারফেক্ট।',
    blocks: [
      p('<p><b>GitHub Pages</b> সরাসরি একটা repository থেকে একটা static site (সাধারণ HTML/CSS/JS — এই সাইটের HTML আর CSS কোর্সে কভার করা একই ধরনের) host করে, ফ্রি, একটা আসল URL সহ — আলাদা কোনো hosting account দরকার নেই।</p>'),
      h(2, 'এটা Enable করা', 'এটা-enable-করা'),
      p('<p>একটা repository-র Settings → Pages থেকে, একটা source বেছে নিন — হয় একটা নির্দিষ্ট branch (সাধারণত একটা dedicated <code>gh-pages</code> branch, বা <code>main</code>) আর folder, বা একটা build step-এর জন্য একটা GitHub Actions workflow।</p>'),
      h(2, 'সবচেয়ে সহজ Setup', 'সবচেয়ে-সহজ-setup'),
      code('text', 'my-portfolio/\n├── index.html\n├── style.css\n└── script.js'),
      p('<p>Pages setting-এ configure করা branch-এ এই file push করুন, আর এক দুই মিনিটের মধ্যে site live হয়ে যায়:</p>'),
      code('text', 'https://username.github.io/my-portfolio/'),
      h(2, 'একটা User/Organization Site বনাম একটা Project Site', 'একটা-userorganization-site-বনাম-একটা-project-site'),
      table(['Site ধরন', 'Repository নাম', 'URL'], [
        ['User site (প্রতি account-এ একটা)', 'ঠিক username.github.io হতে হবে', 'https://username.github.io/'],
        ['Project site (অসীম)', 'যেকোনো repository নাম', 'https://username.github.io/repository-name/'],
      ]),
      h(2, 'Custom Domain'),
      p('<p>(আগের Hosting & Deployment কোর্সের DNS lesson থেকে) ইতিমধ্যে মালিকানাধীন একটা domain একটা traditional host-এর বদলে একটা GitHub Pages site নির্দেশ করতে পারে — repository-তে একটা CNAME file প্লাস domain registrar-এ একটা DNS record।</p>'),
      code('text', '# CNAME file, repository-র root-এ\nwww.example.com'),
      h(2, 'GitHub Pages যা করতে পারে না', 'github-pages-যা-করতে-পারে-না'),
      table(['ঠিকঠাক কাজ করে', 'কাজ করে না'], [
        ['সাধারণ HTML, CSS, JavaScript', 'PHP, Python, Node.js, বা যেকোনো server-side কোড'],
        ['একটা React/Vue app, আগে static file-এ build করা', 'একটা database connection'],
        ['অন্য একটা service-এ client-side API call', 'ক্রমাগত চলা একটা আসল backend দরকার এমন যেকোনো কিছু'],
      ]),
      callout('tip', '<p>এই সাইটের কোর্স জুড়ে প্রতিটা static project — একটা portfolio page, একটা সম্পূর্ণ CSS/JS project, এই কোর্সের নিজের example project — মিনিটের মধ্যে GitHub Pages-এ deploy করা যায়, আর Career Skills কোর্সের public-GitHub-profile advice-এর সাথে সরাসরি জোড়া লাগে।</p>', 'একজন student-এর জন্য সবচেয়ে common আসল ব্যবহার'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'git').single()
  if (catErr || !category) {
    console.error('Category "git" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write, plus bumping where-this-leaves-you\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] git/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] git/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('  git/where-this-leaves-you -> sort_order 26')
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `git/${lesson.slug}`
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

  const { error: bumpErr } = await supabase.from('docs').update({ sort_order: 26 }).eq('category_id', category.id).eq('slug', 'where-this-leaves-you')
  if (bumpErr) console.error('Failed to bump where-this-leaves-you:', bumpErr.message)
  else console.log('  ✓ git/where-this-leaves-you -> sort_order 26')

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
