#!/usr/bin/env bash
# Fail if the RELEASED public API of landingai-ade changed in a BREAKING way.
# Baseline = the API report committed at the last release tag: the released surface is the
# promise to users; merged-but-unreleased surface stays mutable. ADDITIVE changes (new exports,
# new interface members, new response fields) are allowed; only REMOVALS and signature changes fail.
#
# This is the griffe equivalent for TypeScript. @microsoft/api-extractor emits a deterministic,
# key-sorted API report (etc/landingai-ade.api.md) but does NOT itself classify breaking-vs-additive
# (its native check fails on ANY report change). So we compare the HEAD report against the report
# committed at the last release tag and fail only on lines PRESENT IN THE BASELINE BUT MISSING FROM
# HEAD — i.e. a removed export or a mutated signature. A pure addition contributes only new lines
# and passes.
#
# ASSUMPTION (holds for this SDK): request params are modeled as interfaces (e.g. `V2ExtractParams
# { schema; markdown?; ... }`), so adding an optional request field is a NEW line inside the
# interface (additive, passes) rather than a change to a method's argument line. Adding an optional
# *positional* parameter to an existing method would false-positive here — but that is not this
# SDK's style; bundle new inputs into the params interface instead.
#
# Determinism rests on a PINNED api-extractor version + the stable sorted report + stripping
# TSDoc/comment lines before comparing. If this ever fires on cosmetic churn (a phantom break),
# start debugging here.
set -uo pipefail

report="etc/landingai-ade.api.md"

baseline_tag="$(git describe --tags --abbrev=0 --match 'v*' 2>/dev/null || true)"
if [ -z "$baseline_tag" ]; then
  echo "surface-lock: no release tag found; skipping (nothing released yet)."
  exit 0
fi

if ! git cat-file -e "$baseline_tag:$report" 2>/dev/null; then
  echo "surface-lock: no API report committed at $baseline_tag; skipping."
  echo "  (dormant until the first release after api-extractor was introduced carries $report)."
  exit 0
fi

if [ ! -f "$report" ]; then
  echo "surface-lock: $report is missing at HEAD; run 'yarn api-extractor' and commit it." >&2
  exit 1
fi

echo "surface-lock: checking $report against $baseline_tag"

# Keep only declaration lines: drop `import` lines (scripts/spec-sync/strip-api-report.cjs already
# removes the path-volatile fetch-typing imports, but strip here too so the gate is robust even if
# the report was generated without that step), TSDoc/comment lines (incl. api-extractor's `// @public`
# markers), and blank lines — so cosmetic churn never reads as an API change.
normalize() { grep -vE '^import ' | grep -vE '^[[:space:]]*(//|/\*|\*|\*/)' | grep -vE '^[[:space:]]*$'; }

# Plain `sort` (NOT sort -u): `comm` then respects multiplicity, so removing one of two identical
# member lines (e.g. a `value: string;` that also occurs in another interface) is still caught.
removed="$(comm -23 \
  <(git show "$baseline_tag:$report" | normalize | sort) \
  <(normalize < "$report" | sort))"

if [ -n "$removed" ]; then
  echo "surface-lock: BREAKING change to the released public API (removed or changed):" >&2
  printf '%s\n' "$removed" | sed 's/^/  - /' >&2
  echo "" >&2
  echo "If this is an intentional break (a major release), add the 'breaking-change-approved'" >&2
  echo "label to the PR to bypass this gate." >&2
  exit 1
fi

echo "surface-lock: no breaking changes (additions allowed)."
exit 0
