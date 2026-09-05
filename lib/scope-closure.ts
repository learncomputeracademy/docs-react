// Scope & Closure Visualizer's own logic. A different honesty shape than
// the Call Stack + Event Loop (D-97) and Recursion (D-98) visualizers:
// there is no runtime API that exposes a scope chain or hoisting state —
// unlike a call stack, "which variables exist in which lexical scope" is
// a static property of the source text, not something a running engine
// exposes for introspection, and this project has no JS parser to derive
// it generically (same reasoning D-98 gave for staying preset-only).
// So this tool is presets ONLY, no free-form code — but within a preset,
// everything shown IS real: real code actually runs in a sandboxed
// iframe (same trust model as lib/tryit.ts), and every variable value,
// every console line, and the real ReferenceError text for a
// temporal-dead-zone access are all genuinely captured from that real
// execution via explicit snapshot() calls placed by hand at meaningful
// points in each preset — not invented for the demo. Only the STATIC
// shape (which scope contains which declarations, and what kind) is
// hand-authored metadata, stated plainly in the tool's own UI.

export type DeclKind = 'var' | 'let' | 'const' | 'param' | 'function'
export interface ScopeDecl { name: string; kind: DeclKind }
export type ScopeType = 'global' | 'function' | 'block'
export interface ScopeDef { id: string; type: ScopeType; label: string; decls: ScopeDecl[] }

export interface SnapshotEvent { type: 'snapshot'; seq: number; activeScopes: string[]; vars: Record<string, unknown> }
export interface LogEvent { type: 'log'; seq: number; text: string }
export type TraceEvent = SnapshotEvent | LogEvent

export function buildScopeDoc(code: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body><script>
(function () {
  var events = [];
  var seq = 0;
  var sentDone = false, quietTimer = null;
  var realSetTimeout = window.setTimeout;
  function sendDone() {
    if (sentDone) return;
    sentDone = true;
    parent.postMessage({ source: 'scope', done: true }, '*');
  }
  function scheduleQuietDone() {
    if (quietTimer) clearTimeout(quietTimer);
    quietTimer = realSetTimeout(sendDone, 400);
  }
  function emit(ev) {
    ev.seq = ++seq;
    events.push(ev);
    parent.postMessage({ source: 'scope', event: ev }, '*');
    scheduleQuietDone();
  }
  function snapshot(activeScopes, vars) {
    // postMessage uses structured clone, which can't carry a function value
    // across the iframe boundary at all — replace with a plain, clonable
    // marker before it ever gets there, rather than letting it crash the trace.
    var safeVars = {};
    for (var k in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, k)) {
        safeVars[k] = (typeof vars[k] === 'function') ? { __fn: true } : vars[k];
      }
    }
    emit({ type: 'snapshot', activeScopes: activeScopes, vars: safeVars });
  }
  var realLog = console.log.bind(console);
  console.log = function () {
    var text = Array.prototype.slice.call(arguments).map(function (a) {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch (e) { return String(a); }
    }).join(' ');
    emit({ type: 'log', text: text });
    realLog.apply(console, arguments);
  };
  try {
${code}
  } catch (err) {
    emit({ type: 'log', text: 'Error: ' + String((err && err.message) || err) });
  }
  scheduleQuietDone();
  realSetTimeout(sendDone, 4000);
})();
<\/script></body></html>`
}

export interface ScopeBoxVar { name: string; kind: DeclKind; value: unknown; captured: boolean }
export interface ScopeBox { id: string; type: ScopeType; label: string; vars: ScopeBoxVar[] }
export interface VisualState { scopeBoxes: ScopeBox[]; logLines: { seq: number; text: string }[] }

export function deriveState(events: TraceEvent[], upToIndex: number, scopes: ScopeDef[]): VisualState {
  // Which scopes are active comes from the latest snapshot only (that's a
  // real "what's in view right now" signal), but a variable's value must
  // accumulate across every snapshot seen so far — a preset doesn't
  // re-capture every variable on every single snapshot() call, so trusting
  // only the latest one would make an already-initialised variable look
  // like it fell back into "not yet initialised" the moment a later
  // snapshot happened to omit it. Flat name-keyed accumulation is safe
  // here specifically because no preset below reuses a variable name
  // across two different scopes.
  let activeIds: string[] = []
  const capturedValues: Record<string, unknown> = {}
  const capturedFlags: Record<string, boolean> = {}
  const logLines: { seq: number; text: string }[] = []
  for (let i = 0; i <= upToIndex && i < events.length; i++) {
    const e = events[i]
    if (e.type === 'snapshot') {
      activeIds = e.activeScopes
      for (const k of Object.keys(e.vars)) {
        capturedValues[k] = e.vars[k]
        capturedFlags[k] = true
      }
    } else {
      logLines.push({ seq: e.seq, text: e.text })
    }
  }
  const scopeBoxes: ScopeBox[] = activeIds.map((id) => {
    const def = scopes.find((s) => s.id === id)
    const vars: ScopeBoxVar[] = (def?.decls ?? []).map((d) => ({
      name: d.name,
      kind: d.kind,
      value: capturedFlags[d.name] ? capturedValues[d.name] : undefined,
      captured: !!capturedFlags[d.name],
    }))
    return { id, type: def?.type ?? 'block', label: def?.label ?? id, vars }
  })
  return { scopeBoxes, logLines }
}

export function formatVarValue(v: unknown): string {
  if (v === undefined) return 'undefined' // JSON.stringify(undefined) returns undefined, not a string — would render blank
  if (v && typeof v === 'object' && (v as { __fn?: boolean }).__fn) return 'ƒ()' // sanitized function marker from buildScopeDoc's snapshot()
  if (typeof v === 'string') return JSON.stringify(v)
  if (typeof v === 'function') return 'ƒ()' // safety net — shouldn't normally arrive as a real function post-sanitize
  try { return JSON.stringify(v) } catch { return String(v) }
}

export interface Preset { id: string; label: string; code: string; scopes: ScopeDef[] }

export const PRESETS: Preset[] = [
  {
    id: 'block-vs-function',
    label: 'Block vs function scope',
    scopes: [
      { id: 'global', type: 'global', label: 'Global scope', decls: [{ name: 'x', kind: 'var' }] },
      { id: 'if-block', type: 'block', label: 'if-block scope', decls: [{ name: 'y', kind: 'let' }] },
    ],
    code: `snapshot(['global'], {});
if (true) {
  var x = 1;
  let y = 2;
  console.log('inside the block, x =', x, 'y =', y);
  snapshot(['global', 'if-block'], { x: x, y: y });
}
console.log('outside the block, x =', x);
console.log('y does not exist out here — it only ever lived inside the if-block');
snapshot(['global'], { x: x });`,
  },
  {
    id: 'hoisting',
    label: 'Hoisting (var vs let)',
    scopes: [
      { id: 'global', type: 'global', label: 'Global scope', decls: [{ name: 'a', kind: 'var' }, { name: 'b', kind: 'let' }] },
    ],
    code: `console.log('typeof a before its var declaration:', typeof a);
snapshot(['global'], { a: a });
var a = 5;

var bStatus;
try {
  bStatus = b; // real ReferenceError — b is declared with let below, still in its temporal dead zone
} catch (err) {
  bStatus = err.message;
}
console.log('accessing b before its let declaration:', bStatus);
snapshot(['global'], { a: a });
let b = 10;
console.log('after the let declaration, b =', b);
snapshot(['global'], { a: a, b: b });`,
  },
  {
    id: 'closure-counter',
    label: 'Closures — counter maker',
    scopes: [
      { id: 'global', type: 'global', label: 'Global scope', decls: [{ name: 'counter', kind: 'const' }] },
      { id: 'makeCounter', type: 'function', label: 'makeCounter() scope', decls: [{ name: 'count', kind: 'let' }] },
      { id: 'counterFn', type: 'function', label: 'counterFn() scope (closure)', decls: [] },
    ],
    code: `function makeCounter() {
  let count = 0;
  snapshot(['global', 'makeCounter'], { count: count });
  return function counterFn() {
    count++;
    snapshot(['global', 'makeCounter', 'counterFn'], { count: count });
    return count;
  };
}
const counter = makeCounter();
console.log('makeCounter() already returned — but count is still alive, kept by the closure');
snapshot(['global'], { counter: counter });
console.log('counter() ->', counter());
console.log('counter() ->', counter());
console.log('counter() ->', counter());`,
  },
  {
    id: 'loop-closure',
    label: 'Loop + closure: var vs let',
    scopes: [
      { id: 'global', type: 'global', label: 'Global scope', decls: [] },
      { id: 'for-var', type: 'block', label: 'var loop (one shared i)', decls: [{ name: 'i', kind: 'var' }] },
      { id: 'for-let', type: 'block', label: 'let loop (new j each time)', decls: [{ name: 'j', kind: 'let' }] },
    ],
    code: `console.log('--- var: all three callbacks share ONE i ---');
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    snapshot(['global', 'for-var'], { i: i });
    console.log('var callback sees i =', i);
  }, 0);
}
console.log('--- let: each callback gets its OWN j ---');
for (let j = 0; j < 3; j++) {
  setTimeout(function () {
    snapshot(['global', 'for-let'], { j: j });
    console.log('let callback sees j =', j);
  }, 0);
}`,
  },
]
