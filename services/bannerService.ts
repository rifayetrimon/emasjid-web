// services/bannerService.ts
import {
  getCachedBanner,
  getCachedConfig,
  getCachedSideBanner,
  getCachedPromotagBanner,
} from "./apiCache";
import { BannerProps, BannerRecord, BannerSlide } from "@/types/cms";
import { getImageUrl } from "./utils";
import { DEMO_BANNER, DEMO_BANNER_IMAGE } from "@/lib/demoContent";

interface RawBannerFile {
  file?: string;
  url?: string | null;
}

interface RawBannerRecord {
  bannerId?: number;
  sta?: number | string;
  files?: RawBannerFile[];
  urllink1?: string;
  urllink2?: string;
  urllink3?: string;
  url?: string;
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
    bannerId: Number(record.bannerId ?? 0),
    sta: Number(record.sta ?? 0) || (String(record.sta) === "1" ? 1 : 0),
    slides: buildSlides(record),
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

    return {
      logo: logoUrl,
      background_image: bannerBgImage,
      background_images: finalImages,
      menu_items: [],
      title: {
        general: bannerConfig.banneTitle || DEMO_BANNER.title.general,
        focus: {
          text: bannerConfig.bannerFocusText || DEMO_BANNER.title.focus.text,
          link: bannerFocusLink,
        },
      },
      supporting_text: bannerConfig.bannerSubText || DEMO_BANNER.supporting_text,
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
