// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';
import * as fs from 'fs';
import { saveResultIfNeeded } from '../handler-utils';

export const metadata: Metadata = {
  resource: '$client',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/ade/extract',
  operationId: 'tool_ade_extract_v1_ade_extract_post',
};

export const tool: Tool = {
  name: 'extract_client',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nExtract structured data from Markdown using a JSON schema.\n\nThis endpoint\n    processes Markdown content and extracts structured data according to the provided\n    JSON schema.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/extract`.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/extract_response',\n  $defs: {\n    extract_response: {\n      type: 'object',\n      title: 'ExtractResponse',\n      properties: {\n        extraction: {\n          type: 'object',\n          title: 'Extraction',\n          description: 'The extracted key-value pairs.',\n          additionalProperties: true\n        },\n        extraction_metadata: {\n          type: 'object',\n          title: 'Extraction Metadata',\n          description: 'The extracted key-value pairs and the chunk_reference for each one.',\n          additionalProperties: true\n        },\n        metadata: {\n          type: 'object',\n          title: 'ExtractMetadata',\n          description: 'The metadata for the extraction process.',\n          properties: {\n            credit_usage: {\n              type: 'number',\n              title: 'Credit Usage'\n            },\n            duration_ms: {\n              type: 'integer',\n              title: 'Duration Ms'\n            },\n            filename: {\n              type: 'string',\n              title: 'Filename'\n            },\n            job_id: {\n              type: 'string',\n              title: 'Job Id'\n            },\n            org_id: {\n              type: 'string',\n              title: 'Org Id'\n            },\n            version: {\n              type: 'string',\n              title: 'Version'\n            },\n            schema_violation_error: {\n              type: 'string',\n              title: 'Schema Violation Error',\n              description: 'A detailed error message shows why the extracted data does not fully conform to the input schema. Null means the extraction result is consistent with the input schema.'\n            }\n          },\n          required: [            'credit_usage',\n            'duration_ms',\n            'filename',\n            'job_id',\n            'org_id',\n            'version'\n          ]\n        }\n      },\n      required: [        'extraction',\n        'extraction_metadata',\n        'metadata'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      schema: {
        type: 'string',
        title: 'Schema',
        description:
          'JSON schema for field extraction. This schema determines what key-values pairs are extracted from the Markdown. The schema must be a valid JSON object and will be validated before processing the document.',
      },
      markdown: {
        type: 'string',
        title: 'Markdown',
        description: 'The raw Markdown content as a string to extract data from. For parsing files, use the parse_client tool first to get markdown content.',
      },
      markdown_url: {
        type: 'string',
        title: 'Markdown Url',
        description: 'The URL to the Markdown file to extract data from.',
      },
      model: {
        type: 'string',
        title: 'Model',
        description:
          'The version of the model to use for extraction. Use `extract-latest` to use the latest version.',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['schema'],
  },
  annotations: {},
};

export const handler = async (client: LandingAIADE, args: Record<string, unknown> | undefined) => {
  const { jq_filter, markdown, schema, ...body } = args as any;

  const processedBody = {
    ...body,
    markdown: typeof markdown === 'string' && markdown.endsWith('.md') ? fs.createReadStream(markdown) : markdown,
    schema: typeof schema === 'object' ? JSON.stringify(schema) : schema
  };

  try {
    const result = await client.extract(processedBody);

    const resultToReturn = saveResultIfNeeded({
      result,
      filename: `extract_result_${Date.now()}`,
      summary: {
        extraction: result.extraction,
        metadata: result.metadata
      }
    });

    return asTextContentResult(await maybeFilter(jq_filter, resultToReturn));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
