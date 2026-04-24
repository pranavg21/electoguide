import {
  epicNumberSchema,
  mobileNumberSchema,
  aadhaarSchema,
  form6DataSchema,
  constituencyPhaseSchema,
  evmStepSchema,
  evmSimulatorOutputSchema,
  constituencyRoadmapSchema,
  factSchema,
  sourceSchema,
  factCardOutputSchema,
  checklistItemSchema,
  checklistOutputSchema,
  form6WizardOutputSchema,
} from "@/lib/schemas";

describe("Schema Validation — EPIC Number", () => {
  it("accepts valid EPIC format (ABC1234567)", () => {
    expect(epicNumberSchema.safeParse("ABC1234567").success).toBe(true);
  });

  it("rejects lowercase letters", () => {
    expect(epicNumberSchema.safeParse("abc1234567").success).toBe(false);
  });

  it("rejects wrong digit count", () => {
    expect(epicNumberSchema.safeParse("ABC123456").success).toBe(false);
    expect(epicNumberSchema.safeParse("ABC12345678").success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(epicNumberSchema.safeParse("").success).toBe(false);
  });
});

describe("Schema Validation — Mobile Number", () => {
  it("accepts valid Indian mobile (9876543210)", () => {
    expect(mobileNumberSchema.safeParse("9876543210").success).toBe(true);
  });

  it("rejects numbers starting with 0-5", () => {
    expect(mobileNumberSchema.safeParse("0123456789").success).toBe(false);
    expect(mobileNumberSchema.safeParse("5123456789").success).toBe(false);
  });

  it("rejects wrong length", () => {
    expect(mobileNumberSchema.safeParse("987654321").success).toBe(false);
    expect(mobileNumberSchema.safeParse("98765432101").success).toBe(false);
  });
});

describe("Schema Validation — Aadhaar", () => {
  it("accepts valid 12-digit Aadhaar", () => {
    expect(aadhaarSchema.safeParse("123456789012").success).toBe(true);
  });

  it("rejects non-digits", () => {
    expect(aadhaarSchema.safeParse("12345678901a").success).toBe(false);
  });

  it("rejects wrong length", () => {
    expect(aadhaarSchema.safeParse("12345678901").success).toBe(false);
  });
});

describe("Schema Validation — Form6Data (strict)", () => {
  const validForm6 = {
    fullName: "Rahul Sharma",
    fatherName: "Suresh Sharma",
    dob: "2000-01-15",
    gender: "male" as const,
    mobile: "9876543210",
    state: "Maharashtra",
    district: "Mumbai",
    assemblyConstituency: "Worli",
    address: "123 Marine Drive, Mumbai",
    pincode: "400001",
    idProofType: "aadhaar" as const,
  };

  it("accepts valid Form 6 data", () => {
    expect(form6DataSchema.safeParse(validForm6).success).toBe(true);
  });

  it("rejects extra unknown fields (strict mode)", () => {
    const result = form6DataSchema.safeParse({ ...validForm6, hackField: "injected" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid gender", () => {
    const result = form6DataSchema.safeParse({ ...validForm6, gender: "unknown" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid pincode", () => {
    const result = form6DataSchema.safeParse({ ...validForm6, pincode: "12345" });
    expect(result.success).toBe(false);
  });
});

describe("Schema Validation — Constituency Phase (strict)", () => {
  it("accepts valid phase", () => {
    const result = constituencyPhaseSchema.safeParse({
      id: "phase-1", title: "Notification", description: "Phase 1",
      status: "completed",
    });
    expect(result.success).toBe(true);
  });

  it("rejects extra fields (strict)", () => {
    const result = constituencyPhaseSchema.safeParse({
      id: "p1", title: "T", description: "D", extra: "bad",
    });
    expect(result.success).toBe(false);
  });

  it("defaults status to upcoming", () => {
    const result = constituencyPhaseSchema.safeParse({
      id: "p1", title: "T", description: "D",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("upcoming");
    }
  });
});

describe("Schema Validation — EVM Simulator (strict)", () => {
  it("accepts valid EVM output", () => {
    const result = evmSimulatorOutputSchema.safeParse({
      title: "EVM Voting", description: "How to vote",
      steps: [{ id: "s1", title: "Enter", description: "Enter booth" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects extra fields on steps (strict)", () => {
    const result = evmStepSchema.safeParse({
      id: "s1", title: "T", description: "D", hack: "injected",
    });
    expect(result.success).toBe(false);
  });
});

describe("Schema Validation — FactCard (strict)", () => {
  it("accepts valid fact card", () => {
    const result = factCardOutputSchema.safeParse({
      title: "ECI Facts", summary: "Key facts",
      facts: [{ label: "Founded", value: "1950" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects extra fields on facts (strict)", () => {
    const result = factSchema.safeParse({
      label: "L", value: "V", extra: "bad",
    });
    expect(result.success).toBe(false);
  });

  it("validates source URLs", () => {
    const result = sourceSchema.safeParse({ title: "ECI", url: "not-a-url" });
    expect(result.success).toBe(false);
  });
});

describe("Schema Validation — Checklist (strict)", () => {
  it("accepts valid checklist", () => {
    const result = checklistOutputSchema.safeParse({
      title: "Prep", description: "Get ready",
      items: [{ id: "i1", text: "Check ID" }],
    });
    expect(result.success).toBe(true);
  });

  it("defaults priority to medium", () => {
    const result = checklistItemSchema.safeParse({
      id: "i1", text: "Item",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priority).toBe("medium");
    }
  });
});

describe("Schema Validation — Constituency Roadmap (strict)", () => {
  it("accepts valid roadmap", () => {
    const result = constituencyRoadmapSchema.safeParse({
      title: "Roadmap", description: "Steps",
      steps: [{ id: "s1", title: "Step 1", description: "First" }],
    });
    expect(result.success).toBe(true);
  });
});

describe("Schema Validation — Form6 Wizard Output (strict)", () => {
  it("accepts valid wizard output", () => {
    const result = form6WizardOutputSchema.safeParse({
      state: "Maharashtra",
      eligible: true,
      summary: "You are eligible",
      requirements: [{
        id: "r1", label: "Citizenship", description: "Must be Indian citizen",
        met: true, category: "citizenship",
      }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category", () => {
    const result = form6WizardOutputSchema.safeParse({
      state: "MH", eligible: true, summary: "S",
      requirements: [{
        id: "r1", label: "L", description: "D",
        met: true, category: "invalid_category",
      }],
    });
    expect(result.success).toBe(false);
  });
});
