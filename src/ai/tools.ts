import { tool } from "ai";
import { z } from "zod";
import {
  CONSTITUENCY_ROADMAP,
  ECI_FACTS,
  DEFAULT_FORM6_OUTPUT,
  VOTER_REGISTRATION_CHECKLIST,
  EVM_VOTING_STEPS,
} from "@/lib/election-data";

// ── Tool: Show Form 6 Wizard ─────────────────────────────────────────
export const showForm6Wizard = tool({
  description: "Display an interactive Form 6 voter registration wizard for Indian voters. Use when user asks about eligibility, voter registration, Form 6, or voter ID (EPIC card).",
  inputSchema: z.object({
    state: z.string().describe("Indian state for state-specific requirements"),
    eligible: z.boolean().describe("Overall eligibility assessment"),
    summary: z.string().describe("Summary of eligibility"),
    requirements: z.array(z.object({
      id: z.string(), label: z.string(), description: z.string(),
      met: z.boolean().default(false),
      category: z.enum(["citizenship", "age", "residency", "registration", "id"]),
    })),
    registrationUrl: z.string().optional(),
  }),
  execute: async (params) => params.requirements.length > 0 ? params : DEFAULT_FORM6_OUTPUT,
});

// ── Tool: Show EVM Simulator ──────────────────────────────────────────
export const showEVMSimulator = tool({
  description: "Display an interactive EVM/VVPAT voting process simulator. Use when user asks about how to vote, EVM, VVPAT, voting machine, or election day process.",
  inputSchema: z.object({
    title: z.string().describe("Simulator title"),
    description: z.string().describe("Brief description"),
    steps: z.array(z.object({
      id: z.string(), title: z.string(), description: z.string(),
      instruction: z.string().optional(), icon: z.string().optional(),
    })),
  }),
  execute: async (params) => params.steps.length > 0 ? params : EVM_VOTING_STEPS,
});

// ── Tool: Show Constituency Roadmap ───────────────────────────────────
export const showConstituencyRoadmap = tool({
  description: "Display an interactive election phase timeline/roadmap. Use when user asks about election dates, phases, schedule, or constituency timeline.",
  inputSchema: z.object({
    title: z.string().describe("Timeline title"),
    description: z.string().describe("Brief description"),
    state: z.string().optional().describe("Indian state"),
    steps: z.array(z.object({
      id: z.string(), title: z.string(), description: z.string(),
      details: z.string().optional(),
      status: z.enum(["completed", "current", "upcoming"]).default("upcoming"),
      date: z.string().optional(), icon: z.string().optional(),
    })),
  }),
  execute: async (params) => params.steps.length > 0 ? params : CONSTITUENCY_ROADMAP,
});

// ── Tool: Show Fact Card ──────────────────────────────────────────────
export const showFactCard = tool({
  description: "Display a fact card with key ECI election information. Use for specific facts, statistics, or general election knowledge.",
  inputSchema: z.object({
    title: z.string(), summary: z.string(),
    facts: z.array(z.object({
      label: z.string(), value: z.string(), icon: z.string().optional(),
    })),
    sources: z.array(z.object({
      title: z.string(), url: z.string().optional(),
    })).optional(),
  }),
  execute: async (params) => params.facts.length > 0 ? params : ECI_FACTS,
});

// ── Tool: Show Checklist ──────────────────────────────────────────────
export const showChecklist = tool({
  description: "Display an interactive voter registration or election day checklist. Use when user wants to-do items, preparation steps, or document requirements.",
  inputSchema: z.object({
    title: z.string(), description: z.string(),
    items: z.array(z.object({
      id: z.string(), text: z.string(),
      description: z.string().optional(),
      completed: z.boolean().default(false),
      url: z.string().optional(),
      priority: z.enum(["high", "medium", "low"]).default("medium"),
    })),
  }),
  execute: async (params) => params.items.length > 0 ? params : VOTER_REGISTRATION_CHECKLIST,
});

// ── Export all tools ──────────────────────────────────────────────────
export const electionTools = {
  showForm6Wizard,
  showEVMSimulator,
  showConstituencyRoadmap,
  showFactCard,
  showChecklist,
};
