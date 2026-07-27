'use client'

import { X } from 'lucide-react'

export function TableBlockEditor({
  header,
  rows,
  caption,
  onChange,
}: {
  header: string[]
  rows: string[][]
  caption?: string
  onChange: (patch: { header?: string[]; rows?: string[][]; caption?: string }) => void
}) {
  function updateHeaderCell(i: number, value: string) {
    const next = [...header]
    next[i] = value
    onChange({ header: next })
  }
  function updateRowCell(r: number, c: number, value: string) {
    const next = rows.map((row) => [...row])
    next[r][c] = value
    onChange({ rows: next })
  }
  function addColumn() {
    onChange({ header: [...header, ''], rows: rows.map((row) => [...row, '']) })
  }
  function removeColumn(i: number) {
    onChange({ header: header.filter((_, idx) => idx !== i), rows: rows.map((row) => row.filter((_, idx) => idx !== i)) })
  }
  function addRow() {
    onChange({ rows: [...rows, header.map(() => '')] })
  }
  function removeRow(r: number) {
    onChange({ rows: rows.filter((_, idx) => idx !== r) })
  }

  return (
    <div className="space-y-2 rounded-md border p-3">
      <input
        value={caption ?? ''}
        onChange={(e) => onChange({ caption: e.target.value || undefined })}
        placeholder="Caption (optional)"
        className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {header.map((h, i) => (
                <th key={i} className="border p-1">
                  <div className="flex items-center gap-1">
                    <input value={h} onChange={(e) => updateHeaderCell(i, e.target.value)} className="w-full min-w-24 bg-background px-1 py-0.5 text-sm font-medium" />
                    <button type="button" onClick={() => removeColumn(i)} aria-label="Remove column" className="shrink-0 text-muted-foreground hover:text-destructive">
                      <X className="size-3.5" />
                    </button>
                  </div>
                </th>
              ))}
              <th className="border p-1">
                <button type="button" onClick={addColumn} className="whitespace-nowrap px-1 text-xs text-primary hover:underline">+ column</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border p-1">
                    <input value={cell} onChange={(e) => updateRowCell(r, c, e.target.value)} className="w-full min-w-24 bg-background px-1 py-0.5 text-sm" />
                  </td>
                ))}
                <td className="border p-1 text-center">
                  <button type="button" onClick={() => removeRow(r)} aria-label="Remove row" className="text-muted-foreground hover:text-destructive">
                    <X className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={addRow} className="text-xs text-primary hover:underline">+ row</button>
    </div>
  )
}
