/**
 * Application-wide constants for ElectoGuide Bharat.
 *
 * Centralizes all magic numbers, configuration values, and feature flags
 * used across the platform. Prevents scattered literals and improves
 * maintainability.
 *
 * @module constants
 */

// ── Rate Limiting ─────────────────────────────────────────────────────
/** Duration of the rate limit window in milliseconds. */
export const RATE_LIMIT_WINDOW_MS = 60_000;
/** Maximum API requests allowed per rate limit window. */
export const MAX_REQUESTS_PER_WINDOW = 30;

// ── Chat Constraints ──────────────────────────────────────────────────
/** Maximum character length for a single user message. */
export const MAX_MESSAGE_LENGTH = 2000;
/** Maximum number of messages in a single conversation. */
export const MAX_CONVERSATION_LENGTH = 50;
/** Maximum text length for TTS synthesis. */
export const MAX_TTS_LENGTH = 1000;
/** Maximum text length for translation requests. */
export const MAX_TRANSLATE_LENGTH = 5000;

// ── UI Configuration ──────────────────────────────────────────────────
/** Number of suggestion chips displayed on the welcome screen. */
export const CHIP_COUNT = 5;
/** Auto-scroll debounce delay in milliseconds. */
export const SCROLL_DEBOUNCE_MS = 100;
/** Animation duration for component entrance effects (seconds). */
export const ENTRANCE_ANIMATION_DURATION = 0.4;
/** Animation stagger delay between sequential items (seconds). */
export const STAGGER_DELAY = 0.08;

// ── Firebase Collection Names ─────────────────────────────────────────
/** Firestore collection for user feedback on AI responses. */
export const COLLECTION_FEEDBACK = "feedback";
/** Firestore collection for daily analytics aggregates. */
export const COLLECTION_ANALYTICS = "daily_analytics";
/** Firestore collection for chat session tracking. */
export const COLLECTION_SESSIONS = "sessions";

// ── Feature Flags ─────────────────────────────────────────────────────
/** Whether the Google Cloud TTS API is enabled (vs browser Web Speech API). */
export const ENABLE_CLOUD_TTS = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
/** Whether the Google Cloud Translation API is enabled. */
export const ENABLE_CLOUD_TRANSLATE = Boolean(process.env.GOOGLE_CLOUD_PROJECT);
/** Whether Firebase Analytics is enabled. */
export const ENABLE_ANALYTICS = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

// ── SEO & Metadata ────────────────────────────────────────────────────
/** Application name used in metadata and branding. */
export const APP_NAME = "ElectoGuide Bharat";
/** Application tagline. */
export const APP_TAGLINE = "AI Election Education Assistant";
/** Application description for meta tags. */
export const APP_DESCRIPTION =
  "An interactive AI assistant that educates Indian citizens on ECI processes, voter registration (Form 6), EVM voting, and election phases.";
