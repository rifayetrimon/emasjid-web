/** @type {import('next').NextConfig} */
const fs = require("node:fs");
const path = require("node:path");

// Read BASE_PATH from public/configuration/config.json so it's the single
// source of truth alongside the runtime tenant config. process.env.BASE_PATH
// still wins if set, which makes per-client CI builds easy.
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
  return out.replace(/,(\s*[}\]])/g, "$1");
}

function readBasePath(): string {
  if (process.env.BASE_PATH !== undefined) return process.env.BASE_PATH;
  try {
    // Config lives at <root>/configuration/config.json (outside public/),
    // so it is never served to browsers.
    const file = path.join(__dirname, "configuration", "config.json");
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(stripJsonComments(raw));
    return parsed.BASE_PATH || "";
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[next.config] Could not read BASE_PATH from config.json:", msg);
    return "";
  }
}

const basePath = readBasePath();
if (basePath) {
  console.log(`[next.config] basePath = "${basePath}"`);
}

const nextConfig = {
  basePath,

  // Expose basePath to client-side code as a build-time inlined constant.
  // Use lib/withBasePath.ts to prepend it to local public/ asset paths.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "devsec.awfatech.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "devaws04.awfatech.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "devapi02.awfatech.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
