import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteChrome } from "@/components/site-chrome";
import { RouteProgressBar } from "@/components/magic/route-progress";
import { SITE_URL, SITE_NAME, organizationJsonLd, websiteJsonLd, jsonLdScript } from "@/lib/seo";
import { getSiteSettings, getNavItems } from "@/lib/content";
import { cldUrl, DEFAULT_LOGO_LIGHT_PUBLIC_ID, DEFAULT_LOGO_DARK_PUBLIC_ID } from "@/lib/cloudinary";
import type { BrandingSettings } from "@/lib/admin/branding";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_DESCRIPTION = "Lessons on HTML, CSS, JavaScript, React, and graphic design, from Learn Computer Academy.";

// metadataBase makes every relative URL in every page's `metadata` (OG
// images, etc.) resolve against the real domain instead of whatever host
// served the request — needed once, here, for it to apply everywhere.
// No `verification` field: Google Search Console and Bing Webmaster Tools
// are already verified outside this app (not via the HTML-tag method), so
// there's no meta tag for this site to emit.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Learn Computer Academy — Web Design & Development Docs",
    template: "%s | Learn Computer Academy",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: ["/logo-icon.png"],
  },
  twitter: {
    card: "summary",
  },
}

// Applies saved/system theme, and corrects <html lang> for /bn/*, before
// paint — avoids a flash of the wrong theme and a wrong lang attribute.
// Plain inline script, not next-themes/headers(): the root layout wraps
// every route, so any Server Component dynamic API used here (headers(),
// cookies()) forces the ENTIRE site into per-request SSR — exactly what
// CLAUDE.md §3.3 forbids. lang defaults to "en" (correct for most of the
// site) and this script flips it client-side for the /bn tree instead;
// suppressHydrationWarning on <html> already covers the theme class doing
// the same thing.
const headScript = `
(function() {
  var stored = localStorage.getItem('theme');
  var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
  if (location.pathname === '/bn' || location.pathname.indexOf('/bn/') === 0) {
    document.documentElement.lang = 'bn';
  }
})();
`;

// Impeccable direction contract (new-work.md §5) — a real HTML comment
// (not a JSX {/* */} comment, which compiles away and never reaches the
// DOM), first child of <body> in the root layout, auditable in the built
// output. State the chosen direction once here; the finish review checks
// the shipped render against it.
const DIRECTION_CONTRACT = `<!--
THESIS: A learning platform's homepage should read as engineered software,
not a funnel — refuses ambient decorative chrome (dot-grid, blur blob,
auto-shimmer, unmotivated border-beams) and the soft illustrated-education
opposite.
OWN-WORLD: Near-black/near-white neutrals, one brand-orange accent, Geist
Sans/Mono, sharp 1px borders, list-based subject index (not a card wall),
one authored motion (AnimatedCode's live typing).
STORY: A first-time bilingual visitor sees a structured, complete
curriculum (467 lessons/18 subjects, real numbers) organized like real
documentation, trusts it because the interface itself behaves competently,
picks a starting group.
FIRST VIEWPORT: Two-column hero — headline/CTA/trust microcopy left, live
AnimatedCode panel right, visible at every width (mobile: stacked); no
eyebrow badge, no ambient background decoration.
FORM: Canon — Linear + Raycast tier, user-pinned (2026-08-06 design
critique + redesign session); no concept roll, brief-pinned direction.
FINISH: unreviewed and undocumented is unfinished; this build ends with
the finish review, the verdict, and DESIGN.md.
-->`;

// async — fetches the header nav once here (cached, graceful-empty on
// failure) rather than in SiteChrome/SiteHeader, since both stay client
// components (SiteChrome needs usePathname() to hide the header on
// /admin/*, D-34) and can't do server data fetching themselves.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navItems, branding] = await Promise.all([
    getNavItems(),
    getSiteSettings("branding") as Promise<Partial<BrandingSettings>>,
  ]);
  // f_auto,q_auto,c_limit,w_480 — the header displays this at ~32px tall
  // (~180px wide); 480 leaves headroom for retina without shipping
  // anywhere near the multi-thousand-px master the upload script keeps.
  const logoLightUrl = cldUrl(branding.logoLightPublicId || DEFAULT_LOGO_LIGHT_PUBLIC_ID, "f_auto,q_auto,c_limit,w_480");
  const logoDarkUrl = cldUrl(branding.logoDarkPublicId || DEFAULT_LOGO_DARK_PUBLIC_ID, "f_auto,q_auto,c_limit,w_480");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Renders DIRECTION_CONTRACT (defined above) as a real HTML
            comment — a plain JSX comment compiles away and never reaches
            the DOM, so it wouldn't survive the build or be auditable. */}
        <div dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        {/* Site-wide, not per-page — same on every route, so one script
            here beats repeating it in every generateMetadata. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }} />
        <RouteProgressBar />
        <SiteChrome navItems={navItems} logoLightUrl={logoLightUrl} logoDarkUrl={logoDarkUrl}>{children}</SiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
