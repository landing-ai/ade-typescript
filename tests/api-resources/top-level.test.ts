// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LandingAIADE, { toFile } from 'landingai-ade';

const client = new LandingAIADE({
  apikey: 'My Apikey',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('top level methods', () => {
  // Prism tests are disabled
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

  // Prism tests are disabled
  test.skip('extract: required and optional params', async () => {
    const response = await client.extract({
      schema: 'schema',
      markdown: await toFile(Buffer.from('# my file contents'), 'README.md'),
      markdown_url: 'markdown_url',
      model: 'model',
    });
  });

  // Prism tests are disabled
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
});
