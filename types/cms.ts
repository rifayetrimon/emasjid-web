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
  menu_items: MenuItem[];
  title: BannerTitle;
  supporting_text: string;
  buttons: BannerButton[];
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

export interface FooterData {
  image: { image: string; link: string };
  footer_title: string;
  text: string;
  address: string;
  phone: string;
  email: string;
  social_links: { platform: string; link: string }[];
  copyright: string;
}

export interface FooterProps {
  footer: FooterData;
}
