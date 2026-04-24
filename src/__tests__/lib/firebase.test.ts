import { isFirebaseConfigured } from "@/lib/firebase";

describe("Firebase — Configuration", () => {
  it("returns false when env vars are not set", () => {
    expect(isFirebaseConfigured()).toBe(false);
  });

  it("returns false when only partial config is available", () => {
    const original = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-key";
    // Still missing projectId
    expect(isFirebaseConfigured()).toBe(false);
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = original;
  });
});
