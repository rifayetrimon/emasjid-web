"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface BannerSlideshowProps {
  media: string[];
  interval?: number;
  /** "cover" (default) crops to fill; "contain" shows the full image. */
  fit?: "cover" | "contain";
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
    </>
  );
}
