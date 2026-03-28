// services/newsService.ts
import { getCachedNews } from "./apiCache";

export interface HighlightNewsItem {
  contentId: number;
  title: string;
  message: string;
  image: string | null;
  date: string;
  altImg1: string;
}

export async function getNewsData() {
  try {
    const newsData = await getCachedNews();

    const dataset = newsData?.dataset || (Array.isArray(newsData) ? newsData : []);

    // Filter only highlighted posts
    const highlighted = dataset.filter(
      (item: Record<string, unknown>) => {
        const val = String(item?.highlightPost || "").toLowerCase();
        return val === "true" || val === "yes";
      }
    );

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

    return items;
  } catch (error) {
    console.error("❌ Error fetching news data:", error);
    return [];
  }
}
