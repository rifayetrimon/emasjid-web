"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { MenuItem, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronDown } from "lucide-react";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  socialLinks: NavSocialLink[];
}

export default function Demo3Nav({ menuItems, logo, socialLinks }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 left-4 right-4 md:left-6 md:right-6 z-50">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border border-white/40"
            : "bg-white/20 backdrop-blur-md border border-white/30"
        }`}
      >
        <div className="px-5 md:px-7 py-3 flex items-center justify-between">
          <Link href="/demo3" className="flex items-center gap-2">
            {logo ? (
              <Image
                src={logo}
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className={`font-bold text-lg ${scrolled ? "text-gray-900" : "text-white"}`}>
                eMasjid
              </span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, i) => (
              <div key={i} className="relative group">
                <a
                  href={item.link || "#"}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  {item.label}
                  {item.submenu && item.submenu.length > 0 && (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </a>
                {item.submenu && item.submenu.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl py-2 min-w-[220px]">
                      {item.submenu.map((sub, si) => (
                        <a
                          key={si}
                          href={sub.link}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition mx-2 rounded-lg"
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
            {socialLinks.slice(0, 3).map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  scrolled
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <Image
                  src={s.icon}
                  alt={s.platform}
                  width={16}
                  height={16}
                  className={scrolled ? "" : "invert"}
                />
              </a>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-full ${scrolled ? "text-gray-900" : "text-white"}`}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-white/30 bg-white/95 backdrop-blur-xl rounded-b-2xl">
            <nav className="px-5 py-4 space-y-1">
              {menuItems.map((item, i) => {
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
                        className="block py-2.5 text-sm font-medium text-gray-800 hover:text-[var(--primary)]"
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                );
              })}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Image src={s.icon} alt={s.platform} width={16} height={16} />
                  </a>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
