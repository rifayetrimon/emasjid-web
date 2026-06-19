// SERVER-ONLY tenant config loader.
//
// The client `getConfig()` deliberately refuses to run server-side (it only
// fetches /config.json in the browser). But the /news/[id] route needs the
// tenant API URL + key at BUILD time (generateStaticParams / generateMetadata)
// to emit per-article Open Graph tags. So we read configuration/config.json
// straight off disk here. node:fs makes this module server-only — it must NOT
// be imported by any client component (only the /news/[id] server page uses it).
import { readFileSync } from "node:fs";
import path from "node:path";
import { stripJsonComments } from "./getConfig";

export interface ServerConfig {
  apiUrl: string;
  sid: string;
  key: string;
}

let cached: ServerConfig | null = null;

export function getServerConfig(): ServerConfig {
  if (cached) return cached;
  try {
    const file = path.join(process.cwd(), "configuration", "config.json");
    const raw = readFileSync(file, "utf8");
    const json = JSON.parse(stripJsonComments(raw)) as Record<string, unknown>;
    cached = {
      apiUrl: String(json.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, ""),
      sid: String(json.NEXT_PUBLIC_SID ?? "0"),
      key: String(json.NEXT_PUBLIC_X_ENCRYPTED_KEY || ""),
    };
  } catch {
    cached = { apiUrl: "", sid: "0", key: "" };
  }
  return cached;
}
