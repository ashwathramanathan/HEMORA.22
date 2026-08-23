"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import NationalMap from "@/components/NationalMap";
import LocationSearch from "@/components/LocationSearch";
import StatsDashboard from "@/components/StatsDashboard";
import Remediation from "@/components/Remediation";
import type { LocationData } from "@/lib/data";

export default function Home() {
  const [activePhase, setActivePhase] = useState(1);
  const [preselectedState, setPreselectedState] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const scrollToPhase = useCallback((phase: number) => {
    document.getElementById(`phase-${phase}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSelectState = (stateName: string) => {
    setPreselectedState(stateName);
    setTimeout(() => scrollToPhase(2), 100);
  };

  const handleSelectLocation = (location: LocationData) => {
    setSelectedLocation(location);
    setTimeout(() => scrollToPhase(3), 150);
  };

  const handleReset = () => {
    setSelectedLocation(null);
    setPreselectedState(null);
    scrollToPhase(1);
  };

  // Track active phase based on scroll position
  useEffect(() => {
    const onScroll = () => {
      const sections = [1, 2, 3, 4].map((n) => document.getElementById(`phase-${n}`));
      const scrollY = window.scrollY + 120;
      let current = 1;
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollY) {
          current = i + 1;
        }
      }
      setActivePhase(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Header activePhase={activePhase} />

        {/* Hero intro */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            National Water Quality Intelligence Platform
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-4 animate-slide-up">
            HEMORA
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-lg animate-slide-up">
            India&apos;s unified water contamination intelligence system — mapping heavy metal
            pollution, biochemical degradation, and remediation blueprints across every state and
            union territory.
          </p>
        </section>

        <NationalMap onSelectState={handleSelectState} />

        <div className="section-divider max-w-5xl mx-auto my-4" />

        <LocationSearch
          preselectedState={preselectedState}
          onSelectLocation={handleSelectLocation}
          clearPreselect={() => setPreselectedState(null)}
        />

        <div className="section-divider max-w-5xl mx-auto my-4" />

        <StatsDashboard location={selectedLocation} />

        <div className="section-divider max-w-5xl mx-auto my-4" />

        <Remediation location={selectedLocation} onReset={handleReset} />

        {/* Footer */}
        <footer className="border-t border-navy-700/40 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center">
            <p className="text-xs text-slate-500">
              HEMORA · National Water Quality Intelligence Platform · Data is illustrative and for
              demonstration purposes
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
