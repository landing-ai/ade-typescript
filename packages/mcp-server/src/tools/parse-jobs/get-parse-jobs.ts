// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';

export const metadata: Metadata = {
  resource: 'parse_jobs',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/v1/ade/parse/jobs/{job_id}',
  operationId: 'get_async_job_status_v1_ade_parse_jobs__job_id__get',
};

export const tool: Tool = {
  name: 'get_parse_jobs',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nGet the status for an async parse job.\n\nReturns the job status or an error\n   response. For EU users, use this endpoint:\n\n\n   `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs/{job_id}`.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/parse_job_get_response',\n  $defs: {\n    parse_job_get_response: {\n      type: 'object',\n      title: 'JobStatusResponse',\n      description: 'Unified response for job status endpoint.',\n      properties: {\n        job_id: {\n          type: 'string',\n          title: 'Job Id'\n        },\n        progress: {\n          type: 'number',\n          title: 'Progress',\n          description: 'Job completion progress as a decimal from 0 to 1, where 0 is not started, 1 is finished, and values between 0 and 1 indicate work in progress.'\n        },\n        received_at: {\n          type: 'integer',\n          title: 'Received At'\n        },\n        status: {\n          type: 'string',\n          title: 'Status'\n        },\n        data: {\n          type: 'object',\n          title: 'ParseResponse',\n          description: 'The parsed output, if the job is complete and the `output_save_url` parameter was not used.',\n          properties: {\n            chunks: {\n              type: 'array',\n              title: 'Chunks',\n              items: {\n                type: 'object',\n                title: 'ParseChunk',\n                properties: {\n                  id: {\n                    type: 'string',\n                    title: 'Id'\n                  },\n                  grounding: {\n                    type: 'object',\n                    title: 'ParseGrounding',\n                    properties: {\n                      box: {\n                        $ref: '#/$defs/parse_grounding_box'\n                      },\n                      page: {\n                        type: 'integer',\n                        title: 'Page'\n                      }\n                    },\n                    required: [                      'box',\n                      'page'\n                    ]\n                  },\n                  markdown: {\n                    type: 'string',\n                    title: 'Markdown'\n                  },\n                  type: {\n                    type: 'string',\n                    title: 'Type'\n                  }\n                },\n                required: [                  'id',\n                  'grounding',\n                  'markdown',\n                  'type'\n                ]\n              }\n            },\n            markdown: {\n              type: 'string',\n              title: 'Markdown'\n            },\n            metadata: {\n              $ref: '#/$defs/parse_metadata'\n            },\n            splits: {\n              type: 'array',\n              title: 'Splits',\n              items: {\n                type: 'object',\n                title: 'ParseSplit',\n                properties: {\n                  chunks: {\n                    type: 'array',\n                    title: 'Chunks',\n                    items: {\n                      type: 'string'\n                    }\n                  },\n                  class: {\n                    type: 'string',\n                    title: 'Class'\n                  },\n                  identifier: {\n                    type: 'string',\n                    title: 'Identifier'\n                  },\n                  markdown: {\n                    type: 'string',\n                    title: 'Markdown'\n                  },\n                  pages: {\n                    type: 'array',\n                    title: 'Pages',\n                    items: {\n                      type: 'integer'\n                    }\n                  }\n                },\n                required: [                  'chunks',\n                  'class',\n                  'identifier',\n                  'markdown',\n                  'pages'\n                ]\n              }\n            },\n            grounding: {\n              type: 'object',\n              title: 'Grounding',\n              additionalProperties: true\n            }\n          },\n          required: [            'chunks',\n            'markdown',\n            'metadata',\n            'splits'\n          ]\n        },\n        failure_reason: {\n          type: 'string',\n          title: 'Failure Reason'\n        },\n        metadata: {\n          $ref: '#/$defs/parse_metadata'\n        },\n        org_id: {\n          type: 'string',\n          title: 'Org Id'\n        },\n        output_url: {\n          type: 'string',\n          title: 'Output Url',\n          description: 'The URL to the parsed content. This field contains a URL when the job is complete and either you specified the `output_save_url` parameter or the result is larger than 1MB. When the result exceeds 1MB, the URL is a presigned S3 URL that expires after 1 hour. Each time you GET the job, a new presigned URL is generated.'\n        },\n        version: {\n          type: 'string',\n          title: 'Version'\n        }\n      },\n      required: [        'job_id',\n        'progress',\n        'received_at',\n        'status'\n      ]\n    },\n    parse_grounding_box: {\n      type: 'object',\n      title: 'ParseGroundingBox',\n      properties: {\n        bottom: {\n          type: 'number',\n          title: 'Bottom'\n        },\n        left: {\n          type: 'number',\n          title: 'Left'\n        },\n        right: {\n          type: 'number',\n          title: 'Right'\n        },\n        top: {\n          type: 'number',\n          title: 'Top'\n        }\n      },\n      required: [        'bottom',\n        'left',\n        'right',\n        'top'\n      ]\n    },\n    parse_metadata: {\n      type: 'object',\n      title: 'ParseMetadata',\n      properties: {\n        credit_usage: {\n          type: 'number',\n          title: 'Credit Usage'\n        },\n        duration_ms: {\n          type: 'integer',\n          title: 'Duration Ms'\n        },\n        filename: {\n          type: 'string',\n          title: 'Filename'\n        },\n        job_id: {\n          type: 'string',\n          title: 'Job Id'\n        },\n        org_id: {\n          type: 'string',\n          title: 'Org Id'\n        },\n        page_count: {\n          type: 'integer',\n          title: 'Page Count'\n        },\n        version: {\n          type: 'string',\n          title: 'Version'\n        },\n        failed_pages: {\n          type: 'array',\n          title: 'Failed Pages',\n          items: {\n            type: 'integer'\n          }\n        }\n      },\n      required: [        'credit_usage',\n        'duration_ms',\n        'filename',\n        'job_id',\n        'org_id',\n        'page_count',\n        'version'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      job_id: {
        type: 'string',
        title: 'Job Id',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['job_id'],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: LandingAIADE, args: Record<string, unknown> | undefined) => {
  const { job_id, jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.parseJobs.get(job_id)));
};

export default { metadata, tool, handler };
