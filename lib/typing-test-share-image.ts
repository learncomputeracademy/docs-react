// Renders a shareable result card to an off-screen canvas and triggers a
// download — no server round-trip, no image-generation API, just Canvas 2D.
// A fixed dark card regardless of the site's current light/dark theme,
// matching how most typing-test share cards work (consistent branding
// wherever it's posted, not tied to the viewer's own theme preference).

export type ShareResultData = {
  wpm: number
  accuracy: number
  rawWpm: number
  consistency: number
  mode: string
  label: string
}

const WIDTH = 1200
const HEIGHT = 630

export function downloadResultImage(data: ShareResultData) {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // Accent bar
  ctx.fillStyle = '#f97316'
  ctx.fillRect(0, 0, WIDTH, 10)

  // Brand
  ctx.fillStyle = '#a3a3a3'
  ctx.font = '600 28px system-ui, sans-serif'
  ctx.fillText('Learn Computer Academy — Typing Test', 80, 100)

  // Big WPM
  ctx.fillStyle = '#f97316'
  ctx.font = '800 180px ui-monospace, monospace'
  ctx.fillText(String(data.wpm), 80, 320)
  ctx.fillStyle = '#a3a3a3'
  ctx.font = '600 40px system-ui, sans-serif'
  ctx.fillText('WPM', 80, 370)

  // Secondary stats row
  const stats: [string, string][] = [
    ['Accuracy', `${data.accuracy}%`],
    ['Raw WPM', String(data.rawWpm)],
    ['Consistency', `${data.consistency}%`],
  ]
  let x = 80
  ctx.font = '700 44px ui-monospace, monospace'
  for (const [label, value] of stats) {
    ctx.fillStyle = '#fafafa'
    ctx.fillText(value, x, 460)
    ctx.fillStyle = '#737373'
    ctx.font = '500 22px system-ui, sans-serif'
    ctx.fillText(label, x, 495)
    ctx.font = '700 44px ui-monospace, monospace'
    x += 280
  }

  // Mode/label footer
  ctx.fillStyle = '#737373'
  ctx.font = '500 24px system-ui, sans-serif'
  ctx.fillText(`${data.mode} · ${data.label} · ${new Date().toLocaleDateString()}`, 80, 570)

  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = `typing-test-${data.wpm}wpm.png`
  a.click()
}
