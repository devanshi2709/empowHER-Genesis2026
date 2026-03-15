import { Router, Request, Response } from "express";
// WatsonX service wrapper — generateExplanation returns explanation + next_step + benefit
import { generateExplanation } from "../services/watsonx.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Endpoint initialized" });
});

// POST /api/explain (Phase 4 — Advocacy Layer)
// Accepts: { condition, symptoms } from Phase 3 Health Insight Card output
// Returns: explanation, next_step, benefit — all demo/simulation only, not medical advice
router.post("/", async (req: Request, res: Response) => {
  const { condition, symptoms, scanId, data } = req.body as {
    condition?: string;
    symptoms?: string[];
    scanId?: string;
    // also accept legacy { data } shape from Phase 3 for backwards compatibility
    data?: Record<string, unknown>;
  };

  // Build a unified data object regardless of which input shape was sent
  const payload: Record<string, unknown> = data ?? { condition, symptoms };

  if (!condition && !data) {
    return res.status(400).json({ success: false, message: "condition or data is required" });
  }

  console.log(`[/api/explain] Processing advocacy layer for:`, payload);

  try {
    const result = await generateExplanation(payload);
    return res.json({
      success: true,
      scanId: scanId ?? null,
      ...result, // spreads explanation, next_step, benefit
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "WatsonX call failed";
    console.error("[/api/explain] Error:", message);
    return res.status(500).json({ success: false, message });
  }
});

export default router;
