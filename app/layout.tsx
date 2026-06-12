import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CMSProvider } from "./providers/cmsProvider";
import { getCachedConfig } from "@/services/apiCache";
import { getImageUrl } from "@/services/utils";
import { PreviewOverlayProvider } from "@/lib/previewOverlay";
import VisitorTracker from "@/components/VisitorTracker";
import RuntimeGate from "@/components/RuntimeGate";

// Inline globe SVG used as the favicon whenever the CMS has no logo.
// Kept as a data URL so the site has no separate file to ship — and so
// browsers immediately drop the previous tenant's icon on cache miss
// instead of falling through to Next.js's built-in placeholder.
const DEFAULT_FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4a5568"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
  );

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const configData = await getCachedConfig();
    const general = configData.generalSettings || {};
    const logoUrl = getImageUrl(configData.logoCMS || general.logoCMS);
    const title = general.title || "Title";
    const description = general.description || "";

    return {
      title: { default: title, template: `%s — ${title}` },
      description,
      // Keywords come from the tenant's configured title only. No
      // hardcoded brand or domain terms — anything else should be
      // configurable through the CMS, not baked into the template.
      keywords: title ? [title] : undefined,
      robots: { index: true, follow: true },
      // Favicon: real logo when the CMS has one, generic globe otherwise.
      // OG/Twitter cards skip the fallback — those slots need real photos,
      // and a tiny SVG would look broken in social previews.
      icons: { icon: logoUrl || DEFAULT_FAVICON },
      openGraph: {
        type: "website",
        title,
        description,
        siteName: title,
        ...(logoUrl ? { images: [{ url: logoUrl, alt: title }] } : {}),
        locale: "ms_MY",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(logoUrl ? { images: [logoUrl] } : {}),
      },
    };
  } catch {
    // Hard-failure fallback. Still brand-neutral — no copy, just a
    // working favicon so the tab doesn't render a Next.js placeholder.
    return {
      robots: { index: true, follow: true },
      icons: { icon: DEFAULT_FAVICON },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The maintenance / coming-soon decision and document title are driven by
  // the LIVE CMS config in the browser via <RuntimeGate> — there is no
  // server to decide them per request in a static export.
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <PreviewOverlayProvider>
          <RuntimeGate>
            <CMSProvider>
              <VisitorTracker />
              {children}
            </CMSProvider>
          </RuntimeGate>
        </PreviewOverlayProvider>
      </body>
    </html>
  );
}
