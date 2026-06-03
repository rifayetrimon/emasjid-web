"use client";

import { useEffect, useState } from "react";
import Image from "@/components/ui/FallbackImage";

interface GalleryImage {
  src: string;
  alt: string;
}

type ViewMode = "slide" | "grid" | "full";

interface Props {
  images: GalleryImage[];
  defaultMode?: ViewMode;
  /** Auto-rotate interval in ms for slide mode. Default 4500ms. */
  interval?: number;
}

export default function NewsImageGallery({
  images,
  defaultMode,
  interval = 3000,
}: Props) {
  const viewMode = defaultMode || (images.length > 1 ? "slide" : "full");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-rotate slide mode unless paused (hover/focus).
  useEffect(() => {
    if (viewMode !== "slide" || images.length <= 1 || paused) return;
    const t = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [viewMode, images.length, interval, paused]);

  if (images.length === 0) return null;

  return (
    <div>
      {/* Slide View */}
      {viewMode === "slide" && (
        <div className="relative">
          <div
            className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden bg-gray-100"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: index === currentIndex ? 1 : 0 }}
                aria-hidden={index !== currentIndex}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            ))}

            {/* Circle indicator dots — centered below middle of the image */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
                {images.map((_, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Tunjuk gambar ${index + 1}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setCurrentIndex(index)}
                      className={`rounded-full transition-all shadow-md ring-1 ring-white/70 ${
                        isActive
                          ? "w-3.5 h-3.5 bg-white"
                          : "w-3 h-3 bg-white/45 hover:bg-white/70"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div
          className={`grid gap-3 ${
            images.length === 1
              ? "grid-cols-1"
              : images.length === 2
              ? "grid-cols-2"
              : "grid-cols-2 md:grid-cols-3"
          }`}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="relative h-[200px] md:h-[280px] rounded-xl overflow-hidden group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {img.alt && (
                <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs px-3 py-2">
                  {img.alt}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full Image View */}
      {viewMode === "full" && (
        <div className="space-y-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative w-full rounded-xl overflow-hidden bg-gray-50"
            >
              <div className="relative w-full h-[300px] md:h-[500px]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
              {img.alt && (
                <p className="text-sm text-gray-500 text-center py-3 px-4 border-t border-gray-100">
                  {img.alt}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
