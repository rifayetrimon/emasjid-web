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

    if (!navData) return [];

    return navData.map((item: NavMenuItem) => ({
      label: item.title,
      link: item.url,
    }));
  } catch (error) {
    console.error("❌ Error fetching navigation data:", error);
    return [];
  }
}
