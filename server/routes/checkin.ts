import { Router, Request, Response } from "express";
// WatsonX service — generateInsight() is reused here to parse the voice transcript
import { generateInsight } from "../services/watsonx.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Endpoint initialized" });
});

// POST /api/checkin (Phase 5 — Daily Pulse Dashboard / Voice Check-In)
// Accepts: { transcript } — raw text from user's voice input
// Returns: energy_level + symptom_tags for the Daily Pulse Dashboard
// All outputs are for demo/workflow simulation only, not medical diagnosis.
router.post("/", async (req: Request, res: Response) => {
  const { transcript } = req.body as { transcript?: string };

  if (!transcript) {
    return res.status(400).json({ success: false, message: "transcript is required" });
  }

  console.log(`[/api/checkin] Processing voice check-in transcript`);

  // Prompt WatsonX to extract energy level and symptom tags from the transcript.
  // We ask for strict JSON so the response is easy to normalise for the frontend.
  const prompt =
    `Analyse this daily health check-in transcript and respond ONLY with a JSON object ` +
    `with two fields: ` +
    `"energy_level" (one of: "low", "medium", "high") and ` +
    `"symptom_tags" (array of short symptom strings, max 5, empty array if none). ` +
    `Transcript: "${transcript}"`;

  try {
    const { insight } = await generateInsight(prompt);

    // Parse structured JSON from WatsonX response
    let energy_level: string;
    let symptom_tags: string[];

    try {
      const cleaned = insight.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      energy_level = ["low", "medium", "high"].includes(parsed.energy_level)
        ? parsed.energy_level
        : "medium";
      symptom_tags = Array.isArray(parsed.symptom_tags) ? parsed.symptom_tags : [];
    } catch {
      // Fallback if AI doesn't return valid JSON
      energy_level = "medium";
      symptom_tags = [];
    }

    return res.json({ success: true, energy_level, symptom_tags });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "WatsonX call failed";
    console.error("[/api/checkin] Error:", message);
    return res.status(500).json({ success: false, message });
  }
});

export default router;
