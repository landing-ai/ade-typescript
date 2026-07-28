export interface V2GroundParams {
  /**
   * The `extraction_metadata` object returned by `POST /v2/extract` (or the
   * pipeline's extract step): a tree mirroring your extraction schema whose
   * leaves are `{value, ranges}` objects, where `ranges` are `{start, end}`
   * Unicode code point offsets into the parse markdown.
   */
  extraction_metadata: Record<string, unknown>;

  /**
   * The `structure` tree from the parse response the extraction was produced
   * from. Every block in the tree carries its `grounding` (`{page, range, box}`)
   * inline; block ids in the response resolve against this exact tree.
   */
  structure: Record<string, unknown>;
}

/** Build the JSON body for ground: the two required objects, passed through verbatim. */
export function buildGroundBody(params: V2GroundParams): Record<string, unknown> {
  return {
    extraction_metadata: params.extraction_metadata,
    structure: params.structure,
  };
}
