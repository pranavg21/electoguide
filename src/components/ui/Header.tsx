"use client";

import { Vote, Moon, Sun, Cloud } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Main application header component.
 * Displays branding, active integrations (Generative UI, Vertex AI, PWA),
 * and handles theme toggling.
 */
export function Header(): React.JSX.Element {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-900/5 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 via-white to-green-600 shadow-lg shadow-orange-500/20">
          <Vote className="h-5 w-5 text-slate-900" />
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 via-slate-800 to-green-600 dark:from-orange-300 dark:via-white dark:to-green-300 bg-clip-text text-transparent">
            ElectoGuide Bharat
          </h1>
          <p className="text-[10px] text-slate-500 -mt-0.5 tracking-wider uppercase">
            AI Election Assistant • भारत निर्वाचन
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Generative UI
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
          <Cloud className="h-3 w-3" />
          Vertex AI
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-medium">
          🇮🇳 PWA
        </span>

        <button onClick={() => setIsDark(!isDark)}
          className={cn("h-9 w-9 flex items-center justify-center rounded-xl transition-all",
            "bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 dark:bg-white/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
