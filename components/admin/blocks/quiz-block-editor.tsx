'use client'

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type { QuizQuestion } from '@/lib/types'

// mode 'full': English editor — add/remove/reorder questions and options,
// pick the correct answer. mode 'translate': Bengali — text only; the
// structure (question ids, option count, correct answer) is locked to
// English, and lib/admin/translation.ts enforces that again on save.
export function QuizBlockEditor({
  questions,
  onChange,
  mode = 'full',
}: {
  questions: QuizQuestion[]
  onChange: (patch: { questions: QuizQuestion[] }) => void
  mode?: 'full' | 'translate'
}) {
  const full = mode === 'full'

  function update(qi: number, patch: Partial<QuizQuestion>) {
    onChange({ questions: questions.map((q, i) => (i === qi ? { ...q, ...patch } : q)) })
  }

  function move(qi: number, dir: -1 | 1) {
    const next = [...questions]
    const [q] = next.splice(qi, 1)
    next.splice(qi + dir, 0, q)
    onChange({ questions: next })
  }

  function removeOption(qi: number, oi: number) {
    const q = questions[qi]
    const options = q.options.filter((_, i) => i !== oi)
    // Keep the same option marked correct after the list shifts.
    const answer = oi === q.answer ? 0 : oi < q.answer ? q.answer - 1 : q.answer
    update(qi, { options, answer })
  }

  return (
    <div className="space-y-3 rounded-md border p-3">
      {full && (
        <p className="text-xs text-muted-foreground">
          One correct answer per question (2 options = true/false). Text fields accept simple HTML: <code>&lt;code&gt;</code>,{' '}
          <code>&lt;pre&gt;&lt;code&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;strong&gt;</code>. Pass mark is 70%.
        </p>
      )}
      {questions.map((q, qi) => (
        <div key={q.id} className="space-y-2 rounded-md border bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Question {qi + 1}</span>
            {full && (
              <div className="ml-auto flex items-center gap-1">
                <IconButton label="Move up" disabled={qi === 0} onClick={() => move(qi, -1)}>
                  <ArrowUp className="size-3.5" />
                </IconButton>
                <IconButton label="Move down" disabled={qi === questions.length - 1} onClick={() => move(qi, 1)}>
                  <ArrowDown className="size-3.5" />
                </IconButton>
                <IconButton
                  label="Delete question"
                  disabled={questions.length === 1}
                  onClick={() => onChange({ questions: questions.filter((_, i) => i !== qi) })}
                >
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
            )}
          </div>
          <textarea
            value={q.prompt}
            onChange={(e) => update(qi, { prompt: e.target.value })}
            placeholder="Question"
            rows={2}
            className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
          />
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                {full ? (
                  <input
                    type="radio"
                    name={`answer-${q.id}`}
                    checked={q.answer === oi}
                    onChange={() => update(qi, { answer: oi })}
                    aria-label={`Option ${String.fromCharCode(65 + oi)} is correct`}
                    title="Correct answer"
                  />
                ) : (
                  <span className="w-4 text-center text-xs text-emerald-600">{q.answer === oi ? '✓' : ''}</span>
                )}
                <span className="w-4 text-xs font-semibold text-muted-foreground">{String.fromCharCode(65 + oi)}</span>
                <input
                  value={opt}
                  onChange={(e) => update(qi, { options: q.options.map((o, i) => (i === oi ? e.target.value : o)) })}
                  placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                  className="flex-1 rounded-md border bg-background px-2 py-1 font-mono text-sm"
                />
                {full && (
                  <IconButton label="Remove option" disabled={q.options.length <= 2} onClick={() => removeOption(qi, oi)}>
                    <Trash2 className="size-3.5" />
                  </IconButton>
                )}
              </div>
            ))}
            {full && q.options.length < 6 && (
              <button
                type="button"
                onClick={() => update(qi, { options: [...q.options, ''] })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-3" /> Add option
              </button>
            )}
          </div>
          <input
            value={q.explain ?? ''}
            onChange={(e) => update(qi, { explain: e.target.value || undefined })}
            placeholder="Explanation shown after answering (optional)"
            className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
          />
        </div>
      ))}
      {full && (
        <button
          type="button"
          onClick={() => onChange({ questions: [...questions, newQuestion()] })}
          className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
        >
          <Plus className="size-3" /> Add question
        </button>
      )}
    </div>
  )
}

export function newQuestion(): QuizQuestion {
  return { id: crypto.randomUUID(), prompt: '', options: ['', '', '', ''], answer: 0 }
}

function IconButton({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}
