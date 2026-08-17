# LandingAIADE

Types:

- <code><a href="./src/resources/top-level.ts">ClassifyResponse</a></code>
- <code><a href="./src/resources/top-level.ts">ExtractResponse</a></code>
- <code><a href="./src/resources/top-level.ts">ExtractBuildSchemaResponse</a></code>
- <code><a href="./src/resources/top-level.ts">ParseResponse</a></code>
- <code><a href="./src/resources/top-level.ts">SectionResponse</a></code>
- <code><a href="./src/resources/top-level.ts">SplitResponse</a></code>

Methods:

- <code title="post /v1/ade/classify">client.<a href="./src/index.ts">classify</a>({ ...params }) -> ClassifyResponse</code>
- <code title="post /v1/ade/extract">client.<a href="./src/index.ts">extract</a>({ ...params }) -> ExtractResponse</code>
- <code title="post /v1/ade/extract/build-schema">client.<a href="./src/index.ts">extractBuildSchema</a>({ ...params }) -> ExtractBuildSchemaResponse</code>
- <code title="post /v1/ade/parse">client.<a href="./src/index.ts">parse</a>({ ...params }) -> ParseResponse</code>
- <code title="post /v1/ade/section">client.<a href="./src/index.ts">section</a>({ ...params }) -> SectionResponse</code>
- <code title="post /v1/ade/split">client.<a href="./src/index.ts">split</a>({ ...params }) -> SplitResponse</code>

# Shared

Types:

- <code><a href="./src/resources/shared.ts">ParseGroundingBox</a></code>
- <code><a href="./src/resources/shared.ts">ParseMetadata</a></code>

# ParseJobs

Types:

- <code><a href="./src/resources/parse-jobs.ts">ParseJobCreateResponse</a></code>
- <code><a href="./src/resources/parse-jobs.ts">ParseJobListResponse</a></code>
- <code><a href="./src/resources/parse-jobs.ts">ParseJobGetResponse</a></code>

Methods:

- <code title="post /v1/ade/parse/jobs">client.parseJobs.<a href="./src/resources/parse-jobs.ts">create</a>({ ...params }) -> ParseJobCreateResponse</code>
- <code title="get /v1/ade/parse/jobs">client.parseJobs.<a href="./src/resources/parse-jobs.ts">list</a>({ ...params }) -> ParseJobListResponse</code>
- <code title="get /v1/ade/parse/jobs/{job_id}">client.parseJobs.<a href="./src/resources/parse-jobs.ts">get</a>(jobID) -> ParseJobGetResponse</code>

# ExtractJobs

Types:

- <code><a href="./src/resources/extract-jobs.ts">ExtractJobCreateResponse</a></code>
- <code><a href="./src/resources/extract-jobs.ts">ExtractJobListResponse</a></code>
- <code><a href="./src/resources/extract-jobs.ts">ExtractJobGetResponse</a></code>

Methods:

- <code title="post /v1/ade/extract/jobs">client.extractJobs.<a href="./src/resources/extract-jobs.ts">create</a>({ ...params }) -> ExtractJobCreateResponse</code>
- <code title="get /v1/ade/extract/jobs">client.extractJobs.<a href="./src/resources/extract-jobs.ts">list</a>({ ...params }) -> ExtractJobListResponse</code>
- <code title="get /v1/ade/extract/jobs/{job_id}">client.extractJobs.<a href="./src/resources/extract-jobs.ts">get</a>(jobID) -> ExtractJobGetResponse</code>

# V2

The `client.v2` sub-client targets LandingAI's next-generation ADE gateway on its own host (`api.ade.[env].landing.ai`), separate from the V1 host (`api.va.[env].landing.ai`). It is **additive** — `client.v2.*` is a separate surface from the top-level `client.*` (V1) methods above, and using it does not change any V1 behavior.

Every node in a parse `structure` tree carries a <a href="./src/resources/v2/types.ts">`V2Grounding`</a> (`{ page, range, box }`, plus an optional `confidence`). `confidence` is populated only on word-granularity `atomic_grounding` entries (`dpt-3-fast`); it is omitted on node-level grounding and on line-granularity models (`dpt-3-pro`), so test it with `== null`.

`client.v2.parseJobs` and `client.v2.extractJobs` both return a single, unified <a href="./src/resources/v2/types.ts">`Job`</a> shape even though the underlying parse/extract job envelopes differ upstream — `Job.raw` retains the full original envelope as an escape hatch. `Job.metadata` carries the envelope's top-level metadata receipt (a <a href="./src/resources/v2/types.ts">`V2ParseMetadata`</a> for parse jobs), returned alongside `raw.output_url` when a job created with `output_save_url` completes; it is `null` for inline jobs, whose metadata lives on `Job.result`.

Types:

- <code><a href="./src/resources/v2/types.ts">Job</a></code>
- <code><a href="./src/resources/v2/types.ts">JobError</a></code>
- <code><a href="./src/resources/v2/types.ts">JobList</a></code>
- <code><a href="./src/resources/v2/types.ts">JobStatus</a></code>
- <code><a href="./src/resources/v2/types.ts">V2ParseResponse</a></code>
- <code><a href="./src/resources/v2/types.ts">V2ParseMetadata</a></code>
- <code><a href="./src/resources/v2/types.ts">V2Grounding</a></code>
- <code><a href="./src/resources/v2/types.ts">V2GroundingBox</a></code>
- <code><a href="./src/resources/v2/types.ts">V2ExtractResult</a></code>
- <code><a href="./src/resources/v2/types.ts">V2BuildSchemaResult</a></code>
- <code><a href="./src/resources/v2/types.ts">V2BuildSchemaMetadata</a></code>
- <code><a href="./src/resources/v2/types.ts">BuildSchemaWarning</a></code>
- <code><a href="./src/resources/v2/types.ts">V2GroundResult</a></code>
- <code><a href="./src/resources/v2/types.ts">V2GroundMetadata</a></code>
- <code><a href="./src/resources/v2/types.ts">V2WorkflowResult</a></code>

Methods:

- <code title="post /v2/parse">client.v2.<a href="./src/resources/v2/v2.ts">parse</a>({ ...params }) -> V2ParseResponse</code>
- <code title="post /v2/extract">client.v2.<a href="./src/resources/v2/v2.ts">extract</a>({ ...params }) -> V2ExtractResult</code>
- <code title="post /v2/ground">client.v2.<a href="./src/resources/v2/v2.ts">ground</a>({ ...params }) -> V2GroundResult</code>
- <code title="post /v2/parse/jobs">client.v2.parseJobs.<a href="./src/resources/v2/parse.ts">create</a>({ ...params }) -> Job</code>
- <code title="get /v2/parse/jobs/{job_id}">client.v2.parseJobs.<a href="./src/resources/v2/parse.ts">get</a>(jobID) -> Job</code>
- <code title="get /v2/parse/jobs">client.v2.parseJobs.<a href="./src/resources/v2/parse.ts">list</a>({ ...params }) -> JobList</code>
- <code>client.v2.parseJobs.<a href="./src/resources/v2/parse.ts">wait</a>(jobID, { ...options }) -> Job</code>
- <code title="post /v2/extract/jobs">client.v2.extractJobs.<a href="./src/resources/v2/extract.ts">create</a>({ ...params }) -> Job</code>
- <code title="get /v2/extract/jobs/{job_id}">client.v2.extractJobs.<a href="./src/resources/v2/extract.ts">get</a>(jobID) -> Job</code>
- <code title="get /v2/extract/jobs">client.v2.extractJobs.<a href="./src/resources/v2/extract.ts">list</a>({ ...params }) -> JobList</code>
- <code>client.v2.extractJobs.<a href="./src/resources/v2/extract.ts">wait</a>(jobID, { ...options }) -> Job</code>
- <code title="post /v2/workflow">client.v2.<a href="./src/resources/v2/v2.ts">workflow</a>({ ...params }) -> V2WorkflowResult</code>
- <code title="post /v2/workflow/jobs">client.v2.workflowJobs.<a href="./src/resources/v2/workflow.ts">create</a>({ ...params }) -> Job</code>
- <code title="get /v2/workflow/jobs/{job_id}">client.v2.workflowJobs.<a href="./src/resources/v2/workflow.ts">get</a>(jobID) -> Job</code>
- <code title="get /v2/workflow/jobs">client.v2.workflowJobs.<a href="./src/resources/v2/workflow.ts">list</a>({ ...params }) -> JobList</code>
- <code>client.v2.workflowJobs.<a href="./src/resources/v2/workflow.ts">wait</a>(jobID, { ...options }) -> Job</code>
