"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToolSkeletonProps {
  type: "timeline" | "factcard" | "wizard" | "checklist" | "evm";
  className?: string;
}

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

export function ToolSkeleton({ type, className }: ToolSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full rounded-2xl border border-slate-900/10 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 backdrop-blur-sm p-6",
        className
      )}
    >
      {type === "timeline" && <TimelineSkeleton />}
      {type === "factcard" && <FactCardSkeleton />}
      {type === "wizard" && <WizardSkeleton />}
      {type === "checklist" && <ChecklistSkeleton />}
      {type === "evm" && <TimelineSkeleton />}
    </motion.div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading timeline">
      <div className={cn("h-6 w-48 rounded-lg bg-slate-900/10 dark:bg-white/10", shimmer)} />
      <div className={cn("h-4 w-64 rounded bg-slate-900/5 dark:bg-white/5", shimmer)} />
      <div className="space-y-4 ml-4 border-l-2 border-slate-900/10 dark:border-white/10 pl-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div
              className={cn("h-5 w-40 rounded bg-slate-900/10 dark:bg-white/10", shimmer)}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
            <div
              className={cn("h-3 w-56 rounded bg-slate-900/5 dark:bg-white/5", shimmer)}
              style={{ animationDelay: `${i * 0.15 + 0.05}s` }}
            />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading timeline...</span>
    </div>
  );
}

function FactCardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading facts">
      <div className={cn("h-6 w-44 rounded-lg bg-slate-900/10 dark:bg-white/10", shimmer)} />
      <div className={cn("h-4 w-72 rounded bg-slate-900/5 dark:bg-white/5", shimmer)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-20 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/5 dark:border-white/5",
              shimmer
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <span className="sr-only">Loading facts...</span>
    </div>
  );
}

function WizardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading wizard">
      <div className={cn("h-6 w-52 rounded-lg bg-slate-900/10 dark:bg-white/10", shimmer)} />
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn("h-2 flex-1 rounded-full bg-slate-900/10 dark:bg-white/10", shimmer)}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-16 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/5 dark:border-white/5",
              shimmer
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="sr-only">Loading eligibility wizard...</span>
    </div>
  );
}

function ChecklistSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading checklist">
      <div className={cn("h-6 w-48 rounded-lg bg-slate-900/10 dark:bg-white/10", shimmer)} />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={cn("h-5 w-5 rounded bg-slate-900/10 dark:bg-white/10 shrink-0", shimmer)}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
            <div
              className={cn("h-4 flex-1 rounded bg-slate-900/5 dark:bg-white/5", shimmer)}
              style={{ animationDelay: `${i * 0.1 + 0.05}s` }}
            />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading checklist...</span>
    </div>
  );
}
