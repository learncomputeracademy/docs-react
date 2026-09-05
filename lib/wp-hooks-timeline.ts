// The standard front-end page-load action hook order — a long-stable,
// widely-documented WordPress core reference sequence (unchanged across
// versions), not the full exhaustive list. Complements
// wordpress/wordpress-hooks-actions-and-filters, which teaches what an
// action/filter *is*; this shows *when* the common ones actually fire.
export type HookStep = { hook: string; note: string; noteBn: string }

export const HOOK_TIMELINE: HookStep[] = [
  { hook: 'muplugins_loaded', note: 'Must-use plugins have just loaded — the very first hook available.', noteBn: 'Must-use plugin গুলো এইমাত্র load হয়েছে — প্রথম যে hook পাওয়া যায়।' },
  { hook: 'plugins_loaded', note: 'Regular plugins have loaded. A common place for plugin-to-plugin setup code.', noteBn: 'সাধারণ plugin গুলো load হয়েছে। plugin-to-plugin setup কোডের জন্য common জায়গা।' },
  { hook: 'after_setup_theme', note: 'The theme has loaded. Classic place for add_theme_support() calls.', noteBn: 'Theme load হয়ে গেছে। add_theme_support() কল করার classic জায়গা।' },
  { hook: 'init', note: 'WordPress core is fully loaded. The most common hook for registering post types, taxonomies, and shortcodes.', noteBn: 'WordPress core সম্পূর্ণ load হয়ে গেছে। post type, taxonomy, আর shortcode register করার সবচেয়ে common hook।' },
  { hook: 'wp_loaded', note: 'Everything is registered — WordPress is fully loaded, but the request hasn\'t been parsed yet.', noteBn: 'সব কিছু register হয়ে গেছে — WordPress পুরোপুরি load হয়েছে, কিন্তু request এখনও parse হয়নি।' },
  { hook: 'parse_request', note: 'WordPress has parsed the request into query variables.', noteBn: 'WordPress request-কে query variable-এ parse করেছে।' },
  { hook: 'pre_get_posts', note: 'Right before the main query runs — the standard place to modify what a query returns.', noteBn: 'main query চলার ঠিক আগে — একটা query কী return করবে সেটা পরিবর্তন করার standard জায়গা।' },
  { hook: 'wp', note: 'The main query has run and the requested object (post, archive, etc.) is now known.', noteBn: 'main query চলে গেছে আর requested object (post, archive, ইত্যাদি) এখন জানা।' },
  { hook: 'template_redirect', note: 'Right before WordPress picks a template file — a common place to redirect or intercept a request.', noteBn: 'WordPress একটা template file বেছে নেওয়ার ঠিক আগে — একটা request redirect বা intercept করার common জায়গা।' },
  { hook: 'get_header', note: 'header.php is about to load.', noteBn: 'header.php এখনই load হবে।' },
  { hook: 'wp_head', note: 'Inside <head> — where plugins add meta tags, styles, and scripts. Every theme\'s header.php must call wp_head().', noteBn: '<head>-এর ভেতরে — যেখানে plugin গুলো meta tag, style, আর script যোগ করে। প্রতিটা theme-এর header.php-তে wp_head() কল করতেই হয়।' },
  { hook: 'wp_body_open', note: 'Right after <body> — the modern, standard place for tracking scripts that must run before any content.', noteBn: '<body>-এর ঠিক পরে — কোনো content-এর আগে চলতে হবে এমন tracking script-এর জন্য modern, standard জায়গা।' },
  { hook: 'the_loop', note: 'The Loop runs — have_posts() / the_post() — pulling in the actual post content.', noteBn: 'The Loop চলে — have_posts() / the_post() — আসল post content নিয়ে আসে।' },
  { hook: 'wp_footer', note: 'Right before </body> — where most scripts (analytics, chat widgets) get enqueued to avoid blocking the page.', noteBn: '</body>-এর ঠিক আগে — যেখানে বেশিরভাগ script (analytics, chat widget) enqueue হয় যাতে page block না হয়।' },
  { hook: 'shutdown', note: 'The very last hook — WordPress is about to finish sending the response.', noteBn: 'একদম শেষ hook — WordPress response পাঠানো শেষ করতে চলেছে।' },
]

export const COMMON_FILTERS: HookStep[] = [
  { hook: 'the_title', note: 'Filters a post\'s title every time it\'s displayed via the_title() or get_the_title().', noteBn: 'the_title() বা get_the_title() দিয়ে দেখানো হলে প্রতিবার একটা post-এর title filter করে।' },
  { hook: 'the_content', note: 'Filters post content before display — this is how shortcodes and wpautop() (auto-paragraphs) actually get applied.', noteBn: 'দেখানোর আগে post content filter করে — shortcode আর wpautop() (auto-paragraph) আসলে এভাবেই apply হয়।' },
  { hook: 'excerpt_length', note: 'Filters the word count used by the_excerpt() — the classic example from the paired lesson.', noteBn: 'the_excerpt()-এ ব্যবহৃত word count filter করে — জোড়া পাঠের classic উদাহরণ।' },
]

// A broader, categorized hook reference beyond the fixed front-end timeline
// above — these fire on their own trigger (a save, a login, an admin page
// load), not at one fixed point every request, so they're organized as
// browsable categories rather than a single sequence. Hook names and
// purpose are core WordPress, long-stable; deliberately kept to a one-line
// "what it's for" rather than exact callback signatures (argument counts
// genuinely vary hook to hook) — the generated snippet below reflects that
// honestly with a generic parameter rather than a guessed-specific one.
export type RefHook = { hook: string; type: 'action' | 'filter'; note: string; noteBn: string }
export type HookCategory = { id: string; title: string; titleBn: string; hooks: RefHook[] }

export const HOOK_CATEGORIES: HookCategory[] = [
  {
    id: 'save', title: 'Save & Update', titleBn: 'Save ও Update',
    hooks: [
      { hook: 'save_post', type: 'action', note: 'Fires every time any post type is saved — including autosaves and revisions, which trips up a lot of first attempts.', noteBn: 'যেকোনো post type save হলেই fire করে — autosave আর revision-সহ, যা প্রথম চেষ্টায় অনেককে বিভ্রান্ত করে।' },
      { hook: 'save_post_{post_type}', type: 'action', note: 'The same as save_post, but scoped to one post type — usually the better choice for custom post type logic.', noteBn: 'save_post-এর মতোই, কিন্তু একটা post type-এ scoped — custom post type logic-এর জন্য সাধারণত ভালো choice।' },
      { hook: 'wp_insert_post', type: 'action', note: 'Fires after a post is inserted or updated in the database, with the full post object available.', noteBn: 'একটা post database-এ insert বা update হওয়ার পর fire করে, পুরো post object সহ।' },
      { hook: 'transition_post_status', type: 'action', note: 'Fires whenever a post moves between statuses (draft → publish, publish → trash) — the reliable way to detect "just published."', noteBn: 'একটা post যখনই status বদলায় (draft → publish, publish → trash) তখন fire করে — "এইমাত্র publish হলো" ধরার নির্ভরযোগ্য উপায়।' },
      { hook: 'updated_option', type: 'action', note: 'Fires after a value saved with update_option() actually changes.', noteBn: 'update_option()-এ save করা একটা value আসলে বদলানোর পর fire করে।' },
      { hook: 'before_delete_post', type: 'action', note: 'Fires right before a post is permanently deleted — the last chance to clean up related data.', noteBn: 'একটা post permanently delete হওয়ার ঠিক আগে fire করে — সম্পর্কিত data clean up করার শেষ সুযোগ।' },
    ],
  },
  {
    id: 'user', title: 'User & Auth', titleBn: 'User ও Auth',
    hooks: [
      { hook: 'wp_login', type: 'action', note: 'Fires right after a user successfully logs in, with their username and user object.', noteBn: 'একজন user সফলভাবে login করার ঠিক পরে fire করে, তার username আর user object সহ।' },
      { hook: 'wp_logout', type: 'action', note: 'Fires right before a user is logged out.', noteBn: 'একজন user logout হওয়ার ঠিক আগে fire করে।' },
      { hook: 'user_register', type: 'action', note: 'Fires right after a new user account is created, with the new user\'s ID.', noteBn: 'একটা নতুন user account তৈরি হওয়ার ঠিক পরে fire করে, নতুন user-এর ID সহ।' },
      { hook: 'profile_update', type: 'action', note: 'Fires after a user\'s profile fields are updated.', noteBn: 'একজন user-এর profile field update হওয়ার পর fire করে।' },
      { hook: 'authenticate', type: 'filter', note: 'Filters the login attempt itself — this is how custom login rules (e.g. email instead of username) actually get implemented.', noteBn: 'login চেষ্টা নিজেই filter করে — custom login rule (যেমন username-এর বদলে email) আসলে এভাবেই implement হয়।' },
    ],
  },
  {
    id: 'admin', title: 'Admin Area', titleBn: 'Admin Area',
    hooks: [
      { hook: 'admin_init', type: 'action', note: 'Fires early on every admin page load — the admin-side equivalent of the front-end init.', noteBn: 'প্রতিটা admin page load-এ আগে fire করে — front-end init-এর admin-side সমতুল্য।' },
      { hook: 'admin_menu', type: 'action', note: 'The correct place to register a custom admin page or menu item, via add_menu_page()/add_submenu_page().', noteBn: 'add_menu_page()/add_submenu_page() দিয়ে একটা custom admin page বা menu item register করার সঠিক জায়গা।' },
      { hook: 'admin_enqueue_scripts', type: 'action', note: 'The admin-side equivalent of wp_enqueue_scripts — where admin-only CSS/JS gets loaded.', noteBn: 'wp_enqueue_scripts-এর admin-side সমতুল্য — যেখানে admin-only CSS/JS load হয়।' },
      { hook: 'admin_notices', type: 'action', note: 'Where plugins/themes print those dismissible yellow/blue/red notice boxes at the top of an admin page.', noteBn: 'যেখানে plugin/theme admin page-এর উপরে সেই dismissible হলুদ/নীল/লাল notice box গুলো print করে।' },
      { hook: 'admin_bar_menu', type: 'action', note: 'Add or remove items from the toolbar that appears at the very top of the screen for logged-in users.', noteBn: 'logged-in user-এর জন্য স্ক্রিনের একদম উপরে দেখা toolbar-এ item যোগ বা বাদ দিন।' },
    ],
  },
  {
    id: 'comments', title: 'Comments', titleBn: 'Comments',
    hooks: [
      { hook: 'pre_comment_approved', type: 'filter', note: 'Filters whether a new comment is auto-approved, held for moderation, or marked spam.', noteBn: 'একটা নতুন comment auto-approve হবে, moderation-এ থাকবে, নাকি spam মার্ক হবে তা filter করে।' },
      { hook: 'comment_post', type: 'action', note: 'Fires right after a comment is inserted into the database.', noteBn: 'একটা comment database-এ insert হওয়ার ঠিক পরে fire করে।' },
      { hook: 'wp_insert_comment', type: 'action', note: 'Fires after a comment is inserted, with the full comment object — commonly used for custom notification emails.', noteBn: 'একটা comment insert হওয়ার পর fire করে, পুরো comment object সহ — custom notification email-এর জন্য প্রায়ই ব্যবহৃত।' },
      { hook: 'comment_unapproved_to_approved', type: 'action', note: 'Fires specifically when a held comment gets approved — narrower and often more useful than watching every status change.', noteBn: 'একটা আটকে থাকা comment approve হলে বিশেষভাবে fire করে — প্রতিটা status বদল দেখার চেয়ে সংকীর্ণ, প্রায়ই বেশি useful।' },
    ],
  },
  {
    id: 'widgets', title: 'Widgets & Customizer', titleBn: 'Widgets ও Customizer',
    hooks: [
      { hook: 'widgets_init', type: 'action', note: 'Where register_sidebar() runs to declare a widget-ready area.', noteBn: 'যেখানে register_sidebar() চলে একটা widget-ready area ঘোষণা করার জন্য।' },
      { hook: 'customize_register', type: 'action', note: 'Where Customizer panels, sections, settings, and controls get registered — the WP_Customize_Manager instance is passed in.', noteBn: 'যেখানে Customizer panel, section, setting, আর control register হয় — WP_Customize_Manager instance পাস করা হয়।' },
      { hook: 'dynamic_sidebar', type: 'action', note: 'Fires once for each active widget right before it\'s displayed inside a sidebar.', noteBn: 'একটা sidebar-এর ভেতরে দেখানোর ঠিক আগে প্রতিটা active widget-এর জন্য একবার fire করে।' },
    ],
  },
  {
    id: 'content', title: 'Content & Query Filters', titleBn: 'Content ও Query Filters',
    hooks: [
      { hook: 'body_class', type: 'filter', note: 'Filters the array of classes added to <body> — the standard way to add a custom class based on page context.', noteBn: '<body>-তে যোগ হওয়া class-এর array filter করে — page context অনুযায়ী একটা custom class যোগ করার standard উপায়।' },
      { hook: 'excerpt_more', type: 'filter', note: 'Filters the "[...]"/"Read more" string appended to an auto-generated excerpt.', noteBn: 'auto-generate হওয়া excerpt-এর শেষে যোগ হওয়া "[...]"/"Read more" string filter করে।' },
      { hook: 'document_title_parts', type: 'filter', note: 'Filters the pieces (title, site name, tagline) that make up the browser tab / <title> text.', noteBn: 'browser tab / <title> টেক্সট তৈরি করা টুকরোগুলো (title, site name, tagline) filter করে।' },
      { hook: 'wp_nav_menu_items', type: 'filter', note: 'Filters the final HTML of a rendered nav menu — a common place to inject an extra item like a search icon or login link.', noteBn: 'একটা rendered nav menu-র চূড়ান্ত HTML filter করে — search icon বা login link-এর মতো একটা extra item ঢোকানোর common জায়গা।' },
      { hook: 'posts_where', type: 'filter', note: 'Filters the raw SQL WHERE clause of the main query — an advanced, low-level way to change what a query matches.', noteBn: 'main query-র raw SQL WHERE clause filter করে — একটা query কী match করে তা বদলানোর একটা advanced, low-level উপায়।' },
    ],
  },
]
