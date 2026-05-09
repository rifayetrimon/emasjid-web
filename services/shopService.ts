import { DEMO_SHOP_ITEMS, DemoShopItem } from "@/lib/demoContent";

export type ShopItem = DemoShopItem;

/**
 * Fetch shop items. When the backend ships a real /shop endpoint, plug it in here.
 * Until then, returns the curated demo catalog so the UI is fully functional.
 */
export async function getShopItems(): Promise<ShopItem[]> {
  // TODO: replace with real API call once backend exposes /shop
  // const sid = getConfig().sid || "";
  // const res = await myAxios.get(`shop?sid=${sid}`);
  // return res.data?.data || DEMO_SHOP_ITEMS;
  return DEMO_SHOP_ITEMS;
}
