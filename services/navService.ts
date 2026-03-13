// services/navService.ts
import { getCachedNavHeader } from "./apiCache";
import { MenuItem } from "@/types/cms";

interface NavMenuItem {
  menuTitle: string;
  menuLink: string;
  [key: string]: unknown;
}

export async function getNavData(): Promise<MenuItem[]> {
  try {
    const navData = await getCachedNavHeader();
    const allMenuItems = navData.dataset?.menu || [];

    return allMenuItems.map((item: NavMenuItem) => ({
      label: item.menuTitle,
      link: item.menuLink,
    }));
  } catch (error) {
    console.error("❌ Error fetching navigation data:", error);
    return [];
  }
}
