"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "@/components/ui/FallbackImage";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronDown, ChevronRight, Search } from "lucide-react";
import { resolveNavStyles } from "@/lib/navStyles";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  siteTitle: string;
  socialLinks: NavSocialLink[];
  trendingTitle?: string;
  navConfig: NavConfig;
}

/**
 * Recursive submenu item for the desktop nav. Top-level dropdown drops
 * down from the parent; deeper levels fly out to the right.
 */
function DesktopSubmenuItem({ item }: { item: MenuItem }) {
  const hasChildren = !!item.submenu && item.submenu.length > 0;
  const isExternal = item.targetWindow === "_blank";

  if (hasChildren) {
    return (
      <div className="relative group/sub">
        <span className="flex items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] transition cursor-default select-none">
          {item.label}
          <ChevronRight className="w-3 h-3" />
        </span>
        <div className="absolute top-0 left-full opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all z-50">
          <div className="bg-white border border-gray-200 shadow-xl py-2 min-w-[220px]">
            {item.submenu!.map((sub, si) => (
              <DesktopSubmenuItem key={si} item={sub} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <a
      href={item.link || "#"}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] transition"
    >
      {item.label}
    </a>
  );
}

/**
 * Recursive mobile menu item — accordion that nests indefinitely.
 */
function MobileMenuItem({
  item,
  depth = 0,
}: {
  item: MenuItem;
  depth?: number;
}) {
  const [open, setOpen] = useState(false);
  const hasSub = !!item.submenu && item.submenu.length > 0;
  const isExternal = item.targetWindow === "_blank";
  const indent = depth === 0 ? "" : depth === 1 ? "pl-4" : "pl-8";

  if (hasSub) {
    return (
      <div className="border-b border-gray-100 last:border-0">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between py-2.5 text-sm font-bold uppercase tracking-wider text-gray-700 ${indent}`}
        >
          {item.label}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open && (
          <div className="pb-2 space-y-1">
            {item.submenu!.map((sub, si) => (
              <MobileMenuItem key={si} item={sub} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.link || "#"}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`block py-2.5 text-sm font-bold uppercase tracking-wider text-gray-700 ${indent} border-b border-gray-100 last:border-0`}
    >
      {item.label}
    </a>
  );
}

export default function Blog2Nav({
  menuItems,
  logo,
  siteTitle,
  socialLinks,
  navConfig,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ns = resolveNavStyles(navConfig);
  // Resolved colors with sane fallbacks for the blog template's defaults.
  const itemColor = ns.itemColor || "#374151";
  const hoverColor = ns.hoverColor || "var(--primary)";
  const underlineColor = ns.underlineColor || hoverColor;
  const navItemFontSize = ns.fontSizePx ? `${ns.fontSizePx}px` : undefined;

  // Cap the visible navbar to 6 top-level items. The 7th+ collapse into a
  // synthetic "More" dropdown so the navbar stays compact.
  const MAX_VISIBLE = 6;
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/news?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery("");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top utility bar — date + social icons */}
      <div className="bg-[#1a1a1a] text-white text-[11px]">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between gap-4">
          <span className="text-white">{today}</span>
          {socialLinks.length > 0 && (
            <div className="hidden md:flex items-center gap-3">
              {socialLinks.slice(0, 5).map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="opacity-90 hover:opacity-100 transition"
                >
                  <Image
                    src={s.icon}
                    alt={s.platform}
                    width={13}
                    height={13}
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main nav — backdrop respects admin navbarBg + navbarOpacity */}
      <div
        className="relative border-b border-gray-200"
        style={
          ns.bgColor
            ? {
                backgroundColor: ns.bgColor,
                opacity: undefined,
              }
            : undefined
        }
      >
        {/* Opacity overlay so text stays opaque while only the bg fades. */}
        {ns.bgColor && ns.bgOpacity !== null && ns.bgOpacity < 1 && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "white", opacity: 1 - ns.bgOpacity }}
          />
        )}
        <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-1 flex-shrink-0">
            {logo ? (
              <Image
                src={logo}
                alt="Logo"
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
              />
            ) : siteTitle ? (
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {siteTitle}
              </span>
            ) : null}
          </Link>

          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {displayMenuItems.map((item, i) => {
              const isExternal = item.targetWindow === "_blank";
              const hasSub = !!item.submenu && item.submenu.length > 0;
              return (
                <div key={i} className="relative group">
                  {hasSub ? (
                    // Parent with submenu: pure dropdown trigger, no nav.
                    <span
                      className="relative text-[12px] font-bold uppercase tracking-[0.15em] transition flex items-center gap-1 cursor-default select-none"
                      style={{ color: itemColor, fontSize: navItemFontSize }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = hoverColor)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = itemColor)
                      }
                    >
                      {item.label}
                      <ChevronDown className="w-3 h-3" />
                      {ns.showUnderline && (
                        <span
                          aria-hidden
                          className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300"
                          style={{ backgroundColor: underlineColor }}
                        />
                      )}
                    </span>
                  ) : (
                    <a
                      href={item.link || "#"}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="relative text-[12px] font-bold uppercase tracking-[0.15em] transition flex items-center gap-1"
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
                    </a>
                  )}
                  {hasSub && (
                    <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="bg-white border border-gray-200 shadow-xl py-2 min-w-[220px]">
                        {item.submenu!.map((sub, si) => (
                          <DesktopSubmenuItem key={si} item={sub} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <form
            onSubmit={submitSearch}
            className="relative hidden lg:flex items-center"
          >
            {/* Overlay input — positioned absolutely so it doesn't shift the nav */}
            <div
              className={`absolute right-10 top-1/2 -translate-y-1/2 flex items-center bg-white shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 z-50 ${
                searchOpen
                  ? "w-64 opacity-100 px-3 py-1.5 pointer-events-auto"
                  : "w-0 opacity-0 px-0 py-0 border-transparent pointer-events-none"
              }`}
            >
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari berita..."
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none min-w-0"
                tabIndex={searchOpen ? 0 : -1}
              />
            </div>
            <button
              type="button"
              aria-label={searchOpen ? "Submit search" : "Open search"}
              onClick={() => {
                if (searchOpen) {
                  if (query.trim()) {
                    submitSearch(
                      new Event("submit") as unknown as FormEvent
                    );
                  } else {
                    setSearchOpen(false);
                  }
                } else {
                  setSearchOpen(true);
                }
              }}
              className={`relative z-50 w-9 h-9 rounded-full flex items-center justify-center transition ${
                searchOpen
                  ? "bg-[var(--primary)] text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
            <button type="submit" className="sr-only" tabIndex={-1}>
              Submit
            </button>
          </form>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-5 py-3">
            {displayMenuItems.map((item, i) => (
              <MobileMenuItem key={i} item={item} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
