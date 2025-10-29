// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface ParseGroundingBox {
  bottom: number;

  left: number;

  right: number;

  top: number;
}

export interface ParseMetadata {
  credit_usage: number;

  duration_ms: number;

  filename: string;

  job_id: string;

  org_id: string | null;

  page_count: number;

  version: string | null;

  failed_pages?: Array<number>;
}
