# Changelog

## 2.1.0 (2026-02-13)

Full Changelog: [v2.0.1...v2.1.0](https://github.com/landing-ai/ade-typescript/compare/v2.0.1...v2.1.0)

### Features

* **api:** api update ([f226c81](https://github.com/landing-ai/ade-typescript/commit/f226c8153e7a327cb17453f30b0cf124149e099d))
* **api:** new version ([e755130](https://github.com/landing-ai/ade-typescript/commit/e7551307cb82ed069de7b11489927c3a609bd2bc))
* **mcp:** add initial server instructions ([9637e2b](https://github.com/landing-ai/ade-typescript/commit/9637e2b345b4cb1e186fa1461dad05a01d4f75bc))


### Bug Fixes

* **client:** avoid memory leak with abort signals ([71e4f45](https://github.com/landing-ai/ade-typescript/commit/71e4f451bad8a84377ce0a18e9ad558785d0bb91))
* **client:** avoid removing abort listener too early ([fc18c1c](https://github.com/landing-ai/ade-typescript/commit/fc18c1c3f7461531b7ed9c17aa60daa1c50b356b))
* **docs:** fix split example with JSON.stringify workaround ([bfe03a1](https://github.com/landing-ai/ade-typescript/commit/bfe03a15e605ec82bc34b33fe8069e4bcb3edde2))


### Chores

* **client:** do not parse responses with empty content-length ([11d7de0](https://github.com/landing-ai/ade-typescript/commit/11d7de08dbb1e9dc1e47b8e4890d907420ab544c))
* **client:** restructure abort controller binding ([2756931](https://github.com/landing-ai/ade-typescript/commit/275693176957ed1ade35ef5537dcf26735e907af))
* **internal:** add health check to MCP server when running in HTTP mode ([2c1d9a6](https://github.com/landing-ai/ade-typescript/commit/2c1d9a60503bf07211a2d41e439a34a61268fa81))
* **internal:** allow basic filtering of methods allowed for MCP code mode ([8707a79](https://github.com/landing-ai/ade-typescript/commit/8707a79e496ff54b2cc8c26f9b9572240e8ac517))
* **internal:** always generate MCP server dockerfiles and upgrade associated dependencies ([59895a0](https://github.com/landing-ai/ade-typescript/commit/59895a028a0f7e497cf08ab03d2efbea6a073e05))
* **internal:** avoid type checking errors with ts-reset ([a2f5551](https://github.com/landing-ai/ade-typescript/commit/a2f555110f00b5821aa7076f56c12ffb7a9a7c4d))
* **internal:** refactor flag parsing for MCP servers and add debug flag ([f835550](https://github.com/landing-ai/ade-typescript/commit/f83555096b55653be8777ae7e1c0f6f0e22da235))
* **internal:** support oauth authorization code flow for MCP servers ([e66b43d](https://github.com/landing-ai/ade-typescript/commit/e66b43dea81089879b0784423b343ee76058c2b0))

## 2.0.1 (2026-01-31)

Full Changelog: [v2.0.0...v2.0.1](https://github.com/landing-ai/ade-typescript/compare/v2.0.0...v2.0.1)

### Bug Fixes

* **mcp:** do not fallback on baseUrl if environment env variable is set ([6502ce6](https://github.com/landing-ai/ade-typescript/commit/6502ce6993f326445d6ecf3e2b5c0855cc297251))

## 2.0.0 (2026-01-29)

Full Changelog: [v1.4.0...v2.0.0](https://github.com/landing-ai/ade-typescript/compare/v1.4.0...v2.0.0)

### ⚠ BREAKING CHANGES

* **mcp:** remove deprecated tool schemes
* **mcp:** **Migration:** To migrate, simply modify the command used to invoke the MCP server. Currently, the only supported tool scheme is code mode. Now, starting the server with just `node /path/to/mcp/server` or `npx package-name` will invoke code tools: changing your command to one of these is likely all you will need to do.

### Features

* **api:** api update ([13d9b12](https://github.com/landing-ai/ade-typescript/commit/13d9b12cd084034831bacb7242f12f236c97fedb))


### Bug Fixes

* **docs:** fix mcp installation instructions for remote servers ([68cd8cf](https://github.com/landing-ai/ade-typescript/commit/68cd8cfb4c449545beac1719a8bd46c45938390e))
* **mcp:** allow falling back for required env variables ([962add1](https://github.com/landing-ai/ade-typescript/commit/962add1bc77b85af5f4778f52909fda7b1ac42cf))
* **mcp:** correct code tool api output types ([be27668](https://github.com/landing-ai/ade-typescript/commit/be27668858ca95a0dd7f78c47bb07edc8f8ebbf6))
* **mcp:** fix env parsing ([6da0ad5](https://github.com/landing-ai/ade-typescript/commit/6da0ad50d286218ca99d40bbc4f6adbb2632cc56))
* **mcp:** fix options parsing ([90ce5ef](https://github.com/landing-ai/ade-typescript/commit/90ce5eff6f3b9e4ad7803205e3e0f3861a953d67))
* **mcp:** update code tool prompt ([f62ca61](https://github.com/landing-ai/ade-typescript/commit/f62ca61ed6ff3d3d2aa4c9eb54c6c7c7488c9708))


### Chores

* break long lines in snippets into multiline ([30a9864](https://github.com/landing-ai/ade-typescript/commit/30a98641833a064274c1005671de280153a99d33))
* **ci:** upgrade `actions/github-script` ([c95bb45](https://github.com/landing-ai/ade-typescript/commit/c95bb451133a0124009ad9bb9c47d7dc9c3e00e9))
* **internal:** codegen related update ([51102db](https://github.com/landing-ai/ade-typescript/commit/51102db9f38f9fdb210bed551cb4fae06c700da4))
* **internal:** codegen related update ([d26d77a](https://github.com/landing-ai/ade-typescript/commit/d26d77aeb6b8f54f3c33727331e77507a010f8a2))
* **internal:** codegen related update ([6305f1e](https://github.com/landing-ai/ade-typescript/commit/6305f1ef8cd5501a10f867b9aa2e40d1de0c0e82))
* **internal:** codegen related update ([26053e4](https://github.com/landing-ai/ade-typescript/commit/26053e428c6588c0eadd5aa18354c1c0eba1472b))
* **internal:** codegen related update ([d1feaca](https://github.com/landing-ai/ade-typescript/commit/d1feaca85ea299eced09992ab98e3874308fa596))
* **internal:** codegen related update ([d0199e0](https://github.com/landing-ai/ade-typescript/commit/d0199e0486542276a775d0bcd67100e4a5be988d))
* **internal:** update `actions/checkout` version ([63a5f11](https://github.com/landing-ai/ade-typescript/commit/63a5f1198efdbf77c581264eb73acdd6de01de62))
* **internal:** update lock file ([23e8cce](https://github.com/landing-ai/ade-typescript/commit/23e8cce048c2cf01d8a0a98767a74d4fcb04170c))
* **internal:** upgrade babel, qs, js-yaml ([cccc966](https://github.com/landing-ai/ade-typescript/commit/cccc96679c38ad421d3efc78a959672d3c568636))
* **mcp:** add intent param to execute tool ([1d8f9ed](https://github.com/landing-ai/ade-typescript/commit/1d8f9edf996cb361babcb721d1c46e3dcc8849b4))
* **mcp:** pass intent param to execute handler ([bd122d9](https://github.com/landing-ai/ade-typescript/commit/bd122d9d01ca9d9834b986bbf41b1c584301e648))
* **mcp:** remove deprecated tool schemes ([2170783](https://github.com/landing-ai/ade-typescript/commit/21707831b7723dfdcb40b21db960be28994949f5))
* **mcp:** up tsconfig lib version to es2022 ([84cc9a5](https://github.com/landing-ai/ade-typescript/commit/84cc9a5a906f47f4fce9d69a40c7a3dad5c5d3ed))
* **mcp:** upgrade dependencies ([e59cf01](https://github.com/landing-ai/ade-typescript/commit/e59cf01abc6520e9535e36ae4dbf0490d33733ab))


### Documentation

* prominently feature MCP server setup in root SDK readmes ([fd39752](https://github.com/landing-ai/ade-typescript/commit/fd397526be86f090251a56248fb0f537491854e9))

## 1.4.0 (2025-12-18)

Full Changelog: [v1.3.0...v1.4.0](https://github.com/landing-ai/ade-typescript/compare/v1.3.0...v1.4.0)

### Features

* **files:** add support for string alternative to file upload type ([b3b6ce4](https://github.com/landing-ai/ade-typescript/commit/b3b6ce476f98642ad71fa4f95141e3dfa64f4fce))


### Bug Fixes

* **mcp:** pass base url to code tool ([88b8a9b](https://github.com/landing-ai/ade-typescript/commit/88b8a9b1c4ab9c66be22ee6dae08932f7cdea1b7))

## 1.3.0 (2025-12-16)

Full Changelog: [v1.2.2...v1.3.0](https://github.com/landing-ai/ade-typescript/compare/v1.2.2...v1.3.0)

### Features

* **api:** api update ([31b2ae7](https://github.com/landing-ai/ade-typescript/commit/31b2ae7fa7ea8c3b104bcf59f999ec0f0a857af3))

## 1.2.2 (2025-12-11)

Full Changelog: [v1.2.1...v1.2.2](https://github.com/landing-ai/ade-typescript/compare/v1.2.1...v1.2.2)

### Bug Fixes

* **mcp:** add client instantiation options to code tool ([bc1dbfb](https://github.com/landing-ai/ade-typescript/commit/bc1dbfb11231f2b3aad7192ae5e0090a98ca9120))


### Chores

* **internal:** codegen related update ([6cbe6ea](https://github.com/landing-ai/ade-typescript/commit/6cbe6ea4c6923fde5e30a5ba69b44135e77c05f4))
* **mcp:** update lockfile ([34f0413](https://github.com/landing-ai/ade-typescript/commit/34f041357722a7abcdf336e25e8310a304afdd4f))

## 1.2.1 (2025-12-06)

Full Changelog: [v1.2.0...v1.2.1](https://github.com/landing-ai/ade-typescript/compare/v1.2.0...v1.2.1)

### Bug Fixes

* **mcp:** correct code tool API endpoint ([9509aab](https://github.com/landing-ai/ade-typescript/commit/9509aab09cb204b053787e4428660c42d368a4e5))

## 1.2.0 (2025-12-06)

Full Changelog: [v1.1.0...v1.2.0](https://github.com/landing-ai/ade-typescript/compare/v1.1.0...v1.2.0)

### Features

* **mcp:** add typescript check to code execution tool ([244ca17](https://github.com/landing-ai/ade-typescript/commit/244ca1708bd4ca43b1c1c871dd8d980751225f7a))
* **mcp:** handle code mode calls in the Stainless API ([8363063](https://github.com/landing-ai/ade-typescript/commit/8363063335fbe9cff96574c3fdb697f2eb551c13))


### Bug Fixes

* **mcp:** return correct lines on typescript errors ([8277fdd](https://github.com/landing-ai/ade-typescript/commit/8277fdd48ea5c9c502d3c86f377d7796cd68b97d))


### Chores

* **internal:** codegen related update ([a4a8cde](https://github.com/landing-ai/ade-typescript/commit/a4a8cde7bfd7a9f81ed6219e450ecf85e85f3a76))
* use latest @modelcontextprotocol/sdk ([200e224](https://github.com/landing-ai/ade-typescript/commit/200e224dc4ff83dcbed4e115fca02dfeb73c7f00))

## 1.1.0 (2025-12-04)

Full Changelog: [v1.0.2...v1.1.0](https://github.com/landing-ai/ade-typescript/compare/v1.0.2...v1.1.0)

### Features

* **api:** api update ([a6e2baf](https://github.com/landing-ai/ade-typescript/commit/a6e2baf527c9e19cdce2533fe2fb837f2527e8d5))
* **mcp:** return logs on code tool errors ([4bee4cb](https://github.com/landing-ai/ade-typescript/commit/4bee4cbb7266f81f02b22193f4f70a7d3608789a))


### Chores

* **internal:** upgrade eslint ([238efa9](https://github.com/landing-ai/ade-typescript/commit/238efa980335b57287835ef9702bd06257f2ae6a))

## 1.0.2 (2025-12-02)

Full Changelog: [v1.0.1...v1.0.2](https://github.com/landing-ai/ade-typescript/compare/v1.0.1...v1.0.2)

### Bug Fixes

* **mcp:** return tool execution error on api error ([ac28229](https://github.com/landing-ai/ade-typescript/commit/ac28229fa39eb58acff167619fe35561b3d13780))


### Chores

* **client:** fix logger property type ([55952a1](https://github.com/landing-ai/ade-typescript/commit/55952a175a2f1696d71cbf2efed856ee22167e15))

## 1.0.1 (2025-12-02)

Full Changelog: [v1.0.0...v1.0.1](https://github.com/landing-ai/ade-typescript/compare/v1.0.0...v1.0.1)

## 1.0.0 (2025-12-02)

Full Changelog: [v0.11.2...v1.0.0](https://github.com/landing-ai/ade-typescript/compare/v0.11.2...v1.0.0)

### Features

* **api:** add extract endpoint enums ([630a005](https://github.com/landing-ai/ade-typescript/commit/630a005741d64d20c8c941aadcaecf4bb8804523))
* **api:** api update ([2fca854](https://github.com/landing-ai/ade-typescript/commit/2fca8547ec7dfae7b63b30446c36a0a27227d9fe))
* **api:** api update ([948acd5](https://github.com/landing-ai/ade-typescript/commit/948acd5bf96b2613b4b6dd4618f2e945f8099782))
* **api:** api update ([3140d4b](https://github.com/landing-ai/ade-typescript/commit/3140d4b01a1bc01cd4dc5b9eb162b2a1fcbc811e))
* **api:** change support email ([c9b1b70](https://github.com/landing-ai/ade-typescript/commit/c9b1b707805a816eb6f2668f4b3fb152620d0060))
* **api:** default models for extract ([1b59c39](https://github.com/landing-ai/ade-typescript/commit/1b59c398a09325a16eb773ad4e198bfe3aac6c4c))
* **api:** manual updates ([0cef356](https://github.com/landing-ai/ade-typescript/commit/0cef3562a150763b0fb933bbdbb43bc071d88290))
* **api:** manual updates ([95671e0](https://github.com/landing-ai/ade-typescript/commit/95671e06564b0dd42a20164081f72b7f0b300d57))
* **api:** manual updates ([cef17cd](https://github.com/landing-ai/ade-typescript/commit/cef17cd66d32921315078c6edd3ea9421a5a207d))
* **api:** manual updates ([52ad24c](https://github.com/landing-ai/ade-typescript/commit/52ad24ceada4a830e0f6adb0442acf44b1e13938))
* **api:** manual updates ([7aab981](https://github.com/landing-ai/ade-typescript/commit/7aab9815868a240bd23b65de398f4aaf63bb1ccc))
* **api:** manual updates ([68081d2](https://github.com/landing-ai/ade-typescript/commit/68081d2a63c4ed0e177717112501fdf39e191af5))
* **api:** manual updates ([d852ba6](https://github.com/landing-ai/ade-typescript/commit/d852ba62b340a60d5e0e28f66af151e4ac3db93c))
* **api:** manual updates ([3053f42](https://github.com/landing-ai/ade-typescript/commit/3053f42809fb80d4ba586c5963907f4d39dbd54a))
* **api:** manual updates ([6f117b4](https://github.com/landing-ai/ade-typescript/commit/6f117b4da47780778056b6498684ac8da27153d7))
* **api:** manual updates ([fca88bc](https://github.com/landing-ai/ade-typescript/commit/fca88bc2fd1ad14d0f247cf91a95d6ceb941cb57))
* **api:** manual updates ([e8cd076](https://github.com/landing-ai/ade-typescript/commit/e8cd076a8c32d39b9dbec6d0e3b7bc479e453f15))
* **api:** manual updates ([f2fcdd6](https://github.com/landing-ai/ade-typescript/commit/f2fcdd643f827706d670172eb1b5ee0e70f43cca))
* **api:** markdown commnet chaagne ([8cfc558](https://github.com/landing-ai/ade-typescript/commit/8cfc558e20764655bb27b7ab8366732a86741bbb))
* **api:** remove so it only contains ade2 endpoints ([880615d](https://github.com/landing-ai/ade-typescript/commit/880615d006370f89806cc16e26d8c6be7d1f2f76))
* **api:** support environments ([08cf6e1](https://github.com/landing-ai/ade-typescript/commit/08cf6e1790c094d682c5ed087a42f05db2f51805))
* **api:** update README examples to support doccument_url as local path ([cc08604](https://github.com/landing-ai/ade-typescript/commit/cc086040ee78541a5a78e751ea0c21558f9e866e))
* **mcp:** add detail field to docs search tool ([d261b6d](https://github.com/landing-ai/ade-typescript/commit/d261b6d7f11586187491bac02fee9dc8d2c9886b))


### Bug Fixes

* **api:** increase default timeout ([25671c2](https://github.com/landing-ai/ade-typescript/commit/25671c2632e3bb858a72bea0221968d21e859a0d))
* **mcp:** return tool execution error on jq failure ([466855e](https://github.com/landing-ai/ade-typescript/commit/466855e0a49154fbd7be9a8225e1dc0cdf0c3e5f))


### Chores

* add zod instructions to readme ([#8](https://github.com/landing-ai/ade-typescript/issues/8)) ([e867f1b](https://github.com/landing-ai/ade-typescript/commit/e867f1b18f45d3fcfd70faff703b5f93f84cf470))
* configure new SDK language ([3aea19d](https://github.com/landing-ai/ade-typescript/commit/3aea19d4cfb4e6bbbbfcba0a30df8bb94e832fdd))
* configure new SDK language ([cdb4c74](https://github.com/landing-ai/ade-typescript/commit/cdb4c741c164bb0932bc2225ea1f5495cda4a16e))
* do not install brew dependencies in ./scripts/bootstrap by default ([0ed8852](https://github.com/landing-ai/ade-typescript/commit/0ed8852337ed3f07d13797f720361e306bda90cb))
* **internal:** codegen related update ([b338bbc](https://github.com/landing-ai/ade-typescript/commit/b338bbca22113bf2c53620f4652762e899809a56))
* **internal:** codegen related update ([db5e76b](https://github.com/landing-ai/ade-typescript/commit/db5e76b367adbd1d77dc4805b2dce3197ad76716))
* **internal:** fix incremental formatting in some cases ([127b35f](https://github.com/landing-ai/ade-typescript/commit/127b35fb503a8fbd91b640e0857b8fa6d9877e46))
* **internal:** ignore .eslintcache ([756c640](https://github.com/landing-ai/ade-typescript/commit/756c640645bf9e047e22aa1dd63ff30c9c5d6fa4))
* **internal:** remove .eslintcache ([52872c7](https://github.com/landing-ai/ade-typescript/commit/52872c716db39b6b0cf6d11ce37fddc19fa90a5c))
* **internal:** use npm pack for build uploads ([f17c703](https://github.com/landing-ai/ade-typescript/commit/f17c70357a03625538122f4368611a11dbefdea0))
* **mcp:** clarify http auth error ([96bf061](https://github.com/landing-ai/ade-typescript/commit/96bf06178de7aa9fb4c462ff03bfc8986989ec6c))
* **mcp:** upgrade jq-web ([54124f5](https://github.com/landing-ai/ade-typescript/commit/54124f50126eb4725df1a6516c841d55dc5cc2e3))
* update SDK settings ([c48da1c](https://github.com/landing-ai/ade-typescript/commit/c48da1c772ccc04f921f26fa283357918538dd7d))
* update SDK settings ([e0d31c6](https://github.com/landing-ai/ade-typescript/commit/e0d31c6df37c89a42f59623385e343ae06ec8506))
* update SDK settings ([7b4887b](https://github.com/landing-ai/ade-typescript/commit/7b4887bc632a817674ce4e94733105b30677b59f))


### Documentation

* **mcp:** add a README link to add server to VS Code or Claude Code ([716f99a](https://github.com/landing-ai/ade-typescript/commit/716f99a4b1bff6acf57c938d49fab4809737860f))

## 0.11.2 (2025-11-13)

Full Changelog: [v0.11.1...v0.11.2](https://github.com/landing-ai/ade-typescript/compare/v0.11.1...v0.11.2)

### Chores

* **mcp:** upgrade jq-web ([54124f5](https://github.com/landing-ai/ade-typescript/commit/54124f50126eb4725df1a6516c841d55dc5cc2e3))

## 0.11.1 (2025-11-13)

Full Changelog: [v0.11.0...v0.11.1](https://github.com/landing-ai/ade-typescript/compare/v0.11.0...v0.11.1)

### Bug Fixes

* **mcp:** return tool execution error on jq failure ([5f2b36b](https://github.com/landing-ai/ade-typescript/commit/5f2b36b3f5f5d20a55c7c80229278837aa95c791))


### Chores

* **mcp:** clarify http auth error ([2ea3927](https://github.com/landing-ai/ade-typescript/commit/2ea3927b896c4152cf7aca067634bbeacc9523c1))

## 0.11.0 (2025-11-10)

Full Changelog: [v0.10.1...v0.11.0](https://github.com/landing-ai/ade-typescript/compare/v0.10.1...v0.11.0)

### Features

* **api:** api update ([146cff3](https://github.com/landing-ai/ade-typescript/commit/146cff3bb2b5fb56b1b2cc64cd99f92d437dfc28))


### Chores

* **internal:** codegen related update ([3044f22](https://github.com/landing-ai/ade-typescript/commit/3044f2297888b0b201629b0e57e29337ceedd0be))


### Documentation

* **mcp:** add a README link to add server to VS Code or Claude Code ([be71608](https://github.com/landing-ai/ade-typescript/commit/be71608aff852c1de32190b8a2d8bd98c5eee938))

## 0.10.1 (2025-11-06)

Full Changelog: [v0.10.0...v0.10.1](https://github.com/landing-ai/ade-typescript/compare/v0.10.0...v0.10.1)

### Chores

* configure new SDK language ([3aea19d](https://github.com/landing-ai/ade-typescript/commit/3aea19d4cfb4e6bbbbfcba0a30df8bb94e832fdd))

## 0.10.0 (2025-10-29)

Full Changelog: [v0.9.0...v0.10.0](https://github.com/landing-ai/ade-typescript/compare/v0.9.0...v0.10.0)

### Features

* **api:** api update ([c8761b0](https://github.com/landing-ai/ade-typescript/commit/c8761b0ca55f092655fdd67956396eb517c99716))

## 0.9.0 (2025-10-28)

Full Changelog: [v0.8.1...v0.9.0](https://github.com/landing-ai/ade-typescript/compare/v0.8.1...v0.9.0)

### Features

* **api:** api update ([7212893](https://github.com/landing-ai/ade-typescript/commit/7212893530f82afe685a8627ef3aab8aebfd7d2b))

## 0.8.1 (2025-10-14)

Full Changelog: [v0.8.0...v0.8.1](https://github.com/landing-ai/ade-typescript/compare/v0.8.0...v0.8.1)

## 0.8.0 (2025-10-10)

Full Changelog: [v0.7.2...v0.8.0](https://github.com/landing-ai/ade-typescript/compare/v0.7.2...v0.8.0)

### Features

* **api:** manual updates ([2b7e460](https://github.com/landing-ai/ade-typescript/commit/2b7e4603700d79e23bed4356acbba1f90fb59d4f))

## 0.7.2 (2025-10-07)

Full Changelog: [v0.7.1...v0.7.2](https://github.com/landing-ai/ade-typescript/compare/v0.7.1...v0.7.2)

### Chores

* **internal:** use npm pack for build uploads ([f17c703](https://github.com/landing-ai/ade-typescript/commit/f17c70357a03625538122f4368611a11dbefdea0))

## 0.7.1 (2025-10-04)

Full Changelog: [v0.7.0...v0.7.1](https://github.com/landing-ai/ade-typescript/compare/v0.7.0...v0.7.1)

### Chores

* **jsdoc:** fix [@link](https://github.com/link) annotations to refer only to parts of the package‘s public interface ([7495cb1](https://github.com/landing-ai/ade-typescript/commit/7495cb189ac8938df8ce685f38e27bd45d7c74e9))

## 0.7.0 (2025-10-03)

Full Changelog: [v0.6.0...v0.7.0](https://github.com/landing-ai/ade-typescript/compare/v0.6.0...v0.7.0)

### Features

* **api:** manual updates ([63780c8](https://github.com/landing-ai/ade-typescript/commit/63780c8befe320ca70932cc5f91c7ec628ef352c))

## 0.6.0 (2025-10-02)

Full Changelog: [v0.5.1...v0.6.0](https://github.com/landing-ai/ade-typescript/compare/v0.5.1...v0.6.0)

### Features

* **api:** markdown commnet chaagne ([726df57](https://github.com/landing-ai/ade-typescript/commit/726df57a5014349cb349c6fef0291959c9767c3a))

## 0.5.1 (2025-10-01)

Full Changelog: [v0.5.0...v0.5.1](https://github.com/landing-ai/ade-typescript/compare/v0.5.0...v0.5.1)

### Bug Fixes

* **api:** increase default timeout ([e0c9abe](https://github.com/landing-ai/ade-typescript/commit/e0c9abe3e08a8f3f3a68c65fea89f34c6a5373ed))


### Chores

* **internal:** remove .eslintcache ([12ebcb7](https://github.com/landing-ai/ade-typescript/commit/12ebcb7f87a0d42e3db1bea02eb3f07c33cfa842))

## 0.5.0 (2025-09-30)

Full Changelog: [v0.4.1...v0.5.0](https://github.com/landing-ai/ade-typescript/compare/v0.4.1...v0.5.0)

### Features

* **api:** add extract endpoint enums ([3b8e1d6](https://github.com/landing-ai/ade-typescript/commit/3b8e1d6cfd15044c7eebeb00e055ffebc284eae8))
* **api:** default models for extract ([5a1b9c9](https://github.com/landing-ai/ade-typescript/commit/5a1b9c99418aec8f12f28a78f2c0e112ae487b33))


### Chores

* **internal:** codegen related update ([f506e76](https://github.com/landing-ai/ade-typescript/commit/f506e76ac5489da443a7edd0f0678701171f4047))
* **internal:** fix incremental formatting in some cases ([3e01a22](https://github.com/landing-ai/ade-typescript/commit/3e01a2298b17634d2c696c733bd2d6ac83ba449c))
* **internal:** ignore .eslintcache ([9b064a9](https://github.com/landing-ai/ade-typescript/commit/9b064a9b00a3079aeb1e6a5771746902427b44d4))

## 0.4.1 (2025-09-26)

Full Changelog: [v0.4.0...v0.4.1](https://github.com/landing-ai/ade-typescript/compare/v0.4.0...v0.4.1)

### Performance Improvements

* faster formatting ([8595d77](https://github.com/landing-ai/ade-typescript/commit/8595d77a9c81ebd70f49bca86a013979965abc7f))


### Chores

* add zod instructions to readme ([#8](https://github.com/landing-ai/ade-typescript/issues/8)) ([e867f1b](https://github.com/landing-ai/ade-typescript/commit/e867f1b18f45d3fcfd70faff703b5f93f84cf470))
* **internal:** remove deprecated `compilerOptions.baseUrl` from tsconfig.json ([74b67c1](https://github.com/landing-ai/ade-typescript/commit/74b67c1606b7fbd2ad8e936c0cb677a068b6bf2e))

## 0.4.0 (2025-09-26)

Full Changelog: [v0.3.1...v0.4.0](https://github.com/landing-ai/ade-typescript/compare/v0.3.1...v0.4.0)

### Features

* **api:** change support email ([51fa0fa](https://github.com/landing-ai/ade-typescript/commit/51fa0fa845cd1e31d5767c0a2d0a16ef22e9d83c))
* **api:** manual updates ([c25545f](https://github.com/landing-ai/ade-typescript/commit/c25545fd871d4b43cb621a73ae8a13b77056d1b4))
* **api:** manual updates ([2e44dae](https://github.com/landing-ai/ade-typescript/commit/2e44dae48cac2304cf2fc7e8b8191d92c1bf9b5d))
* **api:** manual updates ([c7e190f](https://github.com/landing-ai/ade-typescript/commit/c7e190f3644e7d558c4d58b03e5cc6f265195ce0))
* **api:** manual updates ([cefc9f7](https://github.com/landing-ai/ade-typescript/commit/cefc9f7d10326671b6a70bc121f4048432839c48))
* **api:** manual updates ([978e7fc](https://github.com/landing-ai/ade-typescript/commit/978e7fc9411b62f5f724057506938d99d76ed575))
* **api:** manual updates ([4814733](https://github.com/landing-ai/ade-typescript/commit/481473320cd5c8f4098e9203e75e052eaf39574e))
* **api:** manual updates ([b20e2d3](https://github.com/landing-ai/ade-typescript/commit/b20e2d32b26756c3cb6e5c9d873fcb8d550b82be))
* **api:** manual updates ([9acc555](https://github.com/landing-ai/ade-typescript/commit/9acc55508e86711b496dd337d3e08a2757fc70d1))
* **api:** manual updates ([f2fcdd6](https://github.com/landing-ai/ade-typescript/commit/f2fcdd643f827706d670172eb1b5ee0e70f43cca))
* **api:** remove so it only contains ade2 endpoints ([880615d](https://github.com/landing-ai/ade-typescript/commit/880615d006370f89806cc16e26d8c6be7d1f2f76))
* **api:** support environments ([08cf6e1](https://github.com/landing-ai/ade-typescript/commit/08cf6e1790c094d682c5ed087a42f05db2f51805))
* **api:** update README examples to support doccument_url as local path ([406d709](https://github.com/landing-ai/ade-typescript/commit/406d709453b42d12adc347cce542e9c55df15022))


### Chores

* configure new SDK language ([cdb4c74](https://github.com/landing-ai/ade-typescript/commit/cdb4c741c164bb0932bc2225ea1f5495cda4a16e))
* do not install brew dependencies in ./scripts/bootstrap by default ([0ed8852](https://github.com/landing-ai/ade-typescript/commit/0ed8852337ed3f07d13797f720361e306bda90cb))
* update SDK settings ([1e01f40](https://github.com/landing-ai/ade-typescript/commit/1e01f40136037955835a30b5e222a82db2eee395))
* update SDK settings ([e0d31c6](https://github.com/landing-ai/ade-typescript/commit/e0d31c6df37c89a42f59623385e343ae06ec8506))
* update SDK settings ([7b4887b](https://github.com/landing-ai/ade-typescript/commit/7b4887bc632a817674ce4e94733105b30677b59f))

## 0.3.1 (2025-09-22)

Full Changelog: [v0.3.0...v0.3.1](https://github.com/landing-ai/ade-typescript/compare/v0.3.0...v0.3.1)

### Chores

* do not install brew dependencies in ./scripts/bootstrap by default ([0ed8852](https://github.com/landing-ai/ade-typescript/commit/0ed8852337ed3f07d13797f720361e306bda90cb))

## 0.3.0 (2025-09-18)

Full Changelog: [v0.2.0...v0.3.0](https://github.com/landing-ai/ade-typescript/compare/v0.2.0...v0.3.0)

### Features

* **api:** support environments ([5ee3350](https://github.com/landing-ai/ade-typescript/commit/5ee33500ad71b1a449a1f6ca96b26276faaa29ca))

## 0.2.0 (2025-09-18)

Full Changelog: [v0.1.0...v0.2.0](https://github.com/landing-ai/ade-typescript/compare/v0.1.0...v0.2.0)

### Features

* **api:** manual updates ([f2fcdd6](https://github.com/landing-ai/ade-typescript/commit/f2fcdd643f827706d670172eb1b5ee0e70f43cca))

## 0.1.0 (2025-09-18)

Full Changelog: [v0.0.1...v0.1.0](https://github.com/landing-ai/ade-typescript/compare/v0.0.1...v0.1.0)

### Features

* **api:** remove so it only contains ade2 endpoints ([880615d](https://github.com/landing-ai/ade-typescript/commit/880615d006370f89806cc16e26d8c6be7d1f2f76))


### Chores

* configure new SDK language ([cdb4c74](https://github.com/landing-ai/ade-typescript/commit/cdb4c741c164bb0932bc2225ea1f5495cda4a16e))
* update SDK settings ([e0d31c6](https://github.com/landing-ai/ade-typescript/commit/e0d31c6df37c89a42f59623385e343ae06ec8506))
* update SDK settings ([7b4887b](https://github.com/landing-ai/ade-typescript/commit/7b4887bc632a817674ce4e94733105b30677b59f))
