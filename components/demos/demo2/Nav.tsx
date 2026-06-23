"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronDown } from "lucide-react";
import { resolveNavStyles } from "@/lib/navStyles";
import { withMoreDropdown } from "@/lib/navOverflow";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  siteTitle: string;
  socialLinks: NavSocialLink[];
  email: string;
  phone: string;
  navConfig: NavConfig;
}

export default function Demo2Nav({
  menuItems,
  logo,
  siteTitle,
  socialLinks,
  email,
  phone,
  navConfig,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const ns = resolveNavStyles(navConfig);
  // Dropdown background from admin config (navbarDropdownBg), else white.
  const dropdownBg = ns.dropdownBg || "#ffffff";
  const itemColor = ns.itemColor || "#1f2937";
  const hoverColor = ns.hoverColor || "var(--secondary)";
  const underlineColor = ns.underlineColor || hoverColor;
  const navItemFontSize = ns.fontSizePx ? `${ns.fontSizePx}px` : undefined;

  // Cap visible nav entries at 7; the rest collapse under a "More" item.
  const displayMenuItems: MenuItem[] = withMoreDropdown(menuItems);

  return (
    <header
      className="border-b border-gray-200 sticky top-0 z-50"
      style={{
        backgroundColor: ns.bgColor || "#ffffff",
        opacity: ns.bgOpacity !== null ? ns.bgOpacity : undefined,
      }}
    >
      <div className="bg-gray-900 text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <span className="hidden md:inline tracking-wider">
            SELAMAT DATANG KE PORTAL eMASJID
          </span>
          <div className="flex items-center gap-5">
            {phone && (
              <a href={`tel:${phone}`} className="hover:text-gray-300 transition">
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="hover:text-gray-300 transition hidden md:inline"
              >
                {email}
              </a>
            )}
            <div className="flex items-center gap-2.5">
              {socialLinks.slice(0, 4).map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="opacity-70 hover:opacity-100 transition"
                >
                  <Image
                    src={s.icon}
                    alt={s.platform}
                    width={14}
                    height={14}
                    className="brightness-0 invert"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={56}
              height={56}
              className="h-14 w-auto object-contain"
            />
          ) : siteTitle ? (
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {siteTitle}
            </span>
          ) : null}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {displayMenuItems.map((item, i) => (
            <div key={i} className="relative group">
              <a
                href={item.link || "#"}
                target={item.targetWindow === "_blank" ? "_blank" : undefined}
                rel={item.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                className="relative text-[13px] font-bold tracking-[0.15em] uppercase transition-colors flex items-center gap-1"
                style={{ color: itemColor, fontSize: navItemFontSize }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = hoverColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = itemColor)
                }
              >
                {item.label}
                {ns.showUnderline && (
                  <span
                    aria-hidden
                    className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: underlineColor }}
                  />
                )}
                {item.submenu && item.submenu.length > 0 && (
                  <ChevronDown className="w-3 h-3" />
                )}
              </a>
              {item.submenu && item.submenu.length > 0 && (
                <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="border border-gray-200 shadow-xl py-2 min-w-[220px]" style={{ backgroundColor: dropdownBg }}>
                    {item.submenu.map((sub, si) => (
                      <a
                        key={si}
                        href={sub.link}
                        target={sub.targetWindow === "_blank" ? "_blank" : undefined}
                        rel={sub.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--secondary)] transition border-l-2 border-transparent hover:border-[var(--secondary)]"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-6 py-4 space-y-1">
            {displayMenuItems.map((item, i) => {
              const hasSub = item.submenu && item.submenu.length > 0;
              return (
                <div key={i} className="border-b border-gray-100 last:border-0">
                  {hasSub ? (
                    <>
                      <button
                        onClick={() => setOpenSub(openSub === i ? null : i)}
                        className="w-full flex items-center justify-between py-3 text-sm font-bold uppercase tracking-wider text-gray-800"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openSub === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSub === i && (
                        <div className="pb-3 pl-4 space-y-2 border-l border-gray-200">
                          {item.submenu!.map((sub, si) => (
                            <a
                              key={si}
                              href={sub.link}
                              target={sub.targetWindow === "_blank" ? "_blank" : undefined}
                              rel={sub.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                              className="block text-sm text-gray-600 hover:text-[var(--secondary)]"
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.link || "#"}
                      target={item.targetWindow === "_blank" ? "_blank" : undefined}
                      rel={item.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                      className="block py-3 text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-[var(--secondary)]"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
