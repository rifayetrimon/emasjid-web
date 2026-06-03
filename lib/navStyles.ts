import type { CSSProperties } from "react";
import type { NavConfig } from "@/types/cms";

/**
 * Derives the CSS-friendly nav styling from admin's navConfig. Returns
 * concrete values (with fallbacks to `null`) so callers can opt into the
 * admin override only when the admin actually set the field — empty
 * strings in the API mean "use the demo's own default".
 *
 * Demos pass these values into inline styles + CSS custom properties so
 * Tailwind hover utilities can still react.
 */
export interface ResolvedNavStyles {
  /** Background color admin set, or null to keep demo default. */
  bgColor: string | null;
  /** Opacity 0-1 derived from navbarOpacity (0-100). null when not set. */
  bgOpacity: number | null;
  /** Item text color, or null. */
  itemColor: string | null;
  /** Hover color, or null. */
  hoverColor: string | null;
  /** Underline color (falls back to hover if underline enabled). */
  underlineColor: string | null;
  /** Whether to show the underline-on-hover effect. */
  showUnderline: boolean;
  /** Item font size in px, or null. */
  fontSizePx: number | null;
  /** Dropdown background color, or null. */
  dropdownBg: string | null;
  /** Inline style object ready to spread onto the nav root for CSS vars. */
  cssVars: CSSProperties;
}

function emptyToNull(s: string | undefined | null): string | null {
  const t = (s || "").trim();
  return t ? t : null;
}

export function resolveNavStyles(navConfig: NavConfig): ResolvedNavStyles {
  const bgColor = emptyToNull(navConfig.navbarBg);
  const itemColor = emptyToNull(navConfig.navbarItemColor);
  const hoverColor = emptyToNull(navConfig.navbarItemHoverColor);
  const underlineColor = emptyToNull(navConfig.navbarItemUnderLineColor);
  const dropdownBg = emptyToNull(navConfig.navbarDropdownBg);

  const fsRaw = emptyToNull(navConfig.navbarItemfontSize);
  const fontSizePx = fsRaw ? Number(fsRaw) : null;

  // navbarOpacity is 0-100. Treat 0 explicitly as "not set" since admin
  // saving a slider at 0 means "fully transparent nav" which is almost
  // never desired; the demo default wins instead.
  const opRaw = navConfig.navbarOpacity;
  const bgOpacity =
    typeof opRaw === "number" && opRaw > 0 ? opRaw / 100 : null;

  const showUnderline = !!navConfig.navbarItemUnderLine;

  const cssVars: CSSProperties = {};
  if (itemColor) (cssVars as Record<string, string>)["--nav-item-color"] = itemColor;
  if (hoverColor) (cssVars as Record<string, string>)["--nav-hover-color"] = hoverColor;
  if (underlineColor || hoverColor)
    (cssVars as Record<string, string>)["--nav-underline-color"] =
      underlineColor || hoverColor!;
  if (fontSizePx && Number.isFinite(fontSizePx))
    (cssVars as Record<string, string>)["--nav-font-size"] = `${fontSizePx}px`;
  if (dropdownBg)
    (cssVars as Record<string, string>)["--nav-dropdown-bg"] = dropdownBg;

  return {
    bgColor,
    bgOpacity,
    itemColor,
    hoverColor,
    underlineColor: underlineColor || (showUnderline ? hoverColor : null),
    showUnderline,
    fontSizePx: Number.isFinite(fontSizePx as number) ? fontSizePx : null,
    dropdownBg,
    cssVars,
  };
}
