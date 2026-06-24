"use client";

import { useEffect } from "react";

/**
 * Single source of truth for the "page content is now on screen" signal that
 * the top navigation progress bar (NavProgress) waits for before filling to
 * 100% and fading out.
 *
 * The bar must complete on a REAL signal — when content has actually rendered
 * — not on a guessed timer. Every render path fires this exactly once when its
 * content is ready:
 *   - normal pages → TemplateLayout (when its shell+content data resolves)
 *   - maintenance / coming-soon / 404 / error → on mount (synchronous content)
 */
export const CONTENT_READY_EVENT = "cms:content-ready";

type FlagWindow = Window & { __cmsContentReady?: boolean };

export function signalContentReady(): void {
  if (typeof window === "undefined") return;
  (window as FlagWindow).__cmsContentReady = true;
  window.dispatchEvent(new Event(CONTENT_READY_EVENT));
}

/**
 * Fire the content-ready signal once `ready` becomes true. Defaults to firing
 * on mount — use the argument for pages whose content arrives asynchronously
 * (e.g. TemplateLayout passes `!loading && !!data`).
 */
export function useContentReady(ready: boolean = true): void {
  useEffect(() => {
    if (ready) signalContentReady();
  }, [ready]);
}
