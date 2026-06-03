export const BLOG2_CATEGORIES = [
  { label: "Akademik", color: "bg-blue-600" },
  { label: "Pengumuman", color: "bg-red-600" },
  { label: "Aktiviti", color: "bg-emerald-600" },
  { label: "Acara", color: "bg-amber-600" },
  { label: "Pelajar", color: "bg-purple-600" },
  { label: "Tahfiz", color: "bg-teal-600" },
  { label: "Pendidikan", color: "bg-indigo-600" },
  { label: "Sukan", color: "bg-orange-600" },
];

/**
 * Deterministic category picker — same `contentId` always returns the same tag,
 * regardless of where the article is rendered on the page. Used as a last-
 * resort fallback when admin sends no `category` value.
 */
export function categoryFor(contentId: number) {
  const safe = Math.abs(Number(contentId) || 0);
  return BLOG2_CATEGORIES[safe % BLOG2_CATEGORIES.length];
}

/**
 * Pick a stable color for an arbitrary admin-supplied category name.
 * First tries an exact (case-insensitive) match against BLOG2_CATEGORIES,
 * then falls back to a hash of the name so every "SPORTS" / "EVENTS" etc.
 * shares a color across all cards on the page.
 */
export function colorForCategoryName(name: string): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return BLOG2_CATEGORIES[0].color;
  const lower = trimmed.toLowerCase();
  const match = BLOG2_CATEGORIES.find((c) => c.label.toLowerCase() === lower);
  if (match) return match.color;
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash * 31 + trimmed.charCodeAt(i)) | 0;
  }
  return BLOG2_CATEGORIES[Math.abs(hash) % BLOG2_CATEGORIES.length].color;
}
