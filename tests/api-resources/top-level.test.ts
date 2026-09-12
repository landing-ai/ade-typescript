import LandingAIADE, { UnsupportedMediaTypeError, toFile } from 'landingai-ade';
import type { Fetch } from 'landingai-ade/internal/builtin-types';

const client = new LandingAIADE({
  apikey: 'My Apikey',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

/** A client backed by a stub fetch that always replies with `response`. */
function stubClient(response: () => Response): LandingAIADE {
  const fetch: Fetch = async () => response();
  return new LandingAIADE({ apikey: 'k', baseURL: 'http://127.0.0.1:4010', maxRetries: 0, fetch });
}

describe('top level methods', () => {
  // Mock server tests are disabled
  test.skip('classify: only required params', async () => {
    const responsePromise = client.classify({ classes: [{ class: 'class' }] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('classify: required and optional params', async () => {
    const response = await client.classify({
      classes: [{ class: 'class', description: 'description' }],
      document: await toFile(Buffer.from('Example data'), 'README.md'),
      document_url: 'document_url',
      model: 'model',
    });
  });

  // Mock server tests are disabled
  test.skip('extract: only required params', async () => {
    const responsePromise = client.extract({ schema: 'schema' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('extract: required and optional params', async () => {
    const response = await client.extract({
      schema: 'schema',
      markdown: await toFile(Buffer.from('Example data'), 'README.md'),
      markdown_url: 'markdown_url',
      model: 'model',
      strict: true,
    });
  });

  test('extract surfaces a 415 as UnsupportedMediaTypeError', async () => {
    // The spec documents a 415 on this route for a body that is not form-encoded.
    // The route sends multipart/form-data, so a caller only reaches this by
    // overriding content-type -- but the status must still map to its own class
    // rather than falling through to the bare APIError.
    const stubbed = stubClient(
      () => new Response(null, { status: 415, statusText: 'Unsupported Media Type' }),
    );
    const call = stubbed.extract({ schema: '{}' });
    await expect(call).rejects.toBeInstanceOf(UnsupportedMediaTypeError);
    await expect(call).rejects.toMatchObject({ status: 415 });
  });

  // Mock server tests are disabled
  test.skip('extractBuildSchema', async () => {
    const responsePromise = client.extractBuildSchema({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('parse', async () => {
    const responsePromise = client.parse({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('section', async () => {
    const responsePromise = client.section({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('split: only required params', async () => {
    const responsePromise = client.split({ split_class: [{ name: 'name' }] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('split: required and optional params', async () => {
    const response = await client.split({
      split_class: [
        {
          name: 'name',
          description: 'description',
          identifier: 'identifier',
        },
      ],
      markdown: await toFile(Buffer.from('Example data'), 'README.md'),
      markdown_url: 'markdown_url',
      model: 'model',
    });
  });
});
