// services/newsDetailService.ts
import { getCachedNews } from "./apiCache";

export type DisplayMode = "grid" | "slide" | "full" | "sidebar";

export interface NewsDetail {
  id: string;
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
    const dataset = newsData?.dataset || [];

    const raw = dataset.find(
      (item: Record<string, unknown>) =>
        String(item.contentId) === contentId
    );

    if (!raw) return null;

    const str = (v: unknown): string =>
      v === null || v === undefined ? "" : String(v);
    const title = str(raw.title);

    const images: { src: string; alt: string }[] = [];
    if (raw.file1) images.push({ src: str(raw.file1), alt: str(raw.altImg1) || title });
    if (raw.file2) images.push({ src: str(raw.file2), alt: str(raw.altImg2) || title });
    if (raw.file3) images.push({ src: str(raw.file3), alt: str(raw.altImg3) || title });

    return {
      id: String(raw.contentId ?? "").trim(),
      title,
      message: str(raw.message),
      images,
      urlIframe: str(raw.urlIframe),
      date: str(raw.date),
      time: str(raw.time),
      displayMode: parseDisplayMode(str(raw.posDisplay)),
    };
  } catch (error) {
    console.error("❌ Error fetching news detail:", error);
    return null;
  }
}
