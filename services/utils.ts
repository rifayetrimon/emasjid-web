// services/utils.ts

/**
 * Returns a usable image URL from an API path.
 * Returns empty string if no valid path is provided.
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path || path.trim() === "") {
    return "";
  }

  let cleanedPath = path.trim();

  // Fix malformed URLs like "https:/domain.com" → "https://domain.com"
  if (cleanedPath.match(/^https?:\/[^/]/)) {
    cleanedPath = cleanedPath.replace(/^(https?:)\/([^/])/, "$1//$2");
  }

  // If it's a full URL (external image), return as-is
  if (cleanedPath.includes("://")) {
    return cleanedPath;
  }

  // For local paths, ensure they start with "/"
  return cleanedPath.startsWith("/") ? cleanedPath : `/${cleanedPath}`;
}
