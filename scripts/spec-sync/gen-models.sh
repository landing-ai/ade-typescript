#!/usr/bin/env bash
# Generate REFERENCE TypeScript types from a committed spec snapshot.
# Output is committed under specs/_generated/ as an input for the AI wiring phase and for
# human review — it is NOT shipped and does NOT replace the hand-written types in src/resources/**.
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "usage: gen-models.sh <spec-path> <out-path>" >&2
  exit 2
fi

spec="$1"
out="$2"
here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"

mkdir -p "$(dirname "$out")"
# Pinned in package.json: codegen output is version-sensitive, so the committed reference
# types must be regenerated with the same openapi-typescript version to stay byte-stable.
"$root/node_modules/.bin/openapi-typescript" "$spec" --output "$out"
