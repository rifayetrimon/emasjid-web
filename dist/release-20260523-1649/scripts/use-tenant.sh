#!/usr/bin/env bash
# Switch the active tenant config without rebuilding.
#
# Usage:  ./scripts/use-tenant.sh client1
#         ./scripts/use-tenant.sh client2
#
# Looks for configs/<name>.json, validates JSON, copies it to
# configuration/config.json, then reloads PM2 (if installed) so the
# Node server picks up the new file on the very next request.
#
# Requires: jq (for validation), pm2 (optional — for zero-downtime reload).

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <tenant-name>"
  echo "       tenant configs live in configs/<tenant-name>.json"
  exit 64
fi

NAME="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/configs/$NAME.json"
DST="$ROOT/configuration/config.json"

if [[ ! -f "$SRC" ]]; then
  echo "✗ no config found at $SRC"
  echo "  available tenants:"
  ls "$ROOT/configs" 2>/dev/null | sed -E 's/\.json$//' | sed 's/^/    /'
  exit 1
fi

# Validate JSON (the app strips // comments at parse time, but we still
# want valid JSON minus comments here).
if command -v jq >/dev/null 2>&1; then
  # Strip JS-style comments before validating — config.json supports them.
  sed -E 's:[[:space:]]*//.*$::' "$SRC" \
    | sed -E ':a;N;$!ba;s:/\*[^*]*\*+([^/*][^*]*\*+)*/::g' \
    | jq empty
fi

# Back up the previous active config so it's recoverable.
if [[ -f "$DST" ]]; then
  cp "$DST" "$DST.bak"
fi

cp "$SRC" "$DST"
echo "✓ switched to tenant: $NAME"
echo "  source: $SRC"
echo "  active: $DST"

# Hot-reload the running Node process if PM2 manages it. PM2 'reload' is
# zero-downtime; falls back to 'restart' which causes a brief blip.
if command -v pm2 >/dev/null 2>&1; then
  if pm2 jlist 2>/dev/null | grep -q '"name"'; then
    pm2 reload all >/dev/null 2>&1 && echo "✓ pm2 reload all"
  fi
else
  echo "  (PM2 not found — restart your Node process manually for the change to take effect on cached modules)"
fi
