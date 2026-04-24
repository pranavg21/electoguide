/**
 * Google Cloud Text-to-Speech service for ElectoGuide.
 *
 * Provides server-side speech synthesis using the Google Cloud TTS API.
 * Used to generate high-quality audio for AI responses when the browser's
 * built-in Web Speech API is insufficient or unavailable.
 *
 * @module google/tts
 * @see https://cloud.google.com/text-to-speech/docs/reference/rest
 */

import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import { logger } from "@/lib/logger";

type SynthesisInput = protos.google.cloud.texttospeech.v1.ISynthesisInput;
type VoiceSelectionParams = protos.google.cloud.texttospeech.v1.IVoiceSelectionParams;
type AudioConfig = protos.google.cloud.texttospeech.v1.IAudioConfig;

/** Voice configuration per supported language. */
const VOICE_CONFIG: Record<string, VoiceSelectionParams> = {
  en: { languageCode: "en-IN", name: "en-IN-Wavenet-D", ssmlGender: "FEMALE" },
  hi: { languageCode: "hi-IN", name: "hi-IN-Wavenet-A", ssmlGender: "FEMALE" },
  mr: { languageCode: "mr-IN", name: "mr-IN-Wavenet-A", ssmlGender: "FEMALE" },
};

/** Default audio encoding configuration. */
const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  audioEncoding: "MP3",
  speakingRate: 1.0,
  pitch: 0.0,
  effectsProfileId: ["handset-class-device"],
};

/** Singleton TTS client instance. */
let ttsClient: TextToSpeechClient | null = null;

/**
 * Returns the TTS API client, lazily initialized.
 * @returns TextToSpeechClient or null if not configured.
 */
function getClient(): TextToSpeechClient | null {
  if (ttsClient) return ttsClient;

  try {
    ttsClient = new TextToSpeechClient();
    return ttsClient;
  } catch (error) {
    logger.warn("TTS client initialization failed", {
      component: "GoogleTTS",
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Synthesizes speech from text using Google Cloud Text-to-Speech API.
 *
 * @param text - The text content to convert to speech
 * @param language - BCP-47 language code ("en", "hi", "mr")
 * @returns Base64-encoded MP3 audio, or null on failure
 *
 * @example
 * ```ts
 * const audio = await synthesizeSpeech("How to vote in Indian elections?", "en");
 * if (audio) {
 *   // Send as audio/mp3 response
 * }
 * ```
 */
export async function synthesizeSpeech(
  text: string,
  language: string,
): Promise<string | null> {
  const client = getClient();
  if (!client) {
    logger.debug("TTS skipped — client unavailable", { component: "GoogleTTS" });
    return null;
  }

  const voice = VOICE_CONFIG[language] ?? VOICE_CONFIG.en;
  const input: SynthesisInput = { text };

  try {
    const [response] = await client.synthesizeSpeech({
      input,
      voice,
      audioConfig: DEFAULT_AUDIO_CONFIG,
    });

    if (response.audioContent) {
      const audioBase64 = Buffer.from(response.audioContent as Uint8Array).toString("base64");
      logger.info("Speech synthesized", {
        component: "GoogleTTS",
        language,
        inputLength: text.length,
        audioSize: audioBase64.length,
      });
      return audioBase64;
    }

    return null;
  } catch (error) {
    logger.error("TTS synthesis failed", {
      component: "GoogleTTS",
      language,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Lists available voices for a given language.
 *
 * @param languageCode - BCP-47 language code to filter by
 * @returns Array of available voice names
 */
export async function listVoices(languageCode: string): Promise<string[]> {
  const client = getClient();
  if (!client) return [];

  try {
    const [response] = await client.listVoices({ languageCode });
    return (response.voices ?? [])
      .map((v) => v.name)
      .filter((name): name is string => Boolean(name));
  } catch {
    return [];
  }
}
