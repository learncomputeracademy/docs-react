// Call Stack + Event Loop Visualizer's own logic. The one house rule this
// tool can't literally follow is #4 ("real CSS/JS on real elements, never
// simulate") in the usual sense — there is no JS API that exposes the
// engine's actual call stack or task/microtask queues, so nothing can
// "measure" them the way getBoundingClientRect measures layout. The
// honest middle ground, and what every real event-loop visualizer
// (Philip Roberts' loupe included) actually does: run the REAL code with
// REAL setTimeout/Promise scheduling inside a sandboxed iframe (the exact
// sandbox="allow-scripts" srcdoc pattern lib/tryit.ts already uses),
// instrument the handful of APIs that matter, and read the call stack via
// `new Error().stack` — a real, engine-provided value, not invented. The
// *ordering* and *timing* in the resulting trace are 100% real; only the
// "waiting in a queue" box durations are an illustrative rendering of
// that real trace, since JS genuinely cannot observe what's sitting in
// the browser's internal queues, only when things start and stop running.

export type TraceEventType =
  | 'script-start' | 'script-sync-end' | 'log' | 'error'
  | 'timer-queued' | 'timer-fire-start' | 'timer-fire-end'
  | 'microtask-queued' | 'microtask-run-start' | 'microtask-run-end'

export interface TraceEvent {
  seq: number
  t: number // ms since script start, real (performance.now()-based)
  type: TraceEventType
  stack: string[] // real call stack at this instant, via Error().stack
  text?: string
  id?: number
  label?: string
  delay?: number
}

export function buildEventLoopDoc(code: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body><script>
(function () {
  var seq = 0, timerSeq = 0, promiseSeq = 0;
  var realSetTimeout = window.setTimeout;
  var t0 = performance.now();
  var sentDone = false, quietTimer = null;
  function now() { return Math.round(performance.now() - t0); }

  // Only keeps frames with a real, named function — a bare "at url:line:col"
  // line (V8's rendering of an anonymous/wrapper frame, e.g. this file's own
  // outer IIFE or the <script> tag's own eval context) is dropped entirely
  // rather than mislabelled, since showing "global"/"anonymous" noise isn't
  // the point — the point is the user's own named functions stacking up.
  function frameName(line) {
    var m = line.match(/at\\s+([^\\s(]+)\\s*\\(/); // V8: "at name ("
    if (m) return m[1];
    m = line.match(/^\\s*([^\\s@]+)@/); // Firefox/Safari: "name@url:line:col"
    if (m && m[1]) return m[1];
    return null;
  }
  function captureStack() {
    var raw = (new Error()).stack || '';
    var lines = raw.split('\\n').slice(1);
    var frames = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line || line.indexOf('captureStack') !== -1 || line.indexOf('emit') !== -1) continue;
      var name = frameName(line);
      if (!name || name.indexOf('<anonymous>') !== -1 || name === 'Object.<anonymous>' || name === 'console.log') continue;
      frames.push(name);
    }
    return frames;
  }

  function sendDone() {
    if (sentDone) return;
    sentDone = true;
    parent.postMessage({ source: 'eventloop', done: true }, '*');
  }
  function scheduleQuietDone() {
    if (quietTimer) clearTimeout(quietTimer);
    quietTimer = realSetTimeout(sendDone, 600);
  }
  function emit(type, extra) {
    var ev = Object.assign({ seq: ++seq, t: now(), type: type, stack: captureStack() }, extra || {});
    parent.postMessage({ source: 'eventloop', event: ev }, '*');
    scheduleQuietDone();
  }

  var realLog = console.log.bind(console);
  console.log = function () {
    var text = Array.prototype.slice.call(arguments).map(function (a) {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch (e) { return String(a); }
    }).join(' ');
    emit('log', { text: text });
    realLog.apply(console, arguments);
  };

  window.setTimeout = function (fn, delay) {
    var id = ++timerSeq;
    var label = (fn && fn.name) || 'anonymous';
    var d = delay || 0;
    emit('timer-queued', { id: id, label: label, delay: d });
    return realSetTimeout(function () {
      emit('timer-fire-start', { id: id, label: label });
      try { fn(); } finally { emit('timer-fire-end', { id: id, label: label }); }
    }, Math.min(d, 3000)); // cap so a 5s teaching example doesn't make you wait 5s
  };

  var realThen = Promise.prototype.then;
  Promise.prototype.then = function (onF, onR) {
    var id = ++promiseSeq;
    emit('microtask-queued', { id: id });
    function wrap(cb) {
      if (typeof cb !== 'function') return cb;
      return function (v) {
        emit('microtask-run-start', { id: id });
        try { return cb(v); } finally { emit('microtask-run-end', { id: id }); }
      };
    }
    return realThen.call(this, wrap(onF), wrap(onR));
  };

  if (window.queueMicrotask) {
    var realQM = window.queueMicrotask;
    window.queueMicrotask = function (fn) {
      var id = ++promiseSeq;
      emit('microtask-queued', { id: id });
      return realQM(function () {
        emit('microtask-run-start', { id: id });
        try { fn(); } finally { emit('microtask-run-end', { id: id }); }
      });
    };
  }

  window.onerror = function (msg) { emit('error', { text: String(msg) }); return true; };

  emit('script-start');
  try {
${code}
  } catch (err) {
    emit('error', { text: String((err && err.message) || err) });
  }
  emit('script-sync-end');
  scheduleQuietDone();
  realSetTimeout(sendDone, 4000); // hard cap regardless of stray timers
})();
<\/script></body></html>`
}

export interface QueuedItem { id: number; label: string; delay?: number }
export interface VisualState {
  callStack: string[]
  webApis: QueuedItem[]
  microtaskQueue: QueuedItem[]
  consoleLines: { text: string; seq: number }[]
  errors: string[]
  lastEvent: TraceEvent | null
}

export function deriveState(events: TraceEvent[], upToIndex: number): VisualState {
  const webApis = new Map<number, QueuedItem>()
  const microtaskQueue = new Map<number, QueuedItem>()
  let callStack: string[] = []
  const consoleLines: { text: string; seq: number }[] = []
  const errors: string[] = []
  let lastEvent: TraceEvent | null = null
  for (let i = 0; i <= upToIndex && i < events.length; i++) {
    const e = events[i]
    callStack = e.stack
    lastEvent = e
    if (e.type === 'log') consoleLines.push({ text: e.text ?? '', seq: e.seq })
    if (e.type === 'error') errors.push(e.text ?? '')
    if (e.type === 'timer-queued') webApis.set(e.id!, { id: e.id!, label: e.label ?? 'timer', delay: e.delay })
    if (e.type === 'timer-fire-start') webApis.delete(e.id!)
    if (e.type === 'microtask-queued') microtaskQueue.set(e.id!, { id: e.id!, label: 'then()' })
    if (e.type === 'microtask-run-start') microtaskQueue.delete(e.id!)
  }
  return { callStack, webApis: [...webApis.values()], microtaskQueue: [...microtaskQueue.values()], consoleLines, errors, lastEvent }
}

export interface Preset { id: string; label: string; code: string }
export const PRESETS: Preset[] = [
  {
    id: 'sync',
    label: 'Synchronous calls',
    code: `function first() {
  console.log('first');
  second();
}
function second() {
  console.log('second');
}
first();
console.log('done');`,
  },
  {
    id: 'timeout-order',
    label: 'setTimeout order',
    code: `console.log('start');
setTimeout(function timeoutCallback() {
  console.log('timeout callback');
}, 0);
console.log('end');`,
  },
  {
    id: 'promise-vs-timeout',
    label: 'Promise vs setTimeout',
    code: `console.log('start');
setTimeout(function timeoutCallback() {
  console.log('timeout callback');
}, 0);
Promise.resolve().then(function promiseCallback() {
  console.log('promise callback');
});
console.log('end');`,
  },
  {
    id: 'chained-promises',
    label: 'Chained promises',
    code: `console.log('start');
Promise.resolve()
  .then(function step1() { console.log('step 1'); })
  .then(function step2() { console.log('step 2'); })
  .then(function step3() { console.log('step 3'); });
console.log('end');`,
  },
  {
    id: 'async-await',
    label: 'async / await',
    code: `async function main() {
  console.log('main start');
  await null;
  console.log('main after await');
}
console.log('before main');
main();
console.log('after main call');`,
  },
]
