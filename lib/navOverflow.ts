// Shared helper for collapsing a long menu down to a fixed number of
// top-level entries with the overflow tucked under a synthetic "More"
// dropdown. All 6 template nav variants render menu items the same way
// (label + optional submenu), so feeding them this pre-shaped list keeps
// every template's nav consistently capped without each template having
// to repeat the slice/append logic.
//
// Behavior:
// - <= `max` items: returns the input unchanged.
// - > `max` items: keeps the first `max - 1` real items, then appends a
//   synthetic "More" item whose submenu contains the remaining ones.
//   The `-1` keeps the total visible count at exactly `max` once the
//   "More" trigger is counted.

import type { MenuItem } from "@/types/cms";

export const DEFAULT_VISIBLE_NAV_ITEMS = 7;
export const MORE_LABEL = "More";

export function withMoreDropdown(
  items: MenuItem[] | undefined | null,
  max: number = DEFAULT_VISIBLE_NAV_ITEMS,
  label: string = MORE_LABEL,
): MenuItem[] {
  const safe = Array.isArray(items) ? items : [];
  if (safe.length <= max) return safe;

  const visibleCount = Math.max(1, max - 1);
  return [
    ...safe.slice(0, visibleCount),
    {
      label,
      link: "#",
      submenu: safe.slice(visibleCount),
    },
  ];
}
