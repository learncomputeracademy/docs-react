// The WordPress template hierarchy — the deterministic, documented file
// search order WordPress uses for every request type. Matches exactly what
// wordpress/template-hierarchy already teaches (verified against that
// lesson's own content before writing this) plus the extra branches its own
// closing callout names as existing but out of scope for the lesson itself
// (tag/author/date archives, search, CPT, taxonomy).
//
// Encoding a documented spec-derived algorithm as data is the same shape as
// the Grid Generator's grid-template-areas derivation or the CSS Specificity
// Calculator's selector scoring — a fixed rule set, not something to
// "measure" from a live WordPress install (there isn't one to measure from).

export type QueryTypeId =
  | 'homepage' | 'single-post' | 'page' | 'category' | 'tag' | 'taxonomy'
  | 'author' | 'date' | 'cpt-single' | 'cpt-archive' | 'search' | '404'

export type QueryType = {
  id: QueryTypeId
  label: string
  labelBn: string
  example: string
  exampleBn: string
  chain: string[]
}

export const QUERY_TYPES: QueryType[] = [
  {
    id: 'homepage', label: 'Homepage', labelBn: 'হোমপেজ',
    example: 'The site\'s front page', exampleBn: 'সাইটের front page',
    chain: ['front-page.php', 'home.php', 'page.php', 'index.php'],
  },
  {
    id: 'single-post', label: 'Single Post', labelBn: 'একটা Single Post',
    example: '/blog/my-post/', exampleBn: '/blog/my-post/',
    chain: ['single-{post-type}.php', 'single.php', 'index.php'],
  },
  {
    id: 'page', label: 'Page', labelBn: 'একটা Page',
    example: '/about/', exampleBn: '/about/',
    chain: ['page-{slug}.php', 'page-{id}.php', 'page.php', 'index.php'],
  },
  {
    id: 'category', label: 'Category Archive', labelBn: 'Category Archive',
    example: '/category/news/', exampleBn: '/category/news/',
    chain: ['category-{slug}.php', 'category-{id}.php', 'category.php', 'archive.php', 'index.php'],
  },
  {
    id: 'tag', label: 'Tag Archive', labelBn: 'Tag Archive',
    example: '/tag/react/', exampleBn: '/tag/react/',
    chain: ['tag-{slug}.php', 'tag-{id}.php', 'tag.php', 'archive.php', 'index.php'],
  },
  {
    id: 'taxonomy', label: 'Custom Taxonomy Archive', labelBn: 'Custom Taxonomy Archive',
    example: '/genre/thriller/', exampleBn: '/genre/thriller/',
    chain: ['taxonomy-{taxonomy}-{term}.php', 'taxonomy-{taxonomy}.php', 'taxonomy.php', 'archive.php', 'index.php'],
  },
  {
    id: 'author', label: 'Author Archive', labelBn: 'Author Archive',
    example: '/author/jane/', exampleBn: '/author/jane/',
    chain: ['author-{nicename}.php', 'author-{id}.php', 'author.php', 'archive.php', 'index.php'],
  },
  {
    id: 'date', label: 'Date Archive', labelBn: 'Date Archive',
    example: '/2026/09/', exampleBn: '/2026/09/',
    chain: ['date.php', 'archive.php', 'index.php'],
  },
  {
    id: 'cpt-single', label: 'Custom Post Type — Single', labelBn: 'Custom Post Type — Single',
    example: '/product/blue-shoes/', exampleBn: '/product/blue-shoes/',
    chain: ['single-{post-type}.php', 'single.php', 'index.php'],
  },
  {
    id: 'cpt-archive', label: 'Custom Post Type — Archive', labelBn: 'Custom Post Type — Archive',
    example: '/product/', exampleBn: '/product/',
    chain: ['archive-{post-type}.php', 'archive.php', 'index.php'],
  },
  {
    id: 'search', label: 'Search Results', labelBn: 'Search Results',
    example: '/?s=flexbox', exampleBn: '/?s=flexbox',
    chain: ['search.php', 'index.php'],
  },
  {
    id: '404', label: '404 Not Found', labelBn: '404 Not Found',
    example: '/this-page-does-not-exist/', exampleBn: '/this-page-does-not-exist/',
    chain: ['404.php', 'index.php'],
  },
]
