#!/usr/bin/env bash
# Linux launcher. Run from a file manager (Right-click → Run) or terminal.

set -e
cd "$(dirname "$0")"

PORT="${PORT:-3000}"
URL="http://localhost:$PORT"

echo "==================================================="
echo "  eMasjid Web — Starting local server"
echo "==================================================="
echo

if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node.js is not installed."
  echo
  echo "  Install Node.js (LTS recommended):"
  echo "      https://nodejs.org/  or use your distro's package manager"
  exit 1
fi

echo "  Node.js version: $(node -v)"
echo "  Server URL:      $URL"
echo
echo "  Open your browser at $URL"
echo "  (Press Ctrl+C to stop the server.)"
echo
echo "==================================================="
echo

# Try to auto-open the browser if a launcher is available.
( sleep 2 && (xdg-open "$URL" 2>/dev/null || true) ) &

PORT="$PORT" node server.js
