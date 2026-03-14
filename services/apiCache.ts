// services/apiCache.ts
import { cache } from "react";
import getConfig from "@/lib/getConfig";
import myAxios from "@/lib/myAxios";

// React `cache()` will deduplicate requests with the same arguments
// during a single server-rendered request cycle.

/**
 * Common function to get SID for endpoints.
 */
function getSID(): string {
  return getConfig().sid || "";
}

/**
 * Fetches the configuration data
 */
export const getCachedConfig = cache(async () => {
  const sid = getSID();
  const res = await myAxios.get(`config?sid=${sid}`);
  return res.data?.data || {};
});

/**
 * Fetches the navigation headers data
 */
export const getCachedNavHeader = cache(async () => {
  const sid = getSID();
  const res = await myAxios.get(`nav-header?sid=${sid}`);
  return res.data?.data || null;
});

/**
 * Fetches the banner section data (returns array)
 */
export const getCachedBanner = cache(async () => {
  const sid = getSID();
  const res = await myAxios.get(`banner?sid=${sid}`);
  return res.data?.data || [];
});

/**
 * Fetches the footer section data (returns array)
 */
export const getCachedFooter = cache(async () => {
  const sid = getSID();
  const res = await myAxios.get(`footer?sid=${sid}`);
  return res.data?.data || [];
});

/**
 * Fetches the FAQ section data
 */
export const getCachedFaq = cache(async () => {
  const sid = getSID();
  const res = await myAxios.get(`faq?sid=${sid}`);
  return res.data?.data || [];
});
