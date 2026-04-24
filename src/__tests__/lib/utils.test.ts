import { sanitizeInput } from "@/lib/utils";

describe("Utils — sanitizeInput", () => {
  it("strips HTML tags", () => {
    expect(sanitizeInput("<script>alert('xss')</script>hello")).toBe("alert('xss')hello");
    expect(sanitizeInput("<b>bold</b>")).toBe("bold");
    expect(sanitizeInput("<div class='x'>content</div>")).toBe("content");
  });

  it("removes javascript: protocol", () => {
    expect(sanitizeInput("javascript:alert(1)")).not.toContain("javascript:");
  });

  it("trims whitespace", () => {
    expect(sanitizeInput("  hello world  ")).toBe("hello world");
  });

  it("truncates to max length", () => {
    const longString = "a".repeat(3000);
    expect(sanitizeInput(longString).length).toBeLessThanOrEqual(2000);
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("handles mixed content safely", () => {
    const result = sanitizeInput('<img src="x" onerror="alert(1)">Valid text');
    expect(result).toBe("Valid text");
    expect(result).not.toContain("<img");
  });
});
