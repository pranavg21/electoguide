/**
 * React hook for Firebase Analytics event tracking.
 *
 * Provides memoized tracking functions that components can use to
 * log user interactions. Initializes analytics on mount and tracks
 * the initial page view and session start automatically.
 *
 * @module useAnalytics
 */

"use client";

import { useEffect, useCallback, useRef } from "react";
import { trackEvent, trackPageView, type AnalyticsEvent, type AnalyticsEventParams } from "@/lib/analytics";

/**
 * Hook that provides analytics tracking capabilities to components.
 *
 * @param language - The current UI language for context in events
 * @returns An object with a type-safe `track` function
 *
 * @example
 * ```tsx
 * const { track } = useAnalytics("en");
 * track("chip_selected", { chip_key: "form6", language: "en" });
 * ```
 */
export function useAnalytics(language: string) {
  const initialized = useRef(false);

  // Track initial session and page view once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    trackPageView("/", "ElectoGuide Bharat — Home");
    trackEvent("session_started", {
      language,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, [language]);

  const track = useCallback(
    <E extends AnalyticsEvent>(event: E, params: AnalyticsEventParams[E]) => {
      trackEvent(event, params);
    },
    [],
  );

  return { track };
}
