// services/navService.ts
import { getCachedNavHeader, getCachedConfig, getCachedAddonPlugin } from "./apiCache";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { getImageUrl } from "./utils";
import { isPluginFlagOn } from "@/lib/getShopPlugin";
import { withBasePath } from "@/lib/withBasePath";
import { withPreviewParams } from "@/lib/previewContext";

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
  // Active "share this page" buttons (ShareFB / ShareWA / ShareTwitter),
  // as ShareButtons registry keys (e.g. ["facebook", "whatsapp"]). These are
  // SEPARATE from the profile socialLinks above and are only used on the news
  // detail page — never the navbar/footer.
  sharePlatforms: string[];
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

// "Share this page" plugin categories → ShareButtons registry key. Kept
// separate from the profile categories above so they toggle independently
// (e.g. turning the Facebook profile off must NOT remove the ShareFB button).
const SHARE_CATEGORY_MAP: Record<string, string> = {
  sharefb: "facebook",
  sharewa: "whatsapp",
  sharetwitter: "twitter",
};

// In the static export there are no on-demand routes, so CMS content links
// are funnelled through two query-param pages: /static/?slug=<id> and
// /news/detail/?id=<id>. This rewrites any verbatim `/static/<id>` or
// `/news/<id>` URL the CMS ships into that form. Home, dropdown (#), external
// URLs, and already-query links are passed through untouched.
function normalizeContentLink(link: string): string {
  if (!link || link === "/" || link === "#") return link;
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) return link; // http:, mailto:, etc.
  if (link.includes("?")) return link;
  const news = link.match(/^\/news\/([^/]+)\/?$/);
  if (news && news[1] !== "detail") return `/news/detail/?id=${news[1]}`;
  const stat = link.match(/^\/static\/([^/]+)\/?$/);
  if (stat) return `/static/?slug=${stat[1]}`;
  return link;
}

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
      // Use the raw `url` the CMS ships verbatim — it carries the canonical
      // destination, including the real content id (e.g.
      // `/static/<hexId>` or `/news/<id>`). `normalizeContentLink` (applied
      // below) rewrites those into the static-export query-param routes.
      // NOTE: do NOT synthesize from config.article — that field can hold a
      // stale legacy numeric id that no longer matches the content store.
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
        link: withPreviewParams(withBasePath(normalizeContentLink(link))),
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
      menuItems.push({
        label: "E-shop",
        link: withPreviewParams(withBasePath("/shop")),
      });
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

    // Extract social profile links AND share buttons from addon-plugin.
    // Profile links need a urllink (they point to the brand's account); share
    // buttons do NOT (they share the current page, so urllink is irrelevant).
    const socialLinks: NavSocialLink[] = [];
    const sharePlatforms: string[] = [];
    const seenCategories = new Set<string>();
    const seenShare = new Set<string>();

    if (Array.isArray(addonData)) {
      for (const item of addonData) {
        const cate = item?.data?.cate?.toLowerCase();
        const urllink = item?.data?.urllink;
        if (!cate) continue;

        if (urllink && SOCIAL_CATEGORIES.has(cate) && !seenCategories.has(cate)) {
          seenCategories.add(cate);
          const mapped = SOCIAL_ICON_MAP[cate];
          socialLinks.push({
            platform: mapped.label,
            icon: mapped.icon,
            link: urllink,
          });
        }

        if (SHARE_CATEGORY_MAP[cate] && !seenShare.has(cate)) {
          seenShare.add(cate);
          sharePlatforms.push(SHARE_CATEGORY_MAP[cate]);
        }
      }
    }

    return {
      menuItems,
      logo,
      navConfig,
      socialLinks,
      sharePlatforms,
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
      sharePlatforms: [],
    };
  }
}
