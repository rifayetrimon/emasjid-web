import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CMSProvider } from "./providers/cmsProvider";
import { getCachedConfig } from "@/services/apiCache";
import { getImageUrl } from "@/services/utils";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <CMSProvider>{children}</CMSProvider>
      </body>
    </html>
  );
}
