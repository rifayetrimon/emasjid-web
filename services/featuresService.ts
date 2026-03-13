// services/featuresService.ts
import { getCachedBanner, getCachedConfig } from "./apiCache";
import { FeaturesProps } from "@/types/cms";

interface BannerFeatureItem {
  contentTitle: string;
  contentID: number;
  contentMsg: string | null;
  content: Array<{
    urllink: string;
    file: string;
  }>;
}

export async function getFeaturesData(): Promise<FeaturesProps["fetures"] | null> {
  try {
    const bannerData = await getCachedBanner();
    const configData = await getCachedConfig();

    const mappedFeatures = (bannerData.middle || []).map(
      (item: BannerFeatureItem) => ({
        icon: "/icons/cloud.svg",
        title: item.contentTitle || "Missing Title",
        text:
          item.contentTitle === "Mesra Pengguna"
            ? "Akses lancar melalui telefon & tablet"
            : item.contentTitle === "Akses 24/7"
            ? "Boleh digunakan bila-bila masa"
            : item.contentTitle === "Kemaskini Automatik"
            ? "Pengawasan berterusan oleh MAIS"
            : "Missing Text",
      })
    );

    mappedFeatures.unshift({
      icon: "/icons/cloud.svg",
      title: "Selamat & Terjamin",
      text: "Data pengguna dilindungi dengan selamat",
    });

    return {
      title: configData.midBannerMainTitle || "Kelebihan e-Masjid",
      items: mappedFeatures,
    };
  } catch (error) {
    console.error("❌ Error fetching features data:", error);
    return null;
  }
}
