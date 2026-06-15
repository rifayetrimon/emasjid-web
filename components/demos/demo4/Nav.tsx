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
  navConfig: NavConfig;
}

export default function Demo4Nav({
  menuItems,
  logo,
  siteTitle,
  socialLinks,
  navConfig,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const ns = resolveNavStyles(navConfig);
  const itemColor = ns.itemColor || "#374151";
  const hoverColor = ns.hoverColor || "var(--primary)";
  const underlineColor = ns.underlineColor || hoverColor;
  const navItemFontSize = ns.fontSizePx ? `${ns.fontSizePx}px` : undefined;

  // Cap visible nav entries at 7; the rest collapse under a "More" item.
  const displayMenuItems: MenuItem[] = withMoreDropdown(menuItems);

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-100"
      style={{
        backgroundColor: ns.bgColor || "#ffffff",
        opacity: ns.bgOpacity !== null ? ns.bgOpacity : undefined,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={42}
              height={42}
              className="h-10 w-auto object-contain"
            />
          ) : siteTitle ? (
            <span className="font-bold text-lg text-gray-900">{siteTitle}</span>
          ) : null}
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {displayMenuItems.map((item, i) => (
            <div key={i} className="relative group">
              <a
                href={item.link || "#"}
                target={item.targetWindow === "_blank" ? "_blank" : undefined}
                rel={item.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                className="relative px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all flex items-center gap-1"
                style={{ color: itemColor, fontSize: navItemFontSize }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = hoverColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = itemColor)
                }
              >
                {item.label}
                {item.submenu && item.submenu.length > 0 && (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                {ns.showUnderline && (
                  <span
                    aria-hidden
                    className="absolute left-4 right-4 -bottom-0.5 h-[2px] w-0 group-hover:w-[calc(100%-2rem)] transition-all duration-300"
                    style={{ backgroundColor: underlineColor }}
                  />
                )}
              </a>
              {item.submenu && item.submenu.length > 0 && (
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-[200px]">
                    {item.submenu.map((sub, si) => (
                      <a
                        key={si}
                        href={sub.link}
                        target={sub.targetWindow === "_blank" ? "_blank" : undefined}
                        rel={sub.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                        className="block mx-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
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

        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            {socialLinks.slice(0, 3).map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="group w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition"
              >
                <Image
                  src={s.icon}
                  alt={s.platform}
                  width={16}
                  height={16}
                  className="brightness-0 opacity-70 group-hover:opacity-100"
                />
              </a>
            ))}
          </div>
          <Link
            href="/news"
            className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition"
          >
            Berita
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="px-5 py-4 space-y-1">
            {displayMenuItems.map((item, i) => {
              const hasSub = item.submenu && item.submenu.length > 0;
              return (
                <div key={i}>
                  {hasSub ? (
                    <>
                      <button
                        onClick={() => setOpenSub(openSub === i ? null : i)}
                        className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-gray-800"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openSub === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSub === i && (
                        <div className="pl-4 space-y-2 pb-2">
                          {item.submenu!.map((sub, si) => (
                            <a
                              key={si}
                              href={sub.link}
                              target={sub.targetWindow === "_blank" ? "_blank" : undefined}
                              rel={sub.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                              className="block text-sm text-gray-600 hover:text-[var(--primary)]"
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
                      className="block py-2.5 text-sm font-medium text-gray-800"
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
