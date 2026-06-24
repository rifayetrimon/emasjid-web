"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getCachedConfig } from "@/services/apiCache";

/**
 * Top-of-page navigation progress bar (GitHub / YouTube style).
 *
 * Why a progress bar and not a slide/fade page transition?
 * ───────────────────────────────────────────────────────
 * cmsdisplay is a static export and its nav links are plain `<a>` tags, so
 * every navigation is a FULL PAGE RELOAD — the document unloads, React boots
 * again, then the page renders. A slide/scale transition can't survive an
 * unload, and animating the page wrapper makes the navbar/footer look like
 * they "reload" on every click (see the note in globals.css). What actually
 * reads as janky is the silent white gap between the click and the new page.
 *
 * A thin progress bar fixes exactly that: it appears the instant a link is
 * clicked (immediate, snappy feedback), trickles toward the top while the
 * browser fetches the next document, and on the fresh page it fills to 100%
 * and fades out — signalling "arrived". Content itself then fades in via the
 * existing scroll-reveal (.cms-reveal-*), so the entrance stays consistent
 * with the home page. Pure opacity/transform, no library, no layout shift.
 */
export default function NavProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [accent, setAccent] = useState<string>("");
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tint the bar with the tenant's primary colour (cached → instant on repeat
  // loads). Falls back to a neutral brand gradient if config can't be read.
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

  const stopTrickle = () => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
  };

  // Begin (or restart) the bar: jump in, then creep toward ~90% so it always
  // looks alive even when the network is slow. It never reaches 100% on its
  // own — only complete() does that, when the page has actually arrived.
  const start = () => {
    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }
    setVisible(true);
    setProgress((p) => (p > 0 && p < 90 ? p : 12));
    stopTrickle();
    trickleRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        // Smaller steps as we approach the cap — a natural-feeling slowdown.
        const step = (90 - p) * 0.08 + Math.random() * 2;
        return Math.min(90, p + step);
      });
    }, 240);
  };

  // Fill to 100% and fade out — the "page is ready" cue.
  const complete = () => {
    stopTrickle();
    setProgress(100);
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 280);
  };

  // Catch every internal navigation at the document level (capture phase) so
  // it works for links in any template, nav, footer or page body without each
  // having to opt in. We only react to genuine same-origin navigations.
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
      // Same path + query, only the hash differs → in-page jump, no load.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) {
        return false;
      }
      return true;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return; // new-tab / middle-click / modified click — let the browser handle it
      }
      const target = e.target as Element | null;
      const a = target?.closest?.("a");
      if (!a) return;
      if (!isInternalNav(a as HTMLAnchorElement)) return;
      start();
    };

    // Form submits (e.g. the nav search) that navigate the page.
    const onSubmit = () => start();

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      stopTrickle();
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, []);

  // On a fresh document (full reload) AND on any client-side route change,
  // finish the bar — this is what fills it to 100% and fades it out once the
  // new page is on screen.
  useEffect(() => {
    complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
