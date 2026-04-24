import {
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS_PER_WINDOW,
  MAX_MESSAGE_LENGTH,
  MAX_CONVERSATION_LENGTH,
  CHIP_COUNT,
  APP_NAME,
  APP_DESCRIPTION,
  COLLECTION_FEEDBACK,
  COLLECTION_ANALYTICS,
  COLLECTION_SESSIONS,
} from "@/lib/constants";

describe("Constants — Application Configuration", () => {
  it("has sensible rate limiting defaults", () => {
    expect(RATE_LIMIT_WINDOW_MS).toBe(60_000);
    expect(MAX_REQUESTS_PER_WINDOW).toBe(30);
  });

  it("has message length constraints", () => {
    expect(MAX_MESSAGE_LENGTH).toBeGreaterThan(0);
    expect(MAX_MESSAGE_LENGTH).toBeLessThanOrEqual(5000);
    expect(MAX_CONVERSATION_LENGTH).toBeGreaterThan(0);
  });

  it("has correct chip count", () => {
    expect(CHIP_COUNT).toBe(5);
  });

  it("has non-empty app metadata", () => {
    expect(APP_NAME).toBe("ElectoGuide Bharat");
    expect(APP_DESCRIPTION).toContain("ECI");
    expect(APP_DESCRIPTION.length).toBeGreaterThan(50);
  });

  it("has unique Firestore collection names", () => {
    const collections = [COLLECTION_FEEDBACK, COLLECTION_ANALYTICS, COLLECTION_SESSIONS];
    const unique = new Set(collections);
    expect(unique.size).toBe(collections.length);
  });
});
