import { NextResponse } from "next/server";
import { getGalleryPage } from "@/services/galleryService";

// Force every request through fresh — without this, Next.js can decide to
// statically optimize the route and serve the page=1 response for every
// query string, which looks exactly like "pagination clicks don't change
// the content".
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Paginated gallery proxy. The page UI calls this from the client when the
 * user clicks Prev/Next, so the external API credentials stay server-side.
 *
 * GET /api/gallery?page=1&perPage=10
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const perPage = Math.max(1, Number(url.searchParams.get("perPage")) || 10);
  const data = await getGalleryPage(page, perPage);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}
