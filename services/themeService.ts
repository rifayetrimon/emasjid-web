// services/themeService.ts
import { getCachedConfig } from "./apiCache";
import { getImageUrl } from "./utils";
import type { DonationConfig, SiteTheme } from "@/types/cms";

function isOn(v: unknown): boolean {
  return String(v ?? "").toLowerCase() === "on";
}

/**
 * Mirror of footerService's helper: a toggle is considered ON unless the
 * admin explicitly set it to off. Used for the visitor counter so the
 * section stays visible when the CMS leaves the field empty.
 */
function isNotOff(v: unknown): boolean {
  const s = String(v ?? "").trim().toLowerCase();
  return !(
    s === "off" ||
    s === "false" ||
    s === "no" ||
    s === "disable" ||
    s === "disabled" ||
    s === "0"
  );
}

function isEnabled(v: unknown): boolean {
  const s = String(v ?? "").toLowerCase();
  return s === "enable" || s === "enabled" || s === "yes" || s === "on" || s === "true";
}

function pick(
  ...sources: (Record<string, unknown> | undefined)[]
): (key: string) => string {
  return (key: string) => {
    for (const s of sources) {
      if (!s) continue;
      const v = s[key];
      if (v !== undefined && v !== null && v !== "") return String(v);
    }
    return "";
  };
}

export async function getSiteTheme(): Promise<SiteTheme> {
  const config = await getCachedConfig();
  const general = (config.generalSettings || {}) as Record<string, unknown>;
  const footerCfg = (config.footerConfig || {}) as Record<string, unknown>;
  const headerCfg = (config.headerConfig || {}) as Record<string, unknown>;
  const newsCfg = (config.newsConfig || {}) as Record<string, unknown>;
  const faqCfg = (config.faqConfig || {}) as Record<string, unknown>;
  const midBannerCfg = (config.midBannerConfig || {}) as Record<string, unknown>;

  const read = pick(general, footerCfg, headerCfg, newsCfg, faqCfg, midBannerCfg, config);

  const maxDisplayRaw = read("maxDisplay");
  const maxDisplay = Number(maxDisplayRaw);
  const currYearDownToRaw = read("currYearDownTo");
  const currYearDownTo = Number(currYearDownToRaw);

  return {
    primaryColor: read("primaryColor"),
    secondaryColor: read("secondaryColor"),
    textColor: read("textColor"),
    bgColorHeader: read("bgColorHeader"),
    textColorHeaderFooter: read("textColorHeaderFooter"),
    colorNavHeaderLine: read("colorNavHeaderLine"),
    textColorNavHeaderLine: read("textColorNavHeaderLine"),
    backgroundColorNews: read("backgroundColorNews"),
    backgroundColorTrending: read("backgroundColorTrending"),
    bgColorFooter: read("bgColorFooter"),
    colorFooterArea: read("colorFooterArea"),
    colorFooterAreaText: read("colorFooterAreaText"),
    subheader: read("subheader"),
    midBannerMainTitle: read("midBannerMainTitle"),
    faqMainTitle: (faqCfg.faqTitle as string) || read("faqMainTitle"),
    copyright: read("copyright"),
    currYearDownTo: Number.isFinite(currYearDownTo) ? currYearDownTo : 0,
    maxDisplay: Number.isFinite(maxDisplay) && maxDisplay > 0 ? maxDisplay : 0,
    complaintEnabled: isOn(read("complaint")),
    showVisitorCounter: isNotOff(read("countingVisitorFooter")),
    privacyTncPage: read("privacyTncPage"),
  };
}

export async function getDonationConfig(): Promise<DonationConfig> {
  const config = await getCachedConfig();
  const donationCfg = (config.donationConfig || {}) as Record<string, unknown>;
  const general = (config.generalSettings || {}) as Record<string, unknown>;
  const read = pick(donationCfg, general, config);

  const targetRaw = read("donation_target");
  const target = Number(String(targetRaw).replace(/[^0-9.-]/g, ""));

  return {
    enabled: isEnabled(read("donation_module")),
    title: read("donation_title"),
    target: Number.isFinite(target) ? target : 0,
    productCode: read("donation_product_code"),
    buttonTitle: read("donation_button_title"),
    buttonUrl: read("donation_button_url"),
    tickerColor: read("donation_ticker_color"),
    tickerBackgroundColor: read("donation_ticker_background_color"),
    tickerTextColor: read("donation_ticker_text_color"),
    buttonColor: read("donation_button_color"),
    textColor: read("donation_text_color"),
    progressBarColor: read("donation_progress_bar_color"),
    leaderboardEnabled: isEnabled(read("donation_leaderboard")),
    leaderboardTitle: read("donation_leaderboard_title"),
    leaderboardColor: read("donation_leaderboard_color"),
    backgroundImage: getImageUrl(read("donation_background") || read("donation_file")),
  };
}
