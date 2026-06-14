// services/apiCache.ts
import getConfig from "@/lib/getConfig";
import myAxios from "@/lib/myAxios";

// Isomorphic request memoizer — replaces React's server-only `cache()` so
// these helpers run in the browser too (the app is a static export with no
// server). Dedupes by argument list and reuses the in-flight/resolved
// promise for the lifetime of the page session; a full reload re-fetches.
// IMPORTANT: Each function has try/catch to prevent cached rejected promises
// from cascading and crashing the entire render.
function cache<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  const store = new Map<string, Promise<R>>();
  return (...args: A) => {
    const key = args.length ? JSON.stringify(args) : "";
    let hit = store.get(key);
    if (!hit) {
      hit = fn(...args);
      store.set(key, hit);
    }
    return hit;
  };
}

async function getSID(): Promise<string> {
  return (await getConfig()).sid || "";
}

// The list endpoints (news / static-content) ship a trimmed record that omits
// heavy fields like `message`. The by-id call returns the full record wrapped
// in the same `{ data: { dataset: [...] } }` envelope — pull the single item.
function firstDatasetItem(data: unknown): Record<string, unknown> | null {
  const dataset: Record<string, unknown>[] = Array.isArray(data)
    ? (data as Record<string, unknown>[])
    : Array.isArray((data as { dataset?: Record<string, unknown>[] })?.dataset)
    ? (data as { dataset: Record<string, unknown>[] }).dataset
    : [];
  return dataset[0] ?? null;
}

// A 404 from these endpoints means the tenant simply hasn't configured that
// resource (e.g. no FAQ, no gallery) — it's expected, not a failure. We log
// it quietly so it doesn't trip the Next.js dev error overlay, while any
// other error (network, 5xx, auth) is still surfaced as a real error.
function logApiError(label: string, error: unknown): void {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 404) {
    console.log(`ℹ️ ${label}: not available for this tenant (404) — skipping`);
  } else {
    console.error(`❌ ${label} failed:`, error);
  }
}

export const getCachedConfig = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/config?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    logApiError("getCachedConfig", error);
    return {};
  }
});

export const getCachedNavHeader = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/nav-header?sid=${sid}`);
    return res.data?.data || null;
  } catch (error) {
    logApiError("getCachedNavHeader", error);
    return null;
  }
});

export const getCachedBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/banner?sid=${sid}&type=Banner`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedBanner", error);
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
    logApiError("getCachedNews", error);
    return { dataset: [] as Record<string, unknown>[] };
  }
});

export const getCachedFooter = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/footer?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedFooter", error);
    return [];
  }
});

export const getCachedFaq = cache(async () => {
  try {
    const sid = await getSID();
    const url = `api/v2/cms/eboss/cms/faq?sid=${sid}`;
    // DEBUG: trace the FAQ request/response. The upstream gateway returns the
    // FAQ differently per environment (aws01 currently 401s the content key on
    // this route while devapi02 returns data), so log both to compare.
    console.log("🟡 [FAQ] request:", url);
    const res = await myAxios.get(url);
    console.log("🟢 [FAQ] response:", res.status, res.data);
    return res.data?.data || [];
  } catch (error) {
    const resp = (error as { response?: { status?: number; data?: unknown } })?.response;
    console.log("🔴 [FAQ] error:", resp?.status, resp?.data ?? error);
    logApiError("getCachedFaq", error);
    return [];
  }
});

export const getCachedSideBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/banner?sid=${sid}&type=Sider`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedSideBanner", error);
    return [];
  }
});

export const getCachedPromotagBanner = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/banner?sid=${sid}&type=Promotag`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedPromotagBanner", error);
    return [];
  }
});

export const getCachedNewsDetail = cache(async (contentId: string) => {
  try {
    const sid = await getSID();
    // The detail record (with `message`, etc.) comes from the SAME list
    // endpoint filtered by `idnews` — not a `/news/{id}` path. The response
    // is a one-item dataset.
    const res = await myAxios.get(
      `api/v2/cms/eboss/cms/news?sid=${sid}&idnews=${contentId}&pageNumber=1&perPage=10`
    );
    return firstDatasetItem(res.data?.data);
  } catch (error) {
    logApiError("getCachedNewsDetail", error);
    return null;
  }
});

export const getCachedStaticContentDetail = cache(async (contentId: string) => {
  try {
    const sid = await getSID();
    // Same shape as news: the static-content list omits `message`; the by-id
    // call returns the full record. The id param is `idnews` on this endpoint
    // too (the backend reuses the param name).
    const res = await myAxios.get(
      `api/v2/cms/eboss/cms/static-content?sid=${sid}&idnews=${contentId}&pageNumber=1&perPage=10`
    );
    return firstDatasetItem(res.data?.data);
  } catch (error) {
    logApiError("getCachedStaticContentDetail", error);
    return null;
  }
});

export const getCachedAddonPlugin = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/addon-plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedAddonPlugin", error);
    return [];
  }
});

export const getCachedVisitors = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/visitors?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    logApiError("getCachedVisitors", error);
    return {};
  }
});

export const getCachedStaticContent = cache(async () => {
  try {
    const sid = await getSID();
    // Walk ALL pages. A fixed `perPage=100` silently dropped any static
    // pages beyond the 100th (the tenant currently has 104) — their
    // `/static/<contentId>` routes then 404 because the item never loads.
    // We page through until the server runs out, dedup'd by contentId.
    // perPage=200 pulls the current full set in a single request while the
    // page loop still covers tenants that grow past one page.
    const PER_PAGE = 200;
    const MAX_PAGES = 50; // hard backstop (10000 items) against a bad API
    const seen = new Set<string>();
    const merged: Record<string, unknown>[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await myAxios.get(
        `api/v2/cms/eboss/cms/static-content?sid=${sid}&pageNumber=${page}&perPage=${PER_PAGE}`
      );
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
        const id = String(item.contentId ?? item.staticId ?? "").trim();
        // Keep items even if they somehow lack an id; only dedup real ids.
        if (id && seen.has(id)) continue;
        if (id) seen.add(id);
        merged.push(item);
        added++;
      }

      // Stop if the API isn't paginating (page returned only dupes) or it
      // handed back a partial page (no more pages on the server).
      if (added === 0) break;
      if (dataset.length < PER_PAGE) break;
    }

    return { dataset: merged };
  } catch (error) {
    logApiError("getCachedStaticContent", error);
    return { dataset: [] as Record<string, unknown>[] };
  }
});

export const getCachedGallery = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/gallery?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedGallery", error);
    return [];
  }
});

export const getCachedGalleryCategory = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/gallery/category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedGalleryCategory", error);
    return [];
  }
});

export const getCachedPlugin = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedPlugin", error);
    return [];
  }
});

export const getCachedPluginCategory = cache(async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/plugin-category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedPluginCategory", error);
    return [];
  }
});
