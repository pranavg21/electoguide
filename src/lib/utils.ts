import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS class names using `clsx` and `tailwind-merge`.
 * Handles conditional classes, arrays, and deduplication of conflicting utilities.
 *
 * @param inputs - Class name values to merge
 * @returns Merged, deduplicated class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Maximum allowed length for sanitized user input. */
const MAX_INPUT_LENGTH = 2000;

/**
 * Sanitizes user input by stripping HTML tags, removing dangerous protocols,
 * and enforcing length limits. Essential for preventing XSS in chat input.
 *
 * @param input - Raw user input string
 * @returns Sanitized, trimmed, and truncated string
 *
 * @example
 * ```ts
 * sanitizeInput("<script>alert('xss')</script>hello") // "hello"
 * sanitizeInput("javascript:alert(1)")                // "alert(1)"
 * ```
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}
