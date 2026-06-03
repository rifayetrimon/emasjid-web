// services/newsService.ts
import { getCachedNews } from "./apiCache";
import { DEMO_NEWS } from "@/lib/demoContent";
import type { NewsItem, NewsPosDisplay, NewsImage } from "@/types/cms";

export interface HighlightNewsItem {
  contentId: string;
  title: string;
  message: string;
  image: string | null;
  date: string;
  altImg1: string;
}

function truthy(v: unknown): boolean {
  if (v === true) return true;
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  return s === "true" || s === "yes" || s === "1" || s === "on";
}

function parsePosDisplay(v: unknown): NewsPosDisplay {
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  if (s === "grid") return "grid";
  if (s === "sidebar") return "sidebar";
  if (s === "slide" || s === "slider") return "slide";
  return "full";
}

/**
 * The admin endpoint sometimes flattens `jsonData.data.*` into top-level
 * fields and sometimes returns the nested object. Read from either shape.
 */
function pickJson(raw: Record<string, unknown>): Record<string, unknown> {
  const json = (raw.jsonData as { data?: unknown } | undefined)?.data;
  return (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
}

function readField(raw: Record<string, unknown>, key: string): unknown {
  const fromTop = raw[key];
  if (fromTop !== undefined && fromTop !== null && fromTop !== "") return fromTop;
  return pickJson(raw)[key];
}

export function normalizeNewsItem(raw: Record<string, unknown>): NewsItem {
  const contentId = String(raw.contentId ?? "").trim();
  const title = String(raw.title ?? "");
  const message = String(raw.message ?? "");
  const date = String(raw.date ?? "");
  const time = String(raw.time ?? "");
  const status = Number(raw.status ?? 0);

  const file1 = (raw.file1 as string) || (readField(raw, "banner1") as string) || null;
  const file2 = (raw.file2 as string) || (readField(raw, "banner2") as string) || null;
  const file3 = (raw.file3 as string) || (readField(raw, "banner3") as string) || null;
  const altImg1 =
    (raw.altImg1 as string) || (readField(raw, "altImg1") as string) || "";
  const altImg2 =
    (raw.altImg2 as string) || (readField(raw, "altImg2") as string) || "";
  const altImg3 =
    (raw.altImg3 as string) || (readField(raw, "altImg3") as string) || "";

  const images: NewsImage[] = [];
  if (file1) images.push({ src: file1, alt: altImg1 || title });
  if (file2) images.push({ src: file2, alt: altImg2 || title });
  if (file3) images.push({ src: file3, alt: altImg3 || title });

  // Preserve admin's casing for display ("SPORTS" stays "SPORTS",
  // "Sukan" stays "Sukan"). Matching elsewhere is case-insensitive.
  const category = String(readField(raw, "category") ?? "").trim();

  return {
    contentId,
    title,
    message,
    date,
    time,
    status,
    file1,
    altImg1,
    images,
    category,
    isHighlight:
      truthy(raw.highlightPost) || truthy(readField(raw, "highlightpost")),
    isFrontPage: truthy(raw.frontPage) || truthy(readField(raw, "frontpage")),
    posDisplay: parsePosDisplay(raw.posDisplay ?? readField(raw, "posdisplay")),
    urlIframe: String(raw.urlIframe ?? readField(raw, "urliframe") ?? ""),
    mobileDes: String(raw.mobileDes ?? readField(raw, "mobiledes") ?? ""),
  };
}

const DEMO_HIGHLIGHTED: HighlightNewsItem[] = DEMO_NEWS
  .filter((n) => n.highlightPost === "yes")
  .map((n) => ({
    contentId: String(n.contentId),
    title: n.title,
    message: n.message,
    image: n.image,
    date: n.date,
    altImg1: n.altImg1,
  }));

/**
 * Returns every active (status === 1) news item, normalized. Falls back to
 * the bundled demo dataset only when the admin returns an empty list.
 */
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    const newsData = await getCachedNews();
    const dataset: Record<string, unknown>[] =
      newsData?.dataset || (Array.isArray(newsData) ? newsData : []);
    const items = dataset
      .map(normalizeNewsItem)
      .filter((n) => n.status === 1);
    if (items.length > 0) return items;
    return DEMO_NEWS.map((n) =>
      normalizeNewsItem({ ...n, status: 1 } as Record<string, unknown>)
    );
  } catch {
    return DEMO_NEWS.map((n) =>
      normalizeNewsItem({ ...n, status: 1 } as Record<string, unknown>)
    );
  }
}

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
    const items = await getAllNews();
    const highlighted = items.filter((i) => i.isHighlight);
    if (highlighted.length === 0) return DEMO_HIGHLIGHTED;
    return highlighted.map((item) => ({
      contentId: item.contentId,
      title: item.title,
      message: item.message,
      image: item.file1,
      date: item.date,
      altImg1: item.altImg1,
    }));
  } catch (error) {
    console.error("❌ Error fetching news data:", error);
    return DEMO_HIGHLIGHTED;
  }
}
