"use client";

// ───────────────────────────────────────────────────────────────────────
// Live preview overlay — receives unsaved CMS form state over postMessage
// from the parent CMS admin and exposes it to components via context.
//
// The provider is always mounted but stays passive unless the page was
// opened in preview mode (`?preview=1` in the URL). That keeps regular
// visitors completely unaffected.
//
// Public API:
//   <PreviewOverlayProvider>                            (in app/layout.tsx)
//   useOverlaidCssVars(initial)  → React.CSSProperties  (template wrapper)
//   useOverlaidFooter(footer)    → typeof footer        (Blog2Footer etc.)
//   useIsPreviewActive()         → boolean              (optional UI hints)
// ───────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

// The wire protocol must stay byte-identical to what the CMS panel sends.
const PREVIEW_MSG_SOURCE = "cms-site-preview";

// CMS-side form state shape. Kept loose (all optional, strings) so future
// CMS field additions don't break decoding.
export type PreviewPayload = {
  general?: {
    title?: string;
    template?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    logoUrl?: string;
    shopPlugin?: boolean;
    donationPlugin?: boolean;
  };
  nav?: {
    navbarBg?: string;
    navbarItemfontSize?: string;
    navbarItemColor?: string;
    navbarItemHoverColor?: string;
    navbarItmeUnderLine?: string;
    navbarItemUnderLineColor?: string;
    navbarDropdownBg?: string;
    navbarOpacity?: number;
  };
  banner?: {
    banneTitle?: string;
    bannerSubText?: string;
    bannerOverlayColor?: string;
    bannerOverlay?: number;
  };
  news?: { newsTitle?: string; backgroundColorNews?: string };
  faq?: { faqTitle?: string };
  footer?: {
    email?: string;
    phonenum?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    colorFooterAreaText?: string;
    bgColorFooter?: string;
    textColorHeaderFooter?: string;
    opacity?: number;
  };
  copyright?: string;
};

type OverlayState = {
  active: boolean;
  payload: PreviewPayload | null;
};

const OverlayContext = createContext<OverlayState>({
  active: false,
  payload: null,
});

// Pull the active flag out of the URL on the client. Treat any `preview`
// param other than "0"/"false" as enabled so links like ?preview, ?preview=1,
// ?preview=true all work.
function isPreviewEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const v = new URLSearchParams(window.location.search).get("preview");
  if (v === null) return false;
  const s = v.toLowerCase();
  return !(s === "0" || s === "false" || s === "no");
}

export function PreviewOverlayProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [payload, setPayload] = useState<PreviewPayload | null>(null);
  // First "config" message pins the parent origin; we only accept further
  // messages from that exact origin, so a malicious page can't hijack the
  // overlay after the handshake.
  const trustedOriginRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isPreviewEnabled()) return;
    setActive(true);

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== PREVIEW_MSG_SOURCE) return;
      if (data.type !== "config") return;

      // Pin to the first sender; ignore any others.
      if (!trustedOriginRef.current) {
        trustedOriginRef.current = event.origin;
      } else if (event.origin !== trustedOriginRef.current) {
        return;
      }

      const next = data.payload as PreviewPayload | undefined;
      if (next && typeof next === "object") setPayload(next);
    };

    window.addEventListener("message", onMessage);

    // Signal readiness to the parent. We don't know its origin yet, so
    // "*" is the only viable targetOrigin here; the content of "ready"
    // carries no sensitive data and the parent then sends back the config.
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { source: PREVIEW_MSG_SOURCE, type: "ready" },
        "*",
      );
    }

    return () => window.removeEventListener("message", onMessage);
  }, []);

  const value = useMemo<OverlayState>(
    () => ({ active, payload }),
    [active, payload],
  );

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
}

export function useIsPreviewActive(): boolean {
  return useContext(OverlayContext).active;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function nonEmpty(s: string | undefined | null): string | undefined {
  if (s == null) return undefined;
  const t = String(s).trim();
  return t ? t : undefined;
}

// Map the CMS form payload onto the same CSS variables TemplateLayout
// already sets, so the live overrides slot directly into the existing
// theme system without renames.
function payloadToCssVars(p: PreviewPayload | null): CSSProperties {
  if (!p) return {};
  const vars: Record<string, string> = {};
  const g = p.general || {};
  const n = p.news || {};
  // The CMS does NOT model a `newsTrending` slice yet on the panel side, so
  // skip that var here — it just keeps its server value.
  const f = p.footer || {};

  const primary = nonEmpty(g.primaryColor);
  const secondary = nonEmpty(g.secondaryColor);
  const text = nonEmpty(g.textColor);
  const bgNews = nonEmpty(n.backgroundColorNews);
  const bgFooter = nonEmpty(f.bgColorFooter);
  const footerAreaText = nonEmpty(f.colorFooterAreaText);
  const textHeaderFooter = nonEmpty(f.textColorHeaderFooter);

  if (primary) vars["--primary"] = primary;
  if (secondary) vars["--secondary"] = secondary;
  if (text) vars["--text"] = text;
  if (bgNews) vars["--bg-news"] = bgNews;
  if (bgFooter) vars["--bg-footer"] = bgFooter;
  if (footerAreaText) vars["--footer-area-text"] = footerAreaText;
  if (textHeaderFooter) vars["--text-header-footer"] = textHeaderFooter;

  return vars as CSSProperties;
}

// Build a partial FooterData-shape from the payload so Blog2Footer (and
// future template footers) can layer it on top of server props.
export type FooterOverlay = {
  bgColor?: string;
  textColor?: string;
  headerColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  email?: string;
  copyright?: string;
  contactLines?: string[];
};

function payloadToFooter(p: PreviewPayload | null): FooterOverlay {
  if (!p) return {};
  const f = p.footer || {};
  const out: FooterOverlay = {};

  const bg = nonEmpty(f.bgColorFooter);
  const text = nonEmpty(f.colorFooterAreaText);
  const header = nonEmpty(f.textColorHeaderFooter);
  // The CMS footer "opacity" slider tints the same bg color. The client
  // already does the same composition under the hood, so we just pass the
  // values through.
  if (bg) out.bgColor = bg;
  if (text) out.textColor = text;
  if (header) out.headerColor = header;
  if (bg) out.overlayColor = bg;
  if (typeof f.opacity === "number") out.overlayOpacity = f.opacity;

  const email = nonEmpty(f.email);
  if (email) out.email = email;

  const copyright = nonEmpty(p.copyright);
  if (copyright) out.copyright = copyright;

  const lines = [
    nonEmpty(f.address1),
    nonEmpty(f.address2),
    [nonEmpty(f.city), nonEmpty(f.state), nonEmpty(f.postcode)]
      .filter(Boolean)
      .join(", ") || undefined,
    nonEmpty(f.phonenum),
  ].filter((s): s is string => !!s);
  if (lines.length) out.contactLines = lines;

  return out;
}

// ── Public hooks ─────────────────────────────────────────────────────────

/**
 * Merge an initial inline-style CSS-variable object with the live preview
 * overrides. Pass the same object TemplateLayout would otherwise hand to
 * `<div style={...}>`; you get back a merged version that updates as the
 * admin edits. Outside preview mode this is a pass-through.
 */
export function useOverlaidCssVars(initial: CSSProperties): CSSProperties {
  const { active, payload } = useContext(OverlayContext);
  return useMemo(() => {
    if (!active) return initial;
    return { ...initial, ...payloadToCssVars(payload) };
  }, [active, payload, initial]);
}

/**
 * Layer the live preview footer overrides on top of the server-fetched
 * footer object. Each field only swaps in if the admin actually filled
 * it on the form, so untouched fields keep their saved values.
 */
export function useOverlaidFooter<
  T extends {
    bgColor?: string;
    textColor?: string;
    headerColor?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    email?: string;
    copyright?: string;
  },
>(footer: T): T & { previewContactLines?: string[] } {
  const { active, payload } = useContext(OverlayContext);
  return useMemo(() => {
    if (!active) return footer;
    const o = payloadToFooter(payload);
    return {
      ...footer,
      ...(o.bgColor !== undefined && { bgColor: o.bgColor }),
      ...(o.textColor !== undefined && { textColor: o.textColor }),
      ...(o.headerColor !== undefined && { headerColor: o.headerColor }),
      ...(o.overlayColor !== undefined && { overlayColor: o.overlayColor }),
      ...(o.overlayOpacity !== undefined && {
        overlayOpacity: o.overlayOpacity,
      }),
      ...(o.email !== undefined && { email: o.email }),
      ...(o.copyright !== undefined && { copyright: o.copyright }),
      previewContactLines: o.contactLines,
    };
  }, [active, payload, footer]);
}
