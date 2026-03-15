import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

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

router.post("/", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided." });
  }
  const scanId = `scan_${Date.now()}`;
  return res.json({ success: true, message: "Endpoint initialized", scanId, filename: req.file.filename });
});

export default router;
