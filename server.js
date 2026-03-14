import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

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

const INSIGHTS = [
  "Possible mild inflammation detected in the scan area.",
  "No significant anomalies detected. Tissue patterns appear healthy.",
  "Early-stage pigmentation irregularity observed. Consider follow-up.",
  "Scan analysis complete. Results within normal range.",
  "Elevated vascular activity detected. Recommend clinical review.",
];

app.post("/api/scan", upload.single("image"), (req, res) => {
  console.log("Scan request received");
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No image file provided." });
  }
  console.log(`Image saved: ${req.file.filename}`);
  const scanId = `scan_${Date.now()}`;
  const insight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
  console.log("Response sent");
  return res.json({ scanId, status: "success", insight, filename: req.file.filename });
});

app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ status: "error", message: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`SunLink API running on http://localhost:${PORT}`));
