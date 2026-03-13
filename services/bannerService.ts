// services/bannerService.ts
import { getCachedBanner, getCachedConfig } from "./apiCache";
import { BannerProps } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getBannerData(): Promise<BannerProps["banner"] | null> {
  try {
    const bannerData = await getCachedBanner();
    const configData = await getCachedConfig();

    const bannerBgImage = getImageUrl(
      bannerData.head?.[0]?.content?.[0]?.file,
      "/images/banner/bg.png"
    );

    const bannerFocusLink =
      bannerData.head?.[0]?.content?.[0]?.urllink || "www.masjid.com";

    const logoUrl = getImageUrl(configData.logoCMS, "/images/banner/icon.png");

    return {
      logo: logoUrl,
      background_image: bannerBgImage,
      menu_items: [], // Deprecated in favor of the standalone nav component fetching it, but keeping for type compatibility if needed
      title: {
        general: "Selamat Datang ke Portal",
        focus: { text: "eMasjid", link: bannerFocusLink },
      },
      supporting_text:
        "Maklumat ini disediakan sebagai panduan kepada mana-mana orang yang ingin membuat permohonan menggunakan Sistem Pengurusan Smart Masjid MAIS",
      buttons: [],
    };
  } catch (error) {
    console.error("❌ Error fetching banner data:", error);
    return null;
  }
}
