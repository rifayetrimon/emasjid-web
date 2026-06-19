import Image from "@/components/ui/FallbackImage";
import type { BannerRecord } from "@/types/cms";

interface Props {
  banner: BannerRecord;
  /**
   * Visual treatment of the wrapper:
   *  - "rounded": soft card with big radius + shadow (demo7 / Template1)
   *  - "sharp":   full-bleed strip, square corners (Template6 blog)
   */
  variant?: "rounded" | "sharp";
}

// Admin `fontsize` is a free-text field. Accept a bare number (→ px) or a value
// that already carries a CSS unit; ignore anything else so we never emit
// invalid inline CSS.
function fontSizeStyle(raw: string): string | undefined {
  const v = (raw || "").trim();
  if (!v) return undefined;
  if (/^\d+(\.\d+)?$/.test(v)) return `${v}px`;
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(v)) return v;
  return undefined;
}

// Map admin "Position1".."Position5" to flex alignment for the message box.
// 1=top-left, 2=top-right, 3=bottom-left, 4=bottom-right, 5/center=centre.
// Unknown / empty falls back to bottom-left.
function positionClasses(pos: string): { box: string; text: string } {
  switch ((pos || "").trim().toLowerCase()) {
    case "position1":
      return { box: "items-start justify-start", text: "text-left" };
    case "position2":
      return { box: "items-start justify-end", text: "text-right" };
    case "position3":
      return { box: "items-end justify-start", text: "text-left" };
    case "position4":
      return { box: "items-end justify-end", text: "text-right" };
    case "position5":
    case "center":
    case "centre":
      return { box: "items-center justify-center", text: "text-center" };
    default:
      return { box: "items-end justify-start", text: "text-left" };
  }
}

/**
 * Renders a single promotag banner, honouring the admin's `imagemode`:
 *
 *  - "background": the image is a backdrop; the message is the focus — shown
 *    in a colour-chip (colopix bg / colofont text) positioned per tagposition
 *    over a legibility gradient.
 *  - "banner": the image IS the promo creative — shown uncropped
 *    (object-contain) on a colopix letterbox so the whole graphic is visible;
 *    the message, if any, sits in a slim caption strip at the bottom.
 *
 * Hidden entirely when there is neither an image nor a message.
 */
export default function PromotagBannerItem({
  banner,
  variant = "rounded",
}: Props) {
  const slide = banner.slides[0];
  const promo = banner.promo;
  const message = promo?.message?.trim() || "";
  if (!slide && !message) return null;

  const mode = promo?.imageMode ?? "banner";
  const pill = promo?.pillColor || "";
  const fontColor = promo?.fontColor || "";
  const sizeStyle = fontSizeStyle(promo?.fontSize || "");
  const pos = positionClasses(promo?.tagPosition || "");

  const radius = variant === "rounded" ? "rounded-[32px]" : "rounded-none";
  const shadow =
    variant === "rounded"
      ? "shadow-md hover:shadow-xl hover:-translate-y-0.5"
      : "";
  const height = variant === "rounded" ? "h-44 md:h-56" : "h-40 md:h-52";

  const href = slide?.url || "#";
  const linkProps = slide?.url
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  // "Promosi" affordance — only when there's no message chip carrying the
  // admin colours, so the card is never an unlabeled mystery image.
  const showTag = !message;

  const messageBox = message ? (
    <span
      className={`inline-block max-w-[85%] px-4 py-2 rounded-lg font-semibold leading-snug drop-shadow-sm ${pos.text}`}
      style={{
        backgroundColor: pill || "rgba(0,0,0,0.6)",
        color: fontColor || "#ffffff",
        fontSize: sizeStyle,
      }}
    >
      {message}
    </span>
  ) : null;

  return (
    <a
      href={href}
      {...linkProps}
      className={`group block relative ${height} overflow-hidden ${radius} ${shadow} transition-all`}
      style={{ backgroundColor: pill || "#f3f4f6" }}
    >
      {slide && (
        <Image
          src={slide.src}
          alt={message || "Promosi"}
          fill
          showSkeleton
          className={
            mode === "background"
              ? "object-cover group-hover:scale-[1.02] transition-transform duration-700"
              : "object-contain"
          }
          sizes="100vw"
        />
      )}

      {/* Legibility gradient only in background mode (text sits over photo). */}
      {mode === "background" && slide && message && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      )}

      {showTag && (
        <span
          className="absolute top-4 right-4 z-10 inline-flex items-center px-3 py-1 rounded-full bg-white/85 backdrop-blur text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--primary)] shadow-sm"
        >
          Promosi
        </span>
      )}

      {/* Message placement differs by mode. */}
      {mode === "background"
        ? messageBox && (
            <div className={`absolute inset-0 z-10 flex p-5 md:p-7 ${pos.box}`}>
              {messageBox}
            </div>
          )
        : messageBox && (
            <div className="absolute inset-x-0 bottom-0 z-10 flex justify-start p-3 md:p-4">
              {messageBox}
            </div>
          )}
    </a>
  );
}
