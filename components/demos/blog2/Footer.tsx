"use client";

import Image from "@/components/ui/FallbackImage";
import { FooterProps } from "@/types/cms";
import VisitorList from "@/components/visitor/VisitorList";
import type { VisitorStats } from "@/services/visitorService";
import { useOverlaidFooter } from "@/lib/previewOverlay";

// Real brand colour per social platform, matched from the icon path/label.
// The icon glyphs ship as white SVGs, so we colour the chip behind them — the
// familiar "brand-coloured button with a white icon" look.
function socialBrandColor(src: string): string {
  const s = (src || "").toLowerCase();
  if (s.includes("instagram")) return "#E4405F";
  if (s.includes("facebook") || /\bfb\b|\/fb\./.test(s)) return "#1877F2";
  if (s.includes("youtube") || s.includes("channel")) return "#FF0000";
  if (s.includes("linkedin")) return "#0A66C2";
  if (s.includes("tiktok")) return "#010101";
  if (s.includes("whatsapp")) return "#25D366";
  if (s.includes("twitter") || /\/x\./.test(s)) return "#000000";
  return "var(--primary)";
}

/**
 * Convert a hex string (#rgb, #rrggbb, or rrggbb) + alpha (0–1) to an
 * `rgba(...)` value usable in CSS. Falls back to a safe black if the
 * input is malformed.
 */
function hexToRgba(hex: string, alpha: number): string {
  let clean = (hex || "").trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const n = parseInt(clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface Props extends FooterProps {
  visitors?: VisitorStats;
}

/**
 * Footer used by ALL templates. Renders ONLY what the footer API returns —
 * admin columns (title + content), logo, contact, social links, copyright,
 * and the visitor counter (when enabled). No hardcoded section text.
 *
 * Layout adapts to how many columns the admin configured:
 *  - 3 columns → Row 1: the three columns. Row 2: social icons + visitor
 *    counter (pengunjung) together.
 *  - fewer than 3 columns → the visitor counter joins the columns row (taking
 *    col3's place), and the social icons sit in their own row below.
 */
export default function Blog2Footer({ footer: rawFooter, visitors }: Props) {
  // Layer live-preview overrides (colours, copyright, email) on top of the
  // fetched footer when opened in ?preview=1 mode; a pass-through otherwise.
  const footer = useOverlaidFooter(rawFooter);
  if (!footer) return null;

  const columns = footer.columns || [];
  const showVisitor = !!visitors && footer.showVisitorCounter;
  const hasContact = !!(footer.address || footer.phone || footer.email);
  const hasSocial = footer.social_links.length > 0;
  const isThreeCols = columns.length >= 3;

  // With fewer than 3 columns, the visitor counter rides ALONG the columns
  // row (in col3's slot). With 3 columns (or none), it drops to the bottom
  // row alongside the social icons.
  const visitorInColumns = showVisitor && !isThreeCols && columns.length > 0;
  const visitorInBottom = showVisitor && !visitorInColumns;

  // Overlay tint over the background image — admin colour + opacity (0–100).
  const overlayAlpha = Math.max(0, Math.min(1, (footer.overlayOpacity ?? 80) / 100));
  const overlayRgba = hexToRgba(footer.overlayColor || "#000000", overlayAlpha);
  const headerStyle = footer.headerColor ? { color: footer.headerColor } : undefined;

  const hasAnything =
    columns.length > 0 ||
    !!footer.image.image ||
    hasSocial ||
    hasContact ||
    !!footer.copyright ||
    showVisitor;
  if (!hasAnything) return null;

  const headingClass =
    "text-sm font-bold uppercase tracking-wider text-white mb-3";
  const bodyClass = "text-xs leading-relaxed text-current/70 whitespace-pre-line";

  // Number of cells in the columns row (admin columns + maybe the visitor),
  // used to choose how many sit across on desktop.
  const columnCells = columns.length + (visitorInColumns ? 1 : 0);
  const colsClass =
    columnCells >= 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : columnCells === 2
      ? "sm:grid-cols-2"
      : "grid-cols-1";

  return (
    <footer
      className="text-gray-400"
      style={{
        backgroundColor: footer.bgColor || "#1a1a1a",
        color: footer.textColor || undefined,
        backgroundImage: footer.backgroundImage
          ? `linear-gradient(${overlayRgba}, ${overlayRgba}), url(${footer.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        {/* Logo */}
        {footer.image.image && (
          <div className="pb-8">
            {/* Render the actual uploaded logo as-is (same as the navbar).
                We intentionally do NOT force brightness-0/invert: that turned
                any colored logo into a flat white silhouette. There's a single
                logo in config and it should look identical in navbar + footer. */}
            <Image
              src={footer.image.image}
              alt="Logo"
              width={150}
              height={50}
              className="h-12 w-auto object-contain"
            />
          </div>
        )}

        {/* Row 1 — admin columns (+ visitor counter when fewer than 3 columns) */}
        {(columns.length > 0 || visitorInColumns) && (
          <div className={`grid gap-10 ${colsClass} pb-10 border-b border-white/10`}>
            {columns.map((col, i) => (
              <div key={i}>
                {col.title && (
                  <h5 className={headingClass} style={headerStyle}>
                    {col.title}
                  </h5>
                )}
                {col.content && (
                  <div
                    className={bodyClass}
                    dangerouslySetInnerHTML={{ __html: col.content }}
                  />
                )}
              </div>
            ))}
            {visitorInColumns && (
              <div>
                <VisitorList stats={visitors!} tone="dark" align="left" color={footer.textColor || undefined} />
              </div>
            )}
          </div>
        )}

        {/* Contact details — only when the admin did NOT model them as columns,
            so we never duplicate. */}
        {columns.length === 0 && hasContact && (
          <div className="space-y-1 text-xs text-current/70 pb-10 border-b border-white/10">
            {footer.address && <p className="whitespace-pre-line">{footer.address}</p>}
            {footer.phone && (
              <a href={`tel:${footer.phone}`} className="block hover:text-[var(--primary)]">
                {footer.phone}
              </a>
            )}
            {footer.email && (
              <a
                href={`mailto:${footer.email}`}
                className="block hover:text-[var(--primary)] break-all"
              >
                {footer.email}
              </a>
            )}
          </div>
        )}

        {/* Row 2 — social icons (and the visitor counter when it didn't ride in
            the columns row above) */}
        {(hasSocial || visitorInBottom) && (
          <div
            className={`grid gap-10 items-start py-8 border-b border-white/10 ${
              hasSocial && visitorInBottom ? "md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {hasSocial && (
              <div className="flex flex-wrap gap-2 items-start content-start">
                {footer.social_links.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Social link"
                    // Chip painted in the platform's real brand colour.
                    style={{ backgroundColor: socialBrandColor(s.platform) }}
                    className="w-9 h-9 rounded-md flex items-center justify-center transition group hover:opacity-90 hover:scale-105"
                  >
                    <Image
                      src={s.platform}
                      alt=""
                      width={16}
                      height={16}
                      className="opacity-95 group-hover:opacity-100 transition"
                    />
                  </a>
                ))}
              </div>
            )}
            {visitorInBottom && (
              <div>
                <VisitorList stats={visitors!} tone="dark" align="left" color={footer.textColor || undefined} />
              </div>
            )}
          </div>
        )}

        {/* Copyright / terms line — only when the admin provided one. A thin
            divider line sits above it to separate it from the footer body. */}
        {footer.copyright && (
          <div
            className="mt-6 pt-6 border-t text-xs"
            style={{
              color: footer.textColor || "rgba(255,255,255,0.5)",
              borderTopColor: hexToRgba(footer.textColor || "#ffffff", 0.18),
            }}
          >
            <p>{footer.copyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
