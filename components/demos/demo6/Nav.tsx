"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { MenuItem, NavSocialLink } from "@/types/cms";
import { Menu, X } from "lucide-react";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  socialLinks: NavSocialLink[];
}

export default function Demo6Nav({ menuItems, logo, socialLinks }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b-[3px] border-black bg-white sticky top-0 z-50">
      {/* Ticker */}
      <div className="border-b border-black overflow-hidden bg-black text-white">
        <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap py-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="px-6 text-[11px] font-mono uppercase tracking-[0.2em] flex items-center gap-6"
            >
              eMasjid · Edisi {new Date().getFullYear()}
              <span className="text-yellow-400">●</span>
              Siaran Langsung
              <span className="text-yellow-400">●</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch">
        <Link
          href="/demo6"
          className="col-span-3 lg:col-span-2 border-r-[3px] border-black flex items-center justify-center px-4 py-4"
        >
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={48}
              height={48}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="font-black text-xl tracking-tighter">eMasjid</span>
          )}
        </Link>

        <nav className="hidden lg:flex col-span-8 items-stretch">
          {menuItems.slice(0, 6).map((item, i) => (
            <a
              key={i}
              href={item.link || "#"}
              className="flex-1 flex items-center justify-center text-[11px] font-mono uppercase tracking-[0.2em] font-bold border-r border-black hover:bg-yellow-400 transition-colors px-3"
            >
              <span className="text-gray-500 mr-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex col-span-2 items-center justify-center gap-2 px-3">
          {socialLinks.slice(0, 3).map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black transition-colors group"
            >
              <Image
                src={s.icon}
                alt={s.platform}
                width={14}
                height={14}
                className="group-hover:invert"
              />
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden col-span-9 flex items-center justify-end px-4 py-4"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t-[3px] border-black bg-white">
          <nav className="divide-y divide-black">
            {menuItems.map((item, i) => (
              <a
                key={i}
                href={item.link || "#"}
                className="flex items-center gap-4 px-5 py-4 text-sm font-mono uppercase tracking-wider font-bold hover:bg-yellow-400"
              >
                <span className="text-gray-400 text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </header>
  );
}
