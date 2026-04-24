/**
 * Google Cloud Translation API endpoint.
 *
 * Provides server-side translation for dynamic AI response content
 * using the Google Cloud Translation API. Falls back gracefully
 * when the service is unavailable.
 *
 * @route POST /api/translate
 */

import { NextResponse } from "next/server";
import { translateText, detectLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/google/translate";
import { sanitizeInput } from "@/lib/utils";
import { logger } from "@/lib/logger";

/** Maximum text length for translation (characters). */
const MAX_TRANSLATE_LENGTH = 5000;

/**
 * POST handler — translates text between supported languages.
 *
 * @param request - Contains `{ text: string, targetLanguage: string, sourceLanguage?: string }` in body
 * @returns Translated text JSON or error response
 */
export async function POST(request: Request) {
  try {
    const { text, targetLanguage, sourceLanguage } = (await request.json()) as {
      text: string;
      targetLanguage: string;
      sourceLanguage?: string;
    };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!SUPPORTED_LANGUAGES.includes(targetLanguage as SupportedLanguage)) {
      return NextResponse.json(
        { error: `Unsupported language: ${targetLanguage}. Supported: ${SUPPORTED_LANGUAGES.join(", ")}` },
        { status: 400 },
      );
    }

    const sanitized = sanitizeInput(text).slice(0, MAX_TRANSLATE_LENGTH);

    logger.info("Translation request received", {
      component: "Translate-API",
      targetLanguage,
      sourceLanguage: sourceLanguage ?? "auto",
      textLength: sanitized.length,
    });

    const translated = await translateText(
      sanitized,
      targetLanguage as SupportedLanguage,
      sourceLanguage as SupportedLanguage | undefined,
    );

    const detectedLang = sourceLanguage ?? await detectLanguage(sanitized);

    return NextResponse.json({
      translatedText: translated,
      sourceLanguage: detectedLang,
      targetLanguage,
    });
  } catch (error) {
    logger.error("Translation API failed", {
      component: "Translate-API",
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 },
    );
  }
}
