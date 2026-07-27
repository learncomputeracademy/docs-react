'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function ToolbarButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('rounded p-1.5', active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted')}
    >
      {children}
    </button>
  )
}

export function RichTextBlockEditor({ html, onChange }: { html: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    // Headings disabled here on purpose — extract-docs.mjs pulls headings
    // out into their own block type with anchor-dedup handling; allowing
    // <h2>-<h6> inside richtext would let an admin create a heading that
    // bypasses the anchor system entirely.
    extensions: [StarterKit.configure({ heading: false })],
    content: html,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  function toggleLink() {
    const previous = editor!.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL (empty to remove):', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor!.chain().focus().unsetLink().run()
      return
    }
    editor!.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="rounded-md border">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1.5">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('link')} onClick={toggleLink}>
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none p-3 [&_.ProseMirror]:outline-none" />
    </div>
  )
}
