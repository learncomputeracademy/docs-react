#!/usr/bin/env node
// Extends the existing "WordPress" category (26 lessons, D-65 — deliberately
// scoped to custom classic theme development, no Gutenberg/Block themes, no
// page builders, no plugin-dev deep dive) with 5 more lessons covering real
// gaps found against a roadmap.sh "WordPress" roadmap PDF the user shared
// 2026-09-03 — asked "are all the topics in this pdf regarding wordpress
// covered". That PDF is a full WordPress *developer* roadmap (Block themes,
// FSE, REST API, OOP/Composer for WP, security hardening, performance,
// hosting/DevOps, headless WP, multisite, WP-CLI, career growth) — nearly
// all of it is out of the D-65 scope on purpose, not a gap.
//
// The 5 gaps found are still squarely inside the theme-development scope
// already chosen: add_action()/add_filter() are already USED incidentally
// in functions-php-setup, enqueuing-assets, customizer, and
// navigation-menus, but the hook system itself (actions vs. filters,
// defining your own with do_action()/apply_filters()) is never explained —
// same "used but never taught" pattern found in the html/css/php gap
// batches this session. Shortcodes, child themes, widgets, and nonces
// (the input-side counterpart to the existing escaping-sanitizing lesson's
// output-side security) are missing entirely. User picked "build all 5"
// over AskUserQuestion.
//
// Style: matches this category's own modern house style (moderate prose,
// code examples, callouts — see wordpress/escaping-sanitizing). Bengali
// matches this category's script-transliteration convention, verified
// against that same lesson's bn translation.
//
// sort_order continues from 27 (existing max is 26).
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-wordpress-gap-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders (same shape as every other content script) ───────────

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, source) { return { id: nanoid(12), type: 'code', language, code: source, runnable: false } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []
let n = 27

// ═══ 1. HOOKS — ACTIONS & FILTERS ═════════════════════════════════════════

lessons.push({
  slug: 'wordpress-hooks-actions-and-filters', sortOrder: n++,
  en: {
    title: 'WordPress Hooks — Actions and Filters',
    metaTitle: 'WordPress Hooks — Actions and Filters | Learn Computer Academy',
    metaDescription: "The system behind almost every functions.php snippet in this course — how actions and filters work, and how to define a custom hook of your own.",
    blocks: [
      p('<p>Nearly every earlier lesson\'s <code>functions.php</code> code used <code>add_action()</code> — enqueuing assets, registering a menu, setting up theme support — without fully explaining the system underneath it. This lesson covers that system directly: WordPress\'s <b>hooks</b>, the mechanism that lets a theme (or plugin) run code at a specific point without editing WordPress\'s own core files.</p>'),
      h(2, 'Two Kinds of Hooks'),
      table(['Hook type', 'Purpose', 'Registered with'], [
        ['Action', 'Run some code at a specific point — no return value expected', 'add_action()'],
        ['Filter', 'Modify a piece of data and hand it back — always returns a value', 'add_filter()'],
      ]),
      h(2, 'An Action — Run Code at a Specific Moment'),
      code('php', '// functions.php\nfunction wgh_setup_theme() {\n    add_theme_support(\'post-thumbnails\');\n}\nadd_action(\'after_setup_theme\', \'wgh_setup_theme\');'),
      p('<p><code>after_setup_theme</code> is the hook name — a specific moment WordPress reaches during every page load. <code>add_action()</code> attaches <code>wgh_setup_theme</code> to run at that exact moment.</p>'),
      h(2, 'A Filter — Modify a Value and Return It'),
      p('<p>Unlike an action, a filter\'s function always receives a value and must return one — often the same value, changed.</p>'),
      code('php', '// Shorten every post excerpt to 15 words instead of the default 55\nfunction wgh_shorter_excerpt($length) {\n    return 15;\n}\nadd_filter(\'excerpt_length\', \'wgh_shorter_excerpt\');'),
      h(2, 'Defining a Custom Hook — do_action() and apply_filters()'),
      p('<p>Themes and plugins don\'t just use WordPress\'s built-in hooks — they can define their own, letting other code (a child theme, a plugin) extend a specific point without editing the original file.</p>'),
      code('php', '// Inside your theme\'s header.php, right after <body>\ndo_action(\'wgh_after_body_open\');\n\n// Anywhere else — a child theme\'s functions.php, for example —\n// this now runs automatically at that exact point:\nadd_action(\'wgh_after_body_open\', function () {\n    echo \'<div class="announcement-bar">Free shipping this week!</div>\';\n});'),
      h(2, 'Removing a Hooked Function'),
      p('<p><code>remove_action()</code> and <code>remove_filter()</code> undo a hook — useful when a parent theme\'s behavior needs to be disabled from a child theme, covered in the next lesson.</p>'),
      code('php', 'remove_action(\'wp_head\', \'wp_generator\');   // hides the WordPress version number from the page source'),
      callout('tip', '<p>A fast way to spot which hook to use for a given task: search the specific WordPress or plugin function\'s entry on developer.wordpress.org — its "Hooks" section lists every action and filter that fires inside it.</p>', 'Finding the right hook name'),
    ],
  },
  bn: {
    title: 'WordPress Hook — Action ও Filter',
    metaTitle: 'WordPress Hook — Action ও Filter | Learn Computer Academy',
    metaDescription: 'এই কোর্সের প্রায় প্রতিটি functions.php snippet-এর পেছনের system — action আর filter কীভাবে কাজ করে, আর কীভাবে নিজের একটি custom hook define করবেন।',
    blocks: [
      p('<p>আগের প্রায় প্রতিটি lesson-এর <code>functions.php</code> কোড <code>add_action()</code> ব্যবহার করেছে — asset enqueue করা, একটি menu register করা, theme support সেট আপ করা — এর পেছনের system সম্পূর্ণভাবে ব্যাখ্যা না করেই। এই lesson সরাসরি সেই system কভার করে: WordPress-এর <b>hook</b>, যে mechanism একটি theme-কে (বা plugin) WordPress-এর নিজের core file edit না করেই একটি নির্দিষ্ট পয়েন্টে কোড চালাতে দেয়।</p>'),
      h(2, 'দুই ধরনের Hook', 'দুই-ধরনের-hook'),
      table(['Hook ধরন', 'উদ্দেশ্য', 'যা দিয়ে register হয়'], [
        ['Action', 'একটি নির্দিষ্ট পয়েন্টে কিছু কোড চালান — কোনো return value আশা করা হয় না', 'add_action()'],
        ['Filter', 'একটি data-র অংশ modify করে ফিরিয়ে দিন — সবসময় একটি মান return করে', 'add_filter()'],
      ]),
      h(2, 'একটি Action — একটি নির্দিষ্ট মুহূর্তে কোড চালানো', 'একটি-action-একটি-নির্দিষ্ট-মুহূর্তে-কোড-চালানো'),
      code('php', '// functions.php\nfunction wgh_setup_theme() {\n    add_theme_support(\'post-thumbnails\');\n}\nadd_action(\'after_setup_theme\', \'wgh_setup_theme\');'),
      p('<p><code>after_setup_theme</code> hook নাম — প্রতিটি page load-এর সময় WordPress পৌঁছায় এমন একটি নির্দিষ্ট মুহূর্ত। <code>add_action()</code> ঠিক সেই মুহূর্তে চালাতে <code>wgh_setup_theme</code>-কে যুক্ত করে।</p>'),
      h(2, 'একটি Filter — একটি মান Modify করে Return করা', 'একটি-filter-একটি-মান-modify-করে-return-করা'),
      p('<p>একটি action-এর মতো না, একটি filter-এর function সবসময় একটি মান পায় আর একটি ফেরত দিতে হয় — প্রায়ই একই মান, বদলে যাওয়া।</p>'),
      code('php', '// প্রতিটি post excerpt-কে default 55-এর বদলে 15 শব্দে ছোট করুন\nfunction wgh_shorter_excerpt($length) {\n    return 15;\n}\nadd_filter(\'excerpt_length\', \'wgh_shorter_excerpt\');'),
      h(2, 'একটি Custom Hook Define করা — do_action() ও apply_filters()', 'একটি-custom-hook-define-করা-do_action-ও-apply_filters'),
      p('<p>Theme আর plugin শুধু WordPress-এর built-in hook ব্যবহার করে না — এগুলো নিজেরটাও define করতে পারে, অন্য কোডকে (একটি child theme, একটি plugin) আসল file edit না করে একটি নির্দিষ্ট পয়েন্ট extend করতে দেয়।</p>'),
      code('php', '// আপনার theme-এর header.php-এর ভেতরে, <body>-এর ঠিক পরে\ndo_action(\'wgh_after_body_open\');\n\n// অন্য যেকোনো জায়গায় — যেমন একটি child theme-এর functions.php —\n// এটা এখন স্বয়ংক্রিয়ভাবে ঠিক সেই পয়েন্টে চলে:\nadd_action(\'wgh_after_body_open\', function () {\n    echo \'<div class="announcement-bar">Free shipping this week!</div>\';\n});'),
      h(2, 'একটি Hooked Function সরানো', 'একটি-hooked-function-সরানো'),
      p('<p><code>remove_action()</code> আর <code>remove_filter()</code> একটি hook undo করে — পরের lesson-এ কভার করা, একটি child theme থেকে একটি parent theme-এর behavior disable করা দরকার হলে useful।</p>'),
      code('php', 'remove_action(\'wp_head\', \'wp_generator\');   // পেজ source থেকে WordPress version number লুকায়'),
      callout('tip', '<p>একটি নির্দিষ্ট কাজের জন্য কোন hook ব্যবহার করবেন তা খুঁজে বের করার দ্রুত উপায়: developer.wordpress.org-এ নির্দিষ্ট WordPress বা plugin function-এর entry search করুন — এর "Hooks" section এর ভেতরে fire হওয়া প্রতিটি action আর filter list করে।</p>', 'সঠিক hook নাম খুঁজে বের করা'),
    ],
  },
})

// ═══ 2. SHORTCODES ═════════════════════════════════════════════════════════

lessons.push({
  slug: 'shortcodes', sortOrder: n++,
  en: {
    title: 'WordPress Shortcodes',
    metaTitle: 'WordPress Shortcodes | Learn Computer Academy',
    metaDescription: "Registering a custom [bracket] shortcode that outputs reusable HTML, so an editor typing into a post never needs to touch PHP.",
    blocks: [
      p('<p>A <b>shortcode</b> is a small bracketed tag — <code>[shortcode]</code> — typed directly into a post or page\'s content, which WordPress replaces with dynamically generated HTML when the page renders. It\'s a way to hand a piece of reusable PHP output to an editor who never touches code.</p>'),
      h(2, 'Registering a Basic Shortcode'),
      code('php', '// functions.php\nfunction wgh_year_shortcode() {\n    return date(\'Y\');\n}\nadd_shortcode(\'current_year\', \'wgh_year_shortcode\');\n\n// Typed into a post: © [current_year] My Site\n// Rendered on the page: © 2026 My Site'),
      h(2, 'Accepting Attributes'),
      p('<p>A shortcode can accept attributes, just like an HTML tag — <code>shortcode_atts()</code> merges them with sensible defaults.</p>'),
      code('php', 'function wgh_button_shortcode($atts) {\n    $atts = shortcode_atts([\n        \'text\' => \'Click Here\',\n        \'url\'  => \'#\',\n    ], $atts);\n\n    return sprintf(\n        \'<a class="button" href="%s">%s</a>\',\n        esc_url($atts[\'url\']),\n        esc_html($atts[\'text\'])\n    );\n}\nadd_shortcode(\'button\', \'wgh_button_shortcode\');\n\n// [button text="Buy Now" url="/shop"]'),
      h(2, 'A Shortcode with Enclosed Content'),
      p('<p>A shortcode written with an opening and closing tag receives whatever\'s between them as its second argument.</p>'),
      code('php', 'function wgh_highlight_shortcode($atts, $content = null) {\n    return \'<mark>\' . esc_html($content) . \'</mark>\';\n}\nadd_shortcode(\'highlight\', \'wgh_highlight_shortcode\');\n\n// [highlight]this text gets marked[/highlight]'),
      callout('warning', '<p>A shortcode function must <b>return</b> its HTML, never <code>echo</code> it directly — echoing prints the output in the wrong place in the page\'s render order, usually above the content instead of inside it.</p>', 'return, not echo'),
      h(2, 'Using a Shortcode Inside a Template'),
      p('<p>Outside a post\'s content, a shortcode needs to be run through <code>do_shortcode()</code> explicitly.</p>'),
      code('php', '<?php echo do_shortcode(\'[button text="Contact Us" url="/contact"]\'); ?>'),
    ],
  },
  bn: {
    title: 'WordPress Shortcode',
    metaTitle: 'WordPress Shortcode | Learn Computer Academy',
    metaDescription: 'একটি custom [bracket] shortcode register করা যা reusable HTML output করে, যাতে একটি post-এ টাইপ করা একজন editor-এর কখনো PHP ছোঁয়ার দরকার না হয়।',
    blocks: [
      p('<p>একটি <b>shortcode</b> একটি ছোট bracketed tag — <code>[shortcode]</code> — সরাসরি একটি post বা page-এর content-এ টাইপ করা, যা পেজ render হওয়ার সময় WordPress dynamically তৈরি করা HTML দিয়ে বদলে দেয়। এটা কোড না ছোঁয়া একজন editor-কে reusable PHP output-এর একটি অংশ দেওয়ার একটি উপায়।</p>'),
      h(2, 'একটি মৌলিক Shortcode Register করা', 'একটি-মৌলিক-shortcode-register-করা'),
      code('php', '// functions.php\nfunction wgh_year_shortcode() {\n    return date(\'Y\');\n}\nadd_shortcode(\'current_year\', \'wgh_year_shortcode\');\n\n// একটি post-এ টাইপ করা: © [current_year] My Site\n// পেজে render হওয়া: © 2026 My Site'),
      h(2, 'Attribute Accept করা', 'attribute-accept-করা'),
      p('<p>একটি shortcode একটি HTML tag-এর মতোই attribute accept করতে পারে — <code>shortcode_atts()</code> এগুলোকে যুক্তিসঙ্গত default-এর সাথে merge করে।</p>'),
      code('php', 'function wgh_button_shortcode($atts) {\n    $atts = shortcode_atts([\n        \'text\' => \'Click Here\',\n        \'url\'  => \'#\',\n    ], $atts);\n\n    return sprintf(\n        \'<a class="button" href="%s">%s</a>\',\n        esc_url($atts[\'url\']),\n        esc_html($atts[\'text\'])\n    );\n}\nadd_shortcode(\'button\', \'wgh_button_shortcode\');\n\n// [button text="Buy Now" url="/shop"]'),
      h(2, 'Enclosed Content সহ একটি Shortcode', 'enclosed-content-সহ-একটি-shortcode'),
      p('<p>একটি opening আর closing tag দিয়ে লেখা একটি shortcode এদের মাঝে যা থাকে তা এর দ্বিতীয় argument হিসেবে পায়।</p>'),
      code('php', 'function wgh_highlight_shortcode($atts, $content = null) {\n    return \'<mark>\' . esc_html($content) . \'</mark>\';\n}\nadd_shortcode(\'highlight\', \'wgh_highlight_shortcode\');\n\n// [highlight]this text gets marked[/highlight]'),
      callout('warning', '<p>একটি shortcode function-কে অবশ্যই তার HTML <b>return</b> করতে হবে, কখনো সরাসরি <code>echo</code> না — echo করা পেজের render order-এ ভুল জায়গায় output print করে, সাধারণত content-এর ভেতরে না, তার উপরে।</p>', 'echo না, return'),
      h(2, 'একটি Template-এর ভেতরে Shortcode ব্যবহার করা', 'একটি-template-এর-ভেতরে-shortcode-ব্যবহার-করা'),
      p('<p>একটি post-এর content-এর বাইরে, একটি shortcode-কে স্পষ্টভাবে <code>do_shortcode()</code>-এর মধ্য দিয়ে চালাতে হয়।</p>'),
      code('php', '<?php echo do_shortcode(\'[button text="Contact Us" url="/contact"]\'); ?>'),
    ],
  },
})

// ═══ 3. CHILD THEMES ════════════════════════════════════════════════════════

lessons.push({
  slug: 'child-themes', sortOrder: n++,
  en: {
    title: 'Child Themes',
    metaTitle: 'WordPress Child Themes | Learn Computer Academy',
    metaDescription: "Customizing or extending an existing theme safely — changes that survive the parent theme's next update.",
    blocks: [
      p('<p>Editing a theme\'s files directly works, until the theme gets updated — every direct edit is silently overwritten. A <b>child theme</b> inherits everything from a parent theme while keeping customizations in a separate folder the update process never touches.</p>'),
      h(2, 'A Child Theme\'s Minimum Files'),
      p('<p>Just two files are required — a stylesheet declaring the relationship, and a functions file.</p>'),
      code('css', '/* wp-content/themes/my-child-theme/style.css */\n/*\nTheme Name: My Child Theme\nTemplate: wgh-starter\nVersion: 1.0\n*/'),
      p('<p>The <code>Template:</code> line — matching the parent theme\'s folder name exactly — is what makes it a child theme rather than a standalone one.</p>'),
      h(2, 'Loading the Parent\'s Styles'),
      p('<p>A child theme\'s own <code>style.css</code> replaces the parent\'s entirely by default — its CSS needs to be loaded explicitly, then the child\'s own rules enqueued after it to override anything needed.</p>'),
      code('php', '// wp-content/themes/my-child-theme/functions.php\nfunction wgh_child_enqueue_styles() {\n    wp_enqueue_style(\'parent-style\', get_template_directory_uri() . \'/style.css\');\n    wp_enqueue_style(\'child-style\', get_stylesheet_uri(), [\'parent-style\']);\n}\nadd_action(\'wp_enqueue_scripts\', \'wgh_child_enqueue_styles\');'),
      h(2, 'get_template_directory() vs. get_stylesheet_directory()'),
      table(['Function', 'Always points to'], [
        ['get_template_directory()', 'The parent theme\'s folder'],
        ['get_stylesheet_directory()', 'The active theme\'s folder — the child theme, if one is active'],
      ]),
      h(2, 'Overriding a Single Template File'),
      p('<p>Placing a file with the exact same name and path in the child theme overrides just that one file — every other template still comes from the parent, unchanged.</p>'),
      code('text', 'my-child-theme/\n├── style.css\n├── functions.php\n└── single.php    ← only this template is overridden; page.php, index.php, etc. still load from the parent'),
      callout('tip', '<p>A child theme is the standard, safe way to make any change to a theme not built for the site — including a purchased or downloaded theme whose updates need to keep working normally.</p>', 'When to reach for one'),
    ],
  },
  bn: {
    title: 'Child Theme',
    metaTitle: 'WordPress Child Theme | Learn Computer Academy',
    metaDescription: 'একটি বিদ্যমান theme নিরাপদে customize বা extend করা — parent theme-এর পরের update-এও যা টিকে থাকে।',
    blocks: [
      p('<p>একটি theme-এর file সরাসরি edit করা কাজ করে, যতক্ষণ না theme update হয় — প্রতিটি সরাসরি edit চুপচাপ overwrite হয়ে যায়। একটি <b>child theme</b> একটি parent theme থেকে সবকিছু inherit করে, একই সাথে customization একটি আলাদা folder-এ রাখে যা update process কখনো ছোঁয় না।</p>'),
      h(2, 'একটি Child Theme-এর ন্যূনতম File', 'একটি-child-theme-এর-ন্যূনতম-file'),
      p('<p>শুধু দুটি file দরকার — সম্পর্ক declare করা একটি stylesheet, আর একটি functions file।</p>'),
      code('css', '/* wp-content/themes/my-child-theme/style.css */\n/*\nTheme Name: My Child Theme\nTemplate: wgh-starter\nVersion: 1.0\n*/'),
      p('<p><code>Template:</code> লাইন — ঠিক parent theme-এর folder নামের সাথে মেলা — এটাকে একটি standalone theme-এর বদলে একটি child theme বানায়।</p>'),
      h(2, 'Parent-এর Style Load করা', 'parent-এর-style-load-করা'),
      p('<p>Default-এ একটি child theme-এর নিজের <code>style.css</code> parent-এরটাকে সম্পূর্ণ replace করে — এর CSS স্পষ্টভাবে load করা দরকার, তারপর দরকার হলে যেকোনো কিছু override করতে child-এর নিজের rule এর পরে enqueue করা।</p>'),
      code('php', '// wp-content/themes/my-child-theme/functions.php\nfunction wgh_child_enqueue_styles() {\n    wp_enqueue_style(\'parent-style\', get_template_directory_uri() . \'/style.css\');\n    wp_enqueue_style(\'child-style\', get_stylesheet_uri(), [\'parent-style\']);\n}\nadd_action(\'wp_enqueue_scripts\', \'wgh_child_enqueue_styles\');'),
      h(2, 'get_template_directory() বনাম get_stylesheet_directory()', 'get_template_directory-বনাম-get_stylesheet_directory'),
      table(['Function', 'সবসময় যা নির্দেশ করে'], [
        ['get_template_directory()', 'parent theme-এর folder'],
        ['get_stylesheet_directory()', 'active theme-এর folder — একটি child theme active থাকলে সেটা'],
      ]),
      h(2, 'একটি একক Template File Override করা', 'একটি-একক-template-file-override-করা'),
      p('<p>Child theme-এ ঠিক একই নাম আর path দিয়ে একটি file রাখলে শুধু সেই একটা file override হয় — বাকি প্রতিটি template তখনো parent থেকে আসে, অপরিবর্তিত।</p>'),
      code('text', 'my-child-theme/\n├── style.css\n├── functions.php\n└── single.php    ← শুধু এই template override হয়; page.php, index.php, ইত্যাদি তখনো parent থেকে load হয়'),
      callout('tip', '<p>একটি child theme site-এর জন্য বানানো না এমন একটি theme-এ যেকোনো পরিবর্তন করার standard, নিরাপদ উপায় — একটি কেনা বা download করা theme সহ যার update স্বাভাবিকভাবে কাজ করতে থাকা দরকার।</p>', 'কখন এটার জন্য যাবেন'),
    ],
  },
})

// ═══ 4. WIDGETS & SIDEBARS ══════════════════════════════════════════════════

lessons.push({
  slug: 'widgets-and-sidebars', sortOrder: n++,
  en: {
    title: 'Widgets and Widget-Ready Sidebars',
    metaTitle: 'WordPress Widgets and Sidebars | Learn Computer Academy',
    metaDescription: "Registering a widget-ready area in a theme, and outputting it in a template — the classic-theme way to give an editor a drag-and-drop content area.",
    blocks: [
      p('<p>A <b>widget area</b> (also called a "sidebar" in the WordPress API, regardless of where it\'s actually placed on the page) is a region a theme defines, that an editor can then fill with content blocks from the WordPress admin — without touching any code.</p>'),
      h(2, 'Registering a Widget Area'),
      code('php', '// functions.php\nfunction wgh_register_sidebars() {\n    register_sidebar([\n        \'name\'          => \'Blog Sidebar\',\n        \'id\'            => \'blog-sidebar\',\n        \'before_widget\' => \'<div class="widget %2$s">\',\n        \'after_widget\'  => \'</div>\',\n        \'before_title\'  => \'<h3 class="widget-title">\',\n        \'after_title\'   => \'</h3>\',\n    ]);\n}\nadd_action(\'widgets_init\', \'wgh_register_sidebars\');'),
      h(2, 'Outputting It in a Template'),
      p('<p>Wrapped in a check for whether the area actually has any widgets placed in it — an empty sidebar shouldn\'t render an empty wrapper element.</p>'),
      code('php', '<?php if (is_active_sidebar(\'blog-sidebar\')) : ?>\n    <aside class="sidebar">\n        <?php dynamic_sidebar(\'blog-sidebar\'); ?>\n    </aside>\n<?php endif; ?>'),
      h(2, 'before_widget and before_title — What They\'re For'),
      p('<p>Every widget an editor drags into this area gets automatically wrapped in the HTML defined by these four settings — a consistent container and heading structure without the theme needing to know in advance which widgets will be used.</p>'),
      h(2, 'Registering More Than One Area'),
      code('php', 'function wgh_register_sidebars() {\n    register_sidebar([\'name\' => \'Blog Sidebar\', \'id\' => \'blog-sidebar\']);\n    register_sidebar([\'name\' => \'Footer Column 1\', \'id\' => \'footer-1\']);\n    register_sidebar([\'name\' => \'Footer Column 2\', \'id\' => \'footer-2\']);\n}\nadd_action(\'widgets_init\', \'wgh_register_sidebars\');'),
      callout('note', '<p>Since WordPress 5.8, a widget area can also hold blocks (the same block editor used for post content), not just the older classic widgets — <code>register_sidebar()</code> itself is unchanged either way.</p>', 'Widgets and the block editor'),
    ],
  },
  bn: {
    title: 'Widget ও Widget-Ready Sidebar',
    metaTitle: 'WordPress Widget ও Sidebar | Learn Computer Academy',
    metaDescription: 'একটি theme-এ একটি widget-ready area register করা, আর একটি template-এ output করা — একজন editor-কে একটি drag-and-drop content area দেওয়ার classic-theme উপায়।',
    blocks: [
      p('<p>একটি <b>widget area</b> (WordPress API-তে "sidebar"-ও বলা হয়, পেজে আসলে কোথায় বসানো তা নির্বিশেষে) একটি theme define করা একটি region, যা একজন editor পরে WordPress admin থেকে content block দিয়ে পূরণ করতে পারে — কোনো কোড না ছুঁয়ে।</p>'),
      h(2, 'একটি Widget Area Register করা', 'একটি-widget-area-register-করা'),
      code('php', '// functions.php\nfunction wgh_register_sidebars() {\n    register_sidebar([\n        \'name\'          => \'Blog Sidebar\',\n        \'id\'            => \'blog-sidebar\',\n        \'before_widget\' => \'<div class="widget %2$s">\',\n        \'after_widget\'  => \'</div>\',\n        \'before_title\'  => \'<h3 class="widget-title">\',\n        \'after_title\'   => \'</h3>\',\n    ]);\n}\nadd_action(\'widgets_init\', \'wgh_register_sidebars\');'),
      h(2, 'একটি Template-এ এটা Output করা', 'একটি-template-এ-এটা-output-করা'),
      p('<p>Area-তে আসলে কোনো widget বসানো আছে কিনা তার একটি check-এ wrap করা — একটি খালি sidebar একটি খালি wrapper element render করা উচিত না।</p>'),
      code('php', '<?php if (is_active_sidebar(\'blog-sidebar\')) : ?>\n    <aside class="sidebar">\n        <?php dynamic_sidebar(\'blog-sidebar\'); ?>\n    </aside>\n<?php endif; ?>'),
      h(2, 'before_widget ও before_title — এগুলো কীসের জন্য', 'before_widget-ও-before_title-এগুলো-কীসের-জন্য'),
      p('<p>একজন editor এই area-তে drag করা প্রতিটি widget স্বয়ংক্রিয়ভাবে এই চারটি setting দিয়ে define করা HTML-এ wrap হয় — theme-এর আগে থেকে কোন widget ব্যবহার হবে তা জানা ছাড়াই একটি সামঞ্জস্যপূর্ণ container আর heading structure।</p>'),
      h(2, 'একাধিক Area Register করা', 'একাধিক-area-register-করা'),
      code('php', 'function wgh_register_sidebars() {\n    register_sidebar([\'name\' => \'Blog Sidebar\', \'id\' => \'blog-sidebar\']);\n    register_sidebar([\'name\' => \'Footer Column 1\', \'id\' => \'footer-1\']);\n    register_sidebar([\'name\' => \'Footer Column 2\', \'id\' => \'footer-2\']);\n}\nadd_action(\'widgets_init\', \'wgh_register_sidebars\');'),
      callout('note', '<p>WordPress 5.8 থেকে, একটি widget area block-ও রাখতে পারে (post content-এ ব্যবহৃত একই block editor), শুধু পুরনো classic widget না — <code>register_sidebar()</code> নিজে দুই ক্ষেত্রেই অপরিবর্তিত।</p>', 'Widget আর block editor'),
    ],
  },
})

// ═══ 5. NONCES & FORM SECURITY ══════════════════════════════════════════════

lessons.push({
  slug: 'nonces-and-form-security', sortOrder: n++,
  en: {
    title: 'Nonces and Form Security',
    metaTitle: 'WordPress Nonces and Form Security | Learn Computer Academy',
    metaDescription: "Verifying a form submission or action actually came from your site's own page, not a forged request from somewhere else.",
    blocks: [
      p('<p>The earlier Escaping & Sanitizing lesson covered making <i>output</i> safe. A <b>nonce</b> ("number used once") covers the other direction — verifying an incoming form submission or action request genuinely came from a page your site rendered, not a forged request from elsewhere.</p>'),
      h(2, 'The Problem a Nonce Solves'),
      p('<p>Without one, a malicious site could trick a logged-in user\'s browser into submitting a request to your site — the browser sends the session cookie automatically, making the forged request look legitimate. This is the same CSRF attack covered in the PHP Security lesson; a nonce is WordPress\'s specific built-in defense against it.</p>'),
      h(2, 'Adding a Nonce to a Form'),
      code('php', '<form method="post" action="">\n    <?php wp_nonce_field(\'wgh_save_settings\', \'wgh_nonce\'); ?>\n    <input type="text" name="site_tagline">\n    <button type="submit">Save</button>\n</form>'),
      p('<p><code>wp_nonce_field()</code> outputs a hidden input containing a token tied to the current user\'s session and the action name given as its first argument.</p>'),
      h(2, 'Verifying It on Submission'),
      code('php', 'if (isset($_POST[\'wgh_nonce\']) && wp_verify_nonce($_POST[\'wgh_nonce\'], \'wgh_save_settings\')) {\n    // Safe to process the form\n    update_option(\'site_tagline\', sanitize_text_field($_POST[\'site_tagline\']));\n} else {\n    wp_die(\'Security check failed.\');\n}'),
      h(2, 'Nonces in a URL — for a Link-Triggered Action'),
      p('<p>The same idea applies to a plain link that triggers an action (deleting an item, for example), not just a form.</p>'),
      code('php', '<?php $url = wp_nonce_url(admin_url(\'admin-post.php?action=wgh_delete_item&id=42\'), \'wgh_delete_item_42\'); ?>\n<a href="<?php echo esc_url($url); ?>">Delete</a>'),
      code('php', '// Handling it\nif (!isset($_GET[\'_wpnonce\']) || !wp_verify_nonce($_GET[\'_wpnonce\'], \'wgh_delete_item_\' . $_GET[\'id\'])) {\n    wp_die(\'Security check failed.\');\n}'),
      callout('note', '<p>A nonce expires (24 hours by default) and is tied to the specific user session that generated it — it isn\'t a password or a secret to keep hidden, just a check that the request came from where it claims to.</p>', 'What a nonce is not'),
    ],
  },
  bn: {
    title: 'Nonce ও Form Security',
    metaTitle: 'WordPress Nonce ও Form Security | Learn Computer Academy',
    metaDescription: 'একটি form submission বা action আসলে আপনার site-এর নিজের পেজ থেকে এসেছে কিনা যাচাই করা, অন্য কোথাও থেকে একটি forged request না।',
    blocks: [
      p('<p>আগের Escaping & Sanitizing lesson <i>output</i> নিরাপদ বানানো কভার করেছে। একটি <b>nonce</b> ("number used once") অন্য দিকটা কভার করে — একটি আসা form submission বা action request সত্যিকারভাবে আপনার site render করা একটি পেজ থেকে এসেছে কিনা যাচাই করা, অন্য কোথাও থেকে একটি forged request না।</p>'),
      h(2, 'একটি Nonce যে সমস্যা সমাধান করে', 'একটি-nonce-যে-সমস্যা-সমাধান-করে'),
      p('<p>এটা ছাড়া, একটি malicious site একটি logged-in user-এর browser-কে আপনার site-এ একটি request submit করাতে trick করতে পারে — browser স্বয়ংক্রিয়ভাবে session cookie পাঠায়, যা forged request-কে বৈধ দেখায়। এটা PHP Security lesson-এ কভার করা একই CSRF attack; একটি nonce এর বিরুদ্ধে WordPress-এর নির্দিষ্ট built-in defense।</p>'),
      h(2, 'একটি Form-এ একটি Nonce যোগ করা', 'একটি-form-এ-একটি-nonce-যোগ-করা'),
      code('php', '<form method="post" action="">\n    <?php wp_nonce_field(\'wgh_save_settings\', \'wgh_nonce\'); ?>\n    <input type="text" name="site_tagline">\n    <button type="submit">Save</button>\n</form>'),
      p('<p><code>wp_nonce_field()</code> একটি hidden input output করে যাতে বর্তমান user-এর session আর প্রথম argument হিসেবে দেওয়া action নামের সাথে যুক্ত একটি token থাকে।</p>'),
      h(2, 'Submission-এ এটা যাচাই করা', 'submission-এ-এটা-যাচাই-করা'),
      code('php', 'if (isset($_POST[\'wgh_nonce\']) && wp_verify_nonce($_POST[\'wgh_nonce\'], \'wgh_save_settings\')) {\n    // Form process করা নিরাপদ\n    update_option(\'site_tagline\', sanitize_text_field($_POST[\'site_tagline\']));\n} else {\n    wp_die(\'Security check failed.\');\n}'),
      h(2, 'URL-এ Nonce — একটি Link-Triggered Action-এর জন্য', 'url-এ-nonce-একটি-link-triggered-action-এর-জন্য'),
      p('<p>একই ধারণা একটি action trigger করা একটি সাধারণ link-এও প্রযোজ্য (যেমন একটি item delete করা), শুধু একটি form-এ না।</p>'),
      code('php', '<?php $url = wp_nonce_url(admin_url(\'admin-post.php?action=wgh_delete_item&id=42\'), \'wgh_delete_item_42\'); ?>\n<a href="<?php echo esc_url($url); ?>">Delete</a>'),
      code('php', '// এটা handle করা\nif (!isset($_GET[\'_wpnonce\']) || !wp_verify_nonce($_GET[\'_wpnonce\'], \'wgh_delete_item_\' . $_GET[\'id\'])) {\n    wp_die(\'Security check failed.\');\n}'),
      callout('note', '<p>একটি nonce মেয়াদ শেষ হয় (default-এ ২৪ ঘণ্টা) আর এটা তৈরি করা নির্দিষ্ট user session-এর সাথে যুক্ত — এটা কোনো password বা লুকিয়ে রাখার মতো secret না, শুধু request দাবি করা জায়গা থেকে এসেছে কিনা তার একটি check।</p>', 'একটি nonce যা না'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'wordpress').single()
  if (catErr || !category) {
    console.error('Category "wordpress" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] wordpress/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] wordpress/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `wordpress/${lesson.slug}`
    const row = {
      category_id: category.id,
      slug: lesson.slug,
      path,
      old_path: null,
      title: lesson.en.title,
      meta_title: lesson.en.metaTitle,
      meta_description: lesson.en.metaDescription,
      blocks: lesson.en.blocks,
      toc: toc(lesson.en.blocks),
      status: 'published',
      sort_order: lesson.sortOrder,
      published_at: new Date().toISOString(),
    }

    const { data: existing } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
    let docId = existing?.id
    if (docId) {
      const { error: docErr } = await supabase.from('docs').update(row).eq('id', docId)
      if (docErr) { console.error(`Failed ${lesson.slug} (en update):`, docErr.message); continue }
    } else {
      const { data: inserted, error: docErr } = await supabase.from('docs').insert(row).select('id').single()
      if (docErr) { console.error(`Failed ${lesson.slug} (en insert):`, docErr.message); continue }
      docId = inserted.id
    }
    console.log(`  ✓ en  ${path}`)

    const trRow = {
      doc_id: docId,
      locale: 'bn',
      title: lesson.bn.title,
      meta_title: lesson.bn.metaTitle,
      meta_description: lesson.bn.metaDescription,
      blocks: lesson.bn.blocks,
      toc: toc(lesson.bn.blocks),
    }
    const { data: existingTr } = await supabase.from('doc_translations').select('doc_id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
    const { error: trErr } = existingTr
      ? await supabase.from('doc_translations').update(trRow).eq('doc_id', docId).eq('locale', 'bn')
      : await supabase.from('doc_translations').insert(trRow)
    if (trErr) { console.error(`Failed ${lesson.slug} (bn):`, trErr.message); continue }
    console.log(`  ✓ bn  ${path}`)
  }

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
