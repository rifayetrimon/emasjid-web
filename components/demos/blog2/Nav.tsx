"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "@/components/ui/FallbackImage";
import { socialBrand } from "@/lib/socialBrand";
import { MenuItem, NavConfig, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronDown, ChevronRight, Search } from "lucide-react";
import { resolveNavStyles } from "@/lib/navStyles";
import { withMoreDropdown } from "@/lib/navOverflow";

// True when `link` points at the page the visitor is currently on, so the nav
// can highlight it (with the hover colour). Internal links only — external
// links are never treated as the active page.
//
// In the static export, CMS content links are funnelled through query-param
// routes (`/static/?slug=<id>`, `/news/detail/?id=<id>`). So we compare BOTH
// the path AND the identifying query param (slug/id) — that's what lets the
// e.g. "Technology" page light up its own nav item. `search` is the current
// URL's query string (without the leading "?"); preview-only params are
// ignored because we only match on slug/id.
function isActiveNavLink(
  pathname: string,
  search: string,
  link?: string,
): boolean {
  if (!link || link === "#") return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) return false; // external (http:, mailto:, …)

  const stripTrail = (s: string) => (s || "").replace(/\/+$/, "");
  const [rawPath, rawQuery = ""] = link.split("?");
  const lPath = stripTrail(rawPath.replace(/#.*$/, ""));
  const cPath = stripTrail((pathname || "").replace(/#.*$/, ""));

  // Path match — exact, nested child, or (base-path tolerant) suffix either
  // way, since the preview prefixes links/paths with a base path.
  const samePath =
    cPath === lPath ||
    (lPath !== "" && cPath.startsWith(lPath + "/")) ||
    (lPath !== "" &&
      cPath !== "" &&
      (cPath.endsWith(lPath) || lPath.endsWith(cPath)));

  // Query-param content route: require the path AND the slug/id to match, so
  // each content page highlights only its own entry.
  if (rawQuery) {
    const lp = new URLSearchParams(rawQuery);
    const cp = new URLSearchParams(search || "");
    const key = lp.has("slug") ? "slug" : lp.has("id") ? "id" : null;
    if (!key) return samePath;
    return samePath && !!lp.get(key) && lp.get(key) === cp.get(key);
  }

  if (lPath === "") return cPath === ""; // home is active only at the site root
  return samePath;
}

interface Props {
  menuItems: MenuItem[];
  logo: string;
  siteTitle: string;
  socialLinks: NavSocialLink[];
  trendingTitle?: string;
  navConfig: NavConfig;
}

// Approximate width of the nested submenu panel (matches `min-w-[220px]`
// applied below). Used to decide whether to flip the fly-out to the left.
const NESTED_SUBMENU_WIDTH = 240;

/**
 * Recursive submenu item for the desktop nav. Top-level dropdown drops
 * down from the parent; deeper levels fly out to the right — unless the
 * parent sits too close to the viewport's right edge, in which case the
 * fly-out flips to the left so it doesn't get clipped.
 */
function DesktopSubmenuItem({ item, bg }: { item: MenuItem; bg: string }) {
  const hasChildren = !!item.submenu && item.submenu.length > 0;
  const isExternal = item.targetWindow === "_blank";
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [openLeft, setOpenLeft] = useState(false);

  // Measure on hover instead of on mount because hover is the only time
  // the user perceives the position. Re-measure each time — accounts for
  // window resize, devtools open/close, sticky nav scroll offset, etc.
  function handleEnter() {
    const el = triggerRef.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    setOpenLeft(rect.right + NESTED_SUBMENU_WIDTH > window.innerWidth);
  }

  if (hasChildren) {
    return (
      <div
        className="relative group/sub"
        onMouseEnter={handleEnter}
        onFocus={handleEnter}
      >
        <span
          ref={triggerRef}
          className="flex items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] transition cursor-default select-none"
        >
          {item.label}
          <ChevronRight className="w-3 h-3" />
        </span>
        <div
          className={`absolute top-0 ${
            openLeft ? "right-full" : "left-full"
          } opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all z-50`}
        >
          <div
            className="border border-gray-200 shadow-xl py-2 min-w-[220px]"
            style={{ backgroundColor: bg }}
          >
            {item.submenu!.map((sub, si) => (
              <DesktopSubmenuItem key={si} item={sub} bg={bg} />
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
  hoverColor,
  currentSearch,
}: {
  item: MenuItem;
  depth?: number;
  /** Hover/active colour from the nav config (active page uses this). */
  hoverColor: string;
  /** Current URL query string (no leading "?") for query-route matching. */
  currentSearch: string;
}) {
  const [open, setOpen] = useState(false);
  const hasSub = !!item.submenu && item.submenu.length > 0;
  const isExternal = item.targetWindow === "_blank";
  const indent = depth === 0 ? "" : depth === 1 ? "pl-4" : "pl-8";
  const pathname = usePathname();
  const active = isActiveNavLink(pathname || "/", currentSearch, item.link);

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
              <MobileMenuItem key={si} item={sub} depth={depth + 1} hoverColor={hoverColor} currentSearch={currentSearch} />
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
      aria-current={active ? "page" : undefined}
      className={`block py-2.5 text-sm font-bold uppercase tracking-wider ${indent} border-b border-gray-100 last:border-0 ${
        active ? "" : "text-gray-700"
      }`}
      style={active ? { color: hoverColor } : undefined}
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
  // Dropdown background from admin config (navbarDropdownBg), else white.
  const dropdownBg = ns.dropdownBg || "#ffffff";
  // Resolved colors with sane fallbacks for the blog template's defaults.
  const itemColor = ns.itemColor || "#374151";
  const hoverColor = ns.hoverColor || "var(--primary)";
  const underlineColor = ns.underlineColor || hoverColor;

  // Highlight the menu item for the page the visitor is currently on, using the
  // hover colour. Internal links only (external links are never "active").
  const pathname = usePathname();
  // Current URL query string (no leading "?"). Read from the live URL rather
  // than useSearchParams() — the latter must live inside a <Suspense> boundary
  // and would break the static-export build from this always-mounted nav. Nav
  // links are plain <a> (full page loads), so the nav remounts with a fresh
  // URL on every navigation and this stays correct.
  const [search, setSearch] = useState<string>(() =>
    typeof window !== "undefined"
      ? window.location.search.replace(/^\?/, "")
      : "",
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearch(window.location.search.replace(/^\?/, ""));
    }
  }, [pathname]);

  const isActiveLink = (link?: string) =>
    isActiveNavLink(pathname || "/", search, link);
  // A parent (dropdown) entry is "active" when one of its descendant pages is.
  const itemActive = (item: MenuItem): boolean =>
    isActiveLink(item.link) || (item.submenu?.some(itemActive) ?? false);
  const navItemFontSize = ns.fontSizePx ? `${ns.fontSizePx}px` : undefined;

  // Cap the visible navbar at 7 top-level entries (6 originals + a synthetic
  // "More" trigger when there's overflow). Shared with the other 5 template
  // navs so every template behaves the same.
  const displayMenuItems: MenuItem[] = withMoreDropdown(menuItems);
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
              {socialLinks.slice(0, 5).map((s, i) => {
                // Official brand glyph (react-icons), white to match the dark
                // utility bar — no dependency on /icons/*.svg (those 403 live).
                const { Icon, label } = socialBrand(s.platform || s.icon);
                return (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="opacity-90 hover:opacity-100 transition"
                  >
                    <Icon className="w-[13px] h-[13px] text-white" aria-hidden />
                  </a>
                );
              })}
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
                    // Parent with submenu: pure dropdown trigger, no nav. Shows
                    // the active state when one of its pages is the current one.
                    (() => {
                      const active = itemActive(item);
                      return (
                        <span
                          className="relative text-[12px] font-bold uppercase tracking-[0.15em] transition flex items-center gap-1 cursor-default select-none"
                          style={{
                            color: active ? hoverColor : itemColor,
                            fontSize: navItemFontSize,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = hoverColor)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = active
                              ? hoverColor
                              : itemColor)
                          }
                        >
                          {item.label}
                          <ChevronDown className="w-3 h-3" />
                          {ns.showUnderline && (
                            <span
                              aria-hidden
                              className={`absolute left-0 -bottom-1 h-[2px] transition-all duration-300 ${
                                active ? "w-full" : "w-0 group-hover:w-full"
                              }`}
                              style={{ backgroundColor: underlineColor }}
                            />
                          )}
                        </span>
                      );
                    })()
                  ) : (
                    (() => {
                      const active = isActiveLink(item.link);
                      return (
                        <a
                          href={item.link || "#"}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          aria-current={active ? "page" : undefined}
                          className="relative text-[12px] font-bold uppercase tracking-[0.15em] transition flex items-center gap-1"
                          // Active page uses the hover colour.
                          style={{
                            color: active ? hoverColor : itemColor,
                            fontSize: navItemFontSize,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = hoverColor)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = active
                              ? hoverColor
                              : itemColor)
                          }
                        >
                          {item.label}
                          {ns.showUnderline && (
                            <span
                              aria-hidden
                              className={`absolute left-0 -bottom-1 h-[2px] transition-all duration-300 ${
                                active ? "w-full" : "w-0 group-hover:w-full"
                              }`}
                              style={{ backgroundColor: underlineColor }}
                            />
                          )}
                        </a>
                      );
                    })()
                  )}
                  {hasSub && (
                    <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div
                        className="border border-gray-200 shadow-xl py-2 min-w-[220px]"
                        style={{ backgroundColor: dropdownBg }}
                      >
                        {item.submenu!.map((sub, si) => (
                          <DesktopSubmenuItem key={si} item={sub} bg={dropdownBg} />
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
              <MobileMenuItem key={i} item={item} hoverColor={hoverColor} currentSearch={search} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
