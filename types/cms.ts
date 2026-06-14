// types/cms.ts
import { ReactNode } from "react";

/* ------------------------------
   Base Settings
------------------------------ */
export interface BaseSettings {
  primary_color: string;
  secondary_color: string;
  text_color: string;
}

/* ------------------------------
   Menu
------------------------------ */
export interface MenuItem {
  label: string;
  link: string;
  /** "_blank" opens in a new tab; default behavior is same-tab. */
  targetWindow?: string;
  submenu?: MenuItem[];
}

/* ------------------------------
   Banner
------------------------------ */
export interface BannerTitleFocus {
  text: string;
  link: string;
}

export interface BannerTitle {
  general: string;
  focus: BannerTitleFocus;
}

export interface BannerButton {
  label: string;
  link: string;
}

export interface Banner {
  logo: string;
  background_image: string;
  background_images: string[];
  menu_items: MenuItem[];
  title: BannerTitle;
  supporting_text: string;
  buttons: BannerButton[];
  textColor: string;
  overlayColor: string;
  overlayOpacity: number;
}

/* ------------------------------
   Segment
------------------------------ */
export interface SegmentButton {
  label: string;
  link: string;
}

export interface Segment {
  image: string;
  text?: string; // optional in case missing
  button?: SegmentButton;
}

/* ------------------------------
   Features
------------------------------ */
export interface FeatureItem {
  icon: string;
  title: string;
  text?: string;
}

export interface Features {
  title: string;
  items: FeatureItem[];
}

/* ------------------------------
   FAQ
------------------------------ */
export interface FAQItem {
  short?: ReactNode;
  question: string;
  text?: string;
  answer: string;
}

export interface FAQ {
  title: string;
  background_image?: string;
  items: FAQItem[];
}

/* ------------------------------
   Branding
------------------------------ */
export interface BrandingItem {
  image: string;
}

/* ------------------------------
   Footer
------------------------------ */
export interface FooterImage {
  image: string;
  link: string;
}

export interface SocialLink {
  platform: string;
  link: string;
}

export interface Footer {
  image: FooterImage;
  footer_title: string;
  text: string;
  address: string;
  phone: string;
  email: string;
  social_links: SocialLink[];
  copyright: string;
}

/* ------------------------------
   Partnership
------------------------------ */
export interface PartnershipImage {
  isset: string; // can change to boolean later
  image: string;
}

/* ------------------------------
   CMS Content
------------------------------ */
export interface Content {
  banner: Banner;
  segments: Segment[];
  fetures: Features; // typo preserved to match JSON
  faq: FAQ;
  branding: BrandingItem[];
  footer: Footer;
  pernarship_image: PartnershipImage; // typo preserved
}

export interface CMSData {
  base_settings: BaseSettings;
  content: Content;
  features: FeatureItem[];
}

/* ------------------------------
   Props Interfaces
------------------------------ */
export interface BannerProps {
  banner: Banner;
}

export interface NavConfig {
  navbarBg: string;
  navbarItemfontSize: string;
  navbarItemColor: string;
  navbarItemHoverColor: string;
  navbarItemUnderLine: boolean;
  navbarItemUnderLineColor: string;
  navbarOpacity: number;
  navbarDropdownBg: string;
}

export interface NavSocialLink {
  platform: string;
  icon: string;
  link: string;
}

export interface NavbarProps {
  menuItems: MenuItem[];
}

export interface SegmentsProps {
  segments: Segment[];
}

export interface FeaturesProps {
  fetures: Features;
}

export interface FAQProps {
  faq: FAQ;
}

export interface BrandingProps {
  branding: BrandingItem[];
}

export interface PartnershipProps {
  pernarship_image: PartnershipImage;
}

export interface FooterColumn {
  title: string;
  content: string;
}

export interface FooterData {
  image: { image: string; link: string };
  footer_title: string;
  text: string;
  address: string;
  phone: string;
  email: string;
  social_links: { platform: string; link: string }[];
  copyright: string;
  bgColor: string;
  /** col1 / col2 / col3 from admin footer endpoint */
  columns: FooterColumn[];
  /** Footer background image (from admin "file" field) */
  backgroundImage: string;
  /** Hex color for the overlay applied on top of `backgroundImage`. From
   *  Config.footerConfig.bgColorFooter — admins set one colour that's used
   *  both as the solid bg (no image) and as the image overlay tint. */
  overlayColor: string;
  /** Overlay opacity expressed as a percentage 0–100. From
   *  Config.footerConfig.opacity. Defaults to 80 when unset. */
  overlayOpacity: number;
  /** Footer area text color (from Config.colorFooterAreaText / textColorHeaderFooter) */
  textColor: string;
  /** Color applied to footer COLUMN HEADERS / TITLES only — not body text.
   *  From Config.footerConfig.textColorHeaderFooter (falls back to the
   *  top-level Config.textColorHeaderFooter). Empty string means "use the
   *  component's default heading color". */
  headerColor: string;
  /** Footer area accent color (from Config.colorFooterArea) */
  areaColor: string;
  /** Whether to show the visitor counter (from Config.countingVisitorFooter) */
  showVisitorCounter: boolean;
}

export interface FooterProps {
  footer: FooterData;
}

/* ------------------------------
   News (admin-driven)
------------------------------ */
export type NewsPosDisplay = "full" | "grid" | "sidebar" | "slide";
export type NewsCategory = "NEWS" | "SPORTS" | string;

export interface NewsImage {
  src: string;
  alt: string;
}

export interface NewsItem {
  // Backend used to ship numeric IDs; newer tenants ship 24-char hex IDs
  // (e.g. "6a1eb214a5cb07561f8a6a5c"). Carry as a string so both shapes
  // survive intact through React keys and URL params.
  contentId: string;
  title: string;
  message: string;
  date: string;
  time: string;
  status: number;
  /** First image (legacy alias of images[0]) */
  file1: string | null;
  altImg1: string;
  /** All images (banner1..3 → file1..3) with alt text */
  images: NewsImage[];
  category: NewsCategory;
  isHighlight: boolean;
  isFrontPage: boolean;
  posDisplay: NewsPosDisplay;
  urlIframe: string;
  mobileDes: string;
}

/* ------------------------------
   Banner slides (header / sider / promotag)
------------------------------ */
export interface BannerSlide {
  src: string;
  url: string;
  alt?: string;
}

// Promotag banners carry an admin-authored message and presentation details.
// `imagemode` decides whether the image is a backdrop for the message
// ("background") or the promo creative itself ("banner").
export type PromotagImageMode = "background" | "banner";

export interface PromotagDetails {
  message: string;
  imageMode: PromotagImageMode;
  pillColor: string; // admin `colopix` — accent / message-box background
  fontColor: string; // admin `colofont` — message text colour
  fontSize: string; // admin `fontsize` — raw value, may be empty
  tagPosition: string; // admin `tagposition` — "Position1".."Position5"
}

export interface BannerRecord {
  // Backend ships numeric ids for header/sider but 24-char hex for promotag;
  // keep as string so both round-trip (a hex id Number()'d to NaN broke keys).
  bannerId: string;
  sta: number;
  slides: BannerSlide[];
  /** Present only for promotag banners that carry a message/details block. */
  promo?: PromotagDetails;
}

/* ------------------------------
   Gallery
------------------------------ */
export interface GalleryItem {
  // Backend now ships 24-char hex IDs; keep as string so old numeric IDs
  // and new ObjectId-style values both round-trip without NaN coercion.
  galleryId: string;
  date: string;
  title: string;
  file: string;
  /** "image" → render as <Image>; "document" → render as PDF/file tile. */
  kind: "image" | "document";
  category: string;
}

export interface GalleryCategory {
  id: number | string;
  name: string;
}

/* ------------------------------
   Plugin / Module
------------------------------ */
export interface PluginItem {
  // Same shape rules as `staticId` — accept hex strings without lossy NaN.
  pluginId: string;
  date: string;
  time: string;
  status: number;
  title: string;
  message: string;
  urlLink: string;
  cate: string;
}

export interface PluginCategory {
  id: number | string;
  name: string;
}

/* ------------------------------
   Static content (about / TnC etc.)
------------------------------ */
export interface StaticContentItem {
  // Backend may ship numeric IDs (legacy) or 24-char hex (new). Carry as
  // a string so neither shape is lossily coerced.
  staticId: string;
  date: string;
  time: string;
  status: number;
  hits: number;
  title: string;
  message: string;
  posDisplay: NewsPosDisplay;
  urlIframe: string;
  iframeSize: string;
  images: NewsImage[];
}

/* ------------------------------
   Donation module
------------------------------ */
export interface DonationConfig {
  enabled: boolean;
  title: string;
  target: number;
  productCode: string;
  buttonTitle: string;
  buttonUrl: string;
  tickerColor: string;
  tickerBackgroundColor: string;
  tickerTextColor: string;
  buttonColor: string;
  textColor: string;
  progressBarColor: string;
  leaderboardEnabled: boolean;
  leaderboardTitle: string;
  leaderboardColor: string;
  backgroundImage: string;
}

/* ------------------------------
   Site-wide theme (derived from Config)
------------------------------ */
export interface SiteTheme {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  bgColorHeader: string;
  textColorHeaderFooter: string;
  colorNavHeaderLine: string;
  textColorNavHeaderLine: string;
  backgroundColorNews: string;
  backgroundColorTrending: string;
  bgColorFooter: string;
  colorFooterArea: string;
  colorFooterAreaText: string;
  subheader: string;
  midBannerMainTitle: string;
  faqMainTitle: string;
  copyright: string;
  /** Year range for footer year dropdowns */
  currYearDownTo: number;
  /** Cap for lists; 0 means unlimited */
  maxDisplay: number;
  /** Toggles from Config */
  complaintEnabled: boolean;
  showVisitorCounter: boolean;
  /** Resolved URL/slug for privacy/TnC static page */
  privacyTncPage: string;
}
