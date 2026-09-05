#!/usr/bin/env node
// Extends the existing "React" category (25 lessons, D-63) with 3 more
// lessons covering real gaps found against a roadmap.sh "React" roadmap
// PDF the user shared 2026-09-03 — asked "are all the topics in this pdf
// regarding reactjs covered". That PDF is explicitly an ecosystem/library
// map — nearly every branch labeled "Personal Recommendation," "Alternative
// Option," or "order not strict" (UI kits, state-management libraries,
// routers, testing frameworks, GraphQL clients, animation libraries,
// meta-frameworks, React Native) — consciously optional-by-design, same
// boundary pattern as the WordPress/CSS/PHP gap batches' excluded advanced
// tracks, not gaps.
//
// 3 real gaps found within core React itself, verified by content:
// useReducer, Suspense/React.lazy, and using TypeScript with React (only a
// passing mention existed in react/where-to-go-next, never actually
// taught). Render Props and Higher-Order Components were judged legacy/
// superseded by hooks for the same use cases — same spirit as the PDF's
// own note that Class Components aren't recommended anymore — and left
// out, not built as new lessons.
//
// User picked "build all 3" over AskUserQuestion.
//
// Inserted before react/where-to-go-next (its sort_order bumped to the new
// end) so the "closer" lesson stays last, matching its role.
//
// Style: matches this category's own established house style (see
// react/custom-hooks) — moderate prose, jsx/tsx code, callouts. Bengali
// matches this category's script-transliteration convention, verified
// against react/custom-hooks bn.
//
// sort_order: useReducer=25, suspense-and-code-splitting=26,
// using-typescript-with-react=27; where-to-go-next bumped from 25 to 28.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-react-gap-content.mjs [--dry-run]

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

lessons.push({
  slug: 'usereducer', sortOrder: 25,
  en: {
    title: 'The useReducer Hook',
    metaTitle: 'The useReducer Hook | Learn Computer Academy',
    metaDescription: "An alternative to useState for state that updates through well-defined actions — how it works, and when it's worth reaching for over useState.",
    blocks: [
      p('<p>The State and Updating State lessons covered <code>useState</code> for most component state. <code>useReducer</code> is an alternative, better suited to state that changes through several distinct, well-defined actions rather than one simple value.</p>'),
      h(2, 'The Shape of a Reducer'),
      p('<p>A <b>reducer</b> is a function that takes the current state and an <b>action</b>, and returns the new state — the same pattern this course\'s array <code>.reduce()</code> examples use, just applied to component state.</p>'),
      code('jsx', 'function counterReducer(state, action) {\n  switch (action.type) {\n    case \'increment\':\n      return { count: state.count + 1 }\n    case \'decrement\':\n      return { count: state.count - 1 }\n    case \'reset\':\n      return { count: 0 }\n    default:\n      throw new Error(`Unknown action: ${action.type}`)\n  }\n}'),
      h(2, 'Using It in a Component'),
      code('jsx', 'import { useReducer } from \'react\'\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(counterReducer, { count: 0 })\n\n  return (\n    <div>\n      <p>Count: {state.count}</p>\n      <button onClick={() => dispatch({ type: \'increment\' })}>+</button>\n      <button onClick={() => dispatch({ type: \'decrement\' })}>-</button>\n      <button onClick={() => dispatch({ type: \'reset\' })}>Reset</button>\n    </div>\n  )\n}'),
      p('<p><code>dispatch</code> is the only way to trigger a state change — a component never sets state directly, it describes what happened (the action) and lets the reducer decide the result.</p>'),
      h(2, 'useState vs. useReducer'),
      table(['Use useState when...', 'Use useReducer when...'], [
        ['State is a single value or a few independent ones', 'Several pieces of state update together in response to the same events'],
        ['Updates are simple — set this to that', 'The next state genuinely depends on the current state and which action fired'],
        ['There\'s no shared logic between different updates', 'The same transition logic needs to be testable on its own, separate from the component'],
      ]),
      callout('tip', '<p>A reducer function has no dependency on React at all — it\'s a plain function taking state and an action, returning new state. That makes it trivial to unit test without rendering anything.</p>', 'Why this is easier to test'),
      h(2, 'A Common Real Use — a Form with Many Fields'),
      code('jsx', 'function formReducer(state, action) {\n  switch (action.type) {\n    case \'field-changed\':\n      return { ...state, [action.field]: action.value }\n    case \'reset\':\n      return { name: \'\', email: \'\' }\n    default:\n      return state\n  }\n}\n\nfunction SignupForm() {\n  const [form, dispatch] = useReducer(formReducer, { name: \'\', email: \'\' })\n\n  return (\n    <input\n      value={form.name}\n      onChange={(e) => dispatch({ type: \'field-changed\', field: \'name\', value: e.target.value })}\n    />\n  )\n}'),
    ],
  },
  bn: {
    title: 'useReducer Hook',
    metaTitle: 'useReducer Hook | Learn Computer Academy',
    metaDescription: 'একটা simple value-এর বদলে ভালো-define করা action দিয়ে আপডেট হওয়া state-এর জন্য useState-এর একটা বিকল্প — এটা কীভাবে কাজ করে, আর কখন useState-এর বদলে এটার জন্য যাবেন।',
    blocks: [
      p('<p>State আর Updating State lesson বেশিরভাগ component state-এর জন্য <code>useState</code> কভার করেছে। <code>useReducer</code> একটা বিকল্প, একটা সহজ মানের বদলে কয়েকটা distinct, ভালো-define করা action দিয়ে বদলানো state-এর জন্য বেশি মানানসই।</p>'),
      h(2, 'একটা Reducer-এর আকার', 'একটা-reducer-এর-আকার'),
      p('<p>একটা <b>reducer</b> এমন একটা function যা বর্তমান state আর একটা <b>action</b> নেয়, আর নতুন state return করে — এই কোর্সের array <code>.reduce()</code> উদাহরণ যে একই pattern ব্যবহার করে, শুধু component state-এ প্রয়োগ করা।</p>'),
      code('jsx', 'function counterReducer(state, action) {\n  switch (action.type) {\n    case \'increment\':\n      return { count: state.count + 1 }\n    case \'decrement\':\n      return { count: state.count - 1 }\n    case \'reset\':\n      return { count: 0 }\n    default:\n      throw new Error(`Unknown action: ${action.type}`)\n  }\n}'),
      h(2, 'একটা Component-এ এটা ব্যবহার করা', 'একটা-component-এ-এটা-ব্যবহার-করা'),
      code('jsx', 'import { useReducer } from \'react\'\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(counterReducer, { count: 0 })\n\n  return (\n    <div>\n      <p>Count: {state.count}</p>\n      <button onClick={() => dispatch({ type: \'increment\' })}>+</button>\n      <button onClick={() => dispatch({ type: \'decrement\' })}>-</button>\n      <button onClick={() => dispatch({ type: \'reset\' })}>Reset</button>\n    </div>\n  )\n}'),
      p('<p>State পরিবর্তন trigger করার একমাত্র উপায় <code>dispatch</code> — একটা component কখনো সরাসরি state সেট করে না, এটা কী ঘটেছে (action) বর্ণনা করে আর reducer-কে ফলাফল ঠিক করতে দেয়।</p>'),
      h(2, 'useState বনাম useReducer', 'usestate-বনাম-usereducer'),
      table(['যখন useState ব্যবহার করবেন...', 'যখন useReducer ব্যবহার করবেন...'], [
        ['State একটা একক মান বা কয়েকটা স্বাধীন মান', 'একই event-এর প্রতিক্রিয়ায় state-এর বেশ কয়েকটা অংশ একসাথে আপডেট হয়'],
        ['আপডেট সহজ — এটাকে ওটা সেট করা', 'পরের state সত্যিকারভাবে বর্তমান state আর কোন action fire হয়েছে তার উপর নির্ভর করে'],
        ['ভিন্ন আপডেটের মধ্যে কোনো শেয়ার করা logic নেই', 'একই transition logic component থেকে আলাদা, নিজে থেকেই testable হওয়া দরকার'],
      ]),
      callout('tip', '<p>একটা reducer function React-এর উপর কোনো নির্ভরতা নেই — এটা state আর একটা action নেওয়া, নতুন state return করা একটা সাধারণ function। এটা কিছু render না করেই unit test করা সহজ বানায়।</p>', 'কেন এটা test করা সহজ'),
      h(2, 'একটা Common আসল ব্যবহার — অনেক Field সহ একটা Form', 'একটা-common-আসল-ব্যবহার-অনেক-field-সহ-একটা-form'),
      code('jsx', 'function formReducer(state, action) {\n  switch (action.type) {\n    case \'field-changed\':\n      return { ...state, [action.field]: action.value }\n    case \'reset\':\n      return { name: \'\', email: \'\' }\n    default:\n      return state\n  }\n}\n\nfunction SignupForm() {\n  const [form, dispatch] = useReducer(formReducer, { name: \'\', email: \'\' })\n\n  return (\n    <input\n      value={form.name}\n      onChange={(e) => dispatch({ type: \'field-changed\', field: \'name\', value: e.target.value })}\n    />\n  )\n}'),
    ],
  },
})

lessons.push({
  slug: 'suspense-and-code-splitting', sortOrder: 26,
  en: {
    title: 'Suspense and Code-Splitting with React.lazy',
    metaTitle: 'Suspense and Code-Splitting | Learn Computer Academy',
    metaDescription: 'Loading a component only when it\'s actually needed with React.lazy, and showing a fallback while it loads with Suspense.',
    blocks: [
      p('<p>By default, a React app\'s entire JavaScript bundle downloads before anything renders — including code for parts of the app a visitor might never open. <b>Code-splitting</b> breaks the bundle into pieces loaded on demand, and <b>Suspense</b> is how React shows a fallback while a piece is still loading.</p>'),
      h(2, 'React.lazy — Loading a Component on Demand'),
      p('<p>Instead of a normal <code>import</code>, <code>React.lazy</code> takes a function that dynamically imports a component — that import only actually happens the first time the component is rendered.</p>'),
      code('jsx', 'import { lazy } from \'react\'\n\nconst SettingsPage = lazy(() => import(\'./SettingsPage\'))'),
      h(2, 'Wrapping It in Suspense'),
      p('<p>A lazily-loaded component needs a <code>&lt;Suspense&gt;</code> boundary somewhere above it — its <code>fallback</code> prop is what shows while the component\'s code is still downloading.</p>'),
      code('jsx', 'import { lazy, Suspense } from \'react\'\n\nconst SettingsPage = lazy(() => import(\'./SettingsPage\'))\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading settings...</p>}>\n      <SettingsPage />\n    </Suspense>\n  )\n}'),
      h(2, 'A Practical Use — Splitting by Route'),
      p('<p>The most common real use: pairing lazy-loaded components with React Router (from the earlier lesson), so a route\'s code only downloads when a visitor actually navigates to it.</p>'),
      code('jsx', 'import { lazy, Suspense } from \'react\'\nimport { Routes, Route } from \'react-router-dom\'\n\nconst Dashboard = lazy(() => import(\'./Dashboard\'))\nconst Settings = lazy(() => import(\'./Settings\'))\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading...</p>}>\n      <Routes>\n        <Route path="/dashboard" element={<Dashboard />} />\n        <Route path="/settings" element={<Settings />} />\n      </Routes>\n    </Suspense>\n  )\n}'),
      h(2, 'One Suspense Boundary Can Cover Several Components'),
      p('<p>A single <code>&lt;Suspense&gt;</code> shows its fallback until every lazy component inside it has finished loading — useful for treating a group of related pieces as one loading unit rather than showing several separate spinners.</p>'),
      callout('note', '<p>Suspense also has a newer, more advanced use — suspending on data fetching itself, not just lazy component loading — supported by some data-fetching libraries and React\'s own newer APIs. That deeper use is beyond this lesson\'s scope; code-splitting is the well-established, universally supported case.</p>', 'Suspense goes further than this lesson covers'),
    ],
  },
  bn: {
    title: 'Suspense ও React.lazy দিয়ে Code-Splitting',
    metaTitle: 'Suspense ও Code-Splitting | Learn Computer Academy',
    metaDescription: 'React.lazy দিয়ে একটা component শুধু আসলে দরকার হলে load করা, আর load হওয়ার সময় Suspense দিয়ে একটা fallback দেখানো।',
    blocks: [
      p('<p>Default-এ, একটা React app-এর পুরো JavaScript bundle কিছু render হওয়ার আগে download হয় — app-এর এমন অংশের কোড সহ যা একজন visitor হয়তো কখনো খুলবেই না। <b>Code-splitting</b> bundle-কে on demand load হওয়া টুকরায় ভাঙে, আর <b>Suspense</b> হলো একটা টুকরা এখনো load হচ্ছে অবস্থায় React কীভাবে একটা fallback দেখায়।</p>'),
      h(2, 'React.lazy — On Demand একটা Component Load করা', 'reactlazy-on-demand-একটা-component-load-করা'),
      p('<p>একটা সাধারণ <code>import</code>-এর বদলে, <code>React.lazy</code> একটা component-কে dynamically import করে এমন একটা function নেয় — সেই import আসলে শুধু component প্রথমবার render হলেই ঘটে।</p>'),
      code('jsx', 'import { lazy } from \'react\'\n\nconst SettingsPage = lazy(() => import(\'./SettingsPage\'))'),
      h(2, 'Suspense-এ Wrap করা', 'suspense-এ-wrap-করা'),
      p('<p>একটা lazily-load করা component-এর উপরে কোথাও একটা <code>&lt;Suspense&gt;</code> boundary দরকার — এর <code>fallback</code> prop হলো component-এর কোড এখনো download হচ্ছে অবস্থায় যা দেখায়।</p>'),
      code('jsx', 'import { lazy, Suspense } from \'react\'\n\nconst SettingsPage = lazy(() => import(\'./SettingsPage\'))\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading settings...</p>}>\n      <SettingsPage />\n    </Suspense>\n  )\n}'),
      h(2, 'একটা Practical ব্যবহার — Route অনুযায়ী Split করা', 'একটা-practical-ব্যবহার-route-অনুযায়ী-split-করা'),
      p('<p>সবচেয়ে common আসল ব্যবহার: lazy-load করা component-কে (আগের lesson থেকে) React Router-এর সাথে জোড়া লাগানো, যাতে একটা route-এর কোড শুধু একজন visitor আসলে সেখানে navigate করলে download হয়।</p>'),
      code('jsx', 'import { lazy, Suspense } from \'react\'\nimport { Routes, Route } from \'react-router-dom\'\n\nconst Dashboard = lazy(() => import(\'./Dashboard\'))\nconst Settings = lazy(() => import(\'./Settings\'))\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading...</p>}>\n      <Routes>\n        <Route path="/dashboard" element={<Dashboard />} />\n        <Route path="/settings" element={<Settings />} />\n      </Routes>\n    </Suspense>\n  )\n}'),
      h(2, 'একটা Suspense Boundary বেশ কয়েকটা Component Cover করতে পারে', 'একটা-suspense-boundary-বেশ-কয়েকটা-component-cover-করতে-পারে'),
      p('<p>একটা একক <code>&lt;Suspense&gt;</code> এর ভেতরের প্রতিটা lazy component load শেষ না হওয়া পর্যন্ত এর fallback দেখায় — সম্পর্কিত টুকরার একটা group-কে বেশ কয়েকটা আলাদা spinner-এর বদলে একটা loading unit হিসেবে treat করার জন্য useful।</p>'),
      callout('note', '<p>Suspense-এর একটা নতুন, বেশি advanced ব্যবহারও আছে — শুধু lazy component load-এ না, নিজের data fetching-এও suspend করা — কিছু data-fetching library আর React-এর নিজের নতুন API দিয়ে সমর্থিত। সেই গভীর ব্যবহার এই lesson-এর scope-এর বাইরে; code-splitting-ই ভালোভাবে-প্রতিষ্ঠিত, সর্বজনীনভাবে সমর্থিত case।</p>', 'Suspense এই lesson কভার করার চেয়ে আরো এগিয়ে যায়'),
    ],
  },
})

lessons.push({
  slug: 'using-typescript-with-react', sortOrder: 27,
  en: {
    title: 'Using TypeScript with React',
    metaTitle: 'Using TypeScript with React | Learn Computer Academy',
    metaDescription: 'Typing component props, state, and events in a React component — the practical patterns, assuming basic TypeScript familiarity.',
    blocks: [
      p('<p>This lesson assumes basic TypeScript syntax is already familiar — types, interfaces, generics — and focuses specifically on the patterns unique to typing a React component. A <code>.tsx</code> file extension (instead of <code>.jsx</code>) is what tells the TypeScript compiler a file contains JSX.</p>'),
      h(2, 'Typing Props'),
      code('tsx', 'interface ButtonProps {\n  label: string\n  onClick: () => void\n  disabled?: boolean   // the ? makes this prop optional\n}\n\nfunction Button({ label, onClick, disabled }: ButtonProps) {\n  return (\n    <button onClick={onClick} disabled={disabled}>\n      {label}\n    </button>\n  )\n}'),
      h(2, 'Typing children'),
      p('<p>React\'s built-in <code>ReactNode</code> type covers anything valid as JSX children — text, elements, fragments, or nothing at all.</p>'),
      code('tsx', 'import type { ReactNode } from \'react\'\n\ninterface CardProps {\n  title: string\n  children: ReactNode\n}\n\nfunction Card({ title, children }: CardProps) {\n  return (\n    <div className="card">\n      <h3>{title}</h3>\n      {children}\n    </div>\n  )\n}'),
      h(2, 'Typing useState'),
      p('<p>TypeScript usually infers the type from the initial value — an explicit type argument is only needed when the initial value doesn\'t fully describe every state the variable can hold.</p>'),
      code('tsx', 'const [count, setCount] = useState(0)              // inferred as number\nconst [name, setName] = useState(\'\')                // inferred as string\n\n// Needs an explicit type — starts as null, but will later hold a User\nconst [user, setUser] = useState<User | null>(null)'),
      h(2, 'Typing Event Handlers'),
      p('<p>React provides typed versions of DOM events, prefixed with <code>React.</code> — <code>event.target</code> is then correctly typed too, instead of being <code>any</code>.</p>'),
      code('tsx', 'function SearchBox() {\n  const [query, setQuery] = useState(\'\')\n\n  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {\n    setQuery(event.target.value)\n  }\n\n  return <input value={query} onChange={handleChange} />\n}'),
      h(2, 'Typing useRef for a DOM Element'),
      code('tsx', 'function TextInput() {\n  const inputRef = useRef<HTMLInputElement>(null)\n\n  function focus() {\n    inputRef.current?.focus()   // ?. because it starts as null\n  }\n\n  return <input ref={inputRef} />\n}'),
      table(['What', 'How to type it'], [
        ['Props', 'An interface, destructured in the function\'s parameter'],
        ['children', 'The ReactNode type'],
        ['useState', 'Usually inferred; use useState<T>() when the initial value doesn\'t cover every possible state'],
        ['Event handlers', 'React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>, etc.'],
        ['useRef to a DOM element', 'useRef<HTMLInputElement>(null), then optional-chain with ?.'],
      ]),
      callout('tip', '<p>Most tooling that scaffolds a React project (including Vite) offers a TypeScript template out of the box — starting a new project with it from day one avoids retrofitting types onto existing JavaScript later.</p>', 'Starting a project already typed'),
    ],
  },
  bn: {
    title: 'React-এর সাথে TypeScript ব্যবহার করা',
    metaTitle: 'React-এর সাথে TypeScript ব্যবহার করা | Learn Computer Academy',
    metaDescription: 'একটা React component-এ props, state, আর event type করা — practical pattern, basic TypeScript পরিচিতি ধরে নিয়ে।',
    blocks: [
      p('<p>এই lesson ধরে নেয় basic TypeScript সিনট্যাক্স ইতিমধ্যে পরিচিত — type, interface, generic — আর specifically একটা React component type করার unique pattern-এ ফোকাস করে। একটা <code>.tsx</code> file extension (<code>.jsx</code>-এর বদলে) TypeScript compiler-কে বলে একটা file JSX ধারণ করে।</p>'),
      h(2, 'Props Type করা', 'props-type-করা'),
      code('tsx', 'interface ButtonProps {\n  label: string\n  onClick: () => void\n  disabled?: boolean   // ? এই prop-কে optional বানায়\n}\n\nfunction Button({ label, onClick, disabled }: ButtonProps) {\n  return (\n    <button onClick={onClick} disabled={disabled}>\n      {label}\n    </button>\n  )\n}'),
      h(2, 'children Type করা', 'children-type-করা'),
      p('<p>React-এর built-in <code>ReactNode</code> type JSX children হিসেবে বৈধ যেকোনো কিছু কভার করে — টেক্সট, element, fragment, বা একদম কিছু না।</p>'),
      code('tsx', 'import type { ReactNode } from \'react\'\n\ninterface CardProps {\n  title: string\n  children: ReactNode\n}\n\nfunction Card({ title, children }: CardProps) {\n  return (\n    <div className="card">\n      <h3>{title}</h3>\n      {children}\n    </div>\n  )\n}'),
      h(2, 'useState Type করা', 'usestate-type-করা'),
      p('<p>TypeScript সাধারণত initial value থেকে type infer করে — একটা explicit type argument শুধু তখন দরকার যখন initial value variable-টা যা যা state ধরতে পারে তার সবটা বর্ণনা করে না।</p>'),
      code('tsx', 'const [count, setCount] = useState(0)              // number হিসেবে infer করা\nconst [name, setName] = useState(\'\')                // string হিসেবে infer করা\n\n// একটা explicit type দরকার — null দিয়ে শুরু, কিন্তু পরে একটা User ধরবে\nconst [user, setUser] = useState<User | null>(null)'),
      h(2, 'Event Handler Type করা', 'event-handler-type-করা'),
      p('<p>React <code>React.</code> দিয়ে prefix করা DOM event-এর typed version দেয় — <code>event.target</code> তখন সঠিকভাবে type করা থাকে, <code>any</code> হওয়ার বদলে।</p>'),
      code('tsx', 'function SearchBox() {\n  const [query, setQuery] = useState(\'\')\n\n  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {\n    setQuery(event.target.value)\n  }\n\n  return <input value={query} onChange={handleChange} />\n}'),
      h(2, 'একটা DOM Element-এর জন্য useRef Type করা', 'একটা-dom-element-এর-জন্য-useref-type-করা'),
      code('tsx', 'function TextInput() {\n  const inputRef = useRef<HTMLInputElement>(null)\n\n  function focus() {\n    inputRef.current?.focus()   // ?. কারণ এটা null দিয়ে শুরু হয়\n  }\n\n  return <input ref={inputRef} />\n}'),
      table(['কী', 'কীভাবে type করবেন'], [
        ['Props', 'একটা interface, function-এর parameter-এ destructure করা'],
        ['children', 'ReactNode type'],
        ['useState', 'সাধারণত infer করা; initial value সম্ভাব্য প্রতিটা state কভার না করলে useState<T>() ব্যবহার করুন'],
        ['Event handler', 'React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>, ইত্যাদি'],
        ['DOM element-এ useRef', 'useRef<HTMLInputElement>(null), তারপর ?. দিয়ে optional-chain'],
      ]),
      callout('tip', '<p>একটা React project scaffold করা বেশিরভাগ tooling (Vite সহ) সরাসরি একটা TypeScript template দেয় — প্রথম দিন থেকেই এটা দিয়ে একটা নতুন project শুরু করা পরে বিদ্যমান JavaScript-এ type retrofit করা এড়ায়।</p>', 'একটা project আগে থেকেই typed শুরু করা'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'react').single()
  if (catErr || !category) {
    console.error('Category "react" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write, plus bumping where-to-go-next\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] react/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] react/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('  react/where-to-go-next -> sort_order 28')
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `react/${lesson.slug}`
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

  const { error: bumpErr } = await supabase.from('docs').update({ sort_order: 28 }).eq('category_id', category.id).eq('slug', 'where-to-go-next')
  if (bumpErr) { console.error('Failed to bump where-to-go-next:', bumpErr.message) }
  else console.log('  ✓ react/where-to-go-next -> sort_order 28')

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
