"use client";

import { useState } from "react";
import Link from "next/link";
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top utility bar — dark with date and meta */}
      <div className="bg-[#1a1a1a] text-white text-[11px]">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-white/80">{today}</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="#" className="text-white/70 hover:text-[var(--primary)] transition">
              Sign in / Join
            </Link>
            <span className="text-white/20">·</span>
            <Link href="#newsletter" className="text-white/70 hover:text-[var(--primary)] transition">
              Newsletter
            </Link>
            <span className="text-white/20">·</span>
            <Link href="#contact" className="text-white/70 hover:text-[var(--primary)] transition">
              Contact
            </Link>
            {socialLinks.length > 0 && (
              <>
                <span className="text-white/20">·</span>
                <div className="flex items-center gap-2">
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
                        width={11}
                        height={11}
                        className="brightness-0 invert"
                      />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
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
            {menuItems.map((item, i) => (
              <div key={i} className="relative group">
                <a
                  href={item.link || "#"}
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
                      {item.submenu.map((sub, si) => (
                        <a
                          key={si}
                          href={sub.link}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] transition"
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
            <button
              aria-label="Search"
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

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
                          {item.submenu!.map((sub, si) => (
                            <a
                              key={si}
                              href={sub.link}
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
