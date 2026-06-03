// Server-side proxy for the visitor-tracking POST. Lives behind Next.js
// because the upstream `x-encrypted-key` is server-only — we cannot ship
// it to the browser. The client component just hits this route; we add
// the key, the `sid` query, and forward the originating client IP/UA so
// the backend can do its own per-visitor uniqueness logic.

import { NextRequest, NextResponse } from "next/server";
import getConfig from "@/lib/getConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { baseApiUrl, sid, x_encrypted_key } = await getConfig();

    if (!baseApiUrl || !x_encrypted_key) {
      // Misconfigured tenant — fail silently from the user's POV. We don't
      // want a tracking miss to surface as a visible error on the site.
      return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 204 });
    }

    const url = `${baseApiUrl.replace(/\/+$/, "")}/api/v2/cms/eboss/cms/visitors/track?sid=${encodeURIComponent(sid ?? "0")}`;

    // Forward the real client identifiers so the backend can dedup.
    const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
    const realIp = req.headers.get("x-real-ip") ?? "";
    const ua = req.headers.get("user-agent") ?? "";

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-encrypted-key": x_encrypted_key,
        ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
        ...(realIp ? { "x-real-ip": realIp } : {}),
        ...(ua ? { "user-agent": ua } : {}),
      },
      // Backend treats this as an empty-body POST.
      body: "",
      cache: "no-store",
    });

    // Don't bubble the upstream body back to the browser — the user asked
    // not to expose this response. Just mirror the success / fail status.
    return new NextResponse(null, { status: upstream.ok ? 204 : 502 });
  } catch {
    // Network blip / DNS failure / etc. — swallow so the page never breaks
    // because of a tracking call.
    return new NextResponse(null, { status: 204 });
  }
}
