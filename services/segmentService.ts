// services/segmentService.ts
import { getCachedBanner } from "./apiCache";
import { SegmentsProps } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getSegmentsData(): Promise<SegmentsProps["segments"]> {
  try {
    const bannerData = await getCachedBanner();

    const segmentImage = getImageUrl(
      bannerData.bottom?.[0]?.content?.[0]?.file,
      "/images/about/about.png"
    );

    return [
      {
        image: segmentImage,
        text: "MAKLUMAN : Berkuat kuasa mulai 1 SEPTEMBER 2024, permohonan baharu eMasjid MAIS akan dilaksanakan berdasarkan Peraturan-Peraturan berpandukan Majlis Agama Islam (Negeri Selangor) 2025.",
        button: { label: "Lihat Selanjutnya", link: "#" },
      },
    ];
  } catch (error) {
    console.error("❌ Error fetching segment data:", error);
    return [];
  }
}
