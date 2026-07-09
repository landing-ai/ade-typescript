// V2 (ADE gateway) types.
//
// The response models below mirror the wire JSON (snake_case), matching the
// convention used by the rest of the SDK. The unified `Job` / `JobList` shapes
// are a hand-written, normalized ergonomic layer over the divergent parse and
// extract job envelopes and therefore use idiomatic camelCase; the full
// original envelope is always available on `Job.raw`.

/**
 * Common job status across parse and extract jobs. Extract jobs never report
 * `cancelled`, but the union is shared so callers only learn one enum.
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface JobError {
  code: string | null;

  message: string | null;
}

/**
 * One normalized job shape across parse and extract (the envelopes diverge
 * upstream). `result` is a `V2ParseResponse` for parse jobs and a
 * `V2ExtractResult` for extract jobs, or `null` until completion. `raw` retains
 * the full original envelope for any field not surfaced here (e.g. `org_id`,
 * `output_url`, `version`).
 */
export interface Job {
  jobId: string;

  status: JobStatus;

  createdAt: Date | null;

  completedAt: Date | null;

  progress: number | null;

  result: V2ParseResponse | V2ExtractResult | null;

  error: JobError | null;

  /** `true` when `status` is `completed`, `failed`, or `cancelled`. */
  isTerminal: boolean;

  raw: Record<string, unknown>;
}

/**
 * A page of normalized jobs plus the pagination envelope. `orgId` is populated
 * for parse listings, `page`/`pageSize` for extract listings.
 */
export interface JobList {
  jobs: Array<Job>;

  hasMore: boolean;

  orgId: string | null;

  page: number | null;

  pageSize: number | null;
}

export interface V2ParseBilling {
  service_tier?: string | null;

  total_credits?: number | null;
}

export interface V2ParseMetadata {
  req_id?: string | null;

  job_id?: string | null;

  model_version?: string | null;

  page_count?: number | null;

  markdown_chars?: number | null;

  /** Pages that could not be parsed. Populated on a 206 partial success. */
  failed_pages?: Array<number> | null;

  duration_ms?: number | null;

  billing?: V2ParseBilling | null;
}

/**
 * V2 parse result. The gateway spec types this loosely, so fields are permissive
 * and unknown keys are retained (accessible via the index signature). Re-verify
 * against the typed schema once the gateway publishes one.
 */
export interface V2ParseResponse {
  markdown?: string | null;

  structure?: unknown;

  grounding?: unknown;

  metadata?: V2ParseMetadata | null;

  [key: string]: unknown;
}

export interface V2ExtractMetadata {
  job_id: string;

  version: string;

  duration_ms: number;

  doc_id?: string | null;

  credit_usage?: number;
}

export interface V2ExtractResult {
  extraction: Record<string, unknown>;

  extraction_metadata: Record<string, unknown>;

  markdown: string;

  metadata: V2ExtractMetadata;
}

/**
 * `POST /v1/files` returns an open string map; `file_ref` is the key the SDK
 * consumes to reference staged markdown.
 */
export interface V2FileUploadResponse {
  file_ref?: string | null;

  [key: string]: unknown;
}

const TERMINAL_STATUSES: ReadonlySet<JobStatus> = new Set<JobStatus>(['completed', 'failed', 'cancelled']);

export function isTerminalStatus(status: JobStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}
