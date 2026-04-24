/**
 * Google Cloud services barrel export.
 *
 * Re-exports all Google Cloud service integrations for the platform.
 * Includes Translation API, Text-to-Speech API, and Vertex AI services.
 *
 * @module google
 *
 * @example
 * ```ts
 * import { translateText, synthesizeSpeech, isVertexConfigured } from "@/lib/google";
 * ```
 */

export { translateText, detectLanguage, SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type SupportedLanguage } from "./translate";
export { synthesizeSpeech, listVoices } from "./tts";
export {
  isVertexConfigured,
  getProviderName,
  createProvider,
  getModelForTask,
  VERTEX_MODELS,
  AGENT_TEMPERATURES,
  SAFETY_SETTINGS,
} from "./vertex";
