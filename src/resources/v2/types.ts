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
 * One normalized job shape across parse, extract, build-schema, ground, and
 * workflow (the envelopes diverge upstream). `result` is a `V2ParseResponse`
 * for parse jobs, a `V2ExtractResult` for extract jobs, a `V2BuildSchemaResult`
 * for build-schema jobs, a `V2GroundResult` for ground jobs, and a
 * `V2WorkflowResult` for workflow jobs, or `null` until completion. `raw`
 * retains the full original envelope for any field not surfaced here (e.g.
 * `org_id`, `output_url`, `model_version`).
 */
export interface Job {
  job_id: string;

  status: JobStatus;

  created_at: Date | null;

  completed_at: Date | null;

  /**
   * Estimated completion as a decimal from 0 to 1 while `processing` — an
   * estimate, not a measurement: it typically advances between polls, may jump
   * forward when the service reports a real milestone (e.g. parsed pages), and
   * approaches but never reaches 1 (long-running jobs plateau near 0.98).
   * Completion is signalled by `status`, and a job may complete from any
   * progress value.
   */
  progress: number | null;

  result: V2ParseResponse | V2ExtractResult | V2BuildSchemaResult | V2GroundResult | V2WorkflowResult | null;

  /**
   * The result's metadata block (billing included), present alongside
   * `raw.output_url` once a job created with `output_save_url` has `completed`
   * — the delivery moves the content, not the receipt. Parse jobs carry a
   * `V2ParseMetadata`; extract jobs carry an untyped block of the same shape as
   * their inline `result.metadata`. `null` for inline jobs, which carry their
   * metadata inside `result` instead.
   */
  metadata?: V2ParseMetadata | Record<string, unknown> | null;

  error: JobError | null;

  /** `true` when `status` is `completed`, `failed`, or `cancelled`. */
  is_terminal: boolean;

  raw: Record<string, unknown>;
}

/**
 * A page of normalized jobs plus the pagination envelope. `org_id` is populated
 * for parse listings, `page`/`page_size` for extract/workflow listings.
 */
export interface JobList {
  jobs: Array<Job>;

  has_more: boolean;

  org_id: string | null;

  page: number | null;

  page_size: number | null;
}

/** Billing summary: the service tier the request ran in and the credits charged. */
export interface V2Billing {
  service_tier?: 'standard' | 'priority' | null;

  total_credits?: number | null;

  /** Characters in the input markdown as submitted — the input basis of the charge. Extract responses only. */
  input_markdown_chars?: number | null;

  /** Characters in the serialized extraction output — the output basis of the charge. Extract responses only. */
  output_extraction_chars?: number | null;
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

  /** Number of Unicode code points in the returned `markdown` string. */
  output_markdown_chars?: number | null;

  /** 1-indexed pages that failed to parse. Empty when all pages succeed. */
  failed_pages?: Array<number> | null;

  /** Total processing time in milliseconds. Required per spec; the value may be `null`. */
  duration_ms: number | null;

  billing?: V2ParseBilling | null;

  /**
   * Units of every `range` offset in the response. Always `unicode_codepoints`
   * (Unicode code points into `markdown`).
   */
  range_units?: 'unicode_codepoints';

  /** URL of the OpenAPI spec covering this API, for inspection and client generation. */
  openapi_spec?: string;
}

/** `[start, end)` Unicode code-point offsets into the top-level `markdown`. */
export type V2Span = [number, number];

/** A `[start, end)` slice of the top-level `markdown` string, in `metadata.range_units`. */
export interface V2Range {
  start: number;

  end: number;
}

/**
 * Axis-aligned bounding box in normalized page coordinates: each value is a
 * fraction of the page width (`xmin`/`xmax`) or height (`ymin`/`ymax`) in
 * `[0, 1]`, carried to at most 5 decimal places. To convert to pixels,
 * multiply by the dimensions of whatever raster of the page you are drawing
 * on. The gateway clamps and rounds before serializing, so the value read
 * back here is exactly the stored one — there is nothing finer behind it.
 */
export interface V2GroundingBox {
  xmin: number;

  ymin: number;

  xmax: number;

  ymax: number;
}

/**
 * Where a node lives: its 1-indexed `page`, its `range` slice of the top-level
 * `markdown`, and its bounding `box` in normalized page coordinates. The same
 * shape is used for page nodes, element nodes, and each `atomic_grounding`
 * entry, so any grounding object is self-contained.
 */
export interface V2Grounding {
  page: number;

  range: V2Range;

  /**
   * Bounding box in normalized page coordinates (`0`–`1` fractions of page
   * width/height, at most 5 decimal places). A page node's box is always the
   * full page `{ xmin: 0, ymin: 0, xmax: 1, ymax: 1 }`.
   */
  box: V2GroundingBox;

  /**
   * The lowest OCR confidence of the text in this grounding, in `[0, 1]` and
   * rounded to at most 2 decimal places — the wire carries `0.42`, never
   * `0.4237`, so a threshold comparison is exact at that resolution and there
   * is no finer score to recover.
   *
   * Word-granularity models (`dpt-3-fast`) set it at every level of the tree
   * with the same weakest-link rule: a word `atomic_grounding` entry carries the
   * lowest per-character OCR confidence in the word, and each parent grounding
   * (element, `table_cell`, `table`, page) carries the lowest confidence among
   * its transcribed words — so a node is never more trustworthy than its worst
   * word. Optional per spec (it is not in `Grounding.required`): the gateway
   * *omits* the key wherever no transcribed word carries a score — models that
   * ground at line granularity (`dpt-3-pro`), blocks whose text the model wrote
   * rather than read (captioned figures and similar), and blocks with markdown
   * suppressed — so it reads back as `undefined` there, not `null`. Test with
   * `== null` to cover both.
   */
  min_ocr_confidence?: number | null;

  /**
   * @deprecated Renamed to {@link V2Grounding.min_ocr_confidence} — the score
   * was always the lowest per-character OCR confidence rather than a general
   * model confidence, and the spec renamed the field to say so. Kept for
   * backwards compatibility; current gateways send `min_ocr_confidence` and
   * omit this key, so read `min_ocr_confidence` instead.
   */
  confidence?: number | null;
}

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

  /**
   * The element's spatial data: the page it appears on, its `[start, end)`
   * range in `markdown`, and its bounding box in normalized page coordinates.
   * On word-granularity models its `min_ocr_confidence` rolls the words up —
   * the lowest confidence among the words this element (or, for a `table`, this
   * table's cells) transcribes.
   */
  grounding?: V2Grounding;

  /**
   * Fine-grained grounding segments, at whichever granularity the model reads
   * at: one entry per visual line for `dpt-3-pro`, one per word — each with its
   * `min_ocr_confidence` — for `dpt-3-fast`, including the words inside table
   * cells. Present only on leaf elements; omitted entirely when
   * `options.atomic_grounding` is `false`. Reading
   * `grounding.min_ocr_confidence` instead gives the same worst-word score
   * already rolled up to this element.
   */
  atomic_grounding?: Array<V2Grounding> | null;

  /** This element's slice of `markdown`. Present only with `options.inline_markdown`. */
  markdown?: string | null;

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

  /**
   * The page's spatial data: 1-indexed `page` number, `range` into `markdown`,
   * and a full-page `box`. On word-granularity models its `min_ocr_confidence`
   * is the lowest confidence among every word transcribed on the page.
   */
  grounding?: V2Grounding;

  /** This page's slice of `markdown`. Present only with `options.inline_markdown`. */
  markdown?: string | null;
}

/** The document's hierarchical `structure`: pages and their elements. */
export interface V2ParseStructure {
  type?: 'document';

  children?: Array<V2ParsePage>;

  /** The full document markdown, mirroring the top-level `markdown`. Present only with `options.inline_markdown`. */
  markdown?: string | null;
}

/** V2 parse result: full `markdown` and hierarchical `structure` (grounding is inline on each node). */
export interface V2ParseResponse {
  markdown?: string | null;

  structure?: V2ParseStructure | null;

  metadata: V2ParseMetadata;
}

// ---- Extract ----

export interface V2ExtractMetadata {
  job_id: string;

  version: string;

  /** Resolved model version. Spec renamed `version` → `model_version`; both are surfaced. */
  model_version?: string;

  duration_ms: number;

  doc_id?: string | null;

  credit_usage?: number;

  billing?: V2Billing | null;

  /** Characters (Unicode code points) in the input markdown as submitted — the input basis of the credit charge. */
  input_markdown_chars?: number | null;

  /** Characters in the serialized extraction output — the output basis of the credit charge. */
  output_extraction_chars?: number | null;

  /**
   * Units of every `range` offset in the response. Always `unicode_codepoints`
   * (Unicode code points into `markdown`).
   */
  range_units?: 'unicode_codepoints';

  /** URL of the OpenAPI spec covering this API, for inspection and client generation. */
  openapi_spec?: string;
}

export interface V2ExtractResult {
  extraction: Record<string, unknown>;

  extraction_metadata: Record<string, unknown>;

  markdown: string;

  metadata: V2ExtractMetadata;

  /** Present when the output was delivered out-of-band (e.g. a ZDR save URL) instead of inline. */
  output_ref?: string | null;

  /**
   * Set when `options.strict` is false and the schema contained fields the
   * model could not extract — the extraction is partial.
   */
  schema_violation_error?: string | null;

  /** Non-fatal warnings emitted during extraction. */
  warnings?: Array<Record<string, unknown>>;
}

// ---- Build schema ----

/**
 * A structured warning from the schema-generation process. `code` classifies
 * the warning (e.g. `nonconformant_schema`); `msg` is the human-readable
 * description.
 */
export interface BuildSchemaWarning {
  code: string;

  msg: string;
}

/** Response metadata for a v2 build-schema call. */
export interface V2BuildSchemaMetadata {
  /** URL of the OpenAPI spec covering this API, for inspection and client generation. */
  openapi_spec: string;

  /** Gateway job id (workflow id). */
  job_id?: string;

  /** End-to-end request duration in milliseconds. Server-defaulted to `0`, so always present. */
  duration_ms: number;

  /**
   * Name of the first source document. Retained for v1 compatibility but not
   * populated in this version — always `null`.
   */
  filename?: string | null;

  /** Organization ID. */
  org_id?: string | null;

  /**
   * Model version used for generation. build-schema is version-free, so this is
   * always `null`; retained for v1 response-shape compatibility.
   */
  version?: string | null;

  billing?: V2Billing | null;

  /** Structured warnings from the schema-generation process. */
  warnings?: Array<BuildSchemaWarning>;
}

/**
 * V2 build-schema result. `extraction_schema` is the generated JSON Schema
 * serialized as a string (VTRA parity — the field is a string, not an object).
 */
export interface V2BuildSchemaResult {
  extraction_schema: string;

  metadata: V2BuildSchemaMetadata;
}

// ---- Ground ----

/** Response metadata for a v2 ground call. */
export interface V2GroundMetadata {
  job_id: string;

  duration_ms: number;

  billing?: V2Billing | null;

  /** URL of the OpenAPI spec covering this API, for inspection and client generation. */
  openapi_spec?: string;
}

/**
 * V2 ground result. `grounding` mirrors the `extraction_metadata` tree: nested
 * objects and arrays keep their shape, and each `{value, ranges}` leaf is
 * replaced by the list of `structure` blocks its ranges overlap (each entry
 * carrying `block_id`, `type`, an optional `parent_id`, the block's own
 * `grounding`, and — when present — the overlapping `atomic_grounding` subset).
 * A leaf is `null` for a synthesised value and `[]` when no block overlapped.
 */
export interface V2GroundResult {
  grounding: Record<string, unknown>;

  metadata: V2GroundMetadata;
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

const TERMINAL_STATUSES: ReadonlySet<JobStatus> = new Set<JobStatus>(['completed', 'failed', 'cancelled']);

export function isTerminalStatus(status: JobStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}
