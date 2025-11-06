// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';

export const metadata: Metadata = {
  resource: '$client',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/ade/parse',
  operationId: 'tool_ade_parse_v1_ade_parse_post',
};

export const tool: Tool = {
  name: 'parse_client',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nParse a document.\n\nThis endpoint parses documents and structured Markdown,\n    chunks, and metadata.\n\n For EU users, use this endpoint:\n\n\n    `https://api.va.eu-west-1.landing.ai/v1/ade/parse`.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/parse_response',\n  $defs: {\n    parse_response: {\n      type: 'object',\n      title: 'ParseResponse',\n      properties: {\n        chunks: {\n          type: 'array',\n          title: 'Chunks',\n          items: {\n            type: 'object',\n            title: 'ParseChunk',\n            properties: {\n              id: {\n                type: 'string',\n                title: 'Id'\n              },\n              grounding: {\n                type: 'object',\n                title: 'ParseGrounding',\n                properties: {\n                  box: {\n                    $ref: '#/$defs/parse_grounding_box'\n                  },\n                  page: {\n                    type: 'integer',\n                    title: 'Page'\n                  }\n                },\n                required: [                  'box',\n                  'page'\n                ]\n              },\n              markdown: {\n                type: 'string',\n                title: 'Markdown'\n              },\n              type: {\n                type: 'string',\n                title: 'Type'\n              }\n            },\n            required: [              'id',\n              'grounding',\n              'markdown',\n              'type'\n            ]\n          }\n        },\n        markdown: {\n          type: 'string',\n          title: 'Markdown'\n        },\n        metadata: {\n          $ref: '#/$defs/parse_metadata'\n        },\n        splits: {\n          type: 'array',\n          title: 'Splits',\n          items: {\n            type: 'object',\n            title: 'ParseSplit',\n            properties: {\n              chunks: {\n                type: 'array',\n                title: 'Chunks',\n                items: {\n                  type: 'string'\n                }\n              },\n              class: {\n                type: 'string',\n                title: 'Class'\n              },\n              identifier: {\n                type: 'string',\n                title: 'Identifier'\n              },\n              markdown: {\n                type: 'string',\n                title: 'Markdown'\n              },\n              pages: {\n                type: 'array',\n                title: 'Pages',\n                items: {\n                  type: 'integer'\n                }\n              }\n            },\n            required: [              'chunks',\n              'class',\n              'identifier',\n              'markdown',\n              'pages'\n            ]\n          }\n        },\n        grounding: {\n          type: 'object',\n          title: 'Grounding',\n          additionalProperties: true\n        }\n      },\n      required: [        'chunks',\n        'markdown',\n        'metadata',\n        'splits'\n      ]\n    },\n    parse_grounding_box: {\n      type: 'object',\n      title: 'ParseGroundingBox',\n      properties: {\n        bottom: {\n          type: 'number',\n          title: 'Bottom'\n        },\n        left: {\n          type: 'number',\n          title: 'Left'\n        },\n        right: {\n          type: 'number',\n          title: 'Right'\n        },\n        top: {\n          type: 'number',\n          title: 'Top'\n        }\n      },\n      required: [        'bottom',\n        'left',\n        'right',\n        'top'\n      ]\n    },\n    parse_metadata: {\n      type: 'object',\n      title: 'ParseMetadata',\n      properties: {\n        credit_usage: {\n          type: 'number',\n          title: 'Credit Usage'\n        },\n        duration_ms: {\n          type: 'integer',\n          title: 'Duration Ms'\n        },\n        filename: {\n          type: 'string',\n          title: 'Filename'\n        },\n        job_id: {\n          type: 'string',\n          title: 'Job Id'\n        },\n        org_id: {\n          type: 'string',\n          title: 'Org Id'\n        },\n        page_count: {\n          type: 'integer',\n          title: 'Page Count'\n        },\n        version: {\n          type: 'string',\n          title: 'Version'\n        },\n        failed_pages: {\n          type: 'array',\n          title: 'Failed Pages',\n          items: {\n            type: 'integer'\n          }\n        }\n      },\n      required: [        'credit_usage',\n        'duration_ms',\n        'filename',\n        'job_id',\n        'org_id',\n        'page_count',\n        'version'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      document: {
        type: 'string',
        title: 'Document',
        description:
          'A file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document_url` parameter must be provided.',
      },
      document_url: {
        type: 'string',
        title: 'Document Url',
        description:
          'The URL to the file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document` parameter must be provided.',
      },
      model: {
        type: 'string',
        title: 'Model',
        description: 'The version of the model to use for parsing.',
      },
      split: {
        type: 'string',
        title: 'SplitType',
        description:
          'If you want to split documents into smaller sections, include the split parameter. Set the parameter to page to split documents at the page level. The splits object in the API output will contain a set of data for each page.',
        enum: ['page'],
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: [],
  },
  annotations: {},
};

export const handler = async (client: LandingAIADE, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.parse(body)));
};

export default { metadata, tool, handler };
