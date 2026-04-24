import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createVertex } from "@ai-sdk/google-vertex";

// ── Provider Setup ────────────────────────────────────────────────────
// Dual-provider: Vertex AI for deep Google Cloud integration,
// fallback to Google AI Studio for local dev / hackathon demos.

const useVertex =
  !!process.env.GOOGLE_VERTEX_PROJECT &&
  !!process.env.GOOGLE_VERTEX_LOCATION;

const vertexProvider = useVertex
  ? createVertex({
      project: process.env.GOOGLE_VERTEX_PROJECT!,
      location: process.env.GOOGLE_VERTEX_LOCATION || "asia-south1",
      googleAuthOptions: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
        ? {
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
          }
        : undefined, // Falls back to Application Default Credentials (ADC)
    })
  : null;

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

// Unified model factory — prefers Vertex AI when configured
function getModel(modelId: string) {
  if (vertexProvider) return vertexProvider(modelId);
  return googleProvider(modelId);
}

// ── Agent Model Configurations ────────────────────────────────────────
// Multi-agent routing: fast classifier → specialized Gemini instances

/** Fast intent classifier — low latency, zero temperature */
export const routerModel = getModel("gemini-2.5-flash");

/** Creative explainer — high temperature for engaging explanations */
export const explainerModel = getModel("gemini-2.5-pro");

/** Grounded fact agent — zero temperature, strict accuracy */
export const groundedModel = getModel("gemini-2.5-pro");

/** Timeline generator — low temperature for structured output */
export const timelineModel = getModel("gemini-2.5-pro");

/** Eligibility assessor — zero temperature for legal accuracy */
export const eligibilityModel = getModel("gemini-2.5-pro");

/** Checklist generator — low temperature for actionable output */
export const checklistModel = getModel("gemini-2.5-pro");

// ── Agent Temperature Settings (applied at call site) ─────────────────
export const AGENT_TEMPERATURES = {
  router: 0,
  explainer: 0.9,
  grounded: 0,
  timeline: 0.2,
  eligibility: 0,
  checklist: 0.2,
} as const;

// ── Provider Detection ────────────────────────────────────────────────
export function isApiKeyConfigured(): boolean {
  // Vertex AI via ADC or service account
  if (useVertex) return true;
  // Google AI Studio via API key
  return (
    !!process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
    process.env.GOOGLE_GENERATIVE_AI_API_KEY.length > 0
  );
}

export function getProviderName(): string {
  if (useVertex) return "Google Vertex AI";
  if (isApiKeyConfigured()) return "Google AI Studio";
  return "Demo Mode";
}
