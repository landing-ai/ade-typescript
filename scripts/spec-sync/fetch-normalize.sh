#!/usr/bin/env bash
# Fetch a live OpenAPI spec and emit normalized (stable, key-sorted) JSON to stdout.
# Normalization makes byte-diffs meaningful: same spec content -> identical bytes.
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: fetch-normalize.sh <spec-url>" >&2
  exit 2
fi

url="$1"
# `jq -S` sorts object keys only; array element order (e.g. `required`, `enum`, `tags`) is
# preserved as emitted by the backend. This assumes the gateway emits arrays deterministically.
# If it ever reorders them, drift detection would fire on cosmetic churn (phantom PRs) — start
# debugging false drift here.
# Capture + validate: a 200 response with an empty/whitespace body would otherwise make `jq -S .`
# emit nothing and exit 0 — a silent "empty spec" that check-drift would treat as drift and commit,
# clobbering the committed snapshot. Reject empty output loudly instead. (Malformed JSON already
# fails via jq's non-zero exit under pipefail.)
normalized="$(curl -fsSL --max-time 30 --retry 3 --retry-delay 2 "$url" | jq -S .)"
if [ -z "$normalized" ]; then
  echo "fetch-normalize: empty/blank spec from $url" >&2
  exit 1
fi
printf '%s\n' "$normalized"
