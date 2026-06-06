#!/usr/bin/env bash
#
# security-scan.sh — Build the production image and scan it for CVEs the
# SAME way the AWS/Trivy pipeline does. Proves whether the next/postcss
# upgrade actually cleared the vulnerabilities in the SHIPPED image.
#
# Requirements: docker (Trivy itself runs from its official image, so you
# do NOT need to install Trivy locally).
#
# Usage:
#   ./scripts/security-scan.sh              # build + scan, fail on HIGH/CRITICAL
#   ./scripts/security-scan.sh --no-build   # scan the existing image only
#   SEVERITY=CRITICAL ./scripts/security-scan.sh   # only fail on CRITICAL
#
set -euo pipefail
cd "$(dirname "$0")/.."

IMAGE="${IMAGE:-cms-display:latest}"
SEVERITY="${SEVERITY:-HIGH,CRITICAL}"
TRIVY_IMAGE="aquasec/trivy:latest"
CACHE_DIR="${HOME}/.cache/trivy"

echo "==================================================="
echo "  Security scan"
echo "  image    : ${IMAGE}"
echo "  severity : ${SEVERITY} (build fails if any are found)"
echo "==================================================="

if [[ "${1:-}" != "--no-build" ]]; then
  echo "→ Building production image (this runs 'yarn build' inside Docker)..."
  docker build -t "${IMAGE}" .
else
  echo "→ Skipping build (--no-build); scanning existing ${IMAGE}"
fi

mkdir -p "${CACHE_DIR}"

# 1) Full human-readable report (vuln + secret), matching the AWS output.
echo
echo "→ Full report:"
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "${CACHE_DIR}:/root/.cache/" \
  "${TRIVY_IMAGE}" image \
  --scanners vuln,secret \
  --pkg-types library,os \
  "${IMAGE}"

# 2) Gate: exit non-zero if any HIGH/CRITICAL remain. This is the part
#    that tells you PASS/FAIL — same threshold a CI/registry gate uses.
echo
echo "→ Gate check (${SEVERITY}):"
if docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "${CACHE_DIR}:/root/.cache/" \
  "${TRIVY_IMAGE}" image \
  --scanners vuln \
  --severity "${SEVERITY}" \
  --exit-code 1 \
  --ignore-unfixed=false \
  "${IMAGE}"; then
  echo
  echo "✅ PASS — no ${SEVERITY} vulnerabilities in ${IMAGE}"
else
  echo
  echo "❌ FAIL — ${SEVERITY} vulnerabilities still present (see report above)"
  exit 1
fi
