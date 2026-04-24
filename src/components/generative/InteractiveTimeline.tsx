"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ClipboardCheck, MapPin, Search, Bell, FileText,
  XCircle, Megaphone, BarChart,
  IdCard, Vote, Clock, ChevronDown, ChevronUp,
  CheckCircle2, Circle, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConstituencyRoadmap } from "@/lib/schemas";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "shield-check": ShieldCheck, "clipboard-check": ClipboardCheck,
  "map-pin": MapPin, search: Search, "id-card": IdCard, vote: Vote, clock: Clock,
  bell: Bell, "file-text": FileText, "x-circle": XCircle, megaphone: Megaphone, "bar-chart": BarChart,
};

/**
 * Displays a state-specific timeline for election phases.
 * Allows expanding steps to view specific date details and instructions.
 */
export function InteractiveTimeline({ data }: { data: ConstituencyRoadmap }): React.JSX.Element {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 backdrop-blur-xl p-6 shadow-2xl shadow-indigo-500/5"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20">
            <ClipboardCheck className="h-4 w-4 text-indigo-400" />
          </div>
          {data.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data.description}</p>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-slate-700/20" />
        <div className="space-y-1">
          {data.steps.map((step, index) => {
            const Icon = step.icon ? ICON_MAP[step.icon] || Circle : Circle;
            const isExpanded = expandedStep === step.id;
            const done = step.status === "completed";
            const current = step.status === "current";

            return (
              <motion.div key={step.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}>
                <button
                  onClick={() => setExpandedStep(prev => prev === step.id ? null : step.id)}
                  className={cn(
                    "w-full text-left flex items-start gap-4 p-3 rounded-xl transition-all duration-200 group",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                    current ? "bg-indigo-500/10 border border-indigo-500/20" : "hover:bg-slate-900/5 dark:hover:bg-white/5"
                  )}
                  aria-expanded={isExpanded}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  <div className="relative z-10 shrink-0 mt-0.5">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                      done ? "bg-emerald-500/20 border-emerald-400 text-emerald-400"
                        : current ? "bg-indigo-500/20 border-indigo-400 text-indigo-400 shadow-lg shadow-indigo-500/20"
                        : "bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                    )}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                    </div>
                    {current && (
                      <motion.div className="absolute inset-0 rounded-full border-2 border-indigo-400/40"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={cn("font-semibold text-sm",
                        done ? "text-emerald-400" : current ? "text-indigo-300" : "text-slate-600 dark:text-slate-300"
                      )}>{step.title}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        {step.date && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />{step.date}
                          </span>
                        )}
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> :
                          <ChevronDown className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{step.description}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && step.details && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="ml-14 mr-3 mb-2 p-3 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-900/5 dark:border-white/5">
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.details}</p>
                        {current && (
                          <button className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded">
                            Get started <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-900/5 dark:border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {data.steps.filter(s => s.status === "completed").length} of {data.steps.length} steps
        </span>
        <div className="flex gap-1">
          {data.steps.map(step => (
            <div key={step.id} className={cn("h-1.5 w-6 rounded-full",
              step.status === "completed" ? "bg-emerald-400"
                : step.status === "current" ? "bg-indigo-400" : "bg-slate-300 dark:bg-slate-700"
            )} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
