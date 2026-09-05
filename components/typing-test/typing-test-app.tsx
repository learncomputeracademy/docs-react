'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { RotateCcw, Volume2, VolumeX, Trash2, Download, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl, Slider } from '@/components/tools/tool-controls'
import { WpmGraph } from '@/components/typing-test/wpm-graph'
import { KeyboardHeatmap } from '@/components/typing-test/keyboard-heatmap'
import { tts } from '@/lib/typing-test-i18n'
import { pickWords, pickQuote, pickWeakKeyWords } from '@/lib/typing-test-content'
import { downloadResultImage } from '@/lib/typing-test-share-image'
import {
  DEFAULT_CONFIG, decorateWords, calculateWpm, calculateRawWpm, calculateAccuracy, calculateConsistency,
  loadHistory, saveHistoryEntry, personalBest, wordCells,
  loadKeyErrorStats, recordKeyErrors, topWeakKeys, hasEnoughDataForWeakKeyMode,
  loadSettings, saveSettings, DEFAULT_SETTINGS, ACCENT_THEMES, ACCENT_FOREGROUND,
  type TestConfig, type Mode, type Difficulty, type CharStatus, type HistoryEntry, type AccentTheme,
} from '@/lib/typing-test-engine'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'running' | 'finished'

// Tiny Web Audio beep — no audio asset, no new dependency, matches the
// "reuse before adding" ladder. A fresh AudioContext per keystroke is
// wasteful; one is created lazily on first use and reused.
let audioCtx: AudioContext | null = null
function beep() {
  try {
    audioCtx ??= new AudioContext()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.frequency.value = 600
    gain.gain.value = 0.03
    osc.connect(gain).connect(audioCtx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05)
    osc.stop(audioCtx.currentTime + 0.05)
  } catch {
    // Audio can fail (autoplay policy before any user gesture) — silently skip
  }
}

const accentLabels: Record<AccentTheme, string> = { orange: 'Orange', blue: 'Blue', green: 'Green', purple: 'Purple' }

function labelFor(config: TestConfig): string {
  if (config.mode === 'time') return config.unlimited ? 'unlimited' : `${config.duration}s`
  if (config.mode === 'words') return `${config.wordCount}w`
  if (config.mode === 'quote') return `quote-${config.quoteLength}`
  return config.mode
}

export function TypingTestApp({ locale }: { locale: Locale }) {
  const s = tts(locale)

  const [config, setConfig] = useState<TestConfig>(DEFAULT_CONFIG)
  const [customText, setCustomText] = useState('')
  const [customStarted, setCustomStarted] = useState(false)

  // Deterministic empty default — the real word list only gets generated in
  // a client-only useEffect below. Math.random() inside a useState lazy
  // initializer runs once during SSR and again, independently, during the
  // client's hydration render, producing two different word lists for what
  // must be the same first render (the exact hydration-mismatch gotcha
  // already documented and fixed on the Lorem Ipsum Generator, D-87).
  const [words, setWords] = useState<string[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [typedWords, setTypedWords] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState('')

  const [status, setStatus] = useState<Status>('idle')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const [wpmHistory, setWpmHistory] = useState<{ t: number; wpm: number }[]>([])
  const [result, setResult] = useState<ReturnType<typeof buildResult> | null>(null)
  const [failed, setFailed] = useState(false)
  const [bestWasNew, setBestWasNew] = useState(false)

  const [history, setHistory] = useState<HistoryEntry[]>([])
  // Deterministic defaults on both server and client's first render, same
  // hydration-safety shape as the word list above — the real persisted
  // values only get loaded in the client-only effect below.
  const [soundOn, setSoundOn] = useState(DEFAULT_SETTINGS.soundOn)
  const [smoothCaret, setSmoothCaret] = useState(DEFAULT_SETTINGS.smoothCaret)
  const [fontSize, setFontSize] = useState(DEFAULT_SETTINGS.fontSize)
  const [focusMode, setFocusMode] = useState(DEFAULT_SETTINGS.focusMode)
  // Real bug fix: the typing text's "not yet typed" color is a low-opacity
  // muted gray by default, which can wash out depending on monitor/theme —
  // user-reported "sometimes it may not be visible." null means "use the
  // theme default"; a chosen hex overrides it via inline style.
  const [pendingColor, setPendingColor] = useState<string | null>(DEFAULT_SETTINGS.pendingColor)
  const [typedColor, setTypedColor] = useState<string | null>(DEFAULT_SETTINGS.typedColor)
  const [accent, setAccent] = useState<AccentTheme>(DEFAULT_SETTINGS.accent)
  const [isDark, setIsDark] = useState(false)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const activeWordRef = useRef<HTMLSpanElement>(null)
  const [weakKeyStats, setWeakKeyStats] = useState<Record<string, number>>({})
  const [customDurationInput, setCustomDurationInput] = useState('45')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setHistory(loadHistory())
    setWeakKeyStats(loadKeyErrorStats())
    const s = loadSettings()
    setSoundOn(s.soundOn)
    setSmoothCaret(s.smoothCaret)
    setFontSize(s.fontSize)
    setFocusMode(s.focusMode)
    setPendingColor(s.pendingColor)
    setTypedColor(s.typedColor)
    setAccent(s.accent)
    setSettingsLoaded(true)
    resetTest(config)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!settingsLoaded) return // don't clobber the persisted values with defaults while they're still loading
    saveSettings({ soundOn, smoothCaret, fontSize, focusMode, pendingColor, typedColor, accent })
  }, [settingsLoaded, soundOn, smoothCaret, fontSize, focusMode, pendingColor, typedColor, accent])

  // Same dark-mode-detection shape as the Clamp tool (docs/TOOLS.md) — the
  // accent theme swaps the CSS custom property inline, so it needs to know
  // which of the light/dark oklch values to use, and the site's own theme
  // toggle doesn't re-render this component on its own.
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // The active word's own highlighted background is the "word-by-word
  // transition" — scrolling it into view (smoothly, unless motion is
  // already off via the caret setting) as wordIndex advances is what keeps
  // the monkeytype-style capped-height text view (below) always showing
  // the current word rather than snapping.
  useEffect(() => {
    activeWordRef.current?.scrollIntoView({ block: 'center', behavior: smoothCaret ? 'smooth' : 'auto' })
  }, [wordIndex, smoothCaret])

  const isZen = config.mode === 'zen'
  const targetIsFixed = config.mode === 'words' || config.mode === 'quote' || config.mode === 'custom' || config.mode === 'weakkeys'
  const isUnlimitedTime = config.mode === 'time' && config.unlimited

  function buildResult(): {
    wpm: number; rawWpm: number; accuracy: number; consistency: number
    correctChars: number; incorrectChars: number; extraChars: number; missedChars: number
    timeSeconds: number; errorsByChar: Record<string, number>
  } {
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0.001
    let correct = 0, incorrect = 0, extra = 0, missed = 0
    const errorsByChar: Record<string, number> = {}

    const allCommitted = [...typedWords]
    if (currentInput.length > 0 || wordIndex < words.length) allCommitted[wordIndex] = currentInput

    for (let i = 0; i < allCommitted.length; i++) {
      const target = words[i] ?? ''
      const typed = allCommitted[i] ?? ''
      for (const cell of wordCells(target, typed)) {
        if (cell.status === 'correct') correct++
        else if (cell.status === 'incorrect') {
          incorrect++
          const k = cell.char.toLowerCase()
          if (/[a-z]/.test(k)) errorsByChar[k] = (errorsByChar[k] ?? 0) + 1
        } else if (cell.status === 'extra') extra++
      }
      if (i === wordIndex && typed.length < target.length) missed += target.length - typed.length
      if (i < wordIndex) correct += 1 // the space between committed words counts as a correct char typed
    }

    const wpm = isZen ? calculateRawWpm(correct + incorrect + extra, elapsed) : calculateWpm(correct, elapsed)
    const rawWpm = calculateRawWpm(correct + incorrect + extra, elapsed)
    const accuracy = isZen ? 100 : calculateAccuracy(correct, correct + incorrect)
    const consistency = calculateConsistency(wpmHistory.map((h) => h.wpm))

    return { wpm, rawWpm, accuracy, consistency, correctChars: correct, incorrectChars: incorrect, extraChars: extra, missedChars: missed, timeSeconds: Math.round(elapsed), errorsByChar }
  }

  function endTest(didFail = false) {
    const r = buildResult()
    setResult(r)
    setFailed(didFail)
    setStatus('finished')
    const label = labelFor(config)
    const prevBest = personalBest(history, config.mode, label)
    const entry: HistoryEntry = { date: Date.now(), mode: config.mode, label, wpm: r.wpm, accuracy: r.accuracy, consistency: r.consistency }
    setHistory(saveHistoryEntry(entry))
    setBestWasNew(!didFail && prevBest !== null && r.wpm > prevBest)
    if (!isZen && Object.keys(r.errorsByChar).length > 0) setWeakKeyStats(recordKeyErrors(r.errorsByChar))
  }

  // buildResult/endTest close over wordIndex/typedWords/currentInput (and
  // more) via plain function scope, so they're recreated fresh every
  // render — but the ticking setInterval below is only set up once per
  // 'running' session (it intentionally doesn't restart on every keystroke,
  // or the tick would drift). Left alone, its callback would keep calling
  // the *one* buildResult/endTest closure captured the instant the effect
  // ran, frozen at whatever wordIndex/currentInput existed at that exact
  // moment — a real, caught-live bug: results and every WPM-graph sample
  // came out computed from the very first keystroke's state, not the
  // current one, 30 seconds of typing later. Refs updated every render are
  // the standard fix: the interval reads `.current`, which is always the
  // latest closure, without needing to restart the interval itself.
  const buildResultRef = useRef(buildResult)
  buildResultRef.current = buildResult
  const endTestRef = useRef(endTest)
  endTestRef.current = endTest

  // Live timer / time-mode expiry / WPM sampling
  useEffect(() => {
    if (status !== 'running' || !startTime) return
    const id = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      setNow(elapsed)
      if (config.mode === 'time' && !config.unlimited && elapsed >= config.duration) {
        endTestRef.current()
        return
      }
      const r = buildResultRef.current()
      setWpmHistory((prev) => [...prev, { t: Math.round(elapsed), wpm: r.wpm }])
    }, 1000)
    return () => clearInterval(id)
  }, [status, startTime, config.mode, config.duration, config.unlimited])

  function resetTest(newConfig: TestConfig = config) {
    setStatus('idle')
    setStartTime(null)
    setNow(0)
    setWpmHistory([])
    setResult(null)
    setFailed(false)
    setBestWasNew(false)
    setWordIndex(0)
    setTypedWords([])
    setCurrentInput('')
    setCustomStarted(false)

    if (newConfig.mode === 'time') {
      const wordBudget = newConfig.unlimited ? 3000 : Math.max(200, newConfig.duration * 3)
      setWords(decorateWords(pickWords(wordBudget), newConfig.punctuation, newConfig.numbers))
    }
    else if (newConfig.mode === 'words') setWords(decorateWords(pickWords(newConfig.wordCount), newConfig.punctuation, newConfig.numbers))
    else if (newConfig.mode === 'quote') setWords(pickQuote(newConfig.quoteLength).text.split(' '))
    else if (newConfig.mode === 'custom') setWords(customText.trim().split(/\s+/).filter(Boolean))
    else if (newConfig.mode === 'weakkeys') setWords(pickWeakKeyWords(newConfig.wordCount, topWeakKeys(weakKeyStats)))
    else setWords([])

    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function updateConfig(patch: Partial<TestConfig>) {
    const next = { ...config, ...patch }
    setConfig(next)
    resetTest(next)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab') { e.preventDefault(); resetTest(); return }
    if (status === 'finished') return

    if (isZen) {
      if (e.key === 'Enter') { e.preventDefault(); if (status === 'running') endTest() }
      return // zen mode: let the textarea-like input handle everything else via onChange
    }

    if (isUnlimitedTime && e.key === 'Enter') { e.preventDefault(); if (status === 'running') endTest(); return }

    if (e.key === 'Backspace') {
      e.preventDefault()
      if (config.difficulty === 'master') return // no correcting in Master
      if (currentInput.length > 0) {
        setCurrentInput((v) => v.slice(0, -1))
      } else if (wordIndex > 0) {
        const prevWord = typedWords[wordIndex - 1] ?? ''
        setWordIndex((i) => i - 1)
        setCurrentInput(prevWord)
        setTypedWords((tw) => tw.slice(0, -1))
      }
      return
    }

    if (e.key === ' ') {
      e.preventDefault()
      if (currentInput.length === 0) return
      commitWord()
      return
    }

    if (e.key.length !== 1) return // ignore modifier/arrow/etc keys

    if (status === 'idle') {
      setStatus('running')
      setStartTime(Date.now())
    }

    if (soundOn) beep()

    const target = words[wordIndex] ?? ''
    const nextChar = e.key
    if ((config.difficulty === 'expert' || config.difficulty === 'master') && currentInput.length < target.length && target[currentInput.length] !== nextChar) {
      e.preventDefault()
      setCurrentInput((v) => v + nextChar)
      endTest(true)
      return
    }

    setCurrentInput((v) => v + nextChar)

    // words/quote/custom modes end once the final word is fully typed —
    // no trailing space required, matching how these tools normally end.
    if (targetIsFixed && wordIndex === words.length - 1 && currentInput.length + 1 >= target.length) {
      setTimeout(() => endTest(), 0)
    }
  }

  function commitWord() {
    setTypedWords((tw) => {
      const next = [...tw]
      next[wordIndex] = currentInput
      return next
    })
    setWordIndex((i) => i + 1)
    setCurrentInput('')
  }

  function handleZenChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (status === 'idle') { setStatus('running'); setStartTime(Date.now()) }
    setCurrentInput(e.target.value)
  }

  const elapsedDisplay = Math.max(0, Math.round(config.mode === 'time' && !config.unlimited ? config.duration - now : now))

  const showConfig = status !== 'running'
  const inFocus = focusMode && status === 'running'

  const canUseWeakKeys = hasEnoughDataForWeakKeyMode(weakKeyStats)
  const accentVars = { '--primary': ACCENT_THEMES[accent][isDark ? 'dark' : 'light'], '--primary-foreground': ACCENT_FOREGROUND[isDark ? 'dark' : 'light'] } as React.CSSProperties

  return (
    <div style={accentVars} className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-8 lg:px-12">
      {!inFocus && (
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
          <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">{s.contentNote}</p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href={locale === 'bn' ? '/bn/typing-test/lessons' : '/typing-test/lessons'}>
              <GraduationCap className="size-3.5" /> {s.lessonsCta}
            </Link>
          </Button>
        </header>
      )}

      {showConfig && (
        <div className="mx-auto mt-6 flex w-full max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <SegmentedControl
            value={config.mode}
            onChange={(m: Mode) => updateConfig({ mode: m })}
            options={[
              { value: 'time', label: s.modeTime }, { value: 'words', label: s.modeWords },
              { value: 'quote', label: s.modeQuote }, { value: 'zen', label: s.modeZen },
              { value: 'custom', label: s.modeCustom },
              ...(canUseWeakKeys ? [{ value: 'weakkeys' as Mode, label: s.modeWeakKeys }] : []),
            ]}
          />
          {!canUseWeakKeys && <span className="text-xs text-muted-foreground" title={s.weakKeysNotEnoughData}>{s.modeWeakKeys} 🔒</span>}

          {config.mode === 'time' && (
            <div className="flex items-center gap-2">
              <SegmentedControl
                value={config.unlimited ? 'unlimited' : String(config.duration)}
                onChange={(v) => v === 'unlimited' ? updateConfig({ unlimited: true }) : updateConfig({ duration: Number(v), unlimited: false })}
                options={[...[15, 30, 60, 120].map((n) => ({ value: String(n), label: `${n}s` })), { value: 'unlimited', label: '∞' }]}
              />
              <input
                type="number"
                min={5}
                max={3600}
                value={customDurationInput}
                onChange={(e) => setCustomDurationInput(e.target.value)}
                onBlur={() => { const n = Number(customDurationInput); if (n >= 5 && n <= 3600) updateConfig({ duration: n, unlimited: false }) }}
                title={s.customDurationLabel}
                className="w-16 rounded-md border bg-background px-2 py-1 text-xs"
              />
            </div>
          )}
          {config.mode === 'weakkeys' && (
            <span className="max-w-xs text-xs text-muted-foreground">{s.weakKeysHint}</span>
          )}
          {(config.mode === 'words' || config.mode === 'weakkeys') && (
            <SegmentedControl value={String(config.wordCount)} onChange={(v) => updateConfig({ wordCount: Number(v) })} options={[10, 25, 50, 100].map((n) => ({ value: String(n), label: String(n) }))} />
          )}
          {config.mode === 'quote' && (
            <SegmentedControl value={config.quoteLength} onChange={(v) => updateConfig({ quoteLength: v })} options={[{ value: 'short', label: 'Short' }, { value: 'medium', label: 'Medium' }, { value: 'long', label: 'Long' }]} />
          )}

          {(config.mode === 'time' || config.mode === 'words') && (
            <div className="flex items-center gap-3 border-l pl-6 text-xs">
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={config.punctuation} onChange={(e) => updateConfig({ punctuation: e.target.checked })} />{s.punctuation}</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={config.numbers} onChange={(e) => updateConfig({ numbers: e.target.checked })} />{s.numbers}</label>
            </div>
          )}

          <div className="flex items-center gap-2 border-l pl-6">
            <span className="text-xs text-muted-foreground" title={config.difficulty === 'normal' ? s.difficultyNormalHint : config.difficulty === 'expert' ? s.difficultyExpertHint : s.difficultyMasterHint}>
              {s.difficulty}
            </span>
            <SegmentedControl
              value={config.difficulty}
              onChange={(d: Difficulty) => updateConfig({ difficulty: d })}
              options={[{ value: 'normal', label: s.difficultyNormal }, { value: 'expert', label: s.difficultyExpert }, { value: 'master', label: s.difficultyMaster }]}
            />
          </div>
        </div>
      )}
      {showConfig && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {config.difficulty === 'normal' ? s.difficultyNormalHint : config.difficulty === 'expert' ? s.difficultyExpertHint : s.difficultyMasterHint}
        </p>
      )}

      {config.mode === 'custom' && !customStarted && status === 'idle' && (
        <div className="mx-auto mt-6 max-w-3xl space-y-2">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste or type the text you want to practice…"
            rows={4}
            className="w-full resize-none rounded-md border bg-background p-3 text-sm"
          />
          <Button
            size="sm"
            disabled={customText.trim().length === 0}
            onClick={() => { setCustomStarted(true); resetTest(config) }}
          >
            Start
          </Button>
        </div>
      )}

      {(config.mode !== 'custom' || customStarted) && (
        <div className="mx-auto mt-8 max-w-4xl">
          {!isZen && status !== 'finished' && (
            <div className="mb-3 flex items-center justify-center gap-4 font-mono text-sm text-muted-foreground">
              <span>{config.mode === 'time' ? elapsedDisplay : `${wordIndex}/${words.length}`} {config.mode === 'time' ? s.timeLive : s.wordsLive}</span>
              {isUnlimitedTime && status === 'running' && <span className="text-xs">{s.unlimitedHint}</span>}
            </div>
          )}

          {status !== 'finished' && (
            <div className="relative" onClick={() => inputRef.current?.focus()}>
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={isZen ? currentInput : currentInput}
                onKeyDown={handleKeyDown}
                onChange={isZen ? handleZenChange : () => {}}
                onPaste={(e) => e.preventDefault()}
                className="absolute inset-0 h-1 w-1 opacity-0"
                aria-label="typing input"
              />
              {isZen ? (
                <p style={{ fontSize, color: typedColor ?? undefined }} className={cn('min-h-32 whitespace-pre-wrap break-words font-mono leading-relaxed', smoothCaret && 'transition-all')}>
                  {currentInput}
                  <span className="animate-pulse border-l-2 border-primary" />
                </p>
              ) : (
                // Capped-height, overflow-hidden viewport onto the word
                // stream — real complaint fixed: with a long/unlimited
                // duration this used to render every one of a 3000-word
                // batch inline, making the whole page absurdly tall. ~5.5
                // lines are visible; the active-word effect above scrolls
                // the container (overflow:hidden still allows programmatic/
                // scrollIntoView scrolling, it just hides the scrollbar and
                // blocks manual wheel-scroll) to keep the current word in
                // view as it advances, monkeytype-style. The bottom ~30% is
                // masked to a fade via CSS mask-image (not an actual blur()
                // filter, which would need a second layered element — a
                // gradient fade reads as the same "floating up and
                // dissolving" effect and is the standard, cheap technique
                // for it) so the last line or two visually dissolves
                // instead of ending on a hard-cut edge.
                <div
                  ref={textContainerRef}
                  style={{
                    maxHeight: fontSize * 1.625 * 5.5,
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                  }}
                  className="overflow-hidden"
                >
                <p style={{ fontSize }} className="flex flex-wrap gap-x-[0.5ch] gap-y-1.5 font-mono leading-relaxed">
                  {words.map((w, wi) => {
                    if (wi < wordIndex - 3 && config.mode === 'time') return null // trim far-scrolled-past words for perf
                    const typed = wi === wordIndex ? currentInput : (typedWords[wi] ?? '')
                    const cells = wi <= wordIndex ? wordCells(w, typed) : w.split('').map((c) => ({ char: c, status: 'pending' as CharStatus }))
                    // The caret sits at the boundary between typed and
                    // untyped characters — index `currentInput.length` into
                    // this word's cells, not after the whole word. (Real bug,
                    // caught by the user: it previously rendered after every
                    // cell unconditionally, so it always looked like it was
                    // parked at the end of the word regardless of where you
                    // actually were in it.)
                    const caretPos = wi === wordIndex ? currentInput.length : -1
                    const caret = (
                      <span
                        className={cn(
                          'inline-block w-0.5 h-[1.2em] align-middle bg-primary rounded-full',
                          smoothCaret ? 'transition-all duration-100' : 'animate-pulse'
                        )}
                      />
                    )
                    return (
                      <span
                        key={wi}
                        ref={wi === wordIndex ? activeWordRef : undefined}
                        className={cn(
                          'relative rounded px-0.5 transition-colors duration-300',
                          wi === wordIndex && status === 'running' && 'bg-primary/10'
                        )}
                      >
                        {cells.map((cell, ci) => (
                          <span key={ci} className="inline-flex items-center">
                            {ci === caretPos && caret}
                            <span
                              style={
                                cell.status === 'correct' && typedColor ? { color: typedColor }
                                : cell.status === 'pending' && pendingColor ? { color: pendingColor }
                                : undefined
                              }
                              className={cn(
                                cell.status === 'correct' && !typedColor && 'text-foreground',
                                cell.status === 'incorrect' && 'text-destructive underline decoration-destructive',
                                cell.status === 'extra' && 'text-destructive/70',
                                cell.status === 'pending' && !pendingColor && 'text-muted-foreground/50'
                              )}
                            >
                              {cell.char}
                            </span>
                          </span>
                        ))}
                        {caretPos >= cells.length && caret}
                      </span>
                    )
                  })}
                </p>
                </div>
              )}
            </div>
          )}

          {status !== 'finished' && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => resetTest()}>
                <RotateCcw className="size-3.5" /> {s.restart}
              </Button>
            </div>
          )}
          {status === 'idle' && <p className="mt-2 text-center text-xs text-muted-foreground">{isZen ? s.zenEndHint : s.restartHint}</p>}
        </div>
      )}

      {status === 'finished' && result && (
        <div className="mx-auto mt-8 max-w-5xl space-y-4">
          {failed && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {config.difficulty === 'master' ? s.difficultyMasterHint : s.difficultyExpertHint}
            </p>
          )}
          {bestWasNew && <p className="text-center text-sm font-medium text-primary">🎉 {s.newBest}</p>}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label={s.wpm} value={result.wpm} big />
            <StatTile label={s.accuracy} value={`${result.accuracy}%`} big />
            <StatTile label={s.rawWpm} value={result.rawWpm} />
            <StatTile label={s.consistency} value={`${result.consistency}%`} />
          </div>

          <Section title={s.characters}>
            <p className="font-mono text-sm">
              <span className="text-foreground">{result.correctChars}</span> / <span className="text-destructive">{result.incorrectChars}</span> / <span className="text-destructive/70">{result.extraChars}</span> / <span className="text-muted-foreground">{result.missedChars}</span>
            </p>
            <p className="text-xs text-muted-foreground">{s.charsFormat}</p>
          </Section>

          {!isZen && wpmHistory.length > 1 && (
            <Section title={s.wpmOverTime}>
              <WpmGraph samples={wpmHistory} label={s.wpm} />
            </Section>
          )}

          {!isZen && (
            <Section title={s.keyboardHeatmap}>
              <p className="text-xs text-muted-foreground">{s.keyboardHeatmapHint}</p>
              {Object.keys(result.errorsByChar).length > 0 ? <KeyboardHeatmap errorsByChar={result.errorsByChar} /> : <p className="text-sm text-muted-foreground">{s.noErrors}</p>}
            </Section>
          )}

          <div className="flex justify-center gap-2">
            <Button onClick={() => resetTest()}><RotateCcw className="size-3.5" /> {s.restart}</Button>
            <Button
              variant="outline"
              onClick={() => downloadResultImage({ wpm: result.wpm, accuracy: result.accuracy, rawWpm: result.rawWpm, consistency: result.consistency, mode: config.mode, label: labelFor(config) })}
            >
              <Download className="size-3.5" /> {s.shareResult}
            </Button>
          </div>
        </div>
      )}

      {!inFocus && (
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-[1fr_16rem]">
          <Section title={s.history} action={history.length > 0 ? (
            <button type="button" onClick={() => { if (window.confirm(s.historyClearConfirm)) { window.localStorage.removeItem('typing-test-history-v1'); setHistory([]) } }} className="flex items-center gap-1 text-muted-foreground normal-case hover:text-destructive">
              <Trash2 className="size-3" />{s.historyClear}
            </button>
          ) : undefined}>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">{s.historyEmpty}</p>
            ) : (
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {history.slice(0, 15).map((h, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-xs">
                    <span className="text-muted-foreground">{h.mode} · {h.label}</span>
                    <span className="font-mono font-medium">{h.wpm} wpm</span>
                    <span className="font-mono text-muted-foreground">{h.accuracy}%</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title={s.customize}>
            <label className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5">{soundOn ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}{s.soundOnKeypress}</span>
              <input type="checkbox" checked={soundOn} onChange={(e) => setSoundOn(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between text-sm">
              <span>{s.smoothCaret}</span>
              <input type="checkbox" checked={smoothCaret} onChange={(e) => setSmoothCaret(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between text-sm" title={s.focusModeHint}>
              <span>{s.focusMode}</span>
              <input type="checkbox" checked={focusMode} onChange={(e) => setFocusMode(e.target.checked)} />
            </label>
            <Slider label={s.fontSize} value={fontSize} min={14} max={36} step={1} suffix="px" onChange={setFontSize} />

            <div className="space-y-1.5 border-t pt-2">
              <span className="text-sm">{s.accentTheme}</span>
              <div className="flex gap-2">
                {(Object.keys(ACCENT_THEMES) as AccentTheme[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    title={accentLabels[a]}
                    onClick={() => setAccent(a)}
                    style={{ backgroundColor: ACCENT_THEMES[a][isDark ? 'dark' : 'light'] }}
                    className={cn('size-7 rounded-full border-2 transition-transform', accent === a ? 'scale-110 border-foreground' : 'border-transparent hover:scale-105')}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5 border-t pt-2">
              <div className="flex items-center justify-between text-sm">
                <span>{s.pendingTextColor}</span>
                <input type="color" value={pendingColor ?? '#8a8a8a'} onChange={(e) => setPendingColor(e.target.value)} className="h-6 w-9 cursor-pointer rounded border bg-background" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>{s.typedTextColor}</span>
                <input type="color" value={typedColor ?? '#fafafa'} onChange={(e) => setTypedColor(e.target.value)} className="h-6 w-9 cursor-pointer rounded border bg-background" />
              </div>
              {(pendingColor || typedColor) && (
                <button type="button" onClick={() => { setPendingColor(null); setTypedColor(null) }} className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                  {s.resetColors}
                </button>
              )}
              <p className="text-xs text-muted-foreground">{s.textColorHint}</p>
            </div>

            <p className="pt-1 text-xs text-muted-foreground">{s.localOnlyNote}</p>
          </Section>
        </div>
      )}
    </div>
  )
}

function StatTile({ label, value, big }: { label: string; value: string | number; big?: boolean }) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <div className={cn('font-mono font-bold', big ? 'text-3xl text-primary' : 'text-xl')}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
