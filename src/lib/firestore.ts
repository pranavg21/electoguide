/**
 * Firestore database operations for ElectoGuide.
 *
 * Provides structured data persistence for chat feedback, analytics summaries,
 * and session data. All operations gracefully degrade when Firestore is unavailable.
 *
 * @module firestore
 */

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getFirestoreDb } from "./firebase";

/** Feedback rating submitted by users for AI responses. */
export interface ChatFeedback {
  /** Unique message identifier */
  messageId: string;
  /** Rating from 1 (poor) to 5 (excellent) */
  rating: number;
  /** Optional text feedback */
  comment?: string;
  /** Language the session was conducted in */
  language: string;
  /** Tool that generated the response, if any */
  toolName?: string;
  /** Server-generated timestamp */
  createdAt?: ReturnType<typeof serverTimestamp>;
}

/** Aggregated analytics stored per-day in Firestore. */
export interface DailyAnalytics {
  date: string;
  totalSessions: number;
  totalMessages: number;
  languageBreakdown: Record<string, number>;
  toolUsage: Record<string, number>;
  averageRating: number;
  ratingCount: number;
}

/** Collection names as constants to prevent typos. */
const COLLECTIONS = {
  FEEDBACK: "feedback",
  ANALYTICS: "daily_analytics",
  SESSIONS: "sessions",
} as const;

/**
 * Submits user feedback for an AI response to Firestore.
 *
 * @param feedback - The feedback data to persist
 * @returns The document ID if successful, `null` otherwise
 *
 * @example
 * ```ts
 * await submitFeedback({
 *   messageId: "msg-123",
 *   rating: 5,
 *   language: "hi",
 *   toolName: "showEVMSimulator",
 * });
 * ```
 */
export async function submitFeedback(feedback: ChatFeedback): Promise<string | null> {
  try {
    const db = getFirestoreDb();
    if (!db) return null;

    const docRef = await addDoc(collection(db, COLLECTIONS.FEEDBACK), {
      ...feedback,
      createdAt: serverTimestamp(),
    });

    // Update daily aggregate
    await updateDailyAnalytics(feedback.rating, feedback.toolName);

    return docRef.id;
  } catch (error) {
    console.error("[Firestore] Failed to submit feedback:", error);
    return null;
  }
}

/**
 * Records a new chat session in Firestore for analytics.
 *
 * @param sessionId - Unique session identifier
 * @param language - The user's selected language
 * @returns `true` if the session was recorded successfully
 */
export async function recordSession(sessionId: string, language: string): Promise<boolean> {
  try {
    const db = getFirestoreDb();
    if (!db) return false;

    await setDoc(doc(db, COLLECTIONS.SESSIONS, sessionId), {
      language,
      startedAt: serverTimestamp(),
      messageCount: 0,
    });
    return true;
  } catch (error) {
    console.error("[Firestore] Failed to record session:", error);
    return false;
  }
}

/**
 * Increments the message count for an existing session.
 *
 * @param sessionId - The session to update
 */
export async function incrementMessageCount(sessionId: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    if (!db) return;
    await updateDoc(doc(db, COLLECTIONS.SESSIONS, sessionId), {
      messageCount: increment(1),
    });
  } catch {
    // Non-critical — silently ignore
  }
}

/**
 * Updates daily analytics aggregates in Firestore.
 * Creates the document if it doesn't exist for today.
 *
 * @param rating - The feedback rating to aggregate
 * @param toolName - The tool used, if any
 */
async function updateDailyAnalytics(rating: number, toolName?: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    if (!db) return;

    const today = new Date().toISOString().split("T")[0];
    const analyticsRef = doc(db, COLLECTIONS.ANALYTICS, today);
    const snap = await getDoc(analyticsRef);

    if (snap.exists()) {
      const updates: Record<string, unknown> = {
        ratingCount: increment(1),
        totalMessages: increment(1),
      };
      if (toolName) {
        updates[`toolUsage.${toolName}`] = increment(1);
      }
      await updateDoc(analyticsRef, updates);
    } else {
      const newDoc: DailyAnalytics = {
        date: today,
        totalSessions: 1,
        totalMessages: 1,
        languageBreakdown: {},
        toolUsage: toolName ? { [toolName]: 1 } : {},
        averageRating: rating,
        ratingCount: 1,
      };
      await setDoc(analyticsRef, newDoc);
    }
  } catch {
    // Non-critical — silently ignore analytics failures
  }
}
