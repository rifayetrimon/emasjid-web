"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCachedConfig } from "@/services/apiCache";
import { getNavData } from "@/services/navService";
import { getFooterData } from "@/services/footerService";
import { getSiteTheme } from "@/services/themeService";
import { getVisitorStats } from "@/services/visitorService";
import { CONTENT_READY_EVENT } from "@/lib/contentReady";

/**
 * Top-of-page navigation progress bar + client-side navigation controller.
 *
 * The problem with the old behaviour
 * ──────────────────────────────────
 * cmsdisplay is a static export whose nav links are plain `<a>` tags, so every
 * click did a FULL PAGE RELOAD: the browser threw away the document, re-booted
 * and re-hydrated React, then re-fetched data — showing a blank white page the
 * whole time. No overlay can truly hide that, because the *current* page is
 * already gone the instant the new (blank) document starts rendering.
 *
 * What this does instead
 * ──────────────────────
 * It intercepts internal link clicks and navigates CLIENT-SIDE (router.push) —
 * no document reload, no re-hydration, so the current page stays fully on
 * screen. While it's working it:
 *   1. shows the thin top progress bar (the only loading indicator now),
 *   2. prefetches the destination's shell data (config/nav/footer/theme/
 *      visitors) so the next view renders from warm cache immediately, then
 *   3. swaps to the new route and fills the bar to 100% the moment the page
 *      signals it's ready (cms:content-ready).
 *
 * The result: you stay on the current page until the bar completes, then the
 * next page's content appears directly — never a white loading screen.
 *
 * External links, downloads, new-tab / modified clicks and pure hash jumps are
 * left to the browser. A soft-complete timer guarantees the bar never hangs.
 */
type FlagWindow = Window & { __cmsContentReady?: boolean };

const SOFT_COMPLETE_MS = 1400; // backstop so the bar always finishes

export default function NavProgress() {
  const pathname = usePathname();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [accent, setAccent] = useState("");

  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const softRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const freezeRef = useRef<HTMLDivElement | null>(null);
  const pathnameRef = useRef(pathname);
  const basePathRef = useRef<string | null>(null);
  pathnameRef.current = pathname;

  // Tint the bar with the tenant's primary colour (cached → instant on repeat
  // loads). Falls back to a neutral brand blue if config can't be read.
  useEffect(() => {
    let alive = true;
    getCachedConfig()
      .then((cfg) => {
        const primary =
          (cfg?.generalSettings as { primaryColor?: string } | undefined)
            ?.primaryColor || "";
        if (alive && primary) setAccent(primary);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const clearTimers = () => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
    if (softRef.current) {
      clearTimeout(softRef.current);
      softRef.current = null;
    }
  };

  // Begin (or restart) the bar: jump in, then creep toward ~90% so it always
  // looks alive. It only reaches 100% via complete(), once content is ready.
  const start = () => {
    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }
    setVisible(true);
    setProgress((p) => (p > 0 && p < 90 ? p : 12));
    clearTimers();
    trickleRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        const step = (90 - p) * 0.08 + Math.random() * 2;
        return Math.min(90, p + step);
      });
    }, 240);
  };

  // Fill to 100% and fade out — the "content is on screen" cue. Also releases
  // the frozen snapshot of the previous page, revealing the new content.
  const complete = () => {
    clearTimers();
    setProgress(100);
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 280);
    unfreeze();
  };

  // ── Freeze the current page ───────────────────────────────────────────
  // Client-side navigation unmounts the current page and the next page paints
  // a brief blank frame while its data loads. To keep the visitor on the
  // current page until the new content is ready, we snapshot the live DOM into
  // a fixed overlay (offset to the current scroll position) and hold it on top
  // while the bar runs. complete() fades it out once the page signals ready —
  // so the new content appears directly, never a white screen.
  const unfreeze = (immediate = false) => {
    const overlay = freezeRef.current;
    if (!overlay) return;
    freezeRef.current = null;
    if (immediate) {
      overlay.remove();
      return;
    }
    overlay.classList.add("is-leaving");
    window.setTimeout(() => overlay.remove(), 320);
  };

  const freezeCurrentPage = () => {
    if (typeof document === "undefined") return;
    unfreeze(true); // clear any stale snapshot from a rapid double-click
    try {
      const scrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
      const overlay = document.createElement("div");
      overlay.className = "cms-navfreeze";
      const inner = document.createElement("div");
      inner.className = "cms-navfreeze__inner";
      inner.style.transform = `translateY(${-scrollY}px)`;
      // Clone the rendered page (nav + content + footer). Skip scripts/styles
      // and our own progress bar so the snapshot is purely visual.
      Array.from(document.body.children).forEach((child) => {
        const tag = child.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "LINK") return;
        if ((child as HTMLElement).classList?.contains("cms-navprogress")) return;
        if ((child as HTMLElement).classList?.contains("cms-navfreeze")) return;
        inner.appendChild(child.cloneNode(true));
      });
      overlay.appendChild(inner);
      // Append to <html> (outside <body>) so React — which owns <body> — never
      // sees this foreign node during its reconciliation.
      document.documentElement.appendChild(overlay);
      freezeRef.current = overlay;
    } catch {
      // If snapshotting fails for any reason, just navigate without the freeze.
      freezeRef.current = null;
    }
  };

  // Next.js prepends basePath in router.push, but the clicked <a> href already
  // includes it (e.g. /preview-site/news in the admin preview). Derive the
  // basePath from the gap between the real URL and the app pathname, so we can
  // strip it before pushing and avoid a doubled "/preview-site/preview-site".
  const computeBasePath = (): string => {
    if (basePathRef.current !== null) return basePathRef.current;
    let bp = "";
    if (typeof window !== "undefined") {
      const full = window.location.pathname;
      const app = pathnameRef.current || "/";
      if (app !== "/" && full.endsWith(app)) {
        bp = full.slice(0, full.length - app.length);
      } else if (app === "/") {
        bp = full.replace(/\/+$/, "");
      }
    }
    basePathRef.current = bp;
    return bp;
  };

  // Warm the next view's shell data so it renders from cache the instant the
  // route swaps — no blank frame waiting on the network.
  const prefetchShell = async () => {
    try {
      await Promise.all([
        getCachedConfig(),
        getNavData(),
        getFooterData(),
        getSiteTheme(),
        getVisitorStats(),
      ]);
    } catch {
      // A prefetch miss is harmless — the destination just fetches normally.
    }
  };

  // Intercept internal navigations and route them client-side.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isInternalNav = (a: HTMLAnchorElement): boolean => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return false;
      if (a.target && a.target !== "_self") return false;
      if (a.hasAttribute("download")) return false;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return false;
      }
      if (url.origin !== window.location.origin) return false;
      // Non-http(s) (mailto:, tel:, …) → let the browser handle it.
      if (url.protocol !== "http:" && url.protocol !== "https:") return false;
      // Same path + query, only the hash differs → in-page jump, no navigation.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) {
        return false;
      }
      return true;
    };

    const beginNav = async (dest: string) => {
      (window as FlagWindow).__cmsContentReady = false;
      freezeCurrentPage(); // hold the current page on screen during the swap
      start();
      await prefetchShell();
      setProgress((p) => Math.max(p, 85));
      router.push(dest);
      // Backstop: always finish the bar even if the destination forgets to
      // signal (e.g. same-route query change that doesn't remount the layout).
      if (softRef.current) clearTimeout(softRef.current);
      softRef.current = setTimeout(complete, SOFT_COMPLETE_MS);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return; // new-tab / middle-click / modified click — let the browser do it
      }
      const target = e.target as Element | null;
      const a = target?.closest?.("a");
      if (!a) return;
      if (!isInternalNav(a as HTMLAnchorElement)) return;

      e.preventDefault();
      const url = new URL((a as HTMLAnchorElement).href, window.location.href);
      const bp = computeBasePath();
      let path = url.pathname;
      if (bp && path.startsWith(bp)) path = path.slice(bp.length) || "/";
      void beginNav(path + url.search + url.hash);
    };

    // The nav search form already calls router.push itself — just light the bar
    // and freeze the current page so the results swap in without a white frame.
    const onSubmit = () => {
      (window as FlagWindow).__cmsContentReady = false;
      freezeCurrentPage();
      start();
      if (softRef.current) clearTimeout(softRef.current);
      softRef.current = setTimeout(complete, SOFT_COMPLETE_MS);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      clearTimers();
      if (hideRef.current) clearTimeout(hideRef.current);
      unfreeze(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Complete the bar the moment the page's content is ready — for both
  // client-side navigations and the initial page load.
  useEffect(() => {
    const onReady = () => complete();
    window.addEventListener(CONTENT_READY_EVENT, onReady);
    // Initial load: show the bar and let content-ready finish it. If content
    // already signalled before we mounted, this is a no-op trickle that the
    // listener (or soft timer) closes out immediately.
    if (!(window as FlagWindow).__cmsContentReady) {
      start();
      if (softRef.current) clearTimeout(softRef.current);
      softRef.current = setTimeout(complete, SOFT_COMPLETE_MS);
    }
    return () => window.removeEventListener(CONTENT_READY_EVENT, onReady);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible && progress === 0) return null;

  const tint = accent || "#2563eb";

  return (
    <div
      aria-hidden
      className="cms-navprogress"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="cms-navprogress__bar"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${tint}, ${tint} 60%, rgba(255,255,255,0.65))`,
          boxShadow: `0 0 8px ${tint}, 0 0 4px ${tint}`,
        }}
      />
    </div>
  );
}
