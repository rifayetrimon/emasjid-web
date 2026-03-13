// services/utils.ts

// ⭐ This function handles both external URLs and local paths
// For external URLs: return as-is
// For local paths: ensure they start with "/"
export function getImageUrl(
  path: string | undefined | null,
  fallback: string
): string {
  // 1. If path is missing or empty, use fallback
  if (!path || path.trim() === "") {
    return fallback;
  }

  // 2. Fix malformed URLs like "https:/domain.com" → "https://domain.com"
  let cleanedPath = path.trim();
  if (cleanedPath.match(/^https?:\/[^/]/)) {
    cleanedPath = cleanedPath.replace(/^(https?:)\/([^/])/, "$1//$2");
  }

  // 3. If it's a full URL (external image), return as-is
  if (cleanedPath.includes("://")) {
    return cleanedPath;
  }

  // 4. For local paths, ensure they start with "/"
  return cleanedPath.startsWith("/") ? cleanedPath : `/${cleanedPath}`;
}
