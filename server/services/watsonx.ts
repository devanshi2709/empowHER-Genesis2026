/**
 * WatsonX Service Wrapper
 * ─────────────────────────────────────────────────────────────
 * Centralises all IBM watsonx.ai API calls so routes only need
 * to import from this file.
 *
 * Uses the /ml/v1/text/chat endpoint with the model configured
 * in the environment. Errors are surfaced upstream; this module
 * does not fabricate fallback clinical output.
 */

import axios from "axios";

type WatsonConfig = {
  url: string;
  apiKey: string;
  projectId: string;
  modelId: string;
};

function readRequiredEnv(name: string): string {
  const raw = process.env[name];
  if (!raw || !raw.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return raw.trim();
}

function getWatsonConfig(): WatsonConfig {
  return {
    url: readRequiredEnv("WATSONX_URL"),
    apiKey: readRequiredEnv("WATSONX_API_KEY"),
    projectId: readRequiredEnv("WATSONX_PROJECT_ID"),
    modelId: process.env.WATSONX_MODEL_ID?.trim() || "ibm/granite-4-h-small",
  };
}

/** Fetch a Bearer token from IBM IAM (cached per process start). */
let _cachedToken: string | null = null;
let _cachedTokenApiKey: string | null = null;
async function getIAMToken(apiKey: string): Promise<string> {
  if (_cachedToken && _cachedTokenApiKey === apiKey) return _cachedToken;
  const resp = await axios.post(
    "https://iam.cloud.ibm.com/identity/token",
    new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  _cachedToken = resp.data.access_token as string;
  _cachedTokenApiKey = apiKey;
  return _cachedToken;
}

/** Build a minimal chat payload for the watsonx.ai endpoint. */
function buildPayload(systemPrompt: string, userMessage: string, config: WatsonConfig) {
  return {
    model_id: config.modelId,
    project_id: config.projectId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    parameters: { max_new_tokens: 500, temperature: 0.7 },
  };
}

/** Call watsonx and return the assistant's reply text. */
async function callWatsonX(systemPrompt: string, userMessage: string): Promise<string> {
  const config = getWatsonConfig();
  try {
    const token = await getIAMToken(config.apiKey);
    const resp = await axios.post(config.url, buildPayload(systemPrompt, userMessage, config), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
    // Extract the assistant message from the response
    const choices = resp.data?.choices ?? resp.data?.results ?? [];
    const text = choices[0]?.message?.content ?? choices[0]?.generated_text ?? "";
    if (!text || !text.trim()) {
      throw new Error("WatsonX returned an empty response.");
    }
    return text;
  } catch (err: unknown) {
    const upstreamDetails = axios.isAxiosError(err)
      ? JSON.stringify(err.response?.data ?? { message: err.message })
      : err instanceof Error
        ? err.message
        : "Unknown WatsonX error";

    console.error("[watsonx] Upstream request failed:", upstreamDetails);
    throw new Error(`WatsonX unavailable: ${upstreamDetails}`);
  }
}

// ─────────────────────────────────────────────────────────────
// Public API — these are the functions routes / Person 3 call
// ─────────────────────────────────────────────────────────────

/**
 * generateInsight(prompt)
 * Takes a free-form prompt and returns an AI-generated insight.
 * Used by /api/ai-test and any future feature that needs raw AI output.
 */
export async function generateInsight(prompt: string): Promise<{ insight: string }> {
  const system = "You are a helpful medical AI assistant. Provide clear, concise insights.";
  const text = await callWatsonX(system, prompt);
  return { insight: text };
}

/**
 * generateExplanation(data)
 * Takes care-context data and returns a structured advocacy response:
 * explanation, next_step, and benefit guidance.
 */
export async function generateExplanation(data: Record<string, unknown>): Promise<{
  explanation: string;
  next_step: string;
  benefit: string;
}> {
  const system =
    "You are a compassionate healthcare workflow assistant helping clinicians draft patient-friendly guidance. " +
    "Respond ONLY with a JSON object with three fields: " +
    "\"explanation\" (plain-language summary), " +
    "\"next_step\" (one suggested action for the user), " +
    "\"benefit\" (one relevant insurance or benefits coordination tip).";
  const userMessage = `Health insight data: ${JSON.stringify(data)}`;
  const text = await callWatsonX(system, userMessage);

  // Require strict JSON so callers can trust the contract.
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as Partial<{
      explanation: string;
      next_step: string;
      benefit: string;
    }>;

    if (
      !parsed ||
      typeof parsed.explanation !== "string" ||
      typeof parsed.next_step !== "string" ||
      typeof parsed.benefit !== "string"
    ) {
      throw new Error("WatsonX explanation payload missing required string fields.");
    }

    return {
      explanation: parsed.explanation,
      next_step: parsed.next_step,
      benefit: parsed.benefit,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown explanation parse error";
    throw new Error(`Failed to parse WatsonX explanation JSON: ${message}`);
  }
}
