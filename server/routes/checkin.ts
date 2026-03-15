import { Router, Request, Response } from "express";
import { generateInsight } from "../services/watsonx.js";

const router = Router();

type EnergyLevel = "low" | "medium" | "high";

type CheckinExtraction = {
  energy_level: EnergyLevel;
  symptom_tags: string[];
};

function normaliseAiExtraction(insight: string): CheckinExtraction | null {
  try {
    const cleaned = insight.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as Partial<CheckinExtraction>;
    const energy_level =
      parsed.energy_level && ["low", "medium", "high"].includes(parsed.energy_level)
        ? (parsed.energy_level as EnergyLevel)
        : null;
    const symptom_tags = Array.isArray(parsed.symptom_tags)
      ? parsed.symptom_tags.filter((tag): tag is string => typeof tag === "string").slice(0, 5)
      : [];

    if (!energy_level) return null;
    return { energy_level, symptom_tags };
  } catch {
    return null;
  }
}

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Endpoint initialized" });
});

// POST /api/checkin (Phase 5 — Daily Pulse Dashboard / Voice Check-In)
// Accepts: { transcript } — raw text from user's voice input
// Returns: energy_level + symptom_tags extracted by WatsonX.
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
    const aiExtraction = normaliseAiExtraction(insight);
    if (!aiExtraction) {
      return res.status(502).json({
        success: false,
        message: "WatsonX returned an invalid extraction payload for /api/checkin.",
      });
    }

    console.log(
      `[/api/checkin] Extraction source=watsonx energy=${aiExtraction.energy_level} tags=${aiExtraction.symptom_tags.join(",") || "none"}`
    );

    return res.json({ success: true, ...aiExtraction, extraction_source: "watsonx" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "WatsonX call failed";
    console.error("[/api/checkin] Error:", message);
    return res.status(500).json({ success: false, message });
  }
});

export default router;
