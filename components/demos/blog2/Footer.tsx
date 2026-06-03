"use client";

import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import { FooterProps } from "@/types/cms";
import VisitorList from "@/components/visitor/VisitorList";
import type { VisitorStats } from "@/services/visitorService";
import { useOverlaidFooter } from "@/lib/previewOverlay";

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

interface FooterArticle {
  contentId: number;
  title: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

interface Props extends FooterProps {
  visitors?: VisitorStats;
  popular?: FooterArticle[];
  trending?: FooterArticle[];
}

export default function Blog2Footer({
  footer: rawFooter,
  visitors,
  popular = [],
  trending = [],
}: Props) {
  // Layer the live preview overrides (colours, copyright, email) on top of
  // the server-fetched footer when the page was opened in ?preview=1 mode.
  // Outside preview mode this is a pass-through, so the production render
  // path is unchanged.
  const footer = useOverlaidFooter(rawFooter);
  if (!footer) return null;
  const year = new Date().getFullYear();

  const columns = footer.columns || [];
  const extraColumns = columns.slice(1); // col2 + col3 (col1 is rendered as "About Us")
  const showVisitor = !!visitors && footer.showVisitorCounter;

  // Overlay tint applied on top of the background image. Admin chooses
  // the colour (Config.footerConfig.bgColorFooter) and opacity 0–100
  // (Config.footerConfig.opacity); both are read by footerService.
  const overlayAlpha = Math.max(0, Math.min(1, (footer.overlayOpacity ?? 80) / 100));
  const overlayRgba = hexToRgba(footer.overlayColor || "#000000", overlayAlpha);

  // Column-header colour from admin (textColorHeaderFooter). When empty,
  // the component's own className colour wins.
  const headerStyle = footer.headerColor
    ? { color: footer.headerColor }
    : undefined;

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          {/* Editor Picks */}
          {popular.length > 0 && (
            <div>
              <h4
                className="text-sm font-extrabold uppercase tracking-wider text-white mb-5 border-b border-[var(--primary)] pb-2 inline-block"
                style={headerStyle}
              >
                Editor Picks
              </h4>
              <ul className="space-y-4">
                {popular.slice(0, 3).map((p) => (
                  <li key={p.contentId}>
                    <Link href={`/news/${p.contentId}`} className="flex gap-3 group">
                      <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-white/5">
                        {p.file1 && (
                          <Image
                            src={p.file1}
                            alt={p.altImg1 || p.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug text-current/85 group-hover:text-[var(--primary)] line-clamp-2 font-medium transition">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-current/40 mt-1 uppercase tracking-wider">
                          {p.date}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Posts */}
          {trending.length > 0 && (
            <div>
              <h4
                className="text-sm font-extrabold uppercase tracking-wider text-white mb-5 border-b border-[var(--primary)] pb-2 inline-block"
                style={headerStyle}
              >
                Popular Posts
              </h4>
              <ul className="space-y-4">
                {trending.slice(0, 3).map((p) => (
                  <li key={p.contentId}>
                    <Link href={`/news/${p.contentId}`} className="flex gap-3 group">
                      <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-white/5">
                        {p.file1 && (
                          <Image
                            src={p.file1}
                            alt={p.altImg1 || p.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug text-current/85 group-hover:text-[var(--primary)] line-clamp-2 font-medium transition">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-current/40 mt-1 uppercase tracking-wider">
                          {p.date}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Visitor stats — only when admin enabled countingVisitorFooter */}
          {showVisitor && (
            <div>
              <VisitorList
                stats={visitors!}
                tone="dark"
                align="left"
                titleClass="text-sm font-extrabold uppercase tracking-wider text-white mb-5 border-b border-[var(--primary)] pb-2 inline-block"
              />
            </div>
          )}
        </div>

        {/* About + admin-driven columns + follow */}
        <div className="grid md:grid-cols-3 gap-10 py-10 border-b border-white/10">
          <div className="md:col-span-1 flex items-start gap-5">
            {footer.image.image && (
              <Image
                src={footer.image.image}
                alt="Logo"
                width={150}
                height={50}
                className="h-12 w-auto object-contain flex-shrink-0"
              />
            )}
            <div>
              <h5
                className="text-sm font-bold uppercase tracking-wider text-white mb-2"
                style={headerStyle}
              >
                {footer.footer_title || "About Us"}
              </h5>
              {footer.text && (
                <div
                  className="text-xs text-current/60 leading-relaxed mb-3 max-w-md"
                  dangerouslySetInnerHTML={{ __html: footer.text }}
                />
              )}
              {footer.email && (
                <p className="text-xs text-current/60">
                  <span className="uppercase tracking-wider text-current/40">
                    Contact us:
                  </span>{" "}
                  <a
                    href={`mailto:${footer.email}`}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    {footer.email}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Admin columns 2 & 3 */}
          {extraColumns.map((col, i) => (
            <div key={i}>
              <h5
                className="text-sm font-bold uppercase tracking-wider text-white mb-2"
                style={headerStyle}
              >
                {col.title}
              </h5>
              {col.content && (
                <div
                  className="text-xs text-current/60 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: col.content }}
                />
              )}
            </div>
          ))}

          {footer.social_links.length > 0 && extraColumns.length < 2 && (
            <div>
              <h5
                className="text-sm font-bold uppercase tracking-wider text-white mb-3"
                style={headerStyle}
              >
                Follow Us
              </h5>
              <div className="flex flex-wrap gap-2">
                {footer.social_links.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Social"
                    className="w-9 h-9 bg-white/5 hover:bg-[var(--primary)] flex items-center justify-center transition group"
                  >
                    <Image
                      src={s.platform}
                      alt="Social"
                      width={14}
                      height={14}
                      className="brightness-0 invert opacity-80 group-hover:brightness-0 group-hover:invert-0 transition"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* If both extra columns ate the social slot, render socials here */}
        {footer.social_links.length > 0 && extraColumns.length >= 2 && (
          <div className="py-6 border-b border-white/10">
            <h5
              className="text-sm font-bold uppercase tracking-wider text-white mb-3"
              style={headerStyle}
            >
              Follow Us
            </h5>
            <div className="flex flex-wrap gap-2">
              {footer.social_links.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social"
                  className="w-9 h-9 bg-white/5 hover:bg-[var(--primary)] flex items-center justify-center transition group"
                >
                  <Image
                    src={s.platform}
                    alt="Social"
                    width={14}
                    height={14}
                    className="brightness-0 invert opacity-80 group-hover:brightness-0 group-hover:invert-0 transition"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{
            color: footer.textColor || "rgba(255,255,255,0.5)",
          }}
        >
          <p>{footer.copyright || `© ${year}. All Rights Reserved.`}</p>
          <a href="#contact" className="hover:text-white transition">
            Contact us
          </a>
        </div>
      </div>
    </footer>
  );
}
