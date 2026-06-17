"use client";

import { useEffect, useState } from "react";
import Image from "@/components/ui/FallbackImage";
import type { NewsImage, NewsPosDisplay } from "@/types/cms";

interface Props {
  images: NewsImage[];
  /** Admin-supplied layout hint per item. Defaults to "full". */
  mode?: NewsPosDisplay;
  /** Slide interval in ms (only used when mode === "slide"). */
  interval?: number;
  /** Override the default aspect ratio for grid/slide containers. */
  aspect?: string;
  /** Forwarded to Next/Image for responsive sizing. */
  sizes?: string;
  /** Tailwind class applied to image objects. Defaults to object-cover. */
  fit?: "cover" | "contain";
  /**
   * When true, every image is shown at its OWN natural aspect ratio (measured
   * at runtime) — full image, no cropping, no letterbox bars — stacked
   * vertically. Used on the news-detail and static content pages so the
   * uploaded images render exactly as they are. Overrides grid/slide modes.
   */
  naturalAspect?: boolean;
}

/**
 * Renders a news / static-content item's image set per the admin-supplied
 * posDisplay setting. Designed to be self-contained — the parent doesn't
 * need to set an aspect-ratio container.
 *
 * Modes:
 *  - grid: 1=full, 2=2-col, 3=1 big left + 2 stacked right
 *  - slide: auto-rotating carousel with circle indicator dots
 *  - sidebar: compact 4:3 thumbnail of the first image
 *  - full (default): images stacked vertically
 */
export default function MediaLayout({
  images,
  mode = "full",
  interval = 3500,
  aspect,
  sizes = "(max-width:1024px) 100vw, 800px",
  fit = "cover",
  naturalAspect = false,
}: Props) {
  const visible = images.filter((img) => !!img?.src).slice(0, 3);
  if (visible.length === 0) return null;

  // Show every image at its true aspect ratio (full image, no crop). Overrides
  // the grid/slide modes — used on content detail pages.
  if (naturalAspect) {
    return (
      <div className="space-y-4">
        {visible.map((img, i) => (
          <NaturalFrame key={i} img={img} sizes={sizes} />
        ))}
      </div>
    );
  }

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const aspectClass = aspect || "aspect-[16/9]";

  // Mode coercion:
  //  - "sidebar" → "slide" (auto-rotating carousel with circle dots, same
  //    as the news detail page). Admin uses "sidebar" to mean "compact",
  //    but in single-image cards a slider with a single image just shows
  //    that image; with multiple, it gets auto-rotation.
  //  - "full" + aspect + multiple images → "slide" so cards keep a fixed
  //    height instead of stacking N images vertically.
  let effectiveMode: NewsPosDisplay = mode;
  if (effectiveMode === "sidebar") effectiveMode = "slide";
  if (
    aspect &&
    effectiveMode === "full" &&
    visible.length > 1
  ) {
    effectiveMode = "slide";
  }

  if (effectiveMode === "grid") return <GridLayout images={visible} fit={fitClass} sizes={sizes} aspect={aspectClass} />;
  if (effectiveMode === "slide") return <SlideLayout images={visible} fit={fitClass} sizes={sizes} aspect={aspectClass} interval={interval} />;
  return <FullLayout images={visible} fit={fitClass} sizes={sizes} aspect={aspectClass} />;
}

interface ChildProps {
  images: NewsImage[];
  fit: string;
  sizes: string;
  aspect: string;
}

function GridLayout({ images, fit, sizes, aspect }: ChildProps) {
  // Single image → full-width, full-aspect frame
  if (images.length === 1) {
    return (
      <div className={`relative w-full overflow-hidden bg-gray-100 rounded-lg ${aspect}`}>
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          className={fit}
          sizes={sizes}
        />
      </div>
    );
  }

  // 2 images → 2-column grid, each square
  if (images.length === 2) {
    return (
      <div className={`grid grid-cols-2 gap-2 w-full ${aspect}`}>
        {images.map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-gray-100 rounded-lg"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className={fit}
              sizes={sizes}
            />
          </div>
        ))}
      </div>
    );
  }

  // 3 images → 1 big on the left, 2 stacked on the right
  return (
    <div className={`grid grid-cols-2 gap-2 w-full ${aspect}`}>
      <div className="relative overflow-hidden bg-gray-100 rounded-lg">
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          className={fit}
          sizes={sizes}
        />
      </div>
      <div className="grid grid-rows-2 gap-2">
        {images.slice(1, 3).map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-gray-100 rounded-lg"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className={fit}
              sizes={sizes}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideLayout({
  images,
  fit,
  sizes,
  aspect,
  interval,
}: ChildProps & { interval: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images.length, paused, interval]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-gray-100 rounded-lg ${aspect}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
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
            className={fit}
            sizes={sizes}
            priority={i === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Tunjuk gambar ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all shadow-md ring-1 ring-white/70 ${
                i === index
                  ? "w-3.5 h-3.5 bg-white"
                  : "w-3 h-3 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * A single image rendered at its own natural aspect ratio (measured at
 * runtime) — full image, edge-to-edge width, no cropping or letterbox bars.
 */
function NaturalFrame({ img, sizes }: { img: NewsImage; sizes: string }) {
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !img.src) return;
    const probe = new window.Image();
    probe.onload = () => {
      if (probe.naturalWidth && probe.naturalHeight) {
        setRatio(probe.naturalWidth / probe.naturalHeight);
      }
    };
    probe.src = img.src;
  }, [img.src]);

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-100 rounded-lg"
      style={{ aspectRatio: ratio ?? 16 / 9 }}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority
      />
    </div>
  );
}

function FullLayout({ images, fit, sizes, aspect }: ChildProps) {
  return (
    <div className="space-y-4">
      {images.map((img, i) => (
        <div
          key={i}
          className={`relative w-full overflow-hidden bg-gray-100 rounded-lg ${aspect}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className={fit}
            sizes={sizes}
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}

