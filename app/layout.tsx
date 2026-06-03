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
function firstNonEmpty(
  ...values: unknown[]
): string | undefined {
  for (const v of values) {
    if (v == null) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return undefined;
}

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
    const title = general.title || "eMasjid";
    const description =
      general.description ||
      "Platform pengurusan masjid moden — akses berita, pengumuman, jadual aktiviti, dan perkhidmatan dengan mudah.";

    return {
      title: { default: title, template: `%s — ${title}` },
      description,
      keywords: [
        title,
        "eMasjid",
        "masjid",
        "pengurusan masjid",
        "jadual solat",
        "berita masjid",
      ],
      robots: { index: true, follow: true },
      ...(logoUrl ? { icons: { icon: logoUrl } } : {}),
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
    return {
      title: "eMasjid",
      description: "Platform pengurusan masjid moden.",
      robots: { index: true, follow: true },
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
