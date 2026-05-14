// services/footerService.ts
import {
  getCachedFooter,
  getCachedConfig,
  getCachedAddonPlugin,
} from "./apiCache";
import { FooterProps, FooterColumn } from "@/types/cms";
import { getImageUrl } from "./utils";
import { withBasePath } from "@/lib/withBasePath";

// Map API category names to local icon files
const SOCIAL_ICON_MAP: Record<string, string> = {
  facebook: withBasePath("/icons/fb.svg"),
  intagram: withBasePath("/icons/instagram.svg"), // typo in API preserved
  instagram: withBasePath("/icons/instagram.svg"),
  twitter: withBasePath("/icons/x.svg"),
  linkedin: withBasePath("/icons/linkedin.svg"),
  youtube: withBasePath("/icons/youtube.svg"),
  channel: withBasePath("/icons/youtube.svg"),
  tiktok: withBasePath("/icons/tiktok.svg"),
  whatsapp: withBasePath("/icons/whatsapp.svg"),
  sharefb: withBasePath("/icons/fb.svg"),
  sharetwitter: withBasePath("/icons/x.svg"),
  sharewa: withBasePath("/icons/whatsapp.svg"),
};

// Only these categories are social links for the footer
const SOCIAL_CATEGORIES = new Set([
  "facebook",
  "linkedin",
  "youtube",
  "channel",
  "intagram",
  "instagram",
  "twitter",
  "tiktok",
  "whatsapp",
]);

function pickColumn(
  raw: Record<string, unknown> | undefined,
  prefix: "col1" | "col2" | "col3"
): FooterColumn | null {
  if (!raw) return null;
  const nested = raw[prefix] as
    | { title?: string; content?: string }
    | undefined;
  const title =
    (nested?.title as string | undefined) ??
    (raw[`${prefix}Title`] as string | undefined) ??
    "";
  const content =
    (nested?.content as string | undefined) ??
    (raw[`${prefix}Content`] as string | undefined) ??
    "";
  if (!title && !content) return null;
  return { title, content };
}

function isOn(v: unknown): boolean {
  return String(v ?? "").toLowerCase() === "on";
}

export async function getFooterData(): Promise<FooterProps["footer"] | null> {
  try {
    const [footerData, configData, addonData] = await Promise.all([
      getCachedFooter(),
      getCachedConfig(),
      getCachedAddonPlugin(),
    ]);

    const general = configData.generalSettings || {};
    const footerConfig = configData.footerConfig || {};
    const logoUrl = getImageUrl(configData.logoCMS || general.logoCMS);

    const firstFooter: Record<string, unknown> | undefined = Array.isArray(
      footerData
    )
      ? footerData[0]
      : footerData;

    const address = [
      footerConfig.address1,
      footerConfig.address2,
      footerConfig.city,
      footerConfig.state,
      footerConfig.postcode,
    ]
      .filter(Boolean)
      .join(", ");

    // Extract social links from addon-plugin API
    const socialLinks: { platform: string; link: string }[] = [];
    const seenCategories = new Set<string>();

    if (Array.isArray(addonData)) {
      for (const item of addonData) {
        const cate = item?.data?.cate?.toLowerCase();
        const urllink = item?.data?.urllink;

        if (cate && urllink && SOCIAL_CATEGORIES.has(cate) && !seenCategories.has(cate)) {
          seenCategories.add(cate);
          socialLinks.push({
            platform: SOCIAL_ICON_MAP[cate] || withBasePath("/icons/url_icon.svg"),
            link: urllink,
          });
        }
      }
    }

    const columns: FooterColumn[] = [
      pickColumn(firstFooter, "col1"),
      pickColumn(firstFooter, "col2"),
      pickColumn(firstFooter, "col3"),
    ].filter((c): c is FooterColumn => c !== null);

    const footerBackground = getImageUrl(
      (firstFooter?.file as string | undefined) || ""
    );

    return {
      image: {
        image: logoUrl,
        link: "#",
      },
      footer_title: columns[0]?.title || "",
      text: columns[0]?.content || "",
      address: address,
      phone: footerConfig.phonenum || "",
      email: footerConfig.email || "",
      social_links: socialLinks,
      copyright: configData.copyright || footerConfig.copyright || "",
      bgColor: footerConfig.bgColorFooter || "",
      columns,
      backgroundImage: footerBackground || "",
      textColor:
        footerConfig.colorFooterAreaText ||
        footerConfig.textColorHeaderFooter ||
        general.textColorHeaderFooter ||
        "",
      areaColor: footerConfig.colorFooterArea || "",
      showVisitorCounter: isOn(
        footerConfig.countingVisitorFooter ?? configData.countingVisitorFooter
      ),
    };
  } catch (error) {
    console.error("❌ Error fetching footer data:", error);
    return null;
  }
}
