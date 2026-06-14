// services/bannerService.ts
import {
  getCachedBanner,
  getCachedConfig,
  getCachedSideBanner,
  getCachedPromotagBanner,
} from "./apiCache";
import {
  BannerProps,
  BannerRecord,
  BannerSlide,
  PromotagDetails,
} from "@/types/cms";
import { getImageUrl } from "./utils";
import { DEMO_BANNER, DEMO_BANNER_IMAGE } from "@/lib/demoContent";

interface RawBannerFile {
  file?: string;
  url?: string | null;
}

interface RawBannerDetails {
  fontsize?: string;
  colopix?: string;
  colofont?: string;
  tagposition?: string;
  imagemode?: string;
}

interface RawBannerRecord {
  bannerId?: number | string;
  sta?: number | string;
  files?: RawBannerFile[];
  urllink1?: string;
  urllink2?: string;
  urllink3?: string;
  url?: string;
  // Promotag-only fields.
  message?: string;
  details?: RawBannerDetails;
}

// Build the promo block for a promotag banner. Returns undefined for
// header/sider banners (no message/details), so `promo` only appears where it
// applies. `imagemode` is normalized to our two-value union.
function buildPromo(record: RawBannerRecord): PromotagDetails | undefined {
  const d = record.details;
  const message = (record.message || "").trim();
  if (!d && !message) return undefined;
  const mode = String(d?.imagemode || "").trim().toLowerCase();
  return {
    message,
    imageMode: mode === "asbackground" ? "background" : "banner",
    pillColor: (d?.colopix || "").trim(),
    fontColor: (d?.colofont || "").trim(),
    fontSize: (d?.fontsize || "").trim(),
    tagPosition: (d?.tagposition || "").trim(),
  };
}

function isLive(record: RawBannerRecord): boolean {
  return Number(record?.sta) === 1 || String(record?.sta) === "1";
}

function buildSlides(record: RawBannerRecord): BannerSlide[] {
  const files = Array.isArray(record.files) ? record.files : [];
  const fallbackUrls = [record.urllink1, record.urllink2, record.urllink3];
  return files
    .map((f, i) => {
      const src = (f?.file || "").trim();
      if (!src) return null;
      const url = (f?.url || fallbackUrls[i] || record.url || "").trim();
      return { src, url };
    })
    .filter((s): s is BannerSlide => s !== null);
}

function normalizeRecord(record: RawBannerRecord): BannerRecord {
  return {
    bannerId: String(record.bannerId ?? "").trim(),
    sta: Number(record.sta ?? 0) || (String(record.sta) === "1" ? 1 : 0),
    slides: buildSlides(record),
    promo: buildPromo(record),
  };
}

function readDataset(raw: unknown): RawBannerRecord[] {
  if (Array.isArray(raw)) return raw as RawBannerRecord[];
  const dataset = (raw as { dataset?: RawBannerRecord[] })?.dataset;
  return Array.isArray(dataset) ? dataset : [];
}

/**
 * Returns every LIVE banner record for the given API source.
 * `sta === 1` filter is enforced here.
 */
function liveBanners(raw: unknown): BannerRecord[] {
  return readDataset(raw)
    .filter(isLive)
    .map(normalizeRecord)
    .filter((r) => r.slides.length > 0);
}

export async function getHeaderBanners(): Promise<BannerRecord[]> {
  try {
    return liveBanners(await getCachedBanner());
  } catch (error) {
    console.error("❌ Error fetching header banners:", error);
    return [];
  }
}

export async function getSideBanners(): Promise<BannerRecord[]> {
  try {
    return liveBanners(await getCachedSideBanner());
  } catch (error) {
    console.error("❌ Error fetching side banners:", error);
    return [];
  }
}

export async function getPromotagBanners(): Promise<BannerRecord[]> {
  try {
    return liveBanners(await getCachedPromotagBanner());
  } catch (error) {
    console.error("❌ Error fetching promotag banners:", error);
    return [];
  }
}

export async function getBannerData(): Promise<BannerProps["banner"] | null> {
  try {
    const [bannerData, configData] = await Promise.all([
      getCachedBanner(),
      getCachedConfig(),
    ]);

    const live = liveBanners(bannerData);
    const firstLive = live[0];

    // Collect images from the first LIVE banner (respecting sta filter)
    const allImages: string[] = (firstLive?.slides || []).map((s) => s.src);

    const finalImages = allImages.length > 0 ? allImages : [DEMO_BANNER_IMAGE];
    const bannerBgImage = getImageUrl(finalImages[0]);
    const bannerFocusLink = firstLive?.slides[0]?.url || "";

    const general = configData.generalSettings || {};
    const bannerConfig = configData.bannerConfig || {};
    const logoUrl = getImageUrl(configData.logoCMS || general.logoCMS);

    // If the tenant has filled ANY banner field, treat their config as
    // authoritative — unset fields stay empty rather than getting padded
    // with demo copy. Only a completely empty bannerConfig falls back to
    // the demo banner (used on fresh installs to keep the template visually
    // intact).
    const userProvidedBanner = !!(
      bannerConfig.banneTitle ||
      bannerConfig.bannerFocusText ||
      bannerConfig.bannerSubText
    );

    return {
      logo: logoUrl,
      background_image: bannerBgImage,
      background_images: finalImages,
      menu_items: [],
      title: userProvidedBanner
        ? {
            general: bannerConfig.banneTitle || "",
            focus: {
              text: bannerConfig.bannerFocusText || "",
              link: bannerFocusLink,
            },
          }
        : {
            general: DEMO_BANNER.title.general,
            focus: {
              text: DEMO_BANNER.title.focus.text,
              link: bannerFocusLink,
            },
          },
      supporting_text: userProvidedBanner
        ? bannerConfig.bannerSubText || ""
        : DEMO_BANNER.supporting_text,
      buttons: [],
      textColor: general.textColor || "",
      overlayColor: bannerConfig.bannerOverlayColor || "",
      overlayOpacity:
        typeof bannerConfig.bannerOverlay === "number"
          ? bannerConfig.bannerOverlay
          : 0,
    };
  } catch (error) {
    console.error("❌ Error fetching banner data:", error);
    return {
      logo: "",
      background_image: DEMO_BANNER_IMAGE,
      background_images: [DEMO_BANNER_IMAGE],
      menu_items: [],
      title: DEMO_BANNER.title,
      supporting_text: DEMO_BANNER.supporting_text,
      buttons: [],
      textColor: "",
      overlayColor: "",
      overlayOpacity: 0,
    };
  }
}
