"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Fingerprint, Shield, CheckCircle2, Eye, LogOut, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EVMSimulatorOutput } from "@/lib/schemas";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "map-pin": MapPin, "id-card": Fingerprint, fingerprint: Fingerprint, shield: Shield,
  "check-circle": CheckCircle2, eye: Eye, "log-out": LogOut,
};

/**
 * Interactive EVM (Electronic Voting Machine) simulation component.
 * Guides the user step-by-step through the voting process and VVPAT verification.
 */
export function EVMSimulator({ data }: { data: EVMSimulatorOutput }): React.JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [votePressed, setVotePressed] = useState(false);
  const [vvpatVisible, setVvpatVisible] = useState(false);

  const currentStep = data.steps[activeStep];
  const isVoteStep = currentStep?.id === "press";
  const isVvpatStep = currentStep?.id === "vvpat";

  const handleNext = () => {
    if (activeStep < data.steps.length - 1) setActiveStep(s => s + 1);
  };

  const handleVote = () => {
    setVotePressed(true);
    setTimeout(() => {
      setActiveStep(s => s + 1);
      setVvpatVisible(true);
      setTimeout(() => setVvpatVisible(false), 7000);
    }, 1500);
  };

  const reset = () => { setActiveStep(0); setVotePressed(false); setVvpatVisible(false); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-indigo-950/40 backdrop-blur-xl p-6 shadow-2xl">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-blue-500/20">🗳️</div>
        {data.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{data.description}</p>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {data.steps.map((s, i) => (
          <div key={s.id} className={cn("h-2 flex-1 rounded-full transition-all duration-500",
            i < activeStep ? "bg-emerald-400" : i === activeStep ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-700")} />
        ))}
      </div>

      {/* Active Step Card */}
      <AnimatePresence mode="wait">
        <motion.div key={activeStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className={cn("p-5 rounded-xl border", activeStep === data.steps.length - 1 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10")}>
          <div className="flex items-center gap-3 mb-3">
            {(() => { const Icon = currentStep?.icon ? ICON_MAP[currentStep.icon] || CheckCircle2 : CheckCircle2; return (
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center",
                activeStep === data.steps.length - 1 ? "bg-emerald-500/20" : "bg-blue-500/20")}>
                <Icon className={cn("h-6 w-6", activeStep === data.steps.length - 1 ? "text-emerald-400" : "text-blue-400")} />
              </div>
            ); })()}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Step {activeStep + 1} of {data.steps.length}</p>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{currentStep?.title}</h4>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{currentStep?.description}</p>
          {currentStep?.instruction && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/15">
              <p className="text-xs text-amber-300">{currentStep.instruction}</p>
            </div>
          )}

          {/* EVM Vote Button Simulation */}
          {isVoteStep && !votePressed && (
            <motion.button onClick={handleVote} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Simulate pressing EVM button">
              🔵 Press Blue Button to Vote (Simulation)
            </motion.button>
          )}
          {isVoteStep && votePressed && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-sm text-emerald-400 font-medium">✅ Beep! Vote recorded. Light is glowing.</p>
            </motion.div>
          )}

          {/* VVPAT Slip Simulation */}
          {isVvpatStep && vvpatVisible && (
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="mt-4 p-4 rounded-xl bg-white/90 border-2 border-slate-300 text-center">
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-2">VVPAT Slip</p>
              <div className="py-2 border-t border-b border-dashed border-slate-400">
                <p className="text-lg font-bold text-slate-900">🪷 Candidate Name</p>
                <p className="text-sm text-slate-600">Party Symbol</p>
              </div>
              <motion.div className="mt-2 h-1 bg-blue-500 rounded-full" initial={{ width: "100%" }} animate={{ width: "0%" }}
                transition={{ duration: 7, ease: "linear" }} />
              <p className="text-[10px] text-slate-500 mt-1">Slip visible for 7 seconds</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button onClick={reset} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-600 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded">
          <RotateCcw className="h-3 w-3" /> Restart
        </button>
        {!isVoteStep && activeStep < data.steps.length - 1 && (
          <button onClick={handleNext}
            className="flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            Next Step <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
