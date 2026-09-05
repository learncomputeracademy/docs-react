import IconCss from '~icons/simple-icons/css3'
import IconHtml from '~icons/simple-icons/html5'
import IconJs from '~icons/simple-icons/javascript'
import IconReact from '~icons/simple-icons/react'
import IconPhotoshop from '~icons/simple-icons/adobephotoshop'
import IconPhp from '~icons/simple-icons/php'
import IconPython from '~icons/simple-icons/python'
import IconWordpress from '~icons/simple-icons/wordpress'
import IconNodejs from '~icons/simple-icons/nodedotjs'
import IconMongodb from '~icons/simple-icons/mongodb'
import IconFigma from '~icons/simple-icons/figma'
import IconGit from '~icons/simple-icons/git'
import { Laptop, Palette, Braces, Sparkles, Database, Search, Megaphone, Briefcase, Server, FileSpreadsheet, Handshake, LayoutTemplate, ShieldCheck } from 'lucide-react'

// One icon grammar — literally one color. Was brand-color logos (`logos`
// collection) for the tech icons, tinted-orange Lucide glyphs for
// disciplines (2026-08-06 decision) — deliberate at the time, but the user
// later said the multicolor logos (React's teal, JS's yellow, HTML's
// orange-red, CSS's blue) read as inconsistent against the rest of the
// site's one-accent-color rule. Switched every brand mark to `simple-icons`
// (monochrome, single-path, fill="currentColor" by design — built for
// exactly this: recoloring to match a UI's accent) so `text-primary` on the
// icon-badge wrapper now recolors brand logos the same way it already did
// the Lucide glyphs. No more two icon systems in the same grid.
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
  cybersecurity: ShieldCheck,
  git: IconGit,
}
