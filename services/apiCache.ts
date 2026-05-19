// services/apiCache.ts
import { cache } from "react";
import getConfig from "@/lib/getConfig";
import myAxios from "@/lib/myAxios";

// React `cache()` will deduplicate requests with the same arguments
// during a single server-rendered request cycle.
// IMPORTANT: Each function has try/catch to prevent cached rejected promises
// from cascading and crashing the entire page render.

async function getSID(): Promise<string> {
  return (await getConfig()).sid || "";
}

export const getCachedConfig = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/config?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    console.error("❌ getCachedConfig failed:", error);
    return {};
  }
});

export const getCachedNavHeader = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/nav-header?sid=${sid}`);
    return res.data?.data || null;
  } catch (error) {
    console.error("❌ getCachedNavHeader failed:", error);
    return null;
  }
});

export const getCachedBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/banner?sid=${sid}&type=Banner`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedBanner failed:", error);
    return [];
  }
});

/**
 * Fetch ALL active news by walking the paginated endpoint. The backend
 * caps a single response at ~10 items, but the home page slot design
 * needs at least 13. We walk pages until we either run out of items or
 * hit a hard cap (5 pages → 50 items). Items are dedup'd by `contentId`
 * to be safe in case the API ignores `currentpage`.
 */
export const getCachedNews = cache(async () => {
  try {
    const sid = await getSID();
    const MAX_PAGES = 5;
    const seen = new Set<number>();
    const merged: Record<string, unknown>[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await myAxios.get(`api/v2/utilities/eboss/cms/news?sid=${sid}&currentpage=${page}`);
      const data = res.data?.data ?? {};
      const dataset: Record<string, unknown>[] = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : Array.isArray(
            (data as { dataset?: Record<string, unknown>[] })?.dataset
          )
        ? (data as { dataset: Record<string, unknown>[] }).dataset
        : [];

      if (dataset.length === 0) break;

      let added = 0;
      for (const item of dataset) {
        const id = Number(item.contentId);
        if (!Number.isFinite(id) || seen.has(id)) continue;
        seen.add(id);
        merged.push(item);
        added++;
      }

      // Stop if the API isn't actually paginating (page 2 returned the
      // same items as page 1 → no new entries added).
      if (added === 0) break;

      // Stop if we got a partial page — no more pages on the server.
      if (dataset.length < 10) break;
    }

    return { dataset: merged };
  } catch (error) {
    console.error("❌ getCachedNews failed:", error);
    return { dataset: [] as Record<string, unknown>[] };
  }
});

export const getCachedFooter = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/footer?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedFooter failed:", error);
    return [];
  }
});

export const getCachedFaq = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/faq?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedFaq failed:", error);
    return [];
  }
});

export const getCachedSideBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/banner?sid=${sid}&type=Sider`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedSideBanner failed:", error);
    return [];
  }
});

export const getCachedPromotagBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/banner?sid=${sid}&type=Promotag`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPromotagBanner failed:", error);
    return [];
  }
});

export const getCachedNewsDetail = cache(async (contentId: string) => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/news/${contentId}?sid=${sid}`);
    return res.data?.data || null;
  } catch (error) {
    console.error("❌ getCachedNewsDetail failed:", error);
    return null;
  }
});

export const getCachedAddonPlugin = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/addon-plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedAddonPlugin failed:", error);
    return [];
  }
});

export const getCachedVisitors = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/visitors?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    console.error("❌ getCachedVisitors failed:", error);
    return {};
  }
});

export const getCachedStaticContent = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/static-content?sid=${sid}&currentpage=1`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedStaticContent failed:", error);
    return [];
  }
});

export const getCachedGallery = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/gallery?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedGallery failed:", error);
    return [];
  }
});

export const getCachedGalleryCategory = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/gallery/category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedGalleryCategory failed:", error);
    return [];
  }
});

export const getCachedPlugin = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPlugin failed:", error);
    return [];
  }
});

export const getCachedPluginCategory = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/utilities/eboss/cms/plugin-category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPluginCategory failed:", error);
    return [];
  }
});
