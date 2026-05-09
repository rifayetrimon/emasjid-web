// services/bannerService.ts
import { getCachedBanner, getCachedConfig } from "./apiCache";
import { BannerProps } from "@/types/cms";
import { getImageUrl } from "./utils";
import { DEMO_BANNER, DEMO_BANNER_IMAGE } from "@/lib/demoContent";

export async function getBannerData(): Promise<BannerProps["banner"] | null> {
  try {
    const bannerData = await getCachedBanner();
    const configData = await getCachedConfig();

    const firstBanner = bannerData?.dataset?.[0];

    // Collect all valid banner images
    const allImages: string[] = (firstBanner?.files || [])
      .map((f: { file: string; url: string }) => f.file)
      .filter((file: string) => file && file.trim() !== "");

    // Fall back to the demo banner image when admin hasn't uploaded any
    const finalImages = allImages.length > 0 ? allImages : [DEMO_BANNER_IMAGE];

    const bannerBgImage = getImageUrl(finalImages[0]);
    const bannerFocusLink = firstBanner?.files?.[0]?.url || "";

    const general = configData.generalSettings || {};
    const bannerConfig = configData.bannerConfig || {};
    const logoUrl = getImageUrl(configData.logoCMS || general.logoCMS);

    return {
      logo: logoUrl,
      background_image: bannerBgImage,
      background_images: finalImages,
      menu_items: [],
      title: {
        general: bannerConfig.banneTitle || DEMO_BANNER.title.general,
        focus: {
          text: bannerConfig.bannerFocusText || DEMO_BANNER.title.focus.text,
          link: bannerFocusLink,
        },
      },
      supporting_text: bannerConfig.bannerSubText || DEMO_BANNER.supporting_text,
      buttons: [],
      textColor: general.textColor || "",
      overlayColor: bannerConfig.bannerOverlayColor || "",
      overlayOpacity:
        typeof bannerConfig.bannerOverlay === "number"
          ? bannerConfig.bannerOverlay
          : 0,
    };
  } catch (error) {
    console.error("❌ Error fetching banner data:", error);
    // Even on outright failure, return the demo banner so templates render
    return {
      logo: "",
      background_image: DEMO_BANNER_IMAGE,
      background_images: [DEMO_BANNER_IMAGE],
      menu_items: [],
      title: DEMO_BANNER.title,
      supporting_text: DEMO_BANNER.supporting_text,
      buttons: [],
      textColor: "",
      overlayColor: "",
      overlayOpacity: 0,
    };
  }
}
