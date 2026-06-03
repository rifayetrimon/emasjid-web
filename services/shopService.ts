import myAxios from "@/lib/myAxios";

// The shop endpoint takes a `branch` query that identifies which tenant
// branch to fetch. SAMSUNG = 1 in the current API. For now this is a
// constant; if other tenants need a different branch, lift it into
// configuration/config.json (e.g. as NEXT_PUBLIC_BRANCH).
const BRANCH = 1;
const ENDPOINT = `api/v2/finance/eboss/staff/group/eshop?branch=${BRANCH}&getItem=1`;

/** ─────────────  Public types used by the UI  ───────────── */

export interface ShopItem {
  id: number;
  /** Item code from the API (e.g. "101", "1000047"). Useful for orders. */
  code: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  /** First non-null image URL from the API; empty string when no image. */
  image: string;
  /** True when the item is active (not deactivated). */
  inStock: boolean;
}

export interface ShopGroup {
  id: number;
  code: string;
  name: string;
  /** Total number of items the API claims for this group (may differ from
   *  `items.length` if the API filters / paginates). Used for the badge. */
  totalItem: number;
  items: ShopItem[];
}

/** ─────────────  Raw API shapes (internal)  ───────────── */

interface RawImages {
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  file1?: string | null;
  file2?: string | null;
  file3?: string | null;
  file4?: string | null;
}

interface RawItem {
  id?: number;
  code?: string;
  name?: string;
  description?: string | null;
  unit?: string | null;
  price?: number;
  deactivated?: number;
  status?: number;
  images?: RawImages | null;
}

interface RawGroup {
  id?: number;
  code?: string;
  name?: string;
  totalItem?: number;
  itemList?: RawItem[];
}

interface RawResponse {
  data?: {
    dataset?: RawGroup[];
  };
}

/** ─────────────  Helpers  ───────────── */

function pickFirstImage(images: RawImages | null | undefined): string {
  if (!images) return "";
  const candidates: (string | null | undefined)[] = [
    images.image1,
    images.image2,
    images.image3,
    images.image4,
    images.file1,
    images.file2,
    images.file3,
    images.file4,
  ];
  return candidates.find((u) => typeof u === "string" && u.trim()) || "";
}

function normalizeItem(raw: RawItem): ShopItem | null {
  if (!raw || typeof raw.id !== "number") return null;
  return {
    id: raw.id,
    code: String(raw.code ?? ""),
    name: String(raw.name ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    price: Number(raw.price) || 0,
    unit: String(raw.unit ?? "").trim(),
    image: pickFirstImage(raw.images),
    // The API uses `deactivated: 1` to mark items that shouldn't be sold.
    inStock: raw.deactivated !== 1,
  };
}

function normalizeGroup(raw: RawGroup): ShopGroup | null {
  if (!raw || typeof raw.id !== "number") return null;
  const items = Array.isArray(raw.itemList)
    ? raw.itemList
        .map(normalizeItem)
        .filter((i): i is ShopItem => i !== null)
    : [];
  return {
    id: raw.id,
    code: String(raw.code ?? ""),
    name: String(raw.name ?? "").trim(),
    totalItem: Number(raw.totalItem) || items.length,
    items,
  };
}

/** ─────────────  Public API  ───────────── */

/**
 * Fetch shop groups (each containing its items) from the finance API.
 * Returns an empty array on failure so the page renders a clean empty
 * state instead of crashing.
 */
export async function getShopGroups(): Promise<ShopGroup[]> {
  try {
    const res = await myAxios.get<RawResponse>(ENDPOINT);
    const dataset = res.data?.data?.dataset || [];
    return dataset
      .map(normalizeGroup)
      .filter((g): g is ShopGroup => g !== null);
  } catch (error) {
    console.error("❌ Error fetching shop groups:", error);
    return [];
  }
}

/**
 * Back-compat: flatten all items across all groups. Some callers may
 * still want a flat list (e.g. search). Kept simple.
 */
export async function getShopItems(): Promise<ShopItem[]> {
  const groups = await getShopGroups();
  return groups.flatMap((g) => g.items);
}
