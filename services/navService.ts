// services/navService.ts
import { getCachedNavHeader, getCachedConfig, getCachedAddonPlugin } from "./apiCache";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { getImageUrl } from "./utils";
import { isPluginFlagOn } from "@/lib/getShopPlugin";
import { withBasePath } from "@/lib/withBasePath";

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
  facebook: { icon: withBasePath("/icons/fb.svg"), label: "Facebook" },
  intagram: { icon: withBasePath("/icons/instagram.svg"), label: "Instagram" },
  instagram: { icon: withBasePath("/icons/instagram.svg"), label: "Instagram" },
  twitter: { icon: withBasePath("/icons/x.svg"), label: "Twitter" },
  linkedin: { icon: withBasePath("/icons/linkedin.svg"), label: "LinkedIn" },
  youtube: { icon: withBasePath("/icons/youtube.svg"), label: "YouTube" },
  channel: { icon: withBasePath("/icons/youtube.svg"), label: "Channel" },
  tiktok: { icon: withBasePath("/icons/tiktok.svg"), label: "TikTok" },
  whatsapp: { icon: withBasePath("/icons/whatsapp.svg"), label: "WhatsApp" },
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

    const mapMenuItem = (item: NavMenuItem, depth: number = 0): MenuItem => {
      // Use the raw `url` from the API verbatim. CMS already ships the
      // canonical destination (e.g. `/static/<contentId>`, full external
      // URLs, or legacy PHP links) and the client has no business
      // rewriting them — that just causes drift between what admin
      // configured and what users land on.
      let link = (item.url || "").trim();

      // Top-level "Home" / "Utama" menu items always go to /
      if (depth === 0 && isHomeLabel(item.title)) {
        link = "/";
      }

      const submenu =
        item.submenu && item.submenu.length > 0
          ? item.submenu
              .slice()
              .sort(
                (a: NavMenuItem, b: NavMenuItem) =>
                  (a.config?.index || 0) - (b.config?.index || 0),
              )
              .map((sub: NavMenuItem) => mapMenuItem(sub, depth + 1))
          : undefined;

      // Parent menus (with a submenu) act purely as a dropdown trigger —
      // clicking the parent should reveal children, not navigate to a page.
      // The Home label is excluded because admins expect it to always go to /.
      const hasChildren = !!submenu && submenu.length > 0;
      const isHome = depth === 0 && isHomeLabel(item.title);
      if (hasChildren && !isHome) {
        link = "#";
      }

      // No URL and no children → still nothing navigable, fall back to "#".
      if (!link) link = "#";

      const targetWindow =
        typeof item.config?.targetwindow === "string"
          ? item.config.targetwindow
          : undefined;

      return {
        label: item.title,
        link: withBasePath(link),
        targetWindow,
        submenu,
      };
    };

    // Sort by config.index ascending. Use the original API position as
    // an explicit tiebreaker so two items sharing the same index can never
    // swap unpredictably (which would silently drop or re-order items like
    // a freshly-added "new" entry that happens to share an index value).
    const menuItems: MenuItem[] = navData
      ? (navData as NavMenuItem[])
          .map((item, pos) => ({ item, pos }))
          .sort((a, b) => {
            const ai = a.item.config?.index || 0;
            const bi = b.item.config?.index || 0;
            if (ai !== bi) return ai - bi;
            return a.pos - b.pos;
          })
          .map(({ item }) => mapMenuItem(item, 0))
      : [];

    // Visibility into nav contents — keeps surprises like "added in CMS
    // but missing from the rendered navbar" diagnosable from server logs.
    console.log(
      `🧭 [navService] resolved ${menuItems.length} menu item(s):`,
      menuItems.map((m) => m.label).join(", "),
    );

    // Append "E-shop" if the Shop plugin is enabled in CMS
    const shopFlag = configData?.generalSettings?.shopPlugin;
    const shopOn = isPluginFlagOn(shopFlag);
    console.log(
      `🛒 [navService] shopPlugin=${JSON.stringify(shopFlag)} (type: ${typeof shopFlag}) → enabled=${shopOn}`
    );
    if (shopOn) {
      menuItems.push({ label: "E-shop", link: withBasePath("/shop") });
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

/**
 * Walk the CMS nav tree and produce a map from slug-based path → static
 * content ID. Used by the catch-all [...slug] route so a menu URL like
 * `/profil/sejarah-penubuhan` resolves to the CMS static page bound on
 * that menu item.
 *
 * Only static-page bindings are tracked. News bindings keep using their
 * own `/news/<id>` route and don't need this map.
 */
export async function getStaticPathBindings(): Promise<Record<string, string>> {
  try {
    const navData = await getCachedNavHeader();
    if (!Array.isArray(navData)) return {};

    const generateSlug = (title: string) =>
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const map: Record<string, string> = {};

    // Walk must mirror the path that `mapMenuItem` produces: admin-supplied
    // `item.url` wins over slug, and child paths are built off the parent's
    // RESOLVED link. Otherwise the binding key won't match the rendered href.
    const walk = (item: NavMenuItem, parentSlug: string = "") => {
      const cfg = item.config || {};
      const optionmenu = String(cfg.optionmenu || "").toLowerCase();
      const article = String(
        cfg.article ??
          cfg.staticPage ??
          cfg.staticContent ??
          cfg.staticContentId ??
          ""
      ).trim();
      const isNewsBinding = /(news|article|listnews)/.test(optionmenu);

      const isStaticBinding = !!article && !isNewsBinding;

      let link: string;
      if (article && isNewsBinding) {
        link = `/news/${article}`;
      } else {
        // Match resolveLink: static-bound menus ignore admin's url and use
        // the slug-based path so the binding key matches the rendered href.
        const adminUrl = isStaticBinding ? "" : String(item.url || "").trim();
        if (adminUrl) {
          link = adminUrl;
        } else {
          const slug = generateSlug(item.title || "");
          link = parentSlug ? `${parentSlug}/${slug}` : `/${slug}`;
        }
      }

      if (isStaticBinding) {
        map[link] = article;
      }

      if (Array.isArray(item.submenu)) {
        item.submenu.forEach((sub) => walk(sub, link));
      }
    };

    navData.forEach((item: NavMenuItem) => walk(item));
    return map;
  } catch (error) {
    console.error("❌ Error building static path bindings:", error);
    return {};
  }
}
