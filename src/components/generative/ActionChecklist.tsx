"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, ExternalLink, ListChecks,
  AlertTriangle, ArrowUpCircle, MinusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChecklistOutput } from "@/lib/schemas";

const PRIORITY_CONFIG = {
  high: { icon: ArrowUpCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "High" },
  medium: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Med" },
  low: { icon: MinusCircle, color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", label: "Low" },
};

/**
 * Renders an interactive checklist for voter registration steps.
 * Handles progress calculation and completion states.
 */
export function ActionChecklist({ data }: { data: ChecklistOutput }): React.JSX.Element {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const progress = data.items.length > 0 ? (checked.size / data.items.length) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-orange-950/40 backdrop-blur-xl p-6 shadow-lg dark:shadow-2xl dark:shadow-amber-500/5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20">
              <ListChecks className="h-4 w-4 text-amber-400" />
            </div>
            {data.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data.description}</p>
        </div>
        <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg shrink-0">
          {checked.size}/{data.items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full mb-4 overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
          initial={{ width: 0 }} animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }} />
      </div>

      <div className="space-y-2">
        {data.items.map((item, i) => {
          const isChecked = checked.has(item.id);
          const priority = PRIORITY_CONFIG[item.priority || "medium"];

          return (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}>
              <button onClick={() => toggle(item.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                  isChecked ? "bg-emerald-500/5 border-emerald-500/10" : "bg-slate-900/5 dark:bg-white/5 border-slate-900/5 dark:border-white/5 hover:bg-slate-900/10 dark:bg-white/10"
                )}
                aria-label={`${isChecked ? "Uncheck" : "Check"}: ${item.text}`}>
                <div className="shrink-0 mt-0.5">
                  {isChecked ?
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" /> :
                    <Circle className="h-5 w-5 text-slate-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium transition-all",
                      isChecked ? "text-slate-500 dark:text-slate-400 line-through" : "text-slate-700 dark:text-slate-200")}>{item.text}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border", priority.color, priority.bg, priority.border)}>
                      {priority.label}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded">
                      Visit resource <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {progress === 100 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <p className="text-sm font-medium text-emerald-400">🎉 All items completed! You&apos;re all set!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
