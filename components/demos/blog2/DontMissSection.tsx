"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { categoryFor, colorForCategoryName } from "@/lib/blog2Categories";

interface NewsItem {
  contentId: string;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
  /** Optional admin-supplied category (e.g. "NEWS", "SPORTS", "Akademik"). */
  category?: string;
}

interface Props {
  items: NewsItem[];
  excludeIds: string[];
  /**
   * Hard override for tabs. Leave empty to auto-derive from each item's
   * `category` field (admin-driven). The first tab is always the "all" filter.
   */
  tabs?: string[];
  /** Label for the "all news" tab. Defaults to "Semua" (ms). */
  allLabel?: string;
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

function resolveLabel(item: NewsItem): string {
  if (item.category && item.category.trim()) return item.category;
  return categoryFor(item.contentId).label;
}

function resolveColor(item: NewsItem): string {
  // Admin-supplied category → stable color across all cards.
  if (item.category && item.category.trim()) {
    return colorForCategoryName(item.category);
  }
  // No category from admin → deterministic per contentId.
  return categoryFor(item.contentId).color;
}

export default function DontMissSection({
  items,
  excludeIds,
  tabs: tabsProp,
  allLabel = "Semua",
}: Props) {
  const tabs = useMemo(() => {
    if (tabsProp && tabsProp.length > 0) return tabsProp;
    // Auto-derive from admin-provided categories on each news item.
    // "All" tab is always first; remaining tabs are unique categories
    // ordered by how often they appear (most common first).
    const counts = new Map<string, number>();
    for (const i of items) {
      const label = resolveLabel(i);
      if (!label) continue;
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    const ordered = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label]) => label);
    return [allLabel, ...ordered];
  }, [tabsProp, items, allLabel]);

  const [active, setActive] = useState(tabs[0]);

  const excludeSet = new Set(excludeIds);
  const available = items.filter((i) => !excludeSet.has(i.contentId));

  const filtered =
    active === tabs[0]
      ? available
      : available.filter((i) => resolveLabel(i).toLowerCase() === active.toLowerCase());

  const featured = filtered[0];
  const list = filtered.slice(1, 5);

  return (
    <>
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
                  const label = resolveLabel(featured);
                  const color = resolveColor(featured);
                  return (
                    <span className="absolute top-3 left-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${color}`}
                      >
                        {label}
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
