// services/brandingService.ts
import { getCachedBanner } from "./apiCache";
import { BrandingItem } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getBrandingData(): Promise<BrandingItem[]> {
  try {
    const bannerData = await getCachedBanner();

    const firstBanner = Array.isArray(bannerData) ? bannerData[0] : bannerData;

    const brandingImage = firstBanner?.imageUrl;

    if (!brandingImage) {
      return [];
    }

    return [
      {
        image: getImageUrl(brandingImage),
      },
    ];
  } catch (error) {
    console.error("❌ Error fetching branding data:", error);
    return [];
  }
}
