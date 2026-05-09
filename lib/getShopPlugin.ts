import { getCachedConfig } from "@/services/apiCache";

/**
 * Shared truthiness check for plugin flags coming from the CMS.
 * Treats 1, "1", true, "true", "on", "yes" as enabled.
 * Treats 0, "0", false, "false", "off", "no", "", null, undefined as disabled.
 */
export function isPluginFlagOn(flag: unknown): boolean {
  if (flag === undefined || flag === null) return false;
  if (typeof flag === "boolean") return flag;
  if (typeof flag === "number") return flag !== 0;
  const v = String(flag).trim().toLowerCase();
  if (v === "" || v === "0" || v === "false" || v === "off" || v === "no") {
    return false;
  }
  return true;
}

export async function isShopPluginEnabled(): Promise<boolean> {
  try {
    const config = await getCachedConfig();
    return isPluginFlagOn(config?.generalSettings?.shopPlugin);
  } catch {
    return false;
  }
}
