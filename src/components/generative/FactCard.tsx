"use client";

import { motion } from "framer-motion";
import {
  Calendar, Landmark, Clock, Mail, Users,
  ExternalLink, Info, Search, MapPin, IdCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FactCardOutput } from "@/lib/schemas";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar, landmark: Landmark, clock: Clock,
  mail: Mail, users: Users, search: Search, "map-pin": MapPin, "id-card": IdCard,
};

/**
 * Component for displaying key ECI facts, statistics, and source citations.
 */
export function FactCard({ data }: { data: FactCardOutput }): React.JSX.Element {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-blue-950/40 backdrop-blur-xl p-6 shadow-2xl shadow-cyan-500/5">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20">
            <Info className="h-4 w-4 text-cyan-400" />
          </div>
          {data.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data.summary}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.facts.map((fact, i) => {
          const Icon = fact.icon ? ICON_MAP[fact.icon] || Info : Info;
          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="p-3 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/5 dark:border-white/5 hover:bg-slate-900/10 dark:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium text-cyan-300">{fact.label}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">{fact.value}</p>
            </motion.div>
          );
        })}
      </div>

      {data.sources && data.sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-900/5 dark:border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Sources</p>
          <div className="flex flex-wrap gap-2">
            {data.sources.map((source, i) => (
              <a key={i} href={source.url || "#"} target="_blank" rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors",
                  "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                )}>
                {source.title}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
