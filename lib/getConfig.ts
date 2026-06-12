import { withBasePath } from "./withBasePath";

type ConfigType = {
  BASE_PATH?: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_IMAGE_URL: string;
  NEXT_PUBLIC_SID: string;
  NEXT_PUBLIC_SYSAPP: string;
  NEXT_PUBLIC_ENVIRONMENT: string;
  NEXT_PUBLIC_DOMAIN: string;
  NEXT_PUBLIC_TOKEN_KEY: string;
  NEXT_PUBLIC_X_ENCRYPTED_KEY: string;
};

export type ResolvedConfig = {
  basePath: string;
  baseApiUrl: string;
  imageUrl: string;
  sid: string | null;
  sysapp: string | null;
  environment: string | null;
  domain: string;
  token_key: string;
  x_encrypted_key: string;
};

// Strip JS-style line and block comments so config.json can keep // notes
// for swapping between tenants. Aware of strings, so // inside a value
// (e.g., a URL) is preserved.
function stripJsonComments(input: string): string {
  let out = "";
  let inString = false;
  let inLine = false;
  let inBlock = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];
    if (inLine) {
      if (ch === "\n") {
        inLine = false;
        out += ch;
      }
      continue;
    }
    if (inBlock) {
      if (ch === "*" && next === "/") {
        inBlock = false;
        i++;
      }
      continue;
    }
    if (inString) {
      out += ch;
      if (ch === "\\") {
        out += next;
        i++;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === "/" && next === "/") {
      inLine = true;
      i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlock = true;
      i++;
      continue;
    }
    out += ch;
  }
  // Trailing commas before } or ] are also illegal in strict JSON;
  // strip them so a dangling comma after uncommenting doesn't break parse.
  return out.replace(/,(\s*[}\]])/g, "$1");
}

function parseConfig(raw: string): ConfigType {
  return JSON.parse(stripJsonComments(raw)) as ConfigType;
}

// ── Runtime fetch (browser) ────────────────────────────────────────────
// In the static export there is no server: the browser fetches the tenant
// config from /config.json (emitted from public/config.json into out/).
// Editing out/config.json on the deployed host re-points the tenant on the
// next page load — no rebuild. The fetch is memoized so we read it once per
// session; a hard reload picks up edits.
let clientCache: Promise<ConfigType> | null = null;

async function loadFromBrowser(): Promise<ConfigType> {
  if (!clientCache) {
    clientCache = (async () => {
      // cache: "no-store" so an operator editing out/config.json sees the
      // change on reload instead of a stale disk-cached copy.
      const res = await fetch(withBasePath("/config.json"), {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(
          `Failed to load /config.json (HTTP ${res.status}). It must exist ` +
            `alongside the static export.`,
        );
      }
      return parseConfig(await res.text());
    })().catch((err) => {
      // Don't permanently cache a failed fetch — let the next call retry.
      clientCache = null;
      throw err;
    });
  }
  return clientCache;
}

async function loadRaw(): Promise<ConfigType> {
  if (typeof window === "undefined") {
    // Server side only runs during `next build` (e.g. generateMetadata).
    // There is no Node disk read here on purpose: pulling `node:fs` into the
    // module would break the CLIENT bundle, since client components import
    // this file. Build-time callers are wrapped in try/catch and fall back
    // to defaults; the real tenant config is fetched from /config.json in
    // the browser at runtime.
    throw new Error(
      "getConfig() resolves from /config.json in the browser at runtime; " +
        "it is not available during the static build.",
    );
  }
  return loadFromBrowser();
}

export default async function getConfig(): Promise<ResolvedConfig> {
  const data = await loadRaw();
  return {
    basePath: data.BASE_PATH || "",
    baseApiUrl: data.NEXT_PUBLIC_API_URL || "",
    imageUrl: data.NEXT_PUBLIC_IMAGE_URL || "",
    sid: data.NEXT_PUBLIC_SID || null,
    sysapp: data.NEXT_PUBLIC_SYSAPP || null,
    environment: data.NEXT_PUBLIC_ENVIRONMENT || null,
    domain: data.NEXT_PUBLIC_DOMAIN || "",
    token_key: data.NEXT_PUBLIC_TOKEN_KEY || "",
    x_encrypted_key: data.NEXT_PUBLIC_X_ENCRYPTED_KEY || "",
  };
}
