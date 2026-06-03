"use client";

import { useEffect, useState } from "react";
import Image from "@/components/ui/FallbackImage";
import type { NewsImage } from "@/types/cms";

interface Props {
  images: NewsImage[];
  /** Auto-cycle interval (ms). Default 3500ms. */
  interval?: number;
  /** Forwarded to Next/Image for responsive sizing. */
  sizes?: string;
  /** Whether the first image should preload with priority. */
  priority?: boolean;
  className?: string;
  /** Cover (default) vs contain. */
  fit?: "cover" | "contain";
}

/**
 * Auto-rotating image carousel for compact news cards on the home page.
 * Renders nothing if `images` is empty. Skips auto-rotation if there is
 * only one image. No manual controls — the card is typically wrapped in
 * a Link, so any click would race with the carousel buttons.
 */
export default function NewsCardCarousel({
  images,
  interval = 3500,
  sizes,
  priority = false,
  className = "object-cover",
  fit = "cover",
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  const fitClass = fit === "contain" ? "object-contain" : className;

  return (
    <>
      {images.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className={fitClass}
            sizes={sizes}
            priority={priority && i === 0}
          />
        </div>
      ))}
    </>
  );
}
