/**
 * Google Cloud Translation service for ElectoGuide.
 *
 * Provides server-side translation using the Google Cloud Translation API (v2).
 * Falls back to the client-side i18n static strings when the API is unavailable.
 *
 * @module google/translate
 * @see https://cloud.google.com/translate/docs/reference/rest
 */

import { TranslationServiceClient } from "@google-cloud/translate";
import { logger } from "@/lib/logger";

/** Supported BCP-47 language codes for the platform. */
export const SUPPORTED_LANGUAGES = ["en", "hi", "mr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Language display names for UI rendering. */
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
};

/** Singleton Translation client instance. */
let translationClient: TranslationServiceClient | null = null;

/**
 * Returns the Translation API client, lazily initialized.
 * @returns TranslationServiceClient or null if not configured.
 */
function getClient(): TranslationServiceClient | null {
  if (translationClient) return translationClient;

  const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    translationClient = new TranslationServiceClient({ projectId });
    return translationClient;
  } catch (error) {
    logger.warn("Translation client initialization failed", {
      component: "GoogleTranslate",
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Translates text from one language to another using Google Cloud Translation API.
 *
 * @param text - Source text to translate
 * @param targetLanguage - Target BCP-47 language code
 * @param sourceLanguage - Optional source language (auto-detected if omitted)
 * @returns Translated text, or original text on failure
 *
 * @example
 * ```ts
 * const hindi = await translateText("How to vote?", "hi");
 * // → "वोट कैसे करें?"
 * ```
 */
export async function translateText(
  text: string,
  targetLanguage: SupportedLanguage,
  sourceLanguage?: SupportedLanguage,
): Promise<string> {
  // Skip if already in target language
  if (sourceLanguage === targetLanguage) return text;

  const client = getClient();
  if (!client) {
    logger.debug("Translation skipped — client unavailable", { component: "GoogleTranslate" });
    return text;
  }

  const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  try {
    const [response] = await client.translateText({
      parent: `projects/${projectId}/locations/global`,
      contents: [text],
      targetLanguageCode: targetLanguage,
      sourceLanguageCode: sourceLanguage,
      mimeType: "text/plain",
    });

    const translated = response.translations?.[0]?.translatedText;
    if (translated) {
      logger.info("Translation completed", {
        component: "GoogleTranslate",
        sourceLanguage: sourceLanguage ?? "auto",
        targetLanguage,
        inputLength: text.length,
        outputLength: translated.length,
      });
      return translated;
    }

    return text;
  } catch (error) {
    logger.error("Translation API request failed", {
      component: "GoogleTranslate",
      targetLanguage,
      error: error instanceof Error ? error.message : String(error),
    });
    return text; // Graceful fallback
  }
}

/**
 * Detects the language of input text using Google Cloud Translation API.
 *
 * @param text - Text to detect language for
 * @returns Detected BCP-47 language code, or "en" as default
 */
export async function detectLanguage(text: string): Promise<SupportedLanguage> {
  const client = getClient();
  if (!client) return "en";

  const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  try {
    const [response] = await client.detectLanguage({
      parent: `projects/${projectId}/locations/global`,
      content: text,
      mimeType: "text/plain",
    });

    const detected = response.languages?.[0]?.languageCode;
    if (detected && SUPPORTED_LANGUAGES.includes(detected as SupportedLanguage)) {
      return detected as SupportedLanguage;
    }

    return "en";
  } catch {
    return "en";
  }
}
