# LandingAI ADE TypeScript API Library

[![NPM version](<https://img.shields.io/npm/v/landingai-ade.svg?label=npm%20(stable)>)](https://npmjs.org/package/landingai-ade) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/landingai-ade)

This library provides convenient access to the LandingAI ADE REST API from server-side TypeScript or JavaScript.

The REST API documentation can be found on [docs.landing.ai](https://docs.landing.ai/). The full API of this library can be found in [api.md](api.md).

It is generated with [Stainless](https://www.stainless.com/).

## MCP Server

Use the LandingAI ADE MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=landingai-ade-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImxhbmRpbmdhaS1hZGUtbWNwIl0sImVudiI6eyJWSVNJT05fQUdFTlRfQVBJX0tFWSI6Ik15IEFwaWtleSJ9fQ)
[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22landingai-ade-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22landingai-ade-mcp%22%5D%2C%22env%22%3A%7B%22VISION_AGENT_API_KEY%22%3A%22My%20Apikey%22%7D%7D)

> Note: You may need to set environment variables in your MCP client.

## Installation

```sh
npm install landingai-ade
```

## Usage

The full API of this library can be found in [api.md](api.md).

### Parse

```js
import LandingAIADE from 'landingai-ade';
import fs from 'fs';

const client = new LandingAIADE({
  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted
  environment: 'eu', // defaults to 'production'
});

const response = await client.parse({ document: fs.createReadStream('path/to/file'), model: 'dpt-2-latest', saveTo: './output_folder' });
// optional: saves as {input_file}_parse_output.json in the specified folder

console.log(response.chunks);
```

### Parse Jobs

For processing large documents asynchronously:

```js
import LandingAIADE from 'landingai-ade';
import fs from 'fs';

const client = new LandingAIADE({
  apikey: process.env['VISION_AGENT_API_KEY'],
});

// Create an async parse job
const job = await client.parseJobs.create({
  document: fs.createReadStream('path/to/large_file.pdf'),
});
console.log(`Job created with ID: ${job.job_id}`);

// Get job status
const jobStatus = await client.parseJobs.get(job.job_id);
console.log(`Status: ${jobStatus.status}`);

// List all jobs (with optional filtering)
const response = await client.parseJobs.list({
  status: 'completed',
  page: 0,
  pageSize: 10,
});
for (const job of response.jobs) {
  console.log(`Job ${job.job_id}: ${job.status}`);
}
```

### Extract

Extract structured data from markdown using a JSON schema:

```js
import LandingAIADE from 'landingai-ade';
import fs from 'fs';

// Define your JSON schema
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: "Person's name"
    },
    age: {
      type: 'number',
      description: "Person's age"
    }
  },
  required: ['name', 'age']
};

const client = new LandingAIADE({
  apikey: process.env['VISION_AGENT_API_KEY'],
});

const response = await client.extract({
  schema: JSON.stringify(schema),
  markdown: fs.createReadStream('path/to/file.md')
});
```

For advanced type-safe schemas with full TypeScript inference, see [Using Zod for Type-Safe Schemas](#using-zod-for-type-safe-schemas).


### Split
Split parsed documents into separate sections based on classification rules and identifiers.

```
import LandingAIADE from 'landingai-ade';
import fs from 'fs';

const client = new LandingAIADE();

// Parse the document
const parseResponse = await client.parse({
  document: fs.createReadStream('/path/to/document.pdf'),
  model: 'dpt-2-latest',
});

// Define Split Rules
const splitClass = [
  {
    name: 'Bank Statement',
    description:
      'Document from a bank that summarizes all account activity over a period of time.',
  },
  {
    name: 'Pay Stub',
    description:
      "Document that details an employee's earnings, deductions, and net pay for a specific pay period.",
    identifier: 'Pay Stub Date',
  },
];

// Split using the Markdown string from parse response
const splitResponse = await client.split({
  split_class: splitClass,
  markdown: parseResponse.markdown, // Pass Markdown string directly
  model: 'split-latest',
});

// Access the splits
for (const split of splitResponse.splits) {
  console.log(`Classification: ${split.classification}`);
  console.log(`Identifier: ${split.identifier}`);
  console.log(`Pages: ${split.pages}`);
}
```

### Request & Response types

This library includes TypeScript definitions for all request params and response fields. You may import and use them like so:

<!-- prettier-ignore -->
```ts
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE({
  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted
  environment: 'eu', // defaults to 'production'
});

const response: LandingAIADE.ParseResponse = await client.parse();
```

Documentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.

## File uploads

Request parameters that correspond to file uploads can be passed in many different forms:

- `File` (or an object with the same structure)
- a `fetch` `Response` (or an object with the same structure)
- an `fs.ReadStream`
- the return value of our `toFile` helper

```ts
import fs from 'fs';
import LandingAIADE, { toFile } from 'landingai-ade';

const client = new LandingAIADE();

// If you have access to Node `fs` we recommend using `fs.createReadStream()`:
await client.parse({ document: fs.createReadStream('/path/to/file') });

// Or if you have the web `File` API you can pass a `File` instance:
await client.parse({ document: new File(['my bytes'], 'file') });

// You can also pass a `fetch` `Response`:
await client.parse({ document: await fetch('https://somesite/file') });

// Finally, if none of the above are convenient, you can use our `toFile` helper:
await client.parse({ document: await toFile(Buffer.from('my bytes'), 'file') });
await client.parse({ document: await toFile(new Uint8Array([0, 1, 2]), 'file') });
```

## Using Zod for Type-Safe Schemas

You can use [Zod](https://zod.dev) to define type-safe schemas for the `extract` endpoint. This provides full TypeScript type inference and validation for your extracted data.

### Basic Pattern

The key is to convert your Zod schema to JSON Schema format:

```ts
import LandingAIADE, { toFile } from 'landingai-ade';
import { z } from 'zod';

// 1. Define your schema using Zod
const InvoiceSchema = z.object({
  invoiceNumber: z.string().describe('Invoice number or ID'),
  invoiceDate: z.string().describe('Date the invoice was issued'),
  vendor: z.object({
    name: z.string(),
    address: z.string().optional(),
  }),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    total: z.number().positive(),
  })),
  totalAmount: z.number().describe('Total amount due'),
});

// 2. Get TypeScript type from the schema
type Invoice = z.infer<typeof InvoiceSchema>;

const client = new LandingAIADE({
  apikey: process.env['VISION_AGENT_API_KEY'],
});

// 3. Convert Zod schema to JSON Schema string for the API
const jsonSchemaString = JSON.stringify(z.toJSONSchema(InvoiceSchema));

// 4. Use it with the extract endpoint
const result = await client.extract({
  schema: jsonSchemaString,
  markdown: await toFile(Buffer.from(markdownContent), 'document.md'),
});

// 5. The extraction is now typed as Invoice
const invoice: Invoice = result.extraction as Invoice;
console.log(invoice.invoiceNumber); // TypeScript knows this is a string
console.log(invoice.totalAmount);   // TypeScript knows this is a number
```

Note: Zod is optional. You can also pass JSON Schema strings directly to the `extract` endpoint if you prefer.

## Handling errors

When the library is unable to connect to the API,
or if the API returns a non-success status code (i.e., 4xx or 5xx response),
a subclass of `APIError` will be thrown:

<!-- prettier-ignore -->
```ts
const response = await client.parse().catch(async (err) => {
  if (err instanceof LandingAIADE.APIError) {
    console.log(err.status); // 400
    console.log(err.name); // BadRequestError
    console.log(err.headers); // {server: 'nginx', ...}
  } else {
    throw err;
  }
});
```

Error codes are as follows:

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

Certain errors will be automatically retried 2 times by default, with a short exponential backoff.
Connection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,
429 Rate Limit, and >=500 Internal errors will all be retried by default.

You can use the `maxRetries` option to configure or disable this:

<!-- prettier-ignore -->
```js
// Configure the default for all requests:
const client = new LandingAIADE({
  maxRetries: 0, // default is 2
});

// Or, configure per-request:
await client.parse({
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 8 minutes by default. You can configure this with a `timeout` option:

<!-- prettier-ignore -->
```ts
// Configure the default for all requests:
const client = new LandingAIADE({
  timeout: 20 * 1000, // 20 seconds (default is 8 minutes)
});

// Override per-request:
await client.parse({
  timeout: 5 * 1000,
});
```

On timeout, an `APIConnectionTimeoutError` is thrown.

Note that requests which time out will be [retried twice by default](#retries).

## Advanced Usage

### Accessing raw Response data (e.g., headers)

The "raw" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.
This method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.

You can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.
Unlike `.asResponse()` this method consumes the body, returning once it is parsed.

<!-- prettier-ignore -->
```ts
const client = new LandingAIADE();

const response = await client.parse().asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText); // access the underlying Response object

const { data: response, response: raw } = await client.parse().withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(response.chunks);
```

### Logging

> [!IMPORTANT]
> All log messages are intended for debugging only. The format and content of log messages
> may change between releases.

#### Log levels

The log level can be configured in two ways:

1. Via the `LANDINGAI_ADE_LOG` environment variable
2. Using the `logLevel` client option (overrides the environment variable if set)

```ts
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE({
  logLevel: 'debug', // Show all log messages
});
```

Available log levels, from most to least verbose:

- `'debug'` - Show debug messages, info, warnings, and errors
- `'info'` - Show info messages, warnings, and errors
- `'warn'` - Show warnings and errors (default)
- `'error'` - Show only errors
- `'off'` - Disable all logging

At the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.
Some authentication-related headers are redacted, but sensitive data in request and response bodies
may still be visible.

#### Custom logger

By default, this library logs to `globalThis.console`. You can also provide a custom logger.
Most logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.

When providing a custom logger, the `logLevel` option still controls which messages are emitted, messages
below the configured level will not be sent to your logger.

```ts
import LandingAIADE from 'landingai-ade';
import pino from 'pino';

const logger = pino();

const client = new LandingAIADE({
  logger: logger.child({ name: 'LandingAIADE' }),
  logLevel: 'debug', // Send all messages to pino, allowing it to filter
});
```

### Making custom/undocumented requests

This library is typed for convenient access to the documented API. If you need to access undocumented
endpoints, params, or response properties, the library can still be used.

#### Undocumented endpoints

To make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.
Options on the client, such as retries, will be respected when making these requests.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

#### Undocumented request params

To make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented
parameter. This library doesn't validate at runtime that the request matches the type, so any extra values you
send will be sent as-is.

```ts
client.parse({
  // ...
  // @ts-expect-error baz is not yet public
  baz: 'undocumented option',
});
```

For requests with the `GET` verb, any extra params will be in the query, all other requests will send the
extra param in the body.

If you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request
options.

#### Undocumented response properties

To access undocumented response properties, you may access the response object with `// @ts-expect-error` on
the response object, or cast the response object to the requisite type. Like the request params, we do not
validate or strip extra properties from the response from the API.

### Customizing the fetch client

By default, this library expects a global `fetch` function is defined.

If you want to use a different `fetch` function, you can either polyfill the global:

```ts
import fetch from 'my-fetch';

globalThis.fetch = fetch;
```

Or pass it to the client:

```ts
import LandingAIADE from 'landingai-ade';
import fetch from 'my-fetch';

const client = new LandingAIADE({ fetch });
```

### Fetch options

If you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)

```ts
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

#### Configuring proxies

To modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy
options to requests:

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg" align="top" width="18" height="21"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>

```ts
import LandingAIADE from 'landingai-ade';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new LandingAIADE({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg" align="top" width="18" height="21"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>

```ts
import LandingAIADE from 'landingai-ade';

const client = new LandingAIADE({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg" align="top" width="18" height="21"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>

```ts
import LandingAIADE from 'npm:landingai-ade';

const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new LandingAIADE({
  fetchOptions: {
    client: httpClient,
  },
});
```

## Frequently Asked Questions

## Semantic versioning

This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

1. Changes that only affect static types, without breaking runtime behavior.
2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_
3. Changes that we do not expect to impact the vast majority of users in practice.

We take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.

We are keen for your feedback; please open an [issue](https://www.github.com/landing-ai/ade-typescript/issues) with questions, bugs, or suggestions.

## Requirements

TypeScript >= 4.9 is supported.

The following runtimes are supported:

- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.
- Deno v1.28.0 or higher.
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or greater with the `"node"` environment (`"jsdom"` is not supported at this time).
- Nitro v2.6 or greater.

Note that React Native is not supported at this time.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Contributing

See [the contributing documentation](./CONTRIBUTING.md).
