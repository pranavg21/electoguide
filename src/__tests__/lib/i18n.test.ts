import { t, getChips, LANGUAGES } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

describe("i18n — Language Configuration", () => {
  it("has exactly 3 languages configured", () => {
    expect(LANGUAGES).toHaveLength(3);
  });

  it("includes English, Hindi, and Marathi", () => {
    const codes = LANGUAGES.map(l => l.code);
    expect(codes).toEqual(["en", "hi", "mr"]);
  });

  it("has speech codes for all languages", () => {
    LANGUAGES.forEach(l => {
      expect(l.speechCode).toBeTruthy();
      expect(l.speechCode).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    });
  });
});

describe("i18n — Translation Strings", () => {
  const allLangs: Language[] = ["en", "hi", "mr"];

  allLangs.forEach(lang => {
    describe(`Language: ${lang}`, () => {
      const strings = t(lang);

      it("has all required translation keys", () => {
        expect(strings.appName).toBeTruthy();
        expect(strings.welcomeTitle).toBeTruthy();
        expect(strings.welcomeText).toBeTruthy();
        expect(strings.inputPlaceholder).toBeTruthy();
        expect(strings.disclaimer).toBeTruthy();
        expect(strings.chipEligible).toBeTruthy();
        expect(strings.chipForm6).toBeTruthy();
        expect(strings.chipEVM).toBeTruthy();
        expect(strings.chipDates).toBeTruthy();
        expect(strings.chipChecklist).toBeTruthy();
      });

      it("has non-empty string values", () => {
        Object.values(strings).forEach(value => {
          expect(typeof value).toBe("string");
          expect(value.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it("falls back to English for unknown language", () => {
    // Type assertion to simulate bad input
    const strings = t("xx" as Language);
    expect(strings.appName).toBe("ElectoGuide Bharat");
  });
});

describe("i18n — Chip Generation", () => {
  it("returns exactly 5 chips for every language", () => {
    const allLangs: Language[] = ["en", "hi", "mr"];
    allLangs.forEach(lang => {
      const chips = getChips(lang);
      expect(chips).toHaveLength(5);
    });
  });

  it("returns chips with label and key properties", () => {
    const chips = getChips("en");
    chips.forEach(chip => {
      expect(chip).toHaveProperty("label");
      expect(chip).toHaveProperty("key");
      expect(typeof chip.label).toBe("string");
      expect(typeof chip.key).toBe("string");
    });
  });

  it("has expected English chip keys", () => {
    const chips = getChips("en");
    const keys = chips.map(c => c.key);
    expect(keys).toEqual(["eligible", "form6", "evm", "dates", "checklist"]);
  });
});
