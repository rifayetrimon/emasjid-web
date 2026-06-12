"use client";

import { useEffect } from "react";
import { trackVisit } from "@/services/visitorService";

// Fires a single visit POST on first mount per browser session. In the
// static export the browser calls the upstream tracker directly (myAxios
// attaches the x-encrypted-key). Backend handles uniqueness — we just
// dedupe per tab so an in-session navigation doesn't fire repeatedly.
// (Full reloads will re-fire; that's the right behavior — new page loads.)

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

    trackVisit()
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
