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
    const res = await myAxios.get(`api/v2/cms/eboss/cms/config?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    console.error("❌ getCachedConfig failed:", error);
    return {};
  }
});

export const getCachedNavHeader = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/nav-header?sid=${sid}`);
    return res.data?.data || null;
  } catch (error) {
    console.error("❌ getCachedNavHeader failed:", error);
    return null;
  }
});

export const getCachedBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/banner?sid=${sid}&type=Banner`);
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
    // contentId is whatever the backend ships — historically a numeric
    // string, now a 24-char Mongo-style hex (e.g. "6a1eb214a5cb07561f8a6a5c").
    // Keep the dedup set as plain strings so both shapes coexist.
    const seen = new Set<string>();
    const merged: Record<string, unknown>[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      // Backend pagination params are camelCase: `pageNumber` + `perPage`.
      // The old lowercase `currentpage` was silently ignored — pagination
      // only "worked" by accident when total items fit in page 1.
      const res = await myAxios.get(`api/v2/cms/eboss/cms/news?sid=${sid}&pageNumber=${page}&perPage=10`);
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
        const id = String(item.contentId ?? "").trim();
        if (!id || seen.has(id)) continue;
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
    const res = await myAxios.get(`api/v2/cms/eboss/cms/footer?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedFooter failed:", error);
    return [];
  }
});

export const getCachedFaq = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/faq?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedFaq failed:", error);
    return [];
  }
});

export const getCachedSideBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/banner?sid=${sid}&type=Sider`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedSideBanner failed:", error);
    return [];
  }
});

export const getCachedPromotagBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/banner?sid=${sid}&type=Promotag`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPromotagBanner failed:", error);
    return [];
  }
});

export const getCachedNewsDetail = cache(async (contentId: string) => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/news/${contentId}?sid=${sid}`);
    return res.data?.data || null;
  } catch (error) {
    console.error("❌ getCachedNewsDetail failed:", error);
    return null;
  }
});

export const getCachedAddonPlugin = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/addon-plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedAddonPlugin failed:", error);
    return [];
  }
});

export const getCachedVisitors = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/visitors?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    console.error("❌ getCachedVisitors failed:", error);
    return {};
  }
});

export const getCachedStaticContent = cache(async () => {
  try {
    const sid = await getSID();
    // Backend pagination params are camelCase. `currentpage` was a
    // silent miss — we'd only ever see page 1 regardless of intent.
    const res = await myAxios.get(`api/v2/cms/eboss/cms/static-content?sid=${sid}&pageNumber=1&perPage=100`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedStaticContent failed:", error);
    return [];
  }
});

export const getCachedGallery = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/gallery?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedGallery failed:", error);
    return [];
  }
});

export const getCachedGalleryCategory = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/gallery/category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedGalleryCategory failed:", error);
    return [];
  }
});

export const getCachedPlugin = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPlugin failed:", error);
    return [];
  }
});

export const getCachedPluginCategory = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/plugin-category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPluginCategory failed:", error);
    return [];
  }
});
