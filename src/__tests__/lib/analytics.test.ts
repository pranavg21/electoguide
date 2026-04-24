import { trackEvent, trackPageView } from "@/lib/analytics";

// Mock the firebase module
jest.mock("@/lib/firebase", () => ({
  getFirebaseAnalytics: jest.fn().mockResolvedValue(null),
  isFirebaseConfigured: jest.fn().mockReturnValue(false),
}));

describe("Analytics — Event Tracking", () => {
  it("does not throw when analytics is unavailable", async () => {
    await expect(
      trackEvent("chat_message_sent", { message_length: 50, language: "en" })
    ).resolves.not.toThrow();
  });

  it("does not throw for page view tracking", async () => {
    await expect(
      trackPageView("/", "ElectoGuide Bharat")
    ).resolves.not.toThrow();
  });

  it("handles chip_selected event gracefully", async () => {
    await expect(
      trackEvent("chip_selected", { chip_key: "form6", language: "hi" })
    ).resolves.not.toThrow();
  });

  it("handles language_changed event gracefully", async () => {
    await expect(
      trackEvent("language_changed", { from_language: "en", to_language: "mr" })
    ).resolves.not.toThrow();
  });

  it("handles theme_toggled event gracefully", async () => {
    await expect(
      trackEvent("theme_toggled", { theme: "dark" })
    ).resolves.not.toThrow();
  });

  it("handles feedback_submitted event gracefully", async () => {
    await expect(
      trackEvent("feedback_submitted", { rating: 5, message_id: "msg-123" })
    ).resolves.not.toThrow();
  });

  it("handles all tool completion events", async () => {
    await expect(
      trackEvent("evm_simulator_completed", { steps_completed: 3 })
    ).resolves.not.toThrow();
    await expect(
      trackEvent("form6_wizard_completed", { eligible: true })
    ).resolves.not.toThrow();
    await expect(
      trackEvent("checklist_completed", { items_completed: 4, total_items: 5 })
    ).resolves.not.toThrow();
  });
});
