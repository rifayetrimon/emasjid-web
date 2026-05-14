// services/apiCache.ts
import { cache } from "react";
import getConfig from "@/lib/getConfig";
import myAxios from "@/lib/myAxios";

// React `cache()` will deduplicate requests with the same arguments
// during a single server-rendered request cycle.
// IMPORTANT: Each function has try/catch to prevent cached rejected promises
// from cascading and crashing the entire page render.

function getSID(): string {
  return getConfig().sid || "";
}

export const getCachedConfig = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`config?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    console.error("❌ getCachedConfig failed:", error);
    return {};
  }
});

export const getCachedNavHeader = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`nav-header?sid=${sid}`);
    return res.data?.data || null;
  } catch (error) {
    console.error("❌ getCachedNavHeader failed:", error);
    return null;
  }
});

export const getCachedBanner = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`banner?sid=${sid}&type=Banner`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedBanner failed:", error);
    return [];
  }
});

export const getCachedNews = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`news?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedNews failed:", error);
    return [];
  }
});

export const getCachedFooter = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`footer?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedFooter failed:", error);
    return [];
  }
});

export const getCachedFaq = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`faq?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedFaq failed:", error);
    return [];
  }
});

export const getCachedSideBanner = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`banner?sid=${sid}&type=Sider`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedSideBanner failed:", error);
    return [];
  }
});

export const getCachedPromotagBanner = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`banner?sid=${sid}&type=Promotag`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPromotagBanner failed:", error);
    return [];
  }
});

export const getCachedNewsDetail = cache(async (contentId: string) => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`news/${contentId}?sid=${sid}`);
    return res.data?.data || null;
  } catch (error) {
    console.error("❌ getCachedNewsDetail failed:", error);
    return null;
  }
});

export const getCachedAddonPlugin = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`addon-plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedAddonPlugin failed:", error);
    return [];
  }
});

export const getCachedVisitors = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`visitors?sid=${sid}`);
    return res.data?.data || {};
  } catch (error) {
    console.error("❌ getCachedVisitors failed:", error);
    return {};
  }
});

export const getCachedStaticContent = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`static-content?sid=${sid}&currentpage=1`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedStaticContent failed:", error);
    return [];
  }
});

export const getCachedGallery = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`gallery?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedGallery failed:", error);
    return [];
  }
});

export const getCachedGalleryCategory = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`gallery/category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedGalleryCategory failed:", error);
    return [];
  }
});

export const getCachedPlugin = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`plugin?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPlugin failed:", error);
    return [];
  }
});

export const getCachedPluginCategory = cache(async () => {
  try {
    const sid = getSID();
    const res = await myAxios.get(`plugin-category?sid=${sid}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ getCachedPluginCategory failed:", error);
    return [];
  }
});
