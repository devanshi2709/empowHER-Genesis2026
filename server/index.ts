import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRouter from "./routes/scan.js";
import explainRouter from "./routes/explain.js";
import aiTestRouter from "./routes/aiTest.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/scan", scanRouter);
app.use("/api/explain", explainRouter);
app.use("/api/ai-test", aiTestRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`empowHER API running on http://localhost:${PORT}`));
