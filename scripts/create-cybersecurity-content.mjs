#!/usr/bin/env node
// New "Cybersecurity" category (created by scripts/create-cybersecurity-category.mjs)
// — 18 lessons, plan agreed with the site owner 2026-09-02, see D-108 in
// docs/DECISIONS.md. Order: intro → Windows CLI → Linux terminal → threat
// landscape → malware → phishing/social engineering → passwords/password
// managers → 2FA → safe browsing → browser privacy settings → email security
// → mobile → Wi-Fi/VPNs → backups → social media privacy → checking a breach
// (HIBP) → ransomware/identity-theft response → closing (freelancer angle).
//
// Images are NOT part of this script. 11 lessons get a ChatGPT-generated
// infographic (owner is generating them off Magnific, see
// .extra-images/cybersecurity/PROMPTS.md — filenames there match these
// lesson slugs exactly) and 4 hands-on lessons get a real screenshot
// (password manager, 2FA, browser privacy settings, Have I Been Pwned,
// captured live via claude-in-chrome). Both get appended by a follow-up
// script once ready, same pattern as scripts/add-basics-infographics.mjs —
// never replaces content, just appends an image block.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-cybersecurity-content.mjs [--dry-run]

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
function code(language, source, runnable) { return { id: nanoid(12), type: 'code', language, code: source, runnable: !!runnable } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []
let n = 1

// ═══ 1. WHY CYBERSECURITY MATTERS ═══════════════════════════════════════

lessons.push({
  slug: 'why-cybersecurity-matters', sortOrder: n++,
  en: {
    title: 'Why Cybersecurity Matters',
    metaTitle: 'Why Cybersecurity Matters | Learn Computer Academy',
    metaDescription: 'Why cybersecurity is not just a concern for companies — practical habits that protect anyone with a phone, a laptop, or an email address.',
    blocks: [
      p('<p><b>Cybersecurity</b> is the practice of protecting devices, accounts, and data from unauthorized access, damage, or theft. It sounds like a topic for IT departments and large companies, but almost every attack in this course targets individuals directly — a personal email account, a phone, a saved password, a moment of not paying attention.</p>'),
      h(2, 'Your Data Has Real Value'),
      p('<p>A password reused across sites, a photo, a bank login, a saved card number — none of it feels valuable sitting on a personal device, but each is worth money to someone. Stolen email accounts get sold in bulk; stolen banking credentials get drained directly; even a working social media account has resale value for running scams under a trusted-looking name.</p>'),
      h(2, 'Attacks Are Automated, Not Personal'),
      p('<p>Most attacks are not one hacker deliberately choosing one target. Scripts and bots scan millions of email addresses, phone numbers, and websites continuously, testing leaked password lists and known vulnerabilities automatically. Being "not important enough to be a target" doesn\'t apply — the scan doesn\'t know or care who is being tested, it only cares what works.</p>'),
      h(2, 'Small Mistakes, Real Cost'),
      p('<p>One clicked link, one reused password, one unlocked phone left on a table — the gap between an ordinary day and a genuinely bad one (a locked-out account, drained savings, a ransomed laptop) is usually a single small decision, not a sophisticated attack. That is also the good news: small, consistent habits close almost all of it.</p>'),
      table(['Who this affects', 'Why "it won\'t happen to me" is wrong'], [
        ['Students', 'Study accounts, email, and social logins are exactly what automated scans target first'],
        ['Freelancers', 'Client files, invoices, and payment details make a personal laptop a business target too'],
        ['Small business owners', 'No dedicated IT team means every gap stays open until someone notices'],
        ['Literally everyone with a phone', 'A phone is a wallet, an inbox, and an ID card in one device — worth protecting on that basis alone'],
      ]),
      callout('note', '<p>This course does not require any technical background. Every lesson is a set of habits and settings — nothing here requires programming knowledge.</p>', 'Who this course is for'),
    ],
  },
  bn: {
    title: 'সাইবার সিকিউরিটি কেন গুরুত্বপূর্ণ',
    metaTitle: 'সাইবার সিকিউরিটি কেন গুরুত্বপূর্ণ | Learn Computer Academy',
    metaDescription: 'সাইবার সিকিউরিটি কেন শুধু company-দের জন্য একটা concern না — যার একটা phone, laptop, বা email address আছে তাকে সুরক্ষা দেয় এমন practical habit।',
    blocks: [
      p('<p><b>Cybersecurity</b> মানে device, account, আর data-কে unauthorized access, ক্ষতি, বা চুরি থেকে রক্ষা করার practice। শুনতে মনে হয় IT department আর বড় company-দের জন্য একটা topic, কিন্তু এই কোর্সের প্রায় প্রতিটা attack সরাসরি individual-দের target করে — একটা personal email account, একটা phone, একটা save করা password, মনোযোগ না দেওয়ার একটা মুহূর্ত।</p>'),
      h(2, 'আপনার Data-র আসল মূল্য আছে'),
      p('<p>একাধিক site-এ reuse করা password, একটা photo, একটা bank login, একটা save করা card number — কোনোটাই personal device-এ বসে থাকা অবস্থায় মূল্যবান মনে হয় না, কিন্তু প্রতিটাই কারো না কারো কাছে টাকার সমান। চুরি হওয়া email account bulk-এ বিক্রি হয়; চুরি হওয়া banking credential সরাসরি drain করা হয়; এমনকি একটা কাজ করা social media account-ও trusted-looking নাম দিয়ে scam চালানোর জন্য resale value রাখে।</p>'),
      h(2, 'Attack Automated, Personal না'),
      p('<p>বেশিরভাগ attack একজন hacker সচেতনভাবে একজনকে বেছে নেওয়া না। Script আর bot লাখো লাখো email address, phone number, আর website continuously scan করে, leaked password list আর known vulnerability automatically test করে। "target হওয়ার মতো যথেষ্ট গুরুত্বপূর্ণ না" — এটা খাটে না, scan জানে না বা পরোয়া করে না কাকে test করা হচ্ছে, শুধু কী কাজ করছে সেটাই দেখে।</p>'),
      h(2, 'ছোট ভুল, আসল খরচ'),
      p('<p>একটা click করা link, একটা reuse করা password, একটা টেবিলে unlocked রেখে যাওয়া phone — একটা সাধারণ দিন আর সত্যিকারের একটা খারাপ দিনের (একটা locked-out account, drain হওয়া সঞ্চয়, একটা ransomed laptop) মধ্যে ব্যবধান সাধারণত একটা sophisticated attack না, একটা ছোট সিদ্ধান্ত। এটাই ভালো খবরও — ছোট, ধারাবাহিক habit প্রায় সবকিছু বন্ধ করে দেয়।</p>'),
      table(['এটা কাকে প্রভাবিত করে', 'কেন "আমার সাথে হবে না" ভুল'], [
        ['Student', 'Study account, email, আর social login-ই automated scan সবার আগে target করে'],
        ['Freelancer', 'Client file, invoice, আর payment detail একটা personal laptop-কেও একটা business target বানায়'],
        ['ছোট ব্যবসার মালিক', 'কোনো dedicated IT team না থাকা মানে কেউ খেয়াল না করা পর্যন্ত প্রতিটা gap খোলা থাকে'],
        ['যার phone আছে, একদম সবাই', 'একটা phone একই device-এ wallet, inbox, আর ID card — শুধু এই কারণেই রক্ষা করার যোগ্য'],
      ]),
      callout('note', '<p>এই কোর্সের জন্য কোনো technical background লাগে না। প্রতিটা lesson কিছু habit আর setting — এখানে কোনোকিছুর জন্য programming knowledge লাগে না।</p>', 'এই কোর্স কার জন্য'),
    ],
  },
})

// ═══ 2. WINDOWS COMMAND LINE ═════════════════════════════════════════════

lessons.push({
  slug: 'windows-command-line', sortOrder: n++,
  en: {
    title: 'Windows Command Line Basics',
    metaTitle: 'Windows Command Line Basics | Learn Computer Academy',
    metaDescription: 'A first, practical introduction to the Windows command line — the handful of commands worth knowing before the security lessons ahead use them.',
    blocks: [
      p('<p>Several lessons ahead reference checking network settings, running processes, and files from the command line rather than clicking through menus — it\'s faster, more precise, and is how real troubleshooting and security work actually gets done. This lesson is a first, practical introduction for anyone who has never opened one before.</p>'),
      h(2, 'Opening It'),
      p('<p>Press <code>Win</code>, type <code>powershell</code>, and press Enter. This course uses PowerShell (the modern default on Windows 10/11) rather than the older Command Prompt — the commands below work in both, with PowerShell adding a few extra security-relevant ones.</p>'),
      h(2, 'Finding Your Way Around'),
      code('powershell', '# Show the current folder\nGet-Location\n\n# List files and folders here\nGet-ChildItem\n\n# Move into a folder\nCd Downloads\n\n# Go back up one level\nCd ..'),
      p('<p><code>Get-ChildItem</code> is commonly shortened to its alias <code>dir</code> or <code>ls</code> — both work identically in PowerShell.</p>'),
      h(2, 'Checking Your Network — Security-Relevant'),
      code('powershell', '# Show this computer\'s IP address, gateway, and DNS servers\nipconfig /all\n\n# Test whether a host is reachable\nping google.com\n\n# List active network connections — useful for spotting\n# a connection to somewhere unexpected\nGet-NetTCPConnection -State Established'),
      p('<p><code>ipconfig /all</code> is worth knowing on its own — it\'s the fastest way to confirm which Wi-Fi network a device is actually connected to, which matters directly in the Wi-Fi and VPN lesson ahead.</p>'),
      h(2, 'Checking What\'s Running'),
      code('powershell', '# List every running process\nGet-Process\n\n# Find one specific process by name\nGet-Process -Name chrome\n\n# End a process that\'s stuck or shouldn\'t be running\nStop-Process -Name notepad'),
      callout('warning', '<p>Ending an unfamiliar process with <code>Stop-Process</code> without knowing what it is can crash other programs or the system. Look up an unrecognized process name before killing it — this command is for processes already identified as safe to close.</p>', 'Know before you stop'),
      h(2, 'Common Commands, Quick Reference'),
      table(['Command', 'What it does'], [
        ['Get-Location / cd', 'Show or change the current folder'],
        ['Get-ChildItem / dir', 'List files and folders'],
        ['ipconfig /all', 'Show network configuration — IP, gateway, DNS'],
        ['ping <host>', 'Test whether a host responds'],
        ['Get-Process', 'List running processes'],
        ['Stop-Process -Name <name>', 'End a running process'],
        ['Get-NetTCPConnection', 'List active network connections'],
        ['Clear-History', 'Clear this session\'s command history'],
      ]),
    ],
  },
  bn: {
    title: 'Windows Command Line-এর বেসিক',
    metaTitle: 'Windows Command Line-এর বেসিক | Learn Computer Academy',
    metaDescription: 'Windows command line-এর একটা প্রথম, practical পরিচয় — সামনের security lesson-গুলো ব্যবহার করার আগে জানার মতো হাতেগোনা কিছু command।',
    blocks: [
      p('<p>সামনের বেশ কিছু lesson menu click করার বদলে network setting, চলমান process, আর file command line থেকে check করার কথা বলে — এটা দ্রুত, নির্ভুল, আর real troubleshooting আর security কাজ আসলে এভাবেই হয়। এই lesson কখনো একটা খোলেননি এমন যে কারো জন্য একটা প্রথম, practical পরিচয়।</p>'),
      h(2, 'এটা খোলা'),
      p('<p><code>Win</code> চাপুন, <code>powershell</code> লিখুন, আর Enter চাপুন। এই কোর্স পুরনো Command Prompt-এর বদলে PowerShell (Windows 10/11-এ modern default) ব্যবহার করে — নিচের command দুটোতেই কাজ করে, PowerShell কয়েকটা অতিরিক্ত security-relevant command যোগ করে।</p>'),
      h(2, 'জায়গা খুঁজে বের করা'),
      code('powershell', '# বর্তমান folder দেখান\nGet-Location\n\n# এখানকার file আর folder list করুন\nGet-ChildItem\n\n# একটা folder-এ যান\nCd Downloads\n\n# এক level উপরে ফিরে যান\nCd ..'),
      p('<p><code>Get-ChildItem</code>-কে সাধারণত এর alias <code>dir</code> বা <code>ls</code> দিয়ে ছোট করা হয় — PowerShell-এ দুটোই একইভাবে কাজ করে।</p>'),
      h(2, 'নেটওয়ার্ক Check করা — Security-Relevant', 'নেটওয়ার্ক-check-করা-security-relevant'),
      code('powershell', '# এই computer-এর IP address, gateway, আর DNS server দেখান\nipconfig /all\n\n# একটা host reachable কিনা test করুন\nping google.com\n\n# active network connection list করুন — অপ্রত্যাশিত কোথাও\n# একটা connection খুঁজে বের করার জন্য useful\nGet-NetTCPConnection -State Established'),
      p('<p><code>ipconfig /all</code> নিজেই জানার মতো — একটা device আসলে কোন Wi-Fi network-এ connected তা নিশ্চিত করার এটাই সবচেয়ে দ্রুত উপায়, যা সামনের Wi-Fi আর VPN lesson-এ সরাসরি কাজে লাগে।</p>'),
      h(2, 'কী চলছে তা Check করা', 'কী-চলছে-তা-check-করা'),
      code('powershell', '# প্রতিটা চলমান process list করুন\nGet-Process\n\n# নাম দিয়ে একটা নির্দিষ্ট process খুঁজুন\nGet-Process -Name chrome\n\n# আটকে থাকা বা চলার কথা না এমন একটা process বন্ধ করুন\nStop-Process -Name notepad'),
      callout('warning', '<p>কী তা না জেনে <code>Stop-Process</code> দিয়ে একটা অপরিচিত process বন্ধ করলে অন্য program বা system crash করতে পারে। বন্ধ করার আগে অপরিচিত process নাম খুঁজে দেখুন — এই command ইতিমধ্যে বন্ধ করা নিরাপদ বলে চিহ্নিত process-এর জন্য।</p>', 'বন্ধ করার আগে জানুন'),
      h(2, 'সাধারণ Command, দ্রুত Reference', 'সাধারণ-command-দ্রুত-reference'),
      table(['Command', 'কী করে'], [
        ['Get-Location / cd', 'বর্তমান folder দেখায় বা বদলায়'],
        ['Get-ChildItem / dir', 'file আর folder list করে'],
        ['ipconfig /all', 'network configuration দেখায় — IP, gateway, DNS'],
        ['ping <host>', 'একটা host response দেয় কিনা test করে'],
        ['Get-Process', 'চলমান process list করে'],
        ['Stop-Process -Name <name>', 'একটা চলমান process বন্ধ করে'],
        ['Get-NetTCPConnection', 'active network connection list করে'],
        ['Clear-History', 'এই session-এর command history clear করে'],
      ]),
    ],
  },
})

// ═══ 3. LINUX TERMINAL ═══════════════════════════════════════════════════

lessons.push({
  slug: 'linux-terminal', sortOrder: n++,
  en: {
    title: 'Linux Terminal Basics',
    metaTitle: 'Linux Terminal Basics | Learn Computer Academy',
    metaDescription: 'A first, practical introduction to the Linux terminal — the commands worth knowing for security work, whether on a personal machine or a remote server.',
    blocks: [
      p('<p>Linux runs most of the servers on the internet, and its terminal commands appear constantly in security guides, hosting tutorials, and troubleshooting articles — including elsewhere on this site (the Hosting & Deployment course connects to a server over SSH and uses exactly these commands). This lesson covers the basics on their own.</p>'),
      h(2, 'Finding Your Way Around'),
      code('bash', '# Show the current folder\npwd\n\n# List files and folders here\nls -la\n\n# Move into a folder\ncd Downloads\n\n# Go back up one level\ncd ..'),
      p('<p><code>ls -la</code> specifically — the <code>-a</code> flag shows hidden files (names starting with a dot, like <code>.ssh</code> or <code>.bashrc</code>), which regular <code>ls</code> quietly skips. A surprising amount of security-relevant configuration lives in hidden files.</p>'),
      h(2, 'Checking Your Network — Security-Relevant'),
      code('bash', '# Show this machine\'s IP address\nip a\n\n# Test whether a host is reachable\nping -c 4 google.com\n\n# List active network connections and the process using each\nss -tulnp'),
      p('<p><code>ss -tulnp</code> is worth remembering on its own — it lists every port a program is listening on, which is exactly what to check when trying to work out whether something unexpected is running a server on a machine.</p>'),
      h(2, 'Checking What\'s Running'),
      code('bash', '# List every running process\nps aux\n\n# Live, auto-refreshing view of processes and resource use\ntop\n\n# End a process by its ID (find the ID from ps aux first)\nkill 4821'),
      callout('warning', '<p>Like Windows\' <code>Stop-Process</code>, <code>kill</code> on an unfamiliar process ID can break something else that depends on it. Confirm what a process is (via <code>ps aux</code> or a search on its name) before ending it.</p>', 'Know before you kill'),
      h(2, 'File Permissions — A Real Security Setting'),
      p('<p>Every file on Linux has permissions controlling who can read, write, or execute it — this is not a formality, it\'s an actual access-control mechanism. A world-writable config file or an overly permissive SSH key is a genuine, common vulnerability.</p>'),
      code('bash', '# Check permissions on a file\nls -l script.sh\n\n# Make a file only the owner can read and write (common for SSH keys)\nchmod 600 id_rsa\n\n# Make a script executable\nchmod +x script.sh'),
      h(2, 'Common Commands, Quick Reference'),
      table(['Command', 'What it does'], [
        ['pwd', 'Show the current folder'],
        ['ls -la', 'List files and folders, including hidden ones'],
        ['ip a', 'Show network configuration'],
        ['ss -tulnp', 'List listening ports and the process using each'],
        ['ps aux', 'List running processes'],
        ['kill <id>', 'End a process by its process ID'],
        ['chmod 600 <file>', 'Restrict a file to owner read/write only'],
        ['sudo <command>', 'Run a command with administrator privileges'],
      ]),
    ],
  },
  bn: {
    title: 'Linux Terminal-এর বেসিক',
    metaTitle: 'Linux Terminal-এর বেসিক | Learn Computer Academy',
    metaDescription: 'Linux terminal-এর একটা প্রথম, practical পরিচয় — personal machine হোক বা remote server, security কাজের জন্য জানার মতো command।',
    blocks: [
      p('<p>Internet-এর বেশিরভাগ server Linux চালায়, আর এর terminal command ক্রমাগত security guide, hosting tutorial, আর troubleshooting article-এ দেখা যায় — এই সাইটের অন্য জায়গাতেও (Hosting & Deployment কোর্স SSH দিয়ে একটা server-এ connect করে আর ঠিক এই command-গুলোই ব্যবহার করে)। এই lesson নিজে থেকেই বেসিকগুলো কভার করে।</p>'),
      h(2, 'জায়গা খুঁজে বের করা'),
      code('bash', '# বর্তমান folder দেখান\npwd\n\n# এখানকার file আর folder list করুন\nls -la\n\n# একটা folder-এ যান\ncd Downloads\n\n# এক level উপরে ফিরে যান\ncd ..'),
      p('<p>বিশেষভাবে <code>ls -la</code> — <code>-a</code> flag hidden file দেখায় (dot দিয়ে শুরু হওয়া নাম, যেমন <code>.ssh</code> বা <code>.bashrc</code>), যা সাধারণ <code>ls</code> চুপচাপ বাদ দেয়। বিস্ময়কর পরিমাণ security-relevant configuration hidden file-এ থাকে।</p>'),
      h(2, 'নেটওয়ার্ক Check করা — Security-Relevant', 'নেটওয়ার্ক-check-করা-security-relevant'),
      code('bash', '# এই machine-এর IP address দেখান\nip a\n\n# একটা host reachable কিনা test করুন\nping -c 4 google.com\n\n# active network connection আর প্রতিটা ব্যবহার করা process list করুন\nss -tulnp'),
      p('<p><code>ss -tulnp</code> নিজেই মনে রাখার মতো — এটা প্রতিটা port list করে যেখানে একটা program listen করছে, যা কোনো machine-এ অপ্রত্যাশিতভাবে কিছু server চালাচ্ছে কিনা check করার জন্য ঠিক যা দরকার।</p>'),
      h(2, 'কী চলছে তা Check করা', 'কী-চলছে-তা-check-করা'),
      code('bash', '# প্রতিটা চলমান process list করুন\nps aux\n\n# process আর resource use-এর live, auto-refreshing view\ntop\n\n# ID দিয়ে একটা process বন্ধ করুন (আগে ps aux থেকে ID খুঁজুন)\nkill 4821'),
      callout('warning', '<p>Windows-এর <code>Stop-Process</code>-এর মতো, একটা অপরিচিত process ID-তে <code>kill</code> চালালে এর উপর নির্ভরশীল অন্য কিছু ভেঙে যেতে পারে। বন্ধ করার আগে (<code>ps aux</code> বা নাম দিয়ে search করে) নিশ্চিত করুন process-টা কী।</p>', 'বন্ধ করার আগে জানুন'),
      h(2, 'File Permission — একটা আসল Security Setting', 'file-permission-একটা-আসল-security-setting'),
      p('<p>Linux-এ প্রতিটা file-এর permission থাকে যা নিয়ন্ত্রণ করে কে read, write, বা execute করতে পারবে — এটা একটা formality না, এটা একটা আসল access-control mechanism। একটা world-writable config file বা একটা অতিরিক্ত permissive SSH key একটা আসল, সাধারণ vulnerability।</p>'),
      code('bash', '# একটা file-এর permission check করুন\nls -l script.sh\n\n# একটা file শুধু owner read আর write করতে পারবে এমন বানান (SSH key-এর জন্য common)\nchmod 600 id_rsa\n\n# একটা script executable বানান\nchmod +x script.sh'),
      h(2, 'সাধারণ Command, দ্রুত Reference', 'সাধারণ-command-দ্রুত-reference-২'),
      table(['Command', 'কী করে'], [
        ['pwd', 'বর্তমান folder দেখায়'],
        ['ls -la', 'hidden সহ file আর folder list করে'],
        ['ip a', 'network configuration দেখায়'],
        ['ss -tulnp', 'listening port আর প্রতিটা ব্যবহার করা process list করে'],
        ['ps aux', 'চলমান process list করে'],
        ['kill <id>', 'process ID দিয়ে একটা process বন্ধ করে'],
        ['chmod 600 <file>', 'একটা file শুধু owner read/write-এ সীমাবদ্ধ করে'],
        ['sudo <command>', 'administrator privilege দিয়ে একটা command চালায়'],
      ]),
    ],
  },
})

// ═══ 4. THE THREAT LANDSCAPE ═════════════════════════════════════════════

lessons.push({
  slug: 'threat-landscape', sortOrder: n++,
  en: {
    title: 'The Threat Landscape — Who Attacks, and Why',
    metaTitle: 'The Threat Landscape | Learn Computer Academy',
    metaDescription: 'The different kinds of attackers behind cybersecurity threats — cybercriminals, hacktivists, insiders, and state-sponsored groups — and what each actually wants.',
    blocks: [
      p('<p>"Hacker" is often imagined as one kind of person with one motive. In reality attackers fall into a few distinct categories, each with a different goal — knowing which is behind a given threat helps make sense of why it happens and what it\'s actually after.</p>'),
      h(2, 'Cybercriminals'),
      p('<p>By far the most common category, and the one every lesson in this course mainly defends against. Motive: profit. Stolen card numbers, ransomware payments, resold account access, and drained bank accounts are all straightforwardly monetized — this is a business to the people running it, run at scale with automated tools.</p>'),
      h(2, 'Hacktivists'),
      p('<p>Attackers motivated by a political or social cause rather than money — defacing a website, leaking documents, or disrupting a service to make a statement or protest an organization\'s actions. Individuals are rarely the target here; the target is usually a company, government, or public figure.</p>'),
      h(2, 'Insiders'),
      p('<p>Someone with legitimate access — an employee, a contractor, a family member with a shared password — misusing it, whether out of malice, carelessness, or being socially engineered themselves. Insider incidents are undercounted precisely because the access was never technically "broken into."</p>'),
      h(2, 'State-Sponsored Groups'),
      p('<p>Well-funded, patient groups operating on behalf of a government, typically after espionage, infrastructure disruption, or intelligence — not a typical target for an individual, but the source of many of the vulnerabilities and techniques that eventually trickle down into the automated tools cybercriminals use against everyone else.</p>'),
      table(['Attacker type', 'Typical motive', 'Typical target'], [
        ['Cybercriminals', 'Profit', 'Anyone — automated, high-volume'],
        ['Hacktivists', 'A cause or protest', 'Organizations, governments, public figures'],
        ['Insiders', 'Access already granted, misused', 'The organization or person that trusted them'],
        ['State-sponsored', 'Espionage, disruption', 'Governments, infrastructure, large organizations'],
      ]),
      callout('note', '<p>For the rest of this course, "the attacker" almost always means the first category — cybercriminals running automated, profit-driven attacks at scale. That\'s the threat an individual\'s everyday habits actually need to defend against.</p>', 'Which one this course is about'),
    ],
  },
  bn: {
    title: 'Threat Landscape — কে Attack করে, আর কেন',
    metaTitle: 'Threat Landscape | Learn Computer Academy',
    metaDescription: 'Cybersecurity threat-এর পেছনের বিভিন্ন ধরনের attacker — cybercriminal, hacktivist, insider, আর state-sponsored group — আর প্রতিটা আসলে কী চায়।',
    blocks: [
      p('<p>"Hacker" প্রায়ই একটা motive-এর একধরনের মানুষ হিসেবে কল্পনা করা হয়। বাস্তবে attacker কয়েকটা আলাদা category-তে পড়ে, প্রতিটার লক্ষ্য ভিন্ন — একটা নির্দিষ্ট threat-এর পেছনে কোনটা তা জানা এটা কেন হচ্ছে আর আসলে কী খুঁজছে তা বুঝতে সাহায্য করে।</p>'),
      h(2, 'Cybercriminal'),
      p('<p>এখন পর্যন্ত সবচেয়ে সাধারণ category, আর এই কোর্সের প্রতিটা lesson মূলত এর বিরুদ্ধে রক্ষা করে। Motive: profit। চুরি হওয়া card number, ransomware payment, resold account access, আর drain হওয়া bank account — সবই সরাসরি টাকায় রূপান্তরযোগ্য — যারা চালায় তাদের জন্য এটা একটা ব্যবসা, automated tool দিয়ে scale-এ চালানো।</p>'),
      h(2, 'Hacktivist'),
      p('<p>টাকার বদলে একটা political বা social cause দ্বারা অনুপ্রাণিত attacker — একটা statement দেওয়ার বা একটা organization-এর কাজের প্রতিবাদ করার জন্য একটা website deface করা, document leak করা, বা একটা service disrupt করা। এখানে individual খুব কম সময়ই target হয়; target সাধারণত একটা company, government, বা public figure।</p>'),
      h(2, 'Insider'),
      p('<p>বৈধ access থাকা কেউ — একজন employee, একজন contractor, শেয়ার করা password সহ একজন family member — malice, অসতর্কতা, বা নিজে socially engineered হওয়ার কারণে যা-ই হোক এটা misuse করা। Insider ঘটনা কম গণনা করা হয় ঠিক এই কারণে যে access কখনো technically "break into" করা হয়নি।</p>'),
      h(2, 'State-Sponsored Group'),
      p('<p>একটা government-এর পক্ষে কাজ করা ভালোভাবে funded, ধৈর্যশীল group, সাধারণত espionage, infrastructure disruption, বা intelligence-এর পেছনে — একজন individual-এর জন্য সাধারণ target না, কিন্তু অনেক vulnerability আর technique-এর source যা শেষ পর্যন্ত cybercriminal-রা বাকি সবার বিরুদ্ধে ব্যবহার করা automated tool-এ নেমে আসে।</p>'),
      table(['Attacker type', 'সাধারণ motive', 'সাধারণ target'], [
        ['Cybercriminal', 'Profit', 'যে কেউ — automated, high-volume'],
        ['Hacktivist', 'একটা cause বা প্রতিবাদ', 'Organization, government, public figure'],
        ['Insider', 'ইতিমধ্যে দেওয়া access, misuse করা', 'যে organization বা মানুষ তাদের বিশ্বাস করেছিল'],
        ['State-sponsored', 'Espionage, disruption', 'Government, infrastructure, বড় organization'],
      ]),
      callout('note', '<p>এই কোর্সের বাকি অংশে, "attacker" বলতে প্রায় সবসময় প্রথম category বোঝায় — profit-driven attack চালানো cybercriminal, scale-এ। এটাই সেই threat যা একজন individual-এর প্রতিদিনের habit-কে আসলে defend করতে হয়।</p>', 'এই কোর্স কোনটা নিয়ে'),
    ],
  },
})

// ═══ 5. MALWARE DEEP DIVE ════════════════════════════════════════════════

lessons.push({
  slug: 'malware-deep-dive', sortOrder: n++,
  en: {
    title: 'Malware Deep Dive — How It Actually Behaves',
    metaTitle: 'Malware Deep Dive | Learn Computer Academy',
    metaDescription: 'How malware actually gets onto a device, what it does once inside, the signs of an infection, and how to contain one — beyond just naming the types.',
    blocks: [
      p('<p>Basics/Computer Basics already covers what the common malware types are called. This lesson goes one level deeper — how malware actually gets in, what it does once it\'s there, and what to do if a device is already infected.</p>'),
      h(2, 'How It Gets In'),
      table(['Entry point', 'How it works'], [
        ['Email attachments', 'A disguised file (often a fake invoice, resume, or document) runs malicious code when opened'],
        ['Fake downloads', 'Cracked software, "free" versions of paid tools, or a fake update prompt bundled with malware'],
        ['Infected USB drives', 'Malware set to auto-run the moment a drive is plugged in'],
        ['Malicious links', 'A link that silently triggers a download, or leads to a fake page designed to trick a user into installing something'],
      ]),
      h(2, 'What It Does Once Inside'),
      p('<p>Once running, malware typically does one or more of three things: <b>spreads</b> (copies itself to other files, drives, or devices on the same network), <b>encrypts or destroys</b> (ransomware locks files and demands payment; some malware simply deletes or corrupts data), and <b>spies</b> (keyloggers record keystrokes, spyware quietly captures screens or browsing activity and sends it to the attacker).</p>'),
      h(2, 'Signs of an Infection'),
      p('<p>A device suddenly running much slower than usual, unfamiliar pop-ups or browser toolbars appearing, unrecognized processes in Task Manager (or <code>Get-Process</code>, from the Windows command line lesson), the webcam light turning on unprompted, or friends receiving strange messages from an account are all common warning signs — none of them proof on their own, but worth investigating together.</p>'),
      h(2, 'Containing an Outbreak'),
      p('<p>If a device is confirmed or strongly suspected to be infected, the order matters: disconnect it from the network first (Wi-Fi off, cable unplugged) to stop it spreading or sending data out, then run a full scan with up-to-date antivirus software, and — if files were encrypted or the infection can\'t be fully cleaned — restore from a backup made before the infection rather than trusting the compromised device\'s current state.</p>'),
      callout('warning', '<p>Disconnecting from the network is the single most useful first step and is often skipped. An infected device left online can keep spreading to other devices on the same Wi-Fi or sending stolen data out the entire time it stays connected.</p>', 'Disconnect first, always'),
    ],
  },
  bn: {
    title: 'Malware Deep Dive — এটা আসলে কীভাবে কাজ করে',
    metaTitle: 'Malware Deep Dive | Learn Computer Academy',
    metaDescription: 'Malware আসলে একটা device-এ কীভাবে ঢোকে, ভেতরে ঢোকার পর কী করে, একটা infection-এর লক্ষণ, আর কীভাবে এটা contain করা যায় — শুধু type-গুলোর নাম বলার বাইরে।',
    blocks: [
      p('<p>Basics/Computer Basics ইতিমধ্যে common malware type-গুলোর নাম কী তা কভার করে। এই lesson এক ধাপ গভীরে যায় — malware আসলে কীভাবে ঢোকে, ভেতরে ঢোকার পর কী করে, আর একটা device ইতিমধ্যে infected হয়ে গেলে কী করতে হয়।</p>'),
      h(2, 'এটা কীভাবে ঢোকে', 'এটা-কীভাবে-ঢোকে'),
      table(['প্রবেশ পয়েন্ট', 'এটা কীভাবে কাজ করে'], [
        ['Email attachment', 'একটা ছদ্মবেশী file (প্রায়ই একটা fake invoice, resume, বা document) খোলা হলে malicious code চালায়'],
        ['Fake download', 'Cracked software, paid tool-এর "free" version, বা malware bundled করা একটা fake update prompt'],
        ['Infected USB drive', 'একটা drive plug in করার সাথে সাথে auto-run হতে set করা malware'],
        ['Malicious link', 'চুপচাপ একটা download trigger করা, বা একজন user-কে কিছু install করাতে trick করার জন্য বানানো একটা fake page-এ নিয়ে যাওয়া একটা link'],
      ]),
      h(2, 'ভেতরে ঢোকার পর এটা কী করে', 'ভেতরে-ঢোকার-পর-এটা-কী-করে'),
      p('<p>একবার চালু হলে, malware সাধারণত তিনটার এক বা একাধিক কাজ করে: <b>spread</b> (একই network-এর অন্য file, drive, বা device-এ নিজেকে copy করে), <b>encrypt বা destroy</b> (ransomware file lock করে payment দাবি করে; কিছু malware শুধু data delete বা corrupt করে), আর <b>spy</b> (keylogger keystroke record করে, spyware চুপচাপ screen বা browsing activity capture করে attacker-এর কাছে পাঠায়)।</p>'),
      h(2, 'Infection-এর লক্ষণ', 'infection-এর-লক্ষণ'),
      p('<p>একটা device হঠাৎ স্বাভাবিকের চেয়ে অনেক ধীর হয়ে যাওয়া, অপরিচিত pop-up বা browser toolbar দেখা দেওয়া, Task Manager-এ (বা Windows command line lesson থেকে <code>Get-Process</code>) অচেনা process, webcam light প্রশ্ন ছাড়াই জ্বলে ওঠা, বা বন্ধুরা একটা account থেকে অদ্ভুত message পাওয়া — সবই সাধারণ সতর্কতা চিহ্ন — একা কোনোটাই প্রমাণ না, কিন্তু একসাথে দেখার যোগ্য।</p>'),
      h(2, 'একটা Outbreak Contain করা', 'একটা-outbreak-contain-করা'),
      p('<p>একটা device নিশ্চিতভাবে বা প্রবলভাবে সন্দেহভাজন infected হলে, ক্রম গুরুত্বপূর্ণ: প্রথমে এটাকে network থেকে disconnect করুন (Wi-Fi বন্ধ, cable খুলে ফেলুন) যাতে ছড়ানো বা data পাঠানো বন্ধ হয়, তারপর up-to-date antivirus software দিয়ে একটা full scan চালান, আর — file encrypted হলে বা infection পুরোপুরি clean করা না গেলে — compromised device-এর বর্তমান অবস্থা বিশ্বাস করার বদলে infection-এর আগে বানানো একটা backup থেকে restore করুন।</p>'),
      callout('warning', '<p>Network থেকে disconnect করা একক সবচেয়ে useful প্রথম step আর প্রায়ই বাদ পড়ে যায়। Online থাকা একটা infected device connected থাকার পুরো সময় একই Wi-Fi-এর অন্য device-এ ছড়াতে থাকতে পারে বা চুরি করা data পাঠাতে থাকতে পারে।</p>', 'সবসময় আগে disconnect করুন'),
    ],
  },
})

// ═══ 6. PHISHING AND SOCIAL ENGINEERING ══════════════════════════════════

lessons.push({
  slug: 'phishing-social-engineering', sortOrder: n++,
  en: {
    title: 'Phishing and Social Engineering',
    metaTitle: 'Phishing and Social Engineering | Learn Computer Academy',
    metaDescription: 'The five common forms phishing and social engineering take, and the warning signs shared across almost all of them.',
    blocks: [
      p('<p><b>Social engineering</b> is the umbrella term for tricking a person into handing over access or information, rather than breaking through a technical defense. <b>Phishing</b> is its most common form, but it takes several distinct shapes worth recognizing individually.</p>'),
      h(2, 'The Five Common Forms'),
      table(['Form', 'What it looks like'], [
        ['Phishing', 'A generic fake email — a bank, delivery service, or well-known company impersonated, sent to thousands of people at once'],
        ['Spear phishing', 'The same idea, but personalized with a real name, employer, or recent activity — far more convincing, and worth extra suspicion for that reason'],
        ['Smishing', 'The same tactic delivered by SMS text message, often a fake delivery notice or "your account has been locked" link'],
        ['Vishing', 'A phone call, often from a spoofed number, impersonating a bank, tech support, or government agency to extract information verbally'],
        ['Pretexting', 'An attacker builds a false but plausible scenario — posing as a coworker, IT support, or a vendor — to make a request seem legitimate before asking for anything'],
      ]),
      h(2, 'The Warning Signs Shared Across All Five'),
      p('<p>Despite the different delivery methods, the actual tricks repeat: manufactured <b>urgency</b> ("act within 24 hours or your account is closed"), offers that are <b>too good to be true</b>, a sender address or phone number that <b>doesn\'t quite match</b> who it claims to be, and a request for something a legitimate organization would never actually ask for over email or phone — a full password, a one-time login code, or a card\'s CVV.</p>'),
      table(['Warning sign', 'Why it works on people'], [
        ['Urgency / a countdown', 'Pressure short-circuits careful thinking'],
        ['Too good to be true', 'A prize, refund, or discount that overrides normal caution'],
        ['Mismatched sender address', 'A display name that looks right hides a wrong underlying address'],
        ['Request for a code or password', 'No legitimate service asks for these — this alone is close to a guarantee it\'s an attack'],
      ]),
      callout('tip', '<p>The single most reliable rule: no legitimate bank, company, or government office will ever ask for a full password, a one-time login code, or a card\'s CVV over phone, email, or text. Any message asking for one of these is fake, regardless of how convincing it looks otherwise.</p>', 'The one rule that covers most of it'),
    ],
  },
  bn: {
    title: 'Phishing আর Social Engineering',
    metaTitle: 'Phishing আর Social Engineering | Learn Computer Academy',
    metaDescription: 'Phishing আর social engineering-এর পাঁচটা common রূপ, আর প্রায় সবগুলোতে শেয়ার হওয়া সতর্কতা চিহ্ন।',
    blocks: [
      p('<p><b>Social engineering</b> হলো একটা technical defense ভাঙার বদলে একজন মানুষকে access বা information দিয়ে দিতে trick করার umbrella term। <b>Phishing</b> এর সবচেয়ে common রূপ, কিন্তু এটা আলাদাভাবে চেনার মতো বেশ কয়েকটা distinct আকার নেয়।</p>'),
      h(2, 'পাঁচটা Common রূপ', 'পাঁচটা-common-রূপ'),
      table(['রূপ', 'দেখতে কেমন'], [
        ['Phishing', 'একটা generic fake email — একটা bank, delivery service, বা পরিচিত company-র ছদ্মবেশে, একসাথে হাজার হাজার মানুষকে পাঠানো'],
        ['Spear phishing', 'একই ধারণা, কিন্তু একটা আসল নাম, employer, বা সাম্প্রতিক activity দিয়ে personalized — অনেক বেশি convincing, আর সেই কারণে অতিরিক্ত সন্দেহের যোগ্য'],
        ['Smishing', 'SMS text message-এ পাঠানো একই কৌশল, প্রায়ই একটা fake delivery notice বা "আপনার account লক হয়ে গেছে" link'],
        ['Vishing', 'একটা phone call, প্রায়ই spoofed number থেকে, মৌখিকভাবে information বের করার জন্য একটা bank, tech support, বা government agency-র ছদ্মবেশে'],
        ['Pretexting', 'একজন attacker একটা false কিন্তু plausible scenario বানায় — একজন coworker, IT support, বা vendor সেজে — কিছু চাওয়ার আগে একটা request বৈধ মনে করানোর জন্য'],
      ]),
      h(2, 'পাঁচটাতেই শেয়ার হওয়া সতর্কতা চিহ্ন', 'পাঁচটাতেই-শেয়ার-হওয়া-সতর্কতা-চিহ্ন'),
      p('<p>ভিন্ন delivery method সত্ত্বেও, আসল trick-গুলো বারবার আসে: তৈরি করা <b>urgency</b> ("২৪ ঘণ্টার মধ্যে action না নিলে আপনার account বন্ধ হয়ে যাবে"), <b>সত্যি হতে খুব ভালো</b> offer, একটা sender address বা phone number যা যা দাবি করছে তার সাথে <b>ঠিক মেলে না</b>, আর এমন কিছু চাওয়া যা একটা বৈধ organization email বা phone-এ কখনো চাইবে না — একটা পুরো password, একটা one-time login code, বা একটা card-এর CVV।</p>'),
      table(['সতর্কতা চিহ্ন', 'কেন এটা মানুষের উপর কাজ করে'], [
        ['Urgency / একটা countdown', 'চাপ সতর্ক চিন্তাভাবনাকে short-circuit করে'],
        ['সত্যি হতে খুব ভালো', 'একটা prize, refund, বা discount যা স্বাভাবিক সতর্কতাকে overriding করে'],
        ['অমিল sender address', 'ঠিক দেখানো একটা display name ভুল underlying address লুকায়'],
        ['একটা code বা password চাওয়া', 'কোনো বৈধ service এগুলো চায় না — এটা একাই প্রায় একটা attack হওয়ার গ্যারান্টি'],
      ]),
      callout('tip', '<p>একটা মাত্র সবচেয়ে নির্ভরযোগ্য নিয়ম: কোনো বৈধ bank, company, বা government office কখনো phone, email, বা text-এ একটা পুরো password, একটা one-time login code, বা একটা card-এর CVV চাইবে না। এগুলোর একটা চাওয়া যেকোনো message অন্যদিক থেকে যতই convincing দেখাক না কেন fake।</p>', 'এই একটা নিয়ম বেশিরভাগ কভার করে'),
    ],
  },
})

// ═══ 7. PASSWORDS AND PASSWORD MANAGERS (real screenshot later) ══════════

lessons.push({
  slug: 'password-managers', sortOrder: n++,
  en: {
    title: 'Building Strong Passwords and Using a Password Manager',
    metaTitle: 'Strong Passwords and Password Managers | Learn Computer Academy',
    metaDescription: 'What actually makes a password strong, why reuse is the real danger, and how a password manager solves both problems without needing to memorize anything.',
    blocks: [
      p('<p>Password advice used to focus on complexity — a capital letter, a number, a symbol. The bigger real-world risk turned out to be something else entirely: <b>reuse</b>. A strong-looking password used on ten sites is only as safe as the weakest of those ten.</p>'),
      h(2, 'Why Length Beats Complexity'),
      p('<p>A long, random password is far harder to guess than a short complex-looking one — <code>correct-horse-battery-staple</code> (25 characters) takes vastly longer to brute-force than <code>P@ssw0rd1</code> (9 characters), despite looking less "secure" at a glance. Length is the single strongest factor.</p>'),
      h(2, 'Why Reuse Is the Real Danger'),
      p('<p>When one site suffers a data breach — and breaches happen constantly, even to large, careful companies — every password reused on other sites is now compromised too. Attackers run leaked username/password lists against banks, email providers, and social media automatically; this is called <b>credential stuffing</b>, and it\'s the single most common way an "unrelated" account gets broken into.</p>'),
      h(2, 'What a Password Manager Actually Does'),
      p('<p>A password manager generates a long, random, unique password for every single site and remembers it — the only password a person needs to actually memorize is the one master password that unlocks the manager itself. This makes "a different strong password on every site" practical for the first time, rather than a piece of advice nobody can realistically follow by hand.</p>'),
      table(['Without a password manager', 'With one'], [
        ['Reused or simplified passwords, because memorizing dozens is unrealistic', 'A unique, long, random password on every account'],
        ['One breach anywhere puts every reused account at risk', 'One breach only affects that one site'],
        ['Passwords typed out — vulnerable to a keylogger or shoulder-surfing', 'Passwords filled in automatically, nothing typed'],
      ]),
      callout('tip', '<p>Most browsers include a basic built-in password manager, but a dedicated one (several offer solid free tiers) syncs across devices, generates stronger passwords by default, and warns about reused or breached ones — worth the switch.</p>', 'Built-in vs. dedicated'),
    ],
  },
  bn: {
    title: 'শক্তিশালী Password বানানো আর Password Manager ব্যবহার',
    metaTitle: 'শক্তিশালী Password আর Password Manager | Learn Computer Academy',
    metaDescription: 'একটা password আসলে কী শক্তিশালী বানায়, কেন reuse আসল বিপদ, আর একটা password manager কীভাবে কিছু মনে না রেখেই দুটো সমস্যাই সমাধান করে।',
    blocks: [
      p('<p>Password advice আগে complexity-র উপর focus করত — একটা capital letter, একটা number, একটা symbol। বাস্তবে বড় বিপদ আসলে সম্পূর্ণ অন্য কিছু বেরিয়ে এসেছে: <b>reuse</b>। শক্তিশালী-দেখতে একটা password দশটা site-এ ব্যবহার করলে এটা ওই দশটার মধ্যে সবচেয়ে দুর্বলটার মতোই নিরাপদ।</p>'),
      h(2, 'কেন Length Complexity-কে হারায়', 'কেন-length-complexity-কে-হারায়'),
      p('<p>একটা লম্বা, random password একটা ছোট complex-দেখতে password-এর চেয়ে অনেক বেশি guess করা কঠিন — <code>correct-horse-battery-staple</code> (২৫ character) <code>P@ssw0rd1</code>-এর (৯ character) চেয়ে brute-force করতে অনেক বেশি সময় নেয়, এক নজরে কম "secure" দেখালেও। Length একক সবচেয়ে শক্তিশালী factor।</p>'),
      h(2, 'কেন Reuse আসল বিপদ', 'কেন-reuse-আসল-বিপদ'),
      p('<p>যখন একটা site data breach-এর শিকার হয় — আর breach ক্রমাগত হয়, এমনকি বড়, সতর্ক company-দেরও — অন্য site-এ reuse করা প্রতিটা password এখন compromised। Attacker leaked username/password list automatically bank, email provider, আর social media-র বিরুদ্ধে চালায়; একে বলা হয় <b>credential stuffing</b>, আর এটাই একটা "অসম্পর্কিত" account break হওয়ার একক সবচেয়ে common উপায়।</p>'),
      h(2, 'একটা Password Manager আসলে কী করে', 'একটা-password-manager-আসলে-কী-করে'),
      p('<p>একটা password manager প্রতিটা site-এর জন্য একটা লম্বা, random, unique password তৈরি করে আর মনে রাখে — মনে রাখার মতো একমাত্র password যা একজন মানুষের দরকার সেটাই master password যা manager-টাকেই unlock করে। এটা প্রথমবারের মতো "প্রতিটা site-এ ভিন্ন শক্তিশালী password" practical বানায়, হাতে সত্যিকারভাবে কেউ follow করতে পারে না এমন একটা advice-এর বদলে।</p>'),
      table(['Password manager ছাড়া', 'একটা সহ'], [
        ['Reuse করা বা সহজ করা password, কারণ কয়েক ডজন মনে রাখা অবাস্তব', 'প্রতিটা account-এ একটা unique, লম্বা, random password'],
        ['যেকোনো জায়গায় একটা breach reuse করা প্রতিটা account-কে বিপদে ফেলে', 'একটা breach শুধু সেই একটা site-কেই প্রভাবিত করে'],
        ['Password টাইপ করা — keylogger বা shoulder-surfing-এর জন্য দুর্বল', 'Password স্বয়ংক্রিয়ভাবে fill হয়, কিছু টাইপ হয় না'],
      ]),
      callout('tip', '<p>বেশিরভাগ browser-এ একটা basic built-in password manager থাকে, কিন্তু একটা dedicated (কয়েকটা ভালো free tier দেয়) device জুড়ে sync হয়, default-এ শক্তিশালী password তৈরি করে, আর reuse করা বা breach হওয়া password সম্পর্কে সতর্ক করে — switch করার যোগ্য।</p>', 'Built-in বনাম Dedicated'),
    ],
  },
})

// ═══ 8. TWO-FACTOR AUTHENTICATION (real screenshot later) ═══════════════

lessons.push({
  slug: 'two-factor-authentication', sortOrder: n++,
  en: {
    title: 'Setting Up Two-Factor Authentication',
    metaTitle: 'Setting Up Two-Factor Authentication | Learn Computer Academy',
    metaDescription: 'What two-factor authentication actually protects against, the different methods available, and why an authenticator app beats SMS codes.',
    blocks: [
      p('<p><b>Two-factor authentication</b> (2FA) requires a second proof of identity beyond a password — usually something a person <i>has</i> (a phone) in addition to something they <i>know</i> (the password). Its entire point: a stolen or leaked password alone is no longer enough to get in.</p>'),
      h(2, 'The Methods, Ranked'),
      table(['Method', 'How it works', 'Security level'], [
        ['Authenticator app', 'A time-based code generated on the phone itself, offline (Google Authenticator, Authy, etc.)', 'Strongest common option'],
        ['Hardware security key', 'A physical USB/NFC key plugged in or tapped to confirm', 'Strongest overall, less common for everyday accounts'],
        ['SMS text code', 'A code sent by text message', 'Weakest — vulnerable to SIM-swapping'],
        ['Email code', 'A code sent to a backup email', 'Only as strong as that email account\'s own security'],
      ]),
      h(2, 'Why SMS Is the Weakest Option'),
      p('<p>SMS 2FA can be bypassed through <b>SIM swapping</b> — an attacker convinces a mobile carrier to transfer a phone number to a SIM card they control, often using social engineering against the carrier\'s support staff rather than any technical hack. Once that succeeds, every SMS code meant for the real owner goes straight to the attacker instead. It\'s still far better than no 2FA at all, just the weakest option among the real ones.</p>'),
      h(2, 'Setting It Up — The General Steps'),
      p('<p>Nearly every major service follows the same pattern: open account security settings, find "Two-Factor Authentication" or "2-Step Verification," choose an authenticator app as the method, scan the QR code it shows with the authenticator app, and enter the six-digit code it generates to confirm. The service will also offer a set of one-time backup codes at this point.</p>'),
      callout('warning', '<p>Save the backup codes offered during setup somewhere safe and offline — a password manager\'s secure notes, or printed and stored physically. Losing both the phone with the authenticator app and these codes can mean permanent lockout from an account.</p>', 'Always save the backup codes'),
    ],
  },
  bn: {
    title: 'Two-Factor Authentication সেট আপ করা',
    metaTitle: 'Two-Factor Authentication সেট আপ করা | Learn Computer Academy',
    metaDescription: 'Two-factor authentication আসলে কী থেকে রক্ষা করে, উপলব্ধ বিভিন্ন method, আর কেন একটা authenticator app SMS code-কে হারায়।',
    blocks: [
      p('<p><b>Two-factor authentication</b> (2FA)-এর জন্য password ছাড়াও identity-র একটা দ্বিতীয় প্রমাণ লাগে — সাধারণত একজন মানুষ যা <i>জানে</i> (password) তার পাশাপাশি যা তার <i>কাছে আছে</i> (একটা phone)। এর পুরো উদ্দেশ্য: একা চুরি বা leaked একটা password ঢোকার জন্য আর যথেষ্ট না।</p>'),
      h(2, 'Method-গুলো, Rank করা', 'method-গুলো-rank-করা'),
      table(['Method', 'কীভাবে কাজ করে', 'Security level'], [
        ['Authenticator app', 'Phone-এই offline generate হওয়া একটা time-based code (Google Authenticator, Authy, ইত্যাদি)', 'সবচেয়ে শক্তিশালী common option'],
        ['Hardware security key', 'Confirm করতে plug in বা tap করা একটা physical USB/NFC key', 'সামগ্রিকভাবে সবচেয়ে শক্তিশালী, প্রতিদিনের account-এর জন্য কম common'],
        ['SMS text code', 'Text message-এ পাঠানো একটা code', 'সবচেয়ে দুর্বল — SIM-swapping-এর জন্য দুর্বল'],
        ['Email code', 'একটা backup email-এ পাঠানো একটা code', 'শুধু সেই email account-এর নিজের security-র মতোই শক্তিশালী'],
      ]),
      h(2, 'কেন SMS সবচেয়ে দুর্বল Option', 'কেন-sms-সবচেয়ে-দুর্বল-option'),
      p('<p>SMS 2FA <b>SIM swapping</b>-এর মাধ্যমে bypass করা যায় — একজন attacker একটা mobile carrier-কে একটা phone number তাদের নিয়ন্ত্রণে থাকা একটা SIM card-এ transfer করাতে রাজি করায়, প্রায়ই কোনো technical hack-এর বদলে carrier-এর support staff-এর বিরুদ্ধে social engineering ব্যবহার করে। এটা সফল হলে, আসল মালিকের জন্য পাঠানো প্রতিটা SMS code সরাসরি attacker-এর কাছে যায়। এটা এখনো কোনো 2FA না থাকার চেয়ে অনেক ভালো, শুধু আসল option-গুলোর মধ্যে সবচেয়ে দুর্বল।</p>'),
      h(2, 'এটা সেট আপ করা — সাধারণ Step', 'এটা-সেট-আপ-করা-সাধারণ-step'),
      p('<p>প্রায় প্রতিটা major service একই pattern follow করে: account security setting খুলুন, "Two-Factor Authentication" বা "2-Step Verification" খুঁজুন, method হিসেবে একটা authenticator app বেছে নিন, authenticator app দিয়ে দেখানো QR code scan করুন, আর confirm করতে এটা generate করা six-digit code লিখুন। এই পয়েন্টে service কিছু one-time backup code-ও দেবে।</p>'),
      callout('warning', '<p>Setup-এর সময় দেওয়া backup code কোথাও নিরাপদ আর offline জায়গায় save করুন — একটা password manager-এর secure note, বা print করে physically store করা। Authenticator app সহ phone আর এই code দুটোই হারানো মানে একটা account থেকে permanent lockout হতে পারে।</p>', 'সবসময় backup code save করুন'),
    ],
  },
})

// ═══ 9. SAFE BROWSING ════════════════════════════════════════════════════

lessons.push({
  slug: 'safe-browsing', sortOrder: n++,
  en: {
    title: 'Safe Browsing and Spotting Fake Websites',
    metaTitle: 'Safe Browsing and Spotting Fake Websites | Learn Computer Academy',
    metaDescription: 'How to check a website before typing anything into it — the padlock, the actual domain, and the tricks fake sites rely on.',
    blocks: [
      p('<p>Most fake websites don\'t need to be technically sophisticated — they only need to look convincing for the few seconds it takes someone to enter a password or card number. A handful of checks catch the overwhelming majority of them before that happens.</p>'),
      h(2, 'Check the Padlock and HTTPS'),
      p('<p>A padlock icon in the address bar means the connection to the site is encrypted (HTTPS) — but it does <i>not</i> mean the site is trustworthy or legitimate. Fake sites can and do use HTTPS too; the padlock only confirms the connection itself can\'t be eavesdropped on, nothing about who actually runs the site.</p>'),
      h(2, 'Check the Domain, Not Just the Name'),
      p('<p>A URL breaks into pieces: <code>https://www.example.com/login</code> — the <b>domain</b> (<code>example.com</code>) is the part that actually matters, not the path after it or a subdomain in front of it. A fake login page might live at <code>example.com.verify-account.net</code> — everything before the real domain is meaningless dressing; only what\'s directly before the final <code>.com</code>/<code>.net</code>/etc. counts.</p>'),
      h(2, 'Too Good to Be True'),
      p('<p>A pop-up announcing a prize, a "you\'re the 1,000,000th visitor," or an unbelievable discount exists specifically to short-circuit careful thinking before it starts. If an offer would be remarkable news on a legitimate site, healthy suspicion is the correct default reaction, not excitement.</p>'),
      h(2, 'Hover Before You Click'),
      p('<p>Hovering the mouse over a link (without clicking) shows the actual destination URL, usually in the browser\'s status bar. A link displayed as "Click here to verify your account" that actually points somewhere completely unrelated is one of the most reliable single tells available.</p>'),
      table(['Real', 'Fake (same visible text, different destination)'], [
        ['paypal.com/login', 'paypal.com.secure-verify.ru/login'],
        ['facebook.com', 'faceb00k-support.com'],
        ['yourbank.com/account', 'yourbank-account-alert.net'],
      ]),
    ],
  },
  bn: {
    title: 'Safe Browsing আর Fake Website চেনা',
    metaTitle: 'Safe Browsing আর Fake Website চেনা | Learn Computer Academy',
    metaDescription: 'কিছু টাইপ করার আগে একটা website কীভাবে check করবেন — padlock, আসল domain, আর fake site যেসব trick-এর উপর নির্ভর করে।',
    blocks: [
      p('<p>বেশিরভাগ fake website-এর technically sophisticated হওয়ার দরকার নেই — কারো একটা password বা card number দিতে যতটুকু সময় লাগে ততক্ষণের জন্য শুধু convincing দেখালেই চলে। কয়েকটা check এটা ঘটার আগেই এগুলোর অধিকাংশ ধরে ফেলে।</p>'),
      h(2, 'Padlock আর HTTPS Check করুন', 'padlock-আর-https-check-করুন'),
      p('<p>Address bar-এ একটা padlock icon মানে site-এর সাথে connection encrypted (HTTPS) — কিন্তু এর মানে <i>না</i> যে site trustworthy বা বৈধ। Fake site-ও HTTPS ব্যবহার করতে পারে আর করে; padlock শুধু নিশ্চিত করে যে connection নিজেই eavesdrop করা যাবে না, site আসলে কে চালায় তা নিয়ে কিছু না।</p>'),
      h(2, 'শুধু নাম না, Domain Check করুন', 'শুধু-নাম-না-domain-check-করুন'),
      p('<p>একটা URL কয়েকটা অংশে ভাঙে: <code>https://www.example.com/login</code> — <b>domain</b>-টা (<code>example.com</code>) আসলে গুরুত্বপূর্ণ অংশ, এর পরের path বা সামনের subdomain না। একটা fake login page <code>example.com.verify-account.net</code>-এ থাকতে পারে — আসল domain-এর আগে সবকিছুই অর্থহীন সাজসজ্জা; শুধু শেষ <code>.com</code>/<code>.net</code>/ইত্যাদির ঠিক আগেরটাই গণনা করে।</p>'),
      h(2, 'সত্যি হতে খুব ভালো', 'সত্যি-হতে-খুব-ভালো'),
      p('<p>একটা prize ঘোষণা করা pop-up, একটা "আপনি ১,০০০,০০০তম visitor," বা একটা অবিশ্বাস্য discount বিশেষভাবে সতর্ক চিন্তাভাবনা শুরু হওয়ার আগেই short-circuit করার জন্য থাকে। একটা বৈধ site-এ একটা offer উল্লেখযোগ্য খবর হলে, উত্তেজনা না, সুস্থ সন্দেহই সঠিক default প্রতিক্রিয়া।</p>'),
      h(2, 'Click করার আগে Hover করুন', 'click-করার-আগে-hover-করুন'),
      p('<p>Mouse দিয়ে একটা link hover করলে (click না করে) আসল destination URL দেখায়, সাধারণত browser-এর status bar-এ। "Click here to verify your account" হিসেবে দেখানো একটা link যা আসলে সম্পূর্ণ অসম্পর্কিত কোথাও নিয়ে যায় তা উপলব্ধ সবচেয়ে নির্ভরযোগ্য একক signal-গুলোর একটা।</p>'),
      table(['আসল', 'নকল (একই দেখতে text, ভিন্ন destination)'], [
        ['paypal.com/login', 'paypal.com.secure-verify.ru/login'],
        ['facebook.com', 'faceb00k-support.com'],
        ['yourbank.com/account', 'yourbank-account-alert.net'],
      ]),
    ],
  },
})

// ═══ 10. BROWSER PRIVACY SETTINGS (real screenshot later) ════════════════

lessons.push({
  slug: 'browser-privacy-settings', sortOrder: n++,
  en: {
    title: 'Browser Privacy and Security Settings',
    metaTitle: 'Browser Privacy and Security Settings | Learn Computer Academy',
    metaDescription: 'The browser settings actually worth checking — tracking protection, saved passwords, site permissions, and autofill.',
    blocks: [
      p('<p>Every major browser (Chrome, Firefox, Edge, Safari) ships with privacy and security controls most people never open. None of these require technical knowledge — they\'re a handful of settings worth checking once and revisiting occasionally.</p>'),
      h(2, 'Tracking Protection'),
      p('<p>Modern browsers include a built-in tracker blocker, usually under a setting called "Tracking Prevention," "Enhanced Protection," or similar. It\'s worth confirming it\'s actually set to its strongest non-breaking level — it\'s sometimes left on a weaker default.</p>'),
      h(2, 'Saved Passwords'),
      p('<p>The browser\'s own password manager (covered in more depth in the earlier password lesson) is worth reviewing periodically — checking for any weak or reused passwords the browser flags, and removing saved logins for accounts that no longer exist.</p>'),
      h(2, 'Site Permissions'),
      p('<p>Sites accumulate permissions over time — camera, microphone, location, notifications — often granted once, years ago, for a site no longer even used. The browser\'s site settings page lists every permission ever granted, by site, and lets each one be revoked individually.</p>'),
      h(2, 'Autofill Data'),
      p('<p>Saved addresses, phone numbers, and card details speed up checkout forms, but they\'re also exactly the data a malicious or compromised site could try to harvest silently. Reviewing what\'s actually saved there — and removing anything no longer needed, especially old card details — is worth doing alongside the password review.</p>'),
      table(['Setting', 'Where to find it (general)', 'Why it matters'], [
        ['Tracking protection', 'Privacy & Security settings', 'Limits cross-site tracking of browsing habits'],
        ['Saved passwords', 'Passwords / Autofill settings', 'Flags weak or breached passwords'],
        ['Site permissions', 'Privacy & Security → Site Settings', 'Revokes camera/mic/location access no longer needed'],
        ['Autofill data', 'Autofill settings', 'Controls what personal/payment data is stored and offered'],
      ]),
    ],
  },
  bn: {
    title: 'Browser Privacy আর Security Setting',
    metaTitle: 'Browser Privacy আর Security Setting | Learn Computer Academy',
    metaDescription: 'আসলে check করার যোগ্য browser setting — tracking protection, saved password, site permission, আর autofill।',
    blocks: [
      p('<p>প্রতিটা major browser (Chrome, Firefox, Edge, Safari) privacy আর security control নিয়ে আসে যা বেশিরভাগ মানুষ কখনো খোলে না। এগুলোর কোনোটার জন্যই technical knowledge লাগে না — এগুলো একবার check করা আর মাঝে মাঝে আবার দেখার যোগ্য কিছু setting।</p>'),
      h(2, 'Tracking Protection'),
      p('<p>Modern browser-এ একটা built-in tracker blocker থাকে, সাধারণত "Tracking Prevention," "Enhanced Protection," বা অনুরূপ একটা setting-এর নিচে। এটা আসলেই এর সবচেয়ে শক্তিশালী non-breaking level-এ set আছে কিনা নিশ্চিত করার যোগ্য — মাঝে মাঝে এটা একটা দুর্বল default-এ রেখে দেওয়া হয়।</p>'),
      h(2, 'Saved Password'),
      p('<p>Browser-এর নিজের password manager (আগের password lesson-এ আরো বিস্তারিত কভার করা) মাঝে মাঝে review করার যোগ্য — browser flag করা যেকোনো দুর্বল বা reuse করা password check করা, আর আর নেই এমন account-এর saved login সরিয়ে ফেলা।</p>'),
      h(2, 'Site Permission'),
      p('<p>Site সময়ের সাথে permission জমা করে — camera, microphone, location, notification — প্রায়ই বছর আগে একবার দেওয়া, এমন একটা site-এর জন্য যা আর ব্যবহারই হয় না। Browser-এর site settings page দেওয়া প্রতিটা permission list করে, site অনুযায়ী, আর প্রতিটা আলাদাভাবে revoke করতে দেয়।</p>'),
      h(2, 'Autofill Data'),
      p('<p>Saved address, phone number, আর card detail checkout form দ্রুত করে, কিন্তু এগুলোই ঠিক সেই data যা একটা malicious বা compromised site চুপচাপ সংগ্রহ করার চেষ্টা করতে পারে। সেখানে আসলে কী saved আছে তা review করা — আর আর দরকার নেই এমন কিছু, বিশেষত পুরনো card detail সরানো — password review-এর পাশাপাশি করার যোগ্য।</p>'),
      table(['Setting', 'কোথায় পাবেন (সাধারণ)', 'কেন এটা গুরুত্বপূর্ণ'], [
        ['Tracking protection', 'Privacy & Security setting', 'Browsing habit-এর cross-site tracking সীমিত করে'],
        ['Saved password', 'Password / Autofill setting', 'দুর্বল বা breach হওয়া password flag করে'],
        ['Site permission', 'Privacy & Security → Site Settings', 'আর দরকার নেই এমন camera/mic/location access revoke করে'],
        ['Autofill data', 'Autofill setting', 'কী personal/payment data store আর offer হয় তা নিয়ন্ত্রণ করে'],
      ]),
    ],
  },
})

// ═══ 11. EMAIL SECURITY ══════════════════════════════════════════════════

lessons.push({
  slug: 'email-security', sortOrder: n++,
  en: {
    title: 'Email Security',
    metaTitle: 'Email Security | Learn Computer Academy',
    metaDescription: 'Why email is the most common way in for attackers, and the habits that close most of the gap — checking the sender, attachments, links, and spam filters.',
    blocks: [
      p('<p>Email is the single most common delivery method for phishing and malware, mostly because it\'s still the account most other accounts are recoverable through — control someone\'s email, and password resets for nearly everything else become possible.</p>'),
      h(2, 'Check the Sender, Not Just the Name'),
      p('<p>The display name shown ("Amazon Support") and the actual address behind it (<code>amazon-support@random-domain.ru</code>) are two separate things — most email clients only show the display name by default, which an attacker can set to anything at all. Clicking or tapping the sender name usually reveals the real address underneath.</p>'),
      h(2, 'Attachments'),
      p('<p>An unexpected attachment — even one that looks like an invoice, resume, or document from someone recognizable — deserves suspicion, especially file types that can run code directly (<code>.exe</code>, <code>.scr</code>, macro-enabled <code>.docm</code>/<code>.xlsm</code> files). When in doubt, confirm with the sender through a separate channel before opening.</p>'),
      h(2, 'Links in Email'),
      p('<p>The same hover-before-clicking check from the safe browsing lesson applies directly here — an email link\'s visible text and its actual destination are frequently different, and this mismatch is one of the clearest tells available.</p>'),
      h(2, 'Spam and Filters'),
      p('<p>Modern spam filters catch the overwhelming majority of obvious phishing automatically — but nothing they catch should be assumed permanently blocked, and nothing they let through should be assumed safe. Marking a missed phishing email as spam (rather than just deleting it) helps train the filter for next time.</p>'),
      callout('tip', '<p>"Report phishing" (where available, usually near "mark as spam") does more than delete a single email — it feeds the provider\'s spam detection for everyone. Worth using over a plain delete when the option exists.</p>', 'Report, don\'t just delete'),
    ],
  },
  bn: {
    title: 'Email Security',
    metaTitle: 'Email Security | Learn Computer Academy',
    metaDescription: 'কেন email attacker-দের জন্য সবচেয়ে common প্রবেশপথ, আর যেসব habit বেশিরভাগ gap বন্ধ করে — sender, attachment, link, আর spam filter check করা।',
    blocks: [
      p('<p>Phishing আর malware-এর জন্য email একক সবচেয়ে common delivery method, বেশিরভাগ কারণ এটা এখনো সেই account যার মাধ্যমে বাকি বেশিরভাগ account recover করা যায় — কারো email নিয়ন্ত্রণ করুন, আর প্রায় বাকি সবকিছুর password reset সম্ভব হয়ে যায়।</p>'),
      h(2, 'শুধু নাম না, Sender Check করুন', 'শুধু-নাম-না-sender-check-করুন'),
      p('<p>দেখানো display name ("Amazon Support") আর এর পেছনের আসল address (<code>amazon-support@random-domain.ru</code>) দুটো আলাদা জিনিস — বেশিরভাগ email client default-এ শুধু display name দেখায়, যা একজন attacker যেকোনো কিছু set করতে পারে। Sender name click বা tap করলে সাধারণত নিচের আসল address দেখা যায়।</p>'),
      h(2, 'Attachment'),
      p('<p>একটা অপ্রত্যাশিত attachment — এমনকি পরিচিত কারো থেকে একটা invoice, resume, বা document মনে হলেও — সন্দেহের যোগ্য, বিশেষত সরাসরি code চালাতে পারে এমন file type (<code>.exe</code>, <code>.scr</code>, macro-enabled <code>.docm</code>/<code>.xlsm</code> file)। সন্দেহ হলে, খোলার আগে একটা আলাদা channel দিয়ে sender-এর সাথে confirm করুন।</p>'),
      h(2, 'Email-এর Link'),
      p('<p>Safe browsing lesson থেকে click করার আগে hover করার একই check এখানে সরাসরি প্রযোজ্য — একটা email link-এর দেখা যাওয়া text আর এর আসল destination প্রায়ই ভিন্ন, আর এই অমিলটা উপলব্ধ সবচেয়ে স্পষ্ট signal-গুলোর একটা।</p>'),
      h(2, 'Spam আর Filter'),
      p('<p>Modern spam filter স্বয়ংক্রিয়ভাবে বেশিরভাগ স্পষ্ট phishing ধরে ফেলে — কিন্তু এগুলো যা ধরে তা স্থায়ীভাবে blocked ধরে নেওয়া উচিত না, আর যা পার হতে দেয় তা নিরাপদ ধরে নেওয়া উচিত না। মিস হওয়া একটা phishing email-কে spam হিসেবে mark করা (শুধু delete করার বদলে) পরের বারের জন্য filter-কে train করতে সাহায্য করে।</p>'),
      callout('tip', '<p>"Report phishing" (যেখানে উপলব্ধ, সাধারণত "mark as spam"-এর কাছে) শুধু একটা email delete করার চেয়ে বেশি কিছু করে — এটা সবার জন্য provider-এর spam detection-কে feed করে। Option থাকলে সাধারণ delete-এর চেয়ে এটা ব্যবহার করার যোগ্য।</p>', 'Report করুন, শুধু delete না'),
    ],
  },
})

// ═══ 12. MOBILE DEVICE SECURITY ══════════════════════════════════════════

lessons.push({
  slug: 'mobile-device-security', sortOrder: n++,
  en: {
    title: 'Mobile Device Security',
    metaTitle: 'Mobile Device Security | Learn Computer Academy',
    metaDescription: 'The phone in a pocket carries more valuable data than most computers — the settings and habits that keep it secure.',
    blocks: [
      p('<p>A phone typically holds emails, banking apps, photos, messages, and location history — arguably more sensitive data than most personal computers, while being far easier to lose, leave behind, or have physically stolen.</p>'),
      h(2, 'Screen Lock'),
      p('<p>A PIN, pattern, fingerprint, or face unlock is the first and most basic barrier — a phone with no lock at all hands over everything on it to whoever picks it up. A 6-digit PIN (not 4) or biometric unlock is worth the small daily friction.</p>'),
      h(2, 'App Permissions'),
      p('<p>Apps request access to the camera, microphone, contacts, and location — often for reasons unrelated to their actual function. A flashlight app asking for contacts access, or a game asking for microphone access, is worth questioning rather than reflexively approving.</p>'),
      h(2, 'Official App Stores Only'),
      p('<p>Apps from the Play Store or App Store go through at least some review before publishing; a downloaded APK file from a random website skips that entirely and is one of the more common ways mobile malware actually spreads. "Sideloading" isn\'t inherently unsafe for an experienced user with a specific reason, but it removes a real safety net for everyone else.</p>'),
      h(2, 'Find My Device'),
      p('<p>Both major platforms offer a built-in "Find My Device" / "Find My iPhone" feature — worth enabling before it\'s needed, not after. It shows a lost or stolen phone\'s location on a map and allows remote locking or wiping if recovery isn\'t possible.</p>'),
      table(['Habit', 'Why it matters'], [
        ['Lock your screen', 'The single biggest barrier if the phone is lost or stolen'],
        ['Review app permissions', 'Stops apps quietly collecting more than they need'],
        ['Update the OS', 'Security patches close vulnerabilities attackers actively target'],
        ['Know how to remote-wipe', 'Turns a stolen phone from a data breach into just a replaceable device'],
      ]),
    ],
  },
  bn: {
    title: 'Mobile Device Security',
    metaTitle: 'Mobile Device Security | Learn Computer Academy',
    metaDescription: 'পকেটের phone-টা বেশিরভাগ computer-এর চেয়ে বেশি মূল্যবান data বহন করে — এটাকে নিরাপদ রাখার setting আর habit।',
    blocks: [
      p('<p>একটা phone সাধারণত email, banking app, photo, message, আর location history রাখে — সম্ভবত বেশিরভাগ personal computer-এর চেয়ে বেশি sensitive data, একই সাথে হারানো, ফেলে যাওয়া, বা physically চুরি হওয়া অনেক সহজ।</p>'),
      h(2, 'Screen Lock'),
      p('<p>একটা PIN, pattern, fingerprint, বা face unlock প্রথম আর সবচেয়ে basic বাধা — কোনো lock ছাড়া একটা phone এটা যে তুলে নেয় তাকেই এতে থাকা সবকিছু দিয়ে দেয়। একটা 6-digit PIN (4 না) বা biometric unlock ছোট প্রতিদিনের friction-টা নেওয়ার যোগ্য।</p>'),
      h(2, 'App Permission'),
      p('<p>App camera, microphone, contact, আর location-এ access চায় — প্রায়ই তাদের আসল কাজের সাথে অসম্পর্কিত কারণে। Contact access চাওয়া একটা flashlight app, বা microphone access চাওয়া একটা game, স্বয়ংক্রিয়ভাবে approve করার বদলে প্রশ্ন করার যোগ্য।</p>'),
      h(2, 'শুধু Official App Store', 'শুধু-official-app-store'),
      p('<p>Play Store বা App Store-এর app publish হওয়ার আগে অন্তত কিছুটা review-এর মধ্য দিয়ে যায়; একটা random website থেকে download করা APK file সেটা সম্পূর্ণ বাদ দেয় আর mobile malware আসলে ছড়ানোর একটা বেশি common উপায়। একটা নির্দিষ্ট কারণ সহ একজন অভিজ্ঞ user-এর জন্য "sideloading" স্বাভাবিকভাবে অনিরাপদ না, কিন্তু এটা বাকি সবার জন্য একটা আসল safety net সরিয়ে দেয়।</p>'),
      h(2, 'Find My Device'),
      p('<p>দুটো major platform-ই একটা built-in "Find My Device" / "Find My iPhone" feature দেয় — দরকার হওয়ার আগে enable করার যোগ্য, পরে না। এটা একটা হারানো বা চুরি হওয়া phone-এর location একটা map-এ দেখায় আর recovery সম্ভব না হলে remote lock বা wipe করতে দেয়।</p>'),
      table(['Habit', 'কেন এটা গুরুত্বপূর্ণ'], [
        ['আপনার স্ক্রিন lock করুন', 'Phone হারালে বা চুরি হলে একক সবচেয়ে বড় বাধা'],
        ['App permission review করুন', 'App-কে দরকারের চেয়ে বেশি চুপচাপ সংগ্রহ করা থেকে থামায়'],
        ['OS update করুন', 'Security patch attacker-রা সক্রিয়ভাবে target করা vulnerability বন্ধ করে'],
        ['Remote-wipe কীভাবে করতে হয় জানুন', 'একটা চুরি হওয়া phone-কে একটা data breach থেকে শুধু একটা replaceable device বানায়'],
      ]),
    ],
  },
})

// ═══ 13. WI-FI, HOME NETWORKS, AND VPNS ══════════════════════════════════

lessons.push({
  slug: 'wifi-and-vpns', sortOrder: n++,
  en: {
    title: 'Public Wi-Fi, Home Networks, and VPNs',
    metaTitle: 'Public Wi-Fi, Home Networks, and VPNs | Learn Computer Academy',
    metaDescription: 'The real risk of public Wi-Fi, the router settings worth checking at home, what a VPN actually does, and when one is actually needed.',
    blocks: [
      p('<p>Not every network deserves the same trust. A coffee shop\'s open Wi-Fi and a password-protected home router carry genuinely different risk levels, and knowing the difference decides when the extra step of a VPN is actually worth it.</p>'),
      h(2, 'The Real Risk of Public Wi-Fi'),
      p('<p>On an open or shared network, other devices on the same network can potentially observe unencrypted traffic — this is less of a concern than it used to be, since most sites now use HTTPS by default, but it\'s not zero, particularly for older apps or misconfigured sites still sending some data in the clear.</p>'),
      h(2, 'Home Router Basics'),
      p('<p>A home router is worth a five-minute check: change the default admin password (the factory default is often printed on the router itself, and is public knowledge for that model), and confirm the Wi-Fi network itself uses WPA2 or WPA3 encryption rather than the outdated, effectively unprotected WEP.</p>'),
      h(2, 'What a VPN Actually Does'),
      p('<p>A <b>VPN</b> (Virtual Private Network) routes traffic through an encrypted tunnel to a server operated by the VPN provider before it reaches its destination — the local network (including a public Wi-Fi hotspot) can no longer see what\'s inside that traffic, only that an encrypted connection to the VPN server exists.</p>'),
      h(2, 'When One Is Actually Needed'),
      table(['Situation', 'VPN recommended?'], [
        ['Public Wi-Fi (café, airport, hotel)', 'Yes — meaningfully reduces risk on an untrusted network'],
        ['Home network, WPA2/3, strong password', 'Not required — already reasonably secure'],
        ['Accessing sensitive work/client data on any network', 'Yes, if the organization requires or provides one'],
        ['Just wanting general privacy from an ISP', 'Optional — a legitimate use case, not a security necessity'],
      ]),
      callout('note', '<p>A VPN protects data in transit between a device and the VPN server — it does nothing against a phishing email, a weak password, or malware already on the device. It\'s one specific tool for one specific risk, not general-purpose protection.</p>', 'What a VPN doesn\'t do'),
    ],
  },
  bn: {
    title: 'Public Wi-Fi, Home Network, আর VPN',
    metaTitle: 'Public Wi-Fi, Home Network, আর VPN | Learn Computer Academy',
    metaDescription: 'Public Wi-Fi-এর আসল ঝুঁকি, বাড়িতে check করার যোগ্য router setting, একটা VPN আসলে কী করে, আর কখন একটা আসলেই দরকার।',
    blocks: [
      p('<p>প্রতিটা network একই বিশ্বাসের যোগ্য না। একটা coffee shop-এর open Wi-Fi আর একটা password-protected home router সত্যিকারভাবে ভিন্ন risk level বহন করে, আর পার্থক্যটা জানা VPN-এর অতিরিক্ত step আসলে কখন মূল্যবান তা ঠিক করে।</p>'),
      h(2, 'Public Wi-Fi-এর আসল ঝুঁকি', 'public-wi-fi-এর-আসল-ঝুঁকি'),
      p('<p>একটা open বা shared network-এ, একই network-এর অন্য device সম্ভাব্যভাবে unencrypted traffic দেখতে পারে — বেশিরভাগ site এখন default-এ HTTPS ব্যবহার করায় এটা আগের চেয়ে কম উদ্বেগের, কিন্তু শূন্য না, বিশেষত পুরনো app বা এখনো কিছু data clear-এ পাঠানো misconfigured site-এর জন্য।</p>'),
      h(2, 'Home Router-এর বেসিক'),
      p('<p>একটা home router পাঁচ মিনিটের check-এর যোগ্য: default admin password বদলান (factory default প্রায়ই router-এই print করা থাকে, আর সেই model-এর জন্য public knowledge), আর নিশ্চিত করুন Wi-Fi network নিজেই পুরনো, কার্যত অরক্ষিত WEP-এর বদলে WPA2 বা WPA3 encryption ব্যবহার করে।</p>'),
      h(2, 'একটা VPN আসলে কী করে', 'একটা-vpn-আসলে-কী-করে'),
      p('<p>একটা <b>VPN</b> (Virtual Private Network) destination-এ পৌঁছানোর আগে traffic-কে VPN provider পরিচালিত একটা server-এর দিকে একটা encrypted tunnel দিয়ে route করে — local network (public Wi-Fi hotspot সহ) আর ভেতরে কী আছে তা দেখতে পারে না, শুধু জানে VPN server-এর সাথে একটা encrypted connection আছে।</p>'),
      h(2, 'কখন একটা আসলেই দরকার', 'কখন-একটা-আসলেই-দরকার'),
      table(['পরিস্থিতি', 'VPN recommended?'], [
        ['Public Wi-Fi (café, airport, hotel)', 'হ্যাঁ — একটা অবিশ্বস্ত network-এ ঝুঁকি অর্থপূর্ণভাবে কমায়'],
        ['Home network, WPA2/3, শক্তিশালী password', 'দরকার নেই — ইতিমধ্যে যুক্তিসঙ্গতভাবে নিরাপদ'],
        ['যেকোনো network-এ sensitive work/client data access করা', 'হ্যাঁ, যদি organization একটা দরকার করে বা দেয়'],
        ['ISP থেকে শুধু সাধারণ privacy চাওয়া', 'Optional — একটা বৈধ use case, কোনো security প্রয়োজনীয়তা না'],
      ]),
      callout('note', '<p>একটা VPN একটা device আর VPN server-এর মধ্যে transit-এ থাকা data রক্ষা করে — একটা phishing email, একটা দুর্বল password, বা device-এ ইতিমধ্যে থাকা malware-এর বিরুদ্ধে এটা কিছুই করে না। এটা একটা নির্দিষ্ট ঝুঁকির জন্য একটা নির্দিষ্ট tool, general-purpose protection না।</p>', 'একটা VPN যা করে না'),
    ],
  },
})

// ═══ 14. BACKING UP YOUR DATA ═════════════════════════════════════════════

lessons.push({
  slug: 'backing-up-data', sortOrder: n++,
  en: {
    title: 'Backing Up Your Data',
    metaTitle: 'Backing Up Your Data | Learn Computer Academy',
    metaDescription: 'The 3-2-1 backup rule, why it\'s the one habit that undoes almost any disaster, and why an untested backup isn\'t really a backup yet.',
    blocks: [
      p('<p>Ransomware, a failed hard drive, a stolen laptop, an accidental deletion — the causes are all different, but a good backup makes every single one of them a minor inconvenience instead of a genuine disaster. It\'s arguably the single highest-value habit in this entire course.</p>'),
      h(2, 'The 3-2-1 Rule'),
      table(['Rule', 'What it means'], [
        ['3 copies', 'The original plus at least two backups — one backup alone can also fail'],
        ['2 different media', 'Not all copies on the same type of drive — e.g. the laptop\'s drive plus an external drive, not two external drives'],
        ['1 copy off-site', 'At least one copy physically separate from the others — cloud storage, or a drive kept somewhere else entirely — so a fire, theft, or flood can\'t destroy every copy at once'],
      ]),
      h(2, 'Why "I\'ll Back Up Eventually" Fails'),
      p('<p>Manual backups get postponed indefinitely because there\'s never an urgent-feeling reason to do one today — until the day there very much is, and it\'s too late. An automated backup (cloud sync, a scheduled backup tool) that runs without being remembered removes this exact failure mode entirely.</p>'),
      h(2, 'Test Your Backups'),
      p('<p>A backup that has never actually been restored isn\'t a proven backup — it\'s an assumption. Corrupted backup files, a forgotten password on an encrypted backup, or a sync that silently stopped months ago are all discovered, almost always, at the worst possible moment: during an actual disaster. A periodic test restore of a few files catches this in advance instead.</p>'),
      callout('tip', '<p>The 3-2-1 rule as a simple checklist: 3 copies of anything that matters, on 2 different kinds of storage, with 1 of those copies somewhere physically separate — and a restore actually tested at least once.</p>', 'The whole rule in one line'),
    ],
  },
  bn: {
    title: 'আপনার Data Backup করা',
    metaTitle: 'আপনার Data Backup করা | Learn Computer Academy',
    metaDescription: '3-2-1 backup rule, কেন এটা প্রায় যেকোনো বিপর্যয় undo করে দেওয়া একটা habit, আর কেন test না করা backup আসলে এখনো একটা backup না।',
    blocks: [
      p('<p>Ransomware, একটা failed hard drive, একটা চুরি হওয়া laptop, একটা accidental deletion — কারণগুলো সব ভিন্ন, কিন্তু একটা ভালো backup প্রতিটাকেই একটা আসল বিপর্যয়ের বদলে একটা ছোট অসুবিধা বানায়। এই পুরো কোর্সে সম্ভবত একক সবচেয়ে বেশি value-এর habit এটাই।</p>'),
      h(2, '3-2-1 নিয়ম'),
      table(['নিয়ম', 'এর মানে কী'], [
        ['3 কপি', 'আসল প্লাস অন্তত দুটো backup — একা একটা backup-ও fail করতে পারে'],
        ['2 ভিন্ন media', 'সব কপি একই ধরনের drive-এ না — যেমন laptop-এর drive প্লাস একটা external drive, দুটো external drive না'],
        ['1 কপি off-site', 'অন্তত একটা কপি বাকিগুলো থেকে physically আলাদা — cloud storage, বা সম্পূর্ণ অন্য কোথাও রাখা একটা drive — যাতে একটা আগুন, চুরি, বা বন্যা একসাথে প্রতিটা কপি ধ্বংস করতে না পারে'],
      ]),
      h(2, 'কেন "পরে backup করব" ব্যর্থ হয়', 'কেন-পরে-backup-করব-ব্যর্থ-হয়'),
      p('<p>Manual backup অনির্দিষ্টকালের জন্য পিছিয়ে যায় কারণ আজই একটা করার কোনো urgent-মনে হওয়া কারণ কখনো থাকে না — যেদিন সত্যিই থাকে, ততক্ষণে অনেক দেরি। একটা automated backup (cloud sync, একটা scheduled backup tool) যা মনে না রেখেই চলে এই ঠিক এই failure mode-টা সম্পূর্ণ সরিয়ে দেয়।</p>'),
      h(2, 'আপনার Backup Test করুন', 'আপনার-backup-test-করুন'),
      p('<p>যে backup কখনো আসলে restore করা হয়নি তা একটা প্রমাণিত backup না — এটা একটা assumption। Corrupted backup file, একটা encrypted backup-এ একটা ভুলে যাওয়া password, বা মাস আগে চুপচাপ থেমে যাওয়া একটা sync — এসব প্রায় সবসময় সবচেয়ে খারাপ সম্ভাব্য মুহূর্তে আবিষ্কার হয়: একটা আসল বিপর্যয়ের সময়। কয়েকটা file-এর একটা periodic test restore আগেই এটা ধরে ফেলে।</p>'),
      callout('tip', '<p>একটা সাধারণ checklist হিসেবে 3-2-1 নিয়ম: গুরুত্বপূর্ণ যেকোনো কিছুর 3 কপি, 2 ভিন্ন ধরনের storage-এ, ওই কপির 1টা physically আলাদা কোথাও — আর একটা restore অন্তত একবার আসলেই test করা।</p>', 'একই লাইনে পুরো নিয়ম'),
    ],
  },
})

// ═══ 15. SOCIAL MEDIA AND PERSONAL PRIVACY ═══════════════════════════════

lessons.push({
  slug: 'social-media-privacy', sortOrder: n++,
  en: {
    title: 'Social Media and Personal Privacy',
    metaTitle: 'Social Media and Personal Privacy | Learn Computer Academy',
    metaDescription: 'What social media privacy settings actually control, why oversharing location is riskier than it feels, and building the habit of thinking before posting.',
    blocks: [
      p('<p>What gets posted publicly online tends to be permanent and searchable, even after deletion — screenshots, caches, and archives outlive the original post itself. Privacy settings help, but the habit of thinking before posting matters more than any setting.</p>'),
      h(2, 'Privacy Settings'),
      p('<p>Every major platform lets a profile\'s visibility be limited — public, friends-only, or a custom list. Worth reviewing periodically rather than set once and forgotten, since platforms occasionally reset settings after a redesign or add new sharing features with looser defaults.</p>'),
      h(2, 'Oversharing Location'),
      p('<p>A photo posted in real time from a specific location — a vacation, being away from home for the evening, even just a regular daily routine visible across enough posts — tells anyone watching exactly where a person is or isn\'t. Posting a trip\'s photos after returning home is a small habit that closes a genuinely real gap.</p>'),
      h(2, 'Who Can See This?'),
      p('<p>Before posting, it\'s worth actually checking the audience toggle rather than assuming — a post accidentally set to "public" instead of "friends only" is a common, easy mistake, and some platforms default new posts back to public after a setting change elsewhere.</p>'),
      h(2, 'Think Before You Post'),
      p('<p>A short pause before posting — would this be fine for an employer, a stranger, or a future version of yourself to see, indefinitely — catches most of the genuinely regrettable posts before they happen. This one habit outperforms nearly every privacy setting combined.</p>'),
      table(['Habit', 'What it protects against'], [
        ['Review privacy settings periodically', 'Platform changes silently loosening visibility'],
        ['Limit real-time location sharing', 'Someone knowing exactly when a home or place is empty'],
        ['Think before posting', 'Content that becomes hard to fully take back later'],
        ['Know what\'s actually public', 'Assuming a "friends only" setting that quietly isn\'t'],
      ]),
    ],
  },
  bn: {
    title: 'Social Media আর Personal Privacy',
    metaTitle: 'Social Media আর Personal Privacy | Learn Computer Academy',
    metaDescription: 'Social media privacy setting আসলে কী নিয়ন্ত্রণ করে, কেন location oversharing মনে হওয়ার চেয়ে বেশি ঝুঁকিপূর্ণ, আর post করার আগে ভাবার habit বানানো।',
    blocks: [
      p('<p>Online publicly post হওয়া কিছু সাধারণত স্থায়ী আর searchable হয়, delete হওয়ার পরও — screenshot, cache, আর archive আসল post-টাকেই ছাড়িয়ে যায়। Privacy setting সাহায্য করে, কিন্তু post করার আগে ভাবার habit যেকোনো setting-এর চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),
      h(2, 'Privacy Setting'),
      p('<p>প্রতিটা major platform একটা profile-এর visibility সীমিত করতে দেয় — public, friends-only, বা একটা custom list। একবার set করে ভুলে যাওয়ার বদলে মাঝে মাঝে review করার যোগ্য, কারণ platform মাঝে মাঝে একটা redesign-এর পর setting reset করে বা looser default সহ নতুন sharing feature যোগ করে।</p>'),
      h(2, 'Location Oversharing'),
      p('<p>একটা নির্দিষ্ট location থেকে real time-এ post করা একটা photo — একটা vacation, সন্ধ্যায় বাড়ি থেকে দূরে থাকা, এমনকি যথেষ্ট post জুড়ে দেখা যাওয়া একটা সাধারণ দৈনিক routine — দেখছে এমন যে কাউকে ঠিক জানায় একজন মানুষ কোথায় আছে বা নেই। বাড়ি ফেরার পর একটা trip-এর photo post করা একটা ছোট habit যা একটা সত্যিকারের আসল gap বন্ধ করে।</p>'),
      h(2, 'কে এটা দেখতে পারে?', 'কে-এটা-দেখতে-পারে'),
      p('<p>Post করার আগে, ধরে নেওয়ার বদলে audience toggle আসলে check করার যোগ্য — একটা post ভুলে "public"-এ set হওয়া "friends only"-এর বদলে একটা common, সহজ ভুল, আর কিছু platform অন্য কোথাও একটা setting বদলের পর নতুন post আবার public-এ default করে।</p>'),
      h(2, 'Post করার আগে ভাবুন', 'post-করার-আগে-ভাবুন'),
      p('<p>Post করার আগে একটা ছোট বিরতি — এটা কি একজন employer, একজন অপরিচিত, বা নিজের ভবিষ্যৎ সংস্করণের অনির্দিষ্টকাল দেখার জন্য ঠিক হবে — বেশিরভাগ সত্যিকারের অনুতপ্ত post ঘটার আগেই ধরে ফেলে। এই একটা habit প্রায় প্রতিটা privacy setting একসাথে মিলিয়ে যা করে তার চেয়ে ভালো কাজ করে।</p>'),
      table(['Habit', 'কী থেকে রক্ষা করে'], [
        ['মাঝে মাঝে privacy setting review করুন', 'Platform পরিবর্তন চুপচাপ visibility loose করে দেওয়া'],
        ['Real-time location sharing সীমিত করুন', 'কেউ ঠিক জানা একটা বাড়ি বা জায়গা কখন খালি'],
        ['Post করার আগে ভাবুন', 'পরে পুরোপুরি ফিরিয়ে নেওয়া কঠিন হয়ে যাওয়া content'],
        ['আসলে কী public তা জানুন', '"Friends only" setting ধরে নেওয়া যা চুপচাপ তা না'],
      ]),
    ],
  },
})

// ═══ 16. CHECKING A BREACH — HAVE I BEEN PWNED (real screenshot later) ═══

lessons.push({
  slug: 'checking-a-breach', sortOrder: n++,
  en: {
    title: 'Checking a Breach — Have I Been Pwned',
    metaTitle: 'Checking a Breach with Have I Been Pwned | Learn Computer Academy',
    metaDescription: 'How to check whether an email address or password has already appeared in a known data breach, using the free Have I Been Pwned service.',
    blocks: [
      p('<p><b>Have I Been Pwned</b> (haveibeenpwned.com) is a free, widely trusted service that tracks known data breaches and lets anyone check whether their email address or password has appeared in one. It\'s run by a well-known independent security researcher and used by security teams worldwide — not itself a data collector with any hidden angle.</p>'),
      h(2, 'Checking an Email Address'),
      p('<p>Typing an email address into the site\'s search checks it against every breach in its database and lists which ones it appeared in, along with what data each breach exposed (passwords, phone numbers, addresses, and so on) — useful context for deciding which accounts need an urgent password change.</p>'),
      h(2, 'Checking a Password'),
      p('<p>The site also offers a separate password-checking tool. Typed passwords are never sent to the server in plain form — the check works through <b>k-anonymity</b>, sending only a partial hash of the password, so the full password never leaves the browser. Worth checking any password still in active use, especially an old one that might be reused elsewhere.</p>'),
      h(2, 'What to Do If a Match Is Found'),
      p('<p>A match doesn\'t mean an account is currently compromised — it means the password was exposed in a past breach and should be treated as burned. Change the password on that specific account immediately, and check whether the same password was reused anywhere else — if so, change those too, and this is exactly the moment a password manager (covered earlier) turns into an unavoidable rather than optional step.</p>'),
      callout('note', '<p>Consider setting up the site\'s free notification service for an email address — it sends an alert automatically the next time that address turns up in a newly discovered breach, rather than relying on remembering to check manually.</p>', 'Set up notifications, don\'t just check once'),
    ],
  },
  bn: {
    title: 'একটা Breach Check করা — Have I Been Pwned',
    metaTitle: 'Have I Been Pwned দিয়ে একটা Breach Check করা | Learn Computer Academy',
    metaDescription: 'ফ্রি Have I Been Pwned service ব্যবহার করে একটা email address বা password ইতিমধ্যে কোনো known data breach-এ দেখা গেছে কিনা কীভাবে check করবেন।',
    blocks: [
      p('<p><b>Have I Been Pwned</b> (haveibeenpwned.com) একটা ফ্রি, ব্যাপকভাবে বিশ্বস্ত service যা known data breach track করে আর যে কাউকে check করতে দেয় তাদের email address বা password কোনোটাতে দেখা গেছে কিনা। এটা একজন পরিচিত independent security researcher চালান আর বিশ্বজুড়ে security team ব্যবহার করে — এটা নিজে কোনো hidden angle সহ data collector না।</p>'),
      h(2, 'একটা Email Address Check করা', 'একটা-email-address-check-করা'),
      p('<p>Site-এর search-এ একটা email address টাইপ করলে এটা এর database-এর প্রতিটা breach-এর বিরুদ্ধে check করে আর কোনগুলোতে এটা দেখা গেছে তা list করে, প্রতিটা breach কী data expose করেছে (password, phone number, address, ইত্যাদি) সহ — কোন account-এ জরুরি password পরিবর্তন দরকার তা ঠিক করতে useful context।</p>'),
      h(2, 'একটা Password Check করা', 'একটা-password-check-করা'),
      p('<p>Site একটা আলাদা password-checking tool-ও দেয়। টাইপ করা password কখনো plain form-এ server-এ পাঠানো হয় না — check <b>k-anonymity</b>-এর মাধ্যমে কাজ করে, password-এর শুধু একটা partial hash পাঠিয়ে, তাই পুরো password কখনো browser ছাড়ে না। এখনো active use-এ থাকা যেকোনো password check করার যোগ্য, বিশেষত একটা পুরনো যা অন্য কোথাও reuse হতে পারে।</p>'),
      h(2, 'একটা Match পাওয়া গেলে কী করবেন', 'একটা-match-পাওয়া-গেলে-কী-করবেন'),
      p('<p>একটা match মানে না যে একটা account বর্তমানে compromised — এর মানে password একটা past breach-এ expose হয়েছিল আর burned হিসেবে treat করা উচিত। ওই নির্দিষ্ট account-এর password এখনই বদলান, আর check করুন একই password অন্য কোথাও reuse হয়েছিল কিনা — হলে, সেগুলোও বদলান, আর ঠিক এই মুহূর্তেই একটা password manager (আগে কভার করা) optional থেকে অপরিহার্য একটা step হয়ে যায়।</p>'),
      callout('note', '<p>একটা email address-এর জন্য site-এর ফ্রি notification service সেট আপ করার কথা ভাবুন — manually check করার কথা মনে রাখার উপর নির্ভর করার বদলে, পরের বার সেই address কোনো নতুন আবিষ্কৃত breach-এ দেখা গেলে এটা স্বয়ংক্রিয়ভাবে একটা alert পাঠায়।</p>', 'শুধু একবার check না, notification সেট আপ করুন'),
    ],
  },
})

// ═══ 17. RESPONDING TO RANSOMWARE AND IDENTITY THEFT ═════════════════════

lessons.push({
  slug: 'ransomware-identity-theft-response', sortOrder: n++,
  en: {
    title: 'If the Worst Happens — Responding to Ransomware and Identity Theft',
    metaTitle: 'Responding to Ransomware and Identity Theft | Learn Computer Academy',
    metaDescription: 'A step-by-step response plan for two of the worst-case scenarios this course covers — ransomware and identity theft — written for the moment they actually happen.',
    blocks: [
      p('<p>Every earlier lesson in this course is about prevention. This one assumes prevention already failed and something has actually gone wrong — a calm, ordered plan for the two worst-case scenarios covered in this course.</p>'),
      h(2, 'Ransomware — Step by Step'),
      table(['Step', 'Action'], [
        ['1. Disconnect', 'Immediately disconnect the affected device from the network (Wi-Fi off, cable unplugged) — this is the malware-deep-dive lesson\'s containment advice, and it matters most right here'],
        ['2. Don\'t pay immediately', 'Paying doesn\'t guarantee file recovery, and funds attackers directly — explore recovery options first (see below)'],
        ['3. Report it', 'Report to a local cybercrime reporting authority — this helps track attackers and may unlock official recovery resources'],
        ['4. Restore from backup', 'If a backup exists (see the backups lesson), wipe the infected device and restore from it rather than trusting anything on the compromised drive'],
      ]),
      p('<p>Before assuming payment is the only option, check the site "No More Ransom" (a joint law-enforcement/security-industry project) for a free decryption tool matching the specific ransomware strain — not every case has one, but a genuinely useful number do.</p>'),
      h(2, 'Identity Theft — Step by Step'),
      table(['Step', 'Action'], [
        ['1. Change passwords', 'Starting with email (the account that unlocks most others) and any financial accounts'],
        ['2. Alert your bank', 'Report the theft and watch for unauthorized transactions or new accounts opened in your name'],
        ['3. Monitor accounts', 'Check statements and credit reports closely for weeks afterward, not just once'],
        ['4. Report to authorities', 'File a report with local police and any relevant financial/consumer protection authority — needed for disputing fraudulent charges'],
      ]),
      callout('warning', '<p>Panic leads to skipped steps and rushed decisions attackers count on — a ransom note\'s countdown timer, for instance, is itself a pressure tactic. Working through the steps above in order, without rushing, produces a better outcome than reacting to the panic.</p>', 'Act fast, but don\'t panic'),
    ],
  },
  bn: {
    title: 'সবচেয়ে খারাপটা ঘটলে — Ransomware আর Identity Theft-এ সাড়া দেওয়া',
    metaTitle: 'Ransomware আর Identity Theft-এ সাড়া দেওয়া | Learn Computer Academy',
    metaDescription: 'এই কোর্স কভার করা দুটো worst-case scenario-র জন্য একটা step-by-step response plan — ransomware আর identity theft — এগুলো আসলে ঘটার মুহূর্তের জন্য লেখা।',
    blocks: [
      p('<p>এই কোর্সের আগের প্রতিটা lesson prevention নিয়ে। এটা ধরে নেয় prevention ইতিমধ্যে ব্যর্থ হয়েছে আর আসলে কিছু ভুল হয়ে গেছে — এই কোর্সে কভার করা দুটো worst-case scenario-র জন্য একটা শান্ত, গোছানো plan।</p>'),
      h(2, 'Ransomware — ধাপে ধাপে'),
      table(['ধাপ', 'কাজ'], [
        ['1. Disconnect করুন', 'প্রভাবিত device অবিলম্বে network থেকে disconnect করুন (Wi-Fi বন্ধ, cable খুলে ফেলুন) — এটা malware-deep-dive lesson-এর containment advice, আর এখানে এটাই সবচেয়ে বেশি গুরুত্বপূর্ণ'],
        ['2. এখনই টাকা দেবেন না', 'টাকা দিলে file recovery-র গ্যারান্টি নেই, আর সরাসরি attacker-দের fund করে — প্রথমে recovery option খুঁজুন (নিচে দেখুন)'],
        ['3. এটা রিপোর্ট করুন', 'একটা local cybercrime reporting authority-কে রিপোর্ট করুন — এটা attacker track করতে সাহায্য করে আর official recovery resource unlock করতে পারে'],
        ['4. Backup থেকে restore করুন', 'একটা backup থাকলে (backup lesson দেখুন), infected device wipe করুন আর compromised drive-এ থাকা কিছু বিশ্বাস করার বদলে এখান থেকে restore করুন'],
      ]),
      p('<p>টাকা দেওয়াই একমাত্র option ধরে নেওয়ার আগে, নির্দিষ্ট ransomware strain-এর সাথে মেলে এমন একটা ফ্রি decryption tool-এর জন্য "No More Ransom" site (একটা যৌথ law-enforcement/security-industry project) check করুন — প্রতিটা case-এর একটা নেই, কিন্তু একটা সত্যিকারের useful সংখ্যার আছে।</p>'),
      h(2, 'Identity Theft — ধাপে ধাপে'),
      table(['ধাপ', 'কাজ'], [
        ['1. Password বদলান', 'Email দিয়ে শুরু করে (যে account বাকি বেশিরভাগ unlock করে) আর যেকোনো financial account'],
        ['2. আপনার Bank-কে সতর্ক করুন', 'চুরির রিপোর্ট করুন আর আপনার নামে unauthorized transaction বা নতুন account খোলার জন্য নজর রাখুন'],
        ['3. Account Monitor করুন', 'পরের কয়েক সপ্তাহ statement আর credit report ভালোভাবে check করুন, শুধু একবার না'],
        ['4. কর্তৃপক্ষকে রিপোর্ট করুন', 'Local police আর প্রাসঙ্গিক financial/consumer protection authority-র কাছে একটা report file করুন — fraudulent charge dispute করার জন্য দরকার'],
      ]),
      callout('warning', '<p>Panic বাদ পড়া step আর তাড়াহুড়ো করা সিদ্ধান্তের দিকে নিয়ে যায় যার উপর attacker-রা নির্ভর করে — যেমন, একটা ransom note-এর countdown timer নিজেই একটা pressure tactic। তাড়াহুড়ো না করে উপরের step-গুলো ক্রমান্বয়ে করা panic-এর প্রতিক্রিয়া দেখানোর চেয়ে ভালো ফলাফল দেয়।</p>', 'দ্রুত কাজ করুন, কিন্তু panic করবেন না'),
    ],
  },
})

// ═══ 18. CLOSING — CYBERSECURITY FOR FREELANCERS ═════════════════════════

lessons.push({
  slug: 'cybersecurity-for-freelancers', sortOrder: n++,
  en: {
    title: 'Cybersecurity for Freelancers and Small Business — Where This Leaves You',
    metaTitle: 'Cybersecurity for Freelancers and Small Business | Learn Computer Academy',
    metaDescription: 'A closing summary of this course, applied specifically to the added stakes of freelancing and running a small business — client trust, client data, and getting paid.',
    blocks: [
      p('<p>Everything in this course applies to anyone with a device — but a freelancer or small business owner carries an extra layer of stakes: client files, client payment details, and a professional reputation that a single security incident can damage directly.</p>'),
      h(2, 'Client Data Is Not Just Personal Data'),
      p('<p>A compromised device holding a client\'s files, contracts, or login credentials turns a personal security incident into a professional one — a breach affecting client data can mean a lost client relationship, not just a personal inconvenience. The password manager and 2FA lessons matter doubly here.</p>'),
      h(2, 'Getting Paid, Securely'),
      p('<p>Invoice and payment scams specifically target freelancers — a fake "client" requesting bank details through an unverified channel, or a compromised email account used to redirect a real client\'s payment to an attacker\'s account instead. Confirming payment details through a second channel (a phone call, not just email) before sending money anywhere catches this category of scam specifically.</p>'),
      h(2, 'A Practical Minimum Checklist'),
      table(['Habit', 'Covered in'], [
        ['A unique, strong password on every account, via a password manager', 'Building Strong Passwords and Using a Password Manager'],
        ['2FA enabled on email and any financial/payment accounts', 'Setting Up Two-Factor Authentication'],
        ['Client files backed up per the 3-2-1 rule', 'Backing Up Your Data'],
        ['Careful with any unexpected invoice, payment request, or attachment', 'Phishing and Social Engineering, Email Security'],
        ['A VPN on public Wi-Fi when handling client work', 'Public Wi-Fi, Home Networks, and VPNs'],
      ]),
      callout('tip', '<p>None of this requires a dedicated IT budget or technical expertise — it\'s the same habits from this entire course, just worth taking a little more seriously once someone else\'s trust and money are involved. That\'s the whole course — go build securely.</p>', 'The stakes changed, not the habits'),
    ],
  },
  bn: {
    title: 'Freelancer আর ছোট ব্যবসার জন্য Cybersecurity — এখান থেকে আপনি যা নিয়ে যাবেন',
    metaTitle: 'Freelancer আর ছোট ব্যবসার জন্য Cybersecurity | Learn Computer Academy',
    metaDescription: 'এই কোর্সের একটা closing summary, বিশেষভাবে freelancing আর একটা ছোট ব্যবসা চালানোর অতিরিক্ত ঝুঁকিতে প্রয়োগ করা — client trust, client data, আর টাকা পাওয়া।',
    blocks: [
      p('<p>এই কোর্সের সবকিছু একটা device থাকা যে কারো জন্য প্রযোজ্য — কিন্তু একজন freelancer বা ছোট ব্যবসার মালিক একটা অতিরিক্ত স্তরের ঝুঁকি বহন করে: client file, client payment detail, আর একটা professional reputation যা একটা মাত্র security incident সরাসরি ক্ষতি করতে পারে।</p>'),
      h(2, 'Client Data শুধু Personal Data না', 'client-data-শুধু-personal-data-না'),
      p('<p>একটা client-এর file, contract, বা login credential রাখা একটা compromised device একটা personal security incident-কে একটা professional-এ পরিণত করে — client data প্রভাবিত করা একটা breach মানে হতে পারে একটা হারানো client relationship, শুধু একটা personal অসুবিধা না। Password manager আর 2FA lesson এখানে দ্বিগুণ গুরুত্বপূর্ণ।</p>'),
      h(2, 'নিরাপদে টাকা পাওয়া', 'নিরাপদে-টাকা-পাওয়া'),
      p('<p>Invoice আর payment scam বিশেষভাবে freelancer-দের target করে — একটা unverified channel দিয়ে bank detail চাওয়া একটা fake "client", বা একটা আসল client-এর payment-কে attacker-এর account-এ redirect করতে ব্যবহৃত একটা compromised email account। যেকোনো জায়গায় টাকা পাঠানোর আগে একটা দ্বিতীয় channel দিয়ে (শুধু email না, একটা phone call) payment detail confirm করা এই category-র scam বিশেষভাবে ধরে ফেলে।</p>'),
      h(2, 'একটা Practical Minimum Checklist'),
      table(['Habit', 'কোথায় কভার হয়েছে'], [
        ['একটা password manager দিয়ে প্রতিটা account-এ একটা unique, শক্তিশালী password', 'শক্তিশালী Password বানানো আর Password Manager ব্যবহার'],
        ['Email আর যেকোনো financial/payment account-এ 2FA enabled', 'Two-Factor Authentication সেট আপ করা'],
        ['3-2-1 নিয়ম অনুযায়ী client file backed up', 'আপনার Data Backup করা'],
        ['যেকোনো অপ্রত্যাশিত invoice, payment request, বা attachment নিয়ে সতর্ক', 'Phishing আর Social Engineering, Email Security'],
        ['Client কাজ সামলানোর সময় public Wi-Fi-এ একটা VPN', 'Public Wi-Fi, Home Network, আর VPN'],
      ]),
      callout('tip', '<p>এর কোনোটার জন্যই একটা dedicated IT budget বা technical expertise লাগে না — এটা এই পুরো কোর্সের একই habit, শুধু কারো টাকা আর বিশ্বাস জড়িত হলে একটু বেশি গুরুত্ব সহকারে নেওয়ার যোগ্য। পুরো কোর্স এটাই — এখন নিরাপদে তৈরি করতে যান।</p>', 'ঝুঁকি বদলেছে, habit না'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'cybersecurity').single()
  if (catErr || !category) {
    console.error('Category "cybersecurity" not found — run scripts/create-cybersecurity-category.mjs first.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] cybersecurity/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] cybersecurity/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `cybersecurity/${lesson.slug}`
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
