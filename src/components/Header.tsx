"use client";

import { useState, useEffect } from "react";
import { Droplets, ChevronRight } from "lucide-react";

const STEPS = [
  { id: 1, label: "National Map" },
  { id: 2, label: "Location Search" },
  { id: 3, label: "Stats Dashboard" },
  { id: 4, label: "Remediation" },
];

export default function Header({ activePhase }: { activePhase: number }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToPhase = (phase: number) => {
    document.getElementById(`phase-${phase}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-900/90 backdrop-blur-xl border-b border-navy-700/60 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToPhase(1)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-blue-600 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Droplets className="w-5 h-5 text-navy-950" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-lg tracking-wider gradient-text">HEMORA</span>
            <span className="text-[9px] text-slate-500 font-medium tracking-wide hidden sm:block">
              Water Quality Intelligence
            </span>
          </div>
        </button>

        {/* Stepper */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1.5">
              <button
                onClick={() => scrollToPhase(step.id)}
                className={`nav-pill px-3 py-1.5 rounded-full font-bold transition-all ${
                  activePhase === step.id
                    ? "bg-teal-500 text-navy-950"
                    : activePhase > step.id
                    ? "bg-navy-700/60 text-teal-400 hover:bg-navy-700"
                    : "bg-navy-800/40 text-slate-500 hover:bg-navy-800"
                }`}
              >
                <span className="opacity-60 mr-1">{step.id}.</span>
                {step.label}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-600" />
              )}
            </div>
          ))}
        </nav>

        {/* Status pill */}
        <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1 rounded-full font-semibold whitespace-nowrap hidden sm:inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          Live Intelligence
        </span>
      </div>

      {/* Mobile stepper */}
      <div className="md:hidden flex items-center justify-center gap-1 pb-2.5 px-4 overflow-x-auto scrollbar-hide">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => scrollToPhase(step.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                activePhase === step.id
                  ? "bg-teal-500 text-navy-950"
                  : "bg-navy-800/40 text-slate-500"
              }`}
            >
              {step.id}. {step.label}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
          </div>
        ))}
      </div>
    </header>
  );
}
