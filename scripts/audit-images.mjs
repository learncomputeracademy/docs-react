#!/usr/bin/env node
// scripts/audit-images.mjs
// Dry-run only. Scans assets/img for every file, scans all _docs/*.md for
// every reference (<img src>, <a href> to an image/gif), and reports
// referenced vs orphaned. No writes, no uploads. Run before migrate-images.mjs.

import fs from 'node:fs/promises'
import path from 'node:path'

const DOCS_SOURCE = 'C:/Users/Raptor/Downloads/docs-master/docs-master'
const IMG_DIR = path.join(DOCS_SOURCE, 'assets/img')
const DOCS_DIR = path.join(DOCS_SOURCE, '_docs')
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'])

async function walk(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await walk(full, out)
    else out.push(full)
  }
  return out
}

function normalize(p) {
  // Strip Liquid baseurl tag, then collapse ../ and leading / in a loop
  // until stable (earlier bug: single-pass stripping missed nested ../../)
  let prev
  let cur = p.replace(/\{\{[\s\S]*?\}\}/g, '')
  do {
    prev = cur
    cur = cur.replace(/^(\.\.\/|\.\/|\/)/, '')
  } while (cur !== prev)
  return cur
}

async function main() {
  const allFiles = (await walk(IMG_DIR))
    .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))

  const docFiles = []
  async function walkDocs(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) await walkDocs(full)
      else if (entry.name.endsWith('.md')) docFiles.push(full)
    }
  }
  await walkDocs(DOCS_DIR)

  const referenced = new Set()
  const brokenRefs = []

  for (const file of docFiles) {
    const raw = await fs.readFile(file, 'utf8')
    const srcMatches = [...raw.matchAll(/(?:src|href)=["']([^"']+\.(?:png|jpe?g|gif|svg|webp))["']/gi)]
    for (const m of srcMatches) {
      const norm = normalize(m[1])
      referenced.add(norm)
    }
  }

  // Cross-check: does every referenced path resolve to a real file?
  const fileSet = new Set(allFiles.map(f => normalize(path.relative(DOCS_SOURCE, f).replace(/\\/g, '/'))))
  for (const ref of referenced) {
    if (!fileSet.has(ref)) brokenRefs.push(ref)
  }

  let referencedBytes = 0, orphanedBytes = 0
  const orphanList = [], referencedList = []
  for (const file of allFiles) {
    const rel = normalize(path.relative(DOCS_SOURCE, file).replace(/\\/g, '/'))
    const stat = await fs.stat(file)
    if (referenced.has(rel)) {
      referencedBytes += stat.size
      referencedList.push({ path: rel, bytes: stat.size, ext: path.extname(file).toLowerCase() })
    } else {
      orphanedBytes += stat.size
      orphanList.push({ path: rel, bytes: stat.size })
    }
  }

  const byExt = {}
  for (const f of referencedList) byExt[f.ext] = (byExt[f.ext] || { count: 0, bytes: 0 })
  for (const f of referencedList) { byExt[f.ext].count++; byExt[f.ext].bytes += f.bytes }

  console.log('─────────────────────────────────────────')
  console.log(`Total image files:     ${allFiles.length}`)
  console.log(`Referenced:            ${referencedList.length}  (${(referencedBytes/1024/1024).toFixed(1)} MB)`)
  console.log(`Orphaned:               ${orphanList.length}  (${(orphanedBytes/1024/1024).toFixed(1)} MB)`)
  console.log(`Broken refs (no file):  ${brokenRefs.length}`)
  console.log('─────────────────────────────────────────')
  console.log('By extension (referenced only):')
  for (const [ext, v] of Object.entries(byExt).sort((a,b) => b[1].bytes - a[1].bytes)) {
    console.log(`  ${ext.padEnd(6)} ${String(v.count).padStart(4)} files  ${(v.bytes/1024/1024).toFixed(1)} MB`)
  }
  console.log('\nLargest 10 orphans:')
  orphanList.sort((a,b) => b.bytes - a.bytes).slice(0,10).forEach(f =>
    console.log(`  ${(f.bytes/1024/1024).toFixed(2)} MB  ${f.path}`))

  if (brokenRefs.length) {
    console.log('\nBroken references (referenced in a lesson, file does not exist):')
    brokenRefs.forEach(r => console.log('  ', r))
  }

  await fs.mkdir('scripts/reports', { recursive: true })
  await fs.writeFile('scripts/reports/image-audit.json', JSON.stringify({
    referencedList, orphanList, brokenRefs,
  }, null, 2))
  console.log('\nWrote scripts/reports/image-audit.json')
}

main().catch(err => { console.error(err); process.exit(1) })
