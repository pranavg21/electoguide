/**
 * Firebase configuration and initialization module.
 *
 * Provides centralized Firebase app, Analytics, and Firestore instances
 * for the ElectoGuide platform. Uses environment-based configuration
 * with graceful degradation when Firebase is unavailable.
 *
 * @module firebase
 * @see https://firebase.google.com/docs/web/setup
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase project configuration.
 * Values are injected from environment variables at build time.
 * Falls back to empty strings — Firebase features gracefully degrade.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

/** Singleton Firebase app instance. Reuses existing app if already initialized. */
let app: FirebaseApp | null = null;

/** Singleton Analytics instance. Null when running server-side or unsupported. */
let analytics: Analytics | null = null;

/** Singleton Firestore instance. Null when Firebase is not configured. */
let db: Firestore | null = null;

/**
 * Checks whether Firebase is properly configured via environment variables.
 * @returns `true` if both API key and project ID are present.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

/**
 * Returns the Firebase app singleton, initializing it on first call.
 * Returns `null` if Firebase is not configured.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

/**
 * Returns the Firebase Analytics singleton.
 * Initializes lazily and only in browser environments where Analytics is supported.
 * @returns A promise resolving to the Analytics instance or `null`.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;

  const supported = await isAnalyticsSupported();
  if (!supported) return null;

  analytics = getAnalytics(firebaseApp);
  return analytics;
}

/**
 * Returns the Firestore singleton for database operations.
 * @returns The Firestore instance or `null` if Firebase is not configured.
 */
export function getFirestoreDb(): Firestore | null {
  if (db) return db;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  db = getFirestore(firebaseApp);
  return db;
}
