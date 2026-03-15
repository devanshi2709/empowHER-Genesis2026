import { Router, Request, Response } from "express";
// WatsonX service wrapper — generateExplanation turns scan data into plain-language text
import { generateExplanation } from "../services/watsonx.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Endpoint initialized" });
});

// POST /api/explain
// Accepts { scanId, data } where data is the scan result object.
// Calls generateExplanation() and returns a patient-friendly explanation.
router.post("/", async (req: Request, res: Response) => {
  const { scanId, data } = req.body as { scanId?: string; data?: Record<string, unknown> };
  if (!data) {
    return res.status(400).json({ success: false, message: "data is required" });
  }
  try {
    const result = await generateExplanation(data);
    return res.json({ success: true, scanId: scanId ?? null, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "WatsonX call failed";
    return res.status(500).json({ success: false, message });
  }
});

export default router;
