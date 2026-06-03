"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/ui/FallbackImage";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import type { GalleryItem } from "@/types/cms";

interface GalleryPagePayload {
  items: GalleryItem[];
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

interface Props {
  initial: GalleryPagePayload;
  title?: string;
}

const PER_PAGE = 10;

export default function Blog2GallerySection({
  initial,
  title = "Galeri",
}: Props) {
  const [data, setData] = useState<GalleryPagePayload>(initial);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  // Windowed page strip — show 1, last, current ±1, ellipsis between gaps.
  // Keeps the strip readable even when the gallery grows to many pages.
  const pages = useMemo<(number | "...")[]>(() => {
    const total = data.totalPages;
    const current = data.currentPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const result: (number | "...")[] = [1];
    if (current > 3) result.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let p = start; p <= end; p++) result.push(p);
    if (current < total - 2) result.push("...");
    if (total > 1) result.push(total);
    return result;
  }, [data.totalPages, data.currentPage]);

  // Render exactly the items the API returned — no placeholder padding.
  // CSS grid handles incomplete trailing rows by leaving empty space.
  const slots = data.items;

  async function load(page: number) {
    if (page === data.currentPage || loading) return;
    setLoading(true);
    try {
      // `_t` is a per-click cache buster — defends against any intermediate
      // (browser memory, service worker, CDN) treating same-URL responses
      // as identical. The route itself is dynamic, but layered caches sit
      // in front of it on real deployments.
      const res = await fetch(
        `/api/gallery?page=${page}&perPage=${PER_PAGE}&_t=${Date.now()}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        // Surface upstream / route failures instead of silently swallowing
        // them — a 500 here used to leave the UI looking like "click did
        // nothing" because we just kept the old state.
        console.error(
          `Gallery page ${page} request failed`,
          res.status,
          res.statusText,
        );
        return;
      }
      const next = (await res.json()) as GalleryPagePayload;
      setData(next);
    } catch (err) {
      console.error("Gallery page load failed:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (lightbox) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightbox(null);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [lightbox]);

  // Hide entire gallery section when the API returns no images at all.
  if (data.items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 pb-12">
      <div className="mb-5 pb-2 border-b border-gray-200">
        <h2 className="inline-block text-sm md:text-base font-extrabold text-gray-900 uppercase tracking-wider border-b-4 border-[var(--primary)] pb-2 -mb-[10px]">
          {title}
        </h2>
      </div>

      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 transition-opacity ${
          loading ? "opacity-60" : "opacity-100"
        }`}
      >
        {slots.map((item) =>
          item.kind === "image" ? (
            <button
              type="button"
              key={item.galleryId}
              onClick={() => setLightbox(item)}
              className="group relative block aspect-square overflow-hidden bg-gray-100 border border-gray-200"
            >
              {/* `object-contain` so banner-shaped images (e.g. wide headers)
                  display fully instead of being cropped to a tiny center crop.
                  Gray surround acts as a neutral matte. */}
              <Image
                src={item.file}
                alt={item.title || "Galeri"}
                fill
                className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3 pointer-events-none">
                <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition line-clamp-2 text-left">
                  {item.title}
                </span>
              </div>
            </button>
          ) : (
            // Document slot — lightbox doesn't apply, opens in new tab.
            <a
              key={item.galleryId}
              href={item.file}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-3 p-4 text-center hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-10 h-10 text-[var(--primary)]" />
              <span className="text-xs font-bold text-gray-700 line-clamp-3 leading-snug">
                {item.title || "Dokumen"}
              </span>
            </a>
          ),
        )}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={data.currentPage <= 1 || loading}
            onClick={() => load(data.currentPage - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((p, i) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${i}`}
                  className="w-6 h-9 flex items-center justify-center text-xs text-gray-400 select-none"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }
            const isActive = p === data.currentPage;
            return (
              <button
                key={p}
                type="button"
                aria-label={`Halaman ${p}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => load(p)}
                disabled={loading}
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
            disabled={data.currentPage >= data.totalPages || loading}
            onClick={() => load(data.currentPage + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Tutup"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            ×
          </button>
          <div
            className="relative max-w-5xl w-full max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.file}
              alt={lightbox.title}
              width={1600}
              height={1200}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            {lightbox.title && (
              <p className="mt-3 text-center text-sm text-white/80">
                {lightbox.title}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
