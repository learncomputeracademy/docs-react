// Recursion Visualizer's own logic. Same house-rule tension as the Event
// Loop Visualizer (D-97): no JS API exposes the engine's real call stack,
// so this can't "measure" it the usual way. Same honest resolution too —
// run real code for real inside a sandboxed iframe (lib/tryit.ts's
// sandbox="allow-scripts" pattern) — but scoped down deliberately:
// arguments and return values (the actual pedagogical point of recursion)
// can't be recovered from Error().stack alone, only function names can.
// Getting real arguments/return values requires the traced function to be
// wrapped explicitly with the trace() helper below — so this tool ships
// as curated presets (all correctly wrapped) with an adjustable input,
// plus an "edit the code" escape hatch for anyone who follows the same
// wrapping convention, rather than pretending to auto-instrument
// arbitrary free-form code the way the Event Loop Visualizer does.

export type TraceEventType = 'call' | 'return' | 'error'

export interface TraceEvent {
  seq: number
  type: TraceEventType
  id: number
  name: string
  args?: unknown[]
  result?: unknown
  text?: string
}

export function buildRecursionDoc(code: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body><script>
(function () {
  var events = [];
  var frameSeq = 0;
  function trace(name, fn) {
    return function () {
      if (frameSeq > 3000) throw new Error('Stopped: too many recursive calls (missing base case?)');
      var id = ++frameSeq;
      var args = Array.prototype.slice.call(arguments);
      events.push({ seq: events.length, type: 'call', id: id, name: name, args: args });
      try {
        var result = fn.apply(this, arguments);
        events.push({ seq: events.length, type: 'return', id: id, name: name, args: args, result: result });
        return result;
      } catch (err) {
        events.push({ seq: events.length, type: 'error', id: id, name: name, text: String((err && err.message) || err) });
        throw err;
      }
    };
  }
  try {
${code}
  } catch (err) {
    events.push({ seq: events.length, type: 'error', id: 0, name: '', text: String((err && err.message) || err) });
  }
  parent.postMessage({ source: 'recursion', events: events }, '*');
})();
<\/script></body></html>`
}

export interface StackFrame { id: number; name: string; args: unknown[] }
export interface LogEntry { seq: number; text: string }
export interface VisualState {
  callStack: StackFrame[]
  log: LogEntry[]
  maxDepth: number
  totalCalls: number
  errors: string[]
}

function formatValue(v: unknown): string {
  if (typeof v === 'string') return JSON.stringify(v)
  if (v === undefined) return 'undefined'
  try { return JSON.stringify(v) } catch { return String(v) }
}
function formatArgs(args: unknown[]): string {
  return args.map(formatValue).join(', ')
}

export function deriveState(events: TraceEvent[], upToIndex: number): VisualState {
  const stack: StackFrame[] = []
  const log: LogEntry[] = []
  const errors: string[] = []
  let maxDepth = 0
  let totalCalls = 0
  for (let i = 0; i <= upToIndex && i < events.length; i++) {
    const e = events[i]
    if (e.type === 'call') {
      stack.push({ id: e.id, name: e.name, args: e.args ?? [] })
      totalCalls++
      maxDepth = Math.max(maxDepth, stack.length)
    } else if (e.type === 'return') {
      // Calls and returns are always strictly nested in synchronous code —
      // the frame returning is always the one on top, so a plain pop is
      // correct, not an approximation (even for fibonacci's branching).
      const frame = stack.pop()
      const argsStr = formatArgs(frame?.args ?? [])
      log.push({ seq: e.seq, text: `${e.name}(${argsStr}) → ${formatValue(e.result)}` })
    } else if (e.type === 'error') {
      errors.push(e.text ?? '')
    }
  }
  return { callStack: stack, log, maxDepth, totalCalls, errors }
}

export function frameLabel(f: StackFrame): string {
  return `${f.name}(${formatArgs(f.args)})`
}

export type PresetId = 'sum' | 'factorial' | 'fibonacci'
export interface Preset {
  id: PresetId
  label: string
  minN: number
  maxN: number
  defaultN: number
  buildCode: (n: number) => string
}

export const PRESETS: Preset[] = [
  {
    id: 'sum',
    label: 'Sum 1..n',
    minN: 1, maxN: 12, defaultN: 5,
    buildCode: (n) => `let sumTo;
sumTo = trace('sumTo', function (n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
});
sumTo(${n});`,
  },
  {
    id: 'factorial',
    label: 'Factorial',
    minN: 1, maxN: 10, defaultN: 5,
    buildCode: (n) => `let factorial;
factorial = trace('factorial', function (n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});
factorial(${n});`,
  },
  {
    id: 'fibonacci',
    label: 'Fibonacci',
    minN: 1, maxN: 8, defaultN: 5,
    buildCode: (n) => `let fib;
fib = trace('fib', function (n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});
fib(${n});`,
  },
]
