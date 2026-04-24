/**
 * FeedbackButton — inline response rating component.
 *
 * Allows users to rate AI responses on a 1–5 scale. Submits ratings
 * to both Firebase Analytics and Cloud Firestore for aggregation.
 * Includes accessible labels and keyboard navigation.
 *
 * @module FeedbackButton
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { submitFeedback } from "@/lib/firestore";
import { trackEvent } from "@/lib/analytics";

/** Props for the FeedbackButton component. */
interface FeedbackButtonProps {
  /** Unique identifier for the message being rated */
  messageId: string;
  /** Current language for analytics context */
  language: string;
  /** Tool that generated the response, if applicable */
  toolName?: string;
}

/**
 * Inline feedback widget displayed below AI responses.
 * Allows 1-click thumbs up/down, then reveals a 1-5 star rating.
 */
export function FeedbackButton({ messageId, language, toolName }: FeedbackButtonProps): React.JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleQuickFeedback = useCallback(
    (positive: boolean) => {
      const rating = positive ? 5 : 2;
      setSubmitted(true);
      submitFeedback({ messageId, rating, language, toolName });
      trackEvent("feedback_submitted", { rating, message_id: messageId });
    },
    [messageId, language, toolName],
  );

  const handleStarRating = useCallback(
    (rating: number) => {
      setSubmitted(true);
      setShowStars(false);
      submitFeedback({ messageId, rating, language, toolName });
      trackEvent("feedback_submitted", { rating, message_id: messageId });
    },
    [messageId, language, toolName],
  );

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1.5 text-xs text-emerald-500 dark:text-emerald-400"
        role="status"
        aria-live="polite"
      >
        <Star className="h-3 w-3 fill-current" />
        <span>Thanks for your feedback!</span>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Rate this response">
      <AnimatePresence mode="wait">
        {showStars ? (
          <motion.div
            key="stars"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-0.5"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-0.5 rounded transition-colors hover:bg-amber-500/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400"
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <Star
                  className={`h-3.5 w-3.5 transition-colors ${
                    star <= hoveredStar
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="thumbs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1"
          >
            <button
              onClick={() => handleQuickFeedback(true)}
              className="p-1 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-400"
              aria-label="Helpful response"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleQuickFeedback(false)}
              className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-400"
              aria-label="Unhelpful response"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setShowStars(true)}
              className="ml-1 text-[10px] text-slate-400 hover:text-slate-300 underline decoration-dotted underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-400"
              aria-label="Show detailed rating options"
            >
              Rate
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
