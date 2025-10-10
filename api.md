# LandingAIADE

Types:

- <code><a href="./src/resources/top-level.ts">ExtractResponse</a></code>
- <code><a href="./src/resources/top-level.ts">ParseResponse</a></code>

Methods:

- <code title="post /v1/ade/extract">client.<a href="./src/index.ts">extract</a>({ ...params }) -> ExtractResponse</code>
- <code title="post /v1/ade/parse">client.<a href="./src/index.ts">parse</a>({ ...params }) -> ParseResponse</code>

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
