// services/pluginService.ts
import { getCachedPlugin, getCachedPluginCategory } from "./apiCache";
import type { PluginItem, PluginCategory } from "@/types/cms";

interface RawPlugin {
  pluginId?: number | string;
  date?: string;
  time?: string;
  status?: number | string;
  title?: string;
  message?: string;
  urlLink?: string;
  cate?: string;
}

interface RawPluginCategory {
  id?: number | string;
  categoryId?: number | string;
  name?: string;
  title?: string;
  cate?: string;
}

function readDataset<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  const ds = (raw as { dataset?: T[] })?.dataset;
  return Array.isArray(ds) ? ds : [];
}

function normalize(raw: RawPlugin): PluginItem {
  return {
    pluginId: String(raw.pluginId ?? "").trim(),
    date: raw.date || "",
    time: raw.time || "",
    status: Number(raw.status ?? 0),
    title: raw.title || "",
    message: raw.message || "",
    urlLink: raw.urlLink || "",
    cate: raw.cate || "",
  };
}

function normalizeCategory(raw: RawPluginCategory): PluginCategory | null {
  const name = raw.name || raw.title || raw.cate || "";
  if (!name) return null;
  return { id: raw.id ?? raw.categoryId ?? name, name };
}

export async function getPluginItems(): Promise<PluginItem[]> {
  try {
    const raw = await getCachedPlugin();
    return readDataset<RawPlugin>(raw)
      .map(normalize)
      .filter((p) => p.status === 1);
  } catch (error) {
    console.error("❌ Error fetching plugins:", error);
    return [];
  }
}

export async function getPluginCategories(): Promise<PluginCategory[]> {
  try {
    const raw = await getCachedPluginCategory();
    return readDataset<RawPluginCategory>(raw)
      .map(normalizeCategory)
      .filter((c): c is PluginCategory => c !== null);
  } catch (error) {
    console.error("❌ Error fetching plugin categories:", error);
    return [];
  }
}

export async function getPluginsByCate(
  cate: string
): Promise<PluginItem[]> {
  const all = await getPluginItems();
  const needle = cate.trim().toLowerCase();
  if (!needle) return all;
  return all.filter((p) => p.cate.toLowerCase() === needle);
}
