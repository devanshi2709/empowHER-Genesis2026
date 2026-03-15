import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import scanRouter from "./routes/scan.js";
import explainRouter from "./routes/explain.js";
import aiTestRouter from "./routes/aiTest.js";
import checkinRouter from "./routes/checkin.js";
import workflowRouter from "./routes/workflow.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const defaultOrigins = ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"];
const configuredOrigins =
  process.env.CLIENT_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];
const allowedOrigins = configuredOrigins.length ? configuredOrigins : defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
  })
);
app.use(express.json());
app.use(requestLogger); // logs every request with method, path, status, duration

// Serve uploaded scan images so frontend can display them via /uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/scan", scanRouter);
app.use("/api/explain", explainRouter);
app.use("/api/ai-test", aiTestRouter);
app.use("/api/checkin", checkinRouter);
app.use("/api/workflow", workflowRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});
// Global error handler — normalises all errors to { success: false, error: "..." }
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`empowHER API running on http://localhost:${PORT}`));
