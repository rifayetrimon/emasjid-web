import { NextResponse } from "next/server";
import cmsData from "@/data/cms.json";

export async function GET() {
  return NextResponse.json(cmsData);
}
