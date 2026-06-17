"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import { withBasePath } from "@/lib/withBasePath";

/**
 * Percent-encode an image URL so unencoded spaces / unsafe characters (common
 * in CMS uploads like ".../newsf1_PKT 12.png") don't break loading. Idempotent
 * for already-encoded URLs: we decode-then-encode so existing %20 stays %20
 * rather than becoming %2520. Falls back to the raw URL if decoding fails.
 */
function safeEncodeUrl(url: string): string {
  try {
    return encodeURI(decodeURI(url));
  } catch {
    try {
      return encodeURI(url);
    } catch {
      return url;
    }
  }
}

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | null;
  fallbackSrc?: string;
}

/**
 * The canonical fallback image lives at /icons/default-img.png (plural).
 * Centralized here so consumers can rely on a working default — and so a
 * second 404 on the fallback won't blank the slot.
 */
const DEFAULT_FALLBACK = withBasePath("/icons/default-img.png");

export default function FallbackImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  unoptimized,
  ...props
}: FallbackImageProps) {
  const initial: string | StaticImageData = src ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(initial);
  // `failed` tracks whether we've already swapped to the fallback. If the
  // fallback itself errors we stop, so we don't loop.
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setFailed(false);
    } else {
      setImgSrc(fallbackSrc);
      setFailed(true);
    }
  }, [src, fallbackSrc]);

  // Skip Next/Image optimization for:
  //  - SVG sources (strict CSP / dangerouslyAllowSVG off).
  //  - Remote http(s) URLs — image hosts are tenant-driven (`dev01`,
  //    `eboss`, third-party CDNs like `careta.my`, etc.) and adding every
  //    one to `images.remotePatterns` isn't realistic. Local public/
  //    assets still go through the optimizer.
  const isStringSrc = typeof imgSrc === "string";
  const isSvg = isStringSrc && /\.svg(\?.*)?$/i.test(imgSrc as string);
  const isRemote = isStringSrc && /^https?:\/\//i.test(imgSrc as string);

  // Encode remote URLs so unencoded spaces / unsafe chars don't fail to load.
  const finalSrc =
    isStringSrc && isRemote ? safeEncodeUrl(imgSrc as string) : imgSrc;

  return (
    <Image
      {...props}
      src={finalSrc}
      alt={alt || "Image"}
      unoptimized={unoptimized ?? (isSvg || isRemote)}
      onError={() => {
        if (!failed) {
          setImgSrc(fallbackSrc);
          setFailed(true);
        }
      }}
    />
  );
}
