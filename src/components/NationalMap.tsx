"use client";

import { useState, useMemo, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Navigation2, MapPin, CircleAlert as AlertCircle } from "lucide-react";
import { getRiskTier, stateRiskData } from "@/lib/data";

const INDIA_GEO_URL =
  "https://cdn.jsdelivr.net/gh/Subhash9325/GeoJson-Data-of-Indian-States@master/Indian_States";

interface NationalMapProps {
  onSelectState: (stateName: string) => void;
}

export default function NationalMap({ onSelectState }: NationalMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getStatePct = useCallback((geo: any) => {
    const name = geo.properties.NAME_1 || geo.properties.st_nm || geo.properties.NAME || "";
    const normalized = name.replace(/\s+/g, " ").trim();
    if (stateRiskData[normalized] !== undefined) return stateRiskData[normalized];
    const partialKey = Object.keys(stateRiskData).find(
      (k) =>
        k.toLowerCase().includes(normalized.toLowerCase()) ||
        normalized.toLowerCase().includes(k.toLowerCase())
    );
    return partialKey ? stateRiskData[partialKey] : 15;
  }, []);

  const getStateName = (geo: any) =>
    geo.properties.NAME_1 || geo.properties.st_nm || geo.properties.NAME || "Unknown";

  const hoveredTier = useMemo(() => {
    if (!hoveredState) return null;
    const entry = Object.entries(stateRiskData).find(
      ([k]) =>
        k.toLowerCase().includes(hoveredState.toLowerCase()) ||
        hoveredState.toLowerCase().includes(k.toLowerCase())
    );
    return entry ? { name: entry[0], pct: entry[1] } : null;
  }, [hoveredState]);

  return (
    <section id="phase-1" className="phase-section max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Navigation2 className="w-3.5 h-3.5" />
          Phase 1 — National Intelligence Map
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
          India Water Quality <span className="gradient-text">Risk Atlas</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Color-coded geographic intelligence showing surface water pollution severity across all
          states and union territories. Click any state to begin a detailed location analysis.
        </p>
      </div>

      <div className="glass-card p-4 sm:p-8 relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30 rounded-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Map */}
          <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[520px]">
            {hoveredTier && (
              <div
                className="absolute z-30 glass-card px-4 py-3 pointer-events-none min-w-[200px] hidden lg:block"
                style={{ left: tooltipPos.x, top: tooltipPos.y }}
              >
                <div className="font-bold text-white text-sm">{hoveredTier.name}</div>
                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getRiskTier(hoveredTier.pct).color }}
                  />
                  <span className="text-slate-300">{getRiskTier(hoveredTier.pct).label}</span>
                </div>
                <div className="text-2xl font-black mt-1" style={{ color: getRiskTier(hoveredTier.pct).color }}>
                  {hoveredTier.pct}%
                </div>
                <div className="text-[10px] text-teal-400 font-bold mt-1.5">
                  Click to analyze locations
                </div>
              </div>
            )}

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                center: [82.8, 22.5],
                scale: 1000,
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={INDIA_GEO_URL}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo) => {
                    const name = getStateName(geo);
                    const pct = getStatePct(geo);
                    const tier = getRiskTier(pct);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className="rssm-state"
                        fill={tier.color}
                        onMouseEnter={() => setHoveredState(name)}
                        onMouseLeave={() => setHoveredState(null)}
                        onMouseMove={(e) => {
                          const rect = (e.currentTarget.closest("svg") as SVGElement)?.getBoundingClientRect();
                          if (rect) {
                            setTooltipPos({
                              x: Math.min(e.clientX - rect.left + 12, rect.width - 220),
                              y: e.clientY - rect.top + 12,
                            });
                          }
                        }}
                        onClick={() => onSelectState(name)}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", filter: "brightness(1.3)" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          {/* Legend + Stats sidebar */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-5">
              <h4 className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-4">
                Risk Legend
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Good", range: "< 20%", color: "#10b981" },
                  { label: "Moderate", range: "20-39%", color: "#d97706" },
                  { label: "Critical", range: "40-49%", color: "#ef4444" },
                  { label: "Extreme", range: "50%+", color: "#a855f7" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-md shrink-0"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.range} pollution</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-teal-400" />
                <h4 className="text-xs uppercase text-slate-400 font-bold tracking-wider">
                  How to Use
                </h4>
              </div>
              <ol className="space-y-2 text-xs text-slate-400">
                <li className="flex gap-2">
                  <span className="text-teal-400 font-bold">1.</span>
                  Hover over any state for pollution summary
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-400 font-bold">2.</span>
                  Click a state to jump to location search
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-400 font-bold">3.</span>
                  Scroll down or use nav to explore all phases
                </li>
              </ol>
            </div>

            <div className="glass-card p-5 border-teal-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Live Coverage
                </span>
              </div>
              <div className="text-3xl font-black text-white">36</div>
              <div className="text-xs text-slate-400">States & UTs mapped</div>
            </div>
          </div>
        </div>

        {/* Mobile legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:hidden">
          {[
            { label: "Good <20%", color: "#10b981" },
            { label: "Moderate 20-39%", color: "#d97706" },
            { label: "Critical 40-49%", color: "#ef4444" },
            { label: "Extreme 50%+", color: "#a855f7" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs font-semibold">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
