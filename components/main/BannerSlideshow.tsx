"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface BannerSlideshowProps {
  media: string[];
  interval?: number;
  /** "cover" (default) crops to fill; "contain" shows the full image. */
  fit?: "cover" | "contain";
  /** Show clickable dot indicators + prev/next arrows. Default: true. */
  showControls?: boolean;
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov"];

function isVideo(url: string): boolean {
  const lower = url.toLowerCase().split("?")[0];
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export default function BannerSlideshow({
  media,
  interval = 7000,
  fit = "cover",
  showControls = true,
}: BannerSlideshowProps) {
  const videoFitClass = fit === "contain" ? "object-contain" : "object-cover";
  const imageBgClass = fit === "contain" ? "bg-contain bg-no-repeat" : "bg-cover";
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Check if there's only one item or only videos (for loop behavior)
  const isSingleItem = media.length <= 1;
  const allVideos = media.length > 0 && media.every(isVideo);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-advance for images; videos advance via onEnded
  useEffect(() => {
    if (isSingleItem) return;

    const currentUrl = media[currentIndex];

    if (isVideo(currentUrl)) {
      // Video: fallback timeout in case video fails
      timerRef.current = setTimeout(goToNext, 60000);
    } else {
      timerRef.current = setTimeout(goToNext, interval);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, goToNext, interval, media, isSingleItem]);

  // Play/pause videos based on current slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  if (media.length === 0) return null;

  const hasControls = showControls && !isSingleItem;

  return (
    <>
      {media.map((url, index) => {
        const active = index === currentIndex;
        // Loop video if: single video, or all items are videos
        const shouldLoop = isVideo(url) && (isSingleItem || allVideos);

        if (isVideo(url)) {
          return (
            <video
              key={index}
              ref={(el) => { videoRefs.current[index] = el; }}
              className={`absolute inset-0 w-full h-full ${videoFitClass} transition-opacity duration-[2000ms] ease-in-out`}
              style={{ opacity: active ? 1 : 0 }}
              src={url}
              muted
              loop={shouldLoop}
              playsInline
              preload="auto"
              onEnded={() => {
                // Only advance if not looping and there are multiple items
                if (!shouldLoop && media.length > 1) {
                  if (timerRef.current) clearTimeout(timerRef.current);
                  goToNext();
                }
              }}
            />
          );
        }

        return (
          <div
            key={index}
            className={`absolute inset-0 ${imageBgClass} bg-center transition-opacity duration-[2000ms] ease-in-out`}
            style={{
              backgroundImage: `url(${url})`,
              opacity: active ? 1 : 0,
            }}
          />
        );
      })}

      {hasControls && (
        <>
          {/* Prev / Next arrows — hidden until hover on desktop, always
              tappable on mobile. Sits above the gradient/text overlay. */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goToPrev}
            className="group/arrow absolute top-1/2 left-3 md:left-5 z-20 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/30 hover:bg-black/55 text-white backdrop-blur-sm transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 -translate-x-px"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goToNext}
            className="group/arrow absolute top-1/2 right-3 md:right-5 z-20 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/30 hover:bg-black/55 text-white backdrop-blur-sm transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 translate-x-px"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Modern slide indicators — pill row, active slide expands. */}
          <div
            role="tablist"
            aria-label="Slide indicators"
            className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md"
          >
            {media.map((_, index) => {
              const active = index === currentIndex;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goToIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/70 ${
                    active
                      ? "w-7 bg-white"
                      : "w-1.5 bg-white/55 hover:bg-white/80"
                  }`}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
