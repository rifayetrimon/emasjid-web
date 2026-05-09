// services/newsService.ts
import { getCachedNews } from "./apiCache";
import { DEMO_NEWS } from "@/lib/demoContent";

export interface HighlightNewsItem {
  contentId: number;
  title: string;
  message: string;
  image: string | null;
  date: string;
  altImg1: string;
}

const DEMO_HIGHLIGHTED: HighlightNewsItem[] = DEMO_NEWS
  .filter((n) => n.highlightPost === "yes")
  .map((n) => ({
    contentId: n.contentId,
    title: n.title,
    message: n.message,
    image: n.image,
    date: n.date,
    altImg1: n.altImg1,
  }));

export async function getAllNewsWithFallback() {
  try {
    const newsData = await getCachedNews();
    const dataset =
      newsData?.dataset || (Array.isArray(newsData) ? newsData : []);
    return dataset.length > 0 ? dataset : DEMO_NEWS;
  } catch {
    return DEMO_NEWS;
  }
}

export async function getNewsData(): Promise<HighlightNewsItem[]> {
  try {
    const newsData = await getCachedNews();

    const dataset = newsData?.dataset || (Array.isArray(newsData) ? newsData : []);

    const highlighted = dataset.filter((item: Record<string, unknown>) => {
      const val = String(item?.highlightPost || "").toLowerCase();
      return val === "true" || val === "yes";
    });

    const items: HighlightNewsItem[] = highlighted.map(
      (item: Record<string, unknown>) => ({
        contentId: item.contentId as number,
        title: (item.title as string) || "",
        message: (item.message as string) || "",
        image: (item.file1 as string) || null,
        date: (item.date as string) || "",
        altImg1: (item.altImg1 as string) || "",
      })
    );

    return items.length > 0 ? items : DEMO_HIGHLIGHTED;
  } catch (error) {
    console.error("❌ Error fetching news data:", error);
    return DEMO_HIGHLIGHTED;
  }
}
