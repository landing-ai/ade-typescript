# Copilot instructions — landing-ai/ade-typescript

## Repository context

This is the LandingAI ADE TypeScript SDK. `client.v2` is a **hand-maintained ergonomic
layer** (unified `Job` polling, dual-host routing, schema coercion) that is intentionally
**not** described by the OpenAPI spec. Generated reference types live under
`specs/_generated/` (e.g. `specs/_generated/v2-aide.d.ts`); the shipped, more-ergonomic
surface lives under `src/resources/`. When reviewing, do not report the shipped V2 surface
as "diverging from the spec" when the divergence is this deliberate ergonomic layer.

## Reviewing automated spec-sync PRs

PRs authored by `spec-sync[bot]` on branch `spec-sync/v2` arrive as **up to two commits,
in this order**:

1. **Mechanical snapshot** — `chore(spec-sync): update V2 spec snapshot + regenerated
reference types`. Touches `specs/v2-aide.json` and `specs/_generated/` **only**. By
   design it does **not** wire the client: no new resources, methods, public types,
   exports, tests, or docs. This is expected and correct.
2. **AI wiring** — `feat(spec-sync): wire client.v2 to spec diff (AI)`. Adds the client
   resources / methods / types / exports / tests / docs for the spec diff. This commit
   **may be absent**: workflow-only drift and AI no-ops legitimately produce a
   mechanical-only PR.

When performing a code review on these PRs:

- Review the PR **in its current state, as a whole**. If only the mechanical snapshot
  commit is present, do **not** report the absence of client wiring (missing resources,
  methods, public types, exports, tests, or docs) as an issue — a follow-up wiring commit
  handles it, or the drift is intentionally mechanical-only. Treat the un-wired snapshot as
  complete for now, and do not enumerate the wiring a later commit is expected to add.
- Once the wiring commit is present, focus the review on whether the wired surface matches
  the spec diff: routes, parameter names, request/response fields, required-vs-optional,
  and sync/async (job) surface consistency.
- Do **not** flag the prose inside the snapshot files (`specs/v2-aide.json`,
  `specs/_generated/`) — `summary` / `description` / `title` wording and the like. Those files
  are a verbatim mirror of the upstream OpenAPI spec (fetched live from staging on each sync) and are
  regenerated on every sync, so they cannot be edited in this repo. Wording fixes — e.g. a
  build-schema endpoint whose `summary` reads `"ADE Extract"`, or a build-schema jobs endpoint
  described as an "Extract job" — must land upstream, not here.

## Known-intentional SDK conventions (do not report)

- `saveTo` directory-mode filenames are intentionally `{method}_output.json` when no single
  input file or URL can be derived. Methods whose inputs are arrays or absent — e.g.
  `client.v2.buildSchema` (`markdowns` / `markdown_urls`) and `client.v2.ground` — pass
  `_getInputFilename(null, null)` on purpose, mirroring the shared V1/V2 helper. This is
  deliberate and consistent; do not report it as lost input-derived naming.
