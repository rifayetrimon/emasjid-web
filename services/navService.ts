// services/navService.ts
import { getCachedNavHeader, getCachedConfig, getCachedAddonPlugin } from "./apiCache";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { getImageUrl } from "./utils";

interface NavMenuItem {
  title: string;
  url: string;
  submenu?: NavMenuItem[];
  [key: string]: unknown;
}

export interface NavData {
  menuItems: MenuItem[];
  logo: string;
  navConfig: NavConfig;
  socialLinks: NavSocialLink[];
}

// Map API category names to local icon files
const SOCIAL_ICON_MAP: Record<string, { icon: string; label: string }> = {
  facebook: { icon: "/icons/fb.svg", label: "Facebook" },
  intagram: { icon: "/icons/instagram.svg", label: "Instagram" },
  instagram: { icon: "/icons/instagram.svg", label: "Instagram" },
  twitter: { icon: "/icons/x.svg", label: "Twitter" },
  linkedin: { icon: "/icons/linkedin.svg", label: "LinkedIn" },
  youtube: { icon: "/icons/youtube.svg", label: "YouTube" },
  channel: { icon: "/icons/youtube.svg", label: "Channel" },
  tiktok: { icon: "/icons/tiktok.svg", label: "TikTok" },
  whatsapp: { icon: "/icons/whatsapp.svg", label: "WhatsApp" },
};

const SOCIAL_CATEGORIES = new Set(Object.keys(SOCIAL_ICON_MAP));

export async function getNavData(): Promise<NavData> {
  try {
    const [navData, configData, addonData] = await Promise.all([
      getCachedNavHeader(),
      getCachedConfig(),
      getCachedAddonPlugin(),
    ]);

    const general = configData.generalSettings || {};
    const navCfg = configData.navConfig || {};

    const mapMenuItem = (item: NavMenuItem): MenuItem => ({
      label: item.title,
      link: item.url,
      submenu:
        item.submenu && item.submenu.length > 0
          ? item.submenu.map(mapMenuItem)
          : undefined,
    });

    const menuItems = navData ? navData.map(mapMenuItem) : [];

    const logo = getImageUrl(configData.logoCMS || general.logoCMS);

    const navConfig: NavConfig = {
      navbarBg: navCfg.navbarBg || "",
      navbarItemfontSize: navCfg.navbarItemfontSize || "",
      navbarItemColor: navCfg.navbarItemColor || "",
      navbarItemHoverColor: navCfg.navbarItemHoverColor || "",
      navbarItemUnderLine: navCfg.navbarItmeUnderLine === "True",
      navbarItemUnderLineColor: navCfg.navbarItemUnderLineColor || "",
      navbarOpacity: typeof navCfg.navbarOpacity === "number" ? navCfg.navbarOpacity : 100,
      navbarDropdownBg: navCfg.navbarDropdownBg || "",
    };

    // Extract social links from addon-plugin
    const socialLinks: NavSocialLink[] = [];
    const seenCategories = new Set<string>();

    if (Array.isArray(addonData)) {
      for (const item of addonData) {
        const cate = item?.data?.cate?.toLowerCase();
        const urllink = item?.data?.urllink;

        if (cate && urllink && SOCIAL_CATEGORIES.has(cate) && !seenCategories.has(cate)) {
          seenCategories.add(cate);
          const mapped = SOCIAL_ICON_MAP[cate];
          socialLinks.push({
            platform: mapped.label,
            icon: mapped.icon,
            link: urllink,
          });
        }
      }
    }

    return {
      menuItems,
      logo,
      navConfig,
      socialLinks,
    };
  } catch (error) {
    console.error("❌ Error fetching navigation data:", error);
    return {
      menuItems: [],
      logo: "",
      navConfig: {
        navbarBg: "",
        navbarItemfontSize: "",
        navbarItemColor: "",
        navbarItemHoverColor: "",
        navbarItemUnderLine: false,
        navbarItemUnderLineColor: "",
        navbarOpacity: 100,
        navbarDropdownBg: "",
      },
      socialLinks: [],
    };
  }
}
