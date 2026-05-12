"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { categoryFor } from "@/lib/blog2Categories";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

interface Props {
  items: NewsItem[];
  excludeIds: number[];
  tabs: string[];
}

function formatDate(d: string): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

export default function DontMissSection({
  items,
  excludeIds,
  tabs,
}: Props) {
  const [active, setActive] = useState(tabs[0]);

  const excludeSet = new Set(excludeIds);
  const available = items.filter((i) => !excludeSet.has(i.contentId));

  const filtered =
    active === tabs[0]
      ? available
      : available.filter((i) => categoryFor(i.contentId).label === active);

  const featured = filtered[0];
  const list = filtered.slice(1, 5);

  return (
    <>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 -mt-2">
        {tabs.map((t) => {
          const isActive = active === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              className={`text-[11px] uppercase tracking-wider font-bold px-3 py-1 transition ${
                isActive
                  ? "bg-[var(--primary)] text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">
          Tiada berita dalam kategori ini.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured card */}
          {featured && (
            <Link href={`/news/${featured.contentId}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-3">
                {featured.file1 && (
                  <Image
                    src={featured.file1}
                    alt={featured.altImg1 || featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                )}
                {(() => {
                  const c = categoryFor(featured.contentId);
                  return (
                    <span className="absolute top-3 left-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${c.color}`}
                      >
                        {c.label}
                      </span>
                    </span>
                  );
                })()}
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                {featured.title}
              </h3>
              <p className="text-[10px] text-gray-500 mt-1">
                {formatDate(featured.date)}
              </p>
            </Link>
          )}
          {/* Right list */}
          <div className="space-y-4">
            {list.map((item) => (
              <Link
                key={item.contentId}
                href={`/news/${item.contentId}`}
                className="group flex gap-3"
              >
                <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                  {item.file1 && (
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {formatDate(item.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
