import { transform } from 'sucrase'

// Pinned to the installed React version — the iframe loads its own React
// via esm.sh (React's own officially-documented no-build-tool pattern:
// https://react.dev/learn/add-react-to-an-existing-project), since React 19
// no longer ships a UMD build to self-host. Scoped to the sandboxed iframe
// only — never touches the main page's JS budget.
const REACT_VERSION = '19.2.4'

// error/message channel: the iframe has no console the parent can see, so
// runtime errors are relayed via postMessage instead.
const errorRelay = (onerrorSetup: string) => `
${onerrorSetup}
window.__tryitError = function (message) {
  parent.postMessage({ source: 'tryit', message: String(message) }, '*')
}
`

export function buildWebDoc(files: { html?: string; css?: string; js?: string }): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${files.css ?? ''}</style>
</head>
<body>
${files.html ?? ''}
<script>
${errorRelay("window.onerror = function (msg) { window.__tryitError(msg); return true; };")}
try {
${files.js ?? ''}
} catch (err) { window.__tryitError(err && err.message || err) }
</script>
</body>
</html>`
}

export function buildReactDoc(files: { css?: string; jsx?: string }): { doc: string; error: string | null } {
  let code: string
  try {
    code = transform(files.jsx ?? '', { transforms: ['jsx'] }).code
  } catch (err) {
    return { doc: '', error: err instanceof Error ? err.message : String(err) }
  }
  const doc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${files.css ?? ''}</style>
<script type="importmap">
{"imports":{"react":"https://esm.sh/react@${REACT_VERSION}","react-dom/client":"https://esm.sh/react-dom@${REACT_VERSION}/client"}}
</script>
</head>
<body>
<div id="root"></div>
<script type="module">
import * as React from "react";
import { createRoot } from "react-dom/client";
window.React = React;
window.ReactDOM = { createRoot };
${errorRelay("window.onerror = function (msg) { window.__tryitError(msg); return true; };")}
try {
${code}
} catch (err) { window.__tryitError(err && err.message || err) }
</script>
</body>
</html>`
  return { doc, error: null }
}
