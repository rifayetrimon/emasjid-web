// services/brandingService.ts
import { getCachedBanner } from "./apiCache";
import { BrandingItem } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getBrandingData(): Promise<BrandingItem[]> {
  try {
    const bannerData = await getCachedBanner();

    const brandingImage = getImageUrl(
      bannerData.branding?.[0]?.content?.[0]?.file,
      "/images/image1.jpg"
    );

    return [
      {
        image: brandingImage,
      },
    ];
  } catch (error) {
    console.error("❌ Error fetching branding data:", error);
    return [];
  }
}
