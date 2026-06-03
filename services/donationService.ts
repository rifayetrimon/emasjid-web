import myAxios from "@/lib/myAxios";

// Same branch model as the e-shop: BRANCH = 1 today. If multi-branch is
// ever needed, lift to configuration/config.json.
const BRANCH = 1;
const ENDPOINT = `api/v2/finance/eboss/staff/group/donation?branch=${BRANCH}&getItem=1`;

/** ─────────────  Public types  ───────────── */

export interface DonationItem {
  id: number;
  code: string;
  name: string;
  description: string;
  /** Suggested amount from the API. May be 0 — in that case the donor
   *  enters a custom amount via the picker. */
  price: number;
  unit: string;
  image: string;
  /** True when the item is active (deactivated !== 1). */
  active: boolean;
}

export interface DonationGroup {
  id: number;
  code: string;
  name: string;
  totalItem: number;
  items: DonationItem[];
}

/** ─────────────  Raw API shapes  ───────────── */

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

function normalizeItem(raw: RawItem): DonationItem | null {
  if (!raw || typeof raw.id !== "number") return null;
  return {
    id: raw.id,
    code: String(raw.code ?? ""),
    name: String(raw.name ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    price: Number(raw.price) || 0,
    unit: String(raw.unit ?? "").trim(),
    image: pickFirstImage(raw.images),
    active: raw.deactivated !== 1,
  };
}

function normalizeGroup(raw: RawGroup): DonationGroup | null {
  if (!raw || typeof raw.id !== "number") return null;
  const items = Array.isArray(raw.itemList)
    ? raw.itemList
        .map(normalizeItem)
        .filter((i): i is DonationItem => i !== null)
    : [];
  // Strip trailing backslash and extra whitespace from CMS-entered names
  // (e.g. "TABUNG HARIAN\\MINGGUAN", "SUMBANGAN ").
  const name = String(raw.name ?? "")
    .replace(/\\+/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    id: raw.id,
    code: String(raw.code ?? ""),
    name,
    totalItem: Number(raw.totalItem) || items.length,
    items,
  };
}

/** ─────────────  Public API  ───────────── */

export async function getDonationGroups(): Promise<DonationGroup[]> {
  try {
    const res = await myAxios.get<RawResponse>(ENDPOINT);
    const dataset = res.data?.data?.dataset || [];
    return dataset
      .map(normalizeGroup)
      .filter((g): g is DonationGroup => g !== null);
  } catch (error) {
    console.error("❌ Error fetching donation groups:", error);
    return [];
  }
}
