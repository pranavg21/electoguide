/**
 * Google Cloud Text-to-Speech API endpoint.
 *
 * Converts AI response text to high-quality speech using Google Cloud TTS.
 * Falls back to a 501 status when the TTS service is not configured,
 * allowing the client to use browser-native Web Speech API instead.
 *
 * @route POST /api/tts
 */

import { NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/google/tts";
import { sanitizeInput } from "@/lib/utils";
import { logger } from "@/lib/logger";

/** Maximum text length for TTS synthesis (characters). */
const MAX_TTS_LENGTH = 1000;

/**
 * POST handler — synthesizes speech from text.
 *
 * @param request - Contains `{ text: string, language: string }` in body
 * @returns MP3 audio as base64 JSON, or error response
 */
export async function POST(request: Request) {
  try {
    const { text, language } = (await request.json()) as {
      text: string;
      language: string;
    };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const sanitized = sanitizeInput(text).slice(0, MAX_TTS_LENGTH);

    logger.info("TTS request received", {
      component: "TTS-API",
      language,
      textLength: sanitized.length,
    });

    const audioBase64 = await synthesizeSpeech(sanitized, language || "en");

    if (!audioBase64) {
      return NextResponse.json(
        { error: "TTS service unavailable. Use browser speech synthesis." },
        { status: 501 },
      );
    }

    return NextResponse.json({ audio: audioBase64, format: "mp3" });
  } catch (error) {
    logger.error("TTS API failed", {
      component: "TTS-API",
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Speech synthesis failed" },
      { status: 500 },
    );
  }
}
