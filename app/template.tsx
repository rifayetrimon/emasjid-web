"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Run the reveal setup BEFORE the browser paints so content that's already in
// the DOM at mount (e.g. statically-prerendered pages) is hidden before it
// shows — same clean entrance as the home page's client-fetched content.
// Falls back to useEffect during server prerender to avoid the SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Page transition / scroll-reveal wrapper.
 *
 * HARDCODED to the "Extreme" tier for ALL clients. The CMS admin's Page
 * Transition setting is intentionally disabled (its UI is commented out in the
 * configuration page). To make it configurable again: restore that UI, read
 * `generalSettings.pageTransition` from the config here, and map "1"/"2"/"3" →
 * `cms-reveal-1/2/3` (see git history of this file for the config-driven
 * version).
 *
 * Extreme = a cinematic whole-page transition on every navigation
 * (`.cms-reveal-3`, the template remounts per route) PLUS a deep scroll-reveal
 * where every notable element animates in as it enters the viewport. All the
 * styling lives in globals.css.
 */
const REVEAL_CLASS = "cms-reveal-3";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Scroll-reveal: mark the reveal targets and add `.is-visible` as each enters
  // the viewport. Re-armed per route (pathname dep). Runs pre-paint so the
  // entrance looks identical on every page.
  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = wrapperRef.current;
    if (!root) return;

    // Reduced motion: reveal everything immediately, no observers.
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target); // reveal once, then stop watching
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const SKIP_TAGS = new Set([
      "BR",
      "HR",
      "SCRIPT",
      "STYLE",
      "TEMPLATE",
      "NOSCRIPT",
      "IFRAME",
    ]);

    // A node worth animating: an element with real content, not a sticky/fixed
    // element (transforming those would break their positioning).
    const meaningful = (el: Element): boolean => {
      if (el.nodeType !== 1) return false;
      if (SKIP_TAGS.has(el.tagName)) return false;
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.position === "sticky") return false;
      return (
        el.childElementCount > 0 ||
        (el.textContent || "").trim().length > 0 ||
        el.tagName === "IMG"
      );
    };

    const STEP = 0.1; // stagger seconds between items in a row/grid
    const CAP = 8; // max stagger steps so late items don't lag too long

    const className = (el: Element) =>
      (el as HTMLElement).className?.toString?.() || "";
    const isCardish = (el: Element) => /\bcards?\b/i.test(className(el));
    const isRowish = (el: Element) => /\b(grid|flex|row)\b/i.test(className(el));
    const kidsOf = (el: Element) =>
      Array.from(el.children).filter(meaningful);

    // Build the list of reveal BLOCKS. Each block is revealed as a whole UNIT
    // (its container + content animate together), so you never see an empty
    // styled box fill in afterwards. We descend through single-child wrappers
    // (e.g. a nested <main> or a lone <article>) so real content blocks cascade
    // — instead of one giant block — making every page behave like the home
    // page. A row/grid/list cascades its items; everything else reveals whole.
    const buildTargets = (main: Element): { el: Element; delay: number }[] => {
      // Unwrap single-child wrappers to reach the real content container.
      let base = main;
      for (let i = 0; i < 4; i++) {
        const kids = kidsOf(base);
        if (kids.length === 1 && kids[0].childElementCount > 0 && !isCardish(kids[0])) {
          base = kids[0];
        } else break;
      }

      const out: { el: Element; delay: number }[] = [];
      for (const block of kidsOf(base)) {
        const sub = kidsOf(block);
        // A row/grid/list of 2+ items → cascade the items (each is a
        // self-contained unit). Cards are always kept whole.
        if (!isCardish(block) && sub.length >= 2 && (isRowish(block) || sub.length >= 3)) {
          sub.forEach((s, i) =>
            out.push({ el: s, delay: Math.min(i, CAP) * STEP }),
          );
        } else {
          out.push({ el: block, delay: 0 });
        }
      }
      // Hard cap to keep things smooth on very long pages.
      return out.slice(0, 200);
    };

    const seen = new WeakSet<Element>();
    const scan = () => {
      const main = root.querySelector("main");
      if (!main) return;
      for (const { el, delay } of buildTargets(main)) {
        if (seen.has(el)) continue;
        seen.add(el);
        if (delay > 0) {
          (el as HTMLElement).style.setProperty("--rv-delay", `${delay}s`);
        }
        el.classList.add("cms-rv");
        io.observe(el);
      }
    };

    scan();

    // Page content loads asynchronously (client fetch) and templates mutate
    // (carousels, pagination), so re-scan as the DOM changes — coalesced to one
    // pass per animation frame. childList mutations only, so toggling
    // `.is-visible` (an attribute change) doesn't retrigger this. Marking nodes
    // in this MutationObserver microtask runs before paint, so newly-loaded
    // content paints already-hidden — no flash.
    let raf = 0;
    const mo = new MutationObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        scan();
      });
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <div ref={wrapperRef} className={REVEAL_CLASS}>
      {children}
    </div>
  );
}
