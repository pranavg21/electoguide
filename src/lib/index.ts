/**
 * Library barrel export.
 *
 * Re-exports all shared utilities, services, and types from the `lib` module
 * for clean, centralized imports throughout the application.
 *
 * @module lib
 *
 * @example
 * ```ts
 * import { cn, sanitizeInput, logger, trackEvent } from "@/lib";
 * ```
 */

export { cn, sanitizeInput } from "./utils";
export { logger } from "./logger";
export { trackEvent, trackPageView, type AnalyticsEvent, type AnalyticsEventParams } from "./analytics";
export { isFirebaseConfigured, getFirebaseApp, getFirebaseAnalytics, getFirestoreDb } from "./firebase";
export { submitFeedback, recordSession, incrementMessageCount, type ChatFeedback, type DailyAnalytics } from "./firestore";
export { type Language, LANGUAGES, t, getChips } from "./i18n";
