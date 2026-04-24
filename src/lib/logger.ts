/**
 * Structured logging utility for the ElectoGuide platform.
 *
 * Provides consistent, structured log output with severity levels,
 * timestamps, and contextual metadata. Integrates with Google Cloud
 * Logging when deployed on Cloud Run via structured JSON stdout.
 *
 * @module logger
 * @see https://cloud.google.com/logging/docs/structured-logging
 */

/** Log severity levels aligned with Google Cloud Logging. */
type LogSeverity = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";

/** Structured log entry format compatible with Google Cloud Logging. */
interface LogEntry {
  severity: LogSeverity;
  message: string;
  timestamp: string;
  component?: string;
  /** Additional metadata fields */
  [key: string]: unknown;
}

/**
 * Writes a structured log entry to stdout (captured by Cloud Logging on GCR).
 *
 * @param severity - The log severity level
 * @param message - Human-readable log message
 * @param meta - Additional key-value metadata
 */
function writeLog(severity: LogSeverity, message: string, meta?: Record<string, unknown>): void {
  const entry: LogEntry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  // Cloud Logging parses JSON lines from stdout automatically
  if (severity === "ERROR" || severity === "CRITICAL") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

/** Logger with methods for each severity level. */
export const logger = {
  /**
   * Debug-level log — verbose information for development.
   * @param message - Log message
   * @param meta - Additional metadata
   */
  debug: (message: string, meta?: Record<string, unknown>) =>
    writeLog("DEBUG", message, meta),

  /**
   * Info-level log — routine operational messages.
   * @param message - Log message
   * @param meta - Additional metadata
   */
  info: (message: string, meta?: Record<string, unknown>) =>
    writeLog("INFO", message, meta),

  /**
   * Warning-level log — unexpected but non-critical issues.
   * @param message - Log message
   * @param meta - Additional metadata
   */
  warn: (message: string, meta?: Record<string, unknown>) =>
    writeLog("WARNING", message, meta),

  /**
   * Error-level log — failures that affect functionality.
   * @param message - Log message
   * @param meta - Additional metadata
   */
  error: (message: string, meta?: Record<string, unknown>) =>
    writeLog("ERROR", message, meta),

  /**
   * Critical-level log — system-wide failures requiring immediate attention.
   * @param message - Log message
   * @param meta - Additional metadata
   */
  critical: (message: string, meta?: Record<string, unknown>) =>
    writeLog("CRITICAL", message, meta),
} as const;
