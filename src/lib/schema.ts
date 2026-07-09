import { LandingAIADEError } from '../core/error';

/**
 * A JSON Schema accepted by `client.v2.extract` — either a JSON-Schema object or
 * a JSON-encoded string that decodes to one.
 *
 * Note: unlike the Python SDK (which additionally accepts a pydantic model,
 * since pydantic is a core dependency there), this SDK stays dependency-free and
 * does not bundle a schema library. Pass a JSON Schema object directly, or
 * convert your schema (e.g. via `zod-to-json-schema`) before calling.
 */
export type ExtractSchema = Record<string, unknown> | string;

/**
 * Coerce an accepted `schema` value into a plain JSON-Schema object. The V2
 * extract endpoint takes `schema` as a JSON object in the request body.
 */
export function coerceSchema(schema: ExtractSchema): Record<string, unknown> {
  if (typeof schema === 'string') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(schema);
    } catch (err) {
      throw new LandingAIADEError(`schema is not valid JSON: ${(err as Error).message}`);
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new LandingAIADEError('schema JSON string must decode to an object');
    }
    return parsed as Record<string, unknown>;
  }
  if (typeof schema === 'object' && schema !== null && !Array.isArray(schema)) {
    return schema;
  }
  throw new LandingAIADEError(`Unsupported schema type: ${typeof schema}`);
}
