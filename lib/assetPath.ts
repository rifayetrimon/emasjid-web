// // lib/assetPath.ts
// export function assetPath(path: string) {
//   // If path is empty or undefined, return as-is
//   if (!path) return path;

//   // If it's an external URL (contains ://), return as-is without base path
//   if (path.includes("://")) {
//     return path;
//   }

//   // Only add base path to local/relative paths
//   const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
//   return `${base}${path}`;
// }
