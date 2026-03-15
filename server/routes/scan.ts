import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
// Storage service — abstracts local/cloud file handling
import { uploadImage, getImageUrl } from "../services/storage.js";
// WatsonX service — generates AI insight from scan context
import { generateInsight } from "../services/watsonx.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) =>
    cb(null, `scan_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are accepted"));
  },
});

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Endpoint initialized" });
});

// POST /api/scan
// 1. Multer saves the image to /uploads
// 2. storage.uploadImage() records metadata
// 3. watsonx.generateInsight() analyses the scan
// 4. Returns a Health Insight Card to the frontend
router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided." });
  }

  // Step 1: persist file metadata via storage service
  const stored = uploadImage(req.file);
  const imageUrl = getImageUrl(stored.filename);
  console.log(`Image stored: ${stored.filename} (${stored.mimetype}, ${stored.size} bytes)`);

  // Step 2: build a context prompt for WatsonX using image metadata
  const prompt =
    `Analyze this oral/skin health scan image. ` +
    `Filename: ${stored.filename}, Type: ${stored.mimetype}. ` +
    `Return a JSON object with fields: condition (string), confidence (0-1 float), recommendation (string).`;

  try {
    const { insight } = await generateInsight(prompt);

    // Step 3: try to parse structured JSON from the AI response
    let card: { condition: string; confidence: number; recommendation: string };
    try {
      // WatsonX may wrap JSON in markdown code fences — strip them
      const cleaned = insight.replace(/```json|```/g, "").trim();
      card = JSON.parse(cleaned);
    } catch {
      // Fallback: return raw insight if JSON parse fails
      card = {
        condition: insight,
        confidence: 0,
        recommendation: "Please consult a healthcare professional.",
      };
    }

    return res.json({
      success: true,
      scanId: stored.filename,
      imageUrl,
      ...card,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI analysis failed";
    console.error("Scan AI error:", message);
    return res.status(500).json({ success: false, message });
  }
});

export default router;
