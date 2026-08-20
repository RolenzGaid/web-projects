import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

// Bootstrap's grid only — not the full framework. The full build ships Reboot,
// which double-resets on top of Tailwind's preflight and fights it over base
// element styles. This file is ~10% of the size and gives us .row/.col-*.
// Imported before globals.css so our own rules always win.
import "bootstrap/dist/css/bootstrap-grid.css";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/motion/CursorGlow";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Display face for headings — the italic is used as an accent. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${site.name} — ${site.role} & ${site.secondRole}`;

export const metadata: Metadata = {
  // TODO(you): set NEXT_PUBLIC_SITE_URL in Vercel so OG tags resolve to the
  // real domain instead of the preview URL.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    "senior web developer",
    "e-commerce developer",
    "headless commerce",
    "Shopify Plus",
    "Next.js",
    "Hydrogen",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title,
    description: site.tagline,
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <ScrollProgress />
        <CursorGlow />
        <Header />
        <main id="content" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
