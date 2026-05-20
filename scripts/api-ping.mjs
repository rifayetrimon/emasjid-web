// Quick connectivity probe for the CMS API.
// Reads JWT + base URL from configuration/config.json the same way the
// running Next.js app does, then makes the same shape of request axios
// sends. Run with:    node scripts/api-ping.mjs
//
// Prints HTTP status, time, and the first 300 bytes of the body so you
// can compare against what Swagger UI returns.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

function stripJsonComments(s) {
  let out = "";
  let inString = false,
    inLine = false,
    inBlock = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i],
      n = s[i + 1];
    if (inLine) {
      if (c === "\n") {
        inLine = false;
        out += c;
      }
      continue;
    }
    if (inBlock) {
      if (c === "*" && n === "/") {
        inBlock = false;
        i++;
      }
      continue;
    }
    if (inString) {
      out += c;
      if (c === "\\") {
        out += n;
        i++;
      } else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      out += c;
      continue;
    }
    if (c === "/" && n === "/") {
      inLine = true;
      i++;
      continue;
    }
    if (c === "/" && n === "*") {
      inBlock = true;
      i++;
      continue;
    }
    out += c;
  }
  return out.replace(/,(\s*[}\]])/g, "$1");
}

const raw = await readFile(
  resolve(process.cwd(), "configuration", "config.json"),
  "utf-8"
);
const cfg = JSON.parse(stripJsonComments(raw));

const base = cfg.NEXT_PUBLIC_API_URL;
const key = cfg.NEXT_PUBLIC_X_ENCRYPTED_KEY;
const sid = cfg.NEXT_PUBLIC_SID || "1";

const url = `${base}/api/v2/cms/eboss/cms/config?sid=${sid}&_t=${Date.now()}`;
console.log("→ GET", url);
console.log("  JWT prefix:", key ? key.slice(0, 40) + "..." : "(empty)");

const started = Date.now();
try {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      "x-encrypted-key": key,
    },
    // Node fetch has no built-in timeout; abort after 30s.
    signal: AbortSignal.timeout(30_000),
  });
  const elapsed = Date.now() - started;
  console.log(`← ${res.status} ${res.statusText} (${elapsed}ms)`);
  const body = await res.text();
  console.log("  body[0..300]:", body.slice(0, 300));
} catch (err) {
  const elapsed = Date.now() - started;
  console.error(`✗ failed after ${elapsed}ms:`, err.message);
  if (err.cause) console.error("  cause:", err.cause);
}
