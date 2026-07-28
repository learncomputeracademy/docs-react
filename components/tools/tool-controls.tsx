import { cn } from '@/lib/utils'

// Shared presentational atoms for the /tools demos (box model, box shadow, …
// same visual language, same interaction pattern, so it lives once here
// instead of once per demo).

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
  onDragStart,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (n: number) => void
  // Fires once per drag gesture (pointerdown), before the first onChange —
  // callers use it to snapshot undo history once per drag instead of once
  // per pixel, which a plain onChange listener would otherwise produce.
  onDragStart?: () => void
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums font-medium">{value}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onPointerDown={onDragStart}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  )
}

export function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="space-y-2.5 rounded-lg border p-3">
      <h3 className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span>{title}</span>
        {action}
      </h3>
      {children}
    </section>
  )
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-md bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 whitespace-nowrap rounded px-2 py-1 text-xs transition-colors',
            value === o.value ? 'bg-background font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
