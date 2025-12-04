// import { NextResponse } from "next/server";
// import cmsData from "@/data/cms.json";

// export async function GET() {
//   return NextResponse.json(cmsData);
// }

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// 1. Force this route to be dynamic (never cache the output)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 2. Define the path (works in both dev and prod)
    const filePath = path.join(process.cwd(), "data", "cms.json");

    // 3. Read the file fresh from the disk
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Data file not found" }, { status: 500 });
  }
}
