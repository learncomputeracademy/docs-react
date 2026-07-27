#!/usr/bin/env node
// scripts/seed-resources.mjs
// Ports the old Jekyll site's /resourses/ page content (docs-master/
// docs-master/_data/resources.yml) into the `resources` table so the new
// /resources page isn't empty. Idempotent — skips any (name, url) pair
// that already exists, safe to re-run.
//
// Two source bugs fixed here rather than replicated:
//  - "Visit" was the literal `name` for the first design_uis entry
//    (url: https://vectr.com/) — an obvious copy-paste artifact, not a
//    deliberate label. Corrected to "Vectr".
//  - Two identical Tinypng rows under free_images — deduped to one.
//
// No thumbnail_url: the old thumbnails live at docs.learncomputer.in/
// assets/img/preview-N.png, on the OLD Jekyll deploy of this same domain
// (still live today, pre-cutover) — hotlinking them would 404 the moment
// this project takes over the domain, since those files were never
// migrated into Cloudinary (CLAUDE.md: the 216MB of images never enters
// this repo). Admin can attach real thumbnails later via Media upload.
//
// Usage: node scripts/seed-resources.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const DRY_RUN = process.argv.includes('--dry-run')

async function loadEnv() {
  const text = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

const GROUPS = {
  'Free Images': [
    ['Freepik', 'https://www.freepik.com/'],
    ['Pexels', 'https://www.pexels.com'],
    ['Unsplash', 'https://unsplash.com/'],
    ['Burst', 'https://burst.shopify.com/'],
    ['Pixelmobs', 'https://pixelmob.co/'],
    ['Undraw', 'https://undraw.co/illustrations'],
    ['Tinypng', 'https://tinypng.com/'],
    ['Pixabay', 'https://www.pixabay.com'],
    ['CleanPNG', 'https://www.cleanpng.com/'],
    ['Fuzzimo', 'http://www.fuzzimo.com/'],
    ['Photopea', 'https://www.photopea.com/'],
    ['Graphic Burger', 'https://graphicburger.com/mock-ups/'],
    ['Pixeden', 'https://www.pixeden.com/'],
    ['Mockup World', 'https://www.mockupworld.co/all-mockups/'],
  ],
  'Colors': [
    ['Coolors', 'https://coolors.co/'],
    ['Adobe Color', 'https://color.adobe.com/create'],
    ['Flat UI Colors', 'https://flatuicolors.com/'],
    ['Color Space', 'https://mycolor.space/'],
    ['Color Hunt', 'https://colorhunt.co/'],
    ['Color Mind', 'http://colormind.io/bootstrap/'],
    ['Color Hexa', 'https://www.colorhexa.com/'],
    ['Canva', 'https://www.canva.com/learn/brand-color-palette/'],
  ],
  'Free Icons': [
    ['Flaticon', 'https://www.flaticon.com/'],
    ['Iconfinder', 'https://www.iconfinder.com/'],
    ['Noun Project', 'https://thenounproject.com/'],
    ['Icon Monstr', 'https://iconmonstr.com/'],
    ['Material Icons', 'https://zavoloklom.github.io/material-design-iconic-font/icons.html'],
    ['Icons 8', 'https://icons8.com/'],
    ['Preloaders', 'https://icons8.com/preloaders'],
    ['Iconify for HTML', 'https://iconify.design/icon-sets/'],
  ],
  'Free Fonts': [
    ['Google Fonts', 'https://fonts.google.com/'],
    ['Dafont', 'https://www.dafont.com/'],
    ['1001 Fonts', 'https://www.1001fonts.com/'],
    ['Font Squirrel', 'https://www.fontsquirrel.com/'],
    ['Font Awesome 4.7.0', 'https://fontawesome.com/v4.7.0/icons/'],
    ['Font Awesome 5.15.1', 'https://fontawesome.com/'],
    ['Fontstruct', 'https://fontstruct.com/'],
    ['Abstract Fonts', 'http://www.abstractfonts.com/'],
    ['Font Zone', 'https://fontzone.net/'],
    ['Goo Fonts', 'https://goofonts.com/'],
    ['Boxicons', 'https://boxicons.com/'],
  ],
  'Lorem Ipsum': [
    ['Lorem Ipsum', 'https://www.lipsum.com/'],
  ],
  'Webfont Generators': [
    ['Transfonter', 'https://transfonter.org/'],
    ['Web Font Generator', 'https://www.web-font-generator.com/'],
  ],
  'W3Schools': [
    ['W3School HTML', 'https://www.w3schools.com/html/'],
    ['W3School CSS', 'https://www.w3schools.com/css/default.asp'],
    ['W3School Bootstrap 5', 'https://www.w3schools.com/bootstrap5/index.php'],
  ],
  'CSS Generators': [
    ['Shadow Generator', 'https://www.cssmatic.com/box-shadow'],
    ['Triangle Generator', 'http://apps.eky.hk/css-triangle-generator/'],
    ['Gradient Generator', 'https://www.cssmatic.com/gradient-generator'],
    ['Hover Master', 'https://ianlunn.github.io/Hover/'],
    ['Animate CSS', 'https://daneden.github.io/animate.css/'],
    ['CSS Effects', 'https://cssfx.dev/'],
    ['CSS Grid', 'https://css-tricks.com/snippets/css/complete-guide-grid/'],
    ['Animated Hamburgers', 'https://jonsuh.com/hamburgers/'],
    ['Fancy Border Radius', 'https://9elements.github.io/fancy-border-radius/'],
    ['Text Input Effects', 'https://tympanus.net/Development/TextInputEffects/'],
    ['CSS Development', 'https://www.outpan.com/'],
    ['Animista', 'http://animista.net/'],
    ['The AppGuruz', 'https://www.theappguruz.com/tag-tools/web/CSSAnimations/'],
    ['Image Hover', 'https://imagehover.io/'],
    ['Gradient Background', 'https://tutuldevs.hashnode.dev/alt-of-img'],
  ],
  'JavaScript Libraries': [
    ['W3Schools JavaScript', 'https://www.w3schools.com/js/default.asp'],
    ['W3Schools jQuery', 'https://www.w3schools.com/jquery/default.asp'],
    ['Owl Carousel 2', 'https://owlcarousel2.github.io/OwlCarousel2/'],
    ['Slick Slider', 'https://kenwheeler.github.io/slick/'],
    ['Responsive Slider', 'http://responsiveslides.com/'],
    ['AOS', 'https://michalsnik.github.io/aos/'],
    ['Tilt Js', 'https://gijsroge.github.io/tilt.js/'],
    ['Cleave Js', 'https://nosir.github.io/cleave.js/'],
    ['Slide Menu', 'https://oncebot.github.io/pushbar.js/'],
    ['Full Page', 'https://alvarotrigo.com/fullPage/'],
    ['Rellax Js', 'https://dixonandmoe.com/rellax/'],
    ['Scroll To Top', 'https://www.scrolltotop.com/'],
    ['Metis Menu', 'https://open.med.harvard.edu/stash/projects/SHRINE/repos/shrine/browse/apps/steward-app/src/main/js/bower_components/metisMenu?at=0f6215c6fe3'],
    ['Granim Js', 'https://sarcadass.github.io/granim.js/examples.html'],
    ['WOW Js', 'https://wowjs.uk/'],
    ['Fancybox', 'http://fancyapps.com/fancybox/3/'],
    ['Accordion', 'https://jqueryui.com/accordion/#default'],
    ['Swiper Slider', 'https://idangero.us/swiper/demos/'],
    ['Particle Js', 'https://vincentgarreau.com/particles.js/'],
    ['Parallax Js', 'https://matthew.wagerfield.com/parallax/'],
    ['Simple Parallax Js', 'https://simpleparallax.com/'],
    ['MultiScroll Js', 'https://alvarotrigo.com/multiScroll/'],
    ['Scroll Me Js', 'http://scrollme.nckprsn.com/'],
    ['JavaScripting', 'https://www.javascripting.com'],
  ],
  'Design & UI': [
    ['Vectr', 'https://vectr.com/'], // was mislabeled "Visit" in the source
    ['Clever Brush', 'https://www.cleverbrush.com/'],
    ['Figma', 'https://www.figma.com/'],
    ['Whimsical', 'https://whimsical.com/'],
    ['Mindmup', 'https://www.mindmup.com/'],
    ['All The Freestock', 'https://allthefreestock.com/'],
    ['Code My UI', 'https://codemyui.com/'],
    ['Landen', 'https://www.landen.co/'],
  ],
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: existing, error: existingError } = await supabase.from('resources').select('name, url')
  if (existingError) throw existingError
  const existingKeys = new Set((existing ?? []).map((r) => `${r.name}::${r.url}`))

  const report = { inserted: [], skipped: [] }

  for (const [groupName, items] of Object.entries(GROUPS)) {
    const { count } = await supabase
      .from('resources')
      .select('id', { count: 'exact', head: true })
      .eq('group_name', groupName)
    let nextOrder = (count ?? 0) + 1

    for (const [name, url] of items) {
      const key = `${name}::${url}`
      if (existingKeys.has(key)) {
        report.skipped.push(`${groupName} / ${name}`)
        continue
      }
      if (DRY_RUN) {
        report.inserted.push(`${groupName} / ${name} (dry-run)`)
        continue
      }
      const { error } = await supabase.from('resources').insert({
        group_name: groupName,
        name,
        url,
        thumbnail_url: null,
        sort_order: nextOrder++,
      })
      if (error) throw error
      report.inserted.push(`${groupName} / ${name}`)
    }
  }

  console.log(`Inserted: ${report.inserted.length}`)
  console.log(`Skipped (already present): ${report.skipped.length}`)
  await fs.mkdir(new URL('./reports/', import.meta.url), { recursive: true })
  await fs.writeFile(
    new URL('./reports/seed-resources.json', import.meta.url),
    JSON.stringify(report, null, 2)
  )
  console.log('Full report written to scripts/reports/seed-resources.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
