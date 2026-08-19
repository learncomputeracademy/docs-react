// Mega-menu grouping for the two multi-child nav parents (Docs, Tools).
// EXPERIMENT (see components/site-nav.tsx MEGAMENU_ENABLED) — flip that flag
// to false to revert the whole site to the old flat dropdown instantly.
//
// Grouping + icons + hints below are hand-authored (no such data exists in
// nav_items), keyed by url so it survives id churn. Any child url not found
// in a group falls into an auto "More" bucket — a new nav_items row added
// later still renders, just ungrouped, instead of silently vanishing.
import type { LucideIcon } from 'lucide-react'
import {
  Cpu, Palette, Image as ImageIcon, Code2, BrainCircuit, FileCode, Paintbrush, Braces, Atom,
  Server, Database, Layout, Terminal, Hexagon, Cloud, Megaphone, Search, Briefcase,
  FileSpreadsheet, Frame, HandCoins,
  Box, Layers, Blend, LayoutGrid, Columns3, Pipette, ScrollText, Calculator, Ruler,
  ArrowLeftRight, Play, SlidersHorizontal, Eye, Paintbrush2, Type, ImagePlus, Video,
  NotebookPen, Binary, Workflow, Repeat, Boxes, MoreHorizontal,
} from 'lucide-react'
import type { NavNode, NavItem } from '@/lib/content'

interface ItemMeta { icon: LucideIcon; hint: string }
interface GroupDef { title: string; icon: LucideIcon; urls: string[] }

const ITEM_META: Record<string, ItemMeta> = {
  '/basics': { icon: Cpu, hint: 'How computers actually work' },
  '/programming': { icon: Code2, hint: 'Logic before any one language' },
  '/ai': { icon: BrainCircuit, hint: 'What AI is and isn’t' },
  '/html': { icon: FileCode, hint: 'Structure every page starts with' },
  '/css': { icon: Paintbrush, hint: 'Styling, layout, responsive design' },
  '/javascript': { icon: Braces, hint: 'Make pages do things' },
  '/react': { icon: Atom, hint: 'Components and modern UI' },
  '/design': { icon: Palette, hint: 'Color, type, layout fundamentals' },
  '/photoshop': { icon: ImageIcon, hint: 'Image editing, hands-on' },
  '/php': { icon: Server, hint: 'Server-side scripting basics' },
  '/python': { icon: Terminal, hint: 'A friendly first real language' },
  '/nodejs': { icon: Hexagon, hint: 'JavaScript on the server' },
  '/sql': { icon: Database, hint: 'Querying and shaping data' },
  '/wordpress': { icon: Layout, hint: 'Sites without writing a backend' },
  '/hosting': { icon: Cloud, hint: 'Getting a project actually live' },
  '/marketing': { icon: Megaphone, hint: 'Reaching people once it’s live' },
  '/seo': { icon: Search, hint: 'Getting found on Google' },
  '/career': { icon: Briefcase, hint: 'Portfolio, resume, interviews' },
  '/office': { icon: FileSpreadsheet, hint: 'Word, Excel, PowerPoint basics' },
  '/figma': { icon: Frame, hint: 'Interface design and prototyping' },
  '/ui-ux': { icon: Layers, hint: 'Design principles behind good UI' },
  '/mongodb': { icon: Database, hint: 'A NoSQL database, hands-on' },
  '/freelancing': { icon: HandCoins, hint: 'Finding clients, getting paid' },

  '/tools/box-model': { icon: Box, hint: 'Padding, border, margin, visually' },
  '/tools/box-shadow-generator': { icon: Layers, hint: 'Build a shadow, copy the CSS' },
  '/tools/gradient': { icon: Blend, hint: 'Linear, radial, conic gradients' },
  '/tools/grid': { icon: LayoutGrid, hint: 'CSS Grid, built visually' },
  '/tools/clamp': { icon: Ruler, hint: 'Fluid sizing without media queries' },
  '/tools/animation': { icon: Play, hint: 'Keyframes + easing, live preview' },
  '/tools/filters': { icon: SlidersHorizontal, hint: 'Stack CSS filters visually' },
  '/tools/flexbox': { icon: Columns3, hint: 'Flexbox, built visually' },
  '/tools/colour': { icon: Pipette, hint: 'Contrast ratios + palettes' },
  '/tools/scrollbar': { icon: ScrollText, hint: 'Custom scrollbar styling' },
  '/tools/specificity': { icon: Calculator, hint: 'Which selector actually wins' },
  '/tools/shades': { icon: Paintbrush2, hint: 'Tints and shades from one color' },
  '/tools/colorblind': { icon: Eye, hint: 'Preview color-vision deficiencies' },
  '/tools/units': { icon: ArrowLeftRight, hint: 'px, rem, em, % conversions' },
  '/tools/lorem-text': { icon: Type, hint: 'Placeholder text, your way' },
  '/tools/lorem-image': { icon: ImagePlus, hint: 'Placeholder images on demand' },
  '/tools/lorem-video': { icon: Video, hint: 'Placeholder video clips' },
  '/tools/notepad': { icon: NotebookPen, hint: 'Quick scratchpad, saved locally' },
  '/tools/event-loop': { icon: Workflow, hint: 'Watch the call stack run' },
  '/tools/recursion': { icon: Repeat, hint: 'See a call tree unwind' },
  '/tools/scope-closure': { icon: Boxes, hint: 'Where a variable actually lives' },
  '/tools/number-system': { icon: Binary, hint: 'Binary, hex, decimal conversions' },
}

const DOCS_GROUPS: GroupDef[] = [
  { title: 'Foundations', icon: Cpu, urls: ['/basics', '/programming', '/ai', '/office'] },
  { title: 'Web Development', icon: Code2, urls: ['/html', '/css', '/javascript', '/react'] },
  { title: 'Design', icon: Palette, urls: ['/design', '/photoshop', '/figma', '/ui-ux'] },
  { title: 'Backend & Data', icon: Database, urls: ['/php', '/python', '/nodejs', '/sql', '/mongodb', '/wordpress'] },
  { title: 'Grow & Deploy', icon: Cloud, urls: ['/hosting', '/marketing', '/seo', '/career', '/freelancing'] },
]

const TOOLS_GROUPS: GroupDef[] = [
  { title: 'CSS Generators', icon: Palette, urls: ['/tools/box-model', '/tools/box-shadow-generator', '/tools/gradient', '/tools/grid', '/tools/clamp', '/tools/animation', '/tools/filters'] },
  { title: 'Layout & Color', icon: Layers, urls: ['/tools/flexbox', '/tools/colour', '/tools/scrollbar', '/tools/specificity', '/tools/shades', '/tools/colorblind', '/tools/units'] },
  { title: 'Generators', icon: Type, urls: ['/tools/lorem-text', '/tools/lorem-image', '/tools/lorem-video', '/tools/notepad'] },
  { title: 'JS Visualizers', icon: Workflow, urls: ['/tools/event-loop', '/tools/recursion', '/tools/scope-closure', '/tools/number-system'] },
]

// Keyed by nav_items.id (verified live 2026-08-19 — Docs/Tools parent rows
// only; every other top-level nav item has no children).
const GROUPS_BY_PARENT_ID: Record<string, GroupDef[]> = {
  'bc658b53-8adf-43ff-9d57-df7d0c70ce9c': DOCS_GROUPS, // Docs
  'dde48d15-effc-4299-8555-c93447cbecf4': TOOLS_GROUPS, // Tools
}

export interface MegaItem extends NavItem { icon: LucideIcon; hint: string }
export interface MegaGroup { title: string; icon: LucideIcon; items: MegaItem[] }

const FALLBACK_ITEM_META: ItemMeta = { icon: MoreHorizontal, hint: '' }

// null when this parent has no configured groups — caller falls back to the
// plain flat dropdown.
export function groupNavChildren(node: NavNode): MegaGroup[] | null {
  const defs = GROUPS_BY_PARENT_ID[node.id]
  if (!defs) return null

  const byUrl = new Map(node.children.map((c) => [c.url, c]))
  const used = new Set<string>()

  const groups: MegaGroup[] = defs
    .map((def) => {
      const items: MegaItem[] = []
      for (const url of def.urls) {
        const child = byUrl.get(url)
        if (!child) continue
        used.add(url)
        const meta = ITEM_META[url] ?? FALLBACK_ITEM_META
        items.push({ ...child, icon: meta.icon, hint: meta.hint })
      }
      return { title: def.title, icon: def.icon, items }
    })
    .filter((g) => g.items.length > 0)

  const rest = node.children.filter((c) => !used.has(c.url))
  if (rest.length > 0) {
    groups.push({
      title: 'More',
      icon: MoreHorizontal,
      items: rest.map((c) => {
        const meta = ITEM_META[c.url] ?? FALLBACK_ITEM_META
        return { ...c, icon: meta.icon, hint: meta.hint }
      }),
    })
  }

  return groups
}
