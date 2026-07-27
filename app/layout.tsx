import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { RouteProgressBar } from "@/components/magic/route-progress";
import { SITE_URL, SITE_NAME, organizationJsonLd, websiteJsonLd, jsonLdScript } from "@/lib/seo";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_DESCRIPTION = "Free, W3Schools-style lessons on HTML, CSS, JavaScript, React, and graphic design.";

type SeoSettings = { googleVerification?: string; bingVerification?: string }

// metadataBase makes every relative URL in every page's `metadata` (OG
// images, etc.) resolve against the real domain instead of whatever host
// served the request — needed once, here, for it to apply everywhere.
// async (generateMetadata, not a static `metadata` const) so Search
// Console/Bing verification codes can be pasted into /admin/seo and take
// effect without a code deploy — getSiteSettings is the same cached,
// graceful-on-failure read every other admin-editable copy already uses
// (home-content.tsx), so this stays safe for static generation.
export async function generateMetadata(): Promise<Metadata> {
  const seo = (await getSiteSettings('seo')) as SeoSettings

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Learn Computer Academy — Free Web Design & Development Docs",
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
    verification: {
      google: seo.googleVerification || undefined,
      other: seo.bingVerification ? { "msvalidate.01": seo.bingVerification } : undefined,
    },
  };
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {/* Site-wide, not per-page — same on every route, so one script
            here beats repeating it in every generateMetadata. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }} />
        <RouteProgressBar />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
