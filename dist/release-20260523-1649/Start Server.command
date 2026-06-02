#!/usr/bin/env bash
# macOS double-click launcher for the eMasjid Web standalone bundle.
# Finder treats *.command files as runnable scripts: a double-click opens
# Terminal and runs this file from the folder containing it.

set -e
cd "$(dirname "$0")"

PORT="${PORT:-3000}"
URL="http://localhost:$PORT"

clear
echo "═══════════════════════════════════════════════════"
echo "  eMasjid Web — Starting local server"
echo "═══════════════════════════════════════════════════"
echo

# Confirm Node.js exists. macOS doesn't ship with Node by default; if
# it's missing we point users at the official installer rather than
# failing silently in a Terminal window that may auto-close.
if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node.js is not installed on this Mac."
  echo
  echo "  Please install Node.js (the 'LTS' option is recommended):"
  echo "      https://nodejs.org/"
  echo
  echo "  After installing, double-click this file again."
  echo
  read -n 1 -s -r -p "Press any key to close..."
  exit 1
fi

echo "  Node.js version: $(node -v)"
echo "  Server URL:      $URL"
echo
echo "  Opening your browser in a moment..."
echo "  (Keep this window open — closing it stops the server.)"
echo
echo "═══════════════════════════════════════════════════"
echo

# Open browser shortly after the server starts. We launch open in a
# subshell with a sleep so it fires AFTER node binds to the port.
(sleep 2 && open "$URL") &

# Foreground the server — quit it with Ctrl+C or by closing the window.
PORT="$PORT" node server.js
