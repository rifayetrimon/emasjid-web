import { ReactNode } from "react";
import { getNavData } from "@/services/navService";
import { getFooterData } from "@/services/footerService";
import { getCachedConfig, getCachedNews } from "@/services/apiCache";
import { getNewsData } from "@/services/newsService";
import { getVisitorStats, EMPTY_VISITOR_STATS } from "@/services/visitorService";
import { getSiteTheme } from "@/services/themeService";

import Demo7Nav from "@/components/demos/demo7/Nav";
import Demo7Footer from "@/components/demos/demo7/Footer";
import Demo4Nav from "@/components/demos/demo4/Nav";
import Demo4Footer from "@/components/demos/demo4/Footer";
import Demo8Nav from "@/components/demos/demo8/Nav";
import Demo8Footer from "@/components/demos/demo8/Footer";
import Demo2Nav from "@/components/demos/demo2/Nav";
import Demo2Footer from "@/components/demos/demo2/Footer";
import Demo5Nav from "@/components/demos/demo5/Nav";
import Demo5Footer from "@/components/demos/demo5/Footer";
import Blog2Nav from "@/components/demos/blog2/Nav";
import Blog2Footer from "@/components/demos/blog2/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ThemedShell from "@/components/ThemedShell";
import type { HighlightNewsItem } from "@/services/newsService";

export type TemplateId = "1" | "2" | "3" | "4" | "5" | "6";

interface Props {
  templateId: TemplateId;
  children: ReactNode;
  /** Pad the main content for the fixed nav (Templates 3 only — fixed positioning). */
  padForFixedNav?: boolean;
}

const TEMPLATE_DEFAULTS: Record<
  TemplateId,
  { primary: string; secondary: string; text: string; bg: string }
> = {
  "1": {
    primary: "#f43f5e",
    secondary: "#fb7185",
    text: "#1a1a1a",
    bg: "bg-gradient-to-b from-rose-50/40 via-white to-amber-50/30",
  },
  "2": {
    primary: "#78C841",
    secondary: "#154D71",
    text: "#1a1a1a",
    bg: "bg-gray-50",
  },
  "3": {
    primary: "#fbbf24",
    secondary: "#f59e0b",
    text: "#ffffff",
    bg: "bg-black text-white",
  },
  "4": {
    primary: "#78C841",
    secondary: "#154D71",
    text: "#1a1a1a",
    bg: "bg-white",
  },
  "5": {
    primary: "#a47133",
    secondary: "#0c3d3c",
    text: "#0c3d3c",
    bg: "bg-[#fdfaf3]",
  },
  "6": {
    primary: "#fbbe21",
    secondary: "#1f2937",
    text: "#111827",
    bg: "bg-white",
  },
};

export default async function TemplateLayout({
  templateId,
  children,
  padForFixedNav = false,
}: Props) {
  const [nav, footer, config, theme, visitorsRaw, highlighted, newsRaw] = await Promise.all([
    getNavData(),
    getFooterData(),
    getCachedConfig(),
    getSiteTheme(),
    getVisitorStats(),
    // News data — only used by Template 6 (Blog) nav (trending bar) and footer columns.
    // React cache() dedupes with page-level fetches, so no double-fetch.
    templateId === "6" ? getNewsData() : Promise.resolve([] as HighlightNewsItem[]),
    templateId === "6" ? getCachedNews() : Promise.resolve(null),
  ]);

  // Suppress visitor stats when admin disabled the counter.
  const visitors = footer?.showVisitorCounter ?? theme.showVisitorCounter
    ? visitorsRaw
    : EMPTY_VISITOR_STATS;

  // Build Popular/Trending lists for the Blog template footer
  const allNews = newsRaw?.dataset || (Array.isArray(newsRaw) ? newsRaw : []);
  const popularPosts = (highlighted.length > 0 ? highlighted : allNews)
    .slice(0, 2)
    .map((n: { contentId: number; title: string; date: string; image?: string | null; file1?: string | null; altImg1: string }) => ({
      contentId: n.contentId,
      title: n.title,
      date: n.date,
      file1: n.image ?? n.file1 ?? null,
      altImg1: n.altImg1,
    }));
  const trendingPosts = allNews
    .slice(0, 2)
    .map((n: { contentId: number; title: string; date: string; file1: string | null; altImg1: string }) => ({
      contentId: n.contentId,
      title: n.title,
      date: n.date,
      file1: n.file1,
      altImg1: n.altImg1,
    }));
  const trendingTitle = highlighted[0]?.title || allNews[0]?.title;

  const general = config.generalSettings || {};
  const footerCfg = config.footerConfig || {};
  const defaults = TEMPLATE_DEFAULTS[templateId];

  // CSS variable theme — read from SiteTheme so all admin color fields are
  // available to components via var(...).
  const cssVars = {
    "--primary": theme.primaryColor || general.primaryColor || defaults.primary,
    "--secondary": theme.secondaryColor || general.secondaryColor || defaults.secondary,
    "--text": theme.textColor || general.textColor || defaults.text,
    "--bg-header": theme.bgColorHeader || "",
    "--text-header-footer": theme.textColorHeaderFooter || "",
    "--nav-line": theme.colorNavHeaderLine || "",
    "--nav-line-text": theme.textColorNavHeaderLine || "",
    "--bg-news": theme.backgroundColorNews || "",
    "--bg-trending": theme.backgroundColorTrending || "",
    "--bg-footer": theme.bgColorFooter || "",
    "--footer-area": theme.colorFooterArea || "",
    "--footer-area-text": theme.colorFooterAreaText || "",
  } as React.CSSProperties;

  let navElement: ReactNode = null;
  let footerElement: ReactNode = null;
  let usesFixedNav = false;

  // Marketplace template already IS the shop — don't show "E-shop" in its nav
  const menuItems =
    templateId === "3"
      ? nav.menuItems.filter((m) => m.link !== "/shop")
      : nav.menuItems;

  switch (templateId) {
    case "1":
      navElement = (
        <Demo7Nav
          menuItems={menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
          navConfig={nav.navConfig}
        />
      );
      footerElement = footer && <Demo7Footer footer={footer} visitors={visitors} />;
      break;
    case "2":
      navElement = (
        <Demo4Nav
          menuItems={menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
          navConfig={nav.navConfig}
        />
      );
      footerElement = footer && <Demo4Footer footer={footer} visitors={visitors} />;
      break;
    case "3":
      navElement = (
        <Demo8Nav
          menuItems={menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
          navConfig={nav.navConfig}
        />
      );
      footerElement = footer && <Demo8Footer footer={footer} visitors={visitors} />;
      usesFixedNav = true;
      break;
    case "4":
      navElement = (
        <Demo2Nav
          menuItems={menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
          email={footerCfg.email || ""}
          phone={footerCfg.phonenum || ""}
          navConfig={nav.navConfig}
        />
      );
      footerElement = footer && <Demo2Footer footer={footer} visitors={visitors} />;
      break;
    case "5":
      navElement = (
        <Demo5Nav
          menuItems={menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
          navConfig={nav.navConfig}
        />
      );
      footerElement = footer && <Demo5Footer footer={footer} visitors={visitors} />;
      break;
    case "6": {
      navElement = (
        <Blog2Nav
          menuItems={menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
          trendingTitle={trendingTitle}
          navConfig={nav.navConfig}
        />
      );
      footerElement = footer && (
        <Blog2Footer
          footer={footer}
          visitors={visitors}
          popular={popularPosts}
          trending={trendingPosts}
        />
      );
      break;
    }
  }

  return (
    <ThemedShell cssVars={cssVars} bgClass={defaults.bg}>
      {navElement}
      <main
        className={`flex-1 ${padForFixedNav && usesFixedNav ? "pt-20" : ""}`}
      >
        {children}
      </main>
      {footerElement}
      <ScrollToTop />
    </ThemedShell>
  );
}
