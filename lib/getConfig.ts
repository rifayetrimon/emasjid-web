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

async function loadRaw(): Promise<ConfigType> {
  if (typeof window === "undefined") {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.join(
      process.cwd(),
      "public",
      "configuration",
      "config.json"
    );
    const raw = await readFile(file, "utf-8");
    return parseConfig(raw);
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const res = await fetch(`${basePath}/configuration/config.json`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load config.json: HTTP ${res.status}`);
  }
  return parseConfig(await res.text());
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
