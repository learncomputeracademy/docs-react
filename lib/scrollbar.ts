// Scrollbar model + CSS generation for the scrollbar app. Pure functions,
// no DOM — same separation as the other /tools libs.
//
// Two systems that don't talk to each other, both generated together:
// `scrollbar-width`/`scrollbar-color` (the standard — Firefox, and more
// recently Chromium) and `::-webkit-scrollbar` + its parts (WebKit/Blink
// only — Chrome, Edge, Opera, Safari; Firefox ignores every rule). See the
// honest-support note surfaced in the UI, not just this comment.

export type ScrollbarWidthKeyword = 'auto' | 'thin' | 'none'
export type Axis = 'vertical' | 'horizontal' | 'both'

export type ScrollbarState = {
  scrollbarWidth: ScrollbarWidthKeyword
  webkitSize: number
  trackColor: string
  trackRadius: number
  trackBorderWidth: number
  trackBorderColor: string
  thumbColor: string
  thumbHoverColor: string
  thumbRadius: number
  thumbBorderWidth: number
  thumbBorderColor: string
  cornerColor: string
  showButtons: boolean
  buttonColor: string
}

export function defaultScrollbarState(): ScrollbarState {
  return {
    scrollbarWidth: 'thin',
    webkitSize: 12,
    trackColor: '#f1f5f9',
    trackRadius: 8,
    trackBorderWidth: 0,
    trackBorderColor: '#e2e8f0',
    thumbColor: '#94a3b8',
    thumbHoverColor: '#64748b',
    thumbRadius: 8,
    thumbBorderWidth: 2,
    thumbBorderColor: '#f1f5f9',
    cornerColor: '#f1f5f9',
    showButtons: false,
    buttonColor: '#94a3b8',
  }
}

// Custom-property names the live preview and generateCss() both key off —
// one source of truth so the preview can never silently drift from the
// copyable output.
export const CSS_VARS = {
  size: '--sb-size',
  trackColor: '--sb-track-color',
  trackRadius: '--sb-track-radius',
  trackBorderWidth: '--sb-track-border-width',
  trackBorderColor: '--sb-track-border-color',
  thumbColor: '--sb-thumb-color',
  thumbHoverColor: '--sb-thumb-hover-color',
  thumbRadius: '--sb-thumb-radius',
  thumbBorderWidth: '--sb-thumb-border-width',
  thumbBorderColor: '--sb-thumb-border-color',
  cornerColor: '--sb-corner-color',
  buttonDisplay: '--sb-button-display',
  buttonColor: '--sb-button-color',
  scrollbarWidth: '--sb-width-kw',
} as const

export function cssVarStyle(s: ScrollbarState): React.CSSProperties {
  return {
    [CSS_VARS.size]: `${s.webkitSize}px`,
    [CSS_VARS.trackColor]: s.trackColor,
    [CSS_VARS.trackRadius]: `${s.trackRadius}px`,
    [CSS_VARS.trackBorderWidth]: `${s.trackBorderWidth}px`,
    [CSS_VARS.trackBorderColor]: s.trackBorderColor,
    [CSS_VARS.thumbColor]: s.thumbColor,
    [CSS_VARS.thumbHoverColor]: s.thumbHoverColor,
    [CSS_VARS.thumbRadius]: `${s.thumbRadius}px`,
    [CSS_VARS.thumbBorderWidth]: `${s.thumbBorderWidth}px`,
    [CSS_VARS.thumbBorderColor]: s.thumbBorderColor,
    [CSS_VARS.cornerColor]: s.cornerColor,
    [CSS_VARS.buttonDisplay]: s.showButtons ? 'block' : 'none',
    [CSS_VARS.buttonColor]: s.buttonColor,
    [CSS_VARS.scrollbarWidth]: s.scrollbarWidth,
    scrollbarWidth: s.scrollbarWidth,
    scrollbarColor: `${s.thumbColor} ${s.trackColor}`,
  } as React.CSSProperties
}

// Static stylesheet the live preview mounts once — every value comes from
// the var(--sb-*) custom properties set on the previewed element itself
// (cssVarStyle above), so the preview and the copyable CSS below can never
// disagree with each other.
export const PREVIEW_STYLESHEET = `
.sb-demo::-webkit-scrollbar { width: var(${CSS_VARS.size}); height: var(${CSS_VARS.size}); }
.sb-demo::-webkit-scrollbar-track { background: var(${CSS_VARS.trackColor}); border-radius: var(${CSS_VARS.trackRadius}); border: var(${CSS_VARS.trackBorderWidth}) solid var(${CSS_VARS.trackBorderColor}); }
.sb-demo::-webkit-scrollbar-thumb { background: var(${CSS_VARS.thumbColor}); border-radius: var(${CSS_VARS.thumbRadius}); border: var(${CSS_VARS.thumbBorderWidth}) solid var(${CSS_VARS.thumbBorderColor}); background-clip: padding-box; }
.sb-demo::-webkit-scrollbar-thumb:hover { background: var(${CSS_VARS.thumbHoverColor}); background-clip: padding-box; }
.sb-demo::-webkit-scrollbar-corner { background: var(${CSS_VARS.cornerColor}); }
.sb-demo::-webkit-scrollbar-button { display: var(${CSS_VARS.buttonDisplay}); background: var(${CSS_VARS.buttonColor}); }
`.trim()

function round(n: number) {
  return Math.round(n * 10) / 10
}

export function generateCss(s: ScrollbarState, selector = '.scrollable'): string {
  const lines: string[] = []

  const stdDecls: string[] = []
  if (s.scrollbarWidth !== 'auto') stdDecls.push(`scrollbar-width: ${s.scrollbarWidth};`)
  if (s.scrollbarWidth !== 'none') stdDecls.push(`scrollbar-color: ${s.thumbColor} ${s.trackColor};`)
  if (stdDecls.length) lines.push(`${selector} {\n  ${stdDecls.join('\n  ')}\n}`)

  lines.push(`${selector}::-webkit-scrollbar {\n  width: ${round(s.webkitSize)}px;\n  height: ${round(s.webkitSize)}px;\n}`)

  const trackDecls = [`background: ${s.trackColor};`]
  if (s.trackRadius > 0) trackDecls.push(`border-radius: ${round(s.trackRadius)}px;`)
  if (s.trackBorderWidth > 0) trackDecls.push(`border: ${round(s.trackBorderWidth)}px solid ${s.trackBorderColor};`)
  lines.push(`${selector}::-webkit-scrollbar-track {\n  ${trackDecls.join('\n  ')}\n}`)

  const thumbDecls = [`background: ${s.thumbColor};`]
  if (s.thumbRadius > 0) thumbDecls.push(`border-radius: ${round(s.thumbRadius)}px;`)
  if (s.thumbBorderWidth > 0) thumbDecls.push(`border: ${round(s.thumbBorderWidth)}px solid ${s.thumbBorderColor};`, 'background-clip: padding-box;')
  lines.push(`${selector}::-webkit-scrollbar-thumb {\n  ${thumbDecls.join('\n  ')}\n}`)

  if (s.thumbHoverColor !== s.thumbColor) {
    lines.push(`${selector}::-webkit-scrollbar-thumb:hover {\n  background: ${s.thumbHoverColor};\n}`)
  }

  lines.push(`${selector}::-webkit-scrollbar-corner {\n  background: ${s.cornerColor};\n}`)

  if (s.showButtons) {
    lines.push(`${selector}::-webkit-scrollbar-button {\n  display: block;\n  background: ${s.buttonColor};\n}`)
  }

  return lines.join('\n\n')
}

export function generateReact(s: ScrollbarState, selector = '.scrollable'): string {
  const css = generateCss(s, selector).replace(/\n/g, '\n  ')
  return `// styled-jsx (or any CSS-in-JS that emits real <style>) — inline\n// style props can't target pseudo-elements, so this still needs\n// a real stylesheet, just scoped to the component.\n<style jsx>{\`\n  ${css}\n\`}</style>`
}

// ── Presets ──────────────────────────────────────────────────────────────

export type PresetKey = 'minimal' | 'chunky' | 'neon' | 'hoverReveal' | 'hidden'

export const SCROLLBAR_PRESETS: Record<PresetKey, Partial<ScrollbarState>> = {
  minimal: {
    scrollbarWidth: 'thin', webkitSize: 8, trackColor: '#00000000' as unknown as string,
    trackRadius: 8, trackBorderWidth: 0, thumbColor: '#cbd5e1', thumbHoverColor: '#94a3b8',
    thumbRadius: 8, thumbBorderWidth: 0, cornerColor: '#00000000' as unknown as string, showButtons: false,
  },
  chunky: {
    scrollbarWidth: 'auto', webkitSize: 20, trackColor: '#1e293b', trackRadius: 4, trackBorderWidth: 0,
    thumbColor: '#64748b', thumbHoverColor: '#94a3b8', thumbRadius: 4, thumbBorderWidth: 3, thumbBorderColor: '#1e293b',
    cornerColor: '#1e293b', showButtons: false,
  },
  neon: {
    scrollbarWidth: 'thin', webkitSize: 12, trackColor: '#0f172a', trackRadius: 8, trackBorderWidth: 0,
    thumbColor: '#22d3ee', thumbHoverColor: '#67e8f9', thumbRadius: 8, thumbBorderWidth: 2, thumbBorderColor: '#0f172a',
    cornerColor: '#0f172a', showButtons: false,
  },
  hoverReveal: {
    scrollbarWidth: 'thin', webkitSize: 10, trackColor: '#f8fafc', trackRadius: 8, trackBorderWidth: 0,
    thumbColor: '#f8fafc', thumbHoverColor: '#94a3b8', thumbRadius: 8, thumbBorderWidth: 0, cornerColor: '#f8fafc', showButtons: false,
  },
  hidden: {
    scrollbarWidth: 'none', webkitSize: 0, showButtons: false,
  },
}
