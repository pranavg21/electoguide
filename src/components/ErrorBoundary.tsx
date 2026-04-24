/**
 * Error Boundary component for graceful error handling.
 *
 * Catches JavaScript errors anywhere in its child component tree,
 * logs them via the structured logger, and renders a fallback UI
 * instead of crashing the entire application.
 *
 * @module ErrorBoundary
 */

"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/** Props accepted by the ErrorBoundary component. */
interface ErrorBoundaryProps {
  /** Child components to protect from crashes. */
  children: ReactNode;
  /** Optional custom fallback UI renderer. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

/** Internal state tracked by the ErrorBoundary. */
interface ErrorBoundaryState {
  /** Whether an error has been caught. */
  hasError: boolean;
  /** The caught error instance. */
  error: Error | null;
}

/**
 * React Error Boundary that prevents component tree crashes.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <ChatInterface />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Structured error logging for Cloud Logging
    const errorLog = {
      severity: "ERROR",
      message: "React Error Boundary caught error",
      timestamp: new Date().toISOString(),
      component: "ErrorBoundary",
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    };
    console.error(JSON.stringify(errorLog));
  }

  /** Resets the error state to allow retry. */
  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="p-4 rounded-full bg-red-500/10 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
            An unexpected error occurred. This has been logged for our team to investigate.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-500/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            aria-label="Try again"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
