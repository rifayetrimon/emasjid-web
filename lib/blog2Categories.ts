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
 * regardless of where the article is rendered on the page.
 */
export function categoryFor(contentId: number) {
  const safe = Math.abs(Number(contentId) || 0);
  return BLOG2_CATEGORIES[safe % BLOG2_CATEGORIES.length];
}
