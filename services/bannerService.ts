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

    const general = configData.generalSettings || {};
    const bannerConfig = configData.bannerConfig || {};
    const logoUrl = getImageUrl(configData.logoCMS || general.logoCMS, "/images/banner/icon.png");

    return {
      logo: logoUrl,
      background_image: bannerBgImage,
      menu_items: [],
      title: {
        general: bannerConfig.banneTitle || "",
        focus: {
          text: bannerConfig.bannerFocusText || "",
          link: bannerFocusLink,
        },
      },
      supporting_text: bannerConfig.bannerSubText || "",
      buttons: [],
      textColor: general.textColor || "",
      overlayColor: bannerConfig.bannerOverlayColor || "",
      overlayOpacity: typeof bannerConfig.bannerOverlay === "number" ? bannerConfig.bannerOverlay : 0,
    };
  } catch (error) {
    console.error("❌ Error fetching banner data:", error);
    return null;
  }
}
