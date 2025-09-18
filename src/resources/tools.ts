// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as ToolsAPI from './tools';
import { APIPromise } from '../core/api-promise';
import { type Uploadable } from '../core/uploads';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';

export class Tools extends APIResource {
  /**
   * Performs activity recognition on video content to identify and analyze
   * activities.
   *
   * Args: video (UploadFile): The video file to analyze for activity recognition.
   * prompt (str): The prompt to guide activity recognition and describe what
   * activities to look for. specificity (Specificity, _optional_): Detail level in
   * the response (low, medium, high, max). Defaults to MAX for maximum detail.
   * with_audio (bool, _optional_): Whether to process audio as well as video.
   * Defaults to False. modelserver_client: Dependency Injection for HTTP client to
   * communicate with the activity recognition model server.
   *
   * Returns: ActivityRecognitionResponse | JSONResponse Success:
   * ActivityRecognitionResponse containing detected activities and timing
   * information. Error: JSONResponse with error details and 500 status code.
   */
  activityRecognition(
    body: ToolActivityRecognitionParams,
    options?: RequestOptions,
  ): APIPromise<ToolActivityRecognitionResponse> {
    return this._client.post(
      '/v1/tools/activity-recognition',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * Send documents to the Agentic Document Extraction API.
   *
   * The API parses the documents and returns the extracted data as structured
   * Markdown and JSON.
   *
   * You can include an extraction schema to extract key-value pairs from the parsed
   * content.
   *
   * For EU users, use this endpoint:
   *
   *     `https://api.va.eu-west-1.landing.ai/v1/tools/agentic-document-analysis`.
   */
  agenticDocumentAnalysis(
    params: ToolAgenticDocumentAnalysisParams,
    options?: RequestOptions,
  ): APIPromise<ToolAgenticDocumentAnalysisResponse> {
    const { pages, ...body } = params;
    return this._client.post(
      '/v1/tools/agentic-document-analysis',
      multipartFormRequestOptions({ query: { pages }, body, ...options }, this._client),
    );
  }

  /**
   * Performs agentic object detection on images to identify and locate objects based
   * on text prompts.
   *
   * Args: data (FormData): The form data containing the following fields: - prompts
   * (List[str]): List containing exactly one text prompt describing what objects to
   * detect. Must contain between 1 and 1 elements. - image (UploadFile): The image
   * file to analyze for object detection. Required field, cannot be None. - video
   * (UploadFile, _optional_): Video file input (not supported for agentic OD). Will
   * return an error if provided. baseten_inference_sender: Dependency Injection for
   * sending inference requests to the Baseten model server for agentic object
   * detection.
   *
   * Returns: ODResponse | JSONResponse Success: ODResponse containing detected
   * objects with bounding boxes and labels. Error: JSONResponse with error details
   * and appropriate status code.
   */
  agenticObjectDetection(
    params: ToolAgenticObjectDetectionParams,
    options?: RequestOptions,
  ): APIPromise<OdResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/agentic-object-detection',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Extracts barcode information from an image using barcode detection models.
   *
   * Args: params (BarcodeReaderRequest): The input request containing the following
   * fields: - image (UploadFile): The image file containing barcode(s) to be
   * detected and read.
   *
   *     baseten_inference_sender: Dependency Injection for
   *         sending request to the baseten server.
   *
   * Returns: BarcodeReaderResponse | JSONResponse List of detected barcodes with
   * their values and locations, or error response.
   */
  barcodeReader(
    params: ToolBarcodeReaderParams,
    options?: RequestOptions,
  ): APIPromise<ToolBarcodeReaderResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/barcode-reader', { query: { timeout }, body, ...options });
  }

  /**
   * Performs zero-shot image classification to categorize images based on provided
   * labels.
   *
   * Args: data (ClassificationRequest): The form data containing the following
   * fields: - model (ClassificationModel): The classification model to use for
   * analysis. Currently supports SigLIP zero-shot image classification. - image
   * (UploadFile): The image file to classify. Required field for classification
   * analysis. - labels (List[str]): Candidate labels for image classification. Must
   * contain at least one label for classification. baseten_inference_sender:
   * Dependency Injection for sending inference requests to the Baseten model server
   * for image classification.
   *
   * Returns: ClassificationResponse | JSONResponse Success: ClassificationResponse
   * containing classification scores and labels. Error: JSONResponse with error
   * details and appropriate status code.
   */
  classification(
    params: ToolClassificationParams,
    options?: RequestOptions,
  ): APIPromise<ToolClassificationResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/classification',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs object counting and detection using the CountGD model with text prompts
   * and/or visual prompts.
   *
   * Args: params (CountGDRequest): The input data containing the following fields: -
   * image (bytes): The image file to analyze for object counting and detection. -
   * prompt (str, _optional_): Text description of objects to count and detect. Can
   * be used alone or in combination with visual_prompts. - visual_prompts
   * (List[List[float]], _optional_): List of bounding box coordinates for visual
   * prompting. Each inner list contains [x1, y1, x2, y2] coordinates.
   * baseten_inference_sender: Dependency Injection for sending inference requests to
   * the Baseten model server for CountGD processing.
   *
   * Returns: BboxResponse | JSONResponse Success: BboxResponse containing detected
   * objects with bounding boxes and count information. Error: JSONResponse with
   * error details and appropriate status code.
   */
  countgd(params: ToolCountgdParams, options?: RequestOptions): APIPromise<BboxResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/countgd', { query: { timeout }, body, ...options });
  }

  /**
   * Performs object detection using custom trained models deployed on the Landing AI
   * platform.
   *
   * Args: data (FormData): The input request containing the following fields: -
   * deployment_id (UUID): The unique identifier of the deployed custom model. -
   * image (UploadFile): The image file to analyze for object detection. - confidence
   * (float, _optional_): Minimum confidence threshold for detections. If not
   * provided, all detections above the model's default threshold are returned.
   *
   * Returns: ODResponse | JSONResponse List of detected objects with bounding boxes,
   * labels, and confidence scores, or error response.
   */
  customObjectDetection(
    body: ToolCustomObjectDetectionParams,
    options?: RequestOptions,
  ): APIPromise<OdResponse> {
    return this._client.post(
      '/v1/tools/custom-object-detection',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * Performs depth estimation on images using the Depth-Anything-V2 model to
   * generate depth maps.
   *
   * Args: params (DepthAnythingV2Request): The input data containing the following
   * fields: - image (bytes): The image file to analyze for depth estimation. -
   * grayscale (bool, _optional_): Whether to output the depth map in grayscale
   * format. Defaults to False for colored depth maps. baseten_inference_sender:
   * Dependency Injection for sending inference requests to the Baseten model server
   * for Depth-Anything-V2 processing.
   *
   * Returns: DepthAnythingV2Response | JSONResponse Success: DepthAnythingV2Response
   * containing depth map data and metadata. Error: JSONResponse with error details
   * and appropriate status code.
   */
  depthAnythingV2(
    params: ToolDepthAnythingV2Params,
    options?: RequestOptions,
  ): APIPromise<ToolDepthAnythingV2Response> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/depth-anything-v2', { query: { timeout }, body, ...options });
  }

  /**
   * Performs high-precision depth estimation using the Depth-Pro model to generate
   * detailed depth maps with focal length estimation.
   *
   * Args: data (BaseMediaRequest): The form data containing the following fields: -
   * image (UploadFile): The image file to analyze for depth estimation. Required
   * field for depth map generation. - video (UploadFile, _optional_): Video file
   * input (not used for Depth-Pro). baseten_inference_sender: Dependency Injection
   * for sending inference requests to the Baseten model server for Depth-Pro
   * processing.
   *
   * Returns: DepthProResponse | JSONResponse Success: DepthProResponse containing
   * depth map data and processing metadata. Error: JSONResponse with error details
   * and appropriate status code.
   */
  depthPro(params: ToolDepthProParams, options?: RequestOptions): APIPromise<ToolDepthProResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/depth-pro',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs document layout analysis using the Docling model to detect and analyze
   * document structure elements.
   *
   * Args: data (DocumentNumberChunksRequest): The form data containing the following
   * fields: - images (List[bytes]): List of image files as byte arrays to analyze
   * for layout detection. Each image represents a page or document section.
   * baseten_inference_sender: Dependency Injection for sending inference requests to
   * the Baseten model server for Docling layout analysis. modelserver_client:
   * Dependency Injection for HTTP client to communicate with the Docling model
   * server as an alternative to Baseten.
   *
   * Returns: DoclingResponse | JSONResponse Success: DoclingResponse containing
   * detected layout elements and structure information. Error: JSONResponse with
   * error details and appropriate status code.
   */
  docling(params: ToolDoclingParams, options?: RequestOptions): APIPromise<ToolDoclingResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/docling',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs comprehensive document analysis to extract and parse text, tables, and
   * figures from images or PDFs.
   *
   * Args: data (DocAnalysisRequest): The form data containing the following
   * fields: - image (UploadFile, _optional_): Image file to analyze (max 50MB).
   * Cannot be provided together with PDF. - pdf (UploadFile, _optional_): PDF file
   * to analyze (max 50MB, max 2 pages). Cannot be provided together with image. -
   * parse_text (bool, _optional_): Whether to parse and analyze text content.
   * Defaults to True. - parse_tables (bool, _optional_): Whether to parse and
   * analyze table structures. Defaults to True. - parse_figures (bool, _optional_):
   * Whether to parse and analyze figures and images. Defaults to True. -
   * summary_verbosity (Verbosity, _optional_): Level of detail in AI-generated
   * summaries. Options: none, brief, normal, detailed. Defaults to normal. -
   * return_chunk_crops (bool, _optional_): Whether to return cropped images of each
   * chunk. Defaults to False. - return_page_crops (bool, _optional_): Whether to
   * return cropped images of each page. Defaults to False. - caption_format
   * (OutputFormat, _optional_): Format for chunk captions. Options: markdown, json,
   * xml, text. Defaults to json. - response_format (OutputFormat, _optional_):
   * Format for the overall response. Options: markdown, json, xml, text. Defaults to
   * json. - filename (str, _optional_): Optional filename for integration into API
   * output. baseten_inference_sender: Dependency Injection for sending inference
   * requests to the Baseten model server for document analysis.
   *
   * Returns: DocAnalysisResponse | JSONResponse Success: DocAnalysisResponse
   * containing parsed document structure and content. Error: JSONResponse with error
   * details and appropriate status code.
   */
  documentAnalysis(
    params: ToolDocumentAnalysisParams,
    options?: RequestOptions,
  ): APIPromise<ToolDocumentAnalysisResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/document-analysis',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Generates text embeddings using the specified embedding model.
   *
   * Args: data (EmbeddingsRequest): The input request containing the following
   * fields: - model (EmbeddingsModel): The embedding model to use for text
   * vectorization. Currently supports Stella 1.5B model. - input (List[str]): The
   * list of text prompts to generate embeddings for.
   *
   *     baseten_inference_sender: Dependency Injection for
   *         sending request to the baseten server.
   *
   * Returns: EmbeddingsResponse | JSONResponse List of numerical embeddings
   * corresponding to the input texts, or error response.
   */
  embeddings(params: ToolEmbeddingsParams, options?: RequestOptions): APIPromise<ToolEmbeddingsResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/embeddings', {
      query: { timeout },
      body,
      ...options,
      headers: buildHeaders([{ 'Content-Type': 'application/x-www-form-urlencoded' }, options?.headers]),
    });
  }

  /**
   * Performs various computer vision tasks using the Florence V2 model.
   *
   * Args: params (FlorenceV2Request): The input request containing the following
   * fields: - image (UploadFile, _optional_): Single image file for processing. -
   * images (List[UploadFile], _optional_): Multiple image files for batch
   * processing. - video_bytes (bytes, _optional_): Video data for video analysis
   * tasks. - task (str): The specific task to perform (e.g., "CAPTION", "OD",
   * "OCR"). - prompt (str, _optional_): Text prompt for task-specific guidance.
   *
   *     baseten_inference_sender: Dependency Injection for
   *         sending request to the baseten server.
   *
   * Returns: FlorenceV2Response | JSONResponse Task-specific results including
   * captions, object detections, or OCR text, or error response.
   */
  florence2(params: ToolFlorence2Params, options?: RequestOptions): APIPromise<ToolFlorence2Response> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/florence2', { query: { timeout }, body, ...options });
  }

  /**
   * Performs visual question answering using the Florence2 model to answer questions
   * about image content.
   *
   * Args: params (FlorenceQARequest): The input data containing the following
   * fields: - image (bytes): The image file to analyze for visual question
   * answering. - question (str): The question to ask about the image content. The
   * model will analyze the image and provide an answer. baseten_inference_sender:
   * Dependency Injection for sending inference requests to the Baseten model server
   * for Florence2 QA processing.
   *
   * Returns: FlorenceV2QAResponse | JSONResponse Success: FlorenceV2QAResponse
   * containing the answer to the visual question. Error: JSONResponse with error
   * details and appropriate status code.
   */
  florence2Qa(params: ToolFlorence2QaParams, options?: RequestOptions): APIPromise<ToolFlorence2QaResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/florence2-qa', { query: { timeout }, body, ...options });
  }

  /**
   * Performs object detection and segmentation using Florence2 and SAM2 models for
   * precise instance segmentation.
   *
   * Args: data (FormData): The form data containing the following fields: - prompts
   * (List[str]): List of text prompts describing objects to detect and segment. -
   * image (UploadFile, _optional_): Image file to analyze for object detection and
   * segmentation. - video (UploadFile, _optional_): Video file to analyze for
   * temporal object segmentation. - chunk_length (int, _optional_): Length of video
   * chunks for processing. Used for video segmentation tasks. - iou_threshold
   * (float, _optional_): IoU threshold for filtering detections. Range: 0.1-1.0,
   * defaults to 0.6. - nms_threshold (float, _optional_): Non-maximum suppression
   * threshold. Range: 0.1-1.0, defaults to 1.0. baseten_inference_sender: Dependency
   * Injection for sending inference requests to the Baseten model server for
   * Florence2+SAM2 processing.
   *
   * Returns: Florence2SAM2Response | JSONResponse Success: Florence2SAM2Response
   * containing detected objects with segmentation masks. Error: JSONResponse with
   * error details and appropriate status code.
   */
  florence2Sam2(
    params: ToolFlorence2Sam2Params,
    options?: RequestOptions,
  ): APIPromise<ToolFlorence2Sam2Response> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/florence2-sam2',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs AI-powered image generation, inpainting, or image-to-image
   * transformation using the Flux1 diffusion model.
   *
   * Args: data (Flux1Request): The form data containing the following fields: - task
   * (Flux1Task, _optional_): The task to perform - image_generation,
   * mask_inpainting, or image_to_image. Defaults to image_generation. - prompt
   * (str): Text description of the desired image or modifications. Maximum 512
   * characters. - image (UploadFile, _optional_): Original image for inpainting or
   * image-to-image tasks. Required for mask_inpainting and image_to_image tasks. -
   * mask_image (UploadFile, _optional_): Mask image indicating areas to inpaint.
   * Required for mask_inpainting task, must match image dimensions. - height (int,
   * _optional_): Height in pixels of generated image, must be multiple of 8.
   * Defaults to 512. - width (int, _optional_): Width in pixels of generated image,
   * must be multiple of 8. Defaults to 512. - strength (float, _optional_):
   * Transformation strength for image-to-image tasks. Range: 0.0-1.0, defaults to
   * 0.6. - num_inference_steps (int, _optional_): Number of denoising steps.
   * Defaults to 10. - guidance_scale (float, _optional_): Classifier-free guidance
   * scale. Higher values improve prompt adherence. Defaults to 3.5. -
   * num_images_per_prompt (int, _optional_): Number of images to generate per
   * prompt. Defaults to 1. - max_sequence_length (int, _optional_): Maximum prompt
   * sequence length. Range: 0-512, defaults to 512. - seed (int, _optional_): Random
   * seed for reproducible generation. baseten_inference_sender: Dependency Injection
   * for sending inference requests to the Baseten model server for Flux1 processing.
   *
   * Returns: Flux1Response | JSONResponse Success: Flux1Response containing
   * generated images in base64 format. Error: JSONResponse with error details and
   * appropriate status code.
   */
  flux1(params: ToolFlux1Params, options?: RequestOptions): APIPromise<ToolFlux1Response> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/flux1',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs text-to-instance segmentation using the GLEE model to detect and
   * segment objects based on text prompts.
   *
   * Args: data (FormData): The form data containing the following fields: - prompts
   * (List[str]): List of text prompts describing objects to detect and segment. Must
   * contain at least one prompt. - image (UploadFile): The image file to analyze for
   * instance segmentation. Required field for segmentation analysis. - video
   * (UploadFile, _optional_): Video file input (not used for GLEE). - nms_threshold
   * (float, _optional_): Non-maximum suppression threshold for filtering overlapping
   * detections. Helps reduce duplicate detections. - confidence (float, _optional_):
   * Confidence threshold for object detection. Objects with lower confidence scores
   * will be filtered out. baseten_inference_sender: Dependency Injection for sending
   * inference requests to the Baseten model server for GLEE processing.
   *
   * Returns: TextToInstanceSegmentationResponse | JSONResponse Success:
   * TextToInstanceSegmentationResponse containing detected instances with
   * segmentation masks. Error: JSONResponse with error details and appropriate
   * status code.
   */
  glee(params: ToolGleeParams, options?: RequestOptions): APIPromise<TextToInstanceSegmentation> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/glee',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs image-to-text conversion to generate textual descriptions or answers
   * from visual content.
   *
   * Args: data (FormData): The form data containing the following fields: - prompt
   * (str): Text prompt to guide the image analysis and response generation. - model
   * (ImageToText): The AI model to use for analysis. Options: qwen2vl,
   * internlm-xcomposer, qwen25vl. - image (UploadFile, _optional_): Single image
   * file to analyze. Cannot be used with images field for some models. - images
   * (List[UploadFile], _optional_): Multiple image files to analyze. Not supported
   * by internlm-xcomposer model. - video (UploadFile, _optional_): Video file to
   * analyze for temporal understanding. baseten_inference_sender: Dependency
   * Injection for sending inference requests to the Baseten model server for
   * image-to-text processing.
   *
   * Returns: ImageToTextResponse | JSONResponse Success: ImageToTextResponse
   * containing generated text description or answer. Error: JSONResponse with error
   * details and appropriate status code.
   */
  imageToText(params: ToolImageToTextParams, options?: RequestOptions): APIPromise<ToolImageToTextResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/image-to-text',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs multimodal analysis using the InternLM-XComposer2 model to generate
   * text responses from images or videos.
   *
   * Args: prompt (str): Text prompt to guide the analysis and response generation.
   * image (UploadFile, _optional_): Image file to analyze. Cannot be provided
   * together with video. video (UploadFile, _optional_): Video file to analyze.
   * Cannot be provided together with image. baseten_inference_sender: Dependency
   * Injection for sending inference requests to the Baseten model server for
   * InternLM-XComposer2 processing.
   *
   * Returns: InternLMXComposer2Response | JSONResponse Success:
   * InternLMXComposer2Response containing generated text response. Error:
   * JSONResponse with error details and appropriate status code.
   */
  internlmXcomposer2(
    params: ToolInternlmXcomposer2Params,
    options?: RequestOptions,
  ): APIPromise<ToolInternlmXcomposer2Response> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/internlm-xcomposer2',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs automated license plate recognition on video content to detect and read
   * license plates and vehicle information.
   *
   * Args: video (UploadFile): The video file to analyze for license plate detection.
   * Required field containing video data for processing. modelserver_client:
   * Dependency Injection for HTTP client to communicate with the license plate
   * recognition model server.
   *
   * Returns: LicensePlateResponse | JSONResponse Success: LicensePlateResponse
   * containing detected license plates with vehicle details and timestamps. Error:
   * JSONResponse with error details and appropriate status code.
   */
  licensePlate(body: ToolLicensePlateParams, options?: RequestOptions): APIPromise<ToolLicensePlateResponse> {
    return this._client.post(
      '/v1/tools/license-plate',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * Performs localized content analysis using the LOCA model to analyze specific
   * regions or the entire image.
   *
   * Args: params (LocaRequest): The input data containing the following fields: -
   * image (bytes): The image file to analyze for localized content analysis. - bbox
   * (BoundingBox, _optional_): Bounding box coordinates to focus analysis on a
   * specific region. If not provided, analyzes the entire image.
   * baseten_inference_sender: Dependency Injection for sending inference requests to
   * the Baseten model server for LOCA processing.
   *
   * Returns: LocaResponse | JSONResponse Success: LocaResponse containing localized
   * analysis results. Error: JSONResponse with error details and appropriate status
   * code.
   */
  loca(params: ToolLocaParams, options?: RequestOptions): APIPromise<ToolLocaResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/loca', { query: { timeout }, body, ...options });
  }

  /**
   * Endpoint to convert markdown to JSON schema.
   */
  markdownSchemaSuggestion(
    body: ToolMarkdownSchemaSuggestionParams,
    options?: RequestOptions,
  ): APIPromise<ToolMarkdownSchemaSuggestionResponse> {
    return this._client.post('/v1/tools/markdown-schema-suggestion', { body, ...options });
  }

  /**
   * Performs NSFW (Not Safe For Work) content classification to detect inappropriate
   * content in images.
   *
   * Args: params (NSFWRequest): The input data containing the following fields: -
   * image (bytes): The image file to analyze for NSFW content classification.
   * baseten_inference_sender: Dependency Injection for sending inference requests to
   * the Baseten model server for NSFW classification.
   *
   * Returns: NSFWResponse | JSONResponse Success: NSFWResponse containing
   * classification scores for different content categories. Error: JSONResponse with
   * error details and appropriate status code.
   */
  nsfwClassification(
    params: ToolNsfwClassificationParams,
    options?: RequestOptions,
  ): APIPromise<ToolNsfwClassificationResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/nsfw-classification', { query: { timeout }, body, ...options });
  }

  /**
   * Performs object detection using the OWL-ViT v2 model with text prompts.
   *
   * Args: params (Owlv2Request): The input request containing the following
   * fields: - image (UploadFile): The image file to analyze for object detection. -
   * prompts (List[str]): Text descriptions of objects to detect in the image. -
   * confidence (float, _optional_): Minimum confidence threshold for detections.
   * Defaults to 0.2, must be between 0 and 1.
   *
   *     baseten_inference_sender: Dependency Injection for
   *         sending request to the baseten server.
   *
   * Returns: BboxResponse | JSONResponse List of detected objects with bounding
   * boxes, labels, and confidence scores, or error response.
   */
  owlv2(params: ToolOwlv2Params, options?: RequestOptions): APIPromise<BboxResponse | null> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/owlv2', { query: { timeout }, body, ...options });
  }

  /**
   * Performs optical character recognition using PaddleOCR to extract text from
   * images.
   *
   * Args: data (BaseMediaRequest): The form data containing the following fields: -
   * image (UploadFile): The image file to analyze for text extraction. Required
   * field for OCR processing. - video (UploadFile, _optional_): Video file input
   * (not used for OCR). baseten_inference_sender: Dependency Injection for sending
   * inference requests to the Baseten model server for PaddleOCR processing.
   *
   * Returns: PaddleOcrResponse | JSONResponse Success: PaddleOcrResponse containing
   * extracted text with bounding boxes and confidence scores. Error: JSONResponse
   * with error details and appropriate status code.
   */
  paddleOcr(params: ToolPaddleOcrParams, options?: RequestOptions): APIPromise<ToolPaddleOcrResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/paddle-ocr',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs human pose detection to identify and locate body keypoints and skeletal
   * structure in images.
   *
   * Args: params (PoseDetectionRequest): The input data containing the following
   * fields: - image (bytes): The image file to analyze for pose detection.
   * baseten_inference_sender: Dependency Injection for sending inference requests to
   * the Baseten model server for pose detection processing.
   *
   * Returns: PoseDetectionResponse | JSONResponse Success: PoseDetectionResponse
   * containing detected poses with keypoint coordinates. Error: JSONResponse with
   * error details and appropriate status code.
   */
  poseDetector(
    params: ToolPoseDetectorParams,
    options?: RequestOptions,
  ): APIPromise<ToolPoseDetectorResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/pose-detector', { query: { timeout }, body, ...options });
  }

  /**
   * Performs QR code detection and reading to extract encoded information from
   * images.
   *
   * Args: params (QRReaderRequest): The input data containing the following
   * fields: - image (bytes): The image file to analyze for QR code detection and
   * reading. baseten_inference_sender: Dependency Injection for sending inference
   * requests to the Baseten model server for QR code processing.
   *
   * Returns: QRReaderResponse | JSONResponse Success: QRReaderResponse containing
   * detected QR codes with decoded text and locations. Error: JSONResponse with
   * error details and appropriate status code.
   */
  qrReader(params: ToolQrReaderParams, options?: RequestOptions): APIPromise<ToolQrReaderResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/qr-reader', { query: { timeout }, body, ...options });
  }

  /**
   * Performs object segmentation on images or videos using the SAM2 model based on
   * provided bounding box prompts.
   *
   * Args: data (SAM2Request): The form data containing the following fields: -
   * images (List[UploadFile], _optional_): List of image files to process for
   * segmentation. Cannot be provided together with video. - video (UploadFile,
   * _optional_): Video file to process for temporal segmentation. Cannot be provided
   * together with images. - bboxes (JSON): Bounding boxes and labels for
   * segmentation guidance. Structure: {"bboxes": [ {"labels": ["label1", ...],
   * "bboxes": [[x1,y1,x2,y2], ...]} ]} Labels and bboxes arrays must have matching
   * lengths. - chunk_length_frames (int, _optional_): Number of frames per chunk for
   * video processing. Used to optimize memory usage for long videos.
   * baseten_inference_sender: Dependency Injection for sending inference requests to
   * the Baseten model server for SAM2 processing. modelserver_client: Dependency
   * Injection for HTTP client to communicate with the SAM2 model server as an
   * alternative to Baseten.
   *
   * Returns: TextToInstanceSegmentationResponse | JSONResponse Success:
   * TextToInstanceSegmentationResponse containing segmentation masks for detected
   * objects. Error: JSONResponse with error details and appropriate status code.
   */
  sam2(params: ToolSam2Params, options?: RequestOptions): APIPromise<TextToInstanceSegmentation> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/sam2',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs text-to-instance segmentation to detect and segment objects based on
   * text descriptions.
   *
   * Args: data (FormData): The form data containing the following fields: - prompt
   * (str): Text description of objects to detect and segment. - model
   * (TextToSegModel): The segmentation model to use. Currently supports
   * florence2sam2. - image (UploadFile, _optional_): Image file to analyze for
   * segmentation. - video (UploadFile, _optional_): Video file to analyze for
   * temporal segmentation. - chunk_length_frames (float, _optional_): Number of
   * frames per chunk for video processing. - iou_threshold (float, _optional_): IoU
   * threshold for filtering detections. Range: 0.1-1.0. - nms_threshold (float,
   * _optional_): Non-maximum suppression threshold. Range: 0.1-1.0. - job_id (UUID,
   * _optional_): Unique identifier for tracking the job. baseten_inference_sender:
   * Dependency Injection for sending inference requests to the Baseten model server
   * for text-to-segmentation processing.
   *
   * Returns: TextToInstanceSegmentationResponse | JSONResponse Success:
   * TextToInstanceSegmentationResponse containing segmented instances with masks.
   * Error: JSONResponse with error details and appropriate status code.
   */
  textToInstanceSegmentation(
    params: ToolTextToInstanceSegmentationParams,
    options?: RequestOptions,
  ): APIPromise<TextToInstanceSegmentation> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/text-to-instance-segmentation',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs text-to-object detection on images or videos with access to various
   * detection models
   *
   * Args: data (FormData): The input data containing the following keys: - prompts
   * (List[str]): List of text prompts describing objects to detect. Must contain at
   * least one prompt. For Florence2, total prompt length cannot exceed 800
   * characters. For agentic, only one prompt is allowed. - model (TextToODModel):
   * The detection model to use: "owlv2", "countgd", "florence2", "agentic", "glee",
   * or "florencev2" (deprecated). - image (UploadFile, _optional_): The image file
   * to analyze for object detection. - video (UploadFile, _optional_): The video
   * file to analyze for object detection. Note: Not all models support video
   * input. - nms_threshold (float, _optional_): Non-maximum suppression threshold
   * for filtering overlapping detections. - confidence (float, _optional_):
   * Confidence threshold for object detection. Not supported by all models. - job_id
   * (UUID, _optional_): Unique identifier for tracking the job. Not supported by all
   * models.
   *
   *     baseten_inference_sender: Dependency Injection for
   *         sending request to the baseten server.
   *
   * Returns: ODResponse | JSONResponse: Detection results containing bounding boxes,
   * labels, and confidence scores for detected objects, or error response.
   */
  textToObjectDetection(
    params: ToolTextToObjectDetectionParams,
    options?: RequestOptions,
  ): APIPromise<OdResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/text-to-object-detection',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs temporal localization on videos to identify specific events or content
   * at particular time intervals.
   *
   * Args: data (FormData): The form data containing the following fields: - prompt
   * (str): Text prompt describing the content or event to locate in the video. -
   * model (TemporalLocalizationTools): The AI model to use for temporal
   * localization. Options: internlm-xcomposer2, gpt4o, qwen2vl, qwen25vl. - video
   * (UploadFile): The video file to analyze for temporal content localization. -
   * chunk_length (float, _optional_): Length of each processing chunk in seconds. -
   * chunk_length_seconds (float, _optional_): Alternative specification for chunk
   * length in seconds. - chunk_length_frames (int, _optional_): Length of each
   * processing chunk in frame count. baseten_inference_sender: Dependency Injection
   * for sending inference requests to the Baseten model server for video temporal
   * localization.
   *
   * Returns: VideoTemporalLocalizationResponse | JSONResponse Success:
   * VideoTemporalLocalizationResponse containing temporal localization results with
   * timestamps. Error: JSONResponse with error details and appropriate status code.
   */
  videoTemporalLocalization(
    params: ToolVideoTemporalLocalizationParams,
    options?: RequestOptions,
  ): APIPromise<ToolVideoTemporalLocalizationResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/video-temporal-localization',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs object detection using visual prompts (bounding box coordinates)
   * instead of text prompts.
   *
   * Args: visual_prompts (str): JSON string containing visual prompt coordinates.
   * Format: List of bounding box coordinates as [[x1, y1, x2, y2], ...]. model
   * (VisualPromptsToODModel): The detection model to use for visual prompt-based
   * detection. Currently supports CountGD. image (UploadFile, _optional_): Image
   * file to analyze for object detection. Cannot be provided together with video.
   * video (UploadFile, _optional_): Video file to analyze for object detection.
   * Cannot be provided together with image. baseten_inference_sender: Dependency
   * Injection for sending inference requests to the Baseten model server for visual
   * prompt-based detection.
   *
   * Returns: ODResponse | JSONResponse Success: ODResponse containing detected
   * objects guided by visual prompts. Error: JSONResponse with error details and
   * appropriate status code.
   */
  visualPromptsToObjectDetection(
    params: ToolVisualPromptsToObjectDetectionParams,
    options?: RequestOptions,
  ): APIPromise<OdResponse> {
    const { timeout, ...body } = params;
    return this._client.post(
      '/v1/tools/visual-prompts-to-object-detection',
      multipartFormRequestOptions({ query: { timeout }, body, ...options }, this._client),
    );
  }

  /**
   * Performs whole slide image (WSI) embedding generation for pathology image
   * analysis and feature extraction.
   *
   * Args: params (WSIEmbeddingRequest): The input data containing the following
   * fields: - image (bytes): Base64-encoded patch image from a whole slide image. -
   * mpp (float): Microns per pixel resolution of the image patch. Required for
   * proper scaling and analysis. baseten_inference_sender: Dependency Injection for
   * sending inference requests to the Baseten model server for WSI embedding
   * generation.
   *
   * Returns: WSIEmbeddingResponse | JSONResponse Success: WSIEmbeddingResponse
   * containing generated embeddings for the WSI patch. Error: JSONResponse with
   * error details and appropriate status code.
   */
  wsiEmbedding(
    params: ToolWsiEmbeddingParams,
    options?: RequestOptions,
  ): APIPromise<ToolWsiEmbeddingResponse> {
    const { timeout, ...body } = params;
    return this._client.post('/v1/tools/wsi-embedding', { query: { timeout }, body, ...options });
  }
}

export interface BaseMediaRequest {
  image?: Uploadable | null;

  video?: Uploadable | null;
}

export interface BboxResponse {
  data: Array<BboxResponse.Data> | null;
}

export namespace BboxResponse {
  export interface Data {
    bbox: Array<number>;

    label: string;

    score: number;
  }
}

export interface OdResponse {
  data: Array<Array<OdResponse.Data>> | null;
}

export namespace OdResponse {
  export interface Data {
    bounding_box: Array<number>;

    label: string;

    score: number;
  }
}

export type OutputFormat = 'markdown' | 'json' | 'xml' | 'text';

export interface SegmentationBitMaskRle {
  counts: Array<number>;

  size: Array<number>;
}

export interface TextToInstanceSegmentation {
  data: Array<
    Array<
      | TextToInstanceSegmentation.Florence2Sam2IDInstance
      | TextToInstanceSegmentation.InstanceSegmentationResponseData
    >
  > | null;
}

export namespace TextToInstanceSegmentation {
  export interface Florence2Sam2IDInstance {
    id: number;

    bounding_box: Array<number>;

    label: string;

    mask: ToolsAPI.SegmentationBitMaskRle;
  }

  export interface InstanceSegmentationResponseData {
    bounding_box: Array<number>;

    label: string;

    mask: ToolsAPI.SegmentationBitMaskRle;

    score: number;
  }
}

export interface ToolActivityRecognitionResponse {
  data: ToolActivityRecognitionResponse.Data | null;
}

export namespace ToolActivityRecognitionResponse {
  export interface Data {
    events?: Array<Data.Event>;

    model_time?: number;

    processing_time?: number;
  }

  export namespace Data {
    export interface Event {
      description?: string;

      end_time?: number;

      label?: number;

      location?: string;

      start_time?: number;
    }
  }
}

export interface ToolAgenticDocumentAnalysisResponse {
  data: ToolAgenticDocumentAnalysisResponse.Data;

  errors?: Array<ToolAgenticDocumentAnalysisResponse.Error>;

  extraction_error?: string | null;

  metadata?: unknown | null;
}

export namespace ToolAgenticDocumentAnalysisResponse {
  export interface Data {
    chunks: Array<Data.Chunk>;

    markdown: string | Array<string>;

    extracted_schema?: unknown | null;

    extraction_metadata?: unknown | null;
  }

  export namespace Data {
    export interface Chunk {
      chunk_id: string;

      chunk_type:
        | 'form'
        | 'table'
        | 'figure'
        | 'text'
        | 'marginalia'
        | 'title'
        | 'page_header'
        | 'page_footer'
        | 'page_number'
        | 'key_value';

      text: string;

      grounding?: Array<Chunk.Grounding> | null;

      rotation_angle?: number;
    }

    export namespace Chunk {
      export interface Grounding {
        box: Grounding.Box;

        page: number;
      }

      export namespace Grounding {
        export interface Box {
          b: number;

          l: number;

          r: number;

          t: number;
        }
      }
    }
  }

  export interface Error {
    error: string;

    error_code: number;

    page_num: number;
  }
}

export interface ToolBarcodeReaderResponse {
  data: Array<ToolBarcodeReaderResponse.Data> | null;
}

export namespace ToolBarcodeReaderResponse {
  export interface Data {
    format: string;

    text: string;

    x: number;

    y: number;
  }
}

export interface ToolClassificationResponse {
  data: ToolClassificationResponse.Data | null;
}

export namespace ToolClassificationResponse {
  export interface Data {
    labels: Array<string>;

    scores: Array<number>;
  }
}

export interface ToolDepthAnythingV2Response {
  data: ToolDepthAnythingV2Response.Data | null;
}

export namespace ToolDepthAnythingV2Response {
  export interface Data {
    map: Array<Array<number>>;
  }
}

export interface ToolDepthProResponse {
  data: unknown | null;
}

export interface ToolDoclingResponse {
  data: Array<ToolDoclingResponse.Data> | null;
}

export namespace ToolDoclingResponse {
  export interface Data {
    b: number;

    confidence: number;

    l: number;

    label:
      | 'background'
      | 'Caption'
      | 'Footnote'
      | 'Formula'
      | 'List-item'
      | 'Page-footer'
      | 'Page-header'
      | 'Picture'
      | 'Section-header'
      | 'Table'
      | 'Text'
      | 'Title'
      | 'Document Index'
      | 'Code'
      | 'Checkbox-Selected'
      | 'Checkbox-Unselected'
      | 'Form'
      | 'Key-Value Region';

    r: number;

    t: number;
  }
}

export interface ToolDocumentAnalysisResponse {
  data: unknown | null;
}

export interface ToolEmbeddingsResponse {
  data: Array<ToolEmbeddingsResponse.Data> | null;
}

export namespace ToolEmbeddingsResponse {
  export interface Data {
    embedding: Array<number>;
  }
}

export interface ToolFlorence2Response {
  data: unknown;
}

export interface ToolFlorence2QaResponse {
  data: string | null;
}

export interface ToolFlorence2Sam2Response {
  data: { [key: string]: { [key: string]: ToolFlorence2Sam2Response.Florence2SAM2Instance } } | null;
}

export namespace ToolFlorence2Sam2Response {
  export interface Florence2SAM2Instance {
    label: string;

    mask: ToolsAPI.SegmentationBitMaskRle;

    bounding_box?: Array<number> | null;
  }
}

export interface ToolFlux1Response {
  data: Array<string> | null;
}

export interface ToolImageToTextResponse {
  data: string | null;
}

export interface ToolInternlmXcomposer2Response {
  data: ToolInternlmXcomposer2Response.Data | null;
}

export namespace ToolInternlmXcomposer2Response {
  export interface Data {
    answer: string;
  }
}

export interface ToolLicensePlateResponse {
  data: Array<ToolLicensePlateResponse.Data> | null;
}

export namespace ToolLicensePlateResponse {
  export interface Data {
    plate: string;

    color?: string;

    make?: string;

    start_time?: number | string;

    timestamp?: string;

    vehicle_type?: string;
  }
}

export interface ToolLocaResponse {
  data: ToolLocaResponse.Data | null;
}

export namespace ToolLocaResponse {
  export interface Data {
    count: number;

    heat_map: unknown;
  }
}

export interface ToolMarkdownSchemaSuggestionResponse {
  data: ToolMarkdownSchemaSuggestionResponse.Data;
}

export namespace ToolMarkdownSchemaSuggestionResponse {
  export interface Data {
    json_schema?: unknown | null;
  }
}

export interface ToolNsfwClassificationResponse {
  data: ToolNsfwClassificationResponse.Data | null;
}

export namespace ToolNsfwClassificationResponse {
  export interface Data {
    label: string;

    score: number;
  }
}

export interface ToolPaddleOcrResponse {
  data: Array<unknown> | null;
}

export interface ToolPoseDetectorResponse {
  data: unknown;
}

export interface ToolQrReaderResponse {
  data: Array<ToolQrReaderResponse.Data> | null;
}

export namespace ToolQrReaderResponse {
  export interface Data {
    text: string;

    x: number;

    y: number;
  }
}

export interface ToolVideoTemporalLocalizationResponse {
  data: Array<number> | null;
}

export interface ToolWsiEmbeddingResponse {
  data: ToolWsiEmbeddingResponse.Data | null;
}

export namespace ToolWsiEmbeddingResponse {
  export interface Data {
    embedding: Array<number>;
  }
}

export interface ToolActivityRecognitionParams {
  prompt: string;

  video: Uploadable;

  specificity?: 'low' | 'medium' | 'high' | 'max';

  with_audio?: boolean;
}

export interface ToolAgenticDocumentAnalysisParams {
  /**
   * Query param: Which pages to process, separated by commas and starting from 0.
   * For example, to process the first 3 pages, use '0,1,2'.
   */
  pages?: string | null;

  /**
   * Body param: Enable automatic rotation detection and correction for document
   * pages. When enabled, the system will detect if pages are rotated and
   * automatically correct text and table chunks for better extraction accuracy.
   */
  enable_rotation_detection?: boolean | null;

  /**
   * Body param: Enable automatic skew detection and correction for document pages.
   * When enabled, the system will detect if pages are skewed and automatically
   * correct text and table chunks for better extraction accuracy.
   */
  enable_skew_detection?: boolean;

  /**
   * Body param: JSON schema for field extraction from the document. This schema
   * extracts structured data from the document. If provided, the response includes
   * an `extracted_schema` object with the extracted data and an
   * `extraction_metadata` object with the visual grounding metadata. The schema must
   * be a valid JSON object and will be validated before processing the document.
   */
  fields_schema?: string | null;

  /**
   * Body param: Custom prompt for image captioning.
   */
  figure_captioning_prompt?: string | null;

  /**
   * Body param: How to caption images (verbose, transcribe, or custom).
   */
  figure_captioning_type?: 'verbose' | 'transcribe' | 'custom';

  /**
   * Body param: An image representing the document to analyse (50MB max). The image
   * must be a valid image file (PNG, JPEG, etc.). Either this parameter or `pdf`
   * parameter must be provided.
   */
  image?: Uploadable | null;

  /**
   * Body param: Whether to include marginalia (headers, footers, notes in margins,
   * etc.) in the response.
   */
  include_marginalia?: boolean;

  /**
   * Body param: Whether to include metadata in the Markdown output.
   */
  include_metadata_in_markdown?: boolean;

  /**
   * Body param: A PDF file to be analyzed (50 pages max). Either this parameter or
   * the `image` parameter must be provided.
   */
  pdf?: Uploadable | null;

  /**
   * Body param: How to return markdown content: 'full' returns the complete document
   * markdown as a single string, 'page' returns a list of strings with markdown for
   * each page.
   */
  split?: 'full' | 'page';
}

export interface ToolAgenticObjectDetectionParams {
  /**
   * Body param:
   */
  prompts: Array<string>;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolBarcodeReaderParams {
  /**
   * Body param:
   */
  image: string;

  /**
   * Query param:
   */
  timeout?: number | null;
}

export interface ToolClassificationParams {
  /**
   * Body param:
   */
  image: Uploadable;

  /**
   * Body param:
   */
  labels: Array<string>;

  /**
   * Body param:
   */
  model: 'siglip';

  /**
   * Query param:
   */
  timeout?: number | null;
}

export interface ToolCountgdParams {
  /**
   * Body param:
   */
  image: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  prompt?: string | null;

  /**
   * Body param:
   */
  visual_prompts?: Array<Array<number>> | null;
}

export interface ToolCustomObjectDetectionParams {
  deployment_id: string;

  confidence?: number | null;

  image?: Uploadable | null;

  video?: Uploadable | null;
}

export interface ToolDepthAnythingV2Params {
  /**
   * Body param:
   */
  image: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  grayscale?: boolean | null;
}

export interface ToolDepthProParams {
  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolDoclingParams {
  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  pdf?: Uploadable | null;
}

export interface ToolDocumentAnalysisParams {
  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  caption_format?: OutputFormat;

  /**
   * Body param:
   */
  filename?: string | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  parse_figures?: boolean;

  /**
   * Body param:
   */
  parse_tables?: boolean;

  /**
   * Body param:
   */
  parse_text?: boolean;

  /**
   * Body param:
   */
  pdf?: Uploadable | null;

  /**
   * Body param:
   */
  response_format?: OutputFormat;

  /**
   * Body param:
   */
  return_chunk_crops?: boolean;

  /**
   * Body param:
   */
  return_page_crops?: boolean;

  /**
   * Body param:
   */
  summary_verbosity?: 'none' | 'brief' | 'normal' | 'detailed';
}

export interface ToolEmbeddingsParams {
  /**
   * Body param:
   */
  input: Array<string>;

  /**
   * Body param:
   */
  model: 'stella1.5b';

  /**
   * Query param:
   */
  timeout?: number | null;
}

export interface ToolFlorence2Params {
  /**
   * Body param:
   */
  task:
    | '<CAPTION>'
    | '<CAPTION_TO_PHRASE_GROUNDING>'
    | '<DETAILED_CAPTION>'
    | '<MORE_DETAILED_CAPTION>'
    | '<DENSE_REGION_CAPTION>'
    | '<OPEN_VOCABULARY_DETECTION>'
    | '<OD>'
    | '<OCR>'
    | '<OCR_WITH_REGION>'
    | '<REGION_PROPOSAL>'
    | '<REFERRING_EXPRESSION_SEGMENTATION>'
    | '<REGION_TO_SEGMENTATION>'
    | '<REGION_TO_CATEGORY>'
    | '<REGION_TO_DESCRIPTION>';

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  image?: string | null;

  /**
   * Body param:
   */
  images?: Array<string> | null;

  /**
   * Body param:
   */
  prompt?: string | null;

  /**
   * Body param:
   */
  video?: string | null;

  /**
   * Body param:
   */
  video_bytes?: Uploadable | null;
}

export interface ToolFlorence2QaParams {
  /**
   * Body param:
   */
  image: string;

  /**
   * Body param:
   */
  question: string;

  /**
   * Query param:
   */
  timeout?: number | null;
}

export interface ToolFlorence2Sam2Params {
  /**
   * Body param:
   */
  prompts: Array<string>;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  chunk_length?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  iou_threshold?: number;

  /**
   * Body param:
   */
  nms_threshold?: number;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolFlux1Params {
  /**
   * Body param:
   */
  prompt: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  guidance_scale?: number | null;

  /**
   * Body param:
   */
  height?: number;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  mask_image?: Uploadable | null;

  /**
   * Body param:
   */
  max_sequence_length?: number | null;

  /**
   * Body param:
   */
  num_images_per_prompt?: number | null;

  /**
   * Body param:
   */
  num_inference_steps?: number | null;

  /**
   * Body param:
   */
  seed?: number | null;

  /**
   * Body param:
   */
  strength?: number | null;

  /**
   * Body param:
   */
  task?: 'generation' | 'inpainting' | 'img2img';

  /**
   * Body param:
   */
  width?: number;
}

export interface ToolGleeParams {
  /**
   * Body param:
   */
  prompts: Array<string>;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  confidence?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  nmsThreshold?: number | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolImageToTextParams {
  /**
   * Body param:
   */
  model: 'qwen2vl' | 'internlm-xcomposer' | 'qwen25vl';

  /**
   * Body param:
   */
  prompt: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  images?: Array<Uploadable> | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolInternlmXcomposer2Params {
  /**
   * Body param:
   */
  prompt: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolLicensePlateParams {
  video: Uploadable;
}

export interface ToolLocaParams {
  /**
   * Body param:
   */
  image: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  bbox?: Array<number> | null;
}

export interface ToolMarkdownSchemaSuggestionParams {
  /**
   * Markdown content to analyze for schema generation
   */
  markdown: string;

  /**
   * Optional user customization prompt for schema generation
   */
  prompt?: string | null;
}

export interface ToolNsfwClassificationParams {
  /**
   * Body param:
   */
  image: string;

  /**
   * Query param:
   */
  timeout?: number | null;
}

export interface ToolOwlv2Params {
  /**
   * Body param:
   */
  image: string;

  /**
   * Body param:
   */
  prompts: Array<string>;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  confidence?: number | null;
}

export interface ToolPaddleOcrParams {
  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolPoseDetectorParams {
  /**
   * Body param:
   */
  image: string;

  /**
   * Query param:
   */
  timeout?: number | null;
}

export interface ToolQrReaderParams {
  /**
   * Body param:
   */
  image: string;

  /**
   * Query param:
   */
  timeout?: number | null;
}

export interface ToolSam2Params {
  /**
   * Body param:
   */
  bboxes: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  chunk_length_frames?: number | null;

  /**
   * Body param:
   */
  images?: Array<Uploadable> | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolTextToInstanceSegmentationParams {
  /**
   * Body param:
   */
  model: 'florence2sam2';

  /**
   * Body param:
   */
  prompt: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  chunkLengthFrames?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  iouThreshold?: number | null;

  /**
   * Body param:
   */
  jobId?: string | null;

  /**
   * Body param:
   */
  nmsThreshold?: number | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolTextToObjectDetectionParams {
  /**
   * Body param:
   */
  model: 'owlv2' | 'countgd' | 'florence2' | 'agentic' | 'glee' | 'florencev2';

  /**
   * Body param:
   */
  prompts: Array<string>;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  confidence?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  jobId?: string | null;

  /**
   * Body param:
   */
  nmsThreshold?: number | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolVideoTemporalLocalizationParams {
  /**
   * Body param:
   */
  model: 'internlm-xcomposer' | 'gpt4o' | 'qwen2vl' | 'qwen25vl';

  /**
   * Body param:
   */
  prompt: string;

  /**
   * Body param:
   */
  video: Uploadable;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  chunk_length?: number | null;

  /**
   * Body param:
   */
  chunk_length_frames?: number | null;

  /**
   * Body param:
   */
  chunk_length_seconds?: number | null;
}

export interface ToolVisualPromptsToObjectDetectionParams {
  /**
   * Body param:
   */
  model: 'countgd';

  /**
   * Body param:
   */
  visual_prompts: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param:
   */
  image?: Uploadable | null;

  /**
   * Body param:
   */
  video?: Uploadable | null;
}

export interface ToolWsiEmbeddingParams {
  /**
   * Body param:
   */
  image: string;

  /**
   * Query param:
   */
  timeout?: number | null;

  /**
   * Body param: Microns per pixel
   */
  mpp?: number | null;
}

export declare namespace Tools {
  export {
    type BaseMediaRequest as BaseMediaRequest,
    type BboxResponse as BboxResponse,
    type OdResponse as OdResponse,
    type OutputFormat as OutputFormat,
    type SegmentationBitMaskRle as SegmentationBitMaskRle,
    type TextToInstanceSegmentation as TextToInstanceSegmentation,
    type ToolActivityRecognitionResponse as ToolActivityRecognitionResponse,
    type ToolAgenticDocumentAnalysisResponse as ToolAgenticDocumentAnalysisResponse,
    type ToolBarcodeReaderResponse as ToolBarcodeReaderResponse,
    type ToolClassificationResponse as ToolClassificationResponse,
    type ToolDepthAnythingV2Response as ToolDepthAnythingV2Response,
    type ToolDepthProResponse as ToolDepthProResponse,
    type ToolDoclingResponse as ToolDoclingResponse,
    type ToolDocumentAnalysisResponse as ToolDocumentAnalysisResponse,
    type ToolEmbeddingsResponse as ToolEmbeddingsResponse,
    type ToolFlorence2Response as ToolFlorence2Response,
    type ToolFlorence2QaResponse as ToolFlorence2QaResponse,
    type ToolFlorence2Sam2Response as ToolFlorence2Sam2Response,
    type ToolFlux1Response as ToolFlux1Response,
    type ToolImageToTextResponse as ToolImageToTextResponse,
    type ToolInternlmXcomposer2Response as ToolInternlmXcomposer2Response,
    type ToolLicensePlateResponse as ToolLicensePlateResponse,
    type ToolLocaResponse as ToolLocaResponse,
    type ToolMarkdownSchemaSuggestionResponse as ToolMarkdownSchemaSuggestionResponse,
    type ToolNsfwClassificationResponse as ToolNsfwClassificationResponse,
    type ToolPaddleOcrResponse as ToolPaddleOcrResponse,
    type ToolPoseDetectorResponse as ToolPoseDetectorResponse,
    type ToolQrReaderResponse as ToolQrReaderResponse,
    type ToolVideoTemporalLocalizationResponse as ToolVideoTemporalLocalizationResponse,
    type ToolWsiEmbeddingResponse as ToolWsiEmbeddingResponse,
    type ToolActivityRecognitionParams as ToolActivityRecognitionParams,
    type ToolAgenticDocumentAnalysisParams as ToolAgenticDocumentAnalysisParams,
    type ToolAgenticObjectDetectionParams as ToolAgenticObjectDetectionParams,
    type ToolBarcodeReaderParams as ToolBarcodeReaderParams,
    type ToolClassificationParams as ToolClassificationParams,
    type ToolCountgdParams as ToolCountgdParams,
    type ToolCustomObjectDetectionParams as ToolCustomObjectDetectionParams,
    type ToolDepthAnythingV2Params as ToolDepthAnythingV2Params,
    type ToolDepthProParams as ToolDepthProParams,
    type ToolDoclingParams as ToolDoclingParams,
    type ToolDocumentAnalysisParams as ToolDocumentAnalysisParams,
    type ToolEmbeddingsParams as ToolEmbeddingsParams,
    type ToolFlorence2Params as ToolFlorence2Params,
    type ToolFlorence2QaParams as ToolFlorence2QaParams,
    type ToolFlorence2Sam2Params as ToolFlorence2Sam2Params,
    type ToolFlux1Params as ToolFlux1Params,
    type ToolGleeParams as ToolGleeParams,
    type ToolImageToTextParams as ToolImageToTextParams,
    type ToolInternlmXcomposer2Params as ToolInternlmXcomposer2Params,
    type ToolLicensePlateParams as ToolLicensePlateParams,
    type ToolLocaParams as ToolLocaParams,
    type ToolMarkdownSchemaSuggestionParams as ToolMarkdownSchemaSuggestionParams,
    type ToolNsfwClassificationParams as ToolNsfwClassificationParams,
    type ToolOwlv2Params as ToolOwlv2Params,
    type ToolPaddleOcrParams as ToolPaddleOcrParams,
    type ToolPoseDetectorParams as ToolPoseDetectorParams,
    type ToolQrReaderParams as ToolQrReaderParams,
    type ToolSam2Params as ToolSam2Params,
    type ToolTextToInstanceSegmentationParams as ToolTextToInstanceSegmentationParams,
    type ToolTextToObjectDetectionParams as ToolTextToObjectDetectionParams,
    type ToolVideoTemporalLocalizationParams as ToolVideoTemporalLocalizationParams,
    type ToolVisualPromptsToObjectDetectionParams as ToolVisualPromptsToObjectDetectionParams,
    type ToolWsiEmbeddingParams as ToolWsiEmbeddingParams,
  };
}
