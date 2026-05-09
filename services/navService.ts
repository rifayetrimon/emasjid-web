// services/navService.ts
import { getCachedNavHeader, getCachedConfig, getCachedAddonPlugin } from "./apiCache";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { getImageUrl } from "./utils";
import { isPluginFlagOn } from "@/lib/getShopPlugin";

interface NavMenuItem {
  title: string;
  url: string;
  config?: {
    index?: number;
    [key: string]: any;
  };
  submenu?: NavMenuItem[];
  [key: string]: any;
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

    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    };

    // Labels that always point to the home/landing page regardless of CMS URL
    const HOME_LABELS = new Set([
      "home",
      "utama",
      "laman utama",
      "main",
      "halaman utama",
      "muka depan",
    ]);

    const isHomeLabel = (title: string) =>
      HOME_LABELS.has(title.toLowerCase().trim());

    const mapMenuItem = (item: NavMenuItem, parentSlug: string = ""): MenuItem => {
      let link = item.url;

      if (!link || link.trim() === "") {
        const slug = generateSlug(item.title);
        link = parentSlug ? `${parentSlug}/${slug}` : `/${slug}`;
      }

      // Top-level "Home" / "Utama" menu items always go to /
      if (!parentSlug && isHomeLabel(item.title)) {
        link = "/";
      }

      const submenu =
        item.submenu && item.submenu.length > 0
          ? item.submenu
              .sort((a: NavMenuItem, b: NavMenuItem) => (a.config?.index || 0) - (b.config?.index || 0))
              .map((sub: NavMenuItem) => mapMenuItem(sub, link))
          : undefined;

      return {
        label: item.title,
        link,
        submenu,
      };
    };

    const menuItems: MenuItem[] = navData
      ? navData
          .sort((a: NavMenuItem, b: NavMenuItem) => (a.config?.index || 0) - (b.config?.index || 0))
          .map((item: NavMenuItem) => mapMenuItem(item, ""))
      : [];

    // Append "E-shop" if the Shop plugin is enabled in CMS
    const shopFlag = configData?.generalSettings?.shopPlugin;
    const shopOn = isPluginFlagOn(shopFlag);
    console.log(
      `🛒 [navService] shopPlugin=${JSON.stringify(shopFlag)} (type: ${typeof shopFlag}) → enabled=${shopOn}`
    );
    if (shopOn) {
      menuItems.push({ label: "E-shop", link: "/shop" });
    }

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
