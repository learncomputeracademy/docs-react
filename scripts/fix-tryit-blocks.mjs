// One-off: convert 4 of the 15 lessons docs/RESEARCH.md §1 originally flagged
// as "needs a decision — live interactive demos" (2026-07-24) into real
// `tryit` blocks. The `tryit` feature itself has been built and wired since
// Stage 6 (D-18/D-19) but had never actually been used on any of the 469
// published lessons — confirmed via a direct DB query before writing this.
//
// Two of these four turned out to be worse than "missing a nice feature":
// css/dropdowns and css/navbar embed raw demo HTML directly in a richtext
// block, styled by classes (.dropdown-content, ul.vertical, etc.) whose
// <style> block the original Jekyll extraction correctly stripped as
// chrome — but the "convert this to tryit" follow-up never happened, so
// today both pages show that demo completely unstyled. html/tag-video's
// embedded preview videos point at /assets/img/movie.mp4, a path that only
// ever existed on the old Jekyll site (assets moved to Cloudinary, D-13) —
// broken 404s in production right now. All three are real, live bugs, not
// just a missing enhancement.
//
// Recovered the original demo CSS from docs-master (read-only Jekyll
// source) for dropdowns/navbar. tag-video's broken source swapped for
// MDN's CC0 sample clip (interactive-examples.mdn.mozilla.net) — small,
// freely embeddable, made for exactly this kind of teaching use.
// css/icons' two code blocks were already clean, complete HTML documents;
// its only real change is swapping a third-party FontAwesome "kit" script
// (account-scoped, would likely fail silently in our sandboxed iframe) for
// FontAwesome's public CDN stylesheet via a CSS @import — same visual
// result, actually works standalone.
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

function tryit(id, files) {
  return { id, type: 'tryit', mode: 'web', files }
}

// ---------- css/dropdowns ----------
const DROPDOWNS_ID = '40bd0c4a-07d9-486e-94c6-19855a440326'
const dropdownsCss = `.dropdown {
  position: relative;
  display: inline-block;
  margin-right: 32px;
}
.dropbtn {
  background-color: #f97316;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.dropdown-content {
  display: none;
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 8px;
  min-width: 150px;
  padding: 12px 16px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.15);
  background-color: #f9f9f9;
  border-radius: 6px;
  text-align: center;
}
.dropdown-content p {
  margin: 0;
}
.dropdown-content2 {
  text-align: left;
}
.dropdown-content2 a {
  display: block;
  color: #111;
  padding: 4px 0;
  text-decoration: none;
}
.dropdown-content2 a:hover {
  color: #f97316;
}
.dropdown:hover .dropdown-content {
  display: block;
}`
const dropdownsHtml = `<div class="dropdown">
  <span>Dropdown Text</span>
  <div class="dropdown-content">
    <p>Hello World!</p>
  </div>
</div>

<div class="dropdown">
  <button class="dropbtn">Dropdown Menu</button>
  <div class="dropdown-content dropdown-content2">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
</div>`

// ---------- css/navbar ----------
const NAVBAR_ID = '7fa19a76-8806-48d5-bc8c-77dc912e1a5e'
const navbarCss = `ul.vertical {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 90%;
  background-color: #f1f1f1;
}
ul.vertical li a {
  display: block;
  color: #000;
  padding: 8px 0 8px 16px;
  text-decoration: none;
}
ul.vertical a.active {
  background-color: #0054D1;
  color: white;
}
ul.vertical li a:hover:not(.active) {
  background-color: #555;
  color: white;
}
ul.horizontal {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}
ul.horizontal li {
  float: left;
}
ul.horizontal li a {
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
ul.horizontal li a.active {
  background-color: #0054D1;
}
ul.horizontal li a:hover:not(.active) {
  background-color: #000;
}
ul.gray {
  border: 1px solid #e7e7e7;
  background-color: #f3f3f3;
}
ul.gray li a {
  display: block;
  color: #666;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
ul.gray li a.active {
  color: white;
  background-color: #008CBA;
}
ul.gray li a:hover:not(.active) {
  background-color: #ddd;
}`
const navbarHtml = `<p>Vertical</p>
<ul class="vertical">
  <li><a class="active" href="#">Home</a></li>
  <li><a href="#">News</a></li>
  <li><a href="#">Contact</a></li>
  <li><a href="#">About</a></li>
</ul>

<p style="margin-top:24px">Horizontal</p>
<ul class="horizontal">
  <li><a class="active" href="#">Home</a></li>
  <li><a href="#">News</a></li>
  <li><a href="#">Contact</a></li>
  <li style="float:right"><a href="#">About</a></li>
</ul>

<br>
<ul class="horizontal gray">
  <li><a href="#">Home</a></li>
  <li><a href="#">News</a></li>
  <li><a class="active" href="#">Contact</a></li>
  <li style="float:right"><a href="#">About</a></li>
</ul>`

// ---------- css/icons ----------
const ICONS_ID = '3aba60f3-9aef-4baa-8b67-c6dc427f9088'
const fontAwesomeBlockId = 'WzUBNW5VM1uD'
const materialIconsBlockId = 'iBgu2bhDtjnh'
const fontAwesomeCss = `@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css");
i { font-size: 32px; margin-right: 20px; color: #f97316; }`
const fontAwesomeHtml = `<i class="fas fa-cloud"></i>
<i class="fas fa-heart"></i>
<i class="fas fa-car"></i>
<i class="fas fa-file"></i>
<i class="fas fa-bars"></i>`
const materialCss = `@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
.material-icons { font-size: 32px; margin-right: 20px; color: #f97316; }`
const materialHtml = `<i class="material-icons">cloud</i>
<i class="material-icons">favorite</i>
<i class="material-icons">attachment</i>
<i class="material-icons">computer</i>
<i class="material-icons">traffic</i>`

// ---------- html/tag-video ----------
const TAGVIDEO_ID = 'a448e196-a9a5-412f-921c-8c1c7d5b3907'
const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const controlsBlockId = 'w-mvMpYnWvHK'
const scriptBlockId = 'KrkeniUePKGq'
const tagVideoHtml = `<div style="text-align:center">
  <button onclick="playPause()">Play/Pause</button>
  <button onclick="makeBig()">Big</button>
  <button onclick="makeSmall()">Small</button>
  <button onclick="makeNormal()">Normal</button>
  <br><br>
  <video id="video1" width="420">
    <source src="${SAMPLE_VIDEO}" type="video/mp4">
    Your browser does not support HTML5 video.
  </video>
</div>`
const tagVideoJs = `var myVideo = document.getElementById("video1");
function playPause() {
  if (myVideo.paused)
    myVideo.play();
  else
    myVideo.pause();
}
function makeBig() {
  myVideo.width = 560;
}
function makeSmall() {
  myVideo.width = 320;
}
function makeNormal() {
  myVideo.width = 420;
}`

async function updateBlocks(id, path, transform) {
  const { data, error } = await supabase.from('docs').select('blocks').eq('id', id).single()
  if (error) throw error
  const newBlocks = transform(data.blocks)
  const { error: updError } = await supabase.from('docs').update({ blocks: newBlocks }).eq('id', id)
  if (updError) throw updError
  console.log('Updated', path, '—', newBlocks.length, 'blocks')
}

await updateBlocks(DROPDOWNS_ID, 'css/dropdowns', (blocks) =>
  blocks.map((b) => (b.id === 'JqImgAESHwOj' ? tryit(b.id, { html: dropdownsHtml, css: dropdownsCss }) : b))
)

await updateBlocks(NAVBAR_ID, 'css/navbar', (blocks) =>
  blocks.map((b) => (b.id === 'Ksn8Jjt0_oJH' ? tryit(b.id, { html: navbarHtml, css: navbarCss }) : b))
)

await updateBlocks(ICONS_ID, 'css/icons', (blocks) =>
  blocks.map((b) => {
    if (b.id === fontAwesomeBlockId) return tryit(b.id, { html: fontAwesomeHtml, css: fontAwesomeCss })
    if (b.id === materialIconsBlockId) return tryit(b.id, { html: materialHtml, css: materialCss })
    return b
  })
)

await updateBlocks(TAGVIDEO_ID, 'html/tag-video', (blocks) => {
  const withoutScript = blocks.filter((b) => b.id !== scriptBlockId)
  return withoutScript.map((b) => {
    // Fix the two broken /assets/img/movie.mp4 refs embedded directly in
    // richtext (the old Jekyll asset path, never migrated).
    if (typeof b.html === 'string' && b.html.includes('/assets/img/movie.mp4')) {
      return {
        ...b,
        html: b.html
          .replace(/<source src="\/assets\/img\/movie\.mp4"[^>]*>\s*/g, `<source src="${SAMPLE_VIDEO}" type="video/mp4">\n`)
          .replace(/<source src="\/assets\/img\/movie\.ogg"[^>]*>\s*/g, ''),
      }
    }
    if (b.id === controlsBlockId) return tryit(b.id, { html: tagVideoHtml, js: tagVideoJs })
    return b
  })
})

console.log('Done.')
