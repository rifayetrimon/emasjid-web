/**
 * Prepend the configured BASE_PATH to a local public/ asset path.
 *
 * Use this for any string that points to a file in this project's `public/`
 * folder (icons, demo images, the config.json fetch URL, etc.). It is a
 * no-op when BASE_PATH is empty, so call sites stay correct in both
 * root-domain and path-prefix deployments.
 *
 * Full URLs (http://, https://) and already-prefixed paths are returned
 * unchanged.
 */
export function withBasePath(p: string): string {
  if (!p) return p;
  // Any scheme URL (http:, https:, mailto:, tel:, javascript:, data:, etc.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(p)) return p;
  // Pure anchor or query — not a navigable path.
  if (p.startsWith("#") || p.startsWith("?")) return p;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!base) return p;
  // Canonical root: avoid "/school1/" → 308 redirect.
  if (p === "/") return base;
  if (p === base || p.startsWith(base + "/")) return p;
  const normalized = p.startsWith("/") ? p : "/" + p;
  return base + normalized;
}
