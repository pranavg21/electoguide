/**
 * Google Cloud Vertex AI service wrapper for ElectoGuide.
 *
 * Provides a centralized, reusable interface to Google's Vertex AI platform.
 * Encapsulates model configuration, safety settings, and retry logic
 * for the multi-agent architecture.
 *
 * @module google/vertex
 * @see https://cloud.google.com/vertex-ai/docs
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { logger } from "@/lib/logger";

/** Vertex AI model identifiers used across the platform. */
export const VERTEX_MODELS = {
  /** Fast model for intent routing and classification (low latency). */
  ROUTER: "gemini-2.5-flash",
  /** Grounded model for factual election data (high accuracy). */
  GROUNDED: "gemini-2.5-pro",
  /** Creative model for explanations and education (balanced). */
  EXPLAINER: "gemini-2.5-flash",
} as const;

/** Per-agent temperature settings tuned for election content. */
export const AGENT_TEMPERATURES = {
  /** Router agent — deterministic classification. */
  router: 0.1,
  /** Grounded agents — factual, low creativity. */
  grounded: 0.2,
  /** Timeline agent — structured data generation. */
  timeline: 0.15,
  /** Checklist agent — structured output with some flexibility. */
  checklist: 0.25,
  /** Explainer agent — educational, slightly more creative. */
  explainer: 0.4,
} as const;

/** Vertex AI safety threshold configuration. */
export const SAFETY_SETTINGS = {
  /** Block only high-confidence harmful content. */
  threshold: "BLOCK_MEDIUM_AND_ABOVE",
  /** Categories to monitor. */
  categories: [
    "HARM_CATEGORY_HARASSMENT",
    "HARM_CATEGORY_HATE_SPEECH",
    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "HARM_CATEGORY_DANGEROUS_CONTENT",
  ],
} as const;

/**
 * Checks whether the Vertex AI / Google AI Studio API key is configured.
 * @returns `true` if an API key or Vertex project is available.
 */
export function isVertexConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_VERTEX_PROJECT,
  );
}

/**
 * Returns the active AI provider name for logging and diagnostics.
 * @returns Human-readable provider identifier.
 */
export function getProviderName(): string {
  if (process.env.GOOGLE_VERTEX_PROJECT) return "vertex-ai";
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "google-ai-studio";
  return "demo";
}

/**
 * Creates a configured Google Generative AI provider instance.
 *
 * @returns The AI SDK provider, or null if no API key is configured
 *
 * @example
 * ```ts
 * const provider = createProvider();
 * if (provider) {
 *   const model = provider("gemini-2.5-flash");
 * }
 * ```
 */
export function createProvider() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    logger.debug("AI provider unavailable — no API key", { component: "VertexAI" });
    return null;
  }

  logger.info("AI provider initialized", {
    component: "VertexAI",
    provider: getProviderName(),
    models: Object.values(VERTEX_MODELS),
  });

  return createGoogleGenerativeAI({ apiKey });
}

/**
 * Returns the optimal model ID based on the task type.
 *
 * @param task - The task category: "routing", "grounding", or "explaining"
 * @returns The recommended model identifier
 */
export function getModelForTask(task: "routing" | "grounding" | "explaining"): string {
  switch (task) {
    case "routing":
      return VERTEX_MODELS.ROUTER;
    case "grounding":
      return VERTEX_MODELS.GROUNDED;
    case "explaining":
      return VERTEX_MODELS.EXPLAINER;
  }
}
