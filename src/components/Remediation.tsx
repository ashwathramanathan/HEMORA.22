"use client";

import { useMemo } from "react";
import { Sparkles, Octagon as XOctagon, CircleCheck as CheckCircle2, Wrench, RotateCcw, ArrowRight, HeartPulse, Brain, ShieldCheck } from "lucide-react";
import { type LocationData } from "@/lib/data";

interface RemediationProps {
  location: LocationData | null;
  onReset: () => void;
}

const METAL_HEALTH_IMPACTS: Record<string, string[]> = {
  Chromium: [
    "Severe kidney and liver damage from hexavalent chromium bio-accumulation",
    "Skin ulcers, respiratory irritation, and increased lung cancer risk",
    "Groundwater unsuitable for infants — disrupts child cognitive development",
  ],
  Arsenic: [
    "Chronic arsenic poisoning leads to skin lesions and peripheral neuropathy",
    "Elevated risk of bladder, kidney, and skin cancers over long-term exposure",
    "Cardiovascular disease and diabetes linked to sustained arsenic intake",
  ],
  Lead: [
    "Irreversible neurological damage, especially in children under 6",
    "Hypertension, kidney dysfunction, and reproductive harm in adults",
    "Developmental delays and reduced IQ scores in exposed populations",
  ],
  Cadmium: [
    "Kidney tubular damage and bone demineralization (Itai-itai disease)",
    "Increased risk of osteoporosis and skeletal fragility",
    "Respiratory tract damage from inhalation of cadmium-laden particulates",
  ],
  Zinc: [
    "Gastrointestinal irritation and nausea from excessive zinc intake",
    "Copper deficiency induced by high zinc interfering with absorption",
    "Metal fume fever in industrial workers from zinc oxide exposure",
  ],
  Copper: [
    "Liver cirrhosis in extreme cases of copper overload",
    "Gastrointestinal distress including cramps and vomiting",
    "Wilson's disease-like symptoms in genetically susceptible individuals",
  ],
  Nickel: [
    "Allergic contact dermatitis and skin sensitization",
    "Respiratory tract inflammation and nasal sinus cancer risk",
    "Cardiovascular stress from chronic nickel accumulation",
  ],
};

const REMEDIATION_PROTOCOLS: Record<string, string> = {
  Chromium:
    "Strong Base Anion (SBA) Ion-Exchange Resin Bed paired with Dual-Stage Reverse Osmosis (RO) and Catalytic Carbon Pre-Treatment to reduce hexavalent Chromium (Cr-VI) to trivalent form, followed by precipitation and coagulation. Final polishing via electrocoagulation ensures discharge below 0.05 mg/L WHO limits.",
  Arsenic:
    "Activated Alumina Adsorption Bed with Iron-Oxide Coated Sand (IOCS) and Pre-Oxidation to convert As(III) to As(V), followed by coagulation-filtration. Multi-stage approach including nano-filtration for final polishing to achieve below 10 ppb compliance.",
  Lead:
    "Sub-micron Ultrafiltration combined with Thin-film Composite (TFC) Reverse Osmosis and Chelation softening to extract dissolved lead ions. Activated carbon post-treatment removes organic lead complexes. Point-of-use activated alumina filters for household-level protection.",
  Cadmium:
    "Chemical precipitation using sodium sulfide followed by Thin-film Composite Reverse Osmosis. Ion-exchange with chelating resins (iminodiacetic acid type) for selective cadmium removal. pH adjustment to 9.0+ optimizes precipitation efficiency.",
  Zinc:
    "Multi-media Sand Filtration with Activated Carbon Adsorption and chemical precipitation at elevated pH. Electrocoagulation using aluminum electrodes for dissolved zinc removal. Post-Remineralization restores beneficial trace minerals.",
  Copper:
    "Ion-Exchange with weak acid cation resins for selective copper capture, followed by microfiltration. Electrocoagulation and chemical precipitation using lime softening. Activated carbon polishing for organo-copper complexes.",
  Nickel:
    "Chelating Ion-Exchange Resin (iminodiacetic acid type) with Precipitation using sodium dimethyldithiocarbamate. Reverse Osmosis for dissolved nickel reduction. Electrocoagulation as a tertiary treatment step for discharge compliance.",
};

function getProtocol(metal: string): string {
  return REMEDIATION_PROTOCOLS[metal] || REMEDIATION_PROTOCOLS["Chromium"];
}

function getImpacts(metal: string): string[] {
  return METAL_HEALTH_IMPACTS[metal] || METAL_HEALTH_IMPACTS["Chromium"];
}

export default function Remediation({ location, onReset }: RemediationProps) {
  const impacts = useMemo(
    () => (location ? getImpacts(location.key_heavy_metal) : []),
    [location]
  );
  const protocol = useMemo(
    () => (location ? getProtocol(location.key_heavy_metal) : ""),
    [location]
  );

  if (!location) {
    return (
      <section id="phase-4" className="phase-section max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-card p-12 text-center">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400 mb-2">No remediation plan available</h3>
          <p className="text-sm text-slate-500">
            Select a location first to generate its remediation blueprint.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="phase-4" className="phase-section max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Phase 4 — Remediation Blueprint
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Life Transformation Plan: <span className="text-emerald-400">{location.location_name}</span>
        </h2>
        <p className="text-slate-400 text-sm">
          Current health risk vs. post-remediation outcomes, with prescribed engineering protocol
        </p>
      </div>

      <div className="glass-card p-5 sm:p-7 mb-6">
        {/* Before / After cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Current Risk */}
          <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider mb-5 relative">
              <XOctagon className="w-5 h-5" />
              Current Risk
            </div>
            <div className="text-xs text-slate-400 mb-4">
              Key contaminant: <span className="text-red-300 font-bold">{location.key_heavy_metal}</span>
            </div>
            <ul className="space-y-3">
              {impacts.map((impact, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  <span>{impact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Post Remediation */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider mb-5 relative">
              <CheckCircle2 className="w-5 h-5" />
              Post Remediation
            </div>
            <div className="text-xs text-slate-400 mb-4">
              Target: WHO safe water standards achieved
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-300">
                <HeartPulse className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <b className="text-emerald-400">92%+ reduction</b> in heavy metal toxicity,
                  bringing water to safe WHO consumption limits
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-300">
                <Brain className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  Eliminated neurotoxic risk — <b className="text-emerald-400">protects child cognitive
                  development</b> and long-term organ health
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  100% mineral-balanced, pathogen-free water restored for <b className="text-emerald-400">safe
                  community use</b> across all age groups
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Prescribed Protocol */}
        <div className="bg-navy-950/50 border border-navy-700/50 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-base mb-2">Prescribed Remediation Protocol</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{protocol}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["WHO Compliant", "Heavy Metal Removal", "Tertiary Treatment", "Community Scale"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-navy-950 font-bold px-8 py-3.5 rounded-full text-sm shadow-lg shadow-teal-500/20 hover:scale-105 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Search
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
