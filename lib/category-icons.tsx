import IconCss from '~icons/logos/css-3'
import IconHtml from '~icons/logos/html-5'
import IconJs from '~icons/logos/javascript'
import IconReact from '~icons/logos/react'
import IconPhotoshop from '~icons/logos/adobe-photoshop'
import IconPhp from '~icons/logos/php'
import IconPython from '~icons/logos/python'
import IconWordpress from '~icons/selfhst/wordpress'
import IconNodejs from '~icons/logos/nodejs-icon'
import IconMongodb from '~icons/logos/mongodb-icon'
import IconFigma from '~icons/logos/figma'
import { Laptop, Palette, Braces, Sparkles, Database, Search, Megaphone, Briefcase, Server, FileSpreadsheet, Handshake, LayoutTemplate } from 'lucide-react'

// One icon grammar, not five. Real brand-color logos where the subject IS a
// specific technology (forcing HTML's logo to be monochrome would be worse,
// not better — brand recognition is a real asset there). Everywhere the
// subject is a discipline rather than a product, Lucide outline icons —
// already a dependency used elsewhere on this page — instead of the glossy
// "sticker" icon packs (Twemoji, Fluent Color, Streamline) that used to sit
// next to the flat brand logos in the same grid and read as stitched
// together (design critique 2026-08-06, P1).
export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  basics: Laptop,
  html: IconHtml,
  css: IconCss,
  javascript: IconJs,
  react: IconReact,
  php: IconPhp,
  python: IconPython,
  wordpress: IconWordpress,
  design: Palette,
  photoshop: IconPhotoshop,
  programming: Braces,
  ai: Sparkles,
  sql: Database,
  mongodb: IconMongodb,
  nodejs: IconNodejs,
  seo: Search,
  marketing: Megaphone,
  career: Briefcase,
  hosting: Server,
  office: FileSpreadsheet,
  figma: IconFigma,
  freelancing: Handshake,
  'ui-ux': LayoutTemplate,
}
