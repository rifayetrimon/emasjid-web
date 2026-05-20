"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/ui/FallbackImage";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
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

/**
 * Demo7-styled gallery. Pastel pill chip header, rounded image tiles with
 * soft shadows, click-to-open lightbox. Section is hidden entirely when
 * the API returns no images. Renders exactly `items.length` tiles — no
 * placeholder padding.
 */
export default function Demo7GallerySection({
  initial,
  title = "Galeri",
}: Props) {
  const [data, setData] = useState<GalleryPagePayload>(initial);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const pages = useMemo<(number | "...")[]>(() => {
    const total = data.totalPages;
    const current = data.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const result: (number | "...")[] = [1];
    if (current > 3) result.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let p = start; p <= end; p++) result.push(p);
    if (current < total - 2) result.push("...");
    if (total > 1) result.push(total);
    return result;
  }, [data.totalPages, data.currentPage]);

  async function load(page: number) {
    if (page === data.currentPage || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?page=${page}&perPage=${PER_PAGE}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const next = (await res.json()) as GalleryPagePayload;
        setData(next);
      }
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

  if (data.items.length === 0) return null;

  return (
    <section className="relative py-20 px-6">
      <div className="absolute top-20 -left-32 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--primary)]/20 text-xs uppercase tracking-[0.2em] font-bold text-[var(--primary)] mb-4 shadow-sm">
            <Camera className="w-3.5 h-3.5" />
            Galeri
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
        </div>

        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 transition-opacity ${
            loading ? "opacity-60" : "opacity-100"
          }`}
        >
          {data.items.map((item) => (
            <button
              type="button"
              key={item.galleryId}
              onClick={() => setLightbox(item)}
              className="group relative block aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50 border-2 border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <Image
                src={item.file}
                alt={item.title || "Galeri"}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
                <span className="text-white text-xs font-bold line-clamp-2 text-left drop-shadow">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {data.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={data.currentPage <= 1 || loading}
              onClick={() => load(data.currentPage - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((p, i) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-6 h-10 flex items-center justify-center text-xs text-gray-400 select-none"
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
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold tabular-nums transition shadow-sm ${
                    isActive
                      ? "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
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
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

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
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl"
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
              className="w-full h-auto max-h-[85vh] object-contain rounded-3xl"
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
