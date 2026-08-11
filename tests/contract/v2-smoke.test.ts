import LandingAIADE, { toFile } from 'landingai-ade';
import fs from 'fs';
import path from 'path';

// V2 (`client.v2`) contract smoke test. Like the V1 one, it hits the LIVE staging API — gated on a
// real key, excluded from the default `./scripts/test` run, and required only on `spec-sync/*`
// branches (see .github/workflows/pr-gates.yml). Run locally with `yarn test:contract`.
//
// Two-host reminder: `environment: 'staging'` routes V2 to the API host api.ade.staging.landing.ai
// (NOT the aide gateway, which only serves the spec).
const apiKey = process.env['LANDINGAI_ADE_STAGING_APIKEY'];
const runIf = apiKey ? test : test.skip;

const SAMPLE_MARKDOWN = '# Acme Inc. — Q1 Report\n\nTotal revenue for the quarter was **$1,250,000**.\n';
const SAMPLE_PDF = path.join(__dirname, 'sample.pdf');

/** Every `atomic_grounding` entry in a parse structure tree, depth-first. */
function atomicGrounding(structure: LandingAIADE.V2ParseStructure | null | undefined) {
  const out: LandingAIADE.V2Grounding[] = [];
  const walk = (el: LandingAIADE.V2ParseElement) => {
    out.push(...(el.atomic_grounding ?? []));
    for (const child of el.children ?? []) walk(child);
  };
  for (const page of structure?.children ?? []) {
    for (const el of page.children ?? []) walk(el);
  }
  return out;
}

describe('V2 contract (staging)', () => {
  runIf(
    'extract (sync) returns a structured extraction with range_units metadata',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const res = await client.v2.extract({
        schema: { type: 'object', properties: { revenue: { type: 'string' } } },
        markdown: SAMPLE_MARKDOWN,
      });
      expect(res.extraction).toBeDefined();
      // Wired by the V2 spec-sync: ranges are declared in code-point units, and
      // `version` was renamed to `model_version` in the metadata.
      expect(res.metadata.range_units).toBe('unicode_codepoints');
      expect(typeof res.metadata.model_version).toBe('string');
    },
    60_000,
  );

  runIf(
    'ground (sync) resolves extracted fields to structure blocks',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      // Ground is a pure, stateless join of an extraction's `{value, ranges}`
      // leaves against the `grounding.range` on each `structure` block, so a
      // self-consistent synthetic pair exercises the route without a full
      // parse→extract chain. The single field's range overlaps `text-1`.
      const box = { xmin: 0.1, ymin: 0.12, xmax: 0.42, ymax: 0.15 };
      const res = await client.v2.ground({
        extraction_metadata: {
          invoice_number: { value: 'INV-042', ranges: [{ start: 13, end: 31 }] },
        },
        structure: {
          type: 'document',
          children: [
            {
              type: 'page',
              page: 1,
              children: [
                {
                  type: 'text',
                  id: 'text-1',
                  grounding: { page: 1, range: { start: 13, end: 31 }, box },
                },
              ],
            },
          ],
        },
      });
      expect(res.grounding).toBeDefined();
      expect(res.grounding['invoice_number']).toBeDefined();
      expect(typeof res.metadata.job_id).toBe('string');
    },
    60_000,
  );

  runIf(
    'extractJobs job envelope carries the metadata receipt field',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const created = await client.v2.extractJobs.create({
        schema: { type: 'object', properties: { revenue: { type: 'string' } } },
        markdown: SAMPLE_MARKDOWN,
      });
      const done = await client.v2.extractJobs.wait(created.job_id, { timeout: 120_000 });
      expect(done.is_terminal).toBe(true);
      // Wired by the V2 spec-sync: the job envelope now carries a top-level
      // `metadata` receipt alongside `output_url` when the result was delivered
      // to an `output_save_url`. This job is inline, so the receipt is `null`
      // and the metadata lives on the result instead.
      expect(done.metadata === null || typeof done.metadata === 'object').toBe(true);
      if (done.status === 'completed' && done.raw['output_url'] == null) {
        expect(done.metadata).toBeNull();
        const result = done.result as LandingAIADE.V2ExtractResult;
        expect(typeof result.metadata.duration_ms).toBe('number');
      }
    },
    180_000,
  );

  runIf(
    'parse (sync) reports atomic_grounding confidence on a word-granularity model',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      // Wired by the V2 spec-sync: `atomic_grounding` entries now carry a
      // `confidence`. `dpt-3-fast` grounds at WORD granularity, and every word
      // segment reports the lowest per-character OCR confidence in that word;
      // node-level `grounding` never carries one.
      const res = await client.v2.parse({
        document: await toFile(fs.readFileSync(SAMPLE_PDF), 'sample.pdf', { type: 'application/pdf' }),
        model: 'dpt-3-fast',
        options: { atomic_grounding: true },
      });
      const atoms = atomicGrounding(res.structure);
      expect(atoms.length).toBeGreaterThan(0);
      for (const g of atoms) {
        expect(g.confidence === null || typeof g.confidence === 'number').toBe(true);
        if (typeof g.confidence === 'number') {
          expect(g.confidence).toBeGreaterThanOrEqual(0);
          expect(g.confidence).toBeLessThanOrEqual(1);
        }
      }
      // Only assert presence once the request actually landed on a word-granularity
      // snapshot — a line-granularity model legitimately omits the field.
      if (res.metadata?.model_version?.startsWith('dpt-3-fast')) {
        expect(atoms.some((g) => typeof g.confidence === 'number')).toBe(true);
      }
      const pageGrounding = res.structure?.children?.[0]?.grounding;
      if (pageGrounding) {
        expect(pageGrounding.confidence ?? null).toBeNull();
      }
    },
    180_000,
  );

  runIf(
    'parseJobs.list returns a normalized JobList against the new envelope',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const list = await client.v2.parseJobs.list({ page: 0, page_size: 1 });
      expect(Array.isArray(list.jobs)).toBe(true);
      for (const job of list.jobs) {
        expect(typeof job.job_id).toBe('string');
        // The list envelope now emits ISO-8601 timestamps; the normalizer maps
        // them to `Date` (or `null` when absent).
        expect(job.created_at === null || job.created_at instanceof Date).toBe(true);
      }
    },
    30_000,
  );
});
