import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CMSProvider } from "./providers/cmsProvider";
import { getCachedConfig } from "@/services/apiCache";
import { getImageUrl } from "@/services/utils";
import { MaintenancePage } from "@/components/MaintenancePage";
import { ComingSoonPage } from "@/components/ComingSoonPage";
import { PreviewOverlayProvider } from "@/lib/previewOverlay";
import VisitorTracker from "@/components/VisitorTracker";

// Treats anything that means "on" — string "1", number 1, boolean true,
// "true"/"on" — as enabled. Empty / missing / "0" / false → disabled.
function isModeOn(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "boolean") return value;
  const s = String(value).trim().toLowerCase();
  return s === "1" || s === "true" || s === "on";
}

// Pull the first non-empty string from a set of possible field names.
// Used to read either the new field name (e.g. `maintenanceTemplate`) or
// the legacy one (`maintenanceDesign`) without caring which the API echoes.
function firstNonEmpty(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (v == null) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return undefined;
}

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
    // Brand text comes entirely from the CMS — no template-side defaults
    // for title or description. Empty strings are intentional: the tab
    // shows nothing tenant-flavoured until the admin fills the fields in.
    const title = general.title || "";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getCachedConfig();
  const g = config?.generalSettings || {};

  // ── Maintenance ────────────────────────────────────────────────────
  // Prefer the new `maintenanceMode` string field, fall back to legacy
  // `maintenance` (number) and the older "maintainance" typo so historical
  // configs keep rendering correctly.
  const isMaintenance = isModeOn(
    g.maintenanceMode ??
      config?.maintenanceMode ??
      g.maintenance ??
      g.maintainance ??
      config?.maintenance ??
      config?.maintainance,
  );
  const maintenanceDesign = firstNonEmpty(
    g.maintenanceTemplate,
    config?.maintenanceTemplate,
    g.maintenanceDesign,
    config?.maintenanceDesign,
  );
  const maintenanceTitle = firstNonEmpty(
    g.maintenanceTitle,
    config?.maintenanceTitle,
    g.maintenanceHeadline,
  );
  const maintenanceMessage = firstNonEmpty(
    g.maintenanceDescription,
    config?.maintenanceDescription,
    g.maintenanceMessage,
    config?.maintenanceMessage,
  );

  // ── Coming Soon ────────────────────────────────────────────────────
  // Same dual-field read; maintenance still takes priority below if both
  // are flipped on at once.
  const isComingSoon = isModeOn(
    g.comingSoonMode ??
      config?.comingSoonMode ??
      g.comingSoon ??
      config?.comingSoon,
  );
  const comingSoonDesign = firstNonEmpty(
    g.comingSoonTemplate,
    config?.comingSoonTemplate,
    g.comingSoonDesign,
    config?.comingSoonDesign,
  );
  const comingSoonTitle = firstNonEmpty(
    g.comingSoonTitle,
    config?.comingSoonTitle,
    g.comingSoonHeadline,
  );
  const comingSoonMessage = firstNonEmpty(
    g.comingSoonDescription,
    config?.comingSoonDescription,
    g.comingSoonMessage,
    config?.comingSoonMessage,
  );
  // API field is misspelled as `commingSoonLaunchDate`; accept both spellings
  // and either nesting (under generalSettings or at top level).
  const comingSoonLaunchDate = firstNonEmpty(
    g.commingSoonLaunchDate,
    g.comingSoonLaunchDate,
    config?.commingSoonLaunchDate,
    config?.comingSoonLaunchDate,
  );

  // Decide which (if any) overlay page to render. Maintenance wins over
  // Coming Soon — if the site is genuinely offline, the launch teaser is
  // misleading. Both off → render the normal site.
  let overlay: React.ReactNode = null;
  if (isMaintenance) {
    overlay = (
      <MaintenancePage
        design={maintenanceDesign || "1"}
        title={maintenanceTitle}
        message={maintenanceMessage}
      />
    );
  } else if (isComingSoon) {
    overlay = (
      <ComingSoonPage
        design={comingSoonDesign || "1"}
        title={comingSoonTitle}
        message={comingSoonMessage}
        launchDate={comingSoonLaunchDate}
      />
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <PreviewOverlayProvider>
          {overlay ?? (
            <CMSProvider>
              <VisitorTracker />
              {children}
            </CMSProvider>
          )}
        </PreviewOverlayProvider>
      </body>
    </html>
  );
}
