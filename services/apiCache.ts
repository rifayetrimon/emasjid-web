// services/apiCache.ts
import getConfig from "@/lib/getConfig";
import myAxios from "@/lib/myAxios";
import { isPreviewActive } from "@/lib/previewContext";

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

// ── Persistent (cross-reload) cache ──────────────────────────────────────
// The site navigates with full page reloads, so the in-memory `cache()` above
// is wiped on every navigation and each page re-fetches the whole shell
// (config / nav / footer / news …) from the network — the main cause of slow
// navigation. This layer additionally stores those slow-changing responses in
// sessionStorage (keyed by tenant `sid`, with a short TTL), so a navigation
// reads them instantly instead of hitting the API again. The cache lives only
// for the tab session, so a fresh visit re-fetches.
//
// Disabled in preview mode: the admin preview must always reflect live edits
// (and can switch tenant/branch), so it never reads/writes the persistent store.
const PERSIST_TTL_MS = 10 * 60 * 1000; // 10 minutes
const PERSIST_MAX_BYTES = 2_000_000; // skip very large payloads (quota safety)

function persistKey(label: string, sid: string): string {
  return `cmsd:${label}:${sid}`;
}

function readPersist<R>(label: string, sid: string): R | undefined {
  if (typeof window === "undefined" || isPreviewActive()) return undefined;
  try {
    const raw = window.sessionStorage.getItem(persistKey(label, sid));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { ts: number; value: R };
    if (!parsed || Date.now() - parsed.ts > PERSIST_TTL_MS) return undefined;
    return parsed.value;
  } catch {
    return undefined;
  }
}

function writePersist<R>(label: string, sid: string, value: R): void {
  if (typeof window === "undefined" || isPreviewActive()) return;
  try {
    const raw = JSON.stringify({ ts: Date.now(), value });
    if (raw.length > PERSIST_MAX_BYTES) return; // too big for sessionStorage
    window.sessionStorage.setItem(persistKey(label, sid), raw);
  } catch {
    // Quota exceeded / serialization error — skip; the network is used next time.
  }
}

// Like `cache()` but for no-arg fetchers, with a sessionStorage layer so the
// result survives full-reload navigations. `label` MUST be unique & stable.
function cachePersist<R>(label: string, fn: () => Promise<R>): () => Promise<R> {
  let mem: Promise<R> | undefined;
  return () => {
    if (mem) return mem;
    mem = (async () => {
      const sid = await getSID();
      const cached = readPersist<R>(label, sid);
      if (cached !== undefined) return cached;
      const value = await fn();
      writePersist(label, sid, value);
      return value;
    })();
    return mem;
  };
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

export const getCachedConfig = cachePersist("config", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/config?sid=${sid}`);
    // DEBUG: full config response so we can see whether a site-title field is
    // present (and under what key). Expand this object in the browser console.
    console.log("🟦 [CONFIG] response:", res.data?.data);
    return res.data?.data || {};
  } catch (error) {
    logApiError("getCachedConfig", error);
    return {};
  }
});

export const getCachedNavHeader = cachePersist("navHeader", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/nav-header?sid=${sid}`);
    return res.data?.data || null;
  } catch (error) {
    logApiError("getCachedNavHeader", error);
    return null;
  }
});

export const getCachedBanner = cachePersist("banner", async () => {
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
 * Fetch ALL active news by walking the paginated endpoint, so the "Lihat
 * Semua" archive truly shows every news item (a tenant may have hundreds).
 * `perPage=100` pulls big pages; the loop stops on a partial/empty page, so a
 * small tenant still does one request. MAX_PAGES is a hard backstop. Items are
 * dedup'd by `contentId` in case the API ignores pagination.
 */
export const getCachedNews = cachePersist("news", async () => {
  try {
    const sid = await getSID();
    const PER_PAGE = 100;
    const MAX_PAGES = 30; // hard backstop (3000 items) against a bad API
    // contentId is whatever the backend ships — historically a numeric
    // string, now a 24-char Mongo-style hex (e.g. "6a1eb214a5cb07561f8a6a5c").
    // Keep the dedup set as plain strings so both shapes coexist.
    const seen = new Set<string>();
    const merged: Record<string, unknown>[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      // Backend pagination params are camelCase: `pageNumber` + `perPage`.
      // The old lowercase `currentpage` was silently ignored — pagination
      // only "worked" by accident when total items fit in page 1.
      const res = await myAxios.get(
        `api/v2/cms/eboss/cms/news?sid=${sid}&pageNumber=${page}&perPage=${PER_PAGE}`
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
      if (dataset.length < PER_PAGE) break;
    }

    return { dataset: merged };
  } catch (error) {
    logApiError("getCachedNews", error);
    return { dataset: [] as Record<string, unknown>[] };
  }
});

export const getCachedFooter = cachePersist("footer", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/footer?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedFooter", error);
    return [];
  }
});

export const getCachedFaq = cachePersist("faq", async () => {
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

export const getCachedSideBanner = cachePersist("sideBanner", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/banner?sid=${sid}&type=Sider`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedSideBanner", error);
    return [];
  }
});

export const getCachedPromotagBanner = cachePersist("promotag", async () => {
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

export const getCachedAddonPlugin = cachePersist("addonPlugin", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/addon-plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedAddonPlugin", error);
    return [];
  }
});

export const getCachedVisitors = cachePersist("visitors", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/visitors?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    logApiError("getCachedVisitors", error);
    return {};
  }
});

export const getCachedStaticContent = cachePersist("staticContent", async () => {
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

export const getCachedGallery = cachePersist("gallery", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/gallery?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedGallery", error);
    return [];
  }
});

export const getCachedGalleryCategory = cachePersist("galleryCategory", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/gallery/category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedGalleryCategory", error);
    return [];
  }
});

export const getCachedPlugin = cachePersist("plugin", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedPlugin", error);
    return [];
  }
});

export const getCachedPluginCategory = cachePersist("pluginCategory", async () => {
  try {
    const sid = await getSID();
    const res = await myAxios.get(`api/v2/cms/eboss/cms/plugin-category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    logApiError("getCachedPluginCategory", error);
    return [];
  }
});
