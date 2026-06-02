#!/usr/bin/env bash
# Build the app and produce a single zip the client can drop on any
# server with Node 18+ installed. The client never runs `yarn build`,
# `yarn install`, or `next` themselves — they just `node server.js`.
#
# Usage:
#   ./scripts/package-release.sh                # release-YYYYMMDD-HHmm.zip
#   ./scripts/package-release.sh client1        # release-client1-YYYYMMDD-HHmm.zip
#
# Requires Node 18+, yarn, and `zip`.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LABEL="${1:-}"
STAMP="$(date +%Y%m%d-%H%M)"
NAME="release${LABEL:+-$LABEL}-$STAMP"
OUT_DIR="$ROOT/dist"
STAGE="$OUT_DIR/$NAME"
ZIP="$OUT_DIR/$NAME.zip"

echo "==> 1/4  Clean previous output"
rm -rf .next "$STAGE" "$ZIP"
mkdir -p "$OUT_DIR"

echo "==> 2/4  yarn install (frozen lockfile)"
yarn install --frozen-lockfile

echo "==> 3/4  yarn build (produces .next/standalone)"
yarn build

if [[ ! -d ".next/standalone" ]]; then
  echo "✗ .next/standalone was not produced. Confirm next.config.ts has output: \"standalone\"."
  exit 1
fi

echo "==> 4/4  Assemble release tree at $STAGE"
mkdir -p "$STAGE"

# 1. Standalone Node app (already includes a minimal node_modules)
cp -R .next/standalone/. "$STAGE/"

# 2. Static assets — standalone build expects them at .next/static/
mkdir -p "$STAGE/.next"
cp -R .next/static "$STAGE/.next/static"

# 3. public/ — served as-is by next start. Standalone build does NOT
#    include it automatically.
if [[ -d public ]]; then
  cp -R public "$STAGE/public"
fi

# 4. Tenant config — outside public/ so it isn't web-served.
mkdir -p "$STAGE/configuration"
cp configuration/config.json "$STAGE/configuration/config.json"

# 5. Per-tenant configs folder (optional) — for the `use-tenant.sh`
#    script that swaps between tenants without rebuilding.
if [[ -d configs ]]; then
  cp -R configs "$STAGE/configs"
fi
if [[ -f scripts/use-tenant.sh ]]; then
  mkdir -p "$STAGE/scripts"
  cp scripts/use-tenant.sh "$STAGE/scripts/use-tenant.sh"
  chmod +x "$STAGE/scripts/use-tenant.sh"
fi

# 6. Double-click launchers + the plain-language HOW TO RUN.txt so the
#    client never has to type a command. The .command file is the
#    macOS double-click runner; .bat is Windows; .sh is Linux. The
#    HOW TO RUN.txt is what they should read first.
if [[ -d scripts/launchers ]]; then
  cp "scripts/launchers/HOW TO RUN.txt"          "$STAGE/HOW TO RUN.txt"
  cp "scripts/launchers/Start Server.command"    "$STAGE/Start Server.command"
  cp "scripts/launchers/Start Server.bat"        "$STAGE/Start Server.bat"
  cp "scripts/launchers/Start Server.sh"         "$STAGE/Start Server.sh"
  chmod +x "$STAGE/Start Server.command" \
           "$STAGE/Start Server.sh"
fi

echo "==> Zipping..."
( cd "$OUT_DIR" && zip -qr "$NAME.zip" "$NAME" )

SIZE=$(du -h "$ZIP" | awk '{print $1}')
echo ""
echo "✓ Done."
echo "  Bundle:   $ZIP  ($SIZE)"
echo "  Contains: server.js, .next/static, public/, configuration/, configs/, scripts/"
echo ""
echo "  Send the zip to the client. They unzip and run:"
echo "      PORT=3000 node server.js"
