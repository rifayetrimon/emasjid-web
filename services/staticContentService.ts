// services/staticContentService.ts
import { getCachedStaticContent } from "./apiCache";
import { getImageUrl } from "./utils";
import type { StaticContentItem, NewsImage, NewsPosDisplay } from "@/types/cms";

interface RawStatic {
  contentId?: number | string;
  staticId?: number | string;
  date?: string;
  time?: string;
  timestamp?: string;
  status?: number | string;
  hits?: number;
  title?: string;
  message?: string;
  urlIframe?: string | null;
  posDisplay?: string | null;
  altImg1?: string | null;
  altImg2?: string | null;
  altImg3?: string | null;
  file1?: string | null;
  file2?: string | null;
  file3?: string | null;
  // Legacy nested shape from earlier reference docs.
  jsonData?: {
    data?: {
      posdisplay?: string;
      urliframe?: string;
      iframesize?: string;
      banner1?: string;
      banner2?: string;
      banner3?: string;
      altImg1?: string;
      altImg2?: string;
      altImg3?: string;
    };
  };
}

function parsePosDisplay(v: unknown): NewsPosDisplay {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "grid") return "grid";
  if (s === "sidebar") return "sidebar";
  if (s === "slide" || s === "slider") return "slide";
  return "full";
}

function readDataset(raw: unknown): RawStatic[] {
  if (Array.isArray(raw)) return raw as RawStatic[];
  const ds = (raw as { dataset?: RawStatic[] })?.dataset;
  return Array.isArray(ds) ? ds : [];
}

function normalize(raw: RawStatic): StaticContentItem {
  // Read flat fields first (the actual /static-content shape), then fall
  // back to the nested jsonData.data.* form from older docs.
  const legacy = raw.jsonData?.data || {};
  const title = raw.title || "";
  const file1 = raw.file1 || legacy.banner1 || "";
  const file2 = raw.file2 || legacy.banner2 || "";
  const file3 = raw.file3 || legacy.banner3 || "";
  const alt1 = raw.altImg1 || legacy.altImg1 || "";
  const alt2 = raw.altImg2 || legacy.altImg2 || "";
  const alt3 = raw.altImg3 || legacy.altImg3 || "";

  const imgs: NewsImage[] = [];
  if (file1) imgs.push({ src: getImageUrl(file1), alt: alt1 || title });
  if (file2) imgs.push({ src: getImageUrl(file2), alt: alt2 || title });
  if (file3) imgs.push({ src: getImageUrl(file3), alt: alt3 || title });

  return {
    staticId: Number(raw.contentId ?? raw.staticId ?? 0),
    date: raw.date || "",
    time: raw.time || "",
    status: Number(raw.status ?? 0),
    hits: Number(raw.hits ?? 0),
    title,
    message: raw.message || "",
    posDisplay: parsePosDisplay(raw.posDisplay ?? legacy.posdisplay),
    urlIframe: raw.urlIframe || legacy.urliframe || "",
    iframeSize: legacy.iframesize || "",
    images: imgs,
  };
}

/**
 * Returns all static content items. We don't filter by `status === 1` here
 * because admin sometimes ships static-content with status 0 (the response
 * the team verified uses 0 for live home-page content).
 */
export async function getStaticContent(): Promise<StaticContentItem[]> {
  try {
    const raw = await getCachedStaticContent();
    return readDataset(raw).map(normalize);
  } catch (error) {
    console.error("❌ Error fetching static content:", error);
    return [];
  }
}

/**
 * Static-content items tagged for the home page. Admin uses `urlIframe` as
 * a placement slug — items where it's "home" (case-insensitive) are surfaced
 * on the home page. Falls back to every item when no item has the tag, so
 * the UI never goes empty on a fresh install.
 */
export async function getHomePageStaticContent(): Promise<StaticContentItem[]> {
  const all = await getStaticContent();
  const tagged = all.filter((s) => s.urlIframe.trim().toLowerCase() === "home");
  return tagged.length > 0 ? tagged : all;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Find a static content item by its admin-supplied slug. Admin stores the
 * slug in `urlIframe` (e.g. "home", "about-us", or sometimes a URL like
 * "https://home"). We try multiple match strategies so admin can be loose
 * with formatting.
 */
export async function getStaticContentBySlug(
  slug: string
): Promise<StaticContentItem | null> {
  const needle = slugify(slug);
  if (!needle) return null;
  const items = await getStaticContent();

  for (const item of items) {
    // 1) Match against the urlIframe slug (case-insensitive, ignoring protocol/host noise)
    if (slugify(item.urlIframe) === needle) return item;
    // 2) Match against the contentId / staticId
    if (String(item.staticId) === needle) return item;
    // 3) Match against the slugified title
    if (slugify(item.title) === needle) return item;
  }
  return null;
}

/**
 * Locate the static page that satisfies the privacy/TnC slug from Config.
 */
export async function getPrivacyTncStatic(
  privacyTncPage: string
): Promise<StaticContentItem | null> {
  if (!privacyTncPage) return null;
  const items = await getStaticContent();
  const needle = privacyTncPage.trim().toLowerCase();
  if (!needle) return null;
  const byId = items.find((s) => String(s.staticId) === needle);
  if (byId) return byId;
  return (
    items.find((s) => s.title.toLowerCase().includes(needle)) ?? null
  );
}
