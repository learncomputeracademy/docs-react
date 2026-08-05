import IconCss from '~icons/logos/css-3'
import IconHtml from '~icons/logos/html-5'
import IconJs from '~icons/logos/javascript'
import IconReact from '~icons/logos/react'
import IconPhotoshop from '~icons/logos/adobe-photoshop'
import IconPhp from '~icons/logos/php'
import IconPython from '~icons/logos/python'
import IconWordpress from '~icons/selfhst/wordpress'
import IconBasics from '~icons/twemoji/laptop'
import IconDesign from '~icons/fluent-color/design-ideas-48'
import IconProgramming from '~icons/streamline-stickies-color/programming-duo'
import IconAi from '~icons/streamline-color/artificial-intelligence-spark'
import IconSql from '~icons/streamline-plump-color/database'
import IconNodejs from '~icons/logos/nodejs-icon'
import IconSeo from '~icons/streamline-plump-color/file-search'
import IconMarketing from '~icons/streamline-plump-color/announcement-megaphone'
import IconCareer from '~icons/streamline-color/business-handshake'

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  programming: IconProgramming,
  basics: IconBasics,
  html: IconHtml,
  css: IconCss,
  javascript: IconJs,
  react: IconReact,
  php: IconPhp,
  python: IconPython,
  wordpress: IconWordpress,
  design: IconDesign,
  photoshop: IconPhotoshop,
  sql: IconSql,
  ai: IconAi,
  nodejs: IconNodejs,
  seo: IconSeo,
  marketing: IconMarketing,
  career: IconCareer,
}
