"use client";

import { useState, useEffect, useCallback } from "react";

interface BannerSlideshowProps {
  images: string[];
  interval?: number;
}

export default function BannerSlideshow({
  images,
  interval = 4000,
}: BannerSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, interval, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      {images.map((img, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
    </>
  );
}
