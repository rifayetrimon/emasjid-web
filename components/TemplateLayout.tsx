import { ReactNode } from "react";
import { getNavData } from "@/services/navService";
import { getFooterData } from "@/services/footerService";
import { getCachedConfig } from "@/services/apiCache";

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
import ClassicNavbar from "@/components/layouts/navbar";
import ClassicFooter from "@/components/layouts/footer";

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
    primary: "#78C841",
    secondary: "#154D71",
    text: "#1a1a1a",
    bg: "bg-white",
  },
};

export default async function TemplateLayout({
  templateId,
  children,
  padForFixedNav = false,
}: Props) {
  const [nav, footer, config] = await Promise.all([
    getNavData(),
    getFooterData(),
    getCachedConfig(),
  ]);

  const general = config.generalSettings || {};
  const footerCfg = config.footerConfig || {};
  const defaults = TEMPLATE_DEFAULTS[templateId];

  const cssVars = {
    "--primary": general.primaryColor || defaults.primary,
    "--secondary": general.secondaryColor || defaults.secondary,
    "--text": general.textColor || defaults.text,
  } as React.CSSProperties;

  let navElement: ReactNode = null;
  let footerElement: ReactNode = null;
  let usesFixedNav = false;

  switch (templateId) {
    case "1":
      navElement = (
        <Demo7Nav
          menuItems={nav.menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
        />
      );
      footerElement = footer && <Demo7Footer footer={footer} />;
      break;
    case "2":
      navElement = (
        <Demo4Nav
          menuItems={nav.menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
        />
      );
      footerElement = footer && <Demo4Footer footer={footer} />;
      break;
    case "3":
      navElement = (
        <Demo8Nav
          menuItems={nav.menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
        />
      );
      footerElement = footer && <Demo8Footer footer={footer} />;
      usesFixedNav = true;
      break;
    case "4":
      navElement = (
        <Demo2Nav
          menuItems={nav.menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
          email={footerCfg.email || ""}
          phone={footerCfg.phonenum || ""}
        />
      );
      footerElement = footer && <Demo2Footer footer={footer} />;
      break;
    case "5":
      navElement = (
        <Demo5Nav
          menuItems={nav.menuItems}
          logo={nav.logo}
          socialLinks={nav.socialLinks}
        />
      );
      footerElement = footer && <Demo5Footer footer={footer} />;
      break;
    case "6":
      navElement = <ClassicNavbar />;
      footerElement = <ClassicFooter />;
      break;
  }

  return (
    <div
      style={cssVars}
      className={`${defaults.bg} min-h-screen flex flex-col`}
    >
      {navElement}
      <main
        className={`flex-1 ${padForFixedNav && usesFixedNav ? "pt-20" : ""}`}
      >
        {children}
      </main>
      {footerElement}
    </div>
  );
}
