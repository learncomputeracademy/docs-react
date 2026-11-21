'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="absolute right-1 top-1 rounded-md p-3 text-muted-foreground sm:right-2 sm:top-2 sm:p-1.5 hover:bg-muted hover:text-foreground transition-colors"
      aria-label="Copy code"
    >
      {copied ? <Check key="check" className="size-4 animate-copy-check" /> : <Copy key="copy" className="size-4" />}
    </button>
  )
}
