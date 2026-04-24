"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

/**
 * Global error boundary for the application.
 * Catches unhandled exceptions and displays a user-friendly fallback UI.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    // In a production app, log this to an error reporting service (e.g. Sentry)
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Something went wrong</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-medium py-2 px-6 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
