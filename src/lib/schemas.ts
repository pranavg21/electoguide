import { z } from "zod";

// ── Indian Voter ID (EPIC) ────────────────────────────────────────────
export const epicNumberSchema = z
  .string()
  .regex(/^[A-Z]{3}\d{7}$/, "EPIC number must be 3 uppercase letters followed by 7 digits (e.g., ABC1234567)");

// ── Indian Mobile Number ──────────────────────────────────────────────
export const mobileNumberSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

// ── Aadhaar Number ────────────────────────────────────────────────────
export const aadhaarSchema = z
  .string()
  .regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits");

// ── Form 6 (New Voter Registration) ───────────────────────────────────
export const form6DataSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  fatherName: z.string().min(2, "Father's/Mother's name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  mobile: mobileNumberSchema,
  aadhaar: aadhaarSchema.optional(),
  epicNumber: epicNumberSchema.optional(),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  assemblyConstituency: z.string().min(1, "Assembly constituency is required"),
  address: z.string().min(5, "Full address is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  idProofType: z.enum(["aadhaar", "passport", "driving_license", "pan_card", "ration_card"]),
}).strict();

export type Form6Data = z.infer<typeof form6DataSchema>;

// ── Constituency Phase ────────────────────────────────────────────────
export const constituencyPhaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  details: z.string().optional(),
  status: z.enum(["completed", "current", "upcoming"]).default("upcoming"),
  date: z.string().optional(),
  icon: z.string().optional(),
}).strict();

export type ConstituencyPhase = z.infer<typeof constituencyPhaseSchema>;

export const constituencyRoadmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  state: z.string().optional(),
  steps: z.array(constituencyPhaseSchema),
}).strict();

export type ConstituencyRoadmap = z.infer<typeof constituencyRoadmapSchema>;

// ── EVM Step ──────────────────────────────────────────────────────────
export const evmStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  instruction: z.string().optional(),
  icon: z.string().optional(),
}).strict();

export type EVMStep = z.infer<typeof evmStepSchema>;

export const evmSimulatorOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(evmStepSchema),
}).strict();

export type EVMSimulatorOutput = z.infer<typeof evmSimulatorOutputSchema>;

// ── Fact Card ─────────────────────────────────────────────────────────
export const sourceSchema = z.object({
  title: z.string(),
  url: z.string().url().optional(),
}).strict();
export type Source = z.infer<typeof sourceSchema>;

export const factSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string().optional(),
}).strict();
export type Fact = z.infer<typeof factSchema>;

export const factCardOutputSchema = z.object({
  title: z.string(),
  summary: z.string(),
  facts: z.array(factSchema),
  sources: z.array(sourceSchema).optional(),
}).strict();
export type FactCardOutput = z.infer<typeof factCardOutputSchema>;

// ── Checklist ─────────────────────────────────────────────────────────
export const checklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  url: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
}).strict();
export type ChecklistItem = z.infer<typeof checklistItemSchema>;

export const checklistOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(checklistItemSchema),
}).strict();
export type ChecklistOutput = z.infer<typeof checklistOutputSchema>;

// ── Eligibility Output (Form 6 Wizard) ────────────────────────────────
export const form6WizardOutputSchema = z.object({
  state: z.string(),
  eligible: z.boolean(),
  summary: z.string(),
  requirements: z.array(z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
    met: z.boolean().default(false),
    category: z.enum(["citizenship", "age", "residency", "registration", "id"]),
  }).strict()),
  registrationUrl: z.string().optional(),
}).strict();
export type Form6WizardOutput = z.infer<typeof form6WizardOutputSchema>;
