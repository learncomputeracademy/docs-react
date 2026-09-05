#!/usr/bin/env node
// New "Git & GitHub" category (created by scripts/create-git-category.mjs)
// — 20 lessons, user request 2026-09-03 ("build git and github and also
// include other version control softwares"). Placed in the "Start Here"
// sidebar group — Git is a fundamental tool needed regardless of which
// language track a student picks next, not language-specific like html/
// css/js or php/python/node.
//
// Images: 4 real screenshots captured live via claude-in-chrome (no
// Magnific, per explicit user instruction), added by a follow-up script
// (scripts/add-git-real-screenshots.mjs) — three from public GitHub pages
// requiring no login and exposing no personal data (a well-known public
// repo, a merged pull request, an issues list), one from the logged-in
// "Create a new repository" screen with the owner/username field blurred,
// matching the real-screenshot-lessons-privacy discipline established this
// session (D-107, D-117).
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-git-content.mjs [--dry-run]

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
let n = 1

// ═══ 1. INTRODUCTION TO VERSION CONTROL ═══════════════════════════════════

lessons.push({
  slug: 'introduction-to-version-control', sortOrder: n++,
  en: {
    title: 'Introduction to Version Control',
    metaTitle: 'Introduction to Version Control | Learn Computer Academy',
    metaDescription: 'What version control actually solves, why "final_v2_FINAL.docx" is the problem every developer eventually hits, and where Git fits in.',
    blocks: [
      p('<p>Anyone who has ever kept files named <code>project_final.docx</code>, <code>project_final_v2.docx</code>, and <code>project_final_v2_ACTUAL.docx</code> has already felt the exact problem <b>version control</b> solves — tracking how a project changes over time, without losing anything or guessing which copy is current.</p>'),
      h(2, 'What Version Control Actually Does'),
      table(['Without version control', 'With version control'], [
        ['Multiple copies of a file, manually renamed', 'One file, a complete history of every change to it'],
        ['No record of who changed what, or why', 'Every change is logged with an author, a timestamp, and a message'],
        ['Undoing a mistake means finding an old copy, if one still exists', 'Undoing a mistake means checking out an earlier version — always possible'],
        ['Two people editing the same file overwrite each other', 'Changes from multiple people merge together, with conflicts flagged explicitly'],
      ]),
      h(2, 'A Short History'),
      p('<p>Early tools (like SVN and CVS) tracked changes with everyone working against one central copy — every action needed the network. <b>Git</b>, created by Linus Torvalds in 2005 to manage the Linux kernel\'s source code, is <b>distributed</b> instead: every developer has a complete copy of the project\'s full history on their own machine, and only needs the network to actually share changes with others.</p>'),
      h(2, 'Git vs. GitHub'),
      p('<p>These two names get used interchangeably, but they\'re different things. <b>Git</b> is the version control tool itself — it runs entirely on a local machine and has no concept of "the internet" built in. <b>GitHub</b> is a website that hosts Git repositories online and adds collaboration features (pull requests, issues, code review) on top — covered starting a few lessons ahead. GitLab and Bitbucket, covered in the last lesson of this course, do the same job as GitHub with a different company behind them.</p>'),
      h(2, 'Why This Course Is Worth the Time'),
      p('<p>Every other course on this site assumes a project eventually gets deployed, shared, or worked on with someone else — Git is the tool that actually makes that possible without chaos. It\'s also, in practice, one of the first things a coding interview or a job\'s day-one setup assumes a developer already knows.</p>'),
      callout('note', '<p>This course covers Git and GitHub in real depth, then closes with a lesson comparing GitHub to other hosting platforms (GitLab, Bitbucket) and other version control systems entirely (Mercurial, Subversion, Perforce) — Git is overwhelmingly the industry standard today, but it\'s worth knowing what else exists and why.</p>', 'What "other version control softwares" means in this course'),
    ],
  },
  bn: {
    title: 'Version Control-এর পরিচয়',
    metaTitle: 'Version Control-এর পরিচয় | Learn Computer Academy',
    metaDescription: 'Version control আসলে কী সমাধান করে, কেন "final_v2_FINAL.docx" প্রতিটা developer শেষ পর্যন্ত যে সমস্যায় পড়ে, আর Git কোথায় খাপ খায়।',
    blocks: [
      p('<p>যে কেউ কখনো <code>project_final.docx</code>, <code>project_final_v2.docx</code>, আর <code>project_final_v2_ACTUAL.docx</code> নামের file রেখেছে সে ইতিমধ্যে ঠিক সেই সমস্যা অনুভব করেছে যা <b>version control</b> সমাধান করে — কিছু না হারিয়ে, আর কোন কপিটা current তা অনুমান না করে, সময়ের সাথে একটা project কীভাবে বদলায় তা track করা।</p>'),
      h(2, 'Version Control আসলে কী করে', 'version-control-আসলে-কী-করে'),
      table(['Version control ছাড়া', 'Version control সহ'], [
        ['একটা file-এর একাধিক কপি, হাতে rename করা', 'একটা file, এর প্রতিটা পরিবর্তনের একটা পূর্ণ history'],
        ['কে কী বদলেছে, বা কেন তার কোনো রেকর্ড নেই', 'প্রতিটা পরিবর্তন একজন author, একটা timestamp, আর একটা message সহ log করা'],
        ['একটা ভুল undo করা মানে একটা পুরনো কপি খুঁজে বের করা, যদি একটা এখনো থাকে', 'একটা ভুল undo করা মানে একটা আগের version checkout করা — সবসময় সম্ভব'],
        ['দুজন একই file edit করলে একে অপরেরটা overwrite হয়', 'একাধিক মানুষের পরিবর্তন একসাথে merge হয়, conflict স্পষ্টভাবে চিহ্নিত সহ'],
      ]),
      h(2, 'একটা সংক্ষিপ্ত ইতিহাস', 'একটা-সংক্ষিপ্ত-ইতিহাস'),
      p('<p>প্রথম দিকের tool (SVN আর CVS-এর মতো) একটা central কপির বিরুদ্ধে সবাই কাজ করে পরিবর্তন track করত — প্রতিটা action-এর জন্য network দরকার হতো। <b>Git</b>, 2005-এ Linux kernel-এর source code manage করতে Linus Torvalds তৈরি করেছিলেন, এর বদলে <b>distributed</b>: প্রতিটা developer-এর নিজের machine-এ project-এর পূর্ণ history-র একটা সম্পূর্ণ কপি আছে, আর অন্যদের সাথে আসলে পরিবর্তন শেয়ার করতে শুধু network দরকার।</p>'),
      h(2, 'Git বনাম GitHub', 'git-বনাম-github'),
      p('<p>এই দুটো নাম বদলে বদলে ব্যবহার হয়, কিন্তু এরা ভিন্ন জিনিস। <b>Git</b> version control tool নিজেই — এটা সম্পূর্ণভাবে একটা local machine-এ চলে আর built in "internet"-এর কোনো ধারণা নেই। <b>GitHub</b> একটা website যা Git repository অনলাইনে host করে আর এর উপরে collaboration feature (pull request, issue, code review) যোগ করে — কয়েক lesson পরে শুরু করে কভার করা। GitLab আর Bitbucket, এই কোর্সের শেষ lesson-এ কভার করা, ভিন্ন company নিয়ে GitHub-এর একই কাজ করে।</p>'),
      h(2, 'কেন এই কোর্স সময়ের যোগ্য', 'কেন-এই-কোর্স-সময়ের-যোগ্য'),
      p('<p>এই সাইটের বাকি প্রতিটা কোর্স ধরে নেয় একটা project শেষ পর্যন্ত deploy, share, বা অন্য কারো সাথে কাজ করা হবে — Git-ই সেই tool যা এটা chaos ছাড়াই সম্ভব করে। এটা, বাস্তবে, একটা coding interview বা একটা চাকরির প্রথম দিনের setup ইতিমধ্যে একজন developer জানে ধরে নেওয়া প্রথম জিনিসগুলোর একটাও।</p>'),
      callout('note', '<p>এই কোর্স Git আর GitHub সত্যিকারের গভীরতায় কভার করে, তারপর GitHub-কে অন্য hosting platform (GitLab, Bitbucket) আর সম্পূর্ণ অন্য version control system-এর (Mercurial, Subversion, Perforce) সাথে তুলনা করা একটা lesson দিয়ে বন্ধ হয় — আজ Git প্রবলভাবে industry standard, কিন্তু আর কী আছে আর কেন তা জানার যোগ্য।</p>', 'এই কোর্সে "অন্য version control software" মানে কী'),
    ],
  },
})

// ═══ 2. INSTALLING AND CONFIGURING GIT ════════════════════════════════════

lessons.push({
  slug: 'installing-git', sortOrder: n++,
  en: {
    title: 'Installing and Configuring Git',
    metaTitle: 'Installing and Configuring Git | Learn Computer Academy',
    metaDescription: 'Getting Git installed on Windows, macOS, and Linux, and the one-time setup — your name and email — every commit will use.',
    blocks: [
      p('<p>Git runs entirely from the command line — the Windows Command Line and Linux Terminal lessons from the Cybersecurity course are directly useful preparation if either feels unfamiliar.</p>'),
      h(2, 'Installing Git'),
      table(['OS', 'How'], [
        ['Windows', 'Download and run the installer from git-scm.com — this also installs "Git Bash," a terminal that behaves like Linux\'s'],
        ['macOS', 'Comes preinstalled on most systems, or run xcode-select --install, or install via Homebrew: brew install git'],
        ['Linux (Debian/Ubuntu)', 'sudo apt install git'],
        ['Linux (Fedora)', 'sudo dnf install git'],
      ]),
      h(2, 'Confirming It Installed'),
      code('bash', 'git --version\n# git version 2.43.0'),
      h(2, 'One-Time Setup — Identity'),
      p('<p>Every commit records who made it — this needs to be set once, globally, before the first commit anywhere.</p>'),
      code('bash', 'git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"'),
      h(2, 'A Few Other Useful Settings'),
      code('bash', '# Set the default branch name for new repositories to "main"\ngit config --global init.defaultBranch main\n\n# Set a default text editor for commit messages (nano, here)\ngit config --global core.editor "nano"\n\n# Make Git\'s output colorful in the terminal\ngit config --global color.ui auto'),
      h(2, 'Checking the Current Configuration'),
      code('bash', 'git config --list\n\n# Check a single value\ngit config user.name'),
      callout('note', '<p>These settings are stored in a plain text file — ~/.gitconfig — and can be edited directly if preferred over running commands one at a time.</p>', 'Where this actually lives'),
    ],
  },
  bn: {
    title: 'Git Install ও Configure করা',
    metaTitle: 'Git Install ও Configure করা | Learn Computer Academy',
    metaDescription: 'Windows, macOS, আর Linux-এ Git install করা, আর একবারের setup — আপনার নাম আর email — যা প্রতিটা commit ব্যবহার করবে।',
    blocks: [
      p('<p>Git সম্পূর্ণভাবে command line থেকে চলে — Cybersecurity কোর্সের Windows Command Line আর Linux Terminal lesson দুটোই অপরিচিত মনে হলে সরাসরি useful প্রস্তুতি।</p>'),
      h(2, 'Git Install করা', 'git-install-করা'),
      table(['OS', 'কীভাবে'], [
        ['Windows', 'git-scm.com থেকে installer download আর run করুন — এটা "Git Bash"-ও install করে, একটা terminal যা Linux-এরটার মতো behave করে'],
        ['macOS', 'বেশিরভাগ system-এ আগে থেকেই install করা, বা xcode-select --install চালান, বা Homebrew দিয়ে install করুন: brew install git'],
        ['Linux (Debian/Ubuntu)', 'sudo apt install git'],
        ['Linux (Fedora)', 'sudo dnf install git'],
      ]),
      h(2, 'এটা Install হয়েছে কিনা নিশ্চিত করা', 'এটা-install-হয়েছে-কিনা-নিশ্চিত-করা'),
      code('bash', 'git --version\n# git version 2.43.0'),
      h(2, 'একবারের Setup — Identity', 'একবারের-setup-identity'),
      p('<p>প্রতিটা commit কে করেছে তা রেকর্ড করে — যেকোনো জায়গায় প্রথম commit-এর আগে এটা একবার, globally সেট করা দরকার।</p>'),
      code('bash', 'git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"'),
      h(2, 'আরো কিছু Useful Setting', 'আরো-কিছু-useful-setting'),
      code('bash', '# নতুন repository-র জন্য default branch নাম "main"-এ সেট করুন\ngit config --global init.defaultBranch main\n\n# Commit message-এর জন্য একটা default text editor সেট করুন (এখানে, nano)\ngit config --global core.editor "nano"\n\n# Terminal-এ Git-এর output রঙিন বানান\ngit config --global color.ui auto'),
      h(2, 'বর্তমান Configuration Check করা', 'বর্তমান-configuration-check-করা'),
      code('bash', 'git config --list\n\n# একটা একক মান check করুন\ngit config user.name'),
      callout('note', '<p>এই setting-গুলো একটা plain text file-এ সংরক্ষিত — ~/.gitconfig — আর একবারে একটা command চালানোর বদলে পছন্দ হলে সরাসরি edit করা যায়।</p>', 'এটা আসলে কোথায় থাকে'),
    ],
  },
})

// ═══ 3. GIT BASICS — INIT, ADD, COMMIT ════════════════════════════════════

lessons.push({
  slug: 'git-basics-init-add-commit', sortOrder: n++,
  en: {
    title: 'Git Basics — init, add, commit',
    metaTitle: 'Git Basics — init, add, commit | Learn Computer Academy',
    metaDescription: 'Turning a folder into a Git repository, and the two-step process — staging, then committing — behind every saved snapshot of a project.',
    blocks: [
      p('<p>Three commands cover the entire core loop of using Git day to day. Everything in the lessons ahead builds on these.</p>'),
      h(2, 'git init — Starting a Repository'),
      code('bash', 'mkdir my-project\ncd my-project\ngit init\n# Initialized empty Git repository in .../my-project/.git/'),
      p('<p>This creates a hidden <code>.git</code> folder — that\'s the entire repository. Deleting it removes all Git history while leaving the actual project files untouched.</p>'),
      h(2, 'The Three States a File Can Be In'),
      table(['State', 'Meaning'], [
        ['Untracked / Modified', 'A file Git sees but hasn\'t been told to track yet, or a tracked file that has changed'],
        ['Staged', 'A change marked as ready to be included in the next commit'],
        ['Committed', 'A change permanently saved into the project\'s history'],
      ]),
      h(2, 'git add — Staging Changes'),
      code('bash', 'echo "# My Project" > README.md\n\ngit add README.md      # stage one specific file\ngit add .               # stage every changed file in the current folder and below'),
      h(2, 'git commit — Saving a Snapshot'),
      code('bash', 'git commit -m "Add README"\n# [main (root-commit) a1b2c3d] Add README\n#  1 file changed, 1 insertion(+)'),
      p('<p>The <code>-m</code> flag provides the commit message inline — without it, Git opens the configured text editor to write one.</p>'),
      h(2, 'A Typical Cycle'),
      code('bash', '# 1. Make some changes to files\n# 2. Check what changed (covered next lesson)\ngit status\n\n# 3. Stage the changes\ngit add .\n\n# 4. Commit them\ngit commit -m "Describe what changed and why"'),
      callout('tip', '<p>A good commit message describes <i>why</i> a change was made, not just what — "Add README" is fine for a first commit, but "Fix off-by-one error in pagination" is far more useful six months later than "Fix bug."</p>', 'Writing a useful commit message'),
    ],
  },
  bn: {
    title: 'Git Basics — init, add, commit',
    metaTitle: 'Git Basics — init, add, commit | Learn Computer Academy',
    metaDescription: 'একটা folder-কে একটা Git repository-তে পরিণত করা, আর একটা project-এর প্রতিটা saved snapshot-এর পেছনের দুই-ধাপের process — staging, তারপর committing।',
    blocks: [
      p('<p>তিনটা command Git প্রতিদিন ব্যবহারের পুরো core loop কভার করে। সামনের lesson-এ সবকিছু এগুলোর উপর তৈরি।</p>'),
      h(2, 'git init — একটা Repository শুরু করা', 'git-init-একটা-repository-শুরু-করা'),
      code('bash', 'mkdir my-project\ncd my-project\ngit init\n# Initialized empty Git repository in .../my-project/.git/'),
      p('<p>এটা একটা hidden <code>.git</code> folder তৈরি করে — সেটাই পুরো repository। এটা delete করলে আসল project file স্পর্শ না করেই প্রতিটা Git history সরিয়ে দেয়।</p>'),
      h(2, 'একটা File যে তিনটা State-এ থাকতে পারে', 'একটা-file-যে-তিনটা-state-এ-থাকতে-পারে'),
      table(['State', 'মানে'], [
        ['Untracked / Modified', 'Git দেখে এমন একটা file কিন্তু এখনো track করতে বলা হয়নি, বা বদলে যাওয়া একটা tracked file'],
        ['Staged', 'পরের commit-এ যোগ হওয়ার জন্য প্রস্তুত হিসেবে চিহ্নিত একটা পরিবর্তন'],
        ['Committed', 'project-এর history-তে স্থায়ীভাবে সংরক্ষিত একটা পরিবর্তন'],
      ]),
      h(2, 'git add — পরিবর্তন Stage করা', 'git-add-পরিবর্তন-stage-করা'),
      code('bash', 'echo "# My Project" > README.md\n\ngit add README.md      # একটা নির্দিষ্ট file stage করুন\ngit add .               # বর্তমান folder আর এর নিচের প্রতিটা বদলে যাওয়া file stage করুন'),
      h(2, 'git commit — একটা Snapshot Save করা', 'git-commit-একটা-snapshot-save-করা'),
      code('bash', 'git commit -m "Add README"\n# [main (root-commit) a1b2c3d] Add README\n#  1 file changed, 1 insertion(+)'),
      p('<p><code>-m</code> flag inline commit message দেয় — এটা ছাড়া, Git একটা লেখার জন্য configure করা text editor খোলে।</p>'),
      h(2, 'একটা সাধারণ Cycle', 'একটা-সাধারণ-cycle'),
      code('bash', '# 1. file-এ কিছু পরিবর্তন করুন\n# 2. কী বদলেছে check করুন (পরের lesson-এ কভার করা)\ngit status\n\n# 3. পরিবর্তন stage করুন\ngit add .\n\n# 4. এগুলো commit করুন\ngit commit -m "Describe what changed and why"'),
      callout('tip', '<p>একটা ভালো commit message কী বদলেছে তার বদলে <i>কেন</i> একটা পরিবর্তন করা হয়েছে বর্ণনা করে — একটা প্রথম commit-এর জন্য "Add README" ঠিক আছে, কিন্তু "Fix off-by-one error in pagination" ছয় মাস পরে "Fix bug"-এর চেয়ে অনেক বেশি useful।</p>', 'একটা useful commit message লেখা'),
    ],
  },
})

// ═══ 4. CHECKING STATUS, DIFFS, HISTORY ═══════════════════════════════════

lessons.push({
  slug: 'checking-status-and-history', sortOrder: n++,
  en: {
    title: 'Checking Status, Diffs, and History',
    metaTitle: 'Git Status, Diff, and Log | Learn Computer Academy',
    metaDescription: 'The three commands for seeing what changed, what will be committed, and what happened in the past — git status, git diff, and git log.',
    blocks: [
      p('<p>Before committing anything, it\'s worth actually seeing what\'s about to be saved — these three commands are how.</p>'),
      h(2, 'git status — What\'s Changed'),
      code('bash', 'git status\n# On branch main\n# Changes not staged for commit:\n#   modified:   index.html\n#\n# Untracked files:\n#   style.css'),
      p('<p>The single most-run Git command in practice — showing which files are modified, staged, or untracked, and what to do next.</p>'),
      h(2, 'git diff — Exactly What Changed'),
      code('bash', '# See unstaged changes, line by line\ngit diff\n\n# See staged changes (what\'s about to be committed)\ngit diff --staged'),
      code('diff', '- <h1>Old Heading</h1>\n+ <h1>New Heading</h1>'),
      p('<p>A line starting with <code>-</code> was removed, <code>+</code> was added — the same convention used in the earlier PHP Security lesson\'s vulnerable/safe code comparisons.</p>'),
      h(2, 'git log — The Commit History'),
      code('bash', 'git log\n# commit a1b2c3d4e5f6... (HEAD -> main)\n# Author: Sam <sam@example.com>\n# Date:   Wed Sep 3 10:00:00 2026\n#\n#     Add README'),
      h(2, 'Useful log Options'),
      table(['Command', 'Shows'], [
        ['git log --oneline', 'One line per commit — a compact summary'],
        ['git log -p', 'The full diff for every commit, not just the message'],
        ['git log --author="Sam"', 'Only commits by a specific person'],
        ['git log --since="2 weeks ago"', 'Only recent commits'],
        ['git log -- filename.txt', 'Only commits that touched a specific file'],
      ]),
      code('bash', 'git log --oneline --graph\n# * a1b2c3d Add README\n# * e5f6g7h Initial commit'),
      callout('tip', '<p>git log --oneline --graph is worth memorizing as a habit — it\'s the fastest way to see a project\'s recent history and branch structure at a glance, and becomes essential once branching (the next few lessons) is in the picture.</p>', 'A command worth memorizing'),
    ],
  },
  bn: {
    title: 'Status, Diff, ও History Check করা',
    metaTitle: 'Git Status, Diff, ও Log | Learn Computer Academy',
    metaDescription: 'কী বদলেছে, কী commit হবে, আর অতীতে কী ঘটেছে তা দেখার তিনটা command — git status, git diff, আর git log।',
    blocks: [
      p('<p>কিছু commit করার আগে, আসলে কী save হতে যাচ্ছে তা দেখার যোগ্য — এই তিনটা command সেটাই।</p>'),
      h(2, 'git status — কী বদলেছে', 'git-status-কী-বদলেছে'),
      code('bash', 'git status\n# On branch main\n# Changes not staged for commit:\n#   modified:   index.html\n#\n# Untracked files:\n#   style.css'),
      p('<p>বাস্তবে একক সবচেয়ে বেশি চালানো Git command — কোন file modified, staged, বা untracked তা দেখায়, আর পরে কী করবেন।</p>'),
      h(2, 'git diff — ঠিক কী বদলেছে', 'git-diff-ঠিক-কী-বদলেছে'),
      code('bash', '# Unstaged পরিবর্তন দেখুন, লাইন ধরে ধরে\ngit diff\n\n# Staged পরিবর্তন দেখুন (যা commit হতে যাচ্ছে)\ngit diff --staged'),
      code('diff', '- <h1>Old Heading</h1>\n+ <h1>New Heading</h1>'),
      p('<p><code>-</code> দিয়ে শুরু হওয়া একটা লাইন সরানো হয়েছে, <code>+</code> যোগ করা হয়েছে — আগের PHP Security lesson-এর vulnerable/safe কোড তুলনায় ব্যবহৃত একই convention।</p>'),
      h(2, 'git log — Commit History'),
      code('bash', 'git log\n# commit a1b2c3d4e5f6... (HEAD -> main)\n# Author: Sam <sam@example.com>\n# Date:   Wed Sep 3 10:00:00 2026\n#\n#     Add README'),
      h(2, 'Useful log Option', 'useful-log-option'),
      table(['Command', 'দেখায়'], [
        ['git log --oneline', 'প্রতি commit-এ এক লাইন — একটা compact summary'],
        ['git log -p', 'শুধু message না, প্রতিটা commit-এর পূর্ণ diff'],
        ['git log --author="Sam"', 'শুধু একজন নির্দিষ্ট মানুষের commit'],
        ['git log --since="2 weeks ago"', 'শুধু সাম্প্রতিক commit'],
        ['git log -- filename.txt', 'শুধু একটা নির্দিষ্ট file স্পর্শ করা commit'],
      ]),
      code('bash', 'git log --oneline --graph\n# * a1b2c3d Add README\n# * e5f6g7h Initial commit'),
      callout('tip', '<p>git log --oneline --graph একটা habit হিসেবে মনে রাখার যোগ্য — এক নজরে একটা project-এর সাম্প্রতিক history আর branch structure দেখার সবচেয়ে দ্রুত উপায়, আর branching (পরের কয়েক lesson) ছবিতে আসলে অপরিহার্য হয়ে যায়।</p>', 'মনে রাখার যোগ্য একটা command'),
    ],
  },
})

// ═══ 5. .GITIGNORE ══════════════════════════════════════════════════════

lessons.push({
  slug: 'gitignore', sortOrder: n++,
  en: {
    title: 'The .gitignore File',
    metaTitle: 'The .gitignore File | Learn Computer Academy',
    metaDescription: 'Telling Git which files to never track — dependencies, secrets, and build output that don\'t belong in a repository\'s history.',
    blocks: [
      p('<p>Not every file in a project folder belongs in Git — installed dependencies, build output, and secrets should never be tracked. A <code>.gitignore</code> file tells Git which files or folders to ignore entirely.</p>'),
      h(2, 'A Basic .gitignore'),
      code('text', '# .gitignore\nnode_modules/\n.env\n*.log\ndist/\n.DS_Store'),
      h(2, 'Common Patterns'),
      table(['Pattern', 'Matches'], [
        ['node_modules/', 'A specific folder, anywhere in the project'],
        ['*.log', 'Every file ending in .log'],
        ['.env', 'A specific filename'],
        ['/build', 'Only a build folder at the project root, not one nested deeper'],
        ['!important.log', 'An exception — un-ignores one specific file that would otherwise match a pattern above it'],
      ]),
      h(2, 'What Actually Belongs in .gitignore'),
      table(['Category', 'Example'], [
        ['Dependencies', 'node_modules/, vendor/ — reinstalled from package.json/composer.json instead'],
        ['Secrets', '.env — from the earlier PHP/Node lessons on environment variables'],
        ['Build output', 'dist/, build/ — regenerated from source, not source itself'],
        ['Editor/OS files', '.DS_Store, .vscode/, Thumbs.db'],
        ['Logs and caches', '*.log, .cache/'],
      ]),
      h(2, 'A File Already Tracked Won\'t Be Ignored Automatically'),
      p('<p>Adding a pattern to .gitignore only affects files Git doesn\'t already know about — a file already committed keeps being tracked until explicitly removed.</p>'),
      code('bash', '# Stop tracking a file, but keep it on disk\ngit rm --cached .env\ngit commit -m "Stop tracking .env"'),
      callout('danger', '<p>If a secret (an API key, a password) was ever committed, adding it to .gitignore afterward does NOT remove it from history — it\'s still recoverable from any earlier commit. Rotating the exposed secret immediately is the actual fix; removing it from history entirely is a separate, more advanced operation.</p>', 'A leaked secret needs rotating, not just ignoring'),
    ],
  },
  bn: {
    title: '.gitignore File',
    metaTitle: '.gitignore File | Learn Computer Academy',
    metaDescription: 'কোন file কখনো track না করতে Git-কে বলা — dependency, secret, আর build output যা একটা repository-র history-তে থাকা উচিত না।',
    blocks: [
      p('<p>একটা project folder-এর প্রতিটা file Git-এ থাকার যোগ্য না — installed dependency, build output, আর secret কখনো track করা উচিত না। একটা <code>.gitignore</code> file Git-কে বলে কোন file বা folder সম্পূর্ণভাবে ignore করতে হবে।</p>'),
      h(2, 'একটা মৌলিক .gitignore', 'একটা-মৌলিক-gitignore'),
      code('text', '# .gitignore\nnode_modules/\n.env\n*.log\ndist/\n.DS_Store'),
      h(2, 'সাধারণ Pattern', 'সাধারণ-pattern'),
      table(['Pattern', 'যা match করে'], [
        ['node_modules/', 'project-এর যেকোনো জায়গায়, একটা নির্দিষ্ট folder'],
        ['*.log', '.log-এ শেষ হওয়া প্রতিটা file'],
        ['.env', 'একটা নির্দিষ্ট filename'],
        ['/build', 'শুধু project root-এ একটা build folder, গভীরে nested একটা না'],
        ['!important.log', 'একটা exception — উপরের একটা pattern-এ মিলে যেত এমন একটা নির্দিষ্ট file un-ignore করে'],
      ]),
      h(2, '.gitignore-এ আসলে কী থাকে', 'gitignore-এ-আসলে-কী-থাকে'),
      table(['Category', 'উদাহরণ'], [
        ['Dependency', 'node_modules/, vendor/ — এর বদলে package.json/composer.json থেকে পুনরায় install করা'],
        ['Secret', '.env — environment variable-এর আগের PHP/Node lesson থেকে'],
        ['Build output', 'dist/, build/ — source থেকে regenerate করা, নিজে source না'],
        ['Editor/OS file', '.DS_Store, .vscode/, Thumbs.db'],
        ['Log ও cache', '*.log, .cache/'],
      ]),
      h(2, 'ইতিমধ্যে Tracked একটা File স্বয়ংক্রিয়ভাবে Ignore হবে না', 'ইতিমধ্যে-tracked-একটা-file-স্বয়ংক্রিয়ভাবে-ignore-হবে-না'),
      p('<p>.gitignore-এ একটা pattern যোগ করা শুধু Git ইতিমধ্যে জানে না এমন file-কে প্রভাবিত করে — ইতিমধ্যে commit করা একটা file স্পষ্টভাবে সরানো না হওয়া পর্যন্ত track হতে থাকে।</p>'),
      code('bash', '# একটা file track করা বন্ধ করুন, কিন্তু disk-এ রাখুন\ngit rm --cached .env\ngit commit -m "Stop tracking .env"'),
      callout('danger', '<p>একটা secret (একটা API key, একটা password) কখনো commit হয়ে থাকলে, পরে এটা .gitignore-এ যোগ করা history থেকে এটা সরায় না — এটা এখনো যেকোনো আগের commit থেকে recoverable। expose হওয়া secret অবিলম্বে rotate করাই আসল fix; এটা history থেকে সম্পূর্ণ সরানো একটা আলাদা, বেশি advanced operation।</p>', 'একটা leak হওয়া secret শুধু ignore না, rotate করা দরকার'),
    ],
  },
})

// ═══ 6. BRANCHING BASICS ═══════════════════════════════════════════════════

lessons.push({
  slug: 'branching-basics', sortOrder: n++,
  en: {
    title: 'Branching Basics',
    metaTitle: 'Git Branching Basics | Learn Computer Academy',
    metaDescription: 'Working on a new feature without touching the working project — creating, switching, and listing branches.',
    blocks: [
      p('<p>Every commit so far in this course happened on one line of history. A <b>branch</b> lets development split — trying a new feature, fixing a bug, or experimenting — without touching the working version until it\'s ready.</p>'),
      h(2, 'The main Branch'),
      p('<p>A new repository starts with one branch, conventionally named <code>main</code> (older projects sometimes use <code>master</code>) — the project\'s stable, working line of history.</p>'),
      h(2, 'Creating a Branch'),
      code('bash', 'git branch feature-login\n# Creates the branch, but doesn\'t switch to it yet'),
      h(2, 'Switching Branches'),
      code('bash', 'git switch feature-login\n# or, the older equivalent still seen everywhere:\ngit checkout feature-login'),
      h(2, 'Creating and Switching in One Step'),
      code('bash', 'git switch -c feature-login\n# or\ngit checkout -b feature-login'),
      h(2, 'Listing Branches'),
      code('bash', 'git branch\n#   main\n# * feature-login   <- the asterisk marks the current branch'),
      h(2, 'Working on a Branch'),
      p('<p>Commits made while on <code>feature-login</code> only exist on that branch — switching back to <code>main</code> makes those changes disappear from view (not deleted, just not part of main\'s history) until the branch is merged, covered in the next lesson.</p>'),
      code('bash', 'git switch feature-login\n# ... make changes, git add, git commit ...\ngit switch main\n# The feature-login commits aren\'t visible here yet'),
      h(2, 'Deleting a Branch'),
      code('bash', '# Safe delete — refuses if the branch has unmerged changes\ngit branch -d feature-login\n\n# Force delete, even with unmerged changes\ngit branch -D feature-login'),
      callout('tip', '<p>Creating a branch for every real change — even a small one — costs almost nothing and keeps main always in a working state. This habit alone prevents most of the "I broke everything" moments a beginner runs into.</p>', 'Branch liberally'),
    ],
  },
  bn: {
    title: 'Branching-এর বেসিক',
    metaTitle: 'Git Branching-এর বেসিক | Learn Computer Academy',
    metaDescription: 'কাজ করা project স্পর্শ না করে একটা নতুন feature-এ কাজ করা — branch তৈরি, switch, আর list করা।',
    blocks: [
      p('<p>এই কোর্সে এখন পর্যন্ত প্রতিটা commit history-র একটা লাইনে ঘটেছে। একটা <b>branch</b> development-কে ভাগ হতে দেয় — একটা নতুন feature চেষ্টা করা, একটা bug ঠিক করা, বা experiment করা — প্রস্তুত না হওয়া পর্যন্ত কাজ করা version স্পর্শ না করেই।</p>'),
      h(2, 'main Branch'),
      p('<p>একটা নতুন repository একটা branch দিয়ে শুরু হয়, প্রচলিতভাবে <code>main</code> নামে (পুরনো project কখনো <code>master</code> ব্যবহার করে) — project-এর স্থিতিশীল, কাজ করা history-র লাইন।</p>'),
      h(2, 'একটা Branch তৈরি করা', 'একটা-branch-তৈরি-করা'),
      code('bash', 'git branch feature-login\n# branch তৈরি করে, কিন্তু এখনো এতে switch করে না'),
      h(2, 'Branch Switch করা', 'branch-switch-করা'),
      code('bash', 'git switch feature-login\n# বা, পুরনো সমতুল্য যা এখনো সবখানে দেখা যায়:\ngit checkout feature-login'),
      h(2, 'এক ধাপে তৈরি ও Switch করা', 'এক-ধাপে-তৈরি-ও-switch-করা'),
      code('bash', 'git switch -c feature-login\n# বা\ngit checkout -b feature-login'),
      h(2, 'Branch List করা', 'branch-list-করা'),
      code('bash', 'git branch\n#   main\n# * feature-login   <- asterisk বর্তমান branch চিহ্নিত করে'),
      h(2, 'একটা Branch-এ কাজ করা', 'একটা-branch-এ-কাজ-করা'),
      p('<p><code>feature-login</code>-এ থাকার সময় করা commit শুধু সেই branch-এ থাকে — <code>main</code>-এ ফিরে switch করলে সেই পরিবর্তনগুলো দেখা থেকে অদৃশ্য হয়ে যায় (delete হয় না, শুধু main-এর history-র অংশ না) branch merge না হওয়া পর্যন্ত, পরের lesson-এ কভার করা।</p>'),
      code('bash', 'git switch feature-login\n# ... পরিবর্তন করুন, git add, git commit ...\ngit switch main\n# feature-login commit এখনো এখানে দেখা যায় না'),
      h(2, 'একটা Branch Delete করা', 'একটা-branch-delete-করা'),
      code('bash', '# নিরাপদ delete — branch-এ unmerged পরিবর্তন থাকলে প্রত্যাখ্যান করে\ngit branch -d feature-login\n\n# Force delete, unmerged পরিবর্তন থাকলেও\ngit branch -D feature-login'),
      callout('tip', '<p>প্রতিটা আসল পরিবর্তনের জন্য — এমনকি একটা ছোটটার জন্যও — একটা branch তৈরি করা প্রায় কিছুই খরচ করে না আর main-কে সবসময় একটা কাজ করা অবস্থায় রাখে। একা এই habit একজন শুরুর দিকের মানুষ যে বেশিরভাগ "আমি সবকিছু ভেঙে ফেলেছি" মুহূর্তে পড়ে তা আটকায়।</p>', 'অবাধে branch করুন'),
    ],
  },
})

// ═══ 7. MERGING BRANCHES ═══════════════════════════════════════════════════

lessons.push({
  slug: 'merging-branches', sortOrder: n++,
  en: {
    title: 'Merging Branches',
    metaTitle: 'Git Merging Branches | Learn Computer Academy',
    metaDescription: 'Bringing a branch\'s changes into another branch — fast-forward merges vs. a real merge commit, and reading what happened afterward.',
    blocks: [
      p('<p>Once work on a branch is ready, <b>merging</b> brings its changes into another branch — usually back into <code>main</code>.</p>'),
      h(2, 'A Basic Merge'),
      code('bash', 'git switch main\ngit merge feature-login\n# Updating a1b2c3d..e5f6g7h\n# Fast-forward\n#  login.php | 20 ++++++++++++++++++\n#  1 file changed, 20 insertions(+)'),
      p('<p>The merge command runs <i>on</i> the branch receiving the changes (<code>main</code>, here), pulling <i>in</i> the named branch (<code>feature-login</code>).</p>'),
      h(2, 'Fast-Forward vs. a Real Merge Commit'),
      table(['Fast-forward merge', 'A real merge commit'], [
        ['main hasn\'t changed since the branch split off', 'Both main and the branch have new commits since they split'],
        ['Git simply moves main\'s pointer forward — no new commit created', 'Git creates a new commit specifically joining the two histories'],
        ['A clean, linear history', 'A history showing exactly where branches diverged and rejoined'],
      ]),
      code('bash', '# Force a real merge commit even when a fast-forward is possible —\n# some teams prefer this for a clearer history of feature branches\ngit merge --no-ff feature-login'),
      h(2, 'Deleting the Branch After Merging'),
      p('<p>Once merged, a feature branch has usually done its job — deleting it keeps the branch list from growing indefinitely.</p>'),
      code('bash', 'git branch -d feature-login'),
      h(2, 'Visualizing the Result'),
      code('bash', 'git log --oneline --graph --all\n# *   f7g8h9i Merge branch \'feature-login\'\n# |\\\n# | * e5f6g7h Add login validation\n# | * d4e5f6g Add login form\n# |/\n# * a1b2c3d Initial commit'),
      callout('note', '<p>A merge that touches the same lines a branch and main both changed can\'t be resolved automatically — that\'s a merge conflict, covered in the next lesson, and it\'s a completely normal part of working with branches, not a sign something went wrong.</p>', 'What happens next if this doesn\'t go cleanly'),
    ],
  },
  bn: {
    title: 'Branch Merge করা',
    metaTitle: 'Git Branch Merge করা | Learn Computer Academy',
    metaDescription: 'একটা branch-এর পরিবর্তন আরেকটা branch-এ আনা — fast-forward merge বনাম একটা আসল merge commit, আর পরে কী ঘটেছে তা পড়া।',
    blocks: [
      p('<p>একটা branch-এ কাজ প্রস্তুত হয়ে গেলে, <b>merging</b> এর পরিবর্তন আরেকটা branch-এ আনে — সাধারণত আবার <code>main</code>-এ।</p>'),
      h(2, 'একটা মৌলিক Merge', 'একটা-মৌলিক-merge'),
      code('bash', 'git switch main\ngit merge feature-login\n# Updating a1b2c3d..e5f6g7h\n# Fast-forward\n#  login.php | 20 ++++++++++++++++++\n#  1 file changed, 20 insertions(+)'),
      p('<p>Merge command পরিবর্তন পাওয়া branch-এ (এখানে, <code>main</code>) চলে, নামযুক্ত branch-কে (<code>feature-login</code>) টেনে <i>নিয়ে আসে</i>।</p>'),
      h(2, 'Fast-Forward বনাম একটা আসল Merge Commit', 'fast-forward-বনাম-একটা-আসল-merge-commit'),
      table(['Fast-forward merge', 'একটা আসল merge commit'], [
        ['Branch আলাদা হওয়ার পর থেকে main বদলায়নি', 'আলাদা হওয়ার পর থেকে main আর branch দুটোতেই নতুন commit আছে'],
        ['Git শুধু main-এর pointer সামনে সরায় — নতুন কোনো commit তৈরি হয় না', 'Git specifically দুটো history জোড়া দেওয়া একটা নতুন commit তৈরি করে'],
        ['একটা পরিষ্কার, linear history', 'ঠিক কোথায় branch আলাদা হয়েছিল আর আবার মিলেছিল দেখানো একটা history'],
      ]),
      code('bash', '# একটা fast-forward সম্ভব হলেও একটা আসল merge commit বাধ্য করুন —\n# কিছু team feature branch-এর একটা স্পষ্ট history-র জন্য এটা পছন্দ করে\ngit merge --no-ff feature-login'),
      h(2, 'Merge-এর পর Branch Delete করা', 'merge-এর-পর-branch-delete-করা'),
      p('<p>একবার merge হয়ে গেলে, একটা feature branch সাধারণত এর কাজ করে ফেলেছে — এটা delete করা branch list-কে অনির্দিষ্টকাল বাড়তে থেকে আটকায়।</p>'),
      code('bash', 'git branch -d feature-login'),
      h(2, 'ফলাফল Visualize করা', 'ফলাফল-visualize-করা'),
      code('bash', 'git log --oneline --graph --all\n# *   f7g8h9i Merge branch \'feature-login\'\n# |\\\n# | * e5f6g7h Add login validation\n# | * d4e5f6g Add login form\n# |/\n# * a1b2c3d Initial commit'),
      callout('note', '<p>একটা branch আর main দুটোই বদলেছে এমন একই লাইন স্পর্শ করা একটা merge স্বয়ংক্রিয়ভাবে সমাধান করা যায় না — এটা একটা merge conflict, পরের lesson-এ কভার করা, আর branch নিয়ে কাজ করার একটা সম্পূর্ণ স্বাভাবিক অংশ, কিছু ভুল হয়েছে তার চিহ্ন না।</p>', 'এটা পরিষ্কারভাবে না গেলে পরে কী ঘটে'),
    ],
  },
})

// ═══ 8. RESOLVING MERGE CONFLICTS ══════════════════════════════════════════

lessons.push({
  slug: 'resolving-merge-conflicts', sortOrder: n++,
  en: {
    title: 'Resolving Merge Conflicts',
    metaTitle: 'Resolving Git Merge Conflicts | Learn Computer Academy',
    metaDescription: 'What a merge conflict actually is, reading Git\'s conflict markers, and the exact steps to resolve one and finish the merge.',
    blocks: [
      p('<p>A <b>merge conflict</b> happens when Git can\'t automatically combine two changes — usually because both branches edited the exact same lines differently. It\'s not an error to be afraid of; it\'s Git correctly refusing to guess.</p>'),
      h(2, 'Triggering One'),
      code('bash', 'git merge feature-login\n# Auto-merging index.html\n# CONFLICT (content): Merge conflict in index.html\n# Automatic merge failed; fix conflicts and then commit the result.'),
      h(2, 'Reading the Conflict Markers'),
      p('<p>Git edits the conflicted file directly, marking both versions.</p>'),
      code('html', '<h1>Welcome</h1>\n<<<<<<< HEAD\n<p>This is the main branch version.</p>\n=======\n<p>This is the feature-login branch version.</p>\n>>>>>>> feature-login'),
      table(['Marker', 'Meaning'], [
        ['<<<<<<< HEAD', 'Start of the current branch\'s version'],
        ['=======', 'Divider between the two versions'],
        ['>>>>>>> feature-login', 'End of the incoming branch\'s version, naming it'],
      ]),
      h(2, 'Resolving It'),
      p('<p>Edit the file by hand — keep one version, keep the other, or write something combining both — and remove every marker line entirely.</p>'),
      code('html', '<h1>Welcome</h1>\n<p>This is the main branch version.</p>'),
      h(2, 'Finishing the Merge'),
      code('bash', 'git add index.html\ngit commit\n# Git pre-fills a merge commit message — usually fine to accept as-is'),
      h(2, 'Checking for Multiple Conflicts'),
      code('bash', '# See every file still needing resolution\ngit status\n# Both modified:   index.html\n# Both modified:   style.css'),
      h(2, 'Backing Out Entirely'),
      p('<p>If a merge goes badly wrong partway through, it can be abandoned completely, returning to the state right before it started.</p>'),
      code('bash', 'git merge --abort'),
      callout('tip', '<p>Most code editors (VS Code among them) show conflict markers with clickable "Accept Current," "Accept Incoming," and "Accept Both" buttons — genuinely worth using instead of editing markers by hand once conflicts happen regularly.</p>', 'A faster way to resolve these in practice'),
    ],
  },
  bn: {
    title: 'Merge Conflict সমাধান করা',
    metaTitle: 'Git Merge Conflict সমাধান করা | Learn Computer Academy',
    metaDescription: 'একটা merge conflict আসলে কী, Git-এর conflict marker পড়া, আর একটা সমাধান করে merge শেষ করার ঠিক ধাপ।',
    blocks: [
      p('<p>একটা <b>merge conflict</b> ঘটে যখন Git স্বয়ংক্রিয়ভাবে দুটো পরিবর্তন একসাথে করতে পারে না — সাধারণত কারণ দুটো branch-ই ঠিক একই লাইন ভিন্নভাবে edit করেছে। এটা ভয় পাওয়ার মতো একটা error না; এটা Git সঠিকভাবে অনুমান করতে অস্বীকার করছে।</p>'),
      h(2, 'একটা Trigger করা', 'একটা-trigger-করা'),
      code('bash', 'git merge feature-login\n# Auto-merging index.html\n# CONFLICT (content): Merge conflict in index.html\n# Automatic merge failed; fix conflicts and then commit the result.'),
      h(2, 'Conflict Marker পড়া', 'conflict-marker-পড়া'),
      p('<p>Git সরাসরি conflict-এ থাকা file edit করে, দুটো version চিহ্নিত করে।</p>'),
      code('html', '<h1>Welcome</h1>\n<<<<<<< HEAD\n<p>This is the main branch version.</p>\n=======\n<p>This is the feature-login branch version.</p>\n>>>>>>> feature-login'),
      table(['Marker', 'মানে'], [
        ['<<<<<<< HEAD', 'বর্তমান branch-এর version-এর শুরু'],
        ['=======', 'দুটো version-এর মধ্যে বিভাজক'],
        ['>>>>>>> feature-login', 'আসা branch-এর version-এর শেষ, এর নাম দিয়ে'],
      ]),
      h(2, 'এটা সমাধান করা', 'এটা-সমাধান-করা'),
      p('<p>হাতে file edit করুন — একটা version রাখুন, অন্যটা রাখুন, বা দুটো মিলিয়ে কিছু লিখুন — আর প্রতিটা marker লাইন সম্পূর্ণভাবে সরান।</p>'),
      code('html', '<h1>Welcome</h1>\n<p>This is the main branch version.</p>'),
      h(2, 'Merge শেষ করা', 'merge-শেষ-করা'),
      code('bash', 'git add index.html\ngit commit\n# Git একটা merge commit message আগে থেকে পূরণ করে — সাধারণত যেমন আছে তেমন accept করা ঠিক'),
      h(2, 'একাধিক Conflict Check করা', 'একাধিক-conflict-check-করা'),
      code('bash', '# এখনো সমাধান দরকার এমন প্রতিটা file দেখুন\ngit status\n# Both modified:   index.html\n# Both modified:   style.css'),
      h(2, 'সম্পূর্ণভাবে ফিরে যাওয়া', 'সম্পূর্ণভাবে-ফিরে-যাওয়া'),
      p('<p>একটা merge মাঝপথে খারাপভাবে ভুল হয়ে গেলে, এটা সম্পূর্ণভাবে ছেড়ে দেওয়া যায়, এটা শুরু হওয়ার ঠিক আগের অবস্থায় ফিরে গিয়ে।</p>'),
      code('bash', 'git merge --abort'),
      callout('tip', '<p>বেশিরভাগ code editor (তাদের মধ্যে VS Code) click-করা-যায় "Accept Current," "Accept Incoming," আর "Accept Both" button সহ conflict marker দেখায় — conflict নিয়মিত ঘটতে শুরু করলে হাতে marker edit করার বদলে সত্যিকারভাবে ব্যবহারের যোগ্য।</p>', 'বাস্তবে এগুলো সমাধানের একটা দ্রুত উপায়'),
    ],
  },
})

// ═══ 9. UNDOING CHANGES ═════════════════════════════════════════════════════

lessons.push({
  slug: 'undoing-changes', sortOrder: n++,
  en: {
    title: 'Undoing Changes — checkout, reset, revert',
    metaTitle: 'Undoing Changes in Git | Learn Computer Academy',
    metaDescription: 'Three different ways to undo something in Git, each for a different situation — discarding an uncommitted edit, rewinding history, and safely undoing a shared commit.',
    blocks: [
      p('<p>Git offers several distinct ways to undo something — picking the right one depends on exactly what needs undoing, and whether it\'s already been shared with anyone else.</p>'),
      h(2, 'Discarding an Uncommitted Change'),
      code('bash', '# Discard changes to one file, back to the last commit\ngit checkout -- index.html\n# or, the newer equivalent:\ngit restore index.html'),
      callout('warning', '<p>This permanently discards the uncommitted change — there\'s no undo for an undo here. Worth double-checking git diff first to see exactly what would be lost.</p>', 'This one is irreversible'),
      h(2, 'Unstaging a File'),
      code('bash', '# Move a staged file back to just "modified" — the change itself is kept\ngit restore --staged index.html'),
      h(2, 'git reset — Rewinding History'),
      p('<p>Moves the current branch pointer backward, with three levels of how much gets undone along with it.</p>'),
      table(['Reset type', 'What happens to the changes'], [
        ['git reset --soft HEAD~1', 'The last commit is undone, but its changes stay staged'],
        ['git reset --mixed HEAD~1 (the default)', 'The last commit is undone, changes stay in the working folder but unstaged'],
        ['git reset --hard HEAD~1', 'The last commit AND its changes are both gone entirely'],
      ]),
      callout('danger', '<p>git reset --hard discards work with no recovery through normal means. Never run it without being certain — and never on a commit that\'s already been pushed and shared with others, covered below.</p>', 'The most dangerous command in this lesson'),
      h(2, 'git revert — Safely Undoing a Shared Commit'),
      p('<p>Rather than erasing a commit from history, <code>revert</code> creates a brand-new commit that undoes its changes — the original commit stays in history, which is exactly what\'s needed once a commit has already been pushed and others may have it.</p>'),
      code('bash', 'git revert a1b2c3d\n# Creates a new commit that undoes commit a1b2c3d\'s changes'),
      h(2, 'Choosing the Right Tool'),
      table(['Situation', 'Use'], [
        ['An uncommitted change, not staged yet', 'git restore'],
        ['A commit made locally, never pushed or shared', 'git reset'],
        ['A commit already pushed and possibly shared with others', 'git revert — never reset a shared commit'],
      ]),
    ],
  },
  bn: {
    title: 'পরিবর্তন Undo করা — checkout, reset, revert',
    metaTitle: 'Git-এ পরিবর্তন Undo করা | Learn Computer Academy',
    metaDescription: 'Git-এ কিছু undo করার তিনটা ভিন্ন উপায়, প্রতিটা একটা ভিন্ন পরিস্থিতির জন্য — একটা uncommitted edit বাতিল করা, history rewind করা, আর নিরাপদে একটা শেয়ার করা commit undo করা।',
    blocks: [
      p('<p>Git কিছু undo করার বেশ কয়েকটা distinct উপায় দেয় — সঠিকটা বেছে নেওয়া নির্ভর করে ঠিক কী undo করা দরকার তার উপর, আর এটা ইতিমধ্যে অন্য কারো সাথে শেয়ার হয়েছে কিনা।</p>'),
      h(2, 'একটা Uncommitted পরিবর্তন বাতিল করা', 'একটা-uncommitted-পরিবর্তন-বাতিল-করা'),
      code('bash', '# একটা file-এর পরিবর্তন বাতিল করুন, শেষ commit-এ ফিরে\ngit checkout -- index.html\n# বা, নতুন সমতুল্য:\ngit restore index.html'),
      callout('warning', '<p>এটা স্থায়ীভাবে uncommitted পরিবর্তন বাতিল করে — এখানে একটা undo-র জন্য কোনো undo নেই। ঠিক কী হারানো যাবে তা দেখতে আগে git diff দুবার check করার যোগ্য।</p>', 'এটা irreversible'),
      h(2, 'একটা File Unstage করা', 'একটা-file-unstage-করা'),
      code('bash', '# একটা staged file আবার শুধু "modified"-এ ফিরিয়ে নিন — পরিবর্তনটা নিজে রাখা হয়\ngit restore --staged index.html'),
      h(2, 'git reset — History Rewind করা', 'git-reset-history-rewind-করা'),
      p('<p>বর্তমান branch pointer-কে পেছনে সরায়, এর সাথে কতটা undo হয় তার তিনটা level সহ।</p>'),
      table(['Reset ধরন', 'পরিবর্তনগুলোর কী হয়'], [
        ['git reset --soft HEAD~1', 'শেষ commit undo হয়, কিন্তু এর পরিবর্তন staged থেকে যায়'],
        ['git reset --mixed HEAD~1 (default)', 'শেষ commit undo হয়, পরিবর্তন working folder-এ থাকে কিন্তু unstaged'],
        ['git reset --hard HEAD~1', 'শেষ commit আর এর পরিবর্তন দুটোই সম্পূর্ণভাবে চলে যায়'],
      ]),
      callout('danger', '<p>git reset --hard সাধারণ উপায়ে কোনো recovery ছাড়াই কাজ বাতিল করে। নিশ্চিত না হয়ে কখনো এটা চালাবেন না — আর কখনো এমন একটা commit-এ না যা ইতিমধ্যে push হয়ে অন্যদের সাথে শেয়ার হয়েছে, নিচে কভার করা।</p>', 'এই lesson-এর সবচেয়ে বিপজ্জনক command'),
      h(2, 'git revert — নিরাপদে একটা Shared Commit Undo করা', 'git-revert-নিরাপদে-একটা-shared-commit-undo-করা'),
      p('<p>History থেকে একটা commit মুছে ফেলার বদলে, <code>revert</code> একটা একদম নতুন commit তৈরি করে যা এর পরিবর্তন undo করে — আসল commit history-তে থাকে, যা ঠিক দরকার একবার একটা commit ইতিমধ্যে push হয়ে গেলে আর অন্যদের কাছে থাকলে।</p>'),
      code('bash', 'git revert a1b2c3d\n# commit a1b2c3d-এর পরিবর্তন undo করে একটা নতুন commit তৈরি করে'),
      h(2, 'সঠিক Tool বেছে নেওয়া', 'সঠিক-tool-বেছে-নেওয়া'),
      table(['পরিস্থিতি', 'ব্যবহার করুন'], [
        ['একটা uncommitted পরিবর্তন, এখনো staged না', 'git restore'],
        ['locally করা একটা commit, কখনো push বা শেয়ার হয়নি', 'git reset'],
        ['ইতিমধ্যে push হওয়া আর হয়তো অন্যদের সাথে শেয়ার হওয়া একটা commit', 'git revert — কখনো একটা shared commit reset করবেন না'],
      ]),
    ],
  },
})

// ═══ 10. STASHING CHANGES ═══════════════════════════════════════════════════

lessons.push({
  slug: 'stashing-changes', sortOrder: n++,
  en: {
    title: 'Stashing Changes',
    metaTitle: 'Git Stash | Learn Computer Academy',
    metaDescription: 'Temporarily setting aside uncommitted work to switch branches cleanly, without committing something half-finished.',
    blocks: [
      p('<p>Switching branches with uncommitted changes in the way is a common snag — <code>git stash</code> temporarily shelves those changes without committing them, so a branch switch can happen cleanly.</p>'),
      h(2, 'A Basic Stash'),
      code('bash', 'git status\n# modified: index.html (not staged)\n\ngit stash\n# Saved working directory and index state WIP on main: a1b2c3d Add README\n\ngit status\n# nothing to commit, working tree clean'),
      h(2, 'Bringing It Back'),
      code('bash', 'git stash pop\n# Restores the most recent stash AND removes it from the stash list'),
      h(2, 'Keeping the Stash Around'),
      code('bash', '# Restore it but keep the stash entry too, for applying elsewhere\ngit stash apply'),
      h(2, 'Stashing More Than One Thing'),
      code('bash', 'git stash list\n# stash@{0}: WIP on main: a1b2c3d Add README\n# stash@{1}: WIP on feature-login: e5f6g7h Add form\n\ngit stash apply stash@{1}   # apply a specific one, not just the most recent'),
      h(2, 'Naming a Stash'),
      code('bash', 'git stash push -m "Half-finished login validation"'),
      h(2, 'Discarding a Stash'),
      code('bash', 'git stash drop stash@{0}\n\n# Discard every stash entry\ngit stash clear'),
      callout('tip', '<p>A typical real use: mid-way through a change, an urgent bug needs fixing on main right now. git stash, switch to main, fix the bug, switch back, git stash pop — the half-finished work resumes exactly where it was left.</p>', 'The classic use case'),
    ],
  },
  bn: {
    title: 'পরিবর্তন Stash করা',
    metaTitle: 'Git Stash | Learn Computer Academy',
    metaDescription: 'অর্ধেক-শেষ কিছু commit না করে পরিষ্কারভাবে branch switch করতে সাময়িকভাবে uncommitted কাজ সরিয়ে রাখা।',
    blocks: [
      p('<p>পথে uncommitted পরিবর্তন থাকা অবস্থায় branch switch করা একটা common সমস্যা — <code>git stash</code> সাময়িকভাবে সেই পরিবর্তনগুলো commit না করেই তাক তুলে রাখে, যাতে একটা branch switch পরিষ্কারভাবে ঘটতে পারে।</p>'),
      h(2, 'একটা মৌলিক Stash', 'একটা-মৌলিক-stash'),
      code('bash', 'git status\n# modified: index.html (not staged)\n\ngit stash\n# Saved working directory and index state WIP on main: a1b2c3d Add README\n\ngit status\n# nothing to commit, working tree clean'),
      h(2, 'এটা ফিরিয়ে আনা', 'এটা-ফিরিয়ে-আনা'),
      code('bash', 'git stash pop\n# সবচেয়ে সাম্প্রতিক stash ফিরিয়ে আনে আর stash list থেকে সরায়'),
      h(2, 'Stash রেখে দেওয়া', 'stash-রেখে-দেওয়া'),
      code('bash', '# এটা ফিরিয়ে আনুন কিন্তু stash entry-ও রাখুন, অন্য কোথাও apply করার জন্য\ngit stash apply'),
      h(2, 'একাধিক জিনিস Stash করা', 'একাধিক-জিনিস-stash-করা'),
      code('bash', 'git stash list\n# stash@{0}: WIP on main: a1b2c3d Add README\n# stash@{1}: WIP on feature-login: e5f6g7h Add form\n\ngit stash apply stash@{1}   # শুধু সবচেয়ে সাম্প্রতিকটা না, একটা নির্দিষ্টটা apply করুন'),
      h(2, 'একটা Stash-এর নাম দেওয়া', 'একটা-stash-এর-নাম-দেওয়া'),
      code('bash', 'git stash push -m "Half-finished login validation"'),
      h(2, 'একটা Stash বাতিল করা', 'একটা-stash-বাতিল-করা'),
      code('bash', 'git stash drop stash@{0}\n\n# প্রতিটা stash entry বাতিল করুন\ngit stash clear'),
      callout('tip', '<p>একটা সাধারণ আসল ব্যবহার: একটা পরিবর্তনের মাঝপথে, main-এ এখনই একটা জরুরি bug ঠিক করা দরকার। git stash, main-এ switch, bug ঠিক করুন, ফিরে switch, git stash pop — অর্ধেক-শেষ কাজ ঠিক যেখানে ছাড়া হয়েছিল সেখান থেকে আবার শুরু হয়।</p>', 'ক্লাসিক use case'),
    ],
  },
})

// ═══ 11. INTRODUCTION TO GITHUB ═════════════════════════════════════════════

lessons.push({
  slug: 'introduction-to-github', sortOrder: n++,
  en: {
    title: 'Introduction to GitHub',
    metaTitle: 'Introduction to GitHub | Learn Computer Academy',
    metaDescription: 'What GitHub adds on top of Git — hosting a repository online, and the anatomy of a repository page.',
    blocks: [
      p('<p>Every lesson so far worked entirely on one machine. GitHub hosts a Git repository online — making it reachable from anywhere, shareable with others, and the platform most real collaboration (and most job applications\' portfolio links) actually happens on.</p>'),
      h(2, 'Creating a Free Account'),
      p('<p>github.com offers a free tier covering everything this course needs — unlimited public and private repositories, issues, and pull requests.</p>'),
      h(2, 'The Anatomy of a Repository Page'),
      table(['Element', 'What it shows'], [
        ['Code tab', 'The file browser and the clone URL'],
        ['README', 'Rendered automatically below the file list if a README.md exists — usually a project\'s first impression'],
        ['Issues tab', 'Bug reports and feature requests — covered in a later lesson'],
        ['Pull requests tab', 'Proposed changes awaiting review — covered in a later lesson'],
        ['Stars', 'A lightweight "bookmark and endorse" signal from other users'],
        ['Forks', 'How many people have copied the repository to their own account'],
      ]),
      h(2, 'Public vs. Private Repositories'),
      table(['Public', 'Private'], [
        ['Anyone can view the code', 'Only invited collaborators can view it'],
        ['Good for a portfolio piece, open-source work', 'Good for client work, anything with real secrets or sensitive logic'],
        ['Free, unlimited', 'Also free and unlimited on GitHub\'s current free tier'],
      ]),
      callout('tip', '<p>A public GitHub profile with real, working repositories is one of the most concrete pieces of proof a beginner developer can show — covered directly in this site\'s Career Skills course.</p>', 'Why this matters beyond just backups'),
    ],
  },
  bn: {
    title: 'GitHub-এর পরিচয়',
    metaTitle: 'GitHub-এর পরিচয় | Learn Computer Academy',
    metaDescription: 'Git-এর উপরে GitHub যা যোগ করে — একটা repository অনলাইনে host করা, আর একটা repository page-এর গঠন।',
    blocks: [
      p('<p>এখন পর্যন্ত প্রতিটা lesson সম্পূর্ণভাবে একটা machine-এ কাজ করেছে। GitHub একটা Git repository অনলাইনে host করে — এটাকে যেকোনো জায়গা থেকে পৌঁছানো যায়, অন্যদের সাথে শেয়ার করা যায়, আর যে platform-এ বেশিরভাগ আসল collaboration (আর বেশিরভাগ চাকরির আবেদনের portfolio link) আসলে ঘটে।</p>'),
      h(2, 'একটা ফ্রি Account তৈরি করা', 'একটা-ফ্রি-account-তৈরি-করা'),
      p('<p>github.com এই কোর্সের দরকার সবকিছু কভার করা একটা ফ্রি tier দেয় — অসীম public আর private repository, issue, আর pull request।</p>'),
      h(2, 'একটা Repository Page-এর গঠন', 'একটা-repository-page-এর-গঠন'),
      table(['Element', 'যা দেখায়'], [
        ['Code tab', 'File browser আর clone URL'],
        ['README', 'একটা README.md থাকলে file list-এর নিচে স্বয়ংক্রিয়ভাবে render হয় — সাধারণত একটা project-এর প্রথম impression'],
        ['Issues tab', 'Bug report আর feature request — পরের একটা lesson-এ কভার করা'],
        ['Pull requests tab', 'Review-এর অপেক্ষায় থাকা প্রস্তাবিত পরিবর্তন — পরের একটা lesson-এ কভার করা'],
        ['Star', 'অন্য user-দের থেকে একটা হালকা "bookmark আর endorse" signal'],
        ['Fork', 'কতজন মানুষ repository তাদের নিজের account-এ copy করেছে'],
      ]),
      h(2, 'Public বনাম Private Repository', 'public-বনাম-private-repository'),
      table(['Public', 'Private'], [
        ['যে কেউ কোড দেখতে পারে', 'শুধু invite করা collaborator এটা দেখতে পারে'],
        ['একটা portfolio piece, open-source কাজের জন্য ভালো', 'Client কাজের জন্য ভালো, আসল secret বা sensitive logic সহ যেকোনো কিছু'],
        ['ফ্রি, অসীম', 'GitHub-এর বর্তমান ফ্রি tier-এও ফ্রি আর অসীম'],
      ]),
      callout('tip', '<p>আসল, কাজ করা repository সহ একটা public GitHub profile একজন শুরুর দিকের developer দেখাতে পারা প্রমাণের সবচেয়ে concrete টুকরাগুলোর একটা — এই সাইটের Career Skills কোর্সে সরাসরি কভার করা।</p>', 'শুধু backup-এর বাইরে কেন এটা গুরুত্বপূর্ণ'),
    ],
  },
})

// ═══ 12. REMOTES — CLONE, PUSH, PULL, FETCH ═════════════════════════════════

lessons.push({
  slug: 'remotes-clone-push-pull', sortOrder: n++,
  en: {
    title: 'Remotes — Clone, Push, Pull, and Fetch',
    metaTitle: 'Git Remotes — Clone, Push, Pull, Fetch | Learn Computer Academy',
    metaDescription: 'Connecting a local repository to GitHub — downloading an existing project, sending local commits up, and getting others\' commits back down.',
    blocks: [
      p('<p>A <b>remote</b> is a repository hosted elsewhere — usually on GitHub — that a local repository stays connected to.</p>'),
      h(2, 'git clone — Downloading an Existing Repository'),
      code('bash', 'git clone https://github.com/username/repo-name.git\ncd repo-name\n# A complete copy, full history included, ready to work on'),
      h(2, 'Connecting an Existing Local Repository to GitHub'),
      p('<p>For a project that started with <code>git init</code> locally, rather than a clone — create an empty repository on GitHub first, then connect it.</p>'),
      code('bash', 'git remote add origin https://github.com/username/repo-name.git\ngit branch -M main\ngit push -u origin main'),
      p('<p><code>origin</code> is the conventional name for a repository\'s primary remote — not a special keyword, just the default everyone uses.</p>'),
      h(2, 'git push — Sending Local Commits Up'),
      code('bash', 'git push\n# Sends commits on the current branch to the remote\n\n# First push of a new branch needs -u (short for --set-upstream)\n# to link the local and remote branch together, once:\ngit push -u origin feature-login\n# Every push after that, on that branch, can just be: git push'),
      h(2, 'git pull — Getting Others\' Commits Down'),
      code('bash', 'git pull\n# Downloads new commits from the remote and merges them into the current branch\n# Equivalent to: git fetch, then git merge'),
      h(2, 'git fetch — Downloading Without Merging'),
      p('<p>Downloads what changed on the remote without touching local files — useful for seeing what\'s new before deciding whether to merge it in.</p>'),
      code('bash', 'git fetch\ngit log origin/main   # see what\'s new on the remote before pulling it in'),
      h(2, 'Checking Configured Remotes'),
      code('bash', 'git remote -v\n# origin  https://github.com/username/repo-name.git (fetch)\n# origin  https://github.com/username/repo-name.git (push)'),
      table(['Command', 'Direction'], [
        ['git clone', 'Remote -> new local copy'],
        ['git push', 'Local -> remote'],
        ['git pull / git fetch', 'Remote -> local'],
      ]),
    ],
  },
  bn: {
    title: 'Remote — Clone, Push, Pull, ও Fetch',
    metaTitle: 'Git Remote — Clone, Push, Pull, Fetch | Learn Computer Academy',
    metaDescription: 'একটা local repository-কে GitHub-এর সাথে সংযুক্ত করা — একটা বিদ্যমান project download করা, local commit উপরে পাঠানো, আর অন্যদের commit নিচে ফিরিয়ে আনা।',
    blocks: [
      p('<p>একটা <b>remote</b> অন্য কোথাও host করা একটা repository — সাধারণত GitHub-এ — যার সাথে একটা local repository সংযুক্ত থাকে।</p>'),
      h(2, 'git clone — একটা বিদ্যমান Repository Download করা', 'git-clone-একটা-বিদ্যমান-repository-download-করা'),
      code('bash', 'git clone https://github.com/username/repo-name.git\ncd repo-name\n# একটা সম্পূর্ণ কপি, পূর্ণ history সহ, কাজ করার জন্য প্রস্তুত'),
      h(2, 'একটা বিদ্যমান Local Repository-কে GitHub-এর সাথে সংযুক্ত করা', 'একটা-বিদ্যমান-local-repository-কে-github-এর-সাথে-সংযুক্ত-করা'),
      p('<p>একটা clone-এর বদলে locally <code>git init</code> দিয়ে শুরু হওয়া একটা project-এর জন্য — প্রথমে GitHub-এ একটা খালি repository তৈরি করুন, তারপর এটা সংযুক্ত করুন।</p>'),
      code('bash', 'git remote add origin https://github.com/username/repo-name.git\ngit branch -M main\ngit push -u origin main'),
      p('<p><code>origin</code> একটা repository-র প্রধান remote-এর জন্য প্রচলিত নাম — কোনো বিশেষ keyword না, শুধু সবাই ব্যবহার করা default।</p>'),
      h(2, 'git push — Local Commit উপরে পাঠানো', 'git-push-local-commit-উপরে-পাঠানো'),
      code('bash', 'git push\n# বর্তমান branch-এর commit remote-এ পাঠায়\n\n# একটা নতুন branch-এর প্রথম push-এর জন্য একবার local আর remote\n# branch একসাথে জোড়া দিতে -u (--set-upstream-এর সংক্ষিপ্ত) দরকার:\ngit push -u origin feature-login\n# এর পরে, সেই branch-এ প্রতিটা push শুধু হতে পারে: git push'),
      h(2, 'git pull — অন্যদের Commit নিচে আনা', 'git-pull-অন্যদের-commit-নিচে-আনা'),
      code('bash', 'git pull\n# remote থেকে নতুন commit download করে বর্তমান branch-এ merge করে\n# সমতুল্য: git fetch, তারপর git merge'),
      h(2, 'git fetch — Merge না করে Download করা', 'git-fetch-merge-না-করে-download-করা'),
      p('<p>Local file স্পর্শ না করে remote-এ কী বদলেছে download করে — এটা merge করবেন কিনা ঠিক করার আগে নতুন কী আছে দেখার জন্য useful।</p>'),
      code('bash', 'git fetch\ngit log origin/main   # merge করার আগে remote-এ নতুন কী আছে দেখুন'),
      h(2, 'Configure করা Remote Check করা', 'configure-করা-remote-check-করা'),
      code('bash', 'git remote -v\n# origin  https://github.com/username/repo-name.git (fetch)\n# origin  https://github.com/username/repo-name.git (push)'),
      table(['Command', 'দিক'], [
        ['git clone', 'Remote -> নতুন local কপি'],
        ['git push', 'Local -> remote'],
        ['git pull / git fetch', 'Remote -> local'],
      ]),
    ],
  },
})

// ═══ 13. CREATING A GITHUB REPOSITORY (screenshot lesson) ═══════════════════

lessons.push({
  slug: 'creating-a-github-repository', sortOrder: n++,
  en: {
    title: 'Creating a GitHub Repository',
    metaTitle: 'Creating a GitHub Repository | Learn Computer Academy',
    metaDescription: 'Walking through GitHub\'s "Create a new repository" screen — naming, visibility, and the README/gitignore/license checkboxes.',
    blocks: [
      p('<p>Starting a repository on GitHub itself — rather than pushing a local one up, as the previous lesson covered — is the more common starting point for a brand-new project.</p>'),
      h(2, 'The "New Repository" Screen'),
      p('<p>From the "+" menu at the top of any GitHub page, or the green "New" button on the repositories tab.</p>'),
      h(2, 'The Fields That Matter'),
      table(['Field', 'What it does'], [
        ['Repository name', 'Becomes part of the repo\'s URL — lowercase-with-dashes is the near-universal convention'],
        ['Description', 'Shows under the repo name everywhere it\'s listed — worth writing even if optional'],
        ['Public / Private', 'Covered in the Introduction to GitHub lesson'],
        ['Add a README file', 'Creates a starter README.md immediately — usually worth checking'],
        ['Add .gitignore', 'GitHub offers a pre-built template for dozens of languages/frameworks — a fast start on the earlier .gitignore lesson\'s file'],
        ['Choose a license', 'Only matters for a public repo meant to be reused by others — MIT is the common, permissive default'],
      ]),
      h(2, 'Cloning the New Repository Locally'),
      code('bash', 'git clone https://github.com/username/new-repo-name.git\ncd new-repo-name\n# Start working — the README/gitignore/license chosen above are already there'),
      callout('tip', '<p>Checking "Add a README" and picking a .gitignore template when creating a repo through GitHub\'s own form saves the manual setup work the earlier lessons in this course did by hand — both approaches end up in the same place.</p>', 'The fast path vs. the from-scratch path'),
    ],
  },
  bn: {
    title: 'একটা GitHub Repository তৈরি করা',
    metaTitle: 'একটা GitHub Repository তৈরি করা | Learn Computer Academy',
    metaDescription: 'GitHub-এর "Create a new repository" screen-এর মধ্য দিয়ে যাওয়া — naming, visibility, আর README/gitignore/license checkbox।',
    blocks: [
      p('<p>GitHub-এই একটা repository শুরু করা — আগের lesson-এ কভার করা একটা local repository উপরে পাঠানোর বদলে — একদম নতুন একটা project-এর জন্য বেশি common শুরুর পয়েন্ট।</p>'),
      h(2, '"New Repository" Screen'),
      p('<p>যেকোনো GitHub page-এর উপরের "+" menu থেকে, বা repositories tab-এর সবুজ "New" button থেকে।</p>'),
      h(2, 'গুরুত্বপূর্ণ Field', 'গুরুত্বপূর্ণ-field'),
      table(['Field', 'কী করে'], [
        ['Repository name', 'repo-র URL-এর অংশ হয়ে যায় — lowercase-with-dashes প্রায় সর্বজনীন convention'],
        ['Description', 'এটা list হওয়া সবখানে repo নামের নিচে দেখায় — optional হলেও লেখার যোগ্য'],
        ['Public / Private', 'Introduction to GitHub lesson-এ কভার করা'],
        ['Add a README file', 'সাথে সাথে একটা starter README.md তৈরি করে — সাধারণত check করার যোগ্য'],
        ['Add .gitignore', 'GitHub ডজন ডজন ভাষা/framework-এর জন্য একটা pre-built template দেয় — আগের .gitignore lesson-এর file-এর একটা দ্রুত শুরু'],
        ['Choose a license', 'শুধু একটা public repo-র জন্য গুরুত্বপূর্ণ যা অন্যরা reuse করবে বলে বানানো — MIT common, permissive default'],
      ]),
      h(2, 'নতুন Repository Locally Clone করা', 'নতুন-repository-locally-clone-করা'),
      code('bash', 'git clone https://github.com/username/new-repo-name.git\ncd new-repo-name\n# কাজ শুরু করুন — উপরে বেছে নেওয়া README/gitignore/license ইতিমধ্যে সেখানে আছে'),
      callout('tip', '<p>GitHub-এর নিজের form দিয়ে একটা repo তৈরি করার সময় "Add a README" check করা আর একটা .gitignore template বেছে নেওয়া এই কোর্সের আগের lesson হাতে করা manual setup কাজ বাঁচায় — দুটো approach একই জায়গায় শেষ হয়।</p>', 'দ্রুত পথ বনাম শুরু-থেকে পথ'),
    ],
  },
})

// ═══ 14. FORKING AND PULL REQUESTS (screenshot lesson) ═══════════════════════

lessons.push({
  slug: 'forking-and-pull-requests', sortOrder: n++,
  en: {
    title: 'Forking and Pull Requests',
    metaTitle: 'GitHub Forking and Pull Requests | Learn Computer Academy',
    metaDescription: 'Contributing to a project without direct write access — forking a repository, making changes, and opening a pull request for review.',
    blocks: [
      p('<p>A <b>fork</b> is a personal copy of someone else\'s repository, made on GitHub — the standard way to contribute to a project without needing direct write access to the original.</p>'),
      h(2, 'The Contribution Flow'),
      table(['Step', 'What happens'], [
        ['1. Fork', 'Click "Fork" on the original repo — GitHub creates a full copy under your own account'],
        ['2. Clone your fork', 'git clone your-fork-url — work on it locally, just like any other repository'],
        ['3. Branch and commit', 'Create a branch for the change, commit as usual — the earlier branching lessons apply directly'],
        ['4. Push to your fork', 'git push — sends the commits to your copy, not the original'],
        ['5. Open a pull request', 'From GitHub, propose merging your fork\'s branch into the original repository'],
      ]),
      h(2, 'What a Pull Request Actually Is'),
      p('<p>A <b>pull request</b> (PR) is a request to merge one branch into another, with a diff view, a comment thread, and (often) automated checks — the review step before code becomes part of the main project.</p>'),
      h(2, 'Reading a Pull Request Page'),
      table(['Section', 'Shows'], [
        ['Conversation tab', 'The description and every comment on the PR'],
        ['Commits tab', 'Every individual commit included in the PR'],
        ['Files changed tab', 'A full diff of every file touched — the same +/- format from the earlier git diff lesson'],
        ['Merge button', 'Available once checks pass and (usually) a reviewer approves'],
      ]),
      h(2, 'Keeping a Fork Updated'),
      p('<p>The original repository keeps moving after a fork is made — pulling in its new changes keeps a fork from falling behind.</p>'),
      code('bash', 'git remote add upstream https://github.com/original-owner/repo-name.git\ngit fetch upstream\ngit merge upstream/main'),
      callout('tip', '<p>A pull request doesn\'t need to be "finished" before opening it — a draft PR, opened early with a clear note that it\'s a work in progress, is a completely normal and welcomed way to get early feedback on direction before investing more time.</p>', 'Opening a PR early is fine'),
    ],
  },
  bn: {
    title: 'Forking ও Pull Request',
    metaTitle: 'GitHub Forking ও Pull Request | Learn Computer Academy',
    metaDescription: 'সরাসরি write access ছাড়া একটা project-এ contribute করা — একটা repository fork করা, পরিবর্তন করা, আর review-এর জন্য একটা pull request খোলা।',
    blocks: [
      p('<p>একটা <b>fork</b> GitHub-এ তৈরি করা অন্য কারো repository-র একটা personal কপি — আসলটাতে সরাসরি write access দরকার ছাড়াই একটা project-এ contribute করার standard উপায়।</p>'),
      h(2, 'Contribution Flow'),
      table(['ধাপ', 'কী ঘটে'], [
        ['1. Fork', 'আসল repo-তে "Fork" click করুন — GitHub আপনার নিজের account-এ একটা পূর্ণ কপি তৈরি করে'],
        ['2. আপনার fork Clone করুন', 'git clone your-fork-url — locally এতে কাজ করুন, অন্য যেকোনো repository-র মতোই'],
        ['3. Branch ও commit', 'পরিবর্তনের জন্য একটা branch তৈরি করুন, সাধারণত commit করুন — আগের branching lesson সরাসরি প্রযোজ্য'],
        ['4. আপনার Fork-এ Push করুন', 'git push — আসলটায় না, আপনার কপিতে commit পাঠায়'],
        ['5. একটা Pull Request খুলুন', 'GitHub থেকে, আপনার fork-এর branch আসল repository-তে merge করার প্রস্তাব দিন'],
      ]),
      h(2, 'একটা Pull Request আসলে কী', 'একটা-pull-request-আসলে-কী'),
      p('<p>একটা <b>pull request</b> (PR) একটা branch-কে আরেকটাতে merge করার একটা request, একটা diff view, একটা comment thread, আর (প্রায়ই) automated check সহ — কোড main project-এর অংশ হওয়ার আগের review step।</p>'),
      h(2, 'একটা Pull Request Page পড়া', 'একটা-pull-request-page-পড়া'),
      table(['Section', 'যা দেখায়'], [
        ['Conversation tab', 'বর্ণনা আর PR-এর প্রতিটা comment'],
        ['Commits tab', 'PR-এ অন্তর্ভুক্ত প্রতিটা আলাদা commit'],
        ['Files changed tab', 'স্পর্শ করা প্রতিটা file-এর একটা পূর্ণ diff — আগের git diff lesson-এর একই +/- format'],
        ['Merge button', 'Check pass আর (সাধারণত) একজন reviewer approve করলে উপলব্ধ'],
      ]),
      h(2, 'একটা Fork আপডেট রাখা', 'একটা-fork-আপডেট-রাখা'),
      p('<p>একটা fork তৈরি হওয়ার পর আসল repository চলতে থাকে — এর নতুন পরিবর্তন pull করা একটা fork-কে পিছিয়ে পড়া থেকে আটকায়।</p>'),
      code('bash', 'git remote add upstream https://github.com/original-owner/repo-name.git\ngit fetch upstream\ngit merge upstream/main'),
      callout('tip', '<p>খোলার আগে একটা pull request "শেষ" হতে হবে না — এটা একটা কাজ-চলছে তার একটা স্পষ্ট note সহ আগেই খোলা একটা draft PR, বেশি সময় বিনিয়োগ করার আগে direction নিয়ে early feedback পাওয়ার একটা সম্পূর্ণ স্বাভাবিক আর স্বাগত জানানো উপায়।</p>', 'একটা PR আগেই খোলা ঠিক আছে'),
    ],
  },
})

// ═══ 15. GITHUB ISSUES AND PROJECT BOARDS (screenshot lesson) ════════════════

lessons.push({
  slug: 'github-issues', sortOrder: n++,
  en: {
    title: 'GitHub Issues and Project Boards',
    metaTitle: 'GitHub Issues and Project Boards | Learn Computer Academy',
    metaDescription: 'Tracking bugs, feature requests, and tasks directly inside a GitHub repository — labels, assignees, linking issues to commits, and a lightweight project board.',
    blocks: [
      p('<p>An <b>issue</b> is a tracked item on a repository — a bug report, a feature request, or a task — living alongside the code itself rather than in a separate tool.</p>'),
      h(2, 'Creating an Issue'),
      p('<p>From a repository\'s Issues tab, "New issue" — a title, a description (Markdown supported, same as a README), and optional labels/assignee.</p>'),
      h(2, 'Organizing Issues'),
      table(['Feature', 'Purpose'], [
        ['Labels', 'Categorize — bug, enhancement, documentation, good first issue'],
        ['Assignees', 'Who\'s responsible for it'],
        ['Milestones', 'Group issues toward a specific release or deadline'],
        ['Comments', 'Discussion thread, same as a pull request\'s'],
      ]),
      h(2, 'Linking an Issue to a Commit or PR'),
      p('<p>A specific phrase in a commit message or pull request description automatically closes the referenced issue once merged.</p>'),
      code('bash', 'git commit -m "Fix login validation bug\n\nFixes #42"'),
      table(['Keyword', 'Effect when merged'], [
        ['Fixes #42 / Closes #42', 'Automatically closes issue #42'],
        ['Refs #42 / Relates to #42', 'Links to the issue without closing it'],
      ]),
      h(2, 'A Lightweight Project Board'),
      p('<p>GitHub Projects turns a repository\'s issues into a Kanban-style board (To Do / In Progress / Done) — genuinely useful for a small team or a solo developer planning work, without needing a separate tool like Trello.</p>'),
      callout('tip', '<p>Issues labeled "good first issue" on a real open-source project are specifically curated to be approachable for a first-time contributor — a practical, low-stakes way to practice the fork-and-pull-request workflow from the previous lesson on a real codebase.</p>', 'A way to practice on a real project'),
    ],
  },
  bn: {
    title: 'GitHub Issue ও Project Board',
    metaTitle: 'GitHub Issue ও Project Board | Learn Computer Academy',
    metaDescription: 'সরাসরি একটা GitHub repository-র ভেতরে bug, feature request, আর task track করা — label, assignee, commit-এ issue link করা, আর একটা হালকা project board।',
    blocks: [
      p('<p>একটা <b>issue</b> একটা repository-র একটা track করা item — একটা bug report, একটা feature request, বা একটা task — একটা আলাদা tool-এর বদলে কোড নিজের পাশেই থাকে।</p>'),
      h(2, 'একটা Issue তৈরি করা', 'একটা-issue-তৈরি-করা'),
      p('<p>একটা repository-র Issues tab থেকে, "New issue" — একটা title, একটা description (Markdown সমর্থিত, একটা README-র মতোই), আর optional label/assignee।</p>'),
      h(2, 'Issue Organize করা', 'issue-organize-করা'),
      table(['Feature', 'উদ্দেশ্য'], [
        ['Label', 'Categorize করা — bug, enhancement, documentation, good first issue'],
        ['Assignee', 'কে এর জন্য দায়ী'],
        ['Milestone', 'একটা নির্দিষ্ট release বা deadline-এর দিকে issue group করা'],
        ['Comment', 'Discussion thread, একটা pull request-এরটার মতোই'],
      ]),
      h(2, 'একটা Commit বা PR-এ একটা Issue Link করা', 'একটা-commit-বা-pr-এ-একটা-issue-link-করা'),
      p('<p>একটা commit message বা pull request description-এ একটা নির্দিষ্ট phrase merge হলে reference করা issue স্বয়ংক্রিয়ভাবে বন্ধ করে।</p>'),
      code('bash', 'git commit -m "Fix login validation bug\n\nFixes #42"'),
      table(['Keyword', 'Merge হলে প্রভাব'], [
        ['Fixes #42 / Closes #42', 'স্বয়ংক্রিয়ভাবে issue #42 বন্ধ করে'],
        ['Refs #42 / Relates to #42', 'বন্ধ না করে issue-এ link করে'],
      ]),
      h(2, 'একটা হালকা Project Board'),
      p('<p>GitHub Projects একটা repository-র issue-কে একটা Kanban-style board-এ (To Do / In Progress / Done) পরিণত করে — একটা ছোট team বা কাজ পরিকল্পনা করা একজন একক developer-এর জন্য সত্যিকারভাবে useful, Trello-র মতো একটা আলাদা tool ছাড়াই।</p>'),
      callout('tip', '<p>একটা আসল open-source project-এ "good first issue" label করা issue একজন প্রথমবার contributor-এর জন্য approachable হতে specifically curated — আগের lesson-এর fork-and-pull-request workflow একটা আসল codebase-এ practice করার একটা practical, কম-ঝুঁকির উপায়।</p>', 'একটা আসল project-এ practice করার একটা উপায়'),
    ],
  },
})

// ═══ 16. README AND MARKDOWN ═════════════════════════════════════════════════

lessons.push({
  slug: 'readme-and-markdown', sortOrder: n++,
  en: {
    title: 'Writing a Good README with Markdown',
    metaTitle: 'GitHub README and Markdown | Learn Computer Academy',
    metaDescription: 'The Markdown syntax GitHub renders everywhere — headings, code blocks, links, images — and what actually belongs in a project\'s README.',
    blocks: [
      p('<p>A README.md is usually the first — sometimes the only — thing anyone sees about a project. GitHub renders it as formatted text automatically, using <b>Markdown</b>, a lightweight syntax used everywhere on the platform (issues, pull requests, comments too).</p>'),
      h(2, 'Core Markdown Syntax'),
      code('text', '# Heading 1\n## Heading 2\n### Heading 3\n\n**bold text**\n*italic text*\n\n- Bullet point\n- Another one\n\n1. Numbered item\n2. Another one\n\n[Link text](https://example.com)\n![Image alt text](image.png)\n\n`inline code`\n\n```javascript\n// a fenced code block, with syntax highlighting\nconst x = 1\n```\n\n> A blockquote\n\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell     | Cell     |'),
      h(2, 'What a Good README Actually Includes'),
      table(['Section', 'Purpose'], [
        ['Project title and a one-line description', 'What this is, in five seconds'],
        ['Installation / setup steps', 'The exact commands to get it running locally'],
        ['Usage example', 'A code snippet or screenshot showing it in action'],
        ['A live demo link, if there is one', 'The fastest way to actually see it work'],
        ['License', 'Whether and how others can use the code — from the earlier repository-creation lesson'],
      ]),
      h(2, 'A Minimal Real Example'),
      code('text', '# Todo App\n\nA simple todo list built with vanilla JavaScript.\n\n## Setup\n\n```bash\ngit clone https://github.com/username/todo-app.git\ncd todo-app\nopen index.html\n```\n\n## Features\n\n- Add and remove tasks\n- Mark tasks complete\n- Saves to localStorage\n\n## License\n\nMIT'),
      callout('tip', '<p>A README written for a stranger who knows nothing about the project — not a note-to-self — is the right target. If a new visitor can\'t tell what the project does and how to run it within the first few lines, the README needs work regardless of how good the code is.</p>', 'Who a README is actually for'),
    ],
  },
  bn: {
    title: 'Markdown দিয়ে একটা ভালো README লেখা',
    metaTitle: 'GitHub README ও Markdown | Learn Computer Academy',
    metaDescription: 'সবখানে GitHub render করা Markdown সিনট্যাক্স — heading, code block, link, image — আর একটা project-এর README-তে আসলে কী থাকা উচিত।',
    blocks: [
      p('<p>একটা README.md সাধারণত একটা project সম্পর্কে যে কেউ দেখা প্রথম — কখনো কখনো একমাত্র — জিনিস। GitHub স্বয়ংক্রিয়ভাবে এটাকে formatted টেক্সট হিসেবে render করে, <b>Markdown</b> ব্যবহার করে, platform জুড়ে সবখানে (issue, pull request, comment-এও) ব্যবহৃত একটা হালকা সিনট্যাক্স।</p>'),
      h(2, 'মূল Markdown সিনট্যাক্স', 'মূল-markdown-সিনট্যাক্স'),
      code('text', '# Heading 1\n## Heading 2\n### Heading 3\n\n**bold text**\n*italic text*\n\n- Bullet point\n- Another one\n\n1. Numbered item\n2. Another one\n\n[Link text](https://example.com)\n![Image alt text](image.png)\n\n`inline code`\n\n```javascript\n// syntax highlighting সহ একটা fenced code block\nconst x = 1\n```\n\n> A blockquote\n\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell     | Cell     |'),
      h(2, 'একটা ভালো README-তে আসলে কী থাকে', 'একটা-ভালো-readme-তে-আসলে-কী-থাকে'),
      table(['Section', 'উদ্দেশ্য'], [
        ['Project title আর এক-লাইনের description', 'পাঁচ সেকেন্ডে এটা কী'],
        ['Installation / setup step', 'locally এটা চালানোর ঠিক command'],
        ['Usage উদাহরণ', 'এটা কাজ করছে দেখানো একটা code snippet বা screenshot'],
        ['একটা live demo link, থাকলে', 'আসলে এটা কাজ করছে দেখার সবচেয়ে দ্রুত উপায়'],
        ['License', 'অন্যরা কোড ব্যবহার করতে পারে কিনা আর কীভাবে — আগের repository-creation lesson থেকে'],
      ]),
      h(2, 'একটা ন্যূনতম আসল উদাহরণ', 'একটা-ন্যূনতম-আসল-উদাহরণ'),
      code('text', '# Todo App\n\nA simple todo list built with vanilla JavaScript.\n\n## Setup\n\n```bash\ngit clone https://github.com/username/todo-app.git\ncd todo-app\nopen index.html\n```\n\n## Features\n\n- Add and remove tasks\n- Mark tasks complete\n- Saves to localStorage\n\n## License\n\nMIT'),
      callout('tip', '<p>একজন অপরিচিত যে project সম্পর্কে কিছু জানে না তার জন্য লেখা একটা README — নিজের জন্য একটা note না — সঠিক target। একজন নতুন visitor প্রথম কয়েক লাইনে project কী করে আর কীভাবে চালাতে হয় বলতে না পারলে, কোড যতই ভালো হোক না কেন README-এর কাজ দরকার।</p>', 'একটা README আসলে কার জন্য'),
    ],
  },
})

// ═══ 17. GIT WORKFLOWS ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'git-workflows', sortOrder: n++,
  en: {
    title: 'Git Workflows — Feature Branches and Commit Conventions',
    metaTitle: 'Git Workflows | Learn Computer Academy',
    metaDescription: 'How a real team actually uses everything from earlier lessons together — a feature branch workflow, and writing commits that stay useful months later.',
    blocks: [
      p('<p>Every command in this course so far is a building block. This lesson is how they combine into the habits a real team (or a disciplined solo developer) actually follows day to day.</p>'),
      h(2, 'The Feature Branch Workflow'),
      table(['Step', 'Command(s)'], [
        ['1. Start from an up-to-date main', 'git switch main && git pull'],
        ['2. Create a branch for one specific change', 'git switch -c feature/user-login'],
        ['3. Commit in small, logical steps', 'git add ... && git commit -m "..."'],
        ['4. Push and open a pull request', 'git push -u origin feature/user-login'],
        ['5. Address review feedback with more commits', 'Same branch, more commits, pushed again'],
        ['6. Merge once approved, then delete the branch', 'Usually done through GitHub\'s merge button'],
      ]),
      h(2, 'Branch Naming Conventions'),
      table(['Prefix', 'For'], [
        ['feature/...', 'A new feature'],
        ['fix/...', 'A bug fix'],
        ['chore/...', 'Maintenance work — dependency updates, config changes'],
        ['docs/...', 'Documentation only'],
      ]),
      h(2, 'Conventional Commits'),
      p('<p>A widely-used commit message format that makes a project\'s history scannable and machine-parseable (some tools auto-generate changelogs from it).</p>'),
      code('text', 'feat: add password reset flow\nfix: correct off-by-one error in pagination\ndocs: update README installation steps\nrefactor: simplify user validation logic\ntest: add coverage for edge cases in checkout\nchore: bump dependency versions'),
      h(2, 'Commit Size — Small and Logical'),
      p('<p>One commit per logical change, not one commit per work session — a commit fixing a bug and a commit adding an unrelated feature should never be the same commit, even if they happened back to back.</p>'),
      callout('tip', '<p>A useful test for commit size: could this specific commit be reverted on its own, cleanly, without breaking something unrelated? If not, it\'s probably bundling more than one logical change.</p>', 'A gut check for commit size'),
    ],
  },
  bn: {
    title: 'Git Workflow — Feature Branch ও Commit Convention',
    metaTitle: 'Git Workflow | Learn Computer Academy',
    metaDescription: 'একটা আসল team কীভাবে আগের lesson-এর সবকিছু একসাথে ব্যবহার করে — একটা feature branch workflow, আর মাস পরেও useful থাকা commit লেখা।',
    blocks: [
      p('<p>এই কোর্সে এখন পর্যন্ত প্রতিটা command একটা building block। এই lesson কীভাবে এগুলো একটা আসল team (বা একজন disciplined একক developer) প্রতিদিন যে habit follow করে তাতে একসাথে হয়।</p>'),
      h(2, 'Feature Branch Workflow'),
      table(['ধাপ', 'Command'], [
        ['1. একটা আপডেট main থেকে শুরু করুন', 'git switch main && git pull'],
        ['2. একটা নির্দিষ্ট পরিবর্তনের জন্য একটা branch তৈরি করুন', 'git switch -c feature/user-login'],
        ['3. ছোট, যৌক্তিক step-এ commit করুন', 'git add ... && git commit -m "..."'],
        ['4. Push আর একটা pull request খুলুন', 'git push -u origin feature/user-login'],
        ['5. আরো commit দিয়ে review feedback address করুন', 'একই branch, আরো commit, আবার push করা'],
        ['6. Approve হলে merge করুন, তারপর branch delete করুন', 'সাধারণত GitHub-এর merge button দিয়ে করা'],
      ]),
      h(2, 'Branch Naming Convention'),
      table(['Prefix', 'যার জন্য'], [
        ['feature/...', 'একটা নতুন feature'],
        ['fix/...', 'একটা bug fix'],
        ['chore/...', 'Maintenance কাজ — dependency update, config পরিবর্তন'],
        ['docs/...', 'শুধু documentation'],
      ]),
      h(2, 'Conventional Commit'),
      p('<p>একটা ব্যাপকভাবে ব্যবহৃত commit message format যা একটা project-এর history-কে scannable আর machine-parseable বানায় (কিছু tool এটা থেকে স্বয়ংক্রিয়ভাবে changelog তৈরি করে)।</p>'),
      code('text', 'feat: add password reset flow\nfix: correct off-by-one error in pagination\ndocs: update README installation steps\nrefactor: simplify user validation logic\ntest: add coverage for edge cases in checkout\nchore: bump dependency versions'),
      h(2, 'Commit Size — ছোট ও যৌক্তিক', 'commit-size-ছোট-ও-যৌক্তিক'),
      p('<p>প্রতি work session-এ একটা commit না, প্রতি যৌক্তিক পরিবর্তনে একটা commit — একটা bug ঠিক করা commit আর একটা অসম্পর্কিত feature যোগ করা commit কখনো একই commit হওয়া উচিত না, একের পর এক ঘটলেও।</p>'),
      callout('tip', '<p>Commit size-এর জন্য একটা useful test: এই নির্দিষ্ট commit-টা কি একা, পরিষ্কারভাবে, অসম্পর্কিত কিছু না ভেঙে revert করা যাবে? না হলে, এটা সম্ভবত একটার বেশি যৌক্তিক পরিবর্তন bundle করছে।</p>', 'Commit size-এর জন্য একটা gut check'),
    ],
  },
})

// ═══ 18. REBASING VS MERGING ═════════════════════════════════════════════════

lessons.push({
  slug: 'rebasing', sortOrder: n++,
  en: {
    title: 'Rebasing vs. Merging',
    metaTitle: 'Git Rebase vs Merge | Learn Computer Academy',
    metaDescription: 'A second way to bring a branch up to date — rewriting its history onto a new base instead of merging — and the one rule about never rebasing shared history.',
    blocks: [
      p('<p>The earlier Merging lesson covered one way to combine branches. <b>Rebasing</b> achieves a similar goal — bringing a branch up to date with another — through a genuinely different mechanism, with a different result.</p>'),
      h(2, 'What Rebase Actually Does'),
      p('<p>Rather than creating a merge commit joining two histories, rebase replays a branch\'s commits one by one on top of another branch\'s latest commit — rewriting history as if the branch had been created from that newer point all along.</p>'),
      code('bash', 'git switch feature-login\ngit rebase main\n# feature-login\'s commits are now replayed on top of main\'s latest commit'),
      h(2, 'Merge vs. Rebase — the Resulting History'),
      table(['git merge', 'git rebase'], [
        ['Preserves exactly what happened, including a merge commit showing where branches joined', 'Rewrites history into a single clean, linear line — no merge commit'],
        ['Never changes existing commits\' hashes', 'Changes every rebased commit\'s hash — they become new commits entirely'],
        ['Safe on any branch, shared or not', 'Only safe on a branch nobody else has already pulled'],
      ]),
      h(2, 'The One Rule That Actually Matters'),
      callout('danger', '<p>Never rebase a commit that\'s already been pushed and shared with anyone else. Rebase rewrites commit history — a teammate who already pulled the old commits ends up with a repository that looks like it diverged from everyone else\'s, and untangling it is genuinely painful. Rebase a local, unshared branch freely; never rebase main, or a branch someone else is also working on.</p>', 'Never rebase shared history'),
      h(2, 'A Common, Safe Use — Cleaning Up Before a Pull Request'),
      code('bash', '# Squash several small "wip" commits into fewer, meaningful ones,\n# before opening a pull request — safe because the branch isn\'t shared yet\ngit rebase -i HEAD~5'),
      h(2, 'Keeping a Branch Updated — Merge or Rebase?'),
      table(['Situation', 'Reasonable choice'], [
        ['A shared branch, or already-pushed commits', 'git merge — never rebase these'],
        ['A local, not-yet-pushed feature branch, wanting a clean history', 'git rebase main is a common, safe choice'],
      ]),
    ],
  },
  bn: {
    title: 'Rebase বনাম Merge',
    metaTitle: 'Git Rebase বনাম Merge | Learn Computer Academy',
    metaDescription: 'একটা branch-কে আপডেট রাখার দ্বিতীয় একটা উপায় — merge করার বদলে এর history একটা নতুন base-এ পুনর্লিখন — আর shared history কখনো rebase না করার একটা নিয়ম।',
    blocks: [
      p('<p>আগের Merging lesson branch একসাথে করার একটা উপায় কভার করেছে। <b>Rebasing</b> একই লক্ষ্য অর্জন করে — একটা branch-কে আরেকটার সাথে আপডেট রাখা — সত্যিকারভাবে ভিন্ন একটা mechanism দিয়ে, ভিন্ন ফলাফল সহ।</p>'),
      h(2, 'Rebase আসলে কী করে', 'rebase-আসলে-কী-করে'),
      p('<p>দুটো history জোড়া দেওয়া একটা merge commit তৈরি করার বদলে, rebase একটা branch-এর commit একটা করে অন্য branch-এর সবচেয়ে সাম্প্রতিক commit-এর উপরে আবার চালায় — history-কে এমনভাবে পুনর্লিখন করে যেন branch-টা সবসময় সেই নতুন পয়েন্ট থেকে তৈরি হয়েছিল।</p>'),
      code('bash', 'git switch feature-login\ngit rebase main\n# feature-login-এর commit এখন main-এর সবচেয়ে সাম্প্রতিক commit-এর উপরে আবার চলে'),
      h(2, 'Merge বনাম Rebase — ফলাফল History', 'merge-বনাম-rebase-ফলাফল-history'),
      table(['git merge', 'git rebase'], [
        ['ঠিক যা ঘটেছে তা সংরক্ষণ করে, branch কোথায় জুড়েছে তা দেখানো একটা merge commit সহ', 'History-কে একটা একক পরিষ্কার, linear লাইনে পুনর্লিখন করে — কোনো merge commit না'],
        ['বিদ্যমান commit-এর hash কখনো বদলায় না', 'প্রতিটা rebase করা commit-এর hash বদলায় — এরা সম্পূর্ণ নতুন commit হয়ে যায়'],
        ['যেকোনো branch-এ নিরাপদ, shared হোক বা না হোক', 'শুধু কেউ ইতিমধ্যে pull করেনি এমন একটা branch-এ নিরাপদ'],
      ]),
      h(2, 'একটা মাত্র নিয়ম যা আসলে গুরুত্বপূর্ণ', 'একটা-মাত্র-নিয়ম-যা-আসলে-গুরুত্বপূর্ণ'),
      callout('danger', '<p>ইতিমধ্যে push হয়ে অন্য কারো সাথে শেয়ার হওয়া একটা commit কখনো rebase করবেন না। Rebase commit history পুনর্লিখন করে — যে teammate ইতিমধ্যে পুরনো commit pull করেছে তার একটা repository হয়ে যায় যা বাকি সবার থেকে diverge করেছে বলে মনে হয়, আর এটা সমাধান করা সত্যিকারভাবে কষ্টকর। একটা local, unshared branch অবাধে rebase করুন; কখনো main, বা অন্য কেউও কাজ করছে এমন একটা branch rebase করবেন না।</p>', 'কখনো shared history rebase করবেন না'),
      h(2, 'একটা Common, নিরাপদ ব্যবহার — একটা Pull Request-এর আগে পরিষ্কার করা', 'একটা-common-নিরাপদ-ব্যবহার-একটা-pull-request-এর-আগে-পরিষ্কার-করা'),
      code('bash', '# একটা pull request খোলার আগে, বেশ কয়েকটা ছোট "wip" commit\n# কম, অর্থপূর্ণ commit-এ squash করুন — নিরাপদ কারণ branch এখনো shared না\ngit rebase -i HEAD~5'),
      h(2, 'একটা Branch আপডেট রাখা — Merge না Rebase?', 'একটা-branch-আপডেট-রাখা-merge-না-rebase'),
      table(['পরিস্থিতি', 'যুক্তিসঙ্গত পছন্দ'], [
        ['একটা shared branch, বা ইতিমধ্যে-push করা commit', 'git merge — এগুলো কখনো rebase করবেন না'],
        ['একটা local, এখনো-push-না-করা feature branch, একটা পরিষ্কার history চাওয়া', 'git rebase main একটা common, নিরাপদ পছন্দ'],
      ]),
    ],
  },
})

// ═══ 19. OTHER VERSION CONTROL SYSTEMS AND GIT HOSTS ═════════════════════════

lessons.push({
  slug: 'other-version-control-systems', sortOrder: n++,
  en: {
    title: 'Other Version Control Systems and Git Hosts',
    metaTitle: 'Other Version Control Systems and Git Hosts | Learn Computer Academy',
    metaDescription: 'GitLab, Bitbucket, and Azure DevOps as GitHub alternatives, and older version control tools — Subversion, Mercurial, Perforce — still found in real projects.',
    blocks: [
      p('<p>Git is overwhelmingly the industry standard today, and GitHub the most widely used place to host it — but neither is the only option, and knowing what else exists helps make sense of an older codebase or a company using a different tool.</p>'),
      h(2, 'Other Places to Host a Git Repository'),
      table(['Platform', 'Notable for'], [
        ['GitHub', 'The largest, most widely used — covered throughout this course'],
        ['GitLab', 'Strong built-in CI/CD pipelines; also offers a fully self-hosted version companies can run on their own servers'],
        ['Bitbucket', 'Tight integration with other Atlassian tools (Jira, Confluence) — common in teams already using those'],
        ['Azure DevOps Repos', 'Integrated into Microsoft\'s broader Azure DevOps suite, common in enterprise .NET shops'],
        ['SourceHut', 'A minimal, text-first alternative favored by some open-source projects that prefer email-based patches over pull requests'],
      ]),
      p('<p>All of these host <i>Git</i> repositories — everything from the earlier lessons (branches, commits, merges) works identically regardless of which one a project uses. The difference is entirely in the collaboration features layered on top (issues, CI/CD, project boards) and each platform\'s own interface.</p>'),
      h(2, 'Version Control Systems Other Than Git'),
      table(['System', 'What it is', 'Where it\'s still found'], [
        ['Subversion (SVN)', 'Centralized (not distributed like Git) — one central server holds the only full history', 'Some older enterprise codebases, particularly pre-2010 projects'],
        ['Mercurial (hg)', 'Distributed, conceptually similar to Git, with a reputation for a simpler command set', 'Facebook\'s internal monorepo historically used it; some open-source projects still do'],
        ['Perforce (Helix Core)', 'Centralized, built for very large binary files (game assets, video)', 'Common in game development and other industries with huge non-text files Git handles poorly'],
        ['CVS', 'One of the earliest widely-used systems, largely superseded', 'Occasionally in genuinely old, unmaintained projects'],
      ]),
      h(2, 'Why Git Won'),
      p('<p>Git\'s distributed model (every developer has the complete history, from the first lesson in this course) made branching and merging fast and cheap compared to the centralized tools that came before it — combined with GitHub\'s network effects, that\'s largely why Git become the default choice for the vast majority of new projects since around 2010.</p>'),
      callout('note', '<p>None of these alternatives need to be learned in depth to work productively — the concepts from this entire course (commits, branches, merging, remotes) transfer directly, since Git borrowed and refined ideas that existed in some form in most of them.</p>', 'The good news about all of this'),
    ],
  },
  bn: {
    title: 'অন্যান্য Version Control System ও Git Host',
    metaTitle: 'অন্যান্য Version Control System ও Git Host | Learn Computer Academy',
    metaDescription: 'GitHub-এর বিকল্প হিসেবে GitLab, Bitbucket, ও Azure DevOps, আর পুরনো version control tool — Subversion, Mercurial, Perforce — যা এখনো আসল project-এ পাওয়া যায়।',
    blocks: [
      p('<p>আজ Git প্রবলভাবে industry standard, আর GitHub এটা host করার সবচেয়ে ব্যাপকভাবে ব্যবহৃত জায়গা — কিন্তু কোনোটাই একমাত্র option না, আর আর কী আছে তা জানা একটা পুরনো codebase বা ভিন্ন tool ব্যবহার করা একটা company বোঝায় সাহায্য করে।</p>'),
      h(2, 'একটা Git Repository Host করার অন্য জায়গা', 'একটা-git-repository-host-করার-অন্য-জায়গা'),
      table(['Platform', 'যার জন্য উল্লেখযোগ্য'], [
        ['GitHub', 'সবচেয়ে বড়, সবচেয়ে ব্যাপকভাবে ব্যবহৃত — এই কোর্স জুড়ে কভার করা'],
        ['GitLab', 'শক্তিশালী built-in CI/CD pipeline; company তাদের নিজের server-এ চালাতে পারে এমন একটা সম্পূর্ণ self-hosted version-ও দেয়'],
        ['Bitbucket', 'অন্য Atlassian tool-এর সাথে (Jira, Confluence) নিবিড় integration — এগুলো ইতিমধ্যে ব্যবহার করা team-এ common'],
        ['Azure DevOps Repos', 'Microsoft-এর বিস্তৃত Azure DevOps suite-এ integrated, enterprise .NET shop-এ common'],
        ['SourceHut', 'কিছু open-source project pull request-এর চেয়ে email-based patch পছন্দ করে যা একটা minimal, text-first বিকল্প'],
      ]),
      p('<p>এদের সবগুলোই <i>Git</i> repository host করে — আগের lesson-এর সবকিছু (branch, commit, merge) কোনটা একটা project ব্যবহার করে তা নির্বিশেষে একইভাবে কাজ করে। পার্থক্যটা সম্পূর্ণভাবে উপরে layer করা collaboration feature-এ (issue, CI/CD, project board) আর প্রতিটা platform-এর নিজের interface-এ।</p>'),
      h(2, 'Git ছাড়া অন্য Version Control System', 'git-ছাড়া-অন্য-version-control-system'),
      table(['System', 'এটা কী', 'যেখানে এখনো পাওয়া যায়'], [
        ['Subversion (SVN)', 'Centralized (Git-এর মতো distributed না) — একটা central server-এই একমাত্র পূর্ণ history থাকে', 'কিছু পুরনো enterprise codebase, বিশেষত pre-2010 project'],
        ['Mercurial (hg)', 'Distributed, conceptually Git-এর মতো, একটা সহজ command set-এর জন্য পরিচিত', 'Facebook-এর internal monorepo ঐতিহাসিকভাবে এটা ব্যবহার করত; কিছু open-source project এখনো করে'],
        ['Perforce (Helix Core)', 'Centralized, খুব বড় binary file (game asset, video)-এর জন্য বানানো', 'Game development আর Git-এর ভালোভাবে handle না করা বিশাল non-text file সহ অন্যান্য industry-তে common'],
        ['CVS', 'প্রথম দিকের ব্যাপকভাবে ব্যবহৃত system-গুলোর একটা, বেশিরভাগ superseded', 'মাঝে মাঝে সত্যিকারভাবে পুরনো, unmaintained project-এ'],
      ]),
      h(2, 'কেন Git জিতেছে', 'কেন-git-জিতেছে'),
      p('<p>Git-এর distributed model (এই কোর্সের প্রথম lesson থেকে, প্রতিটা developer-এর কাছে পূর্ণ history আছে) এর আগে আসা centralized tool-এর তুলনায় branching আর merging দ্রুত আর সস্তা বানিয়েছে — GitHub-এর network effect-এর সাথে মিলে, এটাই মূলত কেন প্রায় 2010 থেকে বেশিরভাগ নতুন project-এর জন্য Git default পছন্দ হয়ে গেছে।</p>'),
      callout('note', '<p>এই কোনো বিকল্পই productively কাজ করার জন্য গভীরভাবে শেখার দরকার নেই — এই পুরো কোর্সের ধারণা (commit, branch, merging, remote) সরাসরি transfer হয়, কারণ Git এদের বেশিরভাগে কোনো না কোনো রূপে ছিল এমন ধারণা ধার নিয়ে পরিমার্জিত করেছে।</p>', 'এসবের ভালো খবর'),
    ],
  },
})

// ═══ 20. WHERE THIS LEAVES YOU ═══════════════════════════════════════════════

lessons.push({
  slug: 'where-this-leaves-you', sortOrder: n++,
  en: {
    title: 'Where This Leaves You',
    metaTitle: 'Git & GitHub — Where This Leaves You | Learn Computer Academy',
    metaDescription: 'A closing summary of this course, and how Git connects directly to the Hosting & Deployment and Career Skills courses elsewhere on this site.',
    blocks: [
      p('<p>This course covered the entire day-to-day loop — init, add, commit, branch, merge, resolve conflicts, undo mistakes, push, pull, fork, and open a pull request — plus enough of the wider landscape (other hosts, other version control systems entirely) to recognize what else is out there.</p>'),
      h(2, 'A Practical Minimum Checklist'),
      table(['Habit', 'From'], [
        ['Commit in small, logical steps with a clear message', 'Git Workflows'],
        ['Never track secrets or dependencies', 'The .gitignore File'],
        ['Branch for every real change, however small', 'Branching Basics'],
        ['Never reset or rebase a commit already shared with others', 'Undoing Changes, Rebasing vs. Merging'],
        ['Write a README a stranger could actually follow', 'Writing a Good README'],
      ]),
      h(2, 'Where Git Connects to the Rest of This Site'),
      p('<p>The Hosting & Deployment course connects a server to a GitHub repository directly — pushing a commit there triggers an actual deployment, the practical payoff of everything in this course. The Career Skills course covers building a real GitHub profile as portfolio proof — the public repositories, README quality, and commit history from this course are exactly what that\'s built from.</p>'),
      h(2, 'A Few Things Worth Knowing Exist, Not Covered Here'),
      table(['Topic', 'Why it was left out'], [
        ['Git hooks (running a script automatically on commit/push)', 'A genuinely advanced customization, rarely needed starting out'],
        ['Submodules (a repository nested inside another)', 'A niche need, and a famously confusing feature even for experienced developers'],
        ['GitHub Actions (automated workflows on push/PR)', 'A real, valuable topic, but its own course-worth of material — CI/CD generally'],
        ['Signed commits (cryptographically verifying who committed)', 'Security-hardening territory, rarely needed for a student or freelancer\'s day-to-day'],
      ]),
      callout('tip', '<p>The single most valuable next step: pick a real project — even a small personal one — put it on GitHub, and use everything from this course on it for a few weeks. Reading about branching is nothing like the moment a real merge conflict actually happens and gets resolved.</p>', 'What to actually do next'),
    ],
  },
  bn: {
    title: 'এখান থেকে আপনি যা নিয়ে যাবেন',
    metaTitle: 'Git ও GitHub — এখান থেকে আপনি যা নিয়ে যাবেন | Learn Computer Academy',
    metaDescription: 'এই কোর্সের একটা closing summary, আর Git কীভাবে এই সাইটের Hosting & Deployment আর Career Skills কোর্সের সাথে সরাসরি সংযুক্ত।',
    blocks: [
      p('<p>এই কোর্স পুরো প্রতিদিনের loop কভার করেছে — init, add, commit, branch, merge, conflict সমাধান, ভুল undo, push, pull, fork, আর একটা pull request খোলা — সাথে বিস্তৃত landscape-এর (অন্য host, সম্পূর্ণ অন্য version control system) যথেষ্ট যাতে আর কী আছে তা চেনা যায়।</p>'),
      h(2, 'একটা Practical Minimum Checklist'),
      table(['Habit', 'থেকে'], [
        ['একটা স্পষ্ট message সহ ছোট, যৌক্তিক step-এ commit করুন', 'Git Workflows'],
        ['কখনো secret বা dependency track করবেন না', '.gitignore File'],
        ['যতই ছোট হোক না কেন প্রতিটা আসল পরিবর্তনের জন্য branch করুন', 'Branching Basics'],
        ['ইতিমধ্যে অন্যদের সাথে শেয়ার হওয়া একটা commit কখনো reset বা rebase করবেন না', 'Undoing Changes, Rebasing বনাম Merging'],
        ['একজন অপরিচিত আসলে follow করতে পারবে এমন একটা README লিখুন', 'একটা ভালো README লেখা'],
      ]),
      h(2, 'এই সাইটের বাকি অংশের সাথে Git কোথায় সংযুক্ত', 'এই-সাইটের-বাকি-অংশের-সাথে-git-কোথায়-সংযুক্ত'),
      p('<p>Hosting & Deployment কোর্স সরাসরি একটা server-কে একটা GitHub repository-র সাথে সংযুক্ত করে — সেখানে একটা commit push করলে একটা আসল deployment trigger হয়, এই কোর্সের সবকিছুর practical payoff। Career Skills কোর্স portfolio প্রমাণ হিসেবে একটা আসল GitHub profile বানানো কভার করে — public repository, README quality, আর এই কোর্স থেকে commit history ঠিক এটাই যা থেকে বানানো।</p>'),
      h(2, 'জানার যোগ্য কিছু জিনিস যা এখানে কভার করা হয়নি', 'জানার-যোগ্য-কিছু-জিনিস-যা-এখানে-কভার-করা-হয়নি'),
      table(['Topic', 'কেন বাদ দেওয়া হয়েছে'], [
        ['Git hook (commit/push-এ স্বয়ংক্রিয়ভাবে একটা script চালানো)', 'সত্যিকারভাবে একটা advanced customization, শুরুতে কমই দরকার'],
        ['Submodule (একটার ভেতরে nested একটা repository)', 'একটা niche দরকার, আর অভিজ্ঞ developer-দের জন্যও একটা বিখ্যাতভাবে confusing feature'],
        ['GitHub Actions (push/PR-এ automated workflow)', 'একটা আসল, মূল্যবান topic, কিন্তু নিজেই একটা কোর্সের যোগ্য material — সাধারণভাবে CI/CD'],
        ['Signed commit (cryptographically কে commit করেছে তা verify করা)', 'Security-hardening territory, একজন student বা freelancer-এর প্রতিদিনের জন্য কমই দরকার'],
      ]),
      callout('tip', '<p>একক সবচেয়ে মূল্যবান পরের step: একটা আসল project বেছে নিন — এমনকি একটা ছোট personal-ও — এটা GitHub-এ রাখুন, আর কয়েক সপ্তাহ ধরে এর উপর এই কোর্সের সবকিছু ব্যবহার করুন। Branching নিয়ে পড়া একটা আসল merge conflict আসলে ঘটা আর সমাধান হওয়ার মুহূর্তের মতো কিছুই না।</p>', 'এরপর আসলে কী করবেন'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'git').single()
  if (catErr || !category) {
    console.error('Category "git" not found — run scripts/create-git-category.mjs first.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] git/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] git/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
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

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
