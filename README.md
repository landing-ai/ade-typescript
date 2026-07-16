<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="logo-white.svg">
  <source media="(prefers-color-scheme: light)" srcset="logo-black.svg">
  <img src="logo-black.svg" alt="LandingAI" width="420" />
</picture>

# Agentic Document Extraction TypeScript Library

[![NPM version](<https://img.shields.io/npm/v/landingai-ade.svg?label=npm%20(stable)>)](https://npmjs.org/package/landingai-ade) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/landingai-ade)

**[Docs](https://docs.landing.ai) · [Playground](https://ade.landing.ai) · [LandingAI](https://landing.ai)**

</div>

The official TypeScript library for the [LandingAI Agentic Document Extraction (ADE) API](https://ade.landing.ai). Parse PDFs and images into structured, grounded Markdown, then extract typed fields with a JSON Schema or a Zod schema.

- Fully typed request params and response types
- Zero runtime dependencies, with support for Node.js, Deno, Bun, browsers, and edge runtimes
- Async jobs with a built-in `wait()` helper for large documents
- Automatic retries with exponential backoff
- Optional `saveTo` parameter to write responses to disk

## Installation

```sh
npm install landingai-ade
```

## Set Your API Key

[Generate an API key](https://ade.landing.ai/settings/api-key), then export it as an environment variable. The client reads it automatically.

```sh
export VISION_AGENT_API_KEY=<your-api-key>
```

You can also pass the key directly with `new LandingAIADE({ apikey: ... })`. To keep keys out of source control, use a tool like [dotenv](https://www.npmjs.com/package/dotenv).

## Quickstart

Parse a document, then extract structured data from it:

```ts
import fs from 'fs';
import { z } from 'zod';
import LandingAIADE from 'landingai-ade';

const Invoice = z.object({
  invoice_number: z.string().describe('The invoice number'),
  total: z.string().describe('Invoice grand total'),
});

const client = new LandingAIADE(); // reads VISION_AGENT_API_KEY

// 1. Parse: convert the document to structured Markdown
const parsed = await client.v2.parse({ document: fs.createReadStream('invoice.pdf') });
console.log(parsed.markdown);

// 2. Extract: pull typed fields out of the Markdown
const result = await client.v2.extract({
  schema: z.toJSONSchema(Invoice),
  markdown: parsed.markdown!,
});
console.log(result.extraction);
```

Zod is optional: `schema` also accepts a plain JSON Schema object or a JSON string. See [Extract](#extract).

Use `client.v2` for new projects. It is the current API, powered by the DPT-3 model family. The earlier v1 methods (`client.parse`, `client.extract`, `client.split`, and others) remain fully supported; see [v1 API](#v1-api).

The full method reference for both APIs is in [api.md](api.md); usage guides are at [docs.landing.ai](https://docs.landing.ai).

## Parse

Use `client.v2.parse` to convert a document into Markdown plus a structure tree in which every node carries its spatial grounding inline (the page it appears on, its range into the Markdown, and a bounding box in normalized page coordinates). Provide exactly one of `document` (a local file) or `document_url`.

```ts
import fs from 'fs';
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE();

// Parse a local file
const parsed = await client.v2.parse({
  document: fs.createReadStream('path/to/file.pdf'),
  model: 'dpt-3-pro-latest', // optional; defaults to the latest DPT-3 Pro model
  saveTo: './output', // optional; saves as {input_file}_parse_output.json
});

console.log(parsed.markdown); // full document as Markdown
console.log(parsed.metadata?.page_count); // pages processed

// Or parse a file at a URL
const fromUrl = await client.v2.parse({ document_url: 'https://example.com/file.pdf' });
```

The response is a `V2ParseResponse`:

| Field       | Description                                                                                                                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `markdown`  | The full document as one Markdown string, in reading order.                                                                                                                                                                                                         |
| `structure` | A typed tree (`document` → pages → elements). Each node carries a `grounding` object — its page, its `{ start, end }` range into `markdown`, and a bounding box in normalized (`0`–`1`) page coordinates; leaf elements also carry fine-grained `atomic_grounding`. |
| `metadata`  | Processing details: `page_count`, `failed_pages`, `range_units` (offsets are Unicode code points), `duration_ms`, and `billing` (credits used).                                                                                                                     |

If some pages cannot be parsed, the request still succeeds (HTTP 206) and `metadata.failed_pages` lists the pages that failed. If a synchronous parse times out, the client throws `V2SyncTimeoutError`; use [jobs](#process-large-documents-asynchronously-jobs) instead.

The `document` parameter accepts an `fs.ReadStream`, a web `File`, a `fetch` `Response`, or the `toFile` helper; see [File Uploads](#file-uploads).

## Extract

Use `client.v2.extract` to pull structured fields out of Markdown (typically from a parse response) using a schema. The `schema` parameter accepts a JSON Schema object or a JSON string. Provide exactly one Markdown source: `markdown` or `markdown_url`.

```ts
import fs from 'fs';
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE();
const parsed = await client.v2.parse({ document: fs.createReadStream('path/to/file.pdf') });

const result = await client.v2.extract({
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: "Person's full name" },
      age: { type: 'number', description: "Person's age" },
    },
  },
  markdown: parsed.markdown!, // or markdown_url: 'https://example.com/doc.md'
  saveTo: './output', // optional
});

console.log(result.extraction); // { name: '...', age: ... }
console.log(result.extraction_metadata); // per-field source ranges in the Markdown
```

The response is a `V2ExtractResult`:

| Field                 | Description                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `extraction`          | The extracted values, matching your schema.                                                                                 |
| `extraction_metadata` | Mirrors `extraction`; each field carries the `{ value, ranges }` (code-point ranges into the Markdown the value came from). |
| `markdown`            | The Markdown the extraction ran against, echoed back.                                                                       |
| `metadata`            | Processing details, including credits used.                                                                                 |

By default, unsupported schema fields are skipped and extraction continues. Pass `strict: true` to reject such schemas with an error (HTTP 422) instead.

### Type-Safe Schemas with Zod

Define the schema with [Zod](https://zod.dev) (v4 or later) to get full TypeScript inference for the extracted data:

```ts
import fs from 'fs';
import { z } from 'zod';
import LandingAIADE from 'landingai-ade';

const PersonSchema = z.object({
  name: z.string().describe("Person's full name"),
  age: z.number().describe("Person's age"),
});

type Person = z.infer<typeof PersonSchema>;

const client = new LandingAIADE();
const parsed = await client.v2.parse({ document: fs.createReadStream('path/to/file.pdf') });

const result = await client.v2.extract({
  schema: z.toJSONSchema(PersonSchema),
  markdown: parsed.markdown!,
});

const person = result.extraction as Person;
console.log(person.name); // TypeScript knows this is a string
console.log(person.age); // TypeScript knows this is a number
```

## Process Large Documents Asynchronously (Jobs)

For documents that take longer than a synchronous request allows, create a job and wait for it. `client.v2.parseJobs` and `client.v2.extractJobs` share the same shape: `create`, `get`, `list`, and `wait`.

```ts
import fs from 'fs';
import LandingAIADE, { JobFailedError, JobWaitTimeoutError } from 'landingai-ade';

const client = new LandingAIADE();

const job = await client.v2.parseJobs.create({
  document: fs.createReadStream('path/to/large_file.pdf'),
  service_tier: 'standard', // 'standard' (default, lower cost) or 'priority' (faster)
});
console.log(job.job_id, job.status);

// Block until the job finishes (polls with backoff)
try {
  const done = await client.v2.parseJobs.wait(job.job_id, {
    timeout: 600_000, // milliseconds; default is 10 minutes
    raiseOnFailure: true,
  });
  const result = done.result as LandingAIADE.V2ParseResponse | null;
  console.log(result?.markdown?.slice(0, 200)); // a cancelled job can be terminal with no result
} catch (err) {
  if (err instanceof JobWaitTimeoutError) {
    console.log('Job did not finish in time; it is still running server-side.');
  } else if (err instanceof JobFailedError) {
    console.log(`Job failed: ${err.message}`);
  } else {
    throw err;
  }
}
```

The `create`, `get`, and `wait` methods return a normalized `Job` with `job_id`, `status` (`pending`, `processing`, `completed`, `failed`, or `cancelled`), `progress`, `result`, `error`, `is_terminal`, and `raw` (the unmodified API envelope, for any field not surfaced on the typed shape). The `list` method returns a `JobList` with a `jobs` array and `has_more`, plus the `page`/`page_size` pagination fields; `org_id` is populated only by older parse envelopes. Fields an endpoint doesn't populate are `null`.

```ts
// Poll manually instead of blocking
const current = await client.v2.parseJobs.get(job.job_id);

// List jobs, with optional filtering
const jobs = await client.v2.parseJobs.list({ status: 'completed', page: 0, page_size: 10 });
for (const j of jobs.jobs) {
  console.log(j.job_id, j.status);
}
console.log(jobs.has_more);
```

Extract jobs work the same way. The `create` method takes the same schema and Markdown arguments as `client.v2.extract`, plus `service_tier` and `output_save_url`; it does not accept `saveTo`. Set `output_save_url` to a public http(s) URL (e.g. a presigned S3 PUT URL) to have the finished result delivered there instead of inline — the completed job then reports `output_url` on `job.raw` in place of `result`.

## Environments

The `environment` option selects the region. Set it in code or with the `LANDINGAI_ADE_ENVIRONMENT` environment variable.

```ts
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE({ environment: 'eu' }); // 'production' (default) or 'eu'
```

API keys are per-environment: an EU key works only with `environment: 'eu'`.

## v1 API

The v1 methods sit directly on the client.

| Method                           | What it does                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `client.parse(...)`              | Parse a document with the DPT-2 model family. Also supports spreadsheets and other Office formats. |
| `client.extract(...)`            | Extract fields from Markdown. The `schema` parameter takes a JSON string.                          |
| `client.split(...)`              | Split a multi-document file into sub-documents by classification.                                  |
| `client.classify(...)`           | Classify each page of a document.                                                                  |
| `client.section(...)`            | Generate a hierarchical table of contents.                                                         |
| `client.extractBuildSchema(...)` | Generate an extraction schema from sample documents.                                               |
| `client.parseJobs`               | Async parse jobs (`create`, `get`, `list`).                                                        |
| `client.extractJobs`             | Async extract jobs (`create`, `get`, `list`).                                                      |

```ts
import fs from 'fs';
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE();

// Split a combined file into sub-documents
const parsed = await client.parse({
  document: fs.createReadStream('statements.pdf'),
  model: 'dpt-2-latest',
});

const splitClass = [
  { name: 'Bank Statement', description: 'Summarizes account activity over a period.' },
  { name: 'Pay Stub', description: "Details an employee's earnings for a pay period." },
];

const split = await client.split({
  split_class: JSON.stringify(splitClass) as any,
  markdown: parsed.markdown,
  model: 'split-latest',
});

for (const s of split.splits) {
  console.log(s.classification, s.pages);
}
```

## Handling Errors

When the library is unable to connect to the API, or if the API returns a non-success status code (4xx or 5xx), a subclass of `APIError` is thrown. The v2 helper errors are separate: `V2SyncTimeoutError`, `JobWaitTimeoutError`, and `JobFailedError` do not extend `APIError`, so catch them explicitly.

```ts
import LandingAIADE, { V2SyncTimeoutError } from 'landingai-ade';

const client = new LandingAIADE();

try {
  await client.v2.parse({ document_url: 'https://example.com/file.pdf' });
} catch (err) {
  if (err instanceof V2SyncTimeoutError) {
    console.log('The synchronous request timed out; use parseJobs for this document.');
  } else if (err instanceof LandingAIADE.APIError) {
    console.log(err.status); // 400
    console.log(err.constructor.name); // BadRequestError
    console.log(err.headers); // {server: 'nginx', ...}
  } else {
    throw err;
  }
}
```

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |
| N/A         | `APIConnectionError`       |

### Retries

Connection errors, 408, 409, 429, and 5xx responses are retried twice by default with a short exponential backoff. Configure with `maxRetries`:

```ts
// Configure the default for all requests:
const client = new LandingAIADE({ maxRetries: 0 }); // default is 2

// Or, configure per-request:
await client.v2.parse({ document_url: 'https://example.com/file.pdf' }, { maxRetries: 5 });
```

The synchronous v2 methods (`parse` and `extract`) cap retries at 1 by default, because the server cancels the work on a timeout and retrying a doomed request wastes time; the per-request `maxRetries` option overrides this.

### Timeouts

Requests time out after 8 minutes by default. Configure with `timeout` (in milliseconds):

```ts
// Configure the default for all requests:
const client = new LandingAIADE({ timeout: 20 * 1000 }); // 20 seconds

// Override per-request:
await client.v2.parse({ document_url: 'https://example.com/file.pdf' }, { timeout: 5 * 1000 });
```

On a client-side timeout, an `APIConnectionTimeoutError` is thrown, and the request is retried by default. The v2 synchronous endpoints also have a server-side wait window: exceeding it returns HTTP 504 and throws `V2SyncTimeoutError` instead; switch to [jobs](#process-large-documents-asynchronously-jobs) for those documents.

## Advanced Usage

### Accessing Raw Response Data (e.g. Headers)

The v1 methods return an `APIPromise` with two helpers (these cover the v1 methods only, not `client.v2.*`):

- `.asResponse()` resolves with the raw `fetch` `Response` as soon as the headers arrive, without consuming the body.
- `.withResponse()` resolves with both the parsed data and the raw `Response`.

```ts
import fs from 'fs';
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE();

const response = await client.parse({ document: fs.createReadStream('file.pdf') }).asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText);

const { data, response: raw } = await client
  .parse({ document: fs.createReadStream('file.pdf') })
  .withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(data.chunks);
```

### File Uploads

Request parameters that correspond to file uploads (such as `document`, `markdown`, and `file`) can be passed in several forms:

- a `File` (or an object with the same structure)
- a `fetch` `Response` (or an object with the same structure)
- an `fs.ReadStream`
- the return value of the `toFile` helper

```ts
import fs from 'fs';
import LandingAIADE, { toFile } from 'landingai-ade';

const client = new LandingAIADE();

// If you have access to Node `fs` we recommend using `fs.createReadStream()`:
await client.v2.parse({ document: fs.createReadStream('/path/to/file.pdf') });

// Or if you have the web `File` API you can pass a `File` instance:
await client.v2.parse({ document: new File(['my bytes'], 'file.pdf') });

// You can also pass a `fetch` `Response`:
await client.v2.parse({ document: await fetch('https://somesite/file.pdf') });

// Finally, if none of the above are convenient, you can use our `toFile` helper:
await client.v2.parse({ document: await toFile(Buffer.from('my bytes'), 'file.pdf') });
```

### Logging

Set the `LANDINGAI_ADE_LOG` environment variable (or the `logLevel` client option, which takes precedence) to control logging. Levels, from most to least verbose: `debug`, `info`, `warn` (default), `error`, and `off`. At `debug`, all HTTP requests and responses are logged, including headers and bodies.

```sh
export LANDINGAI_ADE_LOG=debug
```

By default, the library logs to `globalThis.console`. Pass a custom logger with the `logger` client option; most logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), and [consola](https://www.npmjs.com/package/consola).

### Making Custom or Undocumented Requests

Use `client.get`, `client.post`, and the other HTTP verb methods to call undocumented endpoints; client options such as retries still apply. To send undocumented parameters on a documented method, use `// @ts-expect-error` (the library does not validate params at runtime, so extra values are sent as-is), or set them explicitly with the `query`, `body`, and `headers` request options. Undocumented response properties can be read by casting the response object.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

### Customizing the Fetch Client

By default, the library expects a global `fetch` function. To use a different implementation, pass it to the client:

```ts
import LandingAIADE from 'landingai-ade';
import fetch from 'my-fetch';

const client = new LandingAIADE({ fetch });
```

To set custom `RequestInit` options (per-client or per-request), use `fetchOptions`. This is also how you configure a proxy for your runtime:

```ts
// Node.js (undici)
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new LandingAIADE({ fetchOptions: { dispatcher: proxyAgent } });
```

```ts
// Bun
const client = new LandingAIADE({ fetchOptions: { proxy: 'http://localhost:8888' } });
```

```ts
// Deno
const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new LandingAIADE({ fetchOptions: { client: httpClient } });
```

### Importing Types

All request and response types are exported, both as named exports and on the `LandingAIADE` namespace:

```ts
import LandingAIADE from 'landingai-ade';

const parsed: LandingAIADE.V2ParseResponse = await client.v2.parse({ document_url: '...' });
```

## Versioning

This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

1. Changes that only affect static types, without breaking runtime behavior.
2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_
3. Changes that we do not expect to impact the vast majority of users in practice.

We take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.

## Requirements

TypeScript >= 4.9 is supported.

The following runtimes are supported:

- Web browsers (up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions
- Deno v1.28.0 or higher
- Bun 1.0 or later
- Cloudflare Workers
- Vercel Edge Runtime
- Jest 28 or greater with the `"node"` environment (`"jsdom"` is not supported at this time)
- Nitro v2.6 or greater

Note that React Native is not supported at this time.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Contributing

See [the contributing documentation](./CONTRIBUTING.md). We welcome [issues](https://www.github.com/landing-ai/ade-typescript/issues) with questions, bugs, or suggestions.
