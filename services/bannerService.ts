// services/bannerService.ts
import { getCachedBanner, getCachedConfig } from "./apiCache";
import { BannerProps } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getBannerData(): Promise<BannerProps["banner"] | null> {
  try {
    const bannerData = await getCachedBanner();
    const configData = await getCachedConfig();

    const firstBanner = bannerData?.dataset?.[0];

    const bannerBgImage = getImageUrl(
      firstBanner?.files?.[0]?.file,
      "/images/banner/bg.png"
    );

    const bannerFocusLink = firstBanner?.files?.[0]?.url || "";

    const logoUrl = getImageUrl(configData.logoCMS, "/images/banner/icon.png");

    return {
      logo: logoUrl,
      background_image: bannerBgImage,
      menu_items: [],
      title: {
        general: configData.midBannerMainTitle || "",
        focus: {
          text: configData.bannerFocusText || "",
          link: bannerFocusLink,
        },
      },
      supporting_text: configData.subheader || "",
      buttons: [],
      textColor: configData.textColor || "",
    };
  } catch (error) {
    console.error("❌ Error fetching banner data:", error);
    return null;
  }
}
