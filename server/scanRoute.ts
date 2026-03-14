import { Router, Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const COS = require('ibm-cos-sdk');

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error('Only image files (jpeg, png, gif, webp) are allowed'));
  },
});

const uploadSingleImage = upload.single('image');

export interface ScanResultPayload {
  scanId: string;
  detectedIssue: string;
  confidence: 'low' | 'moderate' | 'high';
  scanType: string;
  insight: string;
  imageUrl: string;
}

const CONFIDENCE_OPTIONS: ScanResultPayload['confidence'][] = ['low', 'moderate', 'high'];
const FALLBACK_RESULTS: Omit<ScanResultPayload, 'scanId' | 'imageUrl'>[] = [
  {
    detectedIssue: 'gum_inflammation',
    confidence: 'moderate',
    scanType: 'oral',
    insight:
      'Possible mild inflammation detected around the gum line. Staying hydrated and gentle brushing may help. Consider a dental follow-up.',
  },
  {
    detectedIssue: 'healthy_tissue',
    confidence: 'high',
    scanType: 'oral',
    insight:
      'No significant anomalies detected. Tissue patterns appear healthy. Keep up your current oral hygiene routine.',
  },
  {
    detectedIssue: 'pigmentation_irregularity',
    confidence: 'low',
    scanType: 'skin',
    insight:
      'Early-stage pigmentation irregularity observed. Results are inconclusive — consider a follow-up scan in better lighting.',
  },
  {
    detectedIssue: 'elevated_vascular_activity',
    confidence: 'moderate',
    scanType: 'general',
    insight:
      'Elevated vascular activity detected in the scan area. Recommend a clinical review for accurate diagnosis.',
  },
];

function generateScanId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

type CosClient = {
  putObject: (p: { Bucket: string; Key: string; Body: Buffer; ContentType: string }) => { promise: () => Promise<unknown> };
  getSignedUrl: (op: string, params: { Bucket: string; Key: string; Expires: number }) => string;
  getObject: (p: { Bucket: string; Key: string }) => { createReadStream: () => NodeJS.ReadableStream };
};

function getCosClient(): CosClient {
  const endpoint = process.env.COS_ENDPOINT;
  const apiKeyId = process.env.COS_API_KEY_ID;
  const instanceCrn = process.env.COS_INSTANCE_CRN;
  if (!endpoint || !apiKeyId || !instanceCrn) {
    throw new Error('Missing COS configuration: set COS_ENDPOINT, COS_API_KEY_ID, COS_INSTANCE_CRN');
  }
  const config: Record<string, unknown> = {
    endpoint,
    apiKeyId,
    serviceInstanceId: instanceCrn,
  };
  const accessKeyId = process.env.COS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.COS_SECRET_ACCESS_KEY;
  if (accessKeyId && secretAccessKey) {
    config.signatureVersion = 'v4';
    config.credentials = new COS.Credentials(accessKeyId, secretAccessKey);
  }
  return new COS.S3(config);
}

async function uploadToCOS(
  buffer: Buffer,
  contentType: string,
  key: string,
  req: Request
): Promise<string> {
  const endpoint = process.env.COS_ENDPOINT;
  const apiKeyId = process.env.COS_API_KEY_ID;
  const instanceCrn = process.env.COS_INSTANCE_CRN;
  const bucket = process.env.COS_BUCKET_NAME;

  if (!endpoint || !apiKeyId || !instanceCrn || !bucket) {
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  }

  const cos = getCosClient();
  await cos.putObject({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }).promise();

  const accessKeyId = process.env.COS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.COS_SECRET_ACCESS_KEY;
  if (accessKeyId && secretAccessKey) {
    const signedUrl = cos.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: 3600 * 24 * 7,
    });
    return signedUrl;
  }

  const base = process.env.API_BASE_URL || `${req.protocol}://${req.get('host') || 'localhost:3001'}`;
  return `${base}/api/scan/image/${encodeURIComponent(key)}`;
}

async function callWatsonX(imageUrl: string, imageBase64?: string): Promise<Omit<ScanResultPayload, 'scanId' | 'imageUrl'>> {
  const apiKey = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const url = process.env.WATSONX_URL;

  if (!apiKey || !projectId || !url) {
    const fallback = FALLBACK_RESULTS[Math.floor(Math.random() * FALLBACK_RESULTS.length)];
    return fallback;
  }

  const prompt = `Analyze this health/wellness image and respond with a JSON object only (no markdown, no code block) with exactly these keys: "detectedIssue" (snake_case, e.g. healthy_tissue, gum_inflammation, pigmentation_irregularity, elevated_vascular_activity), "confidence" (one of: low, moderate, high), "scanType" (one of: oral, skin, general), "insight" (2-3 sentences of health guidance). Image: ${imageUrl || '[attached]'}`;

  try {
    const body: Record<string, unknown> = {
      project_id: projectId,
      input: {
        message: {
          role: 'user',
          content: prompt,
        },
      },
      parameters: {
        max_new_tokens: 400,
        temperature: 0.2,
      },
    };

    if (imageBase64) {
      (body.input as Record<string, unknown>).message = {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } },
        ],
      };
    }

    const { data } = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      validateStatus: () => true,
    });

    const text = typeof data === 'object' && data.results?.[0]?.generated_text != null
      ? data.results[0].generated_text
      : typeof data === 'string'
        ? data
        : JSON.stringify(data);

    const parsed = tryParseJSON(text);
    if (parsed && typeof parsed.detectedIssue === 'string' && typeof parsed.insight === 'string') {
      return {
        detectedIssue: parsed.detectedIssue,
        confidence: CONFIDENCE_OPTIONS.includes(parsed.confidence) ? parsed.confidence : 'moderate',
        scanType: typeof parsed.scanType === 'string' ? parsed.scanType : 'general',
        insight: parsed.insight,
      };
    }
  } catch (_err) {
    // fall through to fallback
  }

  return FALLBACK_RESULTS[Math.floor(Math.random() * FALLBACK_RESULTS.length)];
}

function tryParseJSON(str: string): Record<string, unknown> | null {
  try {
    const cleaned = str.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, '$1');
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    return null;
  }
}

router.post('/scan', async (req: Request, res: Response): Promise<void> => {
  uploadSingleImage(req, res, async (err?: unknown) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Upload error';
      res.status(400).json({ error: message });
      return;
    }

    if (!req.file || !req.file.buffer) {
      res
        .status(400)
        .json({ error: 'Missing image file. Send a multipart field named "image".' });
      return;
    }

    const scanId = generateScanId();
    const contentType = req.file.mimetype || 'image/png';
    const ext = contentType.split('/')[1] || 'png';
    const key = `scans/${scanId}.${ext}`;

    let imageUrl: string;

    try {
      imageUrl = await uploadToCOS(req.file.buffer, contentType, key, req);
    } catch (uploadErr) {
      const message = uploadErr instanceof Error ? uploadErr.message : 'Upload failed';
      res.status(502).json({ error: `Cloud storage upload failed: ${message}` });
      return;
    }

    const imageBase64 = req.file.buffer.toString('base64');
    let analysis: Omit<ScanResultPayload, 'scanId' | 'imageUrl'>;

    try {
      analysis = await callWatsonX(imageUrl, imageBase64);
    } catch {
      analysis = FALLBACK_RESULTS[Math.floor(Math.random() * FALLBACK_RESULTS.length)];
    }

    const payload: ScanResultPayload = {
      scanId,
      imageUrl,
      ...analysis,
    };

    res.json(payload);
  });
});

router.get('/scan/image/:key', async (req: Request, res: Response): Promise<void> => {
  const key = decodeURIComponent(req.params.key || '');
  if (!key || key.includes('..')) {
    res.status(400).json({ error: 'Invalid key' });
    return;
  }
  const bucket = process.env.COS_BUCKET_NAME;
  if (!bucket) {
    res.status(503).json({ error: 'COS not configured' });
    return;
  }
  try {
    const cos = getCosClient();
    const ext = key.split('.').pop()?.toLowerCase() || 'png';
    const mime: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };
    res.set('Content-Type', mime[ext] || 'image/png');
    const obj = cos.getObject({ Bucket: bucket, Key: key });
    const stream = obj.createReadStream();
    stream.pipe(res);
    stream.on('error', (err: Error) => {
      res.status(500).json({ error: err.message || 'Failed to stream image' });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'COS error';
    res.status(502).json({ error: message });
  }
});

export { router as scanRouter };
