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

// Read the API upstream from configuration/config.json so the dev server can
// proxy /api/* to it. This mirrors the production nginx proxy: the browser
// calls its own origin (/api/...) and the dev server forwards server-to-server
// to the real backend, sidestepping the CORS preflight the upstream gateway
// rejects. `API_PROXY_TARGET` env wins if set.
function readApiTarget(): string {
  if (process.env.API_PROXY_TARGET) {
    return process.env.API_PROXY_TARGET.replace(/\/+$/, "");
  }
  try {
    const file = path.join(__dirname, "configuration", "config.json");
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(stripJsonComments(raw));
    const url = parsed.NEXT_PUBLIC_API_URL || "https://aws01.awfatech.com";
    return String(url).replace(/\/+$/, "");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      "[next.config] Could not read NEXT_PUBLIC_API_URL from config.json:",
      msg,
    );
    return "https://aws01.awfatech.com";
  }
}

const basePath = readBasePath();
const apiTarget = readApiTarget();

if (basePath) {
  console.log(`[next.config] basePath = "${basePath}"`);
}

// DEV-ONLY same-origin API proxy. `output: "export"` ignores rewrites at build
// time (the static `out/` has no server to run them), so production CORS is
// handled by nginx instead — see nginx.conf. But `next dev` DOES honour
// rewrites, so locally the browser hits http://localhost:3000/api/* (same
// origin → no CORS preflight) and the dev server forwards to the real
// upstream. We only attach `rewrites` in development so the export build log
// stays warning-free.
const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  console.log(`[next.config] dev API proxy: /api/* -> ${apiTarget}/api/*`);
}

const devRewrites = isDev
  ? {
      rewrites: async () => [
        {
          source: "/api/:path*",
          destination: `${apiTarget}/api/:path*`,
        },
      ],
    }
  : {};

const nextConfig = {
  // Fully static HTML/JS/CSS export — emits an `out/` directory that can be
  // served from any plain file host with NO Node server and NO port. All
  // data (and the tenant config.json) is fetched by the browser at runtime,
  // so content stays live and editing out/config.json re-points the tenant
  // without a rebuild. See README "Static deployment".
  output: "export",

  basePath,

  // Static export can't use the Next.js image optimizer (it needs a server),
  // so images are served as-is. next/image still works for layout/sizing.
  images: {
    unoptimized: true,
  },

  // Emit `route/index.html` instead of `route.html` so a dumb file server
  // resolves `/news/` correctly without rewrite rules.
  trailingSlash: true,

  // With `trailingSlash: true`, `next dev` would 308-redirect the same-origin
  // API proxy path (`/api/.../config?sid=2` → `/api/.../config/?sid=2`) BEFORE
  // the rewrite runs. The upstream then 307s the trailing-slash form back to a
  // cross-origin absolute URL — defeating the same-origin proxy. Skipping the
  // redirect lets `/api/*` reach the upstream exactly as written (no slash →
  // 200). This is a dev-server runtime behaviour only; the static export still
  // emits `route/index.html` dirs, and production is served by nginx where
  // this flag has no effect.
  skipTrailingSlashRedirect: true,

  // Expose basePath to client-side code (baked at build — the one value that
  // requires a rebuild to change).
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  // Same-origin API proxy in `next dev` only (see comment above devRewrites).
  ...devRewrites,
};

module.exports = nextConfig;
