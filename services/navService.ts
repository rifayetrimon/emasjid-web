// services/navService.ts
import { getCachedNavHeader, getCachedConfig } from "./apiCache";
import { MenuItem } from "@/types/cms";

interface NavMenuItem {
  menuTitle: string;
  menuLink: string;
  [key: string]: unknown;
}

export interface NavData {
  menuItems: MenuItem[];
  textColor: string;
}

export async function getNavData(): Promise<NavData> {
  try {
    const [navData, configData] = await Promise.all([
      getCachedNavHeader(),
      getCachedConfig(),
    ]);

    const menuItems = navData
      ? navData.map((item: NavMenuItem) => ({
          label: item.title,
          link: item.url,
        }))
      : [];

    return {
      menuItems,
      textColor: configData.textColorNavHeaderLine || "",
    };
  } catch (error) {
    console.error("❌ Error fetching navigation data:", error);
    return { menuItems: [], textColor: "" };
  }
}
