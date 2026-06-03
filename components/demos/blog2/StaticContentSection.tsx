"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaLayout from "@/components/news/MediaLayout";
import type { StaticContentItem } from "@/types/cms";

interface Props {
  items: StaticContentItem[];
  title?: string;
  /** Items per page. Default 4. */
  perPage?: number;
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

const AUTHOR = "Pentadbir";

export default function Blog2StaticContentSection({
  items,
  title = "Static Content",
  perPage = 4,
}: Props) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / perPage)),
    [items.length, perPage]
  );

  const visible = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  if (items.length === 0) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPagination = totalPages > 1;

  return (
    <div>
      <div className="mb-5 pb-2 border-b border-gray-200">
        <h2 className="inline-block text-sm md:text-base font-extrabold text-gray-900 uppercase tracking-wider border-b-4 border-emerald-500 pb-2 -mb-[10px]">
          {title}
        </h2>
      </div>

      <div
        className={`grid gap-6 ${
          visible.length === 1
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {visible.map((item) => (
          <article key={item.staticId} className="block">
            {item.images.length > 0 && (
              <div className="mb-3">
                <MediaLayout
                  images={item.images}
                  mode={item.posDisplay}
                  // Force a consistent slot height across every card so a
                  // 1-image item lines up with a 3-image grid item and
                  // an admin "sidebar" mode item doesn't render taller.
                  aspect="aspect-[16/9]"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
            )}
            {item.title && (
              <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                {item.title}
              </h3>
            )}
            {item.date && (
              <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                <span className="text-gray-700 font-bold">{AUTHOR}</span>
                <span>·</span>
                <span>{formatDate(item.date)}</span>
              </div>
            )}
            {item.message && (
              <div
                className="text-sm text-gray-700 leading-relaxed mt-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: item.message }}
              />
            )}
          </article>
        ))}
      </div>

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((p) => {
            const isActive = p === page;
            return (
              <button
                key={p}
                type="button"
                aria-label={`Halaman ${p}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold tabular-nums transition border ${
                  isActive
                    ? "bg-[var(--primary)] text-gray-900 border-[var(--primary)]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            aria-label="Halaman seterusnya"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
