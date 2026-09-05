'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Copy, Check, ArrowRight, Plus, Trash2, Upload, Download,
  CaseUpper, CaseLower, CaseSensitive, AlignLeft, ListX, ArrowDownAZ, ArrowUpZA, Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, Slider } from '@/components/tools/tool-controls'
import { nps } from '@/lib/notepad-i18n'
import {
  DEFAULT_NOTE, loadNotes, loadActiveId, saveNotes, saveActiveId, newNoteId,
  toTitleCase, trimEachLine, removeBlankLines, sortLines, dedupeLines,
  computeStats, replaceAll, findNext,
  type Note,
} from '@/lib/notepad'
import { highlight, LANGS } from '@/lib/shiki'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

export function NotepadDemo({ locale }: { locale: Locale }) {
  const s = nps(locale)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Deterministic default — the real notes only load from localStorage in
  // a client-only effect below, so SSR and the client's first render agree
  // (same fix shape as the documented useState(defaultState) gotcha).
  const [notes, setNotes] = useState<Note[]>([DEFAULT_NOTE])
  const [activeId, setActiveId] = useState(DEFAULT_NOTE.id)
  const [hydrated, setHydrated] = useState(false)

  const [wordWrap, setWordWrap] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseInsensitive, setCaseInsensitive] = useState(true)
  const [copied, setCopied] = useState(false)

  const [showPreview, setShowPreview] = useState(false)
  const [previewLang, setPreviewLang] = useState('html')
  const [previewHtml, setPreviewHtml] = useState('')

  useEffect(() => {
    setNotes(loadNotes())
    setActiveId(loadActiveId())
    setHydrated(true)
  }, [])
  useEffect(() => { if (hydrated) saveNotes(notes) }, [notes, hydrated])
  useEffect(() => { if (hydrated) saveActiveId(activeId) }, [activeId, hydrated])

  const activeNote = notes.find((n) => n.id === activeId) ?? notes[0]
  const stats = useMemo(() => computeStats(activeNote.content), [activeNote.content])

  useEffect(() => {
    if (!showPreview) return
    let cancelled = false
    highlight(activeNote.content, previewLang).then((html) => { if (!cancelled) setPreviewHtml(html) })
    return () => { cancelled = true }
  }, [showPreview, previewLang, activeNote.content])

  function updateContent(content: string) {
    setNotes((prev) => prev.map((n) => (n.id === activeId ? { ...n, content, updatedAt: Date.now() } : n)))
  }
  function renameActive(title: string) {
    setNotes((prev) => prev.map((n) => (n.id === activeId ? { ...n, title } : n)))
  }
  function addNote() {
    const id = newNoteId()
    setNotes((prev) => [...prev, { id, title: s.untitled, content: '', updatedAt: Date.now() }])
    setActiveId(id)
  }
  function deleteNote(id: string) {
    if (notes.length <= 1) return
    if (!window.confirm(s.confirmDelete)) return
    const next = notes.filter((n) => n.id !== id)
    setNotes(next)
    if (activeId === id) setActiveId(next[0].id)
  }

  function applyTransform(fn: (str: string) => string) {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart, selectionEnd, value } = ta
    if (selectionEnd > selectionStart) {
      const transformed = fn(value.slice(selectionStart, selectionEnd))
      const next = value.slice(0, selectionStart) + transformed + value.slice(selectionEnd)
      updateContent(next)
      requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(selectionStart, selectionStart + transformed.length) })
    } else {
      updateContent(fn(value))
    }
  }

  function handleFindNext() {
    const ta = textareaRef.current
    if (!ta) return
    const match = findNext(activeNote.content, findText, ta.selectionEnd || 0, caseInsensitive)
    if (!match) return
    ta.focus()
    ta.setSelectionRange(match[0], match[1])
  }
  function handleReplaceAll() {
    updateContent(replaceAll(activeNote.content, findText, replaceText, caseInsensitive))
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const id = newNoteId()
      const title = file.name.replace(/\.[^.]+$/, '')
      setNotes((prev) => [...prev, { id, title, content: String(reader.result ?? ''), updatedAt: Date.now() }])
      setActiveId(id)
    }
    reader.readAsText(file)
    e.target.value = ''
  }
  function handleExport() {
    const blob = new Blob([activeNote.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeNote.title || 'note'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
  async function copyAll() {
    await navigator.clipboard.writeText(activeNote.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/basics' : '/basics'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mt-6 space-y-4">
        <Section title={s.notes} action={<Button size="sm" variant="outline" onClick={addNote}><Plus className="size-3.5" />{s.newNote}</Button>}>
          <div className="flex flex-wrap gap-1.5">
            {notes.map((n) => (
              <div key={n.id} className={cn('flex items-center gap-1 rounded-md border px-1.5 py-1', n.id === activeId ? 'border-primary/60 bg-primary/5' : '')}>
                <button type="button" onClick={() => setActiveId(n.id)} className="max-w-32 truncate text-xs">{n.title || s.untitled}</button>
                {notes.length > 1 && (
                  <button type="button" onClick={() => deleteNote(n.id)} title={s.deleteNote} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={activeNote.title}
            onChange={(e) => renameActive(e.target.value)}
            placeholder={s.untitled}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm font-medium"
          />
        </Section>

        <Section title={s.editor}>
          <div className="flex flex-wrap items-center gap-1.5">
            <label className="flex items-center gap-1.5 text-xs">
              <input type="checkbox" checked={wordWrap} onChange={(e) => setWordWrap(e.target.checked)} />
              {s.wordWrap}
            </label>
            <div className="ml-auto w-32">
              <Slider label={s.fontSize} value={fontSize} min={11} max={20} step={1} suffix="px" onChange={setFontSize} />
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={activeNote.content}
            onChange={(e) => updateContent(e.target.value)}
            spellCheck={false}
            className="h-80 w-full resize-y rounded-md border bg-background p-3 font-mono leading-relaxed"
            style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre', overflowWrap: wordWrap ? 'break-word' : 'normal' }}
          />
          <p className="text-xs text-muted-foreground">{s.selectionHint}</p>
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="outline" onClick={() => applyTransform((t) => t.toUpperCase())}><CaseUpper className="size-3.5" />{s.upper}</Button>
            <Button size="sm" variant="outline" onClick={() => applyTransform((t) => t.toLowerCase())}><CaseLower className="size-3.5" />{s.lower}</Button>
            <Button size="sm" variant="outline" onClick={() => applyTransform(toTitleCase)}><CaseSensitive className="size-3.5" />{s.titleCase}</Button>
            <Button size="sm" variant="outline" onClick={() => applyTransform(trimEachLine)}><AlignLeft className="size-3.5" />{s.trim}</Button>
            <Button size="sm" variant="outline" onClick={() => applyTransform(removeBlankLines)}><ListX className="size-3.5" />{s.removeBlank}</Button>
            <Button size="sm" variant="outline" onClick={() => applyTransform((t) => sortLines(t, true))}><ArrowDownAZ className="size-3.5" />{s.sortAsc}</Button>
            <Button size="sm" variant="outline" onClick={() => applyTransform((t) => sortLines(t, false))}><ArrowUpZA className="size-3.5" />{s.sortDesc}</Button>
            <Button size="sm" variant="outline" onClick={() => applyTransform(dedupeLines)}><Layers className="size-3.5" />{s.dedupe}</Button>
          </div>
        </Section>

        <Section title={s.findReplace}>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={findText} onChange={(e) => setFindText(e.target.value)} placeholder={s.find} className="rounded-md border bg-background px-2 py-1.5 text-sm" />
            <input type="text" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} placeholder={s.replace} className="rounded-md border bg-background px-2 py-1.5 text-sm" />
          </div>
          <label className="flex items-center gap-1.5 text-xs">
            <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} />
            {s.caseInsensitive}
          </label>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="w-full" onClick={handleFindNext}>{s.findNext}</Button>
            <Button size="sm" variant="outline" className="w-full" onClick={handleReplaceAll}>{s.replaceAll}</Button>
          </div>
        </Section>

        <Section title={s.stats}>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <p>{s.words}: <span className="font-mono font-semibold">{stats.words}</span></p>
            <p>{s.chars}: <span className="font-mono font-semibold">{stats.chars}</span></p>
            <p>{s.lines}: <span className="font-mono font-semibold">{stats.lines}</span></p>
            <p>{s.readingTime.replace('{n}', String(stats.readingMinutes))}</p>
          </div>
        </Section>

        <Section title={s.importExport}>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="size-3.5" />{s.importFile}
                <input type="file" accept=".txt,.md,text/plain" className="hidden" onChange={handleImport} />
              </label>
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}><Download className="size-3.5" />{s.exportFile}</Button>
            <Button size="sm" variant="outline" onClick={copyAll}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copyAll}
            </Button>
          </div>
        </Section>

        <Section title={s.preview}>
          <p className="text-xs text-muted-foreground">{s.previewHint}</p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs">
              <input type="checkbox" checked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} />
              {s.showPreview}
            </label>
            {showPreview && (
              <select value={previewLang} onChange={(e) => setPreviewLang(e.target.value)} className="rounded-md border bg-background px-2 py-1 text-xs">
                {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            )}
          </div>
          {showPreview && (
            <div className="max-h-80 overflow-auto rounded-md border text-xs [&_pre]:m-0 [&_pre]:p-3" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          )}
        </Section>

        <Section title={s.howItWorks}>
          <p className="text-xs text-muted-foreground">{s.howItWorksBody}</p>
        </Section>
      </div>
    </div>
  )
}
