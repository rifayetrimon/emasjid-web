// services/galleryService.ts
import { getCachedGalleryCategory } from "./apiCache";
import getConfig from "@/lib/getConfig";
import myAxios from "@/lib/myAxios";
import { getImageUrl } from "./utils";
import type { GalleryCategory, GalleryItem } from "@/types/cms";

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i;
const DOCUMENT_EXT_RE = /\.(pdf|docx?|xlsx?|pptx?|txt|csv|rtf|odt|ods|odp)(\?.*)?$/i;

interface RawGalleryItem {
  contentId?: number | string;
  galleryId?: number | string;
  date?: string;
  title?: string;
  file?: string | null;
  file1?: string | null;
  category?: string | null;
}

interface RawCategory {
  id?: number | string;
  categoryId?: number | string;
  name?: string;
  title?: string;
}

interface RawGalleryResponse {
  total_data?: number;
  total_records?: number;
  dataset?: RawGalleryItem[];
}

export interface GalleryPage {
  items: GalleryItem[];
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

function isImage(url: string | null | undefined): boolean {
  if (!url) return false;
  return IMAGE_EXT_RE.test(url);
}

function isDocument(url: string | null | undefined): boolean {
  if (!url) return false;
  return DOCUMENT_EXT_RE.test(url);
}

function normalizeItem(raw: RawGalleryItem): GalleryItem | null {
  // API uses `file1` for the asset URL and `contentId` for the id.
  // Older mock data uses `file` / `galleryId` — accept either.
  const rawFile = (raw.file1 || raw.file || "").trim();
  if (!rawFile) return null;
  const image = isImage(rawFile);
  const document = !image && isDocument(rawFile);
  // Anything that's neither an image nor a known document format
  // (e.g. .zip, .mp4) is dropped — the gallery UI can't represent it.
  if (!image && !document) return null;
  const file = getImageUrl(rawFile);
  const id = String(raw.contentId ?? raw.galleryId ?? "").trim();
  return {
    galleryId: id,
    date: raw.date || "",
    title: raw.title || "",
    file,
    kind: image ? "image" : "document",
    category: raw.category || "",
  };
}

function readDataset(raw: unknown): RawGalleryItem[] {
  if (Array.isArray(raw)) return raw as RawGalleryItem[];
  const ds = (raw as RawGalleryResponse)?.dataset;
  return Array.isArray(ds) ? ds : [];
}

function readTotal(raw: unknown, fallback: number): number {
  const r = raw as RawGalleryResponse;
  // Backend now ships `total_records` = grand total across all pages.
  // `total_data` is just the size of the current page, so it must NOT
  // be used as the pagination total. Prefer total_records → total_data
  // → fallback to the page size as a last resort.
  if (typeof r?.total_records === "number" && r.total_records >= 0) {
    return r.total_records;
  }
  if (typeof r?.total_data === "number" && r.total_data >= 0) {
    return r.total_data;
  }
  return fallback;
}

function normalizeCategory(raw: RawCategory): GalleryCategory | null {
  const name = raw.name || raw.title || "";
  if (!name) return null;
  return { id: raw.id ?? raw.categoryId ?? name, name };
}

/**
 * Fetches a single page of gallery items, returning normalized image-only
 * entries plus pagination metadata so the UI can render Prev/Next controls.
 * Caller controls `currentPage` (1-indexed).
 *
 * Not cached via React.cache because the URL varies per page; let Next handle
 * fetch dedup via `next: { revalidate: 0 }` (default no-store on myAxios).
 */
export async function getGalleryPage(
  currentPage: number = 1,
  perPage: number = 10
): Promise<GalleryPage> {
  try {
    const sid = (await getConfig()).sid || "0";
    // Backend pagination params are camelCase: `pageNumber` + `perPage`.
    // The lowercase `currentpage` we used before was silently ignored —
    // the server always returned page 1, which is why pagination clicks
    // looked like they "didn't change the content".
    const res = await myAxios.get(
      `api/v2/cms/eboss/cms/gallery?sid=${sid}&pageNumber=${currentPage}&perPage=${perPage}`
    );
    const data = res.data?.data ?? res.data ?? {};

    const dataset = readDataset(data);
    const items = dataset
      .map(normalizeItem)
      .filter((g): g is GalleryItem => g !== null);

    // Admin's `total_data` is the count of returned items in this page,
    // not the grand total. Fall back to that count when unsure.
    const totalRaw = readTotal(data, items.length);
    const totalPages = totalRaw <= 0 ? 1 : Math.max(1, Math.ceil(totalRaw / perPage));

    return {
      items,
      total: totalRaw,
      currentPage,
      perPage,
      totalPages,
    };
  } catch (error) {
    console.error("❌ Error fetching gallery page:", error);
    return {
      items: [],
      total: 0,
      currentPage,
      perPage,
      totalPages: 1,
    };
  }
}

/** Back-compat for older callers that expect a flat list. */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const page = await getGalleryPage(1, 10);
  return page.items;
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  try {
    const raw = await getCachedGalleryCategory();
    const dataset: RawCategory[] = Array.isArray(raw)
      ? (raw as RawCategory[])
      : Array.isArray((raw as { dataset?: RawCategory[] })?.dataset)
      ? ((raw as { dataset: RawCategory[] }).dataset)
      : [];
    return dataset
      .map(normalizeCategory)
      .filter((c): c is GalleryCategory => c !== null);
  } catch (error) {
    console.error("❌ Error fetching gallery categories:", error);
    return [];
  }
}
