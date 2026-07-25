import { Cpu, PenTool } from 'lucide-react'
import IconCss from '~icons/logos/css-3'
import IconHtml from '~icons/logos/html-5'
import IconJs from '~icons/logos/javascript'
import IconReact from '~icons/logos/react'
import IconPhotoshop from '~icons/logos/adobe-photoshop'

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  basics: Cpu,
  html: IconHtml,
  css: IconCss,
  javascript: IconJs,
  react: IconReact,
  design: PenTool,
  photoshop: IconPhotoshop,
}
