'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

// All tabs' HTML ships in the initial server-rendered markup (highlighted
// server-side by block-renderer, same as a plain code block) — switching
// tabs just toggles which pre-rendered pane is visible. Content is present
// in view-source regardless of JS, same guarantee a single code block has.
export function CodeTabs({ tabs }: { tabs: { label: string; html: string; code: string }[] }) {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)

  return (
    <div className="not-prose relative my-4 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted/40 pr-2">
        <div className="flex">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                i === active
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(tabs[active].code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check key="check" className="size-4" /> : <Copy key="copy" className="size-4" />}
        </button>
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.label}
          hidden={i !== active}
          dangerouslySetInnerHTML={{ __html: t.html }}
          className="[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:p-4 [&_pre]:text-sm"
        />
      ))}
    </div>
  )
}
