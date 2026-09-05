// A sequential (magnitude), single-hue heatmap — per the dataviz skill,
// magnitude gets one hue light->dark, never a rainbow. Uses the site's own
// `--primary` token via `color-mix()` for the intensity ramp rather than a
// new hardcoded palette, so it's automatically correct in dark mode too
// (the CSS variable itself already swaps between themes).
const ROWS: string[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

export function KeyboardHeatmap({ errorsByChar }: { errorsByChar: Record<string, number> }) {
  const maxErrors = Math.max(1, ...Object.values(errorsByChar))

  function intensityStyle(key: string): React.CSSProperties {
    const count = errorsByChar[key] ?? 0
    if (count === 0) return {}
    const pct = Math.round(15 + (count / maxErrors) * 65) // 15%..80% mix
    return { backgroundColor: `color-mix(in oklch, var(--primary) ${pct}%, transparent)` }
  }

  return (
    <div className="space-y-1.5">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5" style={{ paddingLeft: `${i * 1}rem` }}>
          {row.map((key) => {
            const count = errorsByChar[key] ?? 0
            return (
              <div
                key={key}
                title={count > 0 ? `${count} mistake${count === 1 ? '' : 's'}` : undefined}
                style={intensityStyle(key)}
                className="flex size-8 items-center justify-center rounded-md border font-mono text-xs uppercase text-foreground"
              >
                {key}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
