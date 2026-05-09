"use client";

import { useEffect, useRef, useState } from "react";

/** Inline (client-safe) version of the count formatter. */
function formatCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

interface Props {
  value: number;
  /** Animation duration in ms (default 2000). */
  duration?: number;
  /** When more than this fraction of the element is visible, the count starts. */
  threshold?: number;
  className?: string;
}

/**
 * Counts up from 0 to `value` over `duration` ms once the element scrolls into view.
 * - Animates exactly once per mount.
 * - Respects `prefers-reduced-motion` (shows the final value immediately).
 * - Uses easeOut cubic for a natural deceleration.
 */
export default function AnimatedCount({
  value,
  duration = 2000,
  threshold = 0.3,
  className,
}: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    // Honour user's motion preference
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      animatedRef.current = true;
      return;
    }

    const el = ref.current;

    const startAnimation = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;

      // 0-value edge case — nothing to animate
      if (value <= 0) {
        setDisplay(0);
        return;
      }

      const startTime = performance.now();
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        setDisplay(Math.round(value * easeOut(progress)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, threshold]);

  return (
    <span ref={ref} className={className}>
      {formatCount(display)}
    </span>
  );
}
