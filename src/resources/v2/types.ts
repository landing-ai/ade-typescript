// V2 (ADE gateway) types.
//
// The response models below mirror the wire JSON (snake_case), matching the
// convention used by the rest of the SDK. The unified `Job` / `JobList` shapes
// are a hand-written, normalized ergonomic layer over the divergent parse and
// extract job envelopes and therefore use idiomatic camelCase; the full
// original envelope is always available on `Job.raw`.

/**
 * Common job status across parse, extract, and workflow jobs. Extract and
 * workflow jobs never report `cancelled`, but the union is shared so callers
 * only learn one enum.
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface JobError {
  code: string | null;

  message: string | null;
}

/**
 * One normalized job shape across parse, extract, and workflow (the envelopes
 * diverge upstream). `result` is a `V2ParseResponse` for parse jobs, a
 * `V2ExtractResult` for extract jobs, and a `V2WorkflowResult` for workflow
 * jobs, or `null` until completion. `raw` retains the full original envelope
 * for any field not surfaced here (e.g. `org_id`, `output_url`, `version`).
 */
export interface Job {
  jobId: string;

  status: JobStatus;

  createdAt: Date | null;

  completedAt: Date | null;

  progress: number | null;

  result: V2ParseResponse | V2ExtractResult | V2WorkflowResult | null;

  error: JobError | null;

  /** `true` when `status` is `completed`, `failed`, or `cancelled`. */
  isTerminal: boolean;

  raw: Record<string, unknown>;
}

/**
 * A page of normalized jobs plus the pagination envelope. `orgId` is populated
 * for parse listings, `page`/`pageSize` for extract/workflow listings.
 */
export interface JobList {
  jobs: Array<Job>;

  hasMore: boolean;

  orgId: string | null;

  page: number | null;

  pageSize: number | null;
}

/** Billing summary: the service tier the request ran in and the credits charged. */
export interface V2Billing {
  service_tier?: 'standard' | 'priority' | null;

  total_credits?: number | null;
}

// ---- Parse ----

export interface V2ParseBilling {
  service_tier?: 'standard' | 'priority' | null;

  total_credits?: number | null;
}

export interface V2ParseMetadata {
  req_id?: string | null;

  job_id?: string | null;

  model_version?: string | null;

  page_count?: number | null;

  markdown_chars?: number | null;

  /** 0-indexed pages that failed to parse. Populated on a 206 partial success. */
  failed_pages?: Array<number> | null;

  duration_ms?: number | null;

  billing?: V2ParseBilling | null;
}

/** `[start, end)` Unicode code-point offsets into the top-level `markdown`. */
export type V2Span = [number, number];

/** `[left, top, right, bottom]` bounding box on the source page, in pixels. */
export type V2Box = [number, number, number, number];

export type V2ElementType =
  | 'text'
  | 'table'
  | 'table_cell'
  | 'figure'
  | 'marginalia'
  | 'attestation'
  | 'logo'
  | 'card'
  | 'scan_code';

/** A node in the `structure` tree (non-page element). */
export interface V2ParseElement {
  type: V2ElementType;

  id: string;

  span: V2Span;

  /** Cells of a `table` element; present only when `type` is `table`. */
  children?: Array<V2ParseElement> | null;

  row?: number | null;

  col?: number | null;

  colspan?: number | null;

  rowspan?: number | null;
}

export interface V2ParsePage {
  type?: 'page';

  page: number;

  span: V2Span;

  width?: number | null;

  height?: number | null;

  dpi?: number | null;

  status?: 'ok' | 'failed';

  reason?: string | null;

  children?: Array<V2ParseElement>;
}

/** The document's hierarchical `structure`: pages and their elements. */
export interface V2ParseStructure {
  type?: 'document';

  children?: Array<V2ParsePage>;
}

/** One fine-grained grounding segment (line-level or finer). */
export interface V2GroundingEntry {
  span: V2Span;

  box: V2Box;
}

export interface V2GroundingElement {
  type: V2ElementType;

  id: string;

  span: V2Span;

  box: V2Box;

  parts?: Array<V2GroundingEntry>;

  children?: Array<V2GroundingElement> | null;
}

export interface V2GroundingPage {
  type?: 'page';

  page: number;

  span: V2Span;

  children?: Array<V2GroundingElement>;
}

/** The document's spatial `grounding` tree, mirroring `structure`. */
export interface V2GroundingDocument {
  type?: 'document';

  children?: Array<V2GroundingPage>;
}

/** V2 parse result: full `markdown`, hierarchical `structure`, spatial `grounding`, and `metadata`. */
export interface V2ParseResponse {
  markdown?: string | null;

  structure?: V2ParseStructure | null;

  grounding?: V2GroundingDocument | null;

  metadata?: V2ParseMetadata | null;
}

// ---- Extract ----

export interface V2ExtractMetadata {
  job_id: string;

  version: string;

  duration_ms: number;

  doc_id?: string | null;

  credit_usage?: number;

  billing?: V2Billing | null;
}

export interface V2ExtractResult {
  extraction: Record<string, unknown>;

  extraction_metadata: Record<string, unknown>;

  markdown: string;

  metadata: V2ExtractMetadata;
}

// ---- Workflow ----

export interface V2WorkflowMetadata {
  job_id: string;

  duration_ms: number;

  credit_usage?: number;

  billing?: V2Billing | null;
}

/** Result of a `parse-extract` workflow: step results keyed by step name (or a caller projection). */
export interface V2WorkflowResult {
  output: Record<string, unknown>;

  metadata: V2WorkflowMetadata;
}

// ---- Files ----

/**
 * `POST /v1/files` returns an open string map; `file_ref` is the key the SDK
 * consumes to reference staged markdown/documents.
 */
export interface V2FileUploadResponse {
  file_ref?: string | null;

  [key: string]: unknown;
}

const TERMINAL_STATUSES: ReadonlySet<JobStatus> = new Set<JobStatus>(['completed', 'failed', 'cancelled']);

export function isTerminalStatus(status: JobStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}
