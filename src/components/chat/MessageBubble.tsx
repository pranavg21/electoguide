"use client";

import { motion } from "framer-motion";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3 group", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div className={cn(
        "shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1",
        isUser
          ? "bg-gradient-to-br from-violet-500 to-indigo-600"
          : "bg-gradient-to-br from-cyan-500 to-blue-600"
      )}>
        {isUser ? <User className="h-4 w-4 text-slate-900 dark:text-white" /> : <Bot className="h-4 w-4 text-slate-900 dark:text-white" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        "relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-gradient-to-br from-violet-600/80 to-indigo-700/80 text-slate-900 dark:text-white rounded-tr-sm"
          : "bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-tl-sm"
      )}>
        {isUser ? (
          <p>{content}</p>
        ) : (
          <div className="prose dark:prose-invert prose-sm max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-code:text-cyan-700 dark:prose-code:text-cyan-300 prose-code:bg-slate-900/10 dark:prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {/* Copy button (assistant only) */}
        {!isUser && content.length > 0 && (
          <button
            onClick={handleCopy}
            className={cn(
              "absolute -bottom-7 right-0 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition-all",
              "opacity-0 group-hover:opacity-100",
              "text-slate-500 hover:text-slate-600 dark:text-slate-300 hover:bg-slate-900/10 dark:bg-white/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            )}
            aria-label="Copy message"
          >
            {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
          </button>
        )}

        {/* Streaming indicator */}
        {isStreaming && (
          <span className="inline-flex gap-1 ml-1">
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
        )}
      </div>
    </motion.div>
  );
}

/** Typing indicator shown while waiting for AI response */
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3"
    >
      <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
        <Bot className="h-4 w-4 text-slate-900 dark:text-white" />
      </div>
      <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          className="h-2 w-2 rounded-full bg-cyan-400" />
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          className="h-2 w-2 rounded-full bg-cyan-400" />
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          className="h-2 w-2 rounded-full bg-cyan-400" />
      </div>
    </motion.div>
  );
}
