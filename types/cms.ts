// types/cms.ts

import { ReactNode } from "react";

export interface BaseSettings {
  primary_color: string;
  secondary_color: string;
  text_color: string;
}

export interface MenuItem {
  label: string;
  link: string;
}

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

export interface SegmentButton {
  label: string;
  link: string;
}

export interface Segment {
  image: string;
  text: string;
  button: SegmentButton;
}

export interface FeatureItem {
  icon: string;
  title: string;
  text: string;
}

export interface Features {
  title: string;
  items: FeatureItem[];
}

export interface FAQItem {
  short: ReactNode;
  question: string;
  text: string;
  answer: string;
}

export interface FAQ {
  title: string;
  items: FAQItem[];
}

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

export interface PartnershipImage {
  isset: string; // can be boolean later
  image: string;
}

export interface Content {
  banner: Banner;
  segments: Segment[];

  // 👇 matches your JSON exactly (typo preserved)
  fetures: Features;

  faq: FAQ;
  image_section: string[];
  footer: Footer;

  // 👇 matches your JSON exactly (typo preserved)
  pernarship_image: PartnershipImage;
}

export interface CMSData {
  base_settings: BaseSettings;
  content: Content;

  // 👇 normalized so frontend can always use cms.features
  features: FeatureItem[];
}

// Footer
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
