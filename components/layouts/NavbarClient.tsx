"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";

interface NavbarClientProps {
  menuItems: MenuItem[];
  logo: string;
  navConfig: NavConfig;
  socialLinks: NavSocialLink[];
}

export default function NavbarClient({
  menuItems,
  logo,
  navConfig,
  socialLinks,
}: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<number | null>(null);

  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  // The navbar shows at most 3 social icons, prioritising Facebook, Instagram
  // and WhatsApp (then any others). The full set is shown in the footer.
  const NAV_SOCIAL_PRIORITY = ["facebook", "instagram", "whatsapp"];
  const navSocials = [...(Array.isArray(socialLinks) ? socialLinks : [])]
    .sort((a, b) => {
      const ai = NAV_SOCIAL_PRIORITY.indexOf(a.platform.toLowerCase());
      const bi = NAV_SOCIAL_PRIORITY.indexOf(b.platform.toLowerCase());
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .slice(0, 3);

  // Cap the visible navbar to 6 top-level items. Any 7th+ items collapse
  // into a synthetic "More" dropdown so the navbar stays compact. Children
  // of overflow items are flattened — they appear as direct entries in the
  // "More" menu, which is intentional: a multi-level dropdown inside
  // "More" would crowd the UI for tenants with deep nav trees.
  const MAX_VISIBLE = 6;
  const displayMenuItems: MenuItem[] =
    safeMenuItems.length > MAX_VISIBLE
      ? [
          ...safeMenuItems.slice(0, MAX_VISIBLE),
          {
            label: "More",
            link: "#",
            submenu: safeMenuItems.slice(MAX_VISIBLE),
          },
        ]
      : safeMenuItems;

  // Colors from navConfig
  const itemColor = navConfig.navbarItemColor || "#1f2937";
  const hoverColor = navConfig.navbarItemHoverColor || "var(--primary)";
  const fontSize = navConfig.navbarItemfontSize || undefined;
  const navBgColor = navConfig.navbarBg || "#ffffff";
  const navOpacity = (navConfig.navbarOpacity ?? 100) / 100;
  const underline = navConfig.navbarItemUnderLine;
  const underlineColor = navConfig.navbarItemUnderLineColor || hoverColor;
  const dropdownBg = navConfig.navbarDropdownBg || "#ffffff";
  const dropdownTextColor = dropdownBg === "#ffffff" || !navConfig.navbarDropdownBg ? "#1f2937" : "#ffffff";

  const hasSubmenu = (item: MenuItem) =>
    item.submenu && item.submenu.length > 0;

  // CSS variables for dynamic theming — passed to nav element
  const navCssVars = {
    "--nav-item-color": itemColor,
    "--nav-hover-color": hoverColor,
    "--nav-font-size": fontSize ? `${fontSize}px` : "inherit",
    "--nav-underline-color": underlineColor,
    "--nav-dropdown-bg": dropdownBg,
    "--nav-dropdown-text": dropdownTextColor,
  } as React.CSSProperties;

  return (
    <nav
      className="w-full py-4 px-6 relative z-50"
      style={navCssVars}
    >
      {/* Background with opacity */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: navBgColor, opacity: navOpacity }}
      />
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
          ) : (
            <span className="text-xl font-bold" style={{ color: itemColor }}>Logo</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {displayMenuItems.map((item, index) => (
              <li key={index} className="group/nav relative">
                <a
                  href={item.link || "#"}
                  className="relative inline-flex items-center gap-1 font-medium pb-1 transition-colors duration-200"
                  style={{
                    color: itemColor,
                    fontSize: fontSize ? `${fontSize}px` : undefined,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = itemColor; }}
                >
                  {item.label}
                  {/* Animated underline */}
                  {underline && (
                    <span
                      className="absolute bottom-0 left-0 h-[2px] w-0 group-hover/nav:w-full transition-all duration-300 ease-in-out"
                      style={{ backgroundColor: underlineColor }}
                    />
                  )}
                </a>

                {/* Dropdown - always in DOM, shown via group hover */}
                {hasSubmenu(item) && (
                  <div className="absolute top-full left-0 min-w-[200px] pt-1 opacity-0 invisible translate-y-[-4px] group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-200 ease-out z-[100]">
                    <div
                      className="rounded-lg shadow-xl py-2"
                      style={{ backgroundColor: dropdownBg }}
                    >
                      {item.submenu!.map((sub, subIndex) => (
                        <a
                          key={subIndex}
                          href={sub.link}
                          className="block px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200"
                          style={{ color: dropdownTextColor }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = hoverColor;
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = dropdownTextColor;
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Social icons — up to 3 (Facebook, Instagram, WhatsApp first) */}
          {navSocials.length > 0 && (
            <div className="flex items-center gap-3">
              {navSocials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.platform}
                  aria-label={social.platform}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  <Image src={social.icon} alt={social.platform} width={20} height={20} className="w-5 h-5" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
          style={{ color: itemColor }}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg p-4 shadow-xl border border-gray-200 absolute top-16 left-4 right-4 z-[100]">
          <ul className="flex flex-col gap-1">
            {displayMenuItems.map((item, index) => (
              <li key={index}>
                {hasSubmenu(item) ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileOpenSubmenu(mobileOpenSubmenu === index ? null : index)
                      }
                      className="w-full flex items-center justify-between font-medium text-gray-800 hover:text-[var(--primary)] py-2"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileOpenSubmenu === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileOpenSubmenu === index && (
                      <ul className="pl-4 border-l-2 border-gray-200 mb-1">
                        {item.submenu!.map((sub, subIndex) => (
                          <li key={subIndex}>
                            <a
                              href={sub.link}
                              onClick={() => setMenuOpen(false)}
                              className="block font-medium text-gray-600 hover:text-[var(--primary)] py-1.5 text-sm"
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={item.link}
                    onClick={() => setMenuOpen(false)}
                    className="block font-medium text-gray-800 hover:text-[var(--primary)] py-2"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {navSocials.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                {navSocials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.platform}
                    aria-label={social.platform}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Image src={social.icon} alt={social.platform} width={24} height={24} className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
