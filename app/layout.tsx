import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { RouteProgressBar } from "@/components/magic/route-progress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Learn Computer Academy — Free Web Design & Development Docs",
    template: "%s | Learn Computer Academy",
  },
  description: "Free, W3Schools-style lessons on HTML, CSS, JavaScript, React, and graphic design.",
};

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
        <RouteProgressBar />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
