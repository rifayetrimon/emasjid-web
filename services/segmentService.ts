// services/segmentService.ts
import { getCachedBanner } from "./apiCache";
import { SegmentsProps } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getSegmentsData(): Promise<SegmentsProps["segments"]> {
  try {
    const bannerData = await getCachedBanner();

    const firstBanner = Array.isArray(bannerData) ? bannerData[0] : bannerData;

    const segmentImage = getImageUrl(firstBanner?.imageUrl);

    const segmentText = firstBanner?.urllink2 || "";
    const segmentButtonLink = firstBanner?.urllink3 || "#";

    return [
      {
        image: segmentImage,
        text: segmentText,
        button: segmentButtonLink
          ? { label: "Lihat Selanjutnya", link: segmentButtonLink }
          : undefined,
      },
    ];
  } catch (error) {
    console.error("❌ Error fetching segment data:", error);
    return [];
  }
}
