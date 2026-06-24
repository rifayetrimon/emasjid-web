"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { socialBrand } from "@/lib/socialBrand";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { resolveNavStyles } from "@/lib/navStyles";
import { withMoreDropdown } from "@/lib/navOverflow";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  siteTitle: string;
  socialLinks: NavSocialLink[];
  navConfig: NavConfig;
}

export default function Demo7Nav({
  menuItems,
  logo,
  siteTitle,
  socialLinks,
  navConfig,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const ns = resolveNavStyles(navConfig);
  // Dropdown background from admin config (navbarDropdownBg), else white.
  const dropdownBg = ns.dropdownBg || "#ffffff";
  const itemColor = ns.itemColor || "#374151";
  const hoverColor = ns.hoverColor || "var(--primary)";
  const underlineColor = ns.underlineColor || hoverColor;
  const navItemFontSize = ns.fontSizePx ? `${ns.fontSizePx}px` : undefined;

  // Cap visible nav entries at 7; the rest collapse under a "More" item.
  const displayMenuItems: MenuItem[] = withMoreDropdown(menuItems);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        ns.bgColor
          ? "border-b border-gray-100"
          : scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-100"
          : "bg-transparent"
      }`}
      style={
        ns.bgColor
          ? {
              backgroundColor: ns.bgColor,
              opacity: ns.bgOpacity !== null ? ns.bgOpacity : undefined,
            }
          : undefined
      }
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={42}
              height={42}
              className="h-10 w-auto object-contain"
            />
          ) : siteTitle ? (
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              {siteTitle}
            </span>
          ) : null}
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {displayMenuItems.map((item, i) =>(
            <div key={i} className="relative group">
              <a
                href={item.link || "#"}
                target={item.targetWindow === "_blank" ? "_blank" : undefined}
                rel={item.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                className="relative px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100/80 transition-all flex items-center gap-1"
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
                  <div className="border border-gray-100 rounded-2xl shadow-xl py-2 min-w-[220px]" style={{ backgroundColor: dropdownBg }}>
                    {item.submenu.map((sub, si) => (
                      <a
                        key={si}
                        href={sub.link}
                        target={sub.targetWindow === "_blank" ? "_blank" : undefined}
                        rel={sub.targetWindow === "_blank" ? "noopener noreferrer" : undefined}
                        className="block mx-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-rose-50 rounded-xl transition"
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

        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            {socialLinks.slice(0, 3).map((s, i) => {
              const { Icon, label } = socialBrand(s.platform || s.icon);
              return (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="group w-9 h-9 rounded-full bg-gray-100/60 hover:bg-rose-100 flex items-center justify-center transition-all"
                >
                  <Icon className="w-[15px] h-[15px] text-gray-700 opacity-60 group-hover:opacity-100 group-hover:text-rose-500 transition" aria-hidden />
                </a>
              );
            })}
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white text-sm font-semibold shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/60 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Mula
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-full bg-white/60 backdrop-blur-md"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden mx-4 mb-4 rounded-3xl bg-white shadow-xl border border-gray-100">
          <nav className="px-5 py-4 space-y-1">
            {displayMenuItems.map((item, i) =>{
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
