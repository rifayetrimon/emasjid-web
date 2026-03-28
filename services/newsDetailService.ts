// services/newsDetailService.ts
import { getCachedNews } from "./apiCache";

export type DisplayMode = "grid" | "slide" | "full" | "sidebar";

export interface NewsDetail {
  id: number;
  title: string;
  message: string;
  images: { src: string; alt: string }[];
  urlIframe: string;
  date: string;
  time: string;
  displayMode: DisplayMode;
}

function parseDisplayMode(posDisplay: string): DisplayMode {
  const val = (posDisplay || "").toLowerCase().trim();
  if (val === "grid") return "grid";
  if (val === "slide" || val === "slider") return "slide";
  if (val === "sidebar") return "sidebar";
  return "full";
}

export async function getNewsDetail(contentId: string): Promise<NewsDetail | null> {
  try {
    const newsData = await getCachedNews();
    const dataset = newsData?.dataset || (Array.isArray(newsData) ? newsData : []);

    const data = dataset.find(
      (item: Record<string, unknown>) =>
        String(item.contentId) === contentId
    );

    if (!data) return null;

    const images: { src: string; alt: string }[] = [];
    if (data.file1) images.push({ src: data.file1, alt: data.altImg1 || data.title });
    if (data.file2) images.push({ src: data.file2, alt: data.altImg2 || data.title });
    if (data.file3) images.push({ src: data.file3, alt: data.altImg3 || data.title });

    return {
      id: data.contentId,
      title: data.title || "",
      message: data.message || "",
      images,
      urlIframe: data.urlIframe || "",
      date: data.date || "",
      time: data.time || "",
      displayMode: parseDisplayMode(data.posDisplay),
    };
  } catch (error) {
    console.error("❌ Error fetching news detail:", error);
    return null;
  }
}
