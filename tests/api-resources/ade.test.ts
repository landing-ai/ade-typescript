// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Ade, { toFile } from 'ade-typescript';

const client = new Ade({
  username: 'My Username',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource ade', () => {
  // Prism tests are disabled
  test.skip('extractData: only required params', async () => {
    const responsePromise = client.ade.extractData({ schema: 'schema' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('extractData: required and optional params', async () => {
    const response = await client.ade.extractData({
      schema: 'schema',
      markdown: await toFile(Buffer.from('# my file contents'), 'README.md'),
      markdown_url: 'markdown_url',
    });
  });

  // Prism tests are disabled
  test.skip('parseDocument', async () => {
    const responsePromise = client.ade.parseDocument({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
