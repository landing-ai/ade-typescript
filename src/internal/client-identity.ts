import { getPlatformHeaders } from './detect-platform';

/**
 * Client identity attached to every API request (see landing-ai/ade-typescript#96).
 *
 * The AIDE gateway relays these two headers into the recorded `inference_history`
 * row so SDK traffic is distinguishable from raw API calls:
 *
 * - `X-Source: sdk` — names the row's `source` column (the coarse API/CLI/SDK
 *   split; `sdk` is already live in the platform's `InferenceHistorySource` enum).
 * - a structured `User-Agent` — parsed platform-side into os/arch/runtime dimensions.
 *
 * The User-Agent grammar is shared with ade-cli (its `docs/user-agent.md`) and
 * parsed by vision-agent-ui's `parseUserAgent.ts`:
 *
 *     ade-typescript/<version> (<os> <arch>) <runtime>/<major>
 *
 * The parser owns the grammar, not the vocabulary: the leading token identifies
 * the product, the parenthesized comment fills os/arch *only* when it is exactly
 * two space-separated words with no `;`/`,`, and every remaining `key/value`
 * token is captured generically — so appending further tokens later (e.g. an
 * HTTP-lib token, host-app detection) needs no platform change.
 *
 * Nothing here throws: identity must never fail a request, so every lookup
 * degrades to a placeholder.
 */

/** `X-Source` value: the coarse API/CLI/SDK split. */
export const SOURCE = 'sdk';

/**
 * Leading product token. `ade-typescript` (not the package name `landingai-ade`)
 * keeps the two SDKs separable — the Python SDK uses `ade-python`.
 */
const PRODUCT = 'ade-typescript';

const PLACEHOLDER = 'unknown';

/**
 * Keep only visible-ASCII token characters; collapse everything else into a
 * single `-`. This covers what would break the parser's `(<os> <arch>)` shape
 * (whitespace, `;`/`,`, parentheses) AND non-ASCII values, so an exotic platform
 * string can never split into extra "words" or smuggle a non-header-safe byte in.
 */
const cleanToken = (value: string): string =>
  value.replace(/[^A-Za-z0-9._:+-]+/g, '-').replace(/^-+|-+$/g, '') || PLACEHOLDER;

/**
 * Build the structured `User-Agent`. Never throws.
 *
 * `version` is the SDK version the client already holds (`VERSION`), so the
 * identity never depends on a runtime package.json read. os/arch/runtime come
 * from the SDK's shared platform detection; exotic or missing values degrade to
 * placeholders so a malformed token never ships.
 */
export function buildUserAgent(version: string): string {
  let os = PLACEHOLDER;
  let arch = PLACEHOLDER;
  // Documented grammar leads with `node/<major>`; other runtimes report their
  // own name (`browser:<name>` collapses to a clean single-word key).
  let runtime = PLACEHOLDER;
  let runtimeMajor = PLACEHOLDER;
  try {
    const platform = getPlatformHeaders();
    os = cleanToken(platform['X-Stainless-OS'] || PLACEHOLDER);
    arch = cleanToken(platform['X-Stainless-Arch'] || PLACEHOLDER);
    runtime = cleanToken((platform['X-Stainless-Runtime'] || PLACEHOLDER).split(':')[0]!);
    runtimeMajor = /\d+/.exec(platform['X-Stainless-Runtime-Version'] || '')?.[0] ?? PLACEHOLDER;
  } catch {
    // Exotic runtime with no platform detection — keep placeholders rather than
    // fail the request over identity.
  }
  return `${PRODUCT}/${cleanToken(version)} (${os} ${arch}) ${runtime}/${runtimeMajor}`;
}
