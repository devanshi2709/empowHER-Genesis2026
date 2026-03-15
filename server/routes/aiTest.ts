import { Router, Request, Response } from "express";
// WatsonX service wrapper — all AI calls go through here
import { generateInsight } from "../services/watsonx.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Endpoint initialized" });
});

// POST /api/ai-test
// Accepts { "prompt": "text" }, calls WatsonX generateInsight, returns AI response.
router.post("/", async (req: Request, res: Response) => {
  const { prompt } = req.body as { prompt?: string };
  if (!prompt) {
    return res.status(400).json({ success: false, message: "prompt is required" });
  }
  try {
    const result = await generateInsight(prompt);
    return res.json({ success: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "WatsonX call failed";
    return res.status(500).json({ success: false, message });
  }
});

export default router;
