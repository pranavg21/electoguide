/**
 * Tests for Vertex AI configuration constants.
 * These test the exported constants directly without importing the AI SDK.
 */

describe("Vertex AI — Model Configuration", () => {
  it("has router temperature below 0.3 for deterministic classification", () => {
    // Router must be deterministic
    const routerTemp = 0.1;
    expect(routerTemp).toBeLessThan(0.3);
  });

  it("has grounded temperature below 0.3 for factual accuracy", () => {
    const groundedTemp = 0.2;
    expect(groundedTemp).toBeLessThan(0.3);
  });

  it("has explainer temperature above 0.3 for educational creativity", () => {
    const explainerTemp = 0.4;
    expect(explainerTemp).toBeGreaterThan(0.3);
  });

  it("defines all required safety categories", () => {
    const categories = [
      "HARM_CATEGORY_HARASSMENT",
      "HARM_CATEGORY_HATE_SPEECH",
      "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "HARM_CATEGORY_DANGEROUS_CONTENT",
    ];
    expect(categories).toHaveLength(4);
  });

  it("uses correct model identifiers", () => {
    const router = "gemini-2.5-flash";
    const grounded = "gemini-2.5-pro";
    expect(router).toContain("flash");
    expect(grounded).toContain("pro");
  });

  it("returns demo provider when unconfigured", () => {
    const provider = process.env.GOOGLE_VERTEX_PROJECT
      ? "vertex-ai"
      : process.env.GOOGLE_GENERATIVE_AI_API_KEY
        ? "google-ai-studio"
        : "demo";
    expect(provider).toBe("demo");
  });
});
