/**
 * Firebase Analytics event tracking module.
 *
 * Provides type-safe wrappers around Firebase Analytics `logEvent`.
 * All functions are fire-and-forget — failures are silently ignored
 * to ensure analytics never impacts user experience.
 *
 * @module analytics
 */

import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "./firebase";

/** Supported custom event names for ElectoGuide analytics. */
export type AnalyticsEvent =
  | "chat_message_sent"
  | "chip_selected"
  | "language_changed"
  | "theme_toggled"
  | "voice_input_used"
  | "tts_toggled"
  | "tool_rendered"
  | "feedback_submitted"
  | "evm_simulator_completed"
  | "form6_wizard_completed"
  | "checklist_completed"
  | "session_started";

/** Event parameter types for type-safe tracking. */
export interface AnalyticsEventParams {
  chat_message_sent: { message_length: number; language: string };
  chip_selected: { chip_key: string; language: string };
  language_changed: { from_language: string; to_language: string };
  theme_toggled: { theme: "light" | "dark" };
  voice_input_used: { language: string };
  tts_toggled: { enabled: boolean };
  tool_rendered: { tool_name: string };
  feedback_submitted: { rating: number; message_id: string };
  evm_simulator_completed: { steps_completed: number };
  form6_wizard_completed: { eligible: boolean };
  checklist_completed: { items_completed: number; total_items: number };
  session_started: { language: string; referrer: string };
}

/**
 * Tracks a typed analytics event. Fire-and-forget — never throws.
 *
 * @param event - The event name to track
 * @param params - Strongly-typed parameters for the event
 *
 * @example
 * ```ts
 * trackEvent("chip_selected", { chip_key: "form6", language: "en" });
 * ```
 */
export async function trackEvent<E extends AnalyticsEvent>(
  event: E,
  params: AnalyticsEventParams[E],
): Promise<void> {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, event, params);
    }
  } catch {
    // Analytics should never break the app
  }
}

/**
 * Tracks a page view event for SPA navigation.
 * @param pagePath - The page path, e.g. "/" or "/chat"
 * @param pageTitle - The page title
 */
export async function trackPageView(pagePath: string, pageTitle: string): Promise<void> {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, "page_view", {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  } catch {
    // Silent failure — analytics must never crash the app
  }
}
