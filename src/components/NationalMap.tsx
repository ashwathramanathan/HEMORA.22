"use client";

import { useState, useMemo, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker, Annotation } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { Navigation2, MapPin, CircleAlert as AlertCircle, Layers } from "lucide-react";
import { getRiskTier, stateRiskData, locations, getRiskLevelFromPct } from "@/lib/data";
import { PhaseEyebrow, CountUp } from "@/components/ui/primitives";

const INDIA_GEO_URL =
  "https://cdn.jsdelivr.net/gh/Subhash9325/GeoJson-Data-of-Indian-States@master/Indian_States";

interface NationalMapProps {
  onSelectState: (stateName: string) => void;
  onSelectLocation: (name: string) => void;
}

// Abbreviations keep small/eastern states legible at map scale
const SHORT_NAMES: Record<string, string> = {
  "Arunachal Pradesh": "Arunachal",
  "Himachal Pradesh": "Himachal",
  "Madhya Pradesh": "M.P.",
  "Uttar Pradesh": "U.P.",
  "Andhra Pradesh": "Andhra",
  "Jammu and Kashmir": "J&K",
  "Dadra and Nagar Haveli and Daman and Diu": "DNH & DD",
  "Andaman and Nicobar": "A&N",
  "Chhattisgarh": "Chhattisgarh",
  "Maharashtra": "Maharashtra",
};

// Curated high-signal city pins (subset of the 117 to avoid clutter)
const PIN_CITIES = [
  "Kanpur", "New Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru",
  "Hyderabad", "Ahmedabad", "Vapi", "Patna", "Ludhiana", "Vellore",
  "Visakhapatnam", "Jamshedpur", "Leh", "Kochi", "Shillong", "Guwahati",
];

export default function NationalMap({ onSelectState, onSelectLocation }: NationalMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

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

  const pins = useMemo(
    () => locations.filter((l) => PIN_CITIES.includes(l.location_name)),
    []
  );

  const tierCounts = useMemo(() => {
    const c = { Extreme: 0, Critical: 0, Moderate: 0, Good: 0 };
    for (const v of Object.values(stateRiskData)) c[getRiskLevelFromPct(v)]++;
    return c;
  }, []);

  return (
    <section id="phase-1" className="phase-section max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-9">
        <PhaseEyebrow icon={<Navigation2 className="w-3.5 h-3.5" />}>
          Phase 01 — National Intelligence Map
        </PhaseEyebrow>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 text-balance">
          India Water Quality <span className="gradient-text">Risk Atlas</span>
        </h2>
        <p className="text-muted max-w-2xl mx-auto text-sm sm:text-base text-pretty">
          A live geospatial index of surface-water contamination across every state and union
          territory. Hover a region for its severity, or tap a pulsing city node to open its full
          telemetry profile.
        </p>
      </div>

      <div className="glass-card p-4 sm:p-8 relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40 rounded-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Map */}
          <div className="relative flex items-center justify-center min-h-[420px] sm:min-h-[560px]">
            {hoveredTier && (
              <div
                className="absolute z-30 glass-card px-4 py-3 pointer-events-none min-w-[210px] hidden lg:block glow-ring"
                style={{ left: tooltipPos.x, top: tooltipPos.y }}
              >
                <div className="font-bold text-sm text-[rgb(var(--text))]">{hoveredTier.name}</div>
                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getRiskTier(hoveredTier.pct).color }}
                  />
                  <span className="text-muted">{getRiskTier(hoveredTier.pct).label}</span>
                </div>
                <div
                  className="text-2xl font-black mt-1 tabnum"
                  style={{ color: getRiskTier(hoveredTier.pct).color }}
                >
                  {hoveredTier.pct}%
                </div>
                <div className="text-[10px] text-accent font-bold mt-1.5 uppercase tracking-wider">
                  Click to analyze locations
                </div>
              </div>
            )}

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [82.8, 22.6], scale: 1020 }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={INDIA_GEO_URL}>
                {({ geographies }: { geographies: any[] }) => (
                  <>
                    {geographies.map((geo) => {
                      const name = getStateName(geo);
                      const pct = getStatePct(geo);
                      const tier = getRiskTier(pct);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          className="rssm-state"
                          fill={tier.color}
                          fillOpacity={0.82}
                          onMouseEnter={() => setHoveredState(name)}
                          onMouseLeave={() => setHoveredState(null)}
                          onMouseMove={(e) => {
                            const rect = (e.currentTarget.closest("svg") as SVGElement)?.getBoundingClientRect();
                            if (rect) {
                              setTooltipPos({
                                x: Math.min(e.clientX - rect.left + 12, rect.width - 230),
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
                    })}

                    {/* State name labels at polygon centroids */}
                    {geographies.map((geo) => {
                      const name = getStateName(geo);
                      const centroid = geoCentroid(geo);
                      const label = SHORT_NAMES[name] || name;
                      if (!centroid || Number.isNaN(centroid[0])) return null;
                      return (
                        <Marker key={`lbl-${geo.rsmKey}`} coordinates={centroid}>
                          <text
                            textAnchor="middle"
                            fontSize={6.4}
                            fontWeight={700}
                            className="pointer-events-none"
                            fill="rgba(255,255,255,0.82)"
                            style={{ paintOrder: "stroke", stroke: "rgba(3,10,20,0.75)", strokeWidth: 1.6 }}
                          >
                            {label}
                          </text>
                        </Marker>
                      );
                    })}
                  </>
                )}
              </Geographies>

              {/* Pulsing city pins */}
              {pins.map((loc) => {
                const tier = getRiskTier(loc.surface_water_pollution_pct);
                const active = hoveredPin === loc.location_name;
                return (
                  <Marker
                    key={loc.location_name}
                    coordinates={[loc.lng, loc.lat]}
                    onMouseEnter={() => setHoveredPin(loc.location_name)}
                    onMouseLeave={() => setHoveredPin(null)}
                    onClick={() => onSelectLocation(loc.location_name)}
                    style={{ default: { cursor: "pointer" } }}
                  >
                    {/* pulse ring */}
                    <circle r={9} fill={tier.color} opacity={0.25}>
                      <animate attributeName="r" from="5" to="14" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle
                      r={active ? 5 : 3.4}
                      fill={tier.color}
                      stroke="#030a14"
                      strokeWidth={1.2}
                      style={{ transition: "r 0.2s ease", filter: `drop-shadow(0 0 4px ${tier.color})` }}
                    />
                    {active && (
                      <Annotation subject={[loc.lng, loc.lat]} dx={0} dy={-16} connectorProps={{}}>
                        <g transform="translate(-42,-14)">
                          <rect width={84} height={18} rx={5} fill="rgb(3,10,20)" opacity={0.92} />
                          <text
                            x={42}
                            y={13}
                            textAnchor="middle"
                            fontSize={10}
                            fontWeight={700}
                            fill="#fff"
                          >
                            {loc.location_name}
                          </text>
                        </g>
                      </Annotation>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>

          {/* Legend + Stats sidebar */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-accent" />
                <h4 className="text-xs uppercase text-muted font-bold tracking-[0.15em]">
                  Risk Legend
                </h4>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Good", range: "< 20%", color: "#10b981", count: tierCounts.Good },
                  { label: "Moderate", range: "20-39%", color: "#f59e0b", count: tierCounts.Moderate },
                  { label: "Critical", range: "40-49%", color: "#ef4444", count: tierCounts.Critical },
                  { label: "Extreme", range: "50%+", color: "#a855f7", count: tierCounts.Extreme },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-md shrink-0"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}90` }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-[rgb(var(--text))]">{item.label}</div>
                      <div className="text-[11px] text-muted">{item.range} pollution</div>
                    </div>
                    <span className="text-xs font-black tabnum text-muted">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4 text-center">
                <div className="text-3xl font-black text-accent tabnum">
                  <CountUp value={117} />
                </div>
                <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">
                  Cities indexed
                </div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-3xl font-black text-accent tabnum">
                  <CountUp value={36} />
                </div>
                <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">
                  States &amp; UTs
                </div>
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-accent" />
                <h4 className="text-xs uppercase text-muted font-bold tracking-[0.15em]">
                  How to Use
                </h4>
              </div>
              <ol className="space-y-2.5 text-xs text-muted">
                <li className="flex gap-2.5">
                  <span className="text-accent font-black">01</span>
                  Hover a state for its pollution summary
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent font-black">02</span>
                  Tap a pulsing city node for instant telemetry
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent font-black">03</span>
                  Or click a state to search all its locations
                </li>
              </ol>
            </div>

            <div className="glass-card p-5 border-accent flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-accent shrink-0" />
              <div className="text-[11px] text-muted leading-snug">
                Node glow encodes severity. Purple &amp; red demand immediate remediation.
              </div>
            </div>
          </div>
        </div>

        {/* Mobile legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:hidden">
          {[
            { label: "Good <20%", color: "#10b981" },
            { label: "Moderate 20-39%", color: "#f59e0b" },
            { label: "Critical 40-49%", color: "#ef4444" },
            { label: "Extreme 50%+", color: "#a855f7" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs font-semibold">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
