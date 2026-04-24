"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, RotateCcw, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Language, LANGUAGES, t, getChips } from "@/lib/i18n";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useTTS } from "@/hooks/useTTS";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { InteractiveTimeline } from "@/components/generative/InteractiveTimeline";
import { Form6Wizard } from "@/components/generative/Form6Wizard";
import { EVMSimulator } from "@/components/generative/EVMSimulator";
import { FactCard } from "@/components/generative/FactCard";
import { ActionChecklist } from "@/components/generative/ActionChecklist";
import { ToolSkeleton } from "@/components/generative/ToolSkeleton";
import type {
  ConstituencyRoadmap,
  FactCardOutput,
  Form6WizardOutput,
  ChecklistOutput,
  EVMSimulatorOutput,
} from "@/lib/schemas";

type UIPart = 
  | { type: "text"; text: string }
  | { type: `tool-${string}`; state?: string; output?: unknown; args?: unknown };

const AUTO_SEND_DELAY_MS = 300;

const CHIP_COLORS = [
  "from-orange-500/20 to-amber-500/20 border-orange-500/20 hover:border-orange-400/40",
  "from-blue-500/20 to-indigo-500/20 border-blue-500/20 hover:border-blue-400/40",
  "from-emerald-500/20 to-teal-500/20 border-emerald-500/20 hover:border-emerald-400/40",
  "from-violet-500/20 to-purple-500/20 border-violet-500/20 hover:border-violet-400/40",
  "from-cyan-500/20 to-sky-500/20 border-cyan-500/20 hover:border-cyan-400/40",
] as const;

/**
 * Primary chat interface component using the Vercel AI SDK.
 * Handles voice/text input, message rendering, and multi-language support.
 */
export function ChatInterface(): React.JSX.Element {
  const [input, setInput] = useState("");
  const [lang, setLang] = useState<Language>("en");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const isLoading = status === "streaming" || status === "submitted";
  const hasMessages = messages.length > 0;
  const strings = t(lang);
  const langConfig = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const { speak } = useTTS(langConfig.speechCode);

  const handleVoiceResult = useCallback((transcript: string) => {
    setInput(transcript);
    // Auto-send voice input
    setTimeout(() => {
      sendMessage({ text: transcript });
      setInput("");
    }, AUTO_SEND_DELAY_MS);
  }, [sendMessage]);

  const { isListening, isSupported: voiceSupported, toggle: toggleVoice } = useVoiceInput({
    lang: langConfig.speechCode,
    onResult: handleVoiceResult,
  });

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, status]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // TTS for new assistant messages
  useEffect(() => {
    if (!ttsEnabled) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && status === "ready") {
      const textParts = (lastMsg.parts || []) as UIPart[];
      const text = textParts.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text).join("");
      if (text) speak(text);
    }
  }, [messages, status, ttsEnabled, speak]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleChipSelect = (prompt: string) => sendMessage({ text: prompt });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  const handleReset = () => { setMessages([]); setInput(""); inputRef.current?.focus(); };

  const renderToolPart = (part: UIPart, index: number) => {
    if (part.type === "text") return null;
    const partType = part.type;
    const state = part.state;

    if (partType === "tool-showConstituencyRoadmap") {
      if (state === "output-available") return <InteractiveTimeline key={index} data={part.output as ConstituencyRoadmap} />;
      return <ToolSkeleton key={index} type="timeline" />;
    }
    if (partType === "tool-showFactCard") {
      if (state === "output-available") return <FactCard key={index} data={part.output as FactCardOutput} />;
      return <ToolSkeleton key={index} type="factcard" />;
    }
    if (partType === "tool-showForm6Wizard") {
      if (state === "output-available") return <Form6Wizard key={index} data={part.output as Form6WizardOutput} />;
      return <ToolSkeleton key={index} type="wizard" />;
    }
    if (partType === "tool-showChecklist") {
      if (state === "output-available") return <ActionChecklist key={index} data={part.output as ChecklistOutput} />;
      return <ToolSkeleton key={index} type="checklist" />;
    }
    if (partType === "tool-showEVMSimulator") {
      if (state === "output-available") return <EVMSimulator key={index} data={part.output as EVMSimulatorOutput} />;
      return <ToolSkeleton key={index} type="evm" />;
    }
    return null;
  };

  const chipLabels = getChips(lang);

  return (
    <div className="flex flex-col h-full max-h-[100dvh]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth px-4 py-6 space-y-6"
        role="log" aria-label="Chat messages" aria-live="polite">
        {!hasMessages && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full text-center px-4 pt-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 via-white/10 to-green-500/20 border border-orange-500/20 mb-6">
              <Sparkles className="h-10 w-10 text-orange-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{strings.welcomeTitle}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 text-sm leading-relaxed">{strings.welcomeText}</p>
            <div className="flex flex-wrap justify-center gap-2 px-4">
              {chipLabels.map((chip, i) => (
                <motion.button key={chip.key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleChipSelect(chip.label)}
                  className={cn("flex items-center gap-2 px-4 py-2.5 rounded-full border bg-gradient-to-r text-sm font-medium text-slate-700 dark:text-slate-200 transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400", CHIP_COLORS[i % CHIP_COLORS.length])}>
                  {chip.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((message) => {
          const parts = (message.parts || []) as UIPart[];
          const textParts = parts.filter((p): p is { type: "text"; text: string } => p.type === "text");
          const toolParts = parts.filter(p => p.type?.startsWith("tool-"));
          const textContent = textParts.map(p => p.text).join("");
          return (
            <div key={message.id} className="space-y-3">
              {textContent && <MessageBubble role={message.role as "user" | "assistant"} content={textContent}
                isStreaming={status === "streaming" && message === messages[messages.length - 1] && message.role === "assistant"} />}
              {toolParts.length > 0 && (
                <div className={cn("space-y-3", message.role === "assistant" ? "ml-11" : "mr-11")}>
                  {toolParts.map((part, i) => renderToolPart(part, i))}
                </div>
              )}
            </div>
          );
        })}

        <AnimatePresence>
          {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-slate-900/5 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 py-3">
        {/* Language selector */}
        <div className="flex justify-center gap-2 mb-2">
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)}
              className={cn("text-xs px-3 py-1 rounded-full border transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                lang === l.code ? "bg-orange-500/20 border-orange-500/30 text-orange-300" : "bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200")}
              aria-label={`Switch to ${l.label}`}>
              {l.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={strings.inputPlaceholder} rows={1}
              className={cn("w-full resize-none rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 px-4 py-3 pr-12 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30", "transition-all duration-200")}
              aria-label="Type your message" style={{ minHeight: "48px", maxHeight: "120px" }} />
          </div>

          <div className="flex gap-1.5">
            {/* Voice button */}
            {voiceSupported && (
              <button type="button" onClick={toggleVoice}
                className={cn("h-12 w-12 flex items-center justify-center rounded-xl border transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                  isListening ? "bg-red-500/20 border-red-500/20 text-red-400 animate-pulse" : "bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 dark:bg-white/10")}
                aria-label={isListening ? "Stop listening" : "Start voice input"}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}

            {/* TTS toggle */}
            <button type="button" onClick={() => setTtsEnabled(!ttsEnabled)}
              className={cn("h-12 w-12 flex items-center justify-center rounded-xl border transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                ttsEnabled ? "bg-emerald-500/20 border-emerald-500/20 text-emerald-400" : "bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 dark:bg-white/10")}
              aria-label={ttsEnabled ? "Disable voice responses" : "Enable voice responses"}>
              {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {hasMessages && (
              <button type="button" onClick={handleReset}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 dark:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                aria-label="Reset conversation"><RotateCcw className="h-4 w-4" /></button>
            )}

            {isLoading ? (
              <button type="button" onClick={stop}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-red-500/20 border border-red-500/20 text-red-400 hover:bg-red-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label="Stop generating"><div className="h-3.5 w-3.5 rounded-sm bg-red-400" /></button>
            ) : (
              <button type="submit" disabled={!input.trim()}
                className={cn("h-12 w-12 flex items-center justify-center rounded-xl transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                  input.trim() ? "bg-gradient-to-r from-orange-600 to-amber-600 text-slate-900 dark:text-white hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-500/20" : "bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-600 cursor-not-allowed")}
                aria-label="Send message"><Send className="h-4 w-4" /></button>
            )}
          </div>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-2">{strings.disclaimer}</p>
      </div>
    </div>
  );
}
