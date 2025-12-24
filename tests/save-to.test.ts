import fs from 'fs';
import path from 'path';
import { _getInputFilename, _saveResponse } from 'landingai-ade';

describe('_getInputFilename', () => {
  describe('file input', () => {
    it('extracts filename from ReadStream path', () => {
      const stream = fs.createReadStream('tests/save-to.test.ts');
      const result = _getInputFilename(stream, null);
      expect(result).toBe('save-to.test'); // path.parse removes only last extension
    });

    it('extracts filename from File object', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const result = _getInputFilename(file, null);
      expect(result).toBe('document');
    });

    it('returns "output" for string content (not a file)', () => {
      const result = _getInputFilename('raw markdown content', null);
      expect(result).toBe('output');
    });

    it('returns "output" for null file input', () => {
      const result = _getInputFilename(null, null);
      expect(result).toBe('output');
    });
  });

  describe('URL input', () => {
    it('extracts filename from URL path', () => {
      const result = _getInputFilename(null, 'https://example.com/path/to/document.pdf');
      expect(result).toBe('document');
    });

    it('extracts filename from URL with query params', () => {
      const result = _getInputFilename(null, 'https://example.com/file.pdf?token=abc123');
      expect(result).toBe('file');
    });

    it('returns "url_input" for URL with no meaningful path', () => {
      const result = _getInputFilename(null, 'https://example.com/');
      expect(result).toBe('url_input');
    });

    it('returns "url_input" for invalid URL', () => {
      const result = _getInputFilename(null, 'not-a-valid-url');
      expect(result).toBe('url_input');
    });
  });

  describe('precedence', () => {
    it('file input takes precedence over URL', () => {
      const file = new File(['content'], 'local.pdf');
      const result = _getInputFilename(file, 'https://example.com/remote.pdf');
      expect(result).toBe('local');
    });
  });
});

describe('_saveResponse', () => {
  const testDir = path.join(__dirname, 'test-output');

  beforeEach(() => {
    // Clean up before each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up after all tests
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it('creates folder and saves file with correct name', () => {
    const result = { key: 'value', nested: { data: 123 } };
    _saveResponse(testDir, 'testfile', 'parse', result);

    const expectedFile = path.join(testDir, 'testfile_parse_output.json');
    expect(fs.existsSync(expectedFile)).toBe(true);

    const content = JSON.parse(fs.readFileSync(expectedFile, 'utf-8'));
    expect(content).toEqual(result);
  });

  it('saves to existing folder', () => {
    fs.mkdirSync(testDir, { recursive: true });
    const result = { data: 'test' };
    _saveResponse(testDir, 'doc', 'extract', result);

    const expectedFile = path.join(testDir, 'doc_extract_output.json');
    expect(fs.existsSync(expectedFile)).toBe(true);
  });

  it('formats JSON with 2-space indentation', () => {
    const result = { key: 'value' };
    _saveResponse(testDir, 'formatted', 'split', result);

    const expectedFile = path.join(testDir, 'formatted_split_output.json');
    const content = fs.readFileSync(expectedFile, 'utf-8');
    expect(content).toBe(JSON.stringify(result, null, 2));
  });

  it('uses correct filename format for each method', () => {
    const result = {};

    _saveResponse(testDir, 'myinput', 'parse', result);
    expect(fs.existsSync(path.join(testDir, 'myinput_parse_output.json'))).toBe(true);

    _saveResponse(testDir, 'myinput', 'extract', result);
    expect(fs.existsSync(path.join(testDir, 'myinput_extract_output.json'))).toBe(true);

    _saveResponse(testDir, 'myinput', 'split', result);
    expect(fs.existsSync(path.join(testDir, 'myinput_split_output.json'))).toBe(true);
  });

  it('creates nested directories', () => {
    const nestedDir = path.join(testDir, 'nested', 'deep', 'folder');
    const result = { data: 'nested' };
    _saveResponse(nestedDir, 'file', 'parse', result);

    const expectedFile = path.join(nestedDir, 'file_parse_output.json');
    expect(fs.existsSync(expectedFile)).toBe(true);
  });
});
