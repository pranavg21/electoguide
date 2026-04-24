"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, User, MapPin, FileText, CheckCircle2,
  ChevronRight, ChevronLeft, ExternalLink, AlertCircle, Fingerprint, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Form6WizardOutput } from "@/lib/schemas";

const STEPS = [
  { id: "citizenship", label: "Citizenship", icon: ShieldCheck },
  { id: "age", label: "Age", icon: User },
  { id: "state", label: "State", icon: MapPin },
  { id: "id-proof", label: "ID Proof", icon: FileText },
] as const;

const DIGILOCKER_FETCH_DELAY_MS = 2500;

/**
 * Multi-step wizard to guide users through the Form 6 voter registration process.
 * Includes a simulated DigiLocker flow for data fetching.
 */
export function Form6Wizard({ data }: { data: Form6WizardOutput }): React.JSX.Element {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [digiLoading, setDigiLoading] = useState(false);
  const [digiFetched, setDigiFetched] = useState(false);


  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else setDone(true);
  };

  const toggleReq = (id: string) => {
    setChecked(p => { 
      const n = new Set(p); 
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n; 
    });
  };

  const simulateDigiLocker = () => {
    setDigiLoading(true);
    setTimeout(() => { setDigiLoading(false); setDigiFetched(true); }, DIGILOCKER_FETCH_DELAY_MS);
  };

  if (done) {
    const isEligible = true;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-teal-950/40 backdrop-blur-xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className={cn("inline-flex p-4 rounded-full mb-4", isEligible ? "bg-emerald-500/20" : "bg-amber-500/20")}>
            {isEligible ? <CheckCircle2 className="h-8 w-8 text-emerald-400" /> : <AlertCircle className="h-8 w-8 text-amber-400" />}
          </motion.div>
          <h3 className={cn("text-xl font-bold", isEligible ? "text-emerald-300" : "text-amber-300")}>
            {isEligible ? "You appear eligible to register!" : "Additional verification needed"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{data.summary}</p>
        </div>

        {/* DigiLocker Simulation */}
        {!digiFetched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-sm text-indigo-300 mb-3 flex items-center gap-2">
              <Fingerprint className="h-4 w-4" /> Fetch your details from DigiLocker
            </p>
            <button onClick={simulateDigiLocker} disabled={digiLoading}
              className={cn("w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                digiLoading ? "bg-indigo-500/20 text-indigo-300 cursor-wait" : "bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white")}>
              {digiLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Fetching from DigiLocker...</> : "🔗 Fetch from DigiLocker (Simulated)"}
            </button>
          </motion.div>
        )}
        {digiFetched && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-400 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> DigiLocker data fetched! Fields auto-filled.</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div><span className="text-slate-500">Name:</span> Rahul Sharma</div>
              <div><span className="text-slate-500">Aadhaar:</span> XXXX-XXXX-1234</div>
              <div><span className="text-slate-500">DOB:</span> 15-08-2000</div>
              <div><span className="text-slate-500">Address:</span> Mumbai, MH</div>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          {data.requirements.map((req, i) => (
            <motion.button key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }} onClick={() => toggleReq(req.id)}
              className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                checked.has(req.id) ? "bg-emerald-500/10 border-emerald-500/20" : "bg-slate-900/5 dark:bg-white/5 border-slate-900/5 dark:border-white/5 hover:bg-slate-900/10 dark:bg-white/10")}>
              <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                checked.has(req.id) ? "border-emerald-400 bg-emerald-400" : "border-slate-500")}>
                {checked.has(req.id) && <CheckCircle2 className="h-3 w-3 text-slate-900" />}
              </div>
              <div><p className="text-sm font-medium text-slate-700 dark:text-slate-200">{req.label}</p><p className="text-xs text-slate-500 dark:text-slate-400">{req.description}</p></div>
            </motion.button>
          ))}
        </div>

        {data.registrationUrl && (
          <a href={data.registrationUrl} target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded">
            Register on NVSP Portal <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        <button onClick={() => { setDone(false); setStep(0); setChecked(new Set()); setDigiFetched(false); }}
          className="mt-3 block text-xs text-slate-500 hover:text-slate-500 dark:text-slate-400">← Start over</button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/30 via-slate-900/60 to-green-950/30 backdrop-blur-xl p-6 shadow-2xl">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-orange-500/20"><ShieldCheck className="h-4 w-4 text-orange-400" /></div>
        Form 6 — Voter Registration Check
      </h3>

      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex-1">
            <div className={cn("h-1.5 rounded-full transition-all duration-300",
              i < step ? "bg-orange-400" : i === step ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-700")} />
            <span className="text-[10px] text-slate-500 mt-1 block">{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }} className="min-h-[120px]">
          {step === 0 && (
            <fieldset>
              <legend className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Are you an Indian citizen?</legend>
              <div className="space-y-2">
                {["Yes, I am an Indian citizen", "No", "I'm not sure"].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border bg-slate-900/5 dark:bg-white/5 border-slate-900/5 dark:border-white/5 hover:bg-slate-900/10 dark:bg-white/10 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-orange-400">
                    <input type="radio" name="citizenship" className="sr-only" />
                    <div className="h-4 w-4 rounded-full border-2 border-slate-500" /><span className="text-sm text-slate-700 dark:text-slate-200">{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {step === 1 && (
            <fieldset>
              <legend className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Will you be 18+ years old on 1st January of the qualifying year?</legend>
              <div className="space-y-2">
                {["Yes, I am 18 or older", "I will turn 18 this year", "No, I am under 18"].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border bg-slate-900/5 dark:bg-white/5 border-slate-900/5 dark:border-white/5 hover:bg-slate-900/10 dark:bg-white/10 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-orange-400">
                    <input type="radio" name="age" className="sr-only" /><div className="h-4 w-4 rounded-full border-2 border-slate-500" /><span className="text-sm text-slate-700 dark:text-slate-200">{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {step === 2 && (
            <fieldset>
              <legend className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Which state/UT are you a resident of?</legend>
              <select className="w-full p-3 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="" className="bg-white dark:bg-slate-900">Select state/UT...</option>
                {["Andhra Pradesh","Assam","Bihar","Delhi (NCT)","Goa","Gujarat","Haryana","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"].map(s =>
                  <option key={s} value={s} className="bg-white dark:bg-slate-900">{s}</option>
                )}
              </select>
            </fieldset>
          )}
          {step === 3 && (
            <fieldset>
              <legend className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Which ID proof will you submit?</legend>
              <div className="space-y-2">
                {["Aadhaar Card","Passport","Driving License","PAN Card","Ration Card"].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border bg-slate-900/5 dark:bg-white/5 border-slate-900/5 dark:border-white/5 hover:bg-slate-900/10 dark:bg-white/10 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-orange-400">
                    <input type="radio" name="idproof" className="sr-only" /><div className="h-4 w-4 rounded-full border-2 border-slate-500" /><span className="text-sm text-slate-700 dark:text-slate-200">{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0}
          className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded px-2 py-1">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={handleNext}
          className="flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
          {step === STEPS.length - 1 ? "Check Eligibility" : "Next"}<ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
