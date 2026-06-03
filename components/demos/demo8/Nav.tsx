"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { resolveNavStyles } from "@/lib/navStyles";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  socialLinks: NavSocialLink[];
  navConfig: NavConfig;
}

export default function Demo8Nav({
  menuItems,
  logo,
  socialLinks,
  navConfig,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const ns = resolveNavStyles(navConfig);
  const itemColor = ns.itemColor || "rgba(255,255,255,0.8)";
  const hoverColor = ns.hoverColor || "var(--primary)";
  const underlineColor = ns.underlineColor || hoverColor;
  const navItemFontSize = ns.fontSizePx ? `${ns.fontSizePx}px` : undefined;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        ns.bgColor
          ? "border-b border-[var(--primary)]/10"
          : scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-[var(--primary)]/10"
          : "bg-gradient-to-b from-black/70 to-transparent"
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
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          ) : (
            <span className="font-bold text-lg text-white tracking-tight">
              eMasjid<span className="text-[var(--primary)]">.</span>
            </span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {menuItems.map((item, i) => (
            <div key={i} className="relative group">
              <a
                href={item.link || "#"}
                className="relative px-3 py-2 text-sm font-medium transition flex items-center gap-1"
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
                    className="absolute left-3 right-3 -bottom-0.5 h-[2px] w-0 group-hover:w-[calc(100%-1.5rem)] transition-all duration-300"
                    style={{ backgroundColor: underlineColor }}
                  />
                )}
              </a>
              {item.submenu && item.submenu.length > 0 && (
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-zinc-900 border border-white/10 rounded-lg shadow-2xl py-2 min-w-[220px]">
                    {item.submenu.map((sub, si) => (
                      <a
                        key={si}
                        href={sub.link}
                        className="block px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-[var(--primary)] transition border-l-2 border-transparent hover:border-[var(--primary)]"
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

        <div className="hidden lg:flex items-center gap-3">
          <button
            aria-label="Search"
            className="w-9 h-9 rounded-full text-white/70 hover:bg-white/10 flex items-center justify-center transition"
          >
            <Search className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-1.5">
            {socialLinks.slice(0, 3).map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition"
              >
                <Image
                  src={s.icon}
                  alt={s.platform}
                  width={15}
                  height={15}
                  className="brightness-0 invert opacity-70 hover:opacity-100"
                />
              </a>
            ))}
          </div>
          <Link
            href="/news"
            className="ml-2 px-5 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary)]/85 text-black text-sm font-bold transition"
          >
            Tonton
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-white ml-auto"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
          <nav className="px-5 py-4 space-y-1">
            {menuItems.map((item, i) => {
              const hasSub = item.submenu && item.submenu.length > 0;
              return (
                <div key={i} className="border-b border-white/5 last:border-0">
                  {hasSub ? (
                    <>
                      <button
                        onClick={() => setOpenSub(openSub === i ? null : i)}
                        className="w-full flex items-center justify-between py-3 text-sm font-medium text-white"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openSub === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSub === i && (
                        <div className="pb-3 pl-4 space-y-2">
                          {item.submenu!.map((sub, si) => (
                            <a
                              key={si}
                              href={sub.link}
                              className="block text-sm text-white/70 hover:text-[var(--primary)]"
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
                      className="block py-3 text-sm font-medium text-white"
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
