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
    params: [
      'schema: string;',
      'markdown?: string | string;',
      'markdown_url?: string;',
      'model?: string;',
      'strict?: boolean;',
    ],
    response:
      "{ extraction: object; extraction_metadata: object; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; version: string; fallback_model_version?: string; schema_violation_error?: string; warnings?: { code: 'nonconformant_schema' | 'nonconformant_output'; msg: string; }[]; }; }",
    markdown:
      "## extract\n\n`client.extract(schema: string, markdown?: string | string, markdown_url?: string, model?: string, strict?: boolean): { extraction: object; extraction_metadata: object; metadata: object; }`\n\n**post** `/v1/ade/extract`\n\nExtract structured data from Markdown using a JSON schema.\n\nThis endpoint\n    processes Markdown content and extracts structured data according to the provided\n    JSON schema.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/extract`.\n\n### Parameters\n\n- `schema: string`\n  JSON schema for field extraction. This schema determines what key-values pairs are extracted from the Markdown. The schema must be a valid JSON object and will be validated before processing the document.\n\n- `markdown?: string | string`\n  The Markdown file or Markdown content to extract data from.\n\n- `markdown_url?: string`\n  The URL to the Markdown file to extract data from.\n\n- `model?: string`\n  The version of the model to use for extraction. Use `extract-latest` to use the latest version.\n\n- `strict?: boolean`\n  If True, reject schemas with unsupported fields (HTTP 422). If False, prune unsupported fields and continue. Only applies to extract versions that support schema validation.\n\n### Returns\n\n- `{ extraction: object; extraction_metadata: object; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; version: string; fallback_model_version?: string; schema_violation_error?: string; warnings?: { code: 'nonconformant_schema' | 'nonconformant_output'; msg: string; }[]; }; }`\n\n  - `extraction: object`\n  - `extraction_metadata: object`\n  - `metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; version: string; fallback_model_version?: string; schema_violation_error?: string; warnings?: { code: 'nonconformant_schema' | 'nonconformant_output'; msg: string; }[]; }`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst response = await client.extract({ schema: 'schema' });\n\nconsole.log(response);\n```",
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/extract \\\n    -H \'Content-Type: multipart/form-data\' \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY" \\\n    -F schema=schema',
      },
      python: {
        method: 'extract',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.extract(\n    schema="schema",\n)\nprint(response.extraction)',
      },
      typescript: {
        method: 'client.extract',
        example:
          "import LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.extract({ schema: 'schema' });\n\nconsole.log(response.extraction);",
      },
    },
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
      'custom_prompts?: { figure?: string; };',
      'document?: string;',
      'document_url?: string;',
      'model?: string;',
      'password?: string;',
      "split?: 'page';",
    ],
    response:
      '{ chunks: { id: string; grounding: { box: parse_grounding_box; page: number; }; markdown: string; type: string; }[]; markdown: string; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }; splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]; grounding?: object; }',
    markdown:
      "## parse\n\n`client.parse(custom_prompts?: { figure?: string; }, document?: string, document_url?: string, model?: string, password?: string, split?: 'page'): { chunks: object[]; markdown: string; metadata: parse_metadata; splits: object[]; grounding?: object; }`\n\n**post** `/v1/ade/parse`\n\nParse a document or spreadsheet.\n\nThis endpoint parses documents (PDF, images)\n    and spreadsheets (XLSX, CSV) into structured Markdown, chunks, and metadata.\n    \n\n For EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/parse`.\n\n### Parameters\n\n- `custom_prompts?: { figure?: string; }`\n  Custom parsing prompts by chunk type. Only `figure` is supported.\n  - `figure?: string`\n    Custom parsing prompt for figure chunks.\n\n- `document?: string`\n  A file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document_url` parameter must be provided.\n\n- `document_url?: string`\n  The URL to the file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document` parameter must be provided.\n\n- `model?: string`\n  The version of the model to use for parsing.\n\n- `password?: string`\n  Password for encrypted document files. If the document is password-protected, provide the password to decrypt and process the document. Ignored for unencrypted documents.\n\n- `split?: 'page'`\n  If you want to split documents into smaller sections, include the split parameter. Set the parameter to page to split documents at the page level. The splits object in the API output will contain a set of data for each page.\n\n### Returns\n\n- `{ chunks: { id: string; grounding: { box: parse_grounding_box; page: number; }; markdown: string; type: string; }[]; markdown: string; metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }; splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]; grounding?: object; }`\n\n  - `chunks: { id: string; grounding: { box: { bottom: number; left: number; right: number; top: number; }; page: number; }; markdown: string; type: string; }[]`\n  - `markdown: string`\n  - `metadata: { credit_usage: number; duration_ms: number; filename: string; job_id: string; org_id: string; page_count: number; version: string; failed_pages?: number[]; }`\n  - `splits: { chunks: string[]; class: string; identifier: string; markdown: string; pages: number[]; }[]`\n  - `grounding?: object`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst response = await client.parse();\n\nconsole.log(response);\n```",
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/parse \\\n    -H \'Content-Type: multipart/form-data\' \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY"',
      },
      python: {
        method: 'parse',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.parse()\nprint(response.chunks)',
      },
      typescript: {
        method: 'client.parse',
        example:
          "import fs from 'fs';\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.parse();\n\nconsole.log(response.chunks);",
      },
    },
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
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/split \\\n    -H \'Content-Type: multipart/form-data\' \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY" \\\n    -F split_class=\'[{"name":"name"}]\'',
      },
      python: {
        method: 'split',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.split(\n    split_class=[{\n        "name": "name"\n    }],\n)\nprint(response.metadata)',
      },
      typescript: {
        method: 'client.split',
        example:
          "import LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.split({ split_class: [{ name: 'name' }] });\n\nconsole.log(response.metadata);",
      },
    },
  },
  {
    name: 'classify',
    endpoint: '/v1/ade/classify',
    httpMethod: 'post',
    summary: 'ADE Classify',
    description:
      'Classify the pages of a document into classes you define.\n\nThis endpoint accepts PDFs, images, and other supported file types\n(either as a `document` upload or `document_url`) together with a\nlist of `classes`, and returns a classification result for each page.\n\nFor EU users, use this endpoint:\n\n`https://api.va.eu-west-1.landing.ai/v1/ade/classify`.',
    stainlessPath: '(resource) $client > (method) classify',
    qualified: 'client.classify',
    params: [
      'classes: { class: string; description?: string; }[];',
      'document?: string;',
      'document_url?: string;',
      'model?: string;',
    ],
    response:
      '{ classification: { class: string; page: number; reason?: string; suggested_class?: string; }[]; metadata: { credit_usage: number; duration_ms: number; filename: string; page_count: number; job_id?: string; org_id?: string; version?: string; }; }',
    markdown:
      "## classify\n\n`client.classify(classes: { class: string; description?: string; }[], document?: string, document_url?: string, model?: string): { classification: object[]; metadata: object; }`\n\n**post** `/v1/ade/classify`\n\nClassify the pages of a document into classes you define.\n\nThis endpoint accepts PDFs, images, and other supported file types\n(either as a `document` upload or `document_url`) together with a\nlist of `classes`, and returns a classification result for each page.\n\nFor EU users, use this endpoint:\n\n`https://api.va.eu-west-1.landing.ai/v1/ade/classify`.\n\n### Parameters\n\n- `classes: { class: string; description?: string; }[]`\n  The possible classes that can be assigned to pages in the document. Each entry is an object with a `class` name and an optional `description`. Only one class is assigned per page; unclassifiable pages receive 'unknown'. Can be provided as a JSON string in form data.\n\n- `document?: string`\n  A file to be classified. Either this parameter or the `document_url` parameter must be provided.\n\n- `document_url?: string`\n  The URL of the document to be classified. Either this parameter or the `document` parameter must be provided.\n\n- `model?: string`\n  Classification model version. Defaults to the latest.\n\n### Returns\n\n- `{ classification: { class: string; page: number; reason?: string; suggested_class?: string; }[]; metadata: { credit_usage: number; duration_ms: number; filename: string; page_count: number; job_id?: string; org_id?: string; version?: string; }; }`\n  Response model for the classify endpoint.\n\n  - `classification: { class: string; page: number; reason?: string; suggested_class?: string; }[]`\n  - `metadata: { credit_usage: number; duration_ms: number; filename: string; page_count: number; job_id?: string; org_id?: string; version?: string; }`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst response = await client.classify({ classes: [{ class: 'class' }] });\n\nconsole.log(response);\n```",
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/classify \\\n    -H \'Content-Type: multipart/form-data\' \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY" \\\n    -F classes=\'[{"class":"class"}]\'',
      },
      python: {
        method: 'classify',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.classify(\n    classes=[{\n        "class": "class"\n    }],\n)\nprint(response.classification)',
      },
      typescript: {
        method: 'client.classify',
        example:
          "import fs from 'fs';\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.classify({ classes: [{ class: 'class' }] });\n\nconsole.log(response.classification);",
      },
    },
  },
  {
    name: 'section',
    endpoint: '/v1/ade/section',
    httpMethod: 'post',
    summary: 'ADE Section',
    description:
      'Section parsed markdown into a hierarchical table of contents.\n\nThis endpoint accepts the markdown output from /ade/parse\n(with reference anchors) and returns a flat, reading-order list of\nsections with hierarchy levels and reference ranges.\n\nFor EU users, use this endpoint:\n\n`https://api.va.eu-west-1.landing.ai/v1/ade/section`.',
    stainlessPath: '(resource) $client > (method) section',
    qualified: 'client.section',
    params: [
      'guidelines?: string;',
      'markdown?: string | string;',
      'markdown_url?: string;',
      'model?: string;',
    ],
    response:
      '{ metadata: { credit_usage: number; duration_ms: number; filename: string; job_id?: string; org_id?: string; version?: string; }; table_of_contents: { level: number; section_number: string; start_reference: string; title: string; }[]; table_of_contents_md: string; }',
    markdown:
      "## section\n\n`client.section(guidelines?: string, markdown?: string | string, markdown_url?: string, model?: string): { metadata: object; table_of_contents: object[]; table_of_contents_md: string; }`\n\n**post** `/v1/ade/section`\n\nSection parsed markdown into a hierarchical table of contents.\n\nThis endpoint accepts the markdown output from /ade/parse\n(with reference anchors) and returns a flat, reading-order list of\nsections with hierarchy levels and reference ranges.\n\nFor EU users, use this endpoint:\n\n`https://api.va.eu-west-1.landing.ai/v1/ade/section`.\n\n### Parameters\n\n- `guidelines?: string`\n  Natural-language instructions to control hierarchy. Examples: 'Group by topic', 'Treat each numbered section as a top-level entry'.\n\n- `markdown?: string | string`\n  Parsed markdown with reference anchors (<a id='...'></a>). This is the markdown field from a parse response.\n\n- `markdown_url?: string`\n  URL to fetch the markdown from.\n\n- `model?: string`\n  Section model version. Defaults to latest.\n\n### Returns\n\n- `{ metadata: { credit_usage: number; duration_ms: number; filename: string; job_id?: string; org_id?: string; version?: string; }; table_of_contents: { level: number; section_number: string; start_reference: string; title: string; }[]; table_of_contents_md: string; }`\n  Response model for section endpoint.\n\n  - `metadata: { credit_usage: number; duration_ms: number; filename: string; job_id?: string; org_id?: string; version?: string; }`\n  - `table_of_contents: { level: number; section_number: string; start_reference: string; title: string; }[]`\n  - `table_of_contents_md: string`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst response = await client.section();\n\nconsole.log(response);\n```",
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/section \\\n    -H \'Content-Type: multipart/form-data\' \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY"',
      },
      python: {
        method: 'section',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.section()\nprint(response.metadata)',
      },
      typescript: {
        method: 'client.section',
        example:
          "import LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.section();\n\nconsole.log(response.metadata);",
      },
    },
  },
  {
    name: 'extract-build-schema',
    endpoint: '/v1/ade/extract/build-schema',
    httpMethod: 'post',
    summary: 'ADE Build Extract Schema',
    description:
      'Generate a JSON schema from Markdown using AI.\n\nThis endpoint analyzes Markdown\n    content and generates a JSON schema suitable for use with the extract endpoint.\n    It can also refine an existing schema based on new documents or iterate on a schema\n    based on prompt instructions.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/extract/build-schema`.',
    stainlessPath: '(resource) $client > (method) extract-build-schema',
    qualified: 'client.extractBuildSchema',
    params: [
      'markdown_urls?: string[];',
      'markdowns?: string | string[];',
      'model?: string;',
      'prompt?: string;',
      'schema?: string;',
    ],
    response:
      "{ extraction_schema: string; metadata: { credit_usage?: number; duration_ms?: number; filename?: string; job_id?: string; org_id?: string; version?: string; warnings?: { code: 'nonconformant_schema' | 'nonconformant_output'; msg: string; }[]; }; }",
    markdown:
      "## extract-build-schema\n\n`client.extractBuildSchema(markdown_urls?: string[], markdowns?: string | string[], model?: string, prompt?: string, schema?: string): { extraction_schema: string; metadata: object; }`\n\n**post** `/v1/ade/extract/build-schema`\n\nGenerate a JSON schema from Markdown using AI.\n\nThis endpoint analyzes Markdown\n    content and generates a JSON schema suitable for use with the extract endpoint.\n    It can also refine an existing schema based on new documents or iterate on a schema\n    based on prompt instructions.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/extract/build-schema`.\n\n### Parameters\n\n- `markdown_urls?: string[]`\n  URLs to Markdown files to analyze for schema generation.\n\n- `markdowns?: string | string[]`\n  Markdown files or inline content strings to analyze for schema generation. Multiple documents can be provided for better schema coverage.\n\n- `model?: string`\n  The version of the model to use for schema generation. Use `extract-latest` to use the latest version.\n\n- `prompt?: string`\n  Instructions for how to generate or modify the schema.\n\n- `schema?: string`\n  Existing JSON schema to iterate on or refine.\n\n### Returns\n\n- `{ extraction_schema: string; metadata: { credit_usage?: number; duration_ms?: number; filename?: string; job_id?: string; org_id?: string; version?: string; warnings?: { code: 'nonconformant_schema' | 'nonconformant_output'; msg: string; }[]; }; }`\n\n  - `extraction_schema: string`\n  - `metadata: { credit_usage?: number; duration_ms?: number; filename?: string; job_id?: string; org_id?: string; version?: string; warnings?: { code: 'nonconformant_schema' | 'nonconformant_output'; msg: string; }[]; }`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst response = await client.extractBuildSchema();\n\nconsole.log(response);\n```",
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/extract/build-schema \\\n    -H \'Content-Type: multipart/form-data\' \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY"',
      },
      python: {
        method: 'extract_build_schema',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.extract_build_schema()\nprint(response.extraction_schema)',
      },
      typescript: {
        method: 'client.extractBuildSchema',
        example:
          "import LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.extractBuildSchema();\n\nconsole.log(response.extraction_schema);",
      },
    },
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
      'custom_prompts?: { figure?: string; };',
      'document?: string;',
      'document_url?: string;',
      'model?: string;',
      'output_save_url?: string;',
      'password?: string;',
      "split?: 'page';",
    ],
    response: '{ job_id: string; }',
    markdown:
      "## create\n\n`client.parseJobs.create(custom_prompts?: { figure?: string; }, document?: string, document_url?: string, model?: string, output_save_url?: string, password?: string, split?: 'page'): { job_id: string; }`\n\n**post** `/v1/ade/parse/jobs`\n\nParse documents asynchronously.\n\nThis endpoint creates a job that handles the\n    processing for both large documents and large batches of documents.\n\n For EU\n    users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs`.\n\n### Parameters\n\n- `custom_prompts?: { figure?: string; }`\n  Custom parsing prompts by chunk type. Only `figure` is supported.\n  - `figure?: string`\n    Custom parsing prompt for figure chunks.\n\n- `document?: string`\n  A file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document_url` parameter must be provided.\n\n- `document_url?: string`\n  The URL to the file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document` parameter must be provided.\n\n- `model?: string`\n  The version of the model to use for parsing.\n\n- `output_save_url?: string`\n  If zero data retention (ZDR) is enabled, you must enter a URL for the parsed output to be saved to. When ZDR is enabled, the parsed content will not be in the API response.\n\n- `password?: string`\n  Password for encrypted document files. If the document is password-protected, provide the password to decrypt and process the document. Ignored for unencrypted documents.\n\n- `split?: 'page'`\n  If you want to split documents into smaller sections, include the split parameter. Set the parameter to page to split documents at the page level. The splits object in the API output will contain a set of data for each page.\n\n### Returns\n\n- `{ job_id: string; }`\n\n  - `job_id: string`\n\n### Example\n\n```typescript\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\nconst parseJob = await client.parseJobs.create();\n\nconsole.log(parseJob);\n```",
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/parse/jobs \\\n    -H \'Content-Type: multipart/form-data\' \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY"',
      },
      python: {
        method: 'parse_jobs.create',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nparse_job = client.parse_jobs.create()\nprint(parse_job.job_id)',
      },
      typescript: {
        method: 'client.parseJobs.create',
        example:
          "import fs from 'fs';\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst parseJob = await client.parseJobs.create();\n\nconsole.log(parseJob.job_id);",
      },
    },
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
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/parse/jobs \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY"',
      },
      python: {
        method: 'parse_jobs.list',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nparse_jobs = client.parse_jobs.list()\nprint(parse_jobs.org_id)',
      },
      typescript: {
        method: 'client.parseJobs.list',
        example:
          "import LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst parseJobs = await client.parseJobs.list();\n\nconsole.log(parseJobs.org_id);",
      },
    },
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
    perLanguage: {
      http: {
        example:
          'curl https://api.va.landing.ai/v1/ade/parse/jobs/$JOB_ID \\\n    -H "Authorization: Bearer $VISION_AGENT_API_KEY"',
      },
      python: {
        method: 'parse_jobs.get',
        example:
          'import os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n)\nparse_job = client.parse_jobs.get(\n    "job_id",\n)\nprint(parse_job.job_id)',
      },
      typescript: {
        method: 'client.parseJobs.get',
        example:
          "import LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n});\n\nconst parseJob = await client.parseJobs.get('job_id');\n\nconsole.log(parseJob.job_id);",
      },
    },
  },
];

const EMBEDDED_READMES: { language: string; content: string }[] = [
  {
    language: 'python',
    content:
      '# LandingAI ADE Python API library\n\n<!-- prettier-ignore -->\n[![PyPI version](https://img.shields.io/pypi/v/landingai-ade.svg?label=pypi%20(stable))](https://pypi.org/project/landingai-ade/)\n\nThe LandingAI ADE Python library provides convenient access to the LandingAI ADE REST API from any Python 3.9+\napplication. The library includes type definitions for all request params and response fields,\nand offers both synchronous and asynchronous clients powered by [httpx](https://github.com/encode/httpx).\n\n\n\nIt is generated with [Stainless](https://www.stainless.com/).\n\n## MCP Server\n\nUse the LandingAI ADE MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.\n\n[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=landingai-ade-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImxhbmRpbmdhaS1hZGUtbWNwIl0sImVudiI6eyJWSVNJT05fQUdFTlRfQVBJX0tFWSI6Ik15IEFwaWtleSJ9fQ)\n[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22landingai-ade-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22landingai-ade-mcp%22%5D%2C%22env%22%3A%7B%22VISION_AGENT_API_KEY%22%3A%22My%20Apikey%22%7D%7D)\n\n> Note: You may need to set environment variables in your MCP client.\n\n## Documentation\n\nThe REST API documentation can be found on [docs.landing.ai](https://docs.landing.ai/). The full API of this library can be found in [api.md](api.md).\n\n## Installation\n\n```sh\n# install from PyPI\npip install landingai-ade\n```\n\n## Usage\n\nThe full API of this library can be found in [api.md](api.md).\n\n```python\nimport os\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n    # defaults to "production".\n    environment="eu",\n)\n\nresponse = client.parse(\n    document_url="path/to/file",\n    model="dpt-2-latest",\n)\nprint(response.chunks)\n```\n\nWhile you can provide a `apikey` keyword argument,\nwe recommend using [python-dotenv](https://pypi.org/project/python-dotenv/)\nto add `VISION_AGENT_API_KEY="My Apikey"` to your `.env` file\nso that your Apikey is not stored in source control.\n\n## Async usage\n\nSimply import `AsyncLandingAIADE` instead of `LandingAIADE` and use `await` with each API call:\n\n```python\nimport os\nimport asyncio\nfrom landingai_ade import AsyncLandingAIADE\n\nclient = AsyncLandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n    # defaults to "production".\n    environment="eu",\n)\n\nasync def main() -> None:\n  response = await client.parse(\n      document_url="path/to/file",\n      model="dpt-2-latest",\n  )\n  print(response.chunks)\n\nasyncio.run(main())\n```\n\nFunctionality between the synchronous and asynchronous clients is otherwise identical.\n\n### With aiohttp\n\nBy default, the async client uses `httpx` for HTTP requests. However, for improved concurrency performance you may also use `aiohttp` as the HTTP backend.\n\nYou can enable this by installing `aiohttp`:\n\n```sh\n# install from PyPI\npip install landingai-ade[aiohttp]\n```\n\nThen you can enable it by instantiating the client with `http_client=DefaultAioHttpClient()`:\n\n```python\nimport os\nimport asyncio\nfrom landingai_ade import DefaultAioHttpClient\nfrom landingai_ade import AsyncLandingAIADE\n\nasync def main() -> None:\n  async with AsyncLandingAIADE(\n    apikey=os.environ.get("VISION_AGENT_API_KEY"),  # This is the default and can be omitted\n    http_client=DefaultAioHttpClient(),\n) as client:\n    response = await client.parse(\n        document_url="path/to/file",\n        model="dpt-2-latest",\n    )\n    print(response.chunks)\n\nasyncio.run(main())\n```\n\n\n\n## Using types\n\nNested request parameters are [TypedDicts](https://docs.python.org/3/library/typing.html#typing.TypedDict). Responses are [Pydantic models](https://docs.pydantic.dev) which also provide helper methods for things like:\n\n- Serializing back into JSON, `model.to_json()`\n- Converting to a dictionary, `model.to_dict()`\n\nTyped requests and responses provide autocomplete and documentation within your editor. If you would like to see type errors in VS Code to help catch bugs earlier, set `python.analysis.typeCheckingMode` to `basic`.\n\n\n\n## Nested params\n\nNested parameters are dictionaries, typed using `TypedDict`, for example:\n\n```python\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE()\n\nresponse = client.parse(\n    custom_prompts={},\n)\nprint(response.custom_prompts)\n```\n\n## File uploads\n\nRequest parameters that correspond to file uploads can be passed as `bytes`, or a [`PathLike`](https://docs.python.org/3/library/os.html#os.PathLike) instance or a tuple of `(filename, contents, media type)`.\n\n```python\nfrom pathlib import Path\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE()\n\nclient.parse(\n    document=Path("/path/to/file"),\n)\n```\n\nThe async client uses the exact same interface. If you pass a [`PathLike`](https://docs.python.org/3/library/os.html#os.PathLike) instance, the file contents will be read asynchronously automatically.\n\n## Handling errors\n\nWhen the library is unable to connect to the API (for example, due to network connection problems or a timeout), a subclass of `landingai_ade.APIConnectionError` is raised.\n\nWhen the API returns a non-success status code (that is, 4xx or 5xx\nresponse), a subclass of `landingai_ade.APIStatusError` is raised, containing `status_code` and `response` properties.\n\nAll errors inherit from `landingai_ade.APIError`.\n\n```python\nimport landingai_ade\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE()\n\ntry:\n    client.parse()\nexcept landingai_ade.APIConnectionError as e:\n    print("The server could not be reached")\n    print(e.__cause__) # an underlying Exception, likely raised within httpx.\nexcept landingai_ade.RateLimitError as e:\n    print("A 429 status code was received; we should back off a bit.")\nexcept landingai_ade.APIStatusError as e:\n    print("Another non-200-range status code was received")\n    print(e.status_code)\n    print(e.response)\n```\n\nError codes are as follows:\n\n| Status Code | Error Type                 |\n| ----------- | -------------------------- |\n| 400         | `BadRequestError`          |\n| 401         | `AuthenticationError`      |\n| 403         | `PermissionDeniedError`    |\n| 404         | `NotFoundError`            |\n| 422         | `UnprocessableEntityError` |\n| 429         | `RateLimitError`           |\n| >=500       | `InternalServerError`      |\n| N/A         | `APIConnectionError`       |\n\n### Retries\n\nCertain errors are automatically retried 2 times by default, with a short exponential backoff.\nConnection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,\n429 Rate Limit, and >=500 Internal errors are all retried by default.\n\nYou can use the `max_retries` option to configure or disable retry settings:\n\n```python\nfrom landingai_ade import LandingAIADE\n\n# Configure the default for all requests:\nclient = LandingAIADE(\n    # default is 2\n    max_retries=0,\n)\n\n# Or, configure per-request:\nclient.with_options(max_retries = 5).parse()\n```\n\n### Timeouts\n\nBy default requests time out after 8 minutes. You can configure this with a `timeout` option,\nwhich accepts a float or an [`httpx.Timeout`](https://www.python-httpx.org/advanced/timeouts/#fine-tuning-the-configuration) object:\n\n```python\nfrom landingai_ade import LandingAIADE\n\n# Configure the default for all requests:\nclient = LandingAIADE(\n    # 20 seconds (default is 8 minutes)\n    timeout=20.0,\n)\n\n# More granular control:\nclient = LandingAIADE(\n    timeout=httpx.Timeout(60.0, read=5.0, write=10.0, connect=2.0),\n)\n\n# Override per-request:\nclient.with_options(timeout = 5.0).parse()\n```\n\nOn timeout, an `APITimeoutError` is thrown.\n\nNote that requests that time out are [retried twice by default](#retries).\n\n\n\n## Advanced\n\n### Logging\n\nWe use the standard library [`logging`](https://docs.python.org/3/library/logging.html) module.\n\nYou can enable logging by setting the environment variable `LANDINGAI_ADE_LOG` to `info`.\n\n```shell\n$ export LANDINGAI_ADE_LOG=info\n```\n\nOr to `debug` for more verbose logging.\n\n### How to tell whether `None` means `null` or missing\n\nIn an API response, a field may be explicitly `null`, or missing entirely; in either case, its value is `None` in this library. You can differentiate the two cases with `.model_fields_set`:\n\n```py\nif response.my_field is None:\n  if \'my_field\' not in response.model_fields_set:\n    print(\'Got json like {}, without a "my_field" key present at all.\')\n  else:\n    print(\'Got json like {"my_field": null}.\')\n```\n\n### Accessing raw response data (e.g. headers)\n\nThe "raw" Response object can be accessed by prefixing `.with_raw_response.` to any HTTP method call, e.g.,\n\n```py\nfrom landingai_ade import LandingAIADE\n\nclient = LandingAIADE()\nresponse = client.with_raw_response.parse()\nprint(response.headers.get(\'X-My-Header\'))\n\nclient = response.parse()  # get the object that `parse()` would have returned\nprint(client.chunks)\n```\n\nThese methods return an [`APIResponse`](https://github.com/landing-ai/ade-python/tree/main/src/landingai_ade/_response.py) object.\n\nThe async client returns an [`AsyncAPIResponse`](https://github.com/landing-ai/ade-python/tree/main/src/landingai_ade/_response.py) with the same structure, the only difference being `await`able methods for reading the response content.\n\n#### `.with_streaming_response`\n\nThe above interface eagerly reads the full response body when you make the request, which may not always be what you want.\n\nTo stream the response body, use `.with_streaming_response` instead, which requires a context manager and only reads the response body once you call `.read()`, `.text()`, `.json()`, `.iter_bytes()`, `.iter_text()`, `.iter_lines()` or `.parse()`. In the async client, these are async methods.\n\n```python\nwith client.with_streaming_response.parse() as response :\n    print(response.headers.get(\'X-My-Header\'))\n\n    for line in response.iter_lines():\n      print(line)\n```\n\nThe context manager is required so that the response will reliably be closed.\n\n### Making custom/undocumented requests\n\nThis library is typed for convenient access to the documented API.\n\nIf you need to access undocumented endpoints, params, or response properties, the library can still be used.\n\n#### Undocumented endpoints\n\nTo make requests to undocumented endpoints, you can make requests using `client.get`, `client.post`, and other\nhttp verbs. Options on the client will be respected (such as retries) when making this request.\n\n```py\nimport httpx\n\nresponse = client.post(\n    "/foo",\n    cast_to=httpx.Response,\n    body={"my_param": True},\n)\n\nprint(response.headers.get("x-foo"))\n```\n\n#### Undocumented request params\n\nIf you want to explicitly send an extra param, you can do so with the `extra_query`, `extra_body`, and `extra_headers` request\noptions.\n\n#### Undocumented response properties\n\nTo access undocumented response properties, you can access the extra fields like `response.unknown_prop`. You\ncan also get all the extra fields on the Pydantic model as a dict with\n[`response.model_extra`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.BaseModel.model_extra).\n\n### Configuring the HTTP client\n\nYou can directly override the [httpx client](https://www.python-httpx.org/api/#client) to customize it for your use case, including:\n\n- Support for [proxies](https://www.python-httpx.org/advanced/proxies/)\n- Custom [transports](https://www.python-httpx.org/advanced/transports/)\n- Additional [advanced](https://www.python-httpx.org/advanced/clients/) functionality\n\n```python\nimport httpx\nfrom landingai_ade import LandingAIADE, DefaultHttpxClient\n\nclient = LandingAIADE(\n    # Or use the `LANDINGAI_ADE_BASE_URL` env var\n    base_url="http://my.test.server.example.com:8083",\n    http_client=DefaultHttpxClient(proxy="http://my.test.proxy.example.com", transport=httpx.HTTPTransport(local_address="0.0.0.0")),\n)\n```\n\nYou can also customize the client on a per-request basis by using `with_options()`:\n\n```python\nclient.with_options(http_client=DefaultHttpxClient(...))\n```\n\n### Managing HTTP resources\n\nBy default the library closes underlying HTTP connections whenever the client is [garbage collected](https://docs.python.org/3/reference/datamodel.html#object.__del__). You can manually close the client using the `.close()` method if desired, or with a context manager that closes when exiting.\n\n```py\nfrom landingai_ade import LandingAIADE\n\nwith LandingAIADE() as client:\n  # make requests here\n  ...\n\n# HTTP client is now closed\n```\n\n## Versioning\n\nThis package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:\n\n1. Changes that only affect static types, without breaking runtime behavior.\n2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_\n3. Changes that we do not expect to impact the vast majority of users in practice.\n\nWe take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.\n\nWe are keen for your feedback; please open an [issue](https://www.github.com/landing-ai/ade-python/issues) with questions, bugs, or suggestions.\n\n### Determining the installed version\n\nIf you\'ve upgraded to the latest version but aren\'t seeing any new features you were expecting then your python environment is likely still using an older version.\n\nYou can determine the version that is being used at runtime with:\n\n```py\nimport landingai_ade\nprint(landingai_ade.__version__)\n```\n\n## Requirements\n\nPython 3.9 or higher.\n\n## Contributing\n\nSee [the contributing documentation](./CONTRIBUTING.md).\n',
  },
  {
    language: 'typescript',
    content:
      "# LandingAI ADE TypeScript API Library\n\n[![NPM version](https://img.shields.io/npm/v/landingai-ade.svg?label=npm%20(stable))](https://npmjs.org/package/landingai-ade) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/landingai-ade)\n\nThis library provides convenient access to the LandingAI ADE REST API from server-side TypeScript or JavaScript.\n\n\n\nThe REST API documentation can be found on [docs.landing.ai](https://docs.landing.ai/). The full API of this library can be found in [api.md](api.md).\n\nIt is generated with [Stainless](https://www.stainless.com/).\n\n## MCP Server\n\nUse the LandingAI ADE MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.\n\n[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=landingai-ade-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImxhbmRpbmdhaS1hZGUtbWNwIl0sImVudiI6eyJWSVNJT05fQUdFTlRfQVBJX0tFWSI6Ik15IEFwaWtleSJ9fQ)\n[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22landingai-ade-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22landingai-ade-mcp%22%5D%2C%22env%22%3A%7B%22VISION_AGENT_API_KEY%22%3A%22My%20Apikey%22%7D%7D)\n\n> Note: You may need to set environment variables in your MCP client.\n\n## Installation\n\n```sh\nnpm install landingai-ade\n```\n\n\n\n## Usage\n\nThe full API of this library can be found in [api.md](api.md).\n\n<!-- prettier-ignore -->\n```js\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n  environment: 'eu', // defaults to 'production'\n});\n\nconst response = await client.parse({ document_url: 'path/to/file', model: 'dpt-2-latest' });\n\nconsole.log(response.chunks);\n```\n\n\n\n### Request & Response types\n\nThis library includes TypeScript definitions for all request params and response fields. You may import and use them like so:\n\n<!-- prettier-ignore -->\n```ts\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  apikey: process.env['VISION_AGENT_API_KEY'], // This is the default and can be omitted\n  environment: 'eu', // defaults to 'production'\n});\n\nconst response: LandingAIADE.ParseResponse = await client.parse();\n```\n\nDocumentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.\n\n## File uploads\n\nRequest parameters that correspond to file uploads can be passed in many different forms:\n- `File` (or an object with the same structure)\n- a `fetch` `Response` (or an object with the same structure)\n- an `fs.ReadStream`\n- the return value of our `toFile` helper\n\n```ts\nimport fs from 'fs';\nimport LandingAIADE, { toFile } from 'landingai-ade';\n\nconst client = new LandingAIADE();\n\n// If you have access to Node `fs` we recommend using `fs.createReadStream()`:\nawait client.parse({ document: fs.createReadStream('/path/to/file') });\n\n// Or if you have the web `File` API you can pass a `File` instance:\nawait client.parse({ document: new File(['my bytes'], 'file') });\n\n// You can also pass a `fetch` `Response`:\nawait client.parse({ document: await fetch('https://somesite/file') });\n\n// Finally, if none of the above are convenient, you can use our `toFile` helper:\nawait client.parse({ document: await toFile(Buffer.from('my bytes'), 'file') });\nawait client.parse({ document: await toFile(new Uint8Array([0, 1, 2]), 'file') });\n```\n\n\n\n## Handling errors\n\nWhen the library is unable to connect to the API,\nor if the API returns a non-success status code (i.e., 4xx or 5xx response),\na subclass of `APIError` will be thrown:\n\n<!-- prettier-ignore -->\n```ts\nconst response = await client.parse().catch(async (err) => {\n  if (err instanceof LandingAIADE.APIError) {\n    console.log(err.status); // 400\n    console.log(err.name); // BadRequestError\n    console.log(err.headers); // {server: 'nginx', ...}\n  } else {\n    throw err;\n  }\n});\n```\n\nError codes are as follows:\n\n| Status Code | Error Type                 |\n| ----------- | -------------------------- |\n| 400         | `BadRequestError`          |\n| 401         | `AuthenticationError`      |\n| 403         | `PermissionDeniedError`    |\n| 404         | `NotFoundError`            |\n| 422         | `UnprocessableEntityError` |\n| 429         | `RateLimitError`           |\n| >=500       | `InternalServerError`      |\n| N/A         | `APIConnectionError`       |\n\n### Retries\n\nCertain errors will be automatically retried 2 times by default, with a short exponential backoff.\nConnection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,\n429 Rate Limit, and >=500 Internal errors will all be retried by default.\n\nYou can use the `maxRetries` option to configure or disable this:\n\n<!-- prettier-ignore -->\n```js\n// Configure the default for all requests:\nconst client = new LandingAIADE({\n  maxRetries: 0, // default is 2\n});\n\n// Or, configure per-request:\nawait client.parse({\n  maxRetries: 5,\n});\n```\n\n### Timeouts\n\nRequests time out after 8 minutes by default. You can configure this with a `timeout` option:\n\n<!-- prettier-ignore -->\n```ts\n// Configure the default for all requests:\nconst client = new LandingAIADE({\n  timeout: 20 * 1000, // 20 seconds (default is 8 minutes)\n});\n\n// Override per-request:\nawait client.parse({\n  timeout: 5 * 1000,\n});\n```\n\nOn timeout, an `APIConnectionTimeoutError` is thrown.\n\nNote that requests which time out will be [retried twice by default](#retries).\n\n\n\n\n\n## Advanced Usage\n\n### Accessing raw Response data (e.g., headers)\n\nThe \"raw\" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.\nThis method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.\n\nYou can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.\nUnlike `.asResponse()` this method consumes the body, returning once it is parsed.\n\n<!-- prettier-ignore -->\n```ts\nconst client = new LandingAIADE();\n\nconst response = await client.parse().asResponse();\nconsole.log(response.headers.get('X-My-Header'));\nconsole.log(response.statusText); // access the underlying Response object\n\nconst { data: response, response: raw } = await client.parse().withResponse();\nconsole.log(raw.headers.get('X-My-Header'));\nconsole.log(response.chunks);\n```\n\n### Logging\n\n> [!IMPORTANT]\n> All log messages are intended for debugging only. The format and content of log messages\n> may change between releases.\n\n#### Log levels\n\nThe log level can be configured in two ways:\n\n1. Via the `LANDINGAI_ADE_LOG` environment variable\n2. Using the `logLevel` client option (overrides the environment variable if set)\n\n```ts\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  logLevel: 'debug', // Show all log messages\n});\n```\n\nAvailable log levels, from most to least verbose:\n\n- `'debug'` - Show debug messages, info, warnings, and errors\n- `'info'` - Show info messages, warnings, and errors\n- `'warn'` - Show warnings and errors (default)\n- `'error'` - Show only errors\n- `'off'` - Disable all logging\n\nAt the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.\nSome authentication-related headers are redacted, but sensitive data in request and response bodies\nmay still be visible.\n\n#### Custom logger\n\nBy default, this library logs to `globalThis.console`. You can also provide a custom logger.\nMost logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.\n\nWhen providing a custom logger, the `logLevel` option still controls which messages are emitted, messages\nbelow the configured level will not be sent to your logger.\n\n```ts\nimport LandingAIADE from 'landingai-ade';\nimport pino from 'pino';\n\nconst logger = pino();\n\nconst client = new LandingAIADE({\n  logger: logger.child({ name: 'LandingAIADE' }),\n  logLevel: 'debug', // Send all messages to pino, allowing it to filter\n});\n```\n\n### Making custom/undocumented requests\n\nThis library is typed for convenient access to the documented API. If you need to access undocumented\nendpoints, params, or response properties, the library can still be used.\n\n#### Undocumented endpoints\n\nTo make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.\nOptions on the client, such as retries, will be respected when making these requests.\n\n```ts\nawait client.post('/some/path', {\n  body: { some_prop: 'foo' },\n  query: { some_query_arg: 'bar' },\n});\n```\n\n#### Undocumented request params\n\nTo make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented\nparameter. This library doesn't validate at runtime that the request matches the type, so any extra values you\nsend will be sent as-is.\n\n```ts\nclient.parse({\n  // ...\n  // @ts-expect-error baz is not yet public\n  baz: 'undocumented option',\n});\n```\n\nFor requests with the `GET` verb, any extra params will be in the query, all other requests will send the\nextra param in the body.\n\nIf you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request\noptions.\n\n#### Undocumented response properties\n\nTo access undocumented response properties, you may access the response object with `// @ts-expect-error` on\nthe response object, or cast the response object to the requisite type. Like the request params, we do not\nvalidate or strip extra properties from the response from the API.\n\n### Customizing the fetch client\n\nBy default, this library expects a global `fetch` function is defined.\n\nIf you want to use a different `fetch` function, you can either polyfill the global:\n\n```ts\nimport fetch from 'my-fetch';\n\nglobalThis.fetch = fetch;\n```\n\nOr pass it to the client:\n\n```ts\nimport LandingAIADE from 'landingai-ade';\nimport fetch from 'my-fetch';\n\nconst client = new LandingAIADE({ fetch });\n```\n\n### Fetch options\n\nIf you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)\n\n```ts\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  fetchOptions: {\n    // `RequestInit` options\n  },\n});\n```\n\n#### Configuring proxies\n\nTo modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy\noptions to requests:\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg\" align=\"top\" width=\"18\" height=\"21\"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>\n\n```ts\nimport LandingAIADE from 'landingai-ade';\nimport * as undici from 'undici';\n\nconst proxyAgent = new undici.ProxyAgent('http://localhost:8888');\nconst client = new LandingAIADE({\n  fetchOptions: {\n    dispatcher: proxyAgent,\n  },\n});\n```\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg\" align=\"top\" width=\"18\" height=\"21\"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>\n\n```ts\nimport LandingAIADE from 'landingai-ade';\n\nconst client = new LandingAIADE({\n  fetchOptions: {\n    proxy: 'http://localhost:8888',\n  },\n});\n```\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg\" align=\"top\" width=\"18\" height=\"21\"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>\n\n```ts\nimport LandingAIADE from 'npm:landingai-ade';\n\nconst httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });\nconst client = new LandingAIADE({\n  fetchOptions: {\n    client: httpClient,\n  },\n});\n```\n\n## Frequently Asked Questions\n\n## Semantic versioning\n\nThis package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:\n\n1. Changes that only affect static types, without breaking runtime behavior.\n2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_\n3. Changes that we do not expect to impact the vast majority of users in practice.\n\nWe take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.\n\nWe are keen for your feedback; please open an [issue](https://www.github.com/landing-ai/ade-typescript/issues) with questions, bugs, or suggestions.\n\n## Requirements\n\nTypeScript >= 4.9 is supported.\n\nThe following runtimes are supported:\n\n- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)\n- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.\n- Deno v1.28.0 or higher.\n- Bun 1.0 or later.\n- Cloudflare Workers.\n- Vercel Edge Runtime.\n- Jest 28 or greater with the `\"node\"` environment (`\"jsdom\"` is not supported at this time).\n- Nitro v2.6 or greater.\n\nNote that React Native is not supported at this time.\n\nIf you are interested in other runtime environments, please open or upvote an issue on GitHub.\n\n## Contributing\n\nSee [the contributing documentation](./CONTRIBUTING.md).\n",
  },
];

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
