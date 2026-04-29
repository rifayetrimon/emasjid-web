"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { MenuItem, NavSocialLink } from "@/types/cms";
import { Menu, X, ChevronRight } from "lucide-react";

interface Props {
  menuItems: MenuItem[];
  logo: string;
  socialLinks: NavSocialLink[];
  email: string;
  phone: string;
}

export default function Demo9Sidebar({
  menuItems,
  logo,
  socialLinks,
  email,
  phone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(0);

  const sidebarContent = (
    <>
      <Link href="/demo9" className="flex items-center gap-2.5 px-6 pt-7 pb-6">
        {logo ? (
          <Image
            src={logo}
            alt="Logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
          />
        ) : (
          <span className="font-bold text-lg text-gray-900">eMasjid</span>
        )}
        <span className="text-xs text-gray-400 font-mono mt-1">v2.0</span>
      </Link>

      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100/70">
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            placeholder="Cari…"
            className="bg-transparent outline-none text-sm placeholder-gray-400 flex-1 min-w-0"
          />
          <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 font-mono">
            ⌘K
          </span>
        </div>
      </div>

      <nav className="px-3 flex-1 overflow-y-auto pb-4 space-y-0.5">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-3 pt-3 pb-1.5">
          Navigasi
        </p>
        {menuItems.map((item, i) => {
          const hasSub = item.submenu && item.submenu.length > 0;
          const isExpanded = openSub === i;
          return (
            <div key={i}>
              {hasSub ? (
                <button
                  onClick={() => setOpenSub(isExpanded ? null : i)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100/70 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    {item.label}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>
              ) : (
                <a
                  href={item.link || "#"}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100/70 transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  {item.label}
                </a>
              )}
              {hasSub && isExpanded && (
                <div className="ml-5 my-1 pl-3 border-l border-gray-200 space-y-0.5">
                  {item.submenu!.map((sub, si) => (
                    <a
                      key={si}
                      href={sub.link}
                      className="block px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 transition"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-3 pt-5 pb-1.5">
          Hubungi
        </p>
        {phone && (
          <a
            href={`tel:${phone}`}
            className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100/70 truncate"
          >
            {phone}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100/70 truncate"
          >
            {email}
          </a>
        )}
      </nav>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex gap-1">
          {socialLinks.slice(0, 4).map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition"
            >
              <Image src={s.icon} alt={s.platform} width={13} height={13} />
            </a>
          ))}
        </div>
        <span className="text-[10px] text-gray-400 font-mono">
          © {new Date().getFullYear()}
        </span>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <Link href="/demo9" className="flex items-center gap-2">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-bold text-gray-900">eMasjid</span>
          )}
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex flex-col bg-white w-72 max-w-[85vw] h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
