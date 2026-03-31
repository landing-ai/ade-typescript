// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import MiniSearch from 'minisearch';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { getLogger } from './logger';

type PerLanguageData = {
  method?: string;
  example?: string;
};

type MethodEntry = {
  name: string;
  endpoint: string;
  httpMethod: string;
  summary: string;
  description: string;
  stainlessPath: string;
  qualified: string;
  params?: string[];
  response?: string;
  markdown?: string;
  perLanguage?: Record<string, PerLanguageData>;
};

type ProseChunk = {
  content: string;
  tag: string;
  sectionContext?: string;
  source?: string;
};

type MiniSearchDocument = {
  id: string;
  kind: 'http_method' | 'prose';
  name?: string;
  endpoint?: string;
  summary?: string;
  description?: string;
  qualified?: string;
  stainlessPath?: string;
  content?: string;
  sectionContext?: string;
  _original: Record<string, unknown>;
};

type SearchResult = {
  results: (string | Record<string, unknown>)[];
};

const EMBEDDED_METHODS: MethodEntry[] = [
  {
    name: 'extract',
    endpoint: '/v1/ade/extract',
    httpMethod: 'post',
    summary: 'ADE Extract',
    description:
      'Extract structured data from Markdown using a JSON schema.\n\nThis endpoint\n    processes Markdown content and extracts structured data according to the provided\n    JSON schema.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/extract`.',
    stainlessPath: '(resource) $client > (method) extract',
    qualified: 'client.extract',
    params: ['schema: string;', 'markdown?: string | string;', 'markdown_url?: string;', 'model?: string;'],
    response:
      '{ extraction: object; extraction_metadata: object; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; version: string; fallback_model_version?: string; schema_violation_error?: string; }; }',
    markdown:
      "## extract\n\n`client.extract(schema: string, markdown?: string | string, markdown_url?: string, model?: string): { extraction: object; extraction_metadata: object; metadata: object; }`\n\n**post** `/v1/ade/extract`\n\nExtract structured data from Markdown using a JSON schema.\n\nThis endpoint\n    processes Markdown content and extracts structured data according to the provided\n    JSON schema.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/extract`.\n\n### Parameters\n\n- `schema: string`\n  JSON schema for field extraction. This schema determines what key-values pairs are extracted from the Markdown. The schema must be a valid JSON object and will be validated before processing the document.\n\n- `markdown?: string | string`\n  The Markdown file or Markdown content to extract data from.\n\n- `markdown_url?: string`\n  The URL to the Markdown file to extract data from.\n\n- `model?: string`\n  The version of the model to use for extraction. Use `extract-latest` to use the latest version.\n\n### Returns\n\n- `{ extraction: object; extraction_metadata: object; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; version: string; fallback_model_version?: string; schema_violation_error?: string; }; }`\n\n  - `extraction: object`\n  - `extraction_metadata: object`\n  - `metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; version: string; fallback_model_version?: string; schema_violation_error?: string; }`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst response = await client.extract({ schema: 'schema' });\n\nconsole.log(response);\n```",
  },
  {
    name: 'parse',
    endpoint: '/v1/ade/parse',
    httpMethod: 'post',
    summary: 'ADE Parse',
    description:
      'Parse a document or spreadsheet.\n\nThis endpoint parses documents (PDF, images)\n    and spreadsheets (XLSX, CSV) into structured Markdown, chunks, and metadata.\n    \n\n For EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/parse`.',
    stainlessPath: '(resource) $client > (method) parse',
    qualified: 'client.parse',
    params: [
      'custom_prompts?: string;',
      'document?: string;',
      'document_url?: string;',
      'model?: string;',
      'password?: string;',
      "split?: 'page';",
    ],
    response:
      '{ chunks: { id: string; grounding: { box: parse_grounding_box; page: number; }; markdown: string; type: string; }[]; markdown: string; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }; splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]; grounding?: object; }',
    markdown:
      "## parse\n\n`client.parse(custom_prompts?: string, document?: string, document_url?: string, model?: string, password?: string, split?: 'page'): { chunks: object[]; markdown: string; metadata: parse_metadata; splits: object[]; grounding?: object; }`\n\n**post** `/v1/ade/parse`\n\nParse a document or spreadsheet.\n\nThis endpoint parses documents (PDF, images)\n    and spreadsheets (XLSX, CSV) into structured Markdown, chunks, and metadata.\n    \n\n For EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/parse`.\n\n### Parameters\n\n- `custom_prompts?: string`\n  Optional JSON string mapping chunk types to custom parsing prompts. Only the `figure` key is supported, for example '{\"figure\":\"Describe axis labels in detail.\"}'.\n\n- `document?: string`\n  A file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document_url` parameter must be provided.\n\n- `document_url?: string`\n  The URL to the file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document` parameter must be provided.\n\n- `model?: string`\n  The version of the model to use for parsing.\n\n- `password?: string`\n  Password for encrypted document files. If the document is password-protected, provide the password to decrypt and process the document. Ignored for unencrypted documents.\n\n- `split?: 'page'`\n  If you want to split documents into smaller sections, include the split parameter. Set the parameter to page to split documents at the page level. The splits object in the API output will contain a set of data for each page.\n\n### Returns\n\n- `{ chunks: { id: string; grounding: { box: parse_grounding_box; page: number; }; markdown: string; type: string; }[]; markdown: string; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }; splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]; grounding?: object; }`\n\n  - `chunks: { id: string; grounding: { box: { bottom: number; left: number; right: number; top: number; }; page: number; }; markdown: string; type: string; }[]`\n  - `markdown: string`\n  - `metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }`\n  - `splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]`\n  - `grounding?: object`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst response = await client.parse();\n\nconsole.log(response);\n```",
  },
  {
    name: 'split',
    endpoint: '/v1/ade/split',
    httpMethod: 'post',
    summary: 'ADE Split',
    description:
      'Split classification for documents.\n\nThis endpoint classifies document sections\n    based on markdown content and split options.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/split`.',
    stainlessPath: '(resource) $client > (method) split',
    qualified: 'client.split',
    params: [
      'split_class: { name: string; description?: string; identifier?: string; }[];',
      'markdown?: string | string;',
      'markdown_url?: string;',
      'model?: string;',
    ],
    response:
      '{ metadata: { credit_usage: number; duration_ms: number; filename: string; page_count: number; job_id?: string; org_id?: string; version?: string; }; splits: { classification: string; identifier: string; markdowns: string[]; pages: number[]; }[]; }',
    markdown:
      "## split\n\n`client.split(split_class: { name: string; description?: string; identifier?: string; }[], markdown?: string | string, markdown_url?: string, model?: string): { metadata: object; splits: object[]; }`\n\n**post** `/v1/ade/split`\n\nSplit classification for documents.\n\nThis endpoint classifies document sections\n    based on markdown content and split options.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/split`.\n\n### Parameters\n\n- `split_class: { name: string; description?: string; identifier?: string; }[]`\n  List of split classification options/configuration. Can be provided as JSON string in form data.\n\n- `markdown?: string | string`\n  The Markdown file or Markdown content to split.\n\n- `markdown_url?: string`\n  The URL to the Markdown file to split.\n\n- `model?: string`\n  Model version to use for split classification. Defaults to the latest version.\n\n### Returns\n\n- `{ metadata: { credit_usage: number; duration_ms: number; filename: string; page_count: number; job_id?: string; org_id?: string; version?: string; }; splits: { classification: string; identifier: string; markdowns: string[]; pages: number[]; }[]; }`\n  Response model for split classification endpoint.\n\n  - `metadata: { credit_usage: number; duration_ms: number; filename: string; page_count: number; job_id?: string; org_id?: string; version?: string; }`\n  - `splits: { classification: string; identifier: string; markdowns: string[]; pages: number[]; }[]`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst response = await client.split({ split_class: [{ name: 'name' }] });\n\nconsole.log(response);\n```",
  },
  {
    name: 'create',
    endpoint: '/v1/ade/parse/jobs',
    httpMethod: 'post',
    summary: 'ADE Parse Jobs',
    description:
      'Parse documents asynchronously.\n\nThis endpoint creates a job that handles the\n    processing for both large documents and large batches of documents.\n\n For EU\n    users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs`.',
    stainlessPath: '(resource) parse_jobs > (method) create',
    qualified: 'client.parseJobs.create',
    params: [
      'custom_prompts?: string;',
      'document?: string;',
      'document_url?: string;',
      'model?: string;',
      'output_save_url?: string;',
      'password?: string;',
      "split?: 'page';",
    ],
    response: '{ job_id: string; }',
    markdown:
      "## create\n\n`client.parseJobs.create(custom_prompts?: string, document?: string, document_url?: string, model?: string, output_save_url?: string, password?: string, split?: 'page'): { job_id: string; }`\n\n**post** `/v1/ade/parse/jobs`\n\nParse documents asynchronously.\n\nThis endpoint creates a job that handles the\n    processing for both large documents and large batches of documents.\n\n For EU\n    users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs`.\n\n### Parameters\n\n- `custom_prompts?: string`\n  Optional JSON string mapping chunk types to custom parsing prompts. Only the `figure` key is supported, for example '{\"figure\":\"Describe axis labels in detail.\"}'.\n\n- `document?: string`\n  A file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document_url` parameter must be provided.\n\n- `document_url?: string`\n  The URL to the file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document` parameter must be provided.\n\n- `model?: string`\n  The version of the model to use for parsing.\n\n- `output_save_url?: string`\n  If zero data retention (ZDR) is enabled, you must enter a URL for the parsed output to be saved to. When ZDR is enabled, the parsed content will not be in the API response.\n\n- `password?: string`\n  Password for encrypted document files. If the document is password-protected, provide the password to decrypt and process the document. Ignored for unencrypted documents.\n\n- `split?: 'page'`\n  If you want to split documents into smaller sections, include the split parameter. Set the parameter to page to split documents at the page level. The splits object in the API output will contain a set of data for each page.\n\n### Returns\n\n- `{ job_id: string; }`\n\n  - `job_id: string`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst parseJob = await client.parseJobs.create();\n\nconsole.log(parseJob);\n```",
  },
  {
    name: 'list',
    endpoint: '/v1/ade/parse/jobs',
    httpMethod: 'get',
    summary: 'ADE List Parse Jobs',
    description:
      'List all async parse jobs associated with your API key. Returns the list of jobs\nor an error response. For EU users, use this endpoint:\n\n\n`https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs`.',
    stainlessPath: '(resource) parse_jobs > (method) list',
    qualified: 'client.parseJobs.list',
    params: [
      'page?: number;',
      'pageSize?: number;',
      "status?: 'cancelled' | 'completed' | 'failed' | 'pending' | 'processing';",
    ],
    response:
      '{ jobs: { job_id: string; progress: number; received_at: number; status: string; failure_reason?: string; }[]; has_more?: boolean; org_id?: string; }',
    markdown:
      "## list\n\n`client.parseJobs.list(page?: number, pageSize?: number, status?: 'cancelled' | 'completed' | 'failed' | 'pending' | 'processing'): { jobs: object[]; has_more?: boolean; org_id?: string; }`\n\n**get** `/v1/ade/parse/jobs`\n\nList all async parse jobs associated with your API key. Returns the list of jobs\nor an error response. For EU users, use this endpoint:\n\n\n`https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs`.\n\n### Parameters\n\n- `page?: number`\n  Page number (0-indexed)\n\n- `pageSize?: number`\n  Number of items per page\n\n- `status?: 'cancelled' | 'completed' | 'failed' | 'pending' | 'processing'`\n  Filter by job status.\n\n### Returns\n\n- `{ jobs: { job_id: string; progress: number; received_at: number; status: string; failure_reason?: string; }[]; has_more?: boolean; org_id?: string; }`\n  Response for listing jobs.\n\n  - `jobs: { job_id: string; progress: number; received_at: number; status: string; failure_reason?: string; }[]`\n  - `has_more?: boolean`\n  - `org_id?: string`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst parseJobs = await client.parseJobs.list();\n\nconsole.log(parseJobs);\n```",
  },
  {
    name: 'get',
    endpoint: '/v1/ade/parse/jobs/{job_id}',
    httpMethod: 'get',
    summary: 'ADE Get Parse Jobs',
    description:
      'Get the status for an async parse job.\n\nReturns the job status or an error\n   response. For EU users, use this endpoint:\n\n\n   `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs/{job_id}`.',
    stainlessPath: '(resource) parse_jobs > (method) get',
    qualified: 'client.parseJobs.get',
    params: ['job_id: string;'],
    response:
      '{ job_id: string; progress: number; received_at: number; status: string; data?: { chunks: { id: string; grounding: object; markdown: string; type: string; }[]; markdown: string; metadata: object; splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]; grounding?: object; } | { chunks: { id: string; markdown: string; type: string; grounding?: object; }[]; markdown: string; metadata: { duration_ms: number; filename: string; sheet_count: number; total_cells: number; total_chunks: number; total_rows: number; credit_usage?: number; job_id?: string; org_id?: string; total_images?: number; version?: string; }; splits: { chunks: string[]; class: string; identifier: string; markdown: string; sheets: number[]; }[]; }; failure_reason?: string; metadata?: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }; org_id?: string; output_url?: string; version?: string; }',
    markdown:
      "## get\n\n`client.parseJobs.get(job_id: string): { job_id: string; progress: number; received_at: number; status: string; data?: object | object; failure_reason?: string; metadata?: parse_metadata; org_id?: string; output_url?: string; version?: string; }`\n\n**get** `/v1/ade/parse/jobs/{job_id}`\n\nGet the status for an async parse job.\n\nReturns the job status or an error\n   response. For EU users, use this endpoint:\n\n\n   `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs/{job_id}`.\n\n### Parameters\n\n- `job_id: string`\n\n### Returns\n\n- `{ job_id: string; progress: number; received_at: number; status: string; data?: { chunks: { id: string; grounding: object; markdown: string; type: string; }[]; markdown: string; metadata: object; splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]; grounding?: object; } | { chunks: { id: string; markdown: string; type: string; grounding?: object; }[]; markdown: string; metadata: { duration_ms: number; filename: string; sheet_count: number; total_cells: number; total_chunks: number; total_rows: number; credit_usage?: number; job_id?: string; org_id?: string; total_images?: number; version?: string; }; splits: { chunks: string[]; class: string; identifier: string; markdown: string; sheets: number[]; }[]; }; failure_reason?: string; metadata?: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }; org_id?: string; output_url?: string; version?: string; }`\n  Unified response for job status endpoint.\n\n  - `job_id: string`\n  - `progress: number`\n  - `received_at: number`\n  - `status: string`\n  - `data?: { chunks: { id: string; grounding: { box: object; page: number; }; markdown: string; type: string; }[]; markdown: string; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }; splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]; grounding?: object; } | { chunks: { id: string; markdown: string; type: string; grounding?: { box: object; page: number; }; }[]; markdown: string; metadata: { duration_ms: number; filename: string; sheet_count: number; total_cells: number; total_chunks: number; total_rows: number; credit_usage?: number; job_id?: string; org_id?: string; total_images?: number; version?: string; }; splits: { chunks: string[]; class: string; identifier: string; markdown: string; sheets: number[]; }[]; }`\n  - `failure_reason?: string`\n  - `metadata?: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }`\n  - `org_id?: string`\n  - `output_url?: string`\n  - `version?: string`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst parseJob = await client.parseJobs.get('job_id');\n\nconsole.log(parseJob);\n```",
  },
];

const EMBEDDED_READMES: { language: string; content: string }[] = [];

const INDEX_OPTIONS = {
  fields: [
    'name',
    'endpoint',
    'summary',
    'description',
    'qualified',
    'stainlessPath',
    'content',
    'sectionContext',
  ],
  storeFields: ['kind', '_original'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.1,
    boost: {
      name: 5,
      stainlessPath: 3,
      endpoint: 3,
      qualified: 3,
      summary: 2,
      content: 1,
      description: 1,
    } as Record<string, number>,
  },
};

/**
 * Self-contained local search engine backed by MiniSearch.
 * Method data is embedded at SDK build time; prose documents
 * can be loaded from an optional docs directory at runtime.
 */
export class LocalDocsSearch {
  private methodIndex: MiniSearch<MiniSearchDocument>;
  private proseIndex: MiniSearch<MiniSearchDocument>;

  private constructor() {
    this.methodIndex = new MiniSearch<MiniSearchDocument>(INDEX_OPTIONS);
    this.proseIndex = new MiniSearch<MiniSearchDocument>(INDEX_OPTIONS);
  }

  static async create(opts?: { docsDir?: string }): Promise<LocalDocsSearch> {
    const instance = new LocalDocsSearch();
    instance.indexMethods(EMBEDDED_METHODS);
    for (const readme of EMBEDDED_READMES) {
      instance.indexProse(readme.content, `readme:${readme.language}`);
    }
    if (opts?.docsDir) {
      await instance.loadDocsDirectory(opts.docsDir);
    }
    return instance;
  }

  search(props: {
    query: string;
    language?: string;
    detail?: string;
    maxResults?: number;
    maxLength?: number;
  }): SearchResult {
    const { query, language = 'typescript', detail = 'default', maxResults = 5, maxLength = 100_000 } = props;

    const useMarkdown = detail === 'verbose' || detail === 'high';

    // Search both indices and merge results by score.
    // Filter prose hits so language-tagged content (READMEs and docs with
    // frontmatter) only matches the requested language.
    const methodHits = this.methodIndex
      .search(query)
      .map((hit) => ({ ...hit, _kind: 'http_method' as const }));
    const proseHits = this.proseIndex
      .search(query)
      .filter((hit) => {
        const source = ((hit as Record<string, unknown>)['_original'] as ProseChunk | undefined)?.source;
        if (!source) return true;
        // Check for language-tagged sources: "readme:<lang>" or "lang:<lang>:<filename>"
        let taggedLang: string | undefined;
        if (source.startsWith('readme:')) taggedLang = source.slice('readme:'.length);
        else if (source.startsWith('lang:')) taggedLang = source.split(':')[1];
        if (!taggedLang) return true;
        return taggedLang === language || (language === 'javascript' && taggedLang === 'typescript');
      })
      .map((hit) => ({ ...hit, _kind: 'prose' as const }));
    const merged = [...methodHits, ...proseHits].sort((a, b) => b.score - a.score);
    const top = merged.slice(0, maxResults);

    const fullResults: (string | Record<string, unknown>)[] = [];

    for (const hit of top) {
      const original = (hit as Record<string, unknown>)['_original'];
      if (hit._kind === 'http_method') {
        const m = original as MethodEntry;
        if (useMarkdown && m.markdown) {
          fullResults.push(m.markdown);
        } else {
          // Use per-language data when available, falling back to the
          // top-level fields (which are TypeScript-specific in the
          // legacy codepath).
          const langData = m.perLanguage?.[language];
          fullResults.push({
            method: langData?.method ?? m.qualified,
            summary: m.summary,
            description: m.description,
            endpoint: `${m.httpMethod.toUpperCase()} ${m.endpoint}`,
            ...(langData?.example ? { example: langData.example } : {}),
            ...(m.params ? { params: m.params } : {}),
            ...(m.response ? { response: m.response } : {}),
          });
        }
      } else {
        const c = original as ProseChunk;
        fullResults.push({
          content: c.content,
          ...(c.source ? { source: c.source } : {}),
        });
      }
    }

    let totalLength = 0;
    const results: (string | Record<string, unknown>)[] = [];
    for (const result of fullResults) {
      const len = typeof result === 'string' ? result.length : JSON.stringify(result).length;
      totalLength += len;
      if (totalLength > maxLength) break;
      results.push(result);
    }

    if (results.length < fullResults.length) {
      results.unshift(`Truncated; showing ${results.length} of ${fullResults.length} results.`);
    }

    return { results };
  }

  private indexMethods(methods: MethodEntry[]): void {
    const docs: MiniSearchDocument[] = methods.map((m, i) => ({
      id: `method-${i}`,
      kind: 'http_method' as const,
      name: m.name,
      endpoint: m.endpoint,
      summary: m.summary,
      description: m.description,
      qualified: m.qualified,
      stainlessPath: m.stainlessPath,
      _original: m as unknown as Record<string, unknown>,
    }));
    if (docs.length > 0) {
      this.methodIndex.addAll(docs);
    }
  }

  private async loadDocsDirectory(docsDir: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(docsDir, { withFileTypes: true });
    } catch (err) {
      getLogger().warn({ err, docsDir }, 'Could not read docs directory');
      return;
    }

    const files = entries
      .filter((e) => e.isFile())
      .filter((e) => e.name.endsWith('.md') || e.name.endsWith('.markdown') || e.name.endsWith('.json'));

    for (const file of files) {
      try {
        const filePath = path.join(docsDir, file.name);
        const content = await fs.readFile(filePath, 'utf-8');

        if (file.name.endsWith('.json')) {
          const texts = extractTexts(JSON.parse(content));
          if (texts.length > 0) {
            this.indexProse(texts.join('\n\n'), file.name);
          }
        } else {
          // Parse optional YAML frontmatter for language tagging.
          // Files with a "language" field in frontmatter will only
          // surface in searches for that language.
          //
          // Example:
          //   ---
          //   language: python
          //   ---
          //   # Error handling in Python
          //   ...
          const frontmatter = parseFrontmatter(content);
          const source = frontmatter.language ? `lang:${frontmatter.language}:${file.name}` : file.name;
          this.indexProse(content, source);
        }
      } catch (err) {
        getLogger().warn({ err, file: file.name }, 'Failed to index docs file');
      }
    }
  }

  private indexProse(markdown: string, source: string): void {
    const chunks = chunkMarkdown(markdown);
    const baseId = this.proseIndex.documentCount;

    const docs: MiniSearchDocument[] = chunks.map((chunk, i) => ({
      id: `prose-${baseId + i}`,
      kind: 'prose' as const,
      content: chunk.content,
      ...(chunk.sectionContext != null ? { sectionContext: chunk.sectionContext } : {}),
      _original: { ...chunk, source } as unknown as Record<string, unknown>,
    }));

    if (docs.length > 0) {
      this.proseIndex.addAll(docs);
    }
  }
}

/** Lightweight markdown chunker — splits on headers, chunks by word count. */
function chunkMarkdown(markdown: string): { content: string; tag: string; sectionContext?: string }[] {
  // Strip YAML frontmatter
  const stripped = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const lines = stripped.split('\n');

  const chunks: { content: string; tag: string; sectionContext?: string }[] = [];
  const headers: string[] = [];
  let current: string[] = [];

  const flush = () => {
    const text = current.join('\n').trim();
    if (!text) return;
    const sectionContext = headers.length > 0 ? headers.join(' > ') : undefined;
    // Split into ~200-word chunks
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i += 200) {
      const slice = words.slice(i, i + 200).join(' ');
      if (slice) {
        chunks.push({ content: slice, tag: 'p', ...(sectionContext != null ? { sectionContext } : {}) });
      }
    }
    current = [];
  };

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headerMatch) {
      flush();
      const level = headerMatch[1]!.length;
      const text = headerMatch[2]!.trim();
      while (headers.length >= level) headers.pop();
      headers.push(text);
    } else {
      current.push(line);
    }
  }
  flush();

  return chunks;
}

/** Recursively extracts string values from a JSON structure. */
function extractTexts(data: unknown, depth = 0): string[] {
  if (depth > 10) return [];
  if (typeof data === 'string') return data.trim() ? [data] : [];
  if (Array.isArray(data)) return data.flatMap((item) => extractTexts(item, depth + 1));
  if (typeof data === 'object' && data !== null) {
    return Object.values(data).flatMap((v) => extractTexts(v, depth + 1));
  }
  return [];
}

/** Parses YAML frontmatter from a markdown string, extracting the language field if present. */
function parseFrontmatter(markdown: string): { language?: string } {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const body = match[1] ?? '';
  const langMatch = body.match(/^language:\s*(.+)$/m);
  return langMatch ? { language: langMatch[1]!.trim() } : {};
}
