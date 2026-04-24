import {
  streamText,
  convertToModelMessages,
  generateText,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { electionTools } from "@/ai/tools";
import { sanitizeInput } from "@/lib/utils";
import {
  routerModel,
  explainerModel,
  groundedModel,
  AGENT_TEMPERATURES,
  isApiKeyConfigured,
  getProviderName,
} from "@/ai/agents";
import {
  ROUTER_SYSTEM_PROMPT,
  EXPLAINER_SYSTEM_PROMPT,
  ECI_LEGAL_SYSTEM_PROMPT,
  LIVE_ELECTION_SYSTEM_PROMPT,
  EVM_SYSTEM_PROMPT,
  CHECKLIST_SYSTEM_PROMPT,
} from "@/ai/system-prompts";
import {
  DEFAULT_FORM6_OUTPUT,
  EVM_VOTING_STEPS,
  CONSTITUENCY_ROADMAP,
  VOTER_REGISTRATION_CHECKLIST,
} from "@/lib/election-data";
import type {
  Form6WizardOutput,
  EVMSimulatorOutput,
  ConstituencyRoadmap,
  ChecklistOutput,
} from "@/lib/schemas";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

/** Maximum allowed number of messages in a conversation */
const MAX_CONVERSATION_LENGTH = 50;

type Intent = "FORM6" | "EVM_INFO" | "LIVE_ELECTION" | "CHECKLIST" | "EXPLAIN";

async function classifyIntent(userMessage: string): Promise<Intent> {
  if (!isApiKeyConfigured()) {
    const lower = userMessage.toLowerCase();
    if (lower.includes("eligible") || lower.includes("form 6") || lower.includes("voter id") || lower.includes("epic") || lower.includes("register") || lower.includes("फॉर्म") || lower.includes("मतदार"))
      return "FORM6";
    if (lower.includes("evm") || lower.includes("vvpat") || lower.includes("voting machine") || lower.includes("how to vote") || lower.includes("कैसे वोट") || lower.includes("मतदान"))
      return "EVM_INFO";
    if (lower.includes("date") || lower.includes("phase") || lower.includes("schedule") || lower.includes("election") || lower.includes("तारीख") || lower.includes("चरण") || lower.includes("निवडणूक"))
      return "LIVE_ELECTION";
    if (lower.includes("checklist") || lower.includes("document") || lower.includes("prepare") || lower.includes("need") || lower.includes("दस्तावेज"))
      return "CHECKLIST";
    return "EXPLAIN";
  }

  try {
    const { text } = await generateText({
      model: routerModel,
      system: ROUTER_SYSTEM_PROMPT,
      prompt: userMessage,
      temperature: AGENT_TEMPERATURES.router,
    });
    const cleaned = text.trim().toUpperCase() as Intent;
    const valid: Intent[] = ["FORM6", "EVM_INFO", "LIVE_ELECTION", "CHECKLIST", "EXPLAIN"];
    return valid.includes(cleaned) ? cleaned : "EXPLAIN";
  } catch {
    return "EXPLAIN";
  }
}

function getAgentConfig(intent: Intent) {
  switch (intent) {
    case "FORM6":
      return { model: groundedModel, system: ECI_LEGAL_SYSTEM_PROMPT, temperature: AGENT_TEMPERATURES.grounded };
    case "EVM_INFO":
      return { model: groundedModel, system: EVM_SYSTEM_PROMPT, temperature: AGENT_TEMPERATURES.timeline };
    case "LIVE_ELECTION":
      return { model: groundedModel, system: LIVE_ELECTION_SYSTEM_PROMPT, temperature: AGENT_TEMPERATURES.grounded };
    case "CHECKLIST":
      return { model: groundedModel, system: CHECKLIST_SYSTEM_PROMPT, temperature: AGENT_TEMPERATURES.checklist };
    default:
      return { model: explainerModel, system: EXPLAINER_SYSTEM_PROMPT, temperature: AGENT_TEMPERATURES.explainer };
  }
}

function getDemoText(intent: Intent): string {
  switch (intent) {
    case "FORM6": return "Let me help you check your voter eligibility and guide you through Form 6 registration:";
    case "EVM_INFO": return "Here's how the EVM (Electronic Voting Machine) and VVPAT work:";
    case "LIVE_ELECTION": return "Here's the election phase roadmap:";
    case "CHECKLIST": return "Here's your voter registration checklist:";
    default:
      return `## 🗳️ नमस्ते! Welcome to ElectoGuide Bharat!\n\nI'm your AI election education assistant powered by the knowledge of the **Election Commission of India (ECI)**.\n\n**Here's what I can do:**\n\n- 📋 **Guide you through Form 6** voter registration\n- 🗳️ **Show you how EVM & VVPAT work** step by step\n- 📅 **Share election phase dates** for your state\n- ✅ **Create a voter registration checklist**\n\nTry asking:\n- *"Am I eligible to vote?"*\n- *"EVM kaise kaam karta hai?"*\n- *"Election dates kya hain?"*\n\n> 💡 **Tip:** Running in demo mode (${getProviderName()}). Add your Gemini API key or Vertex AI config to \`.env.local\` for AI-powered responses!`;
  }
}

type ToolData = Form6WizardOutput | EVMSimulatorOutput | ConstituencyRoadmap | ChecklistOutput;

function getToolData(intent: Intent): { name: string; data: ToolData } | null {
  switch (intent) {
    case "FORM6": return { name: "showForm6Wizard", data: DEFAULT_FORM6_OUTPUT };
    case "EVM_INFO": return { name: "showEVMSimulator", data: EVM_VOTING_STEPS };
    case "LIVE_ELECTION": return { name: "showConstituencyRoadmap", data: CONSTITUENCY_ROADMAP };
    case "CHECKLIST": return { name: "showChecklist", data: VOTER_REGISTRATION_CHECKLIST };
    default: return null;
  }
}

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Validate conversation length
    if (messages.length > MAX_CONVERSATION_LENGTH) {
      return new Response(JSON.stringify({ error: "Conversation too long. Please start a new chat." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const rawText = lastUserMessage?.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map((p) => p.text).join(" ") || "";
    const userText = sanitizeInput(rawText);

    if (!userText) {
      return new Response(JSON.stringify({ error: "Message cannot be empty." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    logger.info("Chat request received", {
      component: "ChatAPI",
      messageCount: messages.length,
      inputLength: userText.length,
      provider: isApiKeyConfigured() ? "google-ai" : "demo",
    });

    // ── Demo Mode ─────────────────────────────────────────────────────
    if (!isApiKeyConfigured()) {
      const intent = await classifyIntent(userText);
      const demoText = getDemoText(intent);
      const toolInfo = getToolData(intent);

      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          // Stream text using text-start / text-delta / text-end protocol
          const textId = `demo-text-${Date.now()}`;
          writer.write({ type: "text-start", id: textId });
          // Stream character by character for realistic effect
          const chunks = demoText.match(/.{1,12}/g) || [demoText];
          for (const chunk of chunks) {
            writer.write({ type: "text-delta", id: textId, delta: chunk });
            await new Promise((r) => setTimeout(r, 15));
          }
          writer.write({ type: "text-end", id: textId });

          // Stream tool invocation if applicable
          if (toolInfo) {
            const toolCallId = `demo-${intent.toLowerCase()}-${Date.now()}`;
            writer.write({
              type: "tool-input-available",
              toolCallId,
              toolName: toolInfo.name,
              input: toolInfo.data,
            });
            writer.write({
              type: "tool-output-available",
              toolCallId,
              output: toolInfo.data,
            });
          }
        },
      });

      return createUIMessageStreamResponse({ stream });
    }

    // ── Live Mode (Vertex AI or Google AI Studio) ─────────────────────
    const intent = await classifyIntent(userText);
    const agentConfig = getAgentConfig(intent);

    // Wrap in a UIMessageStream so we can catch streaming errors
    // and fall back to demo mode if the AI provider fails
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        try {
          const result = streamText({
            model: agentConfig.model,
            system: agentConfig.system,
            messages: await convertToModelMessages(messages),
            tools: electionTools,
            temperature: agentConfig.temperature,
            stopWhen: stepCountIs(3),
          });

          // Forward the AI stream
          const aiStream = result.toUIMessageStream();
          const reader = aiStream.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              writer.write(value);
            }
          } finally {
            reader.releaseLock();
          }
        } catch (aiError) {
          // AI provider failed — fall back to demo content
          logger.warn("AI provider failed, falling back to demo mode", {
            component: "ChatAPI",
            error: aiError instanceof Error ? aiError.message : String(aiError),
          });

          const demoText = getDemoText(intent);
          const toolInfo = getToolData(intent);

          const textId = `fallback-text-${Date.now()}`;
          writer.write({ type: "text-start", id: textId });
          const chunks = demoText.match(/.{1,12}/g) || [demoText];
          for (const chunk of chunks) {
            writer.write({ type: "text-delta", id: textId, delta: chunk });
            await new Promise((r) => setTimeout(r, 15));
          }
          writer.write({ type: "text-end", id: textId });

          if (toolInfo) {
            const toolCallId = `fallback-${intent.toLowerCase()}-${Date.now()}`;
            writer.write({
              type: "tool-input-available",
              toolCallId,
              toolName: toolInfo.name,
              input: toolInfo.data,
            });
            writer.write({
              type: "tool-output-available",
              toolCallId,
              output: toolInfo.data,
            });
          }
        }
      },
    });
    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    logger.error("Chat API request failed", {
      component: "ChatAPI",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return new Response(JSON.stringify({ error: "An error occurred. Please try again." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
