"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "@/components/ui/FallbackImage";
import { MenuItem, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronDown, Search } from "lucide-react";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  socialLinks: NavSocialLink[];
  trendingTitle?: string;
}

export default function Blog2Nav({
  menuItems,
  logo,
  socialLinks,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
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

      {/* Main nav */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-1 flex-shrink-0">
            {logo ? (
              <Image
                src={logo}
                alt="Logo"
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  news
                </span>
                <span
                  className="text-3xl font-extrabold text-white tracking-tight px-1.5 rounded"
                  style={{ background: "var(--primary)" }}
                >
                  12
                </span>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  paper
                </span>
              </div>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {menuItems.map((item, i) => {
              const isExternal = item.targetWindow === "_blank";
              return (
                <div key={i} className="relative group">
                  <a
                    href={item.link || "#"}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-[12px] font-bold uppercase tracking-[0.15em] text-gray-700 hover:text-[var(--primary)] transition flex items-center gap-1"
                  >
                    {item.label}
                    {item.submenu && item.submenu.length > 0 && (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </a>
                  {item.submenu && item.submenu.length > 0 && (
                    <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="bg-white border border-gray-200 shadow-xl py-2 min-w-[220px]">
                        {item.submenu.map((sub, si) => {
                          const subExternal = sub.targetWindow === "_blank";
                          return (
                            <a
                              key={si}
                              href={sub.link}
                              target={subExternal ? "_blank" : undefined}
                              rel={subExternal ? "noopener noreferrer" : undefined}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] transition"
                            >
                              {sub.label}
                            </a>
                          );
                        })}
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
            {menuItems.map((item, i) => {
              const hasSub = item.submenu && item.submenu.length > 0;
              const isExternal = item.targetWindow === "_blank";
              return (
                <div key={i} className="border-b border-gray-100 last:border-0">
                  {hasSub ? (
                    <>
                      <button
                        onClick={() => setOpenSub(openSub === i ? null : i)}
                        className="w-full flex items-center justify-between py-3 text-sm font-bold uppercase tracking-wider text-gray-700"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openSub === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSub === i && (
                        <div className="pb-2 pl-4 space-y-2">
                          {item.submenu!.map((sub, si) => {
                            const subExternal = sub.targetWindow === "_blank";
                            return (
                              <a
                                key={si}
                                href={sub.link}
                                target={subExternal ? "_blank" : undefined}
                                rel={subExternal ? "noopener noreferrer" : undefined}
                                className="block text-sm text-gray-600 hover:text-[var(--primary)]"
                              >
                                {sub.label}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.link || "#"}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="block py-3 text-sm font-bold uppercase tracking-wider text-gray-700"
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
