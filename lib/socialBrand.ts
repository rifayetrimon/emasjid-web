import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa6";

/**
 * Resolve a social platform to its OFFICIAL brand mark (react-icons glyph),
 * its real brand colour, and a human label.
 *
 * Why react-icons and not the local /icons/*.svg files?
 * ─────────────────────────────────────────────────────
 * The white SVGs (fb.svg, instagram.svg, …) live in public/icons and are
 * served as static files. On the live server those files are repeatedly
 * deployed with owner-only (600) permissions, so nginx returns 403 for
 * e.g. /icons/fb.svg — the navbar then falls back to default-img.png and the
 * brand icon disappears (this is why FB showed a broken placeholder on
 * awfatech.com while WhatsApp, which happened to be 644, worked). Rendering
 * the glyph from react-icons removes the file/permission dependency entirely:
 * the icon is part of the JS bundle, so it can never 403.
 *
 * `hint` can be either the platform label ("Facebook") or the legacy icon
 * path ("/icons/fb.svg") — we match on substrings so both work.
 */
export function socialBrand(hint: string): {
  color: string;
  Icon: IconType;
  label: string;
} {
  const s = (hint || "").toLowerCase();
  if (s.includes("instagram")) return { color: "#E4405F", Icon: FaInstagram, label: "Instagram" };
  if (s.includes("facebook") || /\bfb\b|\/fb\./.test(s)) return { color: "#1877F2", Icon: FaFacebookF, label: "Facebook" };
  if (s.includes("youtube") || s.includes("channel")) return { color: "#FF0000", Icon: FaYoutube, label: "YouTube" };
  if (s.includes("linkedin")) return { color: "#0A66C2", Icon: FaLinkedinIn, label: "LinkedIn" };
  if (s.includes("tiktok")) return { color: "#010101", Icon: FaTiktok, label: "TikTok" };
  if (s.includes("whatsapp")) return { color: "#25D366", Icon: FaWhatsapp, label: "WhatsApp" };
  if (s.includes("twitter") || /\/x\.|\bx\b/.test(s)) return { color: "#000000", Icon: FaXTwitter, label: "Twitter / X" };
  return { color: "var(--primary)", Icon: FaLink, label: "Link" };
}
