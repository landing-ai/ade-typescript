// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';
import { convertFilePathToStream } from '../handler-utils';

export const metadata: Metadata = {
  resource: 'parse_jobs',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/ade/parse/jobs',
  operationId: 'tool_ade_parse_jobs_v1_ade_parse_jobs_post',
};

export const tool: Tool = {
  name: 'create_parse_jobs',
  description:
    'Create an async parse job for large documents or batches. Returns a job_id that can be used with get_parse_jobs to check status and retrieve results. Use this for documents that may take longer to process.\n\nIMPORTANT: Always use the `jq_filter` parameter to extract only the fields you need.',
  inputSchema: {
    type: 'object',
    properties: {
      document: {
        type: 'string',
        title: 'Document',
        description:
          'Absolute file path to the document to be parsed (e.g., "/Users/name/Desktop/file.pdf"). The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document_url` parameter must be provided.',
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
      output_save_url: {
        type: 'string',
        title: 'Output Save Url',
        description:
          'If zero data retention (ZDR) is enabled, you must enter a URL for the parsed output to be saved to. When ZDR is enabled, the parsed content will not be in the API response.',
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
  const { jq_filter, document, ...body } = args as any;

  const processedBody = {
    ...body,
    document: convertFilePathToStream(document)
  };

  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.parseJobs.create(processedBody)));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
