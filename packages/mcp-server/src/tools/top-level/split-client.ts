// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';

export const metadata: Metadata = {
  resource: '$client',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/ade/split',
  operationId: 'tool_ade_split_v1_ade_split_post',
};

export const tool: Tool = {
  name: 'split_client',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nSplit classification for documents.\n\nThis endpoint classifies document sections\n    based on markdown content and split options.\n\nFor EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/split`.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/split_response',\n  $defs: {\n    split_response: {\n      type: 'object',\n      title: 'SplitResponse',\n      description: 'Response model for split classification endpoint.',\n      properties: {\n        metadata: {\n          type: 'object',\n          title: 'SplitMetadata',\n          description: 'Metadata for split classification response.',\n          properties: {\n            credit_usage: {\n              type: 'number',\n              title: 'Credit Usage'\n            },\n            duration_ms: {\n              type: 'integer',\n              title: 'Duration Ms'\n            },\n            filename: {\n              type: 'string',\n              title: 'Filename'\n            },\n            page_count: {\n              type: 'integer',\n              title: 'Page Count'\n            },\n            job_id: {\n              type: 'string',\n              title: 'Job Id',\n              description: 'Inference history job ID'\n            },\n            org_id: {\n              type: 'string',\n              title: 'Org Id',\n              description: 'Organization ID'\n            },\n            version: {\n              type: 'string',\n              title: 'Version',\n              description: 'Model version used for split classification'\n            }\n          },\n          required: [            'credit_usage',\n            'duration_ms',\n            'filename',\n            'page_count'\n          ]\n        },\n        splits: {\n          type: 'array',\n          title: 'Splits',\n          items: {\n            type: 'object',\n            title: 'SplitData',\n            description: 'Split data for split classification endpoint.',\n            properties: {\n              classification: {\n                type: 'string',\n                title: 'Classification'\n              },\n              identifier: {\n                type: 'string',\n                title: 'Identifier'\n              },\n              markdowns: {\n                type: 'array',\n                title: 'Markdowns',\n                items: {\n                  type: 'string'\n                }\n              },\n              pages: {\n                type: 'array',\n                title: 'Pages',\n                items: {\n                  type: 'integer'\n                }\n              }\n            },\n            required: [              'classification',\n              'identifier',\n              'markdowns',\n              'pages'\n            ]\n          }\n        }\n      },\n      required: [        'metadata',\n        'splits'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      split_class: {
        type: 'array',
        title: 'Split Class',
        description:
          'List of split classification options/configuration. Can be provided as JSON string in form data.',
        items: {
          type: 'object',
          title: 'SplitClass',
          description: 'Model for split classification option.',
          properties: {
            name: {
              type: 'string',
              title: 'Name',
              description: 'Name of the split classification type',
            },
            description: {
              type: 'string',
              title: 'Description',
              description: 'Detailed description of what this split type represents',
            },
            identifier: {
              type: 'string',
              title: 'Identifier',
              description: 'Identifier to partition/group the splits by',
            },
          },
          required: ['name'],
        },
      },
      markdown: {
        type: 'string',
        title: 'Markdown',
        description: 'The Markdown file or Markdown content to split.',
      },
      markdownUrl: {
        type: 'string',
        title: 'Markdownurl',
        description: 'The URL to the Markdown file to split.',
      },
      model: {
        type: 'string',
        title: 'Model',
        description: 'Model version to use for split classification. Defaults to the latest version.',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['split_class'],
  },
  annotations: {},
};

export const handler = async (client: LandingAIADE, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.split(body)));
  } catch (error) {
    if (error instanceof LandingAIADE.APIError || isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
