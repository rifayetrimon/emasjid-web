"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { MenuItem, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronDown } from "lucide-react";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  socialLinks: NavSocialLink[];
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 12"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 6 L20 6 M40 6 L60 6"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M30 1 L33 6 L30 11 L27 6 Z"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="22" cy="6" r="1" fill="currentColor" />
      <circle cx="38" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

export default function Demo5Nav({ menuItems, logo, socialLinks }: Props) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);

  return (
    <header className="bg-[#fdfaf3] border-b border-[#d4b88a]/30 relative z-50">
      <div className="bg-[#0c3d3c] text-[#e8d5a8] text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center gap-4">
          <Ornament className="w-12 h-3 text-[#e8d5a8]/60" />
          <span className="tracking-[0.25em] uppercase">
            Bismillahirrahmanirrahim
          </span>
          <Ornament className="w-12 h-3 text-[#e8d5a8]/60" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/demo5" className="flex items-center gap-3">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={56}
              height={56}
              className="h-14 w-auto object-contain"
            />
          ) : (
            <span
              className="text-2xl font-bold text-[#0c3d3c]"
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              eMasjid
            </span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {menuItems.map((item, i) => (
            <div key={i} className="relative group">
              <a
                href={item.link || "#"}
                className="px-4 py-2 text-sm font-medium text-[#0c3d3c] hover:text-[#a47133] transition-colors flex items-center gap-1"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                {item.label}
                {item.submenu && item.submenu.length > 0 && (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </a>
              {item.submenu && item.submenu.length > 0 && (
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                  <div className="bg-[#fdfaf3] border-2 border-[#d4b88a] py-2 min-w-[220px] shadow-xl">
                    {item.submenu.map((sub, si) => (
                      <a
                        key={si}
                        href={sub.link}
                        className="block px-4 py-2 text-sm text-[#0c3d3c] hover:bg-[#f5e9d0] hover:text-[#a47133] transition"
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
          {socialLinks.slice(0, 4).map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="w-9 h-9 rounded-full border border-[#d4b88a] bg-[#f5e9d0] hover:bg-[#e8d5a8] flex items-center justify-center transition"
            >
              <Image src={s.icon} alt={s.platform} width={14} height={14} />
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-[#0c3d3c]"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex justify-center pb-3">
        <Ornament className="w-16 h-3 text-[#a47133]/50" />
      </div>

      {open && (
        <div className="lg:hidden border-t-2 border-[#d4b88a] bg-[#fdfaf3]">
          <nav className="px-5 py-4 space-y-1">
            {menuItems.map((item, i) => {
              const hasSub = item.submenu && item.submenu.length > 0;
              return (
                <div
                  key={i}
                  className="border-b border-[#d4b88a]/30 last:border-0"
                >
                  {hasSub ? (
                    <>
                      <button
                        onClick={() => setOpenSub(openSub === i ? null : i)}
                        className="w-full flex items-center justify-between py-3 text-sm font-medium text-[#0c3d3c]"
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
                              className="block text-sm text-[#0c3d3c]/80 hover:text-[#a47133]"
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
                      className="block py-3 text-sm font-medium text-[#0c3d3c]"
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
