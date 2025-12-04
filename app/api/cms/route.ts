// app/api/cms/route.ts
import { NextResponse } from "next/server";
import configService from "@/services/configService";

// ✅ Force this route to NEVER cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    console.log("🔄 API Route: Fetching fresh CMS data from external API...");

    // This calls your external API every time
    const data = await configService();

    console.log("✅ API Route: Successfully fetched CMS data");

    return NextResponse.json(data, {
      headers: {
        // Prevent any caching
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch CMS data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
