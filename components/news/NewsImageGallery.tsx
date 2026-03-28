"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
}

type ViewMode = "slide" | "grid" | "full";

interface Props {
  images: GalleryImage[];
  defaultMode?: ViewMode;
}

export default function NewsImageGallery({ images, defaultMode }: Props) {
  const viewMode = defaultMode || (images.length > 1 ? "slide" : "full");
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div>

      {/* Slide View */}
      {viewMode === "slide" && (
        <div className="relative">
          <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden bg-gray-100">
            {images.map((img, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: index === currentIndex ? 1 : 0 }}
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

            {/* Image counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors text-xl"
              >
                &#8249;
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors text-xl"
              >
                &#8250;
              </button>

              {/* Thumbnail strip */}
              <div className="flex justify-center gap-2 mt-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-14 h-10 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-[var(--primary)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-90"
                    }`}
                  >
                    <Image src={img.src} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            </>
          )}
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
