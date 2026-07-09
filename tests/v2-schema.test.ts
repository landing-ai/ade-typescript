import { LandingAIADEError } from 'landingai-ade';
import { coerceSchema } from 'landingai-ade/lib/schema';

describe('coerceSchema', () => {
  test('passes a JSON-Schema object through', () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } } };
    expect(coerceSchema(schema)).toBe(schema);
  });

  test('parses a JSON string into an object', () => {
    expect(coerceSchema('{"type":"object"}')).toEqual({ type: 'object' });
  });

  test('rejects a JSON string that decodes to a non-object', () => {
    expect(() => coerceSchema('[1,2,3]')).toThrow(LandingAIADEError);
  });

  test('rejects an invalid JSON string', () => {
    expect(() => coerceSchema('not json')).toThrow(LandingAIADEError);
  });

  test('rejects an unsupported type', () => {
    expect(() => coerceSchema(123 as any)).toThrow(LandingAIADEError);
  });
});
