// SERVER-ONLY news fetch for build-time Open Graph tags.
//
// Hits the public read endpoint directly (upstream + x-encrypted-key), the
// same one the client uses — but server-side, using the disk-loaded tenant
// config. Used only by the /news/[id] server page.
//
// IMPORTANT: we fetch the news LIST exactly ONCE per build (module-memoized)
// and derive every article's OG from it. Doing a per-article `idnews` fetch
// for each of N pages caused an N-way concurrent burst at build that the API
// gateway rejected, leaving every page with fallback metadata. The list
// already carries title + mobileDetail + file1/2/3, which is all the card needs.
import { getServerConfig } from "./serverConfig";

interface RawNews {
  contentId?: string | number;
  title?: string;
  mobileDetail?: string;
  message?: string;
  file1?: string | null;
  file2?: string | null;
  file3?: string | null;
}

let listCache: Promise<RawNews[]> | null = null;

async function fetchList(): Promise<RawNews[]> {
  const { apiUrl, sid, key } = getServerConfig();
  if (!apiUrl || !key) return [];
  try {
    const url = `${apiUrl}/api/v2/cms/eboss/cms/news?sid=${sid}&pageNumber=1&perPage=500`;
    const res = await fetch(url, {
      headers: { "x-encrypted-key": key, Accept: "application/json" },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { dataset?: RawNews[] } };
    const ds = json?.data?.dataset;
    return Array.isArray(ds) ? ds : [];
  } catch {
    return [];
  }
}

function getList(): Promise<RawNews[]> {
  if (!listCache) listCache = fetchList();
  return listCache;
}

export async function getAllNewsIdsServer(): Promise<string[]> {
  const ds = await getList();
  return ds
    .map((n) => String(n?.contentId ?? "").trim())
    .filter((id) => id.length > 0);
}

function firstAbsolute(...vals: (string | null | undefined)[]): string | undefined {
  for (const v of vals) {
    if (v && /^https?:\/\//i.test(v)) return v;
  }
  return undefined;
}

export interface NewsOg {
  title: string;
  description: string;
  image?: string;
}

export async function getNewsOgServer(id: string): Promise<NewsOg | null> {
  const ds = await getList();
  const item = ds.find((n) => String(n?.contentId ?? "").trim() === id);
  if (!item) return null;
  const description = String(item.mobileDetail || item.message || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    title: String(item.title || ""),
    description,
    // file1/2/3 are absolute URLs (https://my00.awfatech.com/...) — what
    // Facebook/WhatsApp require for og:image.
    image: firstAbsolute(item.file1, item.file2, item.file3),
  };
}
