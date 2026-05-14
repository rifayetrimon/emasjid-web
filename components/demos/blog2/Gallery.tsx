"use client";

import { useMemo, useState } from "react";
import Image from "@/components/ui/FallbackImage";
import type { GalleryCategory, GalleryItem } from "@/types/cms";

interface Props {
  items: GalleryItem[];
  categories: GalleryCategory[];
  title?: string;
  /** Max items to display per category (0 = unlimited). */
  maxDisplay?: number;
}

export default function Blog2Gallery({
  items,
  categories,
  title = "Galeri",
  maxDisplay = 0,
}: Props) {
  const [active, setActive] = useState<string>("");

  const allTabs = useMemo(() => {
    const names = new Set<string>();
    for (const c of categories) names.add(c.name);
    for (const i of items) {
      if (i.category) names.add(i.category);
    }
    return Array.from(names);
  }, [categories, items]);

  const filtered = useMemo(() => {
    const list = active
      ? items.filter(
          (i) => i.category.toLowerCase() === active.toLowerCase()
        )
      : items;
    return maxDisplay > 0 ? list.slice(0, maxDisplay) : list;
  }, [items, active, maxDisplay]);

  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 pb-12">
      <div className="mb-5 pb-2 border-b border-gray-200">
        <h2 className="inline-block text-sm md:text-base font-extrabold text-gray-900 uppercase tracking-wider border-b-4 border-[var(--primary)] pb-2 -mb-[10px]">
          {title}
        </h2>
      </div>

      {allTabs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() => setActive("")}
            className={`text-[11px] uppercase tracking-wider font-bold px-3 py-1 transition ${
              active === ""
                ? "bg-[var(--primary)] text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Semua
          </button>
          {allTabs.map((t) => {
            const isActive = active.toLowerCase() === t.toLowerCase();
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
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">
          Tiada gambar dalam kategori ini.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filtered.map((item) => (
            <button
              type="button"
              key={item.galleryId}
              onClick={() => setLightbox(item)}
              className="group relative block aspect-square overflow-hidden bg-gray-100"
            >
              <Image
                src={item.file}
                alt={item.title || "Galeri"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width:768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3">
                <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition line-clamp-2 text-left">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

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
