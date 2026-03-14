// services/bannerService.ts
import { getCachedBanner, getCachedConfig } from "./apiCache";
import { BannerProps } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getBannerData(): Promise<BannerProps["banner"] | null> {
  try {
    const bannerData = await getCachedBanner();
    const configData = await getCachedConfig();

    const firstBanner = Array.isArray(bannerData) ? bannerData[0] : bannerData;

    const bannerBgImage = getImageUrl(
      firstBanner?.imageUrl,
      "/images/banner/bg.png"
    );

    const bannerFocusLink = firstBanner?.urllink1 || "";

    const logoUrl = getImageUrl(configData.logoCMS, "/images/banner/icon.png");

    return {
      logo: logoUrl,
      background_image: bannerBgImage,
      menu_items: [],
      title: {
        general: configData.bannerTitle || "",
        focus: {
          text: configData.bannerFocusText || "",
          link: bannerFocusLink,
        },
      },
      supporting_text: configData.bannerSupportingText || "",
      buttons: [],
    };
  } catch (error) {
    console.error("❌ Error fetching banner data:", error);
    return null;
  }
}
