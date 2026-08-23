"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, MapPin, CircleAlert as AlertCircle, ArrowRight } from "lucide-react";
import { locations, getRiskTier, type LocationData } from "@/lib/data";

interface LocationSearchProps {
  preselectedState: string | null;
  onSelectLocation: (location: LocationData) => void;
  clearPreselect: () => void;
}

export default function LocationSearch({
  preselectedState,
  onSelectLocation,
  clearPreselect,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LocationData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preselectedState) {
      setQuery(preselectedState);
      clearPreselect();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [preselectedState, clearPreselect]);

  const results = useMemo(() => {
    if (!query.trim()) return locations;
    const q = query.toLowerCase().trim();
    return locations.filter(
      (loc) =>
        loc.location_name.toLowerCase().includes(q) ||
        loc.state_ut.toLowerCase().includes(q) ||
        loc.location_type.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (loc: LocationData) => {
    setSelected(loc);
    onSelectLocation(loc);
  };

  return (
    <section id="phase-2" className="phase-section max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Search className="w-3.5 h-3.5" />
          Phase 2 — Location Search
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
          Search Verified <span className="gradient-text">Water Quality Data</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Filter across our telemetry database by city, state, or location type. Select a result to
          view its full contamination profile.
        </p>
      </div>

      <div className="glass-card p-5 sm:p-7">
        {/* Search bar */}
        <div className="relative mb-5">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, state, or type (e.g. Kanpur, Karnataka, Industrial)..."
            className="w-full bg-navy-950/60 border border-navy-700 rounded-2xl pl-12 pr-4 py-3.5 text-base focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 text-white placeholder-slate-500 transition"
          />
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-2 flex-wrap mb-5 text-xs">
          <span className="text-slate-500 font-medium">Quick picks:</span>
          {locations.map((loc) => {
            const tier = getRiskTier(loc.surface_water_pollution_pct);
            return (
              <button
                key={loc.location_name}
                onClick={() => setQuery(loc.location_name)}
                className="px-2.5 py-1 rounded-lg bg-navy-800/80 hover:bg-navy-700 text-slate-300 hover:text-white transition border border-navy-700"
              >
                {loc.location_name}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-300 font-semibold text-sm">No matching locations found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try a different city, state, or location type.
            </p>
          </div>
        ) : (
          <>
            <div className="text-xs text-slate-500 mb-3">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((loc) => {
                const tier = getRiskTier(loc.surface_water_pollution_pct);
                const isSelected = selected?.location_name === loc.location_name;
                return (
                  <button
                    key={loc.location_name}
                    onClick={() => handleSelect(loc)}
                    className={`glass-card glass-card-hover p-5 text-left relative overflow-hidden ${
                      isSelected ? "border-teal-400/60 ring-2 ring-teal-500/20" : ""
                    }`}
                  >
                    <div
                      className="absolute top-0 left-0 w-1 h-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="text-lg font-bold text-white">{loc.location_name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {loc.state_ut} · {loc.city_type}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border whitespace-nowrap ${tier.badgeClass}`}
                      >
                        {tier.shortLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-navy-950/40 rounded-lg px-3 py-2">
                        <div className="text-slate-500 text-[10px] uppercase">Surface</div>
                        <div className={`font-black text-sm ${tier.textColor}`}>
                          {loc.surface_water_pollution_pct}%
                        </div>
                      </div>
                      <div className="bg-navy-950/40 rounded-lg px-3 py-2">
                        <div className="text-slate-500 text-[10px] uppercase">Groundwater</div>
                        <div className={`font-black text-sm ${tier.textColor}`}>
                          {loc.groundwater_pollution_pct}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-700/50">
                      <span className="text-[11px] text-slate-400">
                        Key metal: <span className="text-white font-semibold">{loc.key_heavy_metal}</span>
                      </span>
                      <span className="text-teal-400 text-xs font-bold flex items-center gap-1">
                        {isSelected ? "Selected" : "Select"}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
