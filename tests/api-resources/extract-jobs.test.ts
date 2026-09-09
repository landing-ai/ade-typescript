import LandingAIADE, { UnsupportedMediaTypeError } from 'landingai-ade';
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

describe('resource extractJobs', () => {
  // Mock server tests are disabled
  test.skip('create', async () => {
    const responsePromise = client.extractJobs.create({ schema: 'schema' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.extractJobs.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.extractJobs.list(
        {
          page: 0,
          pageSize: 1,
          status: 'cancelled',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(LandingAIADE.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('get', async () => {
    const responsePromise = client.extractJobs.get('job_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create surfaces a 415 as UnsupportedMediaTypeError', async () => {
    // The spec documents a 415 on this route for a body that is not form-encoded.
    // The route sends multipart/form-data, so a caller only reaches this by
    // overriding content-type -- but the status must still map to its own class
    // rather than falling through to the bare APIError.
    const stubbed = stubClient(
      () => new Response(null, { status: 415, statusText: 'Unsupported Media Type' }),
    );
    const call = stubbed.extractJobs.create({ schema: '{}' });
    await expect(call).rejects.toBeInstanceOf(UnsupportedMediaTypeError);
    await expect(call).rejects.toMatchObject({ status: 415 });
  });
});
