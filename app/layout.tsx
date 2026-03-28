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
    const logoUrl = getImageUrl(
      configData.logoCMS || configData.generalSettings?.logoCMS,
    );

    return {
      title: configData.generalSettings?.title || "eMasjid",
      description: "A platform for managing mosque activities",
      ...(logoUrl ? { icons: { icon: logoUrl } } : {}),
    };
  } catch {
    return {
      title: "eMasjid",
      description: "A platform for managing mosque activities",
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
