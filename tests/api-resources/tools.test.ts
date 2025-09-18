// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Ade, { toFile } from 'ade-typescript';

const client = new Ade({
  username: 'My Username',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource tools', () => {
  // Prism tests are disabled
  test.skip('activityRecognition: only required params', async () => {
    const responsePromise = client.tools.activityRecognition({
      prompt: 'prompt',
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('activityRecognition: required and optional params', async () => {
    const response = await client.tools.activityRecognition({
      prompt: 'prompt',
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
      specificity: 'low',
      with_audio: true,
    });
  });

  // Prism tests are disabled
  test.skip('agenticDocumentAnalysis', async () => {
    const responsePromise = client.tools.agenticDocumentAnalysis({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('agenticObjectDetection: only required params', async () => {
    const responsePromise = client.tools.agenticObjectDetection({ prompts: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('agenticObjectDetection: required and optional params', async () => {
    const response = await client.tools.agenticObjectDetection({
      prompts: ['string'],
      timeout: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('barcodeReader: only required params', async () => {
    const responsePromise = client.tools.barcodeReader({ image: 'image' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('barcodeReader: required and optional params', async () => {
    const response = await client.tools.barcodeReader({ image: 'image', timeout: 0 });
  });

  // Prism tests are disabled
  test.skip('classification: only required params', async () => {
    const responsePromise = client.tools.classification({
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      labels: ['string'],
      model: 'siglip',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('classification: required and optional params', async () => {
    const response = await client.tools.classification({
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      labels: ['string'],
      model: 'siglip',
      timeout: 0,
    });
  });

  // Prism tests are disabled
  test.skip('countgd: only required params', async () => {
    const responsePromise = client.tools.countgd({ image: 'image' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('countgd: required and optional params', async () => {
    const response = await client.tools.countgd({
      image: 'image',
      timeout: 0,
      prompt: 'prompt',
      visual_prompts: [[0]],
    });
  });

  // Prism tests are disabled
  test.skip('customObjectDetection: only required params', async () => {
    const responsePromise = client.tools.customObjectDetection({
      deployment_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('customObjectDetection: required and optional params', async () => {
    const response = await client.tools.customObjectDetection({
      deployment_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      confidence: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('depthAnythingV2: only required params', async () => {
    const responsePromise = client.tools.depthAnythingV2({ image: 'image' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('depthAnythingV2: required and optional params', async () => {
    const response = await client.tools.depthAnythingV2({ image: 'image', timeout: 0, grayscale: true });
  });

  // Prism tests are disabled
  test.skip('depthPro', async () => {
    const responsePromise = client.tools.depthPro({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('docling', async () => {
    const responsePromise = client.tools.docling({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('documentAnalysis', async () => {
    const responsePromise = client.tools.documentAnalysis({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('embeddings: only required params', async () => {
    const responsePromise = client.tools.embeddings({ input: ['string'], model: 'stella1.5b' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('embeddings: required and optional params', async () => {
    const response = await client.tools.embeddings({ input: ['string'], model: 'stella1.5b', timeout: 0 });
  });

  // Prism tests are disabled
  test.skip('florence2: only required params', async () => {
    const responsePromise = client.tools.florence2({ task: '<CAPTION>' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('florence2: required and optional params', async () => {
    const response = await client.tools.florence2({
      task: '<CAPTION>',
      timeout: 0,
      image: 'image',
      images: ['string'],
      prompt: 'prompt',
      video: 'video',
      video_bytes: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('florence2Qa: only required params', async () => {
    const responsePromise = client.tools.florence2Qa({ image: 'image', question: 'question' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('florence2Qa: required and optional params', async () => {
    const response = await client.tools.florence2Qa({ image: 'image', question: 'question', timeout: 0 });
  });

  // Prism tests are disabled
  test.skip('florence2Sam2: only required params', async () => {
    const responsePromise = client.tools.florence2Sam2({ prompts: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('florence2Sam2: required and optional params', async () => {
    const response = await client.tools.florence2Sam2({
      prompts: ['string'],
      timeout: 0,
      chunk_length: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      iou_threshold: 0.1,
      nms_threshold: 0.1,
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('flux1: only required params', async () => {
    const responsePromise = client.tools.flux1({ prompt: 'prompt' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('flux1: required and optional params', async () => {
    const response = await client.tools.flux1({
      prompt: 'prompt',
      timeout: 0,
      guidance_scale: 0,
      height: 8,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      mask_image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      max_sequence_length: 0,
      num_images_per_prompt: 1,
      num_inference_steps: 1,
      seed: 0,
      strength: 0,
      task: 'generation',
      width: 8,
    });
  });

  // Prism tests are disabled
  test.skip('glee: only required params', async () => {
    const responsePromise = client.tools.glee({ prompts: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('glee: required and optional params', async () => {
    const response = await client.tools.glee({
      prompts: ['string'],
      timeout: 0,
      confidence: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      nmsThreshold: 0,
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('imageToText: only required params', async () => {
    const responsePromise = client.tools.imageToText({ model: 'qwen2vl', prompt: 'prompt' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('imageToText: required and optional params', async () => {
    const response = await client.tools.imageToText({
      model: 'qwen2vl',
      prompt: 'prompt',
      timeout: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      images: [await toFile(Buffer.from('# my file contents'), 'README.md')],
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('internlmXcomposer2: only required params', async () => {
    const responsePromise = client.tools.internlmXcomposer2({ prompt: 'prompt' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('internlmXcomposer2: required and optional params', async () => {
    const response = await client.tools.internlmXcomposer2({
      prompt: 'prompt',
      timeout: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('licensePlate: only required params', async () => {
    const responsePromise = client.tools.licensePlate({
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('licensePlate: required and optional params', async () => {
    const response = await client.tools.licensePlate({
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('loca: only required params', async () => {
    const responsePromise = client.tools.loca({ image: 'image' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('loca: required and optional params', async () => {
    const response = await client.tools.loca({ image: 'image', timeout: 0, bbox: [0, 0, 0, 0] });
  });

  // Prism tests are disabled
  test.skip('markdownSchemaSuggestion: only required params', async () => {
    const responsePromise = client.tools.markdownSchemaSuggestion({ markdown: 'markdown' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('markdownSchemaSuggestion: required and optional params', async () => {
    const response = await client.tools.markdownSchemaSuggestion({ markdown: 'markdown', prompt: 'prompt' });
  });

  // Prism tests are disabled
  test.skip('nsfwClassification: only required params', async () => {
    const responsePromise = client.tools.nsfwClassification({ image: 'image' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('nsfwClassification: required and optional params', async () => {
    const response = await client.tools.nsfwClassification({ image: 'image', timeout: 0 });
  });

  // Prism tests are disabled
  test.skip('owlv2: only required params', async () => {
    const responsePromise = client.tools.owlv2({ image: 'image', prompts: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('owlv2: required and optional params', async () => {
    const response = await client.tools.owlv2({
      image: 'image',
      prompts: ['string'],
      timeout: 0,
      confidence: 0,
    });
  });

  // Prism tests are disabled
  test.skip('paddleOcr', async () => {
    const responsePromise = client.tools.paddleOcr({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('poseDetector: only required params', async () => {
    const responsePromise = client.tools.poseDetector({ image: 'image' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('poseDetector: required and optional params', async () => {
    const response = await client.tools.poseDetector({ image: 'image', timeout: 0 });
  });

  // Prism tests are disabled
  test.skip('qrReader: only required params', async () => {
    const responsePromise = client.tools.qrReader({ image: 'image' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('qrReader: required and optional params', async () => {
    const response = await client.tools.qrReader({ image: 'image', timeout: 0 });
  });

  // Prism tests are disabled
  test.skip('sam2: only required params', async () => {
    const responsePromise = client.tools.sam2({ bboxes: 'bboxes' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('sam2: required and optional params', async () => {
    const response = await client.tools.sam2({
      bboxes: 'bboxes',
      timeout: 0,
      chunk_length_frames: 0,
      images: [await toFile(Buffer.from('# my file contents'), 'README.md')],
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('textToInstanceSegmentation: only required params', async () => {
    const responsePromise = client.tools.textToInstanceSegmentation({
      model: 'florence2sam2',
      prompt: 'prompt',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('textToInstanceSegmentation: required and optional params', async () => {
    const response = await client.tools.textToInstanceSegmentation({
      model: 'florence2sam2',
      prompt: 'prompt',
      timeout: 0,
      chunkLengthFrames: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      iouThreshold: 0.1,
      jobId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      nmsThreshold: 0.1,
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('textToObjectDetection: only required params', async () => {
    const responsePromise = client.tools.textToObjectDetection({ model: 'owlv2', prompts: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('textToObjectDetection: required and optional params', async () => {
    const response = await client.tools.textToObjectDetection({
      model: 'owlv2',
      prompts: ['string'],
      timeout: 0,
      confidence: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      jobId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      nmsThreshold: 0,
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('videoTemporalLocalization: only required params', async () => {
    const responsePromise = client.tools.videoTemporalLocalization({
      model: 'internlm-xcomposer',
      prompt: 'prompt',
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('videoTemporalLocalization: required and optional params', async () => {
    const response = await client.tools.videoTemporalLocalization({
      model: 'internlm-xcomposer',
      prompt: 'prompt',
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
      timeout: 0,
      chunk_length: 1,
      chunk_length_frames: 1,
      chunk_length_seconds: 1,
    });
  });

  // Prism tests are disabled
  test.skip('visualPromptsToObjectDetection: only required params', async () => {
    const responsePromise = client.tools.visualPromptsToObjectDetection({
      model: 'countgd',
      visual_prompts: 'visual_prompts',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('visualPromptsToObjectDetection: required and optional params', async () => {
    const response = await client.tools.visualPromptsToObjectDetection({
      model: 'countgd',
      visual_prompts: 'visual_prompts',
      timeout: 0,
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      video: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('wsiEmbedding: only required params', async () => {
    const responsePromise = client.tools.wsiEmbedding({ image: 'image' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('wsiEmbedding: required and optional params', async () => {
    const response = await client.tools.wsiEmbedding({ image: 'image', timeout: 0, mpp: 0 });
  });
});
