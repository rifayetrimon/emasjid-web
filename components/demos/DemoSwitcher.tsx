"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, Layout } from "lucide-react";

const DEMOS = [
  { num: 1, label: "Classic Portal", path: "/" },
  { num: 2, label: "Editorial Magazine", path: "/demo2" },
  { num: 3, label: "Modern Glass", path: "/demo3" },
  { num: 4, label: "Bento Dashboard", path: "/demo4" },
  { num: 5, label: "Heritage Style", path: "/demo5" },
  { num: 6, label: "Brutalist Swiss", path: "/demo6" },
  { num: 7, label: "Soft Pastel", path: "/demo7" },
  { num: 8, label: "Dark Cinematic", path: "/demo8" },
  { num: 9, label: "Sidebar Docs", path: "/demo9" },
];

export default function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const current = DEMOS.find((d) => d.path === pathname) || DEMOS[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-[200]">
      <div className="relative">
        {open && (
          <div className="absolute bottom-full mb-3 right-0 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
              Switch Demo Template
            </div>
            <div className="py-1 max-h-[60vh] overflow-y-auto">
              {DEMOS.map((d) => {
                const active = d.path === pathname;
                return (
                  <Link
                    key={d.num}
                    href={d.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      active ? "bg-gray-900/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${
                        active
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {d.num}
                    </span>
                    <div className="flex-1">
                      <div className="text-gray-900 font-semibold">
                        Demo {d.num}
                      </div>
                      <div className="text-xs text-gray-500">{d.label}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-full shadow-2xl transition-all"
        >
          <Layout className="w-4 h-4" />
          <span className="text-sm font-semibold">Demo {current.num}</span>
          <ChevronUp
            className={`w-4 h-4 transition-transform ${
              open ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
