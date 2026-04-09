"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | null;
  fallbackSrc?: string;
}

export default function FallbackImage({
  src,
  fallbackSrc = "/icon/default-img.png",
  alt,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(
    src ? src : fallbackSrc
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setError(false);
    } else {
      setImgSrc(fallbackSrc);
      setError(true);
    }
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Image"}
      onError={() => {
        if (!error) {
          setImgSrc(fallbackSrc);
          setError(true);
        }
      }}
    />
  );
}
