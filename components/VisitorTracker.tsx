"use client";

import { useEffect } from "react";

// Fires a single POST to /api/visitor-track on first mount per browser
// session. The internal route attaches the `x-encrypted-key` and forwards
// to the real upstream tracker. Backend handles uniqueness — we just
// dedupe per tab so an SPA-style navigation between server-rendered pages
// in the same session doesn't fire repeatedly. (Next.js full reloads will
// re-fire; that's the right behavior — they're new page loads.)

const SESSION_FLAG = "emasjid:visitor-tracked";

export default function VisitorTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let alreadyTracked = false;
    try {
      alreadyTracked = window.sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      // Safari private mode / blocked storage — fall through and just
      // fire the call; the backend will dedup if it can.
    }
    if (alreadyTracked) return;

    // keepalive lets the POST survive a fast navigation away from the
    // landing page (e.g., user lands on /, immediately clicks a link).
    fetch("/api/visitor-track", { method: "POST", keepalive: true })
      .then(() => {
        try {
          window.sessionStorage.setItem(SESSION_FLAG, "1");
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        // Tracking failure must never break the page. No retry — the
        // next reload is its own opportunity.
      });
  }, []);

  return null;
}
