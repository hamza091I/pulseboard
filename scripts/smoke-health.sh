#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
EXPECTED='{"status":"ok","service":"pulseboard"}'
RESPONSE="$(curl --fail --silent --show-error "${BASE_URL}/api/health")"

if [[ "$RESPONSE" != "$EXPECTED" ]]; then
  echo "Unexpected health response: $RESPONSE" >&2
  exit 1
fi

echo "Health check passed for ${BASE_URL}"
