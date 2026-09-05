#!/usr/bin/env node
// Massively expands cybersecurity/linux-terminal (15 blocks) into a long,
// comprehensive Linux command-line lesson, per the user's explicit request
// 2026-09-03 ("include as much about linux as possible... make that
// chapter as long as possible") after sharing a roadmap.sh "Linux" PDF.
// Slug renamed (user explicitly permitted this since the site is still
// local, not launched) from linux-terminal -> linux-command-line to match
// the new scope — old id/sort_order/category kept, this is an UPDATE, not
// insert+delete, so the doc_translations row follows automatically.
//
// Scope: covers nearly every PDF section reachable from a plain shell —
// navigation, file ops, text processing, permissions/ownership, archiving,
// process management, users/groups, package management, systemd, env
// vars/PATH, networking commands, disks/filesystems (surface level), shell
// scripting basics, troubleshooting. Deliberately excludes the PDF's
// deepest DevOps/sysadmin-internals nodes (Docker/containerization,
// cgroups/ulimits, LVM internals, boot loaders, full TCP/IP stack theory,
// Netfilter/iptables deep config) — still a security-relevant CLI-literacy
// chapter inside a beginner Cybersecurity course, not a spun-off DevOps
// course; noted explicitly in a closing callout rather than silently cut.
//
// Style: matches this lesson's own established tone (the rest of the
// cybersecurity category, code blocks + short prose + tables), just much
// longer — same density precedent as this site's longest lessons
// (css/table, css/text, ~46-62 blocks).
//
// Usage: node scripts/expand-linux-lesson.mjs [--dry-run]

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

const NEW_SLUG = 'linux-command-line'
const OLD_PATH = 'cybersecurity/linux-terminal'
const NEW_PATH = `cybersecurity/${NEW_SLUG}`

const en = {
  title: 'The Linux Command Line — A Practical Deep Dive',
  metaTitle: 'The Linux Command Line — A Practical Deep Dive | Learn Computer Academy',
  metaDescription: 'A long, practical tour of the Linux command line — files, permissions, text processing, processes, users, packages, services, networking, and basic shell scripting.',
  blocks: [
    p('<p>Linux runs most of the servers on the internet, and its command line appears constantly in security guides, hosting tutorials, and troubleshooting articles — including elsewhere on this site (the Hosting & Deployment course connects to a server over SSH and uses exactly these commands). This lesson is a long, practical tour, deliberately going further than a typical "basics" chapter — the more of this that feels familiar, the less intimidating a real server becomes.</p>'),

    h(2, 'Finding Your Way Around'),
    code('bash', '# Show the current folder\npwd\n\n# List files and folders here\nls -la\n\n# Move into a folder\ncd Downloads\n\n# Go back up one level\ncd ..\n\n# Go straight to the home folder\ncd ~'),
    p('<p><code>ls -la</code> specifically — the <code>-a</code> flag shows hidden files (names starting with a dot, like <code>.ssh</code> or <code>.bashrc</code>), which regular <code>ls</code> quietly skips. A surprising amount of security-relevant configuration lives in hidden files.</p>'),

    h(2, 'The Directory Hierarchy — Where Things Live'),
    p('<p>Unlike Windows\' separate drive letters, Linux has one single folder tree starting at <code>/</code> (the root) — everything, including other disks, gets mounted somewhere inside it.</p>'),
    table(['Folder', 'What lives there'], [
      ['/home', 'Each user\'s personal files (e.g. /home/sam)'],
      ['/etc', 'System-wide configuration files'],
      ['/var', 'Data that changes often — logs, caches, mail'],
      ['/usr', 'Installed programs and their supporting files'],
      ['/bin, /usr/bin', 'Common command-line programs'],
      ['/tmp', 'Temporary files, usually cleared on reboot'],
      ['/root', 'The root (administrator) user\'s home folder'],
      ['/dev', 'Device files representing hardware'],
    ]),

    h(2, 'Working with Files — Creating, Moving, Deleting'),
    code('bash', '# Create an empty file\ntouch notes.txt\n\n# Create a folder\nmkdir project\n\n# Copy a file\ncp notes.txt backup-notes.txt\n\n# Copy an entire folder\ncp -r project project-backup\n\n# Move or rename (same command does both)\nmv notes.txt archive/notes.txt\nmv old-name.txt new-name.txt\n\n# Delete a file\nrm notes.txt\n\n# Delete a folder and everything in it\nrm -rf project-backup'),
    callout('warning', '<p><code>rm -rf</code> deletes permanently — no Recycle Bin, no undo. Double-check the path before running it, especially with a wildcard (<code>rm -rf *</code>) or as root.</p>', 'The most dangerous common command'),

    h(2, 'Viewing and Editing Files'),
    code('bash', '# Print a whole file to the screen\ncat notes.txt\n\n# Scroll through a long file (q to quit)\nless server.log\n\n# First 10 lines\nhead server.log\n\n# Last 10 lines — great for watching a log grow\ntail server.log\n\n# Keep watching a file as new lines are added\ntail -f server.log'),
    p('<p>For actually editing a file from the terminal, <b>nano</b> is the friendliest starting point — arrow keys work as expected, and the shortcuts are listed on screen.</p>'),
    code('bash', 'nano config.txt\n# Ctrl+O to save, Ctrl+X to exit'),
    p('<p><b>vim</b> is the other common option, far more powerful once learned but genuinely unintuitive at first — it opens in "normal mode," where typing doesn\'t insert text until <code>i</code> is pressed. Worth knowing at least the exit sequence, since it\'s a famous first stumbling block.</p>'),
    code('bash', 'vim config.txt\n# Press i to start typing (insert mode)\n# Press Esc to leave insert mode\n# Type :wq and press Enter to save and quit\n# Type :q! and press Enter to quit WITHOUT saving'),

    h(2, 'Redirects, Pipes, and the Three I/O Streams'),
    p('<p>Every command has three data streams: <b>stdin</b> (input), <b>stdout</b> (normal output), and <b>stderr</b> (error output) — understanding these unlocks most of what makes the command line powerful.</p>'),
    table(['Symbol', 'What it does'], [
      ['>', 'Send stdout to a file, overwriting it'],
      ['>>', 'Send stdout to a file, appending to it'],
      ['2>', 'Send stderr (only) to a file'],
      ['<', 'Feed a file in as stdin'],
      ['|', 'Pipe — send one command\'s stdout as the next command\'s stdin'],
    ]),
    code('bash', '# Save output to a file\nls -la > filelist.txt\n\n# Append instead of overwrite\necho "new entry" >> notes.txt\n\n# Send errors to a separate file, keep normal output on screen\nsome-command 2> errors.log\n\n# Chain commands — this pipeline is genuinely common in practice\nps aux | grep nginx | wc -l\n# ps aux: list every process\n# grep nginx: keep only lines mentioning nginx\n# wc -l: count the remaining lines'),

    h(2, 'Text Processing — cut, sort, uniq, grep, awk'),
    p('<p>Linux\'s small, single-purpose text tools are designed to be piped together — this is the toolkit behind reading logs, filtering data, and quick one-off reports without writing a script.</p>'),
    table(['Command', 'What it does'], [
      ['grep "pattern" file', 'Prints lines matching a pattern'],
      ['grep -i', 'Case-insensitive match'],
      ['grep -r "pattern" .', 'Search recursively through every file in a folder'],
      ['cut -d\',\' -f2', 'Extract one column from delimited text (here, the 2nd, comma-separated)'],
      ['sort', 'Sort lines alphabetically or numerically (-n)'],
      ['uniq', 'Remove adjacent duplicate lines (usually paired with sort first)'],
      ['wc -l', 'Count lines (also -w for words, -c for characters)'],
      ['tr \'a-z\' \'A-Z\'', 'Translate characters — here, lowercase to uppercase'],
    ]),
    code('bash', '# Find every failed login attempt in an auth log\ngrep "Failed password" /var/log/auth.log\n\n# Get a sorted, de-duplicated list of IPs that tried\ngrep "Failed password" /var/log/auth.log | awk \'{print $(NF-3)}\' | sort | uniq -c | sort -rn\n# awk pulls out one field per line, sort+uniq -c counts how often\n# each IP appears, the final sort -rn ranks the worst offenders first'),
    p('<p><b>awk</b> and <b>sed</b> are both full text-processing languages on their own — the single most useful pattern to remember from each: <code>awk \'{print $N}\'</code> to grab column N of space-separated text, and <code>sed \'s/old/new/g\'</code> to find-and-replace text in a stream.</p>'),
    code('bash', '# Replace every occurrence of "staging" with "production" and print the result\nsed \'s/staging/production/g\' config.txt'),

    h(2, 'File Permissions and Ownership'),
    p('<p>Every file on Linux has permissions controlling who can read, write, or execute it — this is not a formality, it\'s an actual access-control mechanism. A world-writable config file or an overly permissive SSH key is a genuine, common vulnerability.</p>'),
    code('bash', '# Check permissions on a file\nls -l script.sh\n# -rwxr-xr-- 1 sam staff 220 Sep 3 10:00 script.sh'),
    p('<p>That first block of ten characters breaks into: the file type, then three permission triplets (owner, group, everyone else) — each triplet is read (<code>r</code>), write (<code>w</code>), execute (<code>x</code>), or a dash for "not permitted."</p>'),
    table(['Symbol', 'Numeric value'], [
      ['r (read)', '4'],
      ['w (write)', '2'],
      ['x (execute)', '1'],
    ]),
    code('bash', '# Give the owner read+write+execute, group read+execute, others nothing\nchmod 750 script.sh\n\n# The same change, written symbolically\nchmod u=rwx,g=rx,o= script.sh\n\n# Make a file only the owner can read and write (common for SSH keys)\nchmod 600 id_rsa\n\n# Change who owns a file\nchown sam script.sh\n\n# Change owner and group together\nchown sam:staff script.sh'),

    h(2, 'Archiving and Compressing'),
    code('bash', '# Bundle a folder into one .tar file\ntar -cvf backup.tar project/\n\n# Same, but gzip-compressed (.tar.gz)\ntar -czvf backup.tar.gz project/\n\n# Unpack a .tar.gz\ntar -xzvf backup.tar.gz\n\n# Zip / unzip, if that format is needed instead\nzip -r backup.zip project/\nunzip backup.zip'),
    p('<p><code>c</code> = create, <code>x</code> = extract, <code>z</code> = gzip, <code>v</code> = verbose (show progress), <code>f</code> = the filename follows.</p>'),

    h(2, 'Finding Files'),
    code('bash', '# Search by name, from the current folder down\nfind . -name "*.log"\n\n# Search the whole system for a file modified in the last day\nfind / -name "config.php" -mtime -1\n\n# Fast search using a pre-built index (usually faster, may be slightly stale)\nlocate nginx.conf'),

    h(2, 'Process Management'),
    code('bash', '# List every running process\nps aux\n\n# Live, auto-refreshing view of processes and resource use\ntop\n\n# End a process by its process ID (find the ID from ps aux first)\nkill 4821\n\n# Force-kill a process that ignores a normal kill\nkill -9 4821'),
    callout('warning', '<p>Ending an unfamiliar process ID can break something else that depends on it. Confirm what a process is (via <code>ps aux</code> or a search on its name) before ending it.</p>', 'Know before you kill'),
    h(3, 'Background and Foreground'),
    code('bash', '# Start a long-running command in the background\nlong-task &\n\n# List the current background jobs\njobs\n\n# Bring a background job back to the foreground\nfg %1\n\n# A command that keeps running even after the terminal closes\nnohup long-task &'),

    h(2, 'Users and Groups'),
    p('<p>Every file, process, and permission ultimately belongs to a user — and every user belongs to one or more groups, which is how group-level permissions from the earlier section actually get applied.</p>'),
    code('bash', '# Add a new user\nsudo useradd -m newuser   # -m also creates their home folder\n\n# Set (or change) that user\'s password\nsudo passwd newuser\n\n# Add an existing user to a group\nsudo usermod -aG developers newuser\n\n# See which groups the current user belongs to\ngroups\n\n# Delete a user (and optionally their home folder with -r)\nsudo userdel -r newuser'),
    h(3, 'sudo — Running One Command as Another User'),
    p('<p><code>sudo</code> runs a single command with administrator (root) privileges, rather than logging in as root directly — the safer, standard approach, since it\'s scoped to one command and logged.</p>'),
    code('bash', 'sudo apt update\n\n# Run a shell as root (use sparingly)\nsudo -i'),

    h(2, 'Package Management'),
    p('<p>Installing software on Linux almost never means downloading an installer — a package manager handles finding, installing, updating, and removing software from a trusted repository.</p>'),
    table(['Distro family', 'Package manager', 'Install / update'], [
      ['Debian, Ubuntu', 'apt', 'sudo apt install <package> / sudo apt update && sudo apt upgrade'],
      ['Fedora, RHEL, CentOS', 'dnf (or the older yum)', 'sudo dnf install <package> / sudo dnf update'],
      ['Arch', 'pacman', 'sudo pacman -S <package> / sudo pacman -Syu'],
    ]),
    code('bash', '# Update the local list of available packages\nsudo apt update\n\n# Install a package\nsudo apt install htop\n\n# Remove a package\nsudo apt remove htop\n\n# List installed packages\napt list --installed\n\n# Upgrade every installed package\nsudo apt upgrade'),

    h(2, 'Service Management — systemd'),
    p('<p>Most modern Linux distributions manage background services (a web server, a database, an SSH server) with <b>systemd</b>, via the <code>systemctl</code> command.</p>'),
    code('bash', '# Check whether a service is running\nsudo systemctl status nginx\n\n# Start / stop / restart a service\nsudo systemctl start nginx\nsudo systemctl stop nginx\nsudo systemctl restart nginx\n\n# Make a service start automatically on boot\nsudo systemctl enable nginx\n\n# Read a service\'s recent logs\njournalctl -u nginx --since today'),

    h(2, 'Environment Variables and the Command Path'),
    p('<p>An environment variable is a named value available to every program run in that session — <code>PATH</code> is the most important one, since it\'s the list of folders the shell searches when a command is typed without a full path.</p>'),
    code('bash', '# Show every environment variable\nenv\n\n# Show one specific variable\necho $HOME\necho $PATH\n\n# Set one for the current session only\nexport API_KEY=abc123\n\n# Set one permanently — added to ~/.bashrc (or ~/.zshrc), then re-loaded\necho \'export API_KEY=abc123\' >> ~/.bashrc\nsource ~/.bashrc'),

    h(2, 'Networking Commands'),
    code('bash', '# Show this machine\'s IP address\nip a\n\n# Test whether a host is reachable\nping -c 4 google.com\n\n# Trace the network hops to a host\ntraceroute google.com\n\n# List active network connections and the process using each\nss -tulnp\n\n# The older equivalent, still common in guides\nnetstat -tulnp\n\n# Download a file or check an API from the command line\ncurl -I https://example.com    # -I: headers only\nwget https://example.com/file.zip\n\n# Look up a domain\'s DNS records\ndig example.com\nnslookup example.com'),
    p('<p><code>ss -tulnp</code> is worth remembering on its own — it lists every port a program is listening on, which is exactly what to check when trying to work out whether something unexpected is running a server on a machine.</p>'),

    h(2, 'Disks and Filesystems — the Basics'),
    code('bash', '# Show disk space used per mounted filesystem\ndf -h\n\n# Show how much space a specific folder is using\ndu -sh /var/log\n\n# List the block devices (drives and partitions) attached\nlsblk\n\n# Show what\'s currently mounted where\nmount'),

    h(2, 'Shell Scripting Basics'),
    p('<p>Any sequence of commands can be saved into a file and run as a script — the same commands covered throughout this lesson, just automated.</p>'),
    code('bash', '#!/bin/bash\n# The line above is the "shebang" — tells the system which\n# interpreter to run this file with\n\nname="World"\necho "Hello, $name!"'),
    code('bash', 'chmod +x greet.sh   # make it executable\n./greet.sh          # run it'),
    h(3, 'Variables, Conditionals, and Loops'),
    code('bash', '# A variable\ncount=5\n\n# A conditional\nif [ "$count" -gt 3 ]; then\n  echo "More than 3"\nelse\n  echo "3 or fewer"\nfi\n\n# A loop\nfor file in *.txt; do\n  echo "Found: $file"\ndone'),

    h(2, 'Troubleshooting and Server Review'),
    p('<p>A quick, standard set of checks for "what\'s going on with this machine" — worth knowing as a sequence, not just individually.</p>'),
    code('bash', '# How long has this system been up, and how loaded is it?\nuptime\n\n# Who is (or has recently been) logged in?\nwho\nlast\n\n# What does the system log say happened recently?\ntail -50 /var/log/syslog       # Debian/Ubuntu\njournalctl -n 50                # systemd-based systems\n\n# The most recent kernel/hardware messages\ndmesg | tail -50\n\n# How much memory is free?\nfree -h'),
    table(['Question', 'Command'], [
      ['Is the system overloaded?', 'uptime (check the load average)'],
      ['Is a specific service actually running?', 'systemctl status <service>'],
      ['Is the disk full?', 'df -h'],
      ['What\'s using all the memory?', 'top or free -h'],
      ['What just happened, system-wide?', 'journalctl -n 50 or tail -f /var/log/syslog'],
    ]),

    h(2, 'Common Commands, Full Reference'),
    table(['Command', 'What it does'], [
      ['pwd', 'Show the current folder'],
      ['ls -la', 'List files and folders, including hidden ones'],
      ['cd <folder>', 'Change folder'],
      ['cp / mv / rm', 'Copy / move-rename / delete'],
      ['mkdir / rmdir', 'Create / remove an empty folder'],
      ['cat / less / head / tail', 'View a file — all at once, scrollable, first lines, last lines'],
      ['grep / awk / sed / cut / sort / uniq', 'Search and process text'],
      ['chmod / chown', 'Change permissions / ownership'],
      ['tar / zip', 'Archive and compress files'],
      ['find / locate', 'Search for files'],
      ['ps aux / top / kill', 'List, monitor, and end processes'],
      ['useradd / usermod / passwd', 'Manage user accounts'],
      ['sudo apt install / update / upgrade', 'Manage packages (Debian/Ubuntu)'],
      ['systemctl start / stop / status', 'Manage background services'],
      ['ip a / ping / curl / ss -tulnp', 'Network configuration, connectivity, requests, open ports'],
      ['df -h / du -sh / lsblk', 'Disk space, folder size, attached drives'],
      ['uptime / free -h / journalctl', 'System load, memory, logs'],
    ]),

    callout('note', '<p>Deliberately left out of this lesson: containers (Docker), advanced storage (LVM), deep networking internals (the full TCP/IP stack, Netfilter/iptables rule-writing), and boot process internals — genuinely useful, but DevOps/sysadmin-specialist territory rather than the security-relevant CLI literacy this course is scoped for.</p>', 'What this deliberately leaves out'),
  ],
}

const bn = {
  title: 'Linux Command Line — একটা Practical Deep Dive',
  metaTitle: 'Linux Command Line — একটা Practical Deep Dive | Learn Computer Academy',
  metaDescription: 'Linux command line-এর একটা লম্বা, practical সফর — file, permission, text processing, process, user, package, service, networking, আর basic shell scripting।',
  blocks: [
    p('<p>Internet-এর বেশিরভাগ server Linux চালায়, আর এর command line ক্রমাগত security guide, hosting tutorial, আর troubleshooting article-এ দেখা যায় — এই সাইটের অন্য জায়গাতেও (Hosting & Deployment কোর্স SSH দিয়ে একটা server-এ connect করে আর ঠিক এই command-গুলোই ব্যবহার করে)। এই lesson একটা লম্বা, practical সফর, ইচ্ছাকৃতভাবে একটা সাধারণ "basics" chapter-এর চেয়ে অনেক বেশি — এর যত বেশি অংশ পরিচিত মনে হবে, একটা আসল server তত কম ভয়ের মনে হবে।</p>'),

    h(2, 'জায়গা খুঁজে বের করা', 'জায়গা-খুঁজে-বের-করা'),
    code('bash', '# বর্তমান folder দেখান\npwd\n\n# এখানকার file আর folder list করুন\nls -la\n\n# একটা folder-এ যান\ncd Downloads\n\n# এক level উপরে ফিরে যান\ncd ..\n\n# সরাসরি home folder-এ যান\ncd ~'),
    p('<p>বিশেষভাবে <code>ls -la</code> — <code>-a</code> flag hidden file দেখায় (dot দিয়ে শুরু হওয়া নাম, যেমন <code>.ssh</code> বা <code>.bashrc</code>), যা সাধারণ <code>ls</code> চুপচাপ বাদ দেয়। বিস্ময়কর পরিমাণ security-relevant configuration hidden file-এ থাকে।</p>'),

    h(2, 'Directory Hierarchy — জিনিস কোথায় থাকে', 'directory-hierarchy-জিনিস-কোথায়-থাকে'),
    p('<p>Windows-এর আলাদা drive letter-এর মতো না, Linux-এর <code>/</code> (root) থেকে শুরু হওয়া একটা একক folder tree আছে — বাকি সব disk সহ সবকিছু এর ভেতরে কোথাও mount হয়।</p>'),
    table(['Folder', 'যেখানে কী থাকে'], [
      ['/home', 'প্রতিটি user-এর personal file (যেমন /home/sam)'],
      ['/etc', 'System-wide configuration file'],
      ['/var', 'প্রায়ই বদলায় এমন data — log, cache, mail'],
      ['/usr', 'Install করা program আর তাদের সহায়ক file'],
      ['/bin, /usr/bin', 'সাধারণ command-line program'],
      ['/tmp', 'Temporary file, সাধারণত reboot-এ clear হয়'],
      ['/root', 'root (administrator) user-এর home folder'],
      ['/dev', 'Hardware represent করা device file'],
    ]),

    h(2, 'File নিয়ে কাজ করা — তৈরি, Move, Delete', 'file-নিয়ে-কাজ-করা-তৈরি-move-delete'),
    code('bash', '# একটা খালি file তৈরি করুন\ntouch notes.txt\n\n# একটা folder তৈরি করুন\nmkdir project\n\n# একটা file copy করুন\ncp notes.txt backup-notes.txt\n\n# পুরো একটা folder copy করুন\ncp -r project project-backup\n\n# Move বা rename (একই command দুটোই করে)\nmv notes.txt archive/notes.txt\nmv old-name.txt new-name.txt\n\n# একটা file delete করুন\nrm notes.txt\n\n# একটা folder আর এর ভেতরের সবকিছু delete করুন\nrm -rf project-backup'),
    callout('warning', '<p><code>rm -rf</code> স্থায়ীভাবে delete করে — কোনো Recycle Bin না, কোনো undo না। চালানোর আগে path দুবার check করুন, বিশেষত একটা wildcard (<code>rm -rf *</code>) সহ বা root হিসেবে।</p>', 'সবচেয়ে বিপজ্জনক common command'),

    h(2, 'File দেখা ও Edit করা', 'file-দেখা-ও-edit-করা'),
    code('bash', '# একটা পুরো file screen-এ print করুন\ncat notes.txt\n\n# একটা লম্বা file scroll করে দেখুন (বের হতে q)\nless server.log\n\n# প্রথম 10 লাইন\nhead server.log\n\n# শেষ 10 লাইন — একটা log বাড়তে দেখার জন্য দারুণ\ntail server.log\n\n# নতুন লাইন যোগ হওয়ার সাথে সাথে একটা file দেখতে থাকুন\ntail -f server.log'),
    p('<p>Terminal থেকে আসলে একটা file edit করার জন্য, <b>nano</b> সবচেয়ে বন্ধুত্বপূর্ণ শুরুর পয়েন্ট — arrow key প্রত্যাশিতভাবে কাজ করে, আর shortcut screen-এ list করা থাকে।</p>'),
    code('bash', 'nano config.txt\n# Save করতে Ctrl+O, বের হতে Ctrl+X'),
    p('<p><b>vim</b> অন্য common option, শেখার পর অনেক বেশি শক্তিশালী কিন্তু প্রথমে সত্যিকারভাবে অস্বাভাবিক — এটা "normal mode"-এ খোলে, যেখানে <code>i</code> চাপা না পর্যন্ত টাইপ করলে টেক্সট insert হয় না। অন্তত exit sequence জানার যোগ্য, কারণ এটা একটা বিখ্যাত প্রথম বাধা।</p>'),
    code('bash', 'vim config.txt\n# টাইপ শুরু করতে i চাপুন (insert mode)\n# insert mode থেকে বের হতে Esc চাপুন\n# Save আর quit করতে :wq টাইপ করে Enter চাপুন\n# Save না করে quit করতে :q! টাইপ করে Enter চাপুন'),

    h(2, 'Redirect, Pipe, ও তিনটি I/O Stream', 'redirect-pipe-ও-তিনটি-io-stream'),
    p('<p>প্রতিটি command-এর তিনটি data stream আছে: <b>stdin</b> (input), <b>stdout</b> (সাধারণ output), আর <b>stderr</b> (error output) — এগুলো বোঝা command line-কে যা শক্তিশালী বানায় তার বেশিরভাগ unlock করে।</p>'),
    table(['চিহ্ন', 'এটা কী করে'], [
      ['>', 'stdout একটা file-এ পাঠায়, overwrite করে'],
      ['>>', 'stdout একটা file-এ পাঠায়, append করে'],
      ['2>', 'stderr (শুধু) একটা file-এ পাঠায়'],
      ['<', 'একটা file stdin হিসেবে দেয়'],
      ['|', 'Pipe — এক command-এর stdout পরের command-এর stdin হিসেবে পাঠায়'],
    ]),
    code('bash', '# একটা file-এ output save করুন\nls -la > filelist.txt\n\n# Overwrite না করে append করুন\necho "new entry" >> notes.txt\n\n# Error আলাদা file-এ পাঠান, সাধারণ output screen-এ রাখুন\nsome-command 2> errors.log\n\n# Command একসাথে chain করুন — এই pipeline বাস্তবে সত্যিকারভাবে common\nps aux | grep nginx | wc -l\n# ps aux: প্রতিটি process list করে\n# grep nginx: শুধু nginx-এর কথা বলা লাইন রাখে\n# wc -l: বাকি লাইন গোনে'),

    h(2, 'Text Processing — cut, sort, uniq, grep, awk'),
    p('<p>Linux-এর ছোট, single-purpose text tool একসাথে pipe করার জন্য বানানো — কোনো script না লিখেই log পড়া, data filter করা, আর দ্রুত one-off report-এর পেছনের toolkit এটাই।</p>'),
    table(['Command', 'এটা কী করে'], [
      ['grep "pattern" file', 'একটা pattern-এ মেলা লাইন print করে'],
      ['grep -i', 'Case-insensitive মিল'],
      ['grep -r "pattern" .', 'একটা folder-এর প্রতিটি file-এ recursively search করে'],
      ['cut -d\',\' -f2', 'Delimited টেক্সট থেকে একটা column বের করে (এখানে, ২য়, comma-separated)'],
      ['sort', 'বর্ণানুক্রমিক বা সংখ্যাগতভাবে (-n) লাইন sort করে'],
      ['uniq', 'পাশাপাশি ডুপ্লিকেট লাইন সরায় (সাধারণত আগে sort-এর সাথে জোড়া)'],
      ['wc -l', 'লাইন গোনে (word-এর জন্য -w, character-এর জন্য -c-ও)'],
      ['tr \'a-z\' \'A-Z\'', 'Character translate করে — এখানে, lowercase থেকে uppercase'],
    ]),
    code('bash', '# একটা auth log-এ প্রতিটা failed login attempt খুঁজুন\ngrep "Failed password" /var/log/auth.log\n\n# চেষ্টা করা IP-র একটা sorted, de-duplicated list পান\ngrep "Failed password" /var/log/auth.log | awk \'{print $(NF-3)}\' | sort | uniq -c | sort -rn\n# awk প্রতি লাইনে একটা field বের করে, sort+uniq -c প্রতিটা\n# IP কতবার দেখা যায় গোনে, শেষ sort -rn সবচেয়ে খারাপগুলো আগে rank করে'),
    p('<p><b>awk</b> আর <b>sed</b> দুটোই নিজেরাই পূর্ণ text-processing language — প্রতিটা থেকে মনে রাখার মতো একটা মাত্র সবচেয়ে useful pattern: space-separated টেক্সটের N নম্বর column ধরতে <code>awk \'{print $N}\'</code>, আর একটা stream-এ টেক্সট find-and-replace করতে <code>sed \'s/old/new/g\'</code>।</p>'),
    code('bash', '# "staging"-এর প্রতিটা occurrence "production" দিয়ে বদলান আর ফলাফল print করুন\nsed \'s/staging/production/g\' config.txt'),

    h(2, 'File Permission ও Ownership', 'file-permission-ও-ownership'),
    p('<p>Linux-এ প্রতিটা file-এর permission থাকে যা নিয়ন্ত্রণ করে কে read, write, বা execute করতে পারবে — এটা একটা formality না, এটা একটা আসল access-control mechanism। একটা world-writable config file বা একটা অতিরিক্ত permissive SSH key একটা আসল, সাধারণ vulnerability।</p>'),
    code('bash', '# একটা file-এর permission check করুন\nls -l script.sh\n# -rwxr-xr-- 1 sam staff 220 Sep 3 10:00 script.sh'),
    p('<p>দশ character-এর সেই প্রথম block ভাগ হয়: file type, তারপর তিনটা permission triplet (owner, group, বাকি সবাই) — প্রতিটা triplet read (<code>r</code>), write (<code>w</code>), execute (<code>x</code>), বা "অনুমতি নেই"-এর জন্য একটা dash।</p>'),
    table(['চিহ্ন', 'সংখ্যাগত মান'], [
      ['r (read)', '4'],
      ['w (write)', '2'],
      ['x (execute)', '1'],
    ]),
    code('bash', '# Owner-কে read+write+execute, group-কে read+execute, বাকিদের কিছু না দিন\nchmod 750 script.sh\n\n# একই পরিবর্তন, symbolically লেখা\nchmod u=rwx,g=rx,o= script.sh\n\n# একটা file শুধু owner read আর write করতে পারবে এমন বানান (SSH key-এর জন্য common)\nchmod 600 id_rsa\n\n# একটা file কে owns করে তা বদলান\nchown sam script.sh\n\n# owner আর group একসাথে বদলান\nchown sam:staff script.sh'),

    h(2, 'Archive ও Compress করা', 'archive-ও-compress-করা'),
    code('bash', '# একটা folder-কে একটা .tar file-এ bundle করুন\ntar -cvf backup.tar project/\n\n# একই, কিন্তু gzip-compressed (.tar.gz)\ntar -czvf backup.tar.gz project/\n\n# একটা .tar.gz unpack করুন\ntar -xzvf backup.tar.gz\n\n# Zip / unzip, ওই format দরকার হলে\nzip -r backup.zip project/\nunzip backup.zip'),
    p('<p><code>c</code> = create, <code>x</code> = extract, <code>z</code> = gzip, <code>v</code> = verbose (progress দেখায়), <code>f</code> = filename এরপর আসে।</p>'),

    h(2, 'File খুঁজে বের করা', 'file-খুঁজে-বের-করা'),
    code('bash', '# নাম দিয়ে search করুন, বর্তমান folder থেকে নিচে\nfind . -name "*.log"\n\n# গত এক দিনে বদলানো একটা file-এর জন্য পুরো system search করুন\nfind / -name "config.php" -mtime -1\n\n# আগে-থেকে-বানানো একটা index ব্যবহার করে দ্রুত search (সাধারণত দ্রুত, সামান্য পুরনো হতে পারে)\nlocate nginx.conf'),

    h(2, 'Process Management'),
    code('bash', '# প্রতিটা চলমান process list করুন\nps aux\n\n# process আর resource use-এর live, auto-refreshing view\ntop\n\n# process ID দিয়ে একটা process বন্ধ করুন (আগে ps aux থেকে ID খুঁজুন)\nkill 4821\n\n# সাধারণ kill ignore করা একটা process force-kill করুন\nkill -9 4821'),
    callout('warning', '<p>একটা অপরিচিত process ID বন্ধ করলে এর উপর নির্ভরশীল অন্য কিছু ভেঙে যেতে পারে। বন্ধ করার আগে (<code>ps aux</code> বা নাম দিয়ে search করে) নিশ্চিত করুন process-টা কী।</p>', 'বন্ধ করার আগে জানুন'),
    h(3, 'Background ও Foreground'),
    code('bash', '# একটা লম্বা সময় চলা command background-এ শুরু করুন\nlong-task &\n\n# বর্তমান background job list করুন\njobs\n\n# একটা background job আবার foreground-এ আনুন\nfg %1\n\n# terminal বন্ধ হওয়ার পরও চলতে থাকা একটা command\nnohup long-task &'),

    h(2, 'User ও Group'),
    p('<p>প্রতিটা file, process, আর permission শেষ পর্যন্ত একজন user-এর — আর প্রতিটা user এক বা একাধিক group-এর, যা আগের section-এর group-level permission আসলে কীভাবে apply হয় তা ঠিক করে।</p>'),
    code('bash', '# একটা নতুন user যোগ করুন\nsudo useradd -m newuser   # -m তাদের home folder-ও তৈরি করে\n\n# ওই user-এর password সেট (বা বদল) করুন\nsudo passwd newuser\n\n# একটা বিদ্যমান user-কে একটা group-এ যোগ করুন\nsudo usermod -aG developers newuser\n\n# বর্তমান user কোন group-এ আছে দেখুন\ngroups\n\n# একটা user delete করুন (আর চাইলে -r দিয়ে তাদের home folder-ও)\nsudo userdel -r newuser'),
    h(3, 'sudo — অন্য একজন User হিসেবে একটা Command চালানো', 'sudo-অন্য-একজন-user-হিসেবে-একটা-command-চালানো'),
    p('<p><code>sudo</code> সরাসরি root হিসেবে login করার বদলে administrator (root) privilege দিয়ে একটা মাত্র command চালায় — নিরাপদ, standard approach, কারণ এটা একটা command-এ সীমাবদ্ধ আর log হয়।</p>'),
    code('bash', 'sudo apt update\n\n# root হিসেবে একটা shell চালান (কম ব্যবহার করুন)\nsudo -i'),

    h(2, 'Package Management'),
    p('<p>Linux-এ software install করা মানে প্রায় কখনোই একটা installer download করা না — একটা package manager একটা বিশ্বস্ত repository থেকে software খোঁজা, install, update, আর সরানো handle করে।</p>'),
    table(['Distro পরিবার', 'Package manager', 'Install / update'], [
      ['Debian, Ubuntu', 'apt', 'sudo apt install <package> / sudo apt update && sudo apt upgrade'],
      ['Fedora, RHEL, CentOS', 'dnf (বা পুরনো yum)', 'sudo dnf install <package> / sudo dnf update'],
      ['Arch', 'pacman', 'sudo pacman -S <package> / sudo pacman -Syu'],
    ]),
    code('bash', '# উপলব্ধ package-এর local list আপডেট করুন\nsudo apt update\n\n# একটা package install করুন\nsudo apt install htop\n\n# একটা package সরান\nsudo apt remove htop\n\n# Installed package list করুন\napt list --installed\n\n# প্রতিটা installed package upgrade করুন\nsudo apt upgrade'),

    h(2, 'Service Management — systemd'),
    p('<p>বেশিরভাগ modern Linux distribution background service (একটা web server, একটা database, একটা SSH server) <b>systemd</b> দিয়ে manage করে, <code>systemctl</code> command-এর মাধ্যমে।</p>'),
    code('bash', '# একটা service চলছে কিনা check করুন\nsudo systemctl status nginx\n\n# একটা service start / stop / restart করুন\nsudo systemctl start nginx\nsudo systemctl stop nginx\nsudo systemctl restart nginx\n\n# boot-এ একটা service স্বয়ংক্রিয়ভাবে শুরু হতে বানান\nsudo systemctl enable nginx\n\n# একটা service-এর সাম্প্রতিক log পড়ুন\njournalctl -u nginx --since today'),

    h(2, 'Environment Variable ও Command Path', 'environment-variable-ও-command-path'),
    p('<p>একটা environment variable সেই session-এ চালানো প্রতিটা program-এর জন্য উপলব্ধ একটা নামযুক্ত মান — <code>PATH</code> সবচেয়ে গুরুত্বপূর্ণটা, কারণ পুরো path ছাড়া একটা command টাইপ করলে shell যে folder-গুলো search করে তার list এটাই।</p>'),
    code('bash', '# প্রতিটা environment variable দেখান\nenv\n\n# একটা নির্দিষ্ট variable দেখান\necho $HOME\necho $PATH\n\n# শুধু বর্তমান session-এর জন্য একটা সেট করুন\nexport API_KEY=abc123\n\n# স্থায়ীভাবে একটা সেট করুন — ~/.bashrc (বা ~/.zshrc)-এ যোগ করা, তারপর আবার load করা\necho \'export API_KEY=abc123\' >> ~/.bashrc\nsource ~/.bashrc'),

    h(2, 'Networking Command'),
    code('bash', '# এই machine-এর IP address দেখান\nip a\n\n# একটা host reachable কিনা test করুন\nping -c 4 google.com\n\n# একটা host-এ network hop trace করুন\ntraceroute google.com\n\n# active network connection আর প্রতিটা ব্যবহার করা process list করুন\nss -tulnp\n\n# পুরনো সমতুল্য, এখনো guide-এ common\nnetstat -tulnp\n\n# command line থেকে একটা file download বা একটা API check করুন\ncurl -I https://example.com    # -I: শুধু header\nwget https://example.com/file.zip\n\n# একটা domain-এর DNS record lookup করুন\ndig example.com\nnslookup example.com'),
    p('<p><code>ss -tulnp</code> নিজেই মনে রাখার মতো — এটা প্রতিটা port list করে যেখানে একটা program listen করছে, যা কোনো machine-এ অপ্রত্যাশিতভাবে কিছু server চালাচ্ছে কিনা check করার জন্য ঠিক যা দরকার।</p>'),

    h(2, 'Disk ও Filesystem — বেসিক', 'disk-ও-filesystem-বেসিক'),
    code('bash', '# প্রতি mounted filesystem-এ ব্যবহৃত disk space দেখান\ndf -h\n\n# একটা নির্দিষ্ট folder কতটা space ব্যবহার করছে দেখান\ndu -sh /var/log\n\n# যুক্ত block device (drive আর partition) list করুন\nlsblk\n\n# বর্তমানে কী কোথায় mount করা দেখান\nmount'),

    h(2, 'Shell Scripting-এর বেসিক', 'shell-scripting-এর-বেসিক'),
    p('<p>যেকোনো command-এর ধারা একটা file-এ save করে একটা script হিসেবে চালানো যায় — এই lesson জুড়ে কভার করা একই command, শুধু automate করা।</p>'),
    code('bash', '#!/bin/bash\n# উপরের লাইন "shebang" — system-কে বলে এই file কোন\n# interpreter দিয়ে চালাতে হবে\n\nname="World"\necho "Hello, $name!"'),
    code('bash', 'chmod +x greet.sh   # executable বানান\n./greet.sh          # চালান'),
    h(3, 'Variable, Conditional, ও Loop', 'variable-conditional-ও-loop'),
    code('bash', '# একটা variable\ncount=5\n\n# একটা conditional\nif [ "$count" -gt 3 ]; then\n  echo "More than 3"\nelse\n  echo "3 or fewer"\nfi\n\n# একটা loop\nfor file in *.txt; do\n  echo "Found: $file"\ndone'),

    h(2, 'Troubleshooting ও Server Review', 'troubleshooting-ও-server-review'),
    p('<p>"এই machine-এ কী চলছে" তার জন্য একটা দ্রুত, standard check-এর সেট — শুধু আলাদাভাবে না, একটা ধারা হিসেবে জানার যোগ্য।</p>'),
    code('bash', '# এই system কতক্ষণ up আছে, আর কতটা loaded?\nuptime\n\n# কে login করে আছে (বা সম্প্রতি ছিল)?\nwho\nlast\n\n# system log সম্প্রতি কী ঘটেছে বলে?\ntail -50 /var/log/syslog       # Debian/Ubuntu\njournalctl -n 50                # systemd-ভিত্তিক system\n\n# সবচেয়ে সাম্প্রতিক kernel/hardware message\ndmesg | tail -50\n\n# কতটা memory ফাঁকা?\nfree -h'),
    table(['প্রশ্ন', 'Command'], [
      ['System কি overloaded?', 'uptime (load average check করুন)'],
      ['একটা নির্দিষ্ট service কি আসলে চলছে?', 'systemctl status <service>'],
      ['Disk কি ভরে গেছে?', 'df -h'],
      ['কী সব memory ব্যবহার করছে?', 'top বা free -h'],
      ['System-wide এইমাত্র কী ঘটল?', 'journalctl -n 50 বা tail -f /var/log/syslog'],
    ]),

    h(2, 'সাধারণ Command, পূর্ণ Reference', 'সাধারণ-command-পূর্ণ-reference'),
    table(['Command', 'কী করে'], [
      ['pwd', 'বর্তমান folder দেখায়'],
      ['ls -la', 'hidden সহ file আর folder list করে'],
      ['cd <folder>', 'folder বদলায়'],
      ['cp / mv / rm', 'Copy / move-rename / delete'],
      ['mkdir / rmdir', 'একটা খালি folder তৈরি / সরায়'],
      ['cat / less / head / tail', 'একটা file দেখা — একসাথে, scrollable, প্রথম লাইন, শেষ লাইন'],
      ['grep / awk / sed / cut / sort / uniq', 'টেক্সট search আর process করা'],
      ['chmod / chown', 'Permission / ownership বদলানো'],
      ['tar / zip', 'File archive আর compress করা'],
      ['find / locate', 'File search করা'],
      ['ps aux / top / kill', 'Process list, monitor, বন্ধ করা'],
      ['useradd / usermod / passwd', 'User account manage করা'],
      ['sudo apt install / update / upgrade', 'Package manage করা (Debian/Ubuntu)'],
      ['systemctl start / stop / status', 'Background service manage করা'],
      ['ip a / ping / curl / ss -tulnp', 'Network configuration, connectivity, request, খোলা port'],
      ['df -h / du -sh / lsblk', 'Disk space, folder size, যুক্ত drive'],
      ['uptime / free -h / journalctl', 'System load, memory, log'],
    ]),

    callout('note', '<p>ইচ্ছাকৃতভাবে এই lesson-এ বাদ: container (Docker), advanced storage (LVM), গভীর networking internals (পুরো TCP/IP stack, Netfilter/iptables rule-লেখা), আর boot process internals — সত্যিকারভাবে useful, কিন্তু এই কোর্স যে security-relevant CLI literacy-এর জন্য scoped তার চেয়ে DevOps/sysadmin-specialist territory।</p>', 'এটা ইচ্ছাকৃতভাবে যা বাদ দেয়'),
  ],
}

async function main() {
  const { data: doc, error: docErr } = await supabase.from('docs').select('id, category_id, sort_order').eq('path', OLD_PATH).single()
  if (docErr || !doc) { console.error('Doc not found at', OLD_PATH, docErr?.message); process.exit(1) }

  console.log(`Found doc id ${doc.id} at ${OLD_PATH} (sort_order ${doc.sort_order})`)
  console.log(`Will rename to ${NEW_PATH}, en: ${en.blocks.length} blocks, bn: ${bn.blocks.length} blocks`)

  if (DRY_RUN) { console.log('[dry-run] no writes made.'); return }

  const { error: updErr } = await supabase.from('docs').update({
    slug: NEW_SLUG,
    path: NEW_PATH,
    title: en.title,
    meta_title: en.metaTitle,
    meta_description: en.metaDescription,
    blocks: en.blocks,
    toc: toc(en.blocks),
  }).eq('id', doc.id)
  if (updErr) { console.error('en update failed:', updErr.message); process.exit(1) }
  console.log('  ✓ en updated + renamed')

  const { error: trErr } = await supabase.from('doc_translations').update({
    title: bn.title,
    meta_title: bn.metaTitle,
    meta_description: bn.metaDescription,
    blocks: bn.blocks,
    toc: toc(bn.blocks),
  }).eq('doc_id', doc.id).eq('locale', 'bn')
  if (trErr) { console.error('bn update failed:', trErr.message); process.exit(1) }
  console.log('  ✓ bn updated')

  console.log(`\n✅ Done. ${OLD_PATH} -> ${NEW_PATH}`)
}

main().catch(err => { console.error(err); process.exit(1) })
