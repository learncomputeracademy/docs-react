// Shared category grouping — used by the homepage subject index
// (home-content.tsx) and the doc sidebar (sidebar-nav.tsx) so the two don't
// drift apart. Presentation-only: independent of the categories table's own
// `sort_order`, which still drives admin and any other consumer that reads
// categories flat. A category not listed here still ships — both consumers
// append it as its own trailing "More" group rather than dropping it.
export const SUBJECT_GROUPS = [
  { key: 'start', slugs: ['basics', 'office', 'programming', 'ai', 'cybersecurity', 'git'], label: { en: 'Start Here', bn: 'শুরু করুন' } },
  { key: 'design', slugs: ['design', 'ui-ux', 'photoshop', 'figma'], label: { en: 'Design', bn: 'ডিজাইন' } },
  { key: 'web', slugs: ['html', 'css', 'javascript', 'react'], label: { en: 'Build the web', bn: 'ওয়েব তৈরি' } },
  { key: 'backend', slugs: ['php', 'sql', 'wordpress', 'python', 'nodejs', 'mongodb'], label: { en: 'Backend & data', bn: 'ব্যাকএন্ড ও ডেটা' } },
  { key: 'launch', slugs: ['freelancing', 'hosting', 'marketing', 'seo', 'career'], label: { en: 'Launch & grow', bn: 'লঞ্চ ও ক্যারিয়ার' } },
] as const
