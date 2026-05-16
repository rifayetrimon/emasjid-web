/** @type {import('next').NextConfig} */

const fs = require("node:fs");
const path = require("node:path");

// Read BASE_PATH from configuration/config.json so it's the single
// source of truth alongside the runtime tenant config.
// process.env.BASE_PATH still wins if set.

function stripJsonComments(input: string): string {
  let out = "";
  let inString = false;
  let inLine = false;
  let inBlock = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    // Handle single-line comments
    if (inLine) {
      if (ch === "\n") {
        inLine = false;
        out += ch;
      }
      continue;
    }

    // Handle block comments
    if (inBlock) {
      if (ch === "*" && next === "/") {
        inBlock = false;
        i++;
      }
      continue;
    }

    // Handle strings
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

    // Start string
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }

    // Start single-line comment
    if (ch === "/" && next === "/") {
      inLine = true;
      i++;
      continue;
    }

    // Start block comment
    if (ch === "/" && next === "*") {
      inBlock = true;
      i++;
      continue;
    }

    out += ch;
  }

  // Remove trailing commas
  return out.replace(/,(\s*[}\]])/g, "$1");
}

function readBasePath(): string {
  if (process.env.BASE_PATH !== undefined) {
    return process.env.BASE_PATH;
  }

  try {
    // Config lives at <root>/configuration/config.json
    const file = path.join(__dirname, "configuration", "config.json");

    const raw = fs.readFileSync(file, "utf-8");

    const parsed = JSON.parse(stripJsonComments(raw));

    return parsed.BASE_PATH || "";
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    console.warn(
      "[next.config] Could not read BASE_PATH from config.json:",
      msg,
    );

    return "";
  }
}

const basePath = readBasePath();

if (basePath) {
  console.log(`[next.config] basePath = "${basePath}"`);
}

const nextConfig = {
  output: "standalone",

  basePath,

  // Expose basePath to client-side code
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
