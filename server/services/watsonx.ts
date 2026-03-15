/**
 * WatsonX Service Wrapper
 * ─────────────────────────────────────────────────────────────
 * Centralises all IBM watsonx.ai API calls so routes (and
 * Person 3's AI features) only need to import from this file.
 *
 * Uses the /ml/v1/text/chat endpoint with the model configured
 * in the environment. All functions return structured JSON so
 * callers never touch raw HTTP responses.
 */

import axios from "axios";

const WATSONX_URL = process.env.WATSONX_URL!;
const WATSONX_API_KEY = process.env.WATSONX_API_KEY!;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID!;
const MODEL_ID = "ibm/granite-13b-chat-v2";

/** Fetch a Bearer token from IBM IAM (cached per process start). */
let _cachedToken: string | null = null;
async function getIAMToken(): Promise<string> {
  if (_cachedToken) return _cachedToken;
  const resp = await axios.post(
    "https://iam.cloud.ibm.com/identity/token",
    new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: WATSONX_API_KEY,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  _cachedToken = resp.data.access_token as string;
  return _cachedToken;
}

/** Build a minimal chat payload for the watsonx.ai endpoint. */
function buildPayload(systemPrompt: string, userMessage: string) {
  return {
    model_id: MODEL_ID,
    project_id: WATSONX_PROJECT_ID,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    parameters: { max_new_tokens: 500, temperature: 0.7 },
  };
}

/** Call watsonx and return the assistant's reply text. */
async function callWatsonX(systemPrompt: string, userMessage: string): Promise<string> {
  const token = await getIAMToken();
  const resp = await axios.post(WATSONX_URL, buildPayload(systemPrompt, userMessage), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  // Extract the assistant message from the response
  const choices = resp.data?.choices ?? resp.data?.results ?? [];
  return choices[0]?.message?.content ?? choices[0]?.generated_text ?? "";
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
 * Takes a scan result object and returns a plain-language explanation.
 * Used by /api/explain to translate clinical data for patients.
 */
export async function generateExplanation(data: Record<string, unknown>): Promise<{ explanation: string }> {
  const system =
    "You are a compassionate medical assistant. Explain scan results in simple, reassuring language a patient can understand.";
  const userMessage = `Scan data: ${JSON.stringify(data)}`;
  const text = await callWatsonX(system, userMessage);
  return { explanation: text };
}
