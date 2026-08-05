import LandingAIADE, { toFile } from 'landingai-ade';
import fs from 'fs';
import path from 'path';

// V1 end-to-end suite against the LIVE PRODUCTION API (api.va.landing.ai).
//
// Unlike v1-smoke.test.ts / v2-smoke.test.ts (staging, run on `spec-sync/*` PRs by
// pr-gates.yml), this file is excluded from BOTH the default `./scripts/test` run and
// `yarn test:contract`. It runs only via `yarn test:production`, which CI invokes from
// .github/workflows/e2e-production.yml — manually, and as the pre-tag gate in
// release.yml.
//
// COST: a full pass exercises parse, extract, build-schema, classify, section, split
// and both job types against production, so it spends real inference credits and leaves
// real job records in the production org. Do not wire this to a per-PR trigger.
const apiKey = process.env['LANDINGAI_ADE_PRODUCTION_APIKEY'];
const runIf = apiKey ? test : test.skip;

// `environment: 'production'` resolves the V1 host from the environment map rather than
// hardcoding api.va.landing.ai, so this covers that mapping too.
const newClient = () => new LandingAIADE({ apikey: apiKey!, environment: 'production' });

// The same fixture the Python SDK's production suite uses: a real 2-page PDF with text,
// tables and figures. The page count is asserted below, so swapping the file means
// updating that constant.
const SAMPLE_PDF = path.join(__dirname, 'sample.pdf');
const SAMPLE_PAGE_COUNT = 2;
const pdfBytes = fs.readFileSync(SAMPLE_PDF);

// A fresh File per request: a single stream would be consumed by the first upload.
const sampleDocument = () => toFile(pdfBytes, 'sample.pdf', { type: 'application/pdf' });

// V1 `extract` takes the JSON Schema pre-serialized as a string (unlike `client.v2.extract`,
// which also accepts a plain object).
const EXTRACT_SCHEMA = JSON.stringify({
  type: 'object',
  properties: { title: { type: 'string', description: 'The document title' } },
});

// `classes` / `split_class` are nested arrays on a multipart/form-data body, and the V1
// spec notes for both that they "can be provided as a JSON string in form data" — that
// JSON string is the wire format the API actually parses (and what the README shows with
// `JSON.stringify(splitClass) as any`). Passing a real array instead lets the client
// form-encode it as `classes[][class]=...`, which the API does not accept. The generated
// types still say `Array<...>`, so cast through `unknown` to keep the proven format; `T`
// is inferred from the parameter it is passed to.
const asJsonFormField = <T>(value: unknown): T => JSON.stringify(value) as unknown as T;

const TERMINAL_STATUSES = ['completed', 'failed', 'cancelled'];

/**
 * Poll a V1 job to a terminal status. V1 has no `wait` helper (unlike
 * `client.v2.parseJobs.wait`), so the polling loop lives here rather than in the SDK.
 */
async function waitForJob<T extends { status: string }>(
  get: () => Promise<T>,
  { timeoutMs = 300_000, pollIntervalMs = 3_000 }: { timeoutMs?: number; pollIntervalMs?: number } = {},
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const job = await get();
    if (TERMINAL_STATUSES.includes(job.status)) return job;
    if (Date.now() >= deadline) {
      throw new Error(`job still '${job.status}' after ${timeoutMs}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}

/**
 * List jobs, retrying briefly until the page is non-empty. Each caller has just completed a
 * job under this key, so the completed-jobs list must be non-empty; the retry only absorbs
 * read-after-write lag in list indexing. Returns the last response either way, so the
 * caller's non-empty assertion fails with context rather than the status loop passing
 * vacuously on an empty page.
 */
async function listUntilNonEmpty<T extends { jobs: unknown[] }>(
  list: () => Promise<T>,
  { attempts = 4, delayMs = 3_000 }: { attempts?: number; delayMs?: number } = {},
): Promise<T> {
  let listed = await list();
  for (let i = 1; i < attempts && listed.jobs.length === 0; i++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    listed = await list();
  }
  return listed;
}

describe('V1 e2e (production)', () => {
  // One real parse, shared by every markdown-consuming test below. `section` specifically
  // needs the anchor-annotated markdown a parse emits, and extract / split / build-schema
  // all work off the same text — parsing once holds the per-run production spend to a
  // single parse instead of five. In a `beforeAll` rather than in the first test so the
  // tests below do not depend on declaration order. Jest skips `beforeAll` entirely when
  // every test in the block is skipped, so no key means no production call.
  let parsed: LandingAIADE.ParseResponse;
  let parsedMarkdown = '';

  beforeAll(async () => {
    if (!apiKey) return;
    parsed = await newClient().parse({ document: await sampleDocument(), split: 'page' });
    parsedMarkdown = parsed.markdown;
  }, 180_000);

  runIf(
    'parse returns markdown, chunks, and per-page splits',
    async () => {
      const res = parsed;

      expect(res.markdown).toBeTruthy();
      expect(res.chunks.length).toBeGreaterThan(0);
      for (const chunk of res.chunks) {
        expect(chunk.id).toBeTruthy();
        expect(chunk.type).toBeTruthy();
      }

      expect(res.metadata.page_count).toBe(SAMPLE_PAGE_COUNT);
      expect(res.metadata.job_id).toBeTruthy();
      // `split: 'page'` splits at the page level, so there is exactly one split per page.
      expect(res.splits).toHaveLength(SAMPLE_PAGE_COUNT);
      for (const split of res.splits) {
        expect(split.markdown).toBeTruthy();
        expect(split.pages.length).toBeGreaterThan(0);
        expect(split.chunks.length).toBeGreaterThan(0);
      }
    },
    180_000,
  );

  runIf(
    'extract returns a structured extraction off parsed markdown',
    async () => {
      expect(parsedMarkdown).toBeTruthy();
      const res = await newClient().extract({ schema: EXTRACT_SCHEMA, markdown: parsedMarkdown });

      expect(res.extraction).toBeDefined();
      expect(res.extraction_metadata).toBeDefined();
      expect(res.metadata.job_id).toBeTruthy();
      // Set only when the output could not be made to conform to the schema; a healthy
      // extraction against this schema leaves it null.
      expect(res.metadata.schema_violation_error ?? null).toBeNull();
    },
    120_000,
  );

  runIf(
    'extractBuildSchema generates a JSON Schema from the document',
    async () => {
      expect(parsedMarkdown).toBeTruthy();
      const res = await newClient().extractBuildSchema({
        markdowns: [parsedMarkdown],
        prompt: 'Capture the document title and any totals it reports.',
      });

      // `extraction_schema` is the JSON Schema serialized as a *string*, not an object.
      const generated = JSON.parse(res.extraction_schema);
      expect(generated.type).toBe('object');
      expect(generated.properties).toBeDefined();
    },
    120_000,
  );

  runIf(
    'classify assigns one class per page',
    async () => {
      const res = await newClient().classify({
        document: await sampleDocument(),
        classes: asJsonFormField([
          { class: 'invoice', description: 'A bill for goods or services.' },
          { class: 'report', description: 'A narrative or financial report.' },
        ]),
      });

      expect(res.metadata.page_count).toBe(SAMPLE_PAGE_COUNT);
      // Exactly one classification per page: pages that cannot be classified come back
      // as 'unknown' rather than being dropped, so the count is stable.
      expect(res.classification).toHaveLength(SAMPLE_PAGE_COUNT);
      expect(new Set(res.classification.map((c) => c.page)).size).toBe(SAMPLE_PAGE_COUNT);
      for (const page of res.classification) {
        expect(page.class).toBeTruthy();
      }
    },
    120_000,
  );

  runIf(
    'section builds a table of contents from parsed markdown',
    async () => {
      expect(parsedMarkdown).toBeTruthy();
      const res = await newClient().section({ markdown: parsedMarkdown });

      expect(typeof res.table_of_contents_md).toBe('string');
      // Not asserted non-empty: a document with no headings legitimately sections into an
      // empty table of contents. Every entry that *is* returned must be well-formed.
      for (const entry of res.table_of_contents) {
        expect(entry.title).toBeTruthy();
        expect(entry.start_reference).toBeTruthy();
        expect(entry.level).toBeGreaterThanOrEqual(0);
      }
    },
    120_000,
  );

  runIf(
    'split partitions markdown into classified groups',
    async () => {
      expect(parsedMarkdown).toBeTruthy();
      const res = await newClient().split({
        markdown: parsedMarkdown,
        split_class: asJsonFormField([
          { name: 'financials', description: 'Sections presenting figures or tables.' },
          { name: 'narrative', description: 'Prose sections.' },
        ]),
      });

      expect(res.metadata.page_count).toBe(SAMPLE_PAGE_COUNT);
      expect(res.splits.length).toBeGreaterThan(0);
      for (const split of res.splits) {
        expect(split.classification).toBeTruthy();
        expect(split.markdowns.length).toBeGreaterThan(0);
        expect(split.pages.length).toBeGreaterThan(0);
      }
    },
    120_000,
  );

  runIf(
    'parseJobs creates, completes, and lists a job',
    async () => {
      const client = newClient();
      const created = await client.parseJobs.create({ document: await sampleDocument() });
      expect(created.job_id).toBeTruthy();

      const job = await waitForJob(() => client.parseJobs.get(created.job_id));
      expect(job.status).toBe('completed');
      expect(job.progress).toBe(1);
      expect(job.job_id).toBe(created.job_id);

      // Delivery is either inline on `data` or, for results over 1MB (and for ZDR orgs),
      // a presigned `output_url`. sample.pdf sits near that boundary once grounding is
      // included, so accept both rather than pinning one.
      expect(job.data != null || job.output_url != null).toBe(true);
      if (job.data != null) {
        expect(job.data.markdown).toBeTruthy();
        expect(job.data.chunks.length).toBeGreaterThan(0);
      }

      // Verify the `status` filter server-side. We just completed a parse job under this
      // key, so the completed list must be non-empty — assert that (with a short retry for
      // list-indexing lag) so a `list` regression that always returns `[]` can't pass this
      // gate vacuously. We assert the filter holds rather than that our specific job is on
      // page 0, which would be flaky on a busy production org.
      const listed = await listUntilNonEmpty(() =>
        client.parseJobs.list({ page: 0, pageSize: 10, status: 'completed' }),
      );
      expect(listed.jobs.length).toBeGreaterThan(0);
      for (const listedJob of listed.jobs) {
        expect(listedJob.job_id).toBeTruthy();
        expect(listedJob.status).toBe('completed');
      }
    },
    360_000,
  );

  runIf(
    'extractJobs creates, completes, and lists a job',
    async () => {
      expect(parsedMarkdown).toBeTruthy();
      const client = newClient();
      const created = await client.extractJobs.create({
        schema: EXTRACT_SCHEMA,
        markdown: parsedMarkdown,
      });
      expect(created.job_id).toBeTruthy();

      const job = await waitForJob(() => client.extractJobs.get(created.job_id));
      expect(job.status).toBe('completed');
      expect(job.progress).toBe(1);
      expect(job.job_id).toBe(created.job_id);

      expect(job.data != null || job.output_url != null).toBe(true);
      if (job.data != null) {
        expect(job.data.extraction).toBeDefined();
        expect(job.data.extraction_metadata).toBeDefined();
        expect(job.data.metadata.job_id).toBeTruthy();
      }

      const listed = await listUntilNonEmpty(() =>
        client.extractJobs.list({ page: 0, pageSize: 10, status: 'completed' }),
      );
      expect(listed.jobs.length).toBeGreaterThan(0);
      for (const listedJob of listed.jobs) {
        expect(listedJob.job_id).toBeTruthy();
        expect(listedJob.status).toBe('completed');
      }
    },
    360_000,
  );
});
