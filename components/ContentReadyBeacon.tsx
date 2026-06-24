"use client";

import { useContentReady } from "@/lib/contentReady";

/**
 * Drop-in client beacon that fires the content-ready signal on mount, so the
 * navigation progress bar completes. Use it inside server components (e.g.
 * not-found.tsx) that can't call the useContentReady hook directly. Renders
 * nothing.
 */
export default function ContentReadyBeacon() {
  useContentReady();
  return null;
}
